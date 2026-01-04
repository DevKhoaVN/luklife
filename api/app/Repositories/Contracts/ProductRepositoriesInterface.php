<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\products as Product;

interface ProductRepositoriesInterface
{
    /**
     * Lấy tất cả sản phẩm (collection, thường dùng cho admin hoặc export)
     */
    public function all(int $page = 1, array $columns = ['*']);

    /**
     * Lấy danh sách sản phẩm có phân trang (frontend/admin list)
     */
    public function paginate(int $perPage = 15, array $columns = ['*']);

    /**
     * Tìm sản phẩm theo ID
     */
    public function findById(int $id, array $columns = ['*']);

    /**
     * Tìm sản phẩm theo slug (dùng cho chi tiết sản phẩm)
     */
    public function findBySlug(string $slug, array $columns = ['*']);

    /**
     * Sync (đồng bộ) categories – xóa cũ, thêm mới (phổ biến nhất khi edit)
     */
    // public function syncCategories(int $productId, array $categoryIds);

    /**
     * Tạo sản phẩm mới
     */
    public function create(array $data);

    /**
     * Cập nhật sản phẩm theo ID
     */
    public function update(int $id, array $data);

    /**
     * Xóa sản phẩm theo ID (hard delete hoặc soft delete tùy model)
     */
    public function delete(int $id);

    /**
     * Lấy sản phẩm nổi bật (is_featured = true)
     */
    public function getFeatured(int $limit = 10);

    /**
     * Tìm kiếm sản phẩm bằng fulltext (name + description)
     */
    public function search(string $query, int $page);

    public function getAll();
}
