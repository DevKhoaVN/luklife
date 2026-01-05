<?php

namespace App\Services;

use Exception;
use App\Repositories\Contracts\CategoriesRepositoriesInterface;

class CategoriesService
{
    protected CategoriesRepositoriesInterface $categoryRepo;

    public function __construct(CategoriesRepositoriesInterface $categoryRepo)
    {
        $this->categoryRepo = $categoryRepo;
    }

    public function getAllCategories()
    {
        try {
            $categories = $this->categoryRepo->paginate(20);

            return [
                'success' => true,
                'message' => "Lấy danh sách danh mục thành công",
                'data'    => $categories
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function store(array $data)
    {
        try {
            $category = $this->categoryRepo->create($data);

            return [
                'success' => true,
                'message' => "Tạo danh mục thành công",
                'data'    => $category
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => "Lỗi tạo danh mục: " . $e->getMessage()
            ];
        }
    }

    public function update(int $id, array $data)
    {
        try {
            $status = $this->categoryRepo->update($id, $data);

            if (!$status) {
                throw new Exception("Không tìm thấy danh mục hoặc cập nhật thất bại.");
            }

            return [
                'success' => true,
                'message' => "Cập nhật danh mục thành công"
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function delete(int $id)
    {
        try {
            $status = $this->categoryRepo->delete($id);

            if (!$status) {
                throw new Exception("Không tìm thấy danh mục để xóa.");
            }

            return [
                'success' => true,
                'message' => "Xóa danh mục thành công"
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function getTree()
    {
        try {
            $tree = $this->categoryRepo->getActiveRootsWithChildren();
            return [
                'success' => true,
                'data'    => $tree
            ];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
