<?php

namespace App\Http\Controllers\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category as Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Services\CategoriesService;
use App\Services\OrderService;
use App\Services\ProductService;
use App\Services\UserService;
use Illuminate\Foundation\Auth\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
   public function __construct(protected OrderService $orderService, protected ProductService $productService, protected UserService $userService){}

   public function dashboardStats()
   {
      $orderStats = $this->orderService->countOrders();
      $productStats = $this->productService->countProducts();
      $countUsers = $this->userService->countUsers();
      $countRevenue = $this->orderService->countRevenue();


      return response()->json([
         'success' => true,
         'data' => [
            'order_stats' => $orderStats,
            'product_stats' => $productStats,
            'user_stats' => $countUsers,
            'revenue_stats' => $countRevenue
         ]
      ], 200);
   }

}
