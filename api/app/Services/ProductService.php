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

            $productAttri = [
                'thumbnail' => $data['thumbnail'],
                'name' => $data['name'],
                'price' => $data['price'],
                'discount_percentage' => $data['discount_percentage'] ?? 0,
                'description' => $data['description'] ?? null,
                'is_active' => 1,
                "is_featured" => $data['descris_featurediption'] ?? false,
            ];

            $product = $this->productRepo->create($productAttri);
            

            if (!empty($data['category_ids'])) {
                $product->categories()->attach($data['category_ids']);
            }

            if (!empty($data['variants'])) {
                foreach ($data['variants'] as $variantData) {
                    $variantData['product_id'] = $product->id;
                    $variantData['sku'] = CodeGenerator::geneerateSku();
                    $this->productRepo->createProductVariant($variantData);
                }
            }

             DB::commit();
           

            return [
                'sccuess' => true,
                'message' => "Thêm sản phẩm thành công",
                'data' => $product
            ];
        } catch (Exception $e) {

            DB::rollBack();
            return [
                'sccuess' => false,
                'message' => $e->getMessage()
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
                'sccuess' => true,
                'message' => "Tìm kiếm  sản phẩm thành công",
                'data' => $result
            ];
          
        }catch(Exception $e) {

            return [
                'sccuess' => false,
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
                    ->select('id','product_id', 'sku', 'color', 'size', 'sale_price', 'stock_quantity', 'image_url')
            ])
                ->select('id', 'slug', 'name', 'thumbnail', 'price', 'discount_percentage', 'description', 'is_active')
                ->where('slug', $slug)
                ->where('is_active', true)
                ->firstOrFail();

            return [
                'sccuess' => true,
                'message' => "Tìm kiếm  sản phẩm thành công",
                'data' => $result
            ];

        }catch(Exception $e)
        {
            return [
                'sccuess' => false,
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

}
    

