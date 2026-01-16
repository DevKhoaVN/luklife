<?php

namespace App\Services;

use App\Repositories\Contracts\ProductRepositoriesInterface;
use App\Utils\CodeGenerator;
use App\Models\products as Product;
use App\Models\product_variants as ProductVariant;
use Illuminate\Database\Eloquent\Builder;
use  Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Exception;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProductService
{

    protected $productRepo;

    public function __construct(ProductRepositoriesInterface $productRepo)
    {
        $this->productRepo = $productRepo;
    }
    public function createProduct(array $data)
    {
        DB::beginTransaction();

        try {
            // --- 1. XỬ LÝ UPLOAD THUMBNAIL (ẢNH ĐẠI DIỆN) ---
            // Kiểm tra nếu có gửi file thumbnail lên thì upload
            if (isset($data['thumbnail']) && $data['thumbnail'] instanceof \Illuminate\Http\UploadedFile) {
                // Lưu vào storage/app/public/products
                $path = $data['thumbnail']->store('public/products');
                // Chuyển đổi đường dẫn: public/products/abc.jpg -> storage/products/abc.jpg
                $data['thumbnail'] = str_replace('public/', 'storage/', $path);
            }

            // --- 2. CHUẨN BỊ DỮ LIỆU ĐỂ LƯU VÀO BẢNG PRODUCTS ---
            $productAttri = [
                'thumbnail'           => $data['thumbnail'] ?? null, // Lưu đường dẫn string
                'name'                => $data['name'],
                'price'               => $data['price'],
                'discount_percentage' => $data['discount_percentage'] ?? 0,
                'description'         => $data['description'] ?? null,
                'is_active'           => $data['is_active'] ?? 1, // Mặc định là 1 (Active)
                'is_featured'         => $data['is_featured'] ?? 0, // Sửa lỗi chính tả ở đây
            ];

            // Tạo sản phẩm
            $product = $this->productRepo->create($productAttri);

            // --- 3. XỬ LÝ UPLOAD THƯ VIỆN ẢNH (GALLERY) ---
            // Nếu có gửi mảng ảnh 'images'
            if (isset($data['images']) && is_array($data['images'])) {
                $this->uploadImages($product, $data['images']);
            }

            // --- 4. LIÊN KẾT DANH MỤC (CATEGORIES) ---
            if (!empty($data['category_ids'])) {
                $product->categories()->attach($data['category_ids']);
            }

            // --- 5. TẠO BIẾN THỂ (VARIANTS) ---
            if (!empty($data['variants'])) {
                foreach ($data['variants'] as $variantData) {
                    $variantData['product_id'] = $product->id;
                    // Đảm bảo class CodeGenerator có hàm generateSku (bạn check lại chính tả hàm này nhé)
                    $variantData['sku'] = CodeGenerator::generateSku();
                    $this->productRepo->createProductVariant($variantData);
                }
            }

            DB::commit();

            return [
                'success' => true,
                'message' => "Thêm sản phẩm thành công",
                'data'    => $product->load(['images', 'variants']) // Trả về kèm ảnh và biến thể để check luôn
            ];
        } catch (Exception $e) {
            DB::rollBack();

            // Ghi log lỗi để debug nếu cần
            Log::error("Lỗi tạo sản phẩm: " . $e->getMessage());

            return [
                'success' => false,
                'message' => 'Lỗi hệ thống: ' . $e->getMessage()
            ];
        }
    }

    public function getProducts(array $filters)
    {
        try {
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
            // Lọc category
            if (!empty($filters['category'])) {
                $query->whereHas('categories', fn($q) => $q->whereIn('slug', $filters['category']));
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
        } catch (Exception $e) {

            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }
    public function getProductDetail(string $slug)
    {

        try {
            $result =  Product::with([
                'categories' => fn($q) => $q->select('categories.id', 'name', 'slug'),
                'product_variants' => fn($q) => $q->where('is_active', true) // chỉ lấy variant active
                    ->select('id', 'product_id', 'sku', 'color', 'size', 'sale_price', 'stock_quantity', 'image_url')
            ])
                ->select('id', 'slug', 'name', 'thumbnail', 'price', 'discount_percentage', 'description', 'is_active')
                ->where('slug', $slug)
                ->where('is_active', true)
                ->firstOrFail();

            return [
                'success' => true,
                'message' => "Tìm kiếm  sản phẩm thành công",
                'data' => $result
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
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

            $result =  $product->load(['categories:id,name,slug', 'product_variants']);
            return [
                'success' => false,
                'message' => 'Cập nhật sản phẩm thành công',
                'data' => $result
            ];
        } catch (\Exception $e) {

            DB::rollBack();
            return [
                'success' => false,
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
                        ['id' =>  $variantId],
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

    public function deleteProduct(int $id)
    {
        try {
            $result = $this->productRepo->delete($id);
            return [
                'success' => $result,
                'message' => 'Xóa sản phẩm thành công',
            ];
        } catch (Exception $e) {
            return [
                'succcess' => false,
                'message' => $e->getMessage(),

            ];
        }
    }
    /**
     * Hàm hỗ trợ upload danh sách ảnh cho sản phẩm
     * @param $product: Đối tượng sản phẩm vừa tạo
     * @param $images: Danh sách file ảnh gửi lên từ request
     */
    public function uploadImages($product, $images)
    {
        // 1. Kiểm tra xem có ảnh không
        if (!$images || !is_array($images)) {
            return;
        }

        // 2. Duyệt qua từng file ảnh một
        foreach ($images as $key => $image) {

            // Đặt tên file (ví dụ: product_1_1705392.jpg) để tránh trùng tên
            $fileName = 'product_' . $product->id . '_' . time() . '_' . $key . '.' . $image->getClientOriginalExtension();

            // Lưu file vào thư mục 'public/products'
            // Kết quả trả về đường dẫn, ví dụ: 'storage/products/abc.jpg'
            $path = $image->storeAs('public/products', $fileName);

            // Sửa lại đường dẫn để lưu vào DB (bỏ chữ public/ đi thay bằng storage/)
            $dbPath = str_replace('public/', 'storage/', $path);

            // 3. Tạo dữ liệu vào bảng product_images thông qua quan hệ images()
            $product->images()->create([
                'image_url' => $dbPath,
                'position'  => $key,          // Ảnh đầu tiên số 0, ảnh sau số 1...
                'is_thumbnail' => $key === 0, // Ảnh đầu tiên mặc định là ảnh đại diện
            ]);
        }
    }
}
