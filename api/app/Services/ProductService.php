<?php

namespace App\Services;

use App\Repositories\Contracts\ProductRepositoriesInterface;
use App\Utils\CodeGenerator;
use App\Models\Product as Product;
use App\Models\productVariant as ProductVariant;
use App\Repositories\Contracts\CategoriesRepositoriesInterface;
use Illuminate\Database\Eloquent\Builder;
use  Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Cloudinary\Cloudinary;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class ProductService
{

    private $cloudinary;
    public function __construct(protected ProductRepositoriesInterface $productRepo, protected CategoriesRepositoriesInterface $cateRepo){
        $this->cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => config('services.cloudinary.cloud_name'),
                'api_key' => config('services.cloudinary.api_key'),
                'api_secret' => config('services.cloudinary.api_secret'),
            ]
        ]);
    }

    /**
     * Validate uploaded image
     */
    private function validateImage(UploadedFile $file)
    {
        if ($file->getError() !== UPLOAD_ERR_OK) {
            throw new Exception('File upload error: ' . $file->getErrorMessage());
        }

        $allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
        if (!in_array($file->getMimeType(), $allowedMimes)) {
            throw new Exception('Invalid file type. Only JPEG, PNG, JPG, GIF, WEBP allowed.');
        }

        $maxSize = 5 * 1024 * 1024; // 5MB
        if ($file->getSize() > $maxSize) {
            throw new Exception('File size must be less than 5MB. Current: ' . round($file->getSize() / 1024 / 1024, 2) . 'MB');
        }

        return true;
    }
    public function createProduct(array $data)
    {

        DB::beginTransaction();
        try {
            // 1. Khởi tạo mảng dữ liệu sản phẩm (Chưa gán thumbnail ngay)
            $productAttri = [
                'name' => $data['name'],
                'price' => $data['price'],
                'discount_percentage' => $data['discount_percentage'] ?? 0,
                'description' => $data['description'] ?? null,
                'is_active' => 1,
                'is_featured' => $data['is_featured'] ?? false, // Sửa lỗi chính tả key của bạn
            ];
          
            // 2. Xử lý upload Thumbnail Sản phẩm chính
            if (isset($data['thumbnail']) && $data['thumbnail'] instanceof UploadedFile) {
                $file = $data['thumbnail'];
                $this->validateImage($file);

                $uploadResult = $this->cloudinary->uploadApi()->upload(
                    $file->getRealPath(),
                    ['folder' => 'products', 'resource_type' => 'image', 'overwrite' => true]
                );

                // Gán URL và ID sau khi upload thành công vào mảng attributes
                $productAttri['thumbnail'] = $uploadResult['secure_url'];

           
                $productAttri['thumbnail_public_id'] = $uploadResult['public_id'];
            }

            // 3. Tạo sản phẩm (Lúc này $productAttri chỉ chứa các chuỗi/số, không còn Object File)
            $product = $this->productRepo->create($productAttri);

            // 4. Gắn danh mục
            if (!empty($data['category_ids'])) {
                $product->categories()->attach($data['category_ids']);
            }

            // 5. Xử lý Biến thể (Variants)
            if (!empty($data['variants'])) {
                foreach ($data['variants'] as $variantData) {
                    $variantData['product_id'] = $product->id;
                    $variantData['sku'] = CodeGenerator::geneerateSku();

                    // Kiểm tra xem image_url gửi lên có phải là FILE thật không
                    if (isset($variantData['image_url']) ) {
                        $file = $variantData['image_url'];

                        // Chỉ thực hiện upload nếu đúng là file
                        if ($file instanceof \Illuminate\Http\UploadedFile) {
                            $this->validateImage($file);
                            $uploadResult = $this->cloudinary->uploadApi()->upload($file->getRealPath(), [
                                'folder' => 'variants'
                            ]);

                            // Gán lại là chuỗi URL (String)
                            $variantData['image_url'] = $uploadResult['secure_url'];
                        }
                    } else {
                        // Nếu không có file gửi lên, đảm bảo nó là null để không lỗi "Array to string"
                        $variantData['image_url'] = null;
                    }

                    // Quan trọng: Nếu variantData vẫn còn chứa image_url dưới dạng mảng/object rỗng
                    // thì phải ép kiểu nó về null hoặc string rỗng
                    if (is_array($variantData['image_url'])) {
                        $variantData['image_url'] = null;
                    }

                    $this->productRepo->createProductVariant($variantData);
                }
            }

            DB::commit();

            return [
                'success' => true,
                'message' => "Thêm sản phẩm thành công",
                'data' => $product
            ];
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Create Product Failed: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Lỗi: ' . $e->getMessage()
            ];
        }
    }

    public function getProducts(array $filters)
    {
        try{
            $query = Product::query();

            // Tìm kiếm
            if (!empty($filters['search'])) {
                $query->where('name', 'LIKE', "%{$filters['search']}%");
            }

            if (!empty($filters['type'])) {
                match ($filters['type']) {
                    'hot' => $query->where('is_featured', 1),
                    'deal' => $query->where('discount_percentage', '>', 30),
                    'whitelist', 'online' => null,  // No filter or customize
                    default => null,
                };
            }

            if (!empty($filters['priceMax'])) {
                
                $query->where('price', '<=', (float) $filters['priceMax']);
            }

            // Lọc MÀU SẮC (qua variant)
            if (!empty($filters['color']) && strtolower(trim($filters['color'])) !== 'null') {
        
                $colorValue = trim($filters['color']);
                $query->whereHas('productVariants', function ($q) use ($colorValue) {
                    $q->whereRaw('LOWER(color) = ?', [strtolower($colorValue)]);
                    $q->where('stock_quantity', '>', 0); // chỉ variant còn hàng
                });
            }

            // Lọc category
            if (!empty($filters['child_category'])) {
                $categoryFilter = (array) $filters['category'];
                $query->whereHas('categories', fn($q) => $q->whereIn('slug',  $categoryFilter));
            }

            // Lọc CATEGORY + tất cả sub-category (đệ quy) - giữ nguyên code cũ của bạn
            if (!empty($filters['category'])) {
                $categorySlugs = $filters['category'];
                $allCategorySlugs = $this->cateRepo->findBySlug($categorySlugs);

                $query->whereHas('categories', function ($q) use ($allCategorySlugs) {
                    $q->whereIn('slug', $allCategorySlugs);
                });
            }

            // Sort
            $sort = $filters['sort'] ?? 'newest';
            match ($sort) {
                'price_desc' => $query->orderBy('price', 'desc'),
                'price_asc'  => $query->orderBy('price', 'asc'),
                'name_asc'   => $query->orderBy('name', 'asc'),
                'name_desc'  => $query->orderBy('name', 'desc'),
                'oldest'     => $query->orderBy('created_at', 'asc'),
                default      => $query->orderBy('created_at', 'desc'),
            };

            $query->where('is_active', true);

            // CHỈ load categories (để hiển thị tag/breadcrumb)
            // KHÔNG load variants ở listing → tối ưu cực tốt
            $query->with(['categories' => fn($q) => $q->select('categories.id', 'name', 'slug')]);

            // Chỉ select những field cần thiết cho listing
            $query->select([
                'id',
                'slug',
                'name',
                'thumbnail',
                'price',
                'discount_percentage',
                'is_featured',
                'created_at'
            ]);


            $result =  $query->paginate($filters['page'] ?? 15);

            return [
                'success' => true,
                'message' => "Tìm kiếm  sản phẩm thành công",
                'data' => $result
            ];
          
        }catch(Exception $e) {

            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }
    public function getProductDetail(string $slug)
    {
        try {
            $result = Product::with([
                'categories' => fn($q) => $q->select('categories.id', 'name', 'slug'),
                'productVariants' => fn($q) => $q->where('is_active', true)  // ← SỬA TÊN
                    ->select('id', 'product_id', 'sku', 'color', 'size', 'sale_price', 'stock_quantity', 'image_url')
            ])
                ->select('id', 'slug', 'name', 'thumbnail', 'price', 'discount_percentage', 'description', 'is_active')
                ->where('slug', $slug)
                ->where('is_active', true)
                ->firstOrFail();

            return [
                'success' => true,
                'message' => "Tìm kiếm sản phẩm thành công",
                'data' => $result
            ];
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return [
                'success' => false,
                'message' => "Không tìm thấy sản phẩm",
            ];
        } catch (\Exception $e) {
           

            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    public function getProductByCategories(){

    }

    public function updateProduct(Product $product, array $data)
    {
        DB::beginTransaction();

        try {
            // BƯỚC 1: Cập nhật thông tin cơ bản của Sản phẩm
            $productData = collect($data)->except(['variants', 'category_ids'])->toArray();
            $product->update($productData);

            if (isset($data['category_ids'])) {
                // Phương thức sync() xóa id không nằm trong list
                $product->categories()->sync($data['category_ids']);
            }

            if (isset($data['variants'])) {
                $this->syncProductVariants($product, $data['variants']);
            }

            DB::commit();

            $result =  $product->load(['categories:id,name,slug', 'productVariant']);
            return [
                'sccuess' => false,
                'message' => 'Cập nhật sản phẩm thành công',
                'data' => $result
            ];
        } catch (\Exception $e) {
        
            DB::rollBack();
            return [
                'sccuess' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    protected function syncProductVariants(Product $product, array $variantsData): void
    {

        // lấy id ủa các variant truyền vào
        $currentVariantIds = $product->product_variants()->pluck('id')->toArray();
        $incomingVariantIds = [];

        foreach ($variantsData as $variantData) {
            // Lấy ID của variant từ dữ liệu gửi lên
            $variantId = $variantData['id'] ?? null;

            // Loại bỏ ID khi update
            $variantAttributes = collect($variantData)->except('id')->toArray();

            if ($variantId && in_array($variantId, $currentVariantIds)) {
                // case 1: variant tồn tại , tiến hành update
                $variant = ProductVariant::find($variantId);
             
                if ($variant) {
                    $variant->updateOrCreate(
                      ['id' =>  $variantId ],
                        $variantAttributes
                    );
                    $incomingVariantIds[] = $variantId; // Đánh dấu variant này đã được xử lý
                }

            
            } else {
                // case 2: variant chưa tồn tại , tạo mới
                $newVariant = $product->product_variants()->create($variantAttributes);
                $incomingVariantIds[] = $newVariant->id; // Lưu ID variant mới
            }
        }

        // C. XÓA BỎ (DELETE): Tìm các variants cũ không còn trong danh sách mới
        $variantsToDelete = array_diff($currentVariantIds, $incomingVariantIds);

        if (!empty($variantsToDelete)) {
            // Xóa tất cả variants không còn được gửi lên
            ProductVariant::whereIn('id', $variantsToDelete)->delete();
        }
    }

    public function deleteProduct(int $id){
       try {
            $result = $this->productRepo->delete($id);
            return [
                'sccuess' => $result,
                'message' => 'Xóa sản phẩm thành công',
            ];
       }catch(Exception $e) {
            return [
                'sccuess' => false,
                'message' => $e->getMessage(),
              
            ];
       }
    }

    public function countProducts(){
        try {
            $count = $this->productRepo->countProducts();
           return $count;
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

}
    

