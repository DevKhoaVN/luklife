<?php

namespace App\Repositories\Iml;

use App\Repositories\Contracts\ProductRepositoriesInterface;
use App\Models\products as Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class ProductRepositories implements ProductRepositoriesInterface
{
    protected Product $product;
    protected const PER_PAGE = 30;
    // Đây là thư mục trong storage/app/public/products
    protected const IMAGE_PATH = 'public/products';

    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    public function all(int $page = 1, array $columns = ['*'])
    {
        return $this->product
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE, $columns, 'page', $page);
    }

    public function paginate(int $page = 15, array $columns = ['*'])
    {
        return $this->product
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE, $columns, 'page', $page);
    }

    public function findById(int $id, array $columns = ['*'])
    {
        return $this->product
            ->select($columns)
            // ->where('is_active', true) // Tạm bỏ cái này để admin vẫn sửa được sp đang ẩn
            ->find($id);
    }

    public function findBySlug(string $slug, array $columns = ['*'])
    {
        return $this->product
            ->select($columns)
            ->where('slug', $slug)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Hàm xử lý upload ảnh (Dùng chung cho cả Create và Update)
     */
    protected function handleUploadImage($file)
    {
        // 1. Lưu file vào storage/app/public/products
        $path = $file->store(self::IMAGE_PATH);

        // 2. Trả về đường dẫn để lưu DB (bỏ chữ public/ đi)
        // Kết quả sẽ là: products/ten-anh.jpg
        return str_replace('public/', '', $path);
    }

    public function create(array $data): Product
    {
        // Xử lý ảnh nếu có
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $data['thumbnail'] = $this->handleUploadImage($data['image']);
        }

        // Loại bỏ các trường không có trong bảng products
        // Lưu ý: Service đã lọc variants và category_ids rồi, ở đây lọc thêm image thôi
        $payload = Arr::except($data, ['image', 'categoryIds', 'variants']);

        $newProduct = $this->product->create($payload);

        return $newProduct;
    }

    /**
     * Cập nhật sản phẩm
     * (Phần này đã fix lỗi Undefined array key)
     */
    public function update(int $id, array $data)
    {
        $product = $this->product->find($id);

        if (!$product) return false;

        // 1. Xử lý ảnh (Nếu người dùng có gửi ảnh mới lên)
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            // (Tùy chọn) Xóa ảnh cũ đi cho đỡ rác server
            if ($product->thumbnail && Storage::exists('public/' . $product->thumbnail)) {
                Storage::delete('public/' . $product->thumbnail);
            }

            // Upload ảnh mới
            $data['thumbnail'] = $this->handleUploadImage($data['image']);
        }

        // 2. Lọc bỏ dữ liệu thừa trước khi update
        // Service đã lọc variants, category_ids. Ta lọc nốt 'image'
        $updateData = Arr::except($data, ['image', 'variants', 'category_ids', 'categoryIds']);

        // 3. Thực hiện Update
        return $product->update($updateData);
    }

    public function delete(int $id)
    {
        $product = $this->product->findOrFail($id);
        return $product->delete();
    }

    public function getFeatured(int $limit = 10)
    {
        return $this->product
            ->where('is_active', true)
            ->where('is_featured', true)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function search(string $query, int $page)
    {
        return $this->product->newQuery()
            ->where('is_active', true)
            ->whereFullText(['name', 'description'], $query)
            ->orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE, ['*'], 'page', $page);
    }

    public function getAll()
    {
        return $this->product->with(['variants', 'categories'])
            ->latest()
            ->paginate(10);
    }
}
