<?php

namespace App\Services;
use App\Repositories\Contracts\ProductRepositoriesInterface;
use App\Models\product_variants;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Spatie\Sluggable\HasSlug;

class ProductService {
    protected $productRepository;

    public function __construct(ProductRepositoriesInterface $productRepository){
        $this->productRepository = $productRepository;
    }

    public function create(array $data){
        DB::beginTransaction();
        try{
            $productAttri = [
                'name'=>$data['name'],
                'price'=>$data['price'],
                'slug'=>Str::slug($data['name']).'-'.time(),
                'price'=>$data['price'],
                'discount_percentage'=>$data['discount_percentage']??0,
                'description'=>$data['description']??null,
                'is_active'=>1
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
        }
        catch(\Exception $e){
            DB::rollBack();
            Log::error("Lỗi khi tạo sản phẩm: ".$e->getMessage());
            throw $e;
        }
    }
}
