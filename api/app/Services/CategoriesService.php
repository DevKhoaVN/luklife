<?php

namespace App\Services;

use Exception;
use App\Models\categories as Category;
use App\Repositories\Contracts\CategoriesRepositoriesInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;


class CategoriesService 
{
    protected CategoriesRepositoriesInterface $categoryRepo;

    public function __construct(CategoriesRepositoriesInterface $categoryRepo) {
      $this->categoryRepo = $categoryRepo;
    }

    public function getAllCategories()
    {
        try {

            $categories = $this->categoryRepo->paginate(20);
       
            if(empty($categories)){
               throw new Exception('Không có dữ liệu danh mục trong hệ thống');
             }

             return [
                'sccuess' => true,
                'message' => "Lấy toàn bộ danh mục thành công",
                'data' => $categories
             ];;

        }catch(Exception $e) {
            return [
                'sccuess' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function store(array $data)
    {
        try {

            if (!empty($data['image'])) {
                $data['image'] = $data['image']->store('categories', 'public');
            }

            $category = $this->categoryRepo->create($data);

            return [
                'sccuess' => true,
                'message' => "Tạo danh mục thành công",
                'data' => $category
            ];;
        } catch (Exception $e) {
            return [
                'sccuess' => false,
                'message' => $e->getMessage()
            ];
        }
      

    }


    public function update(array $data)
    {
        try {

            $category = $this->categoryRepo->find($data['id']);

            if(empty($category)){
                throw new Exception("Danh mục không tồn tại trong hệ thống.");
            }

            if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
                    
                if($category->image){
                    Storage::disk('public')->delete($category->image);
                }

                $data['image'] = $data['image']->store('categories', 'public');
            }

            $this->categoryRepo->update($data['id'], $data);
        
            return [
                'sccuess' => true,
                'message' => "Tạo danh mục thành công",
                'data' => $category
            ];
        } catch (Exception $e) {
            return [
                'sccuess' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function delete(int $id)
    {
        try {

            $this->categoryRepo->delete($id);

            return [
                'sccuess' => true,
                'message' => "Xóa danh mục thành công"
            ];
        } catch (Exception $e) {
            return [
                'sccuess' => false,
                'message' => $e->getMessage()
            ];
        }
    }


}
