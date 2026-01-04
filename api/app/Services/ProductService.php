<?php

namespace App\Services;

use App\Repositories\Contracts\ProductRepositoriesInterface;
use App\Models\product_variants;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Spatie\Sluggable\HasSlug;
use Illuminate\Support\Arr;

class ProductService
{
    protected $productRepository;

    public function __construct(ProductRepositoriesInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function create(array $data)
    {
        DB::beginTransaction();
        try {
            $productAttri = [
                'name' => $data['name'],
                'price' => $data['price'],
                'slug' => Str::slug($data['name']) . '-' . time(),
                'price' => $data['price'],
                'discount_percentage' => $data['discount_percentage'] ?? 0,
                'description' => $data['description'] ?? null,
                'is_active' => 1
            ];
            $product = $this->productRepository->create($productAttri);
            if (!empty($data['category_ids'])) {
                $product->categories()->attach($data['category_ids']);
            }
            if (!empty($data['variants'])) {
                foreach ($data['variants'] as $variantData) {
                    $variantData['product_id'] = $product->id;
                    product_variants::create($variantData);
                }
            }
            DB::commit();

            return $product;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Lỗi khi tạo sản phẩm: " . $e->getMessage());
            throw $e;
        }
    }
    public function getAllProduct()
    {
        return $this->productRepository->getAll();
    }

    public function update($id, array $data)
    {
        DB::beginTransaction();
        try {
            $product = $this->productRepository->findById($id);
            if (!$product) {
                throw new \Exception("Sản phẩm không tồn tại");
            }
            $productData = Arr::except($data, ['category_ids', 'variants']); //loại bỏ những phần không cần thiết trong bảng products tránh lỗi
            $this->productRepository->update($id, $productData);

            if (isset($data['category_ids'])) {
                $product->categories()->sync($data['category_ids']); //sync: tự động xóa cũ, thêm mới
            }

            if (isset($data['variants'])) {
                $existingIds = $product->variants()->pluck('id')->toArray(); //Lấy danh sách -> mảng id

                $newIds = array_column($data['variants'], 'id'); //Lấy danh sách từ request
                $newIds = array_filter($newIds); //Bỏ giá trị null, rỗng

                $idsToDelete = array_diff($existingIds, $newIds);

                //Có trong Cũ mà không trong mới thì Delete
                if (!empty($idsToDelete)) {
                    product_variants::destroy($idsToDelete);
                }
            }

            foreach ($data['variants'] as $variantData) {
                if (isset($variantData['id'])) {
                    //Cập nhật
                    $variant = product_variants::find($variantData['id']);
                    if ($variant) {
                        $variant->update($variantData);
                    }
                } else {
                    //Tạo mới
                    $variantData['product_id'] = $product->id;
                    product_variants::create($variantData);
                }
            }
            DB::commit();
            $product->refresh();
            return $product;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Lỗi khi cập nhật sản phẩm: " . $e->getMessage());
            throw $e;
        }
    }

    public function delete($id)
    {
        return $this->productRepository->delete($id);
    }
}
