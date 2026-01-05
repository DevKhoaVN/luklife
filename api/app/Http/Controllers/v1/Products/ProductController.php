<?php

namespace App\Http\Controllers\v1\Products;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\ProductIndexRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\StoreProductRequest;
use App\Models\products as Product;
use App\Services\AuthService;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

use function Symfony\Component\Translation\t;

class ProductController extends Controller
{

    protected  $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function create(StoreProductRequest $request){
        $data = $request->validated();
        $result = $this->productService->createProduct($data);
        return response()->json($result);
    }
    
    public function index(ProductIndexRequest $request){
        $filters = [
            'search'         => $request->getSearch(),
            'category' => $request->getCategory(),
            'sort'           => $request->getSort(),
            'per'       => $request->getPage(),
        ];

        $result = $this->productService->getProducts($filters);
        return response()->json($result);
    }

    public function detail(Request $request, $slug){
    
        $reuslt = $this->productService->getProductDetail($slug);
        return response()->json($reuslt);
    }

        public function update(StoreProductRequest $request,  $id){
       
           $product = Product::findOrFail($id);
            $data = $request->validated();
      
            $result = $this->productService->updateProduct($product, $data);
            return response()->json($result);
        }
 

        public function delete($id){
            $reuslt = $this->productService->deleteProduct($id);
            return response()->json($reuslt);
        }
}
