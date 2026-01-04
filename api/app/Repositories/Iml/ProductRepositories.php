<?php

namespace App\Repositories\Iml;
use App\Repositories\Contracts\ProductRepositoriesInterface;
use App\Models\products as Product;
use App\Models\product_variants as ProductVartiant;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Arr;

class ProductRepositories implements ProductRepositoriesInterface
{

    protected Product $product;
    protected ProductVartiant $product_variant;
    protected const PER_PAGE = 30;
    protected const IMAGE_PATH = 'public/products';

    public function __construct(Product $product,ProductVartiant $product_variant)
    {
        $this->product = $product;
        $this->product_variant = $product_variant;
    }

    /**
     * Lấy tất cả sản phẩm (collection, thường dùng cho admin hoặc export)
     */
    public function all(int $page = 1, array $columns = ['*']){

        return $this->product
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE, $columns, 'page', $page);
    }
    /**
     * Lấy danh sách sản phẩm có phân trang (frontend/admin list)
     */
    public function paginate(int $page = 15, array $columns = ['*']){
        return $this->product
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE, $columns, 'page', $page);
    }

    /**
     * Tìm sản phẩm theo ID
     */
    public function findById(int $id, array $columns = ['*']){
        return $this->product
            ->select($columns)
            ->where('is_active', true)
            ->find($id);
    }

    /**
     * Tìm sản phẩm theo slug (dùng cho chi tiết sản phẩm)
     */
    public function findBySlug(string $slug, array $columns = ['*']){
        return $this->product
            ->select($columns)
            ->where('slug', $slug)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Sync (đồng bộ) categories – xóa cũ, thêm mới (phổ biến nhất khi edit)
     */
    public function syncCategories(int $productId, array $categoryIds){
        $product = $this->product->findOrFail($productId);
        $product->categories()->sync($categoryIds);
    }
    
    /**
     * Tạo sản phẩm mới
     */
    public function create(array $data)
    {
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $path = Storage::putFile(self::IMAGE_PATH, $data['image']); // trả về path [web:120]
            $data['thumbnail'] = str_replace('public/', '', $path);
        }
        
        
        return $this->product::create($data);
    }

    /**
     * Cập nhật sản phẩm theo ID
     */
    public function update(int $id, array $data){
        // Xử lý upload thumbnail
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $uploadedFile = $data['image'];

            $path = Storage::putFile(self::IMAGE_PATH, $uploadedFile);

            $fileName = str_replace('public/', '', $path);

            $data['thumbnail'] = $fileName;

            $data = Arr::except($data, ['image']);
        }
        // Tạo sản phẩm
        $product = $this->product->findOrFail($id);

        $result =  $product->update($data);
        // Đồng bộ lại categories
        $this->product->syncCategories($id, $data['categoryId']);

        return $result;
    }

    /**
     * Xóa sản phẩm theo ID (hard delete hoặc soft delete tùy model)
     */
    public function delete(int $id){
        $product = $this->product->findOrFail($id);

        $product->update(['is_active' => false]);

        return true;
    }

    /**
     * Lấy sản phẩm nổi bật (is_featured = true)
     */
    public function getFeatured(int $limit = 10){
        return $this->product
            ->where('is_active', true)
            ->where('is_featured', true)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Tìm kiếm sản phẩm bằng fulltext (name + description)
     */
    public function search(string $query, int $page){

        return $this->product->newQuery()
            ->where('is_active', true)
            ->whereFullText(['name', 'description'], $query)
            ->orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE, ['*'], 'page', $page);
    }

    public function createProductVariant(array $data){
      return $this->product_variant::create($data);
    }

}

