<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Orders;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService
    ) {}

    /**
     * Lấy danh sách đơn hàng của user hiện tại
     */
    public function getMyOrders(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $result = $this->orderService->getMyOrders($perPage);
        
        return response()->json($result, $result['success'] ? 200 : 400);
    }

    /**
     * Lấy tất cả đơn hàng (Admin)
     */
    public function getAllOrders(Request $request)
    {
        $status = $request->input('status', 'all');

        $result = $this->orderService->getAllOrders(10, $status);
        
        return response()->json($result, $result['success'] ? 200 : 400);
    }

    /**
     * Tạo đơn hàng mới
     */
    public function createOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // Required fields
            'recipient_name' => 'required|string|max:255',
            'recipient_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string',
            'total_amount' => 'required|numeric|min:0',
            'grand_total' => 'required|numeric|min:0',
            
            // Optional fields
            'shipping_address_id' => 'nullable|exists:shipping_addresses,id',
            'discount_amount' => 'nullable|numeric|min:0',
            'shipping_fee' => 'nullable|numeric|min:0',
            'payment_method' => 'nullable|in:cod,vnpay',
            'notes' => 'nullable|string',
            'vnpay_txn_ref' => 'nullable|string|max:255',
        ], [
            'recipient_name.required' => 'Tên người nhận không được để trống',
            'recipient_phone.required' => 'Số điện thoại không được để trống',
            'shipping_address.required' => 'Địa chỉ giao hàng không được để trống',
            'total_amount.required' => 'Tổng tiền không được để trống',
            'grand_total.required' => 'Tổng thanh toán không được để trống',
            'payment_method.in' => 'Phương thức thanh toán không hợp lệ',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $result = $this->orderService->createOrder($request->all());
        
        return response()->json($result, $result['success'] ? 201 : 400);
    }


    /**
     * Cập nhật trạng thái đơn hàng (Admin)
     */
    public function updateStatusOrder(string $orderId, Request $request)
    {
        $validator = Validator::make($request->all(), [ 
            'order_status' => 'sometimes|in:pending,confirmed,processing,shipping,delivered,cancelled,returned',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $result = $this->orderService->updateStatus($orderId, $request->all());
        
        return response()->json($result, $result['success'] ? 200 : 400);
    }

    /**
     * Hủy đơn hàng
     */
    public function cancel(Request $request, int $id)
    {
        $validator = Validator::make($request->all(), [
            'cancelled_reason' => 'required|string|max:1000',
        ], [
            'cancelled_reason.required' => 'Vui lòng nhập lý do hủy đơn',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $result = $this->orderService->cancelOrder($id, $request->input('cancelled_reason'));
        
        return response()->json($result, $result['success'] ? 200 : 400);
    }

    /**
     * Xóa đơn hàng (Admin)
     */
    public function destroy(int $id): JsonResponse
    {
        $result = $this->orderService->deleteOrder($id);
        
        return response()->json($result, $result['success'] ? 200 : 404);
    }

    /**
     * Lọc đơn hàng theo trạng thái
     */
    public function filterByStatus(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'order_status' => 'required|in:pending,confirmed,processing,shipping,delivered,cancelled,returned',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $perPage = $request->get('per_page', 10);
        $result = $this->orderService->getOrdersByStatus($request->order_status, $perPage);
        
        return response()->json($result, $result['success'] ? 200 : 400);
    }


    
    public function getOrderByOrderId(string $orderId)
     {
        $result = $this->orderService->getOrderDetail($orderId);

        return response()->json($result, $result['success'] ? 200 : 404);
      }
      public function countOrders()
      {
        $result = $this->orderService->countOrders();

        return response()->json($result, $result['success'] ? 200 : 400);
      }

    public function findOrdersByUserId()
    {
       
        $id = JWTAuth::parseToken()->authenticate()->id;
        $reuslt = $this->orderService->findOrdersByUserIds((int) $id);
        return response()->json($reuslt);
    }
}