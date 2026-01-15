<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\cart; // Nhớ use Model Cart
use Carbon\Carbon;

class PruneOldCarts extends Command
{
    // Tên lệnh để gọi (ví dụ: chạy 'php artisan cart:prune' trong terminal)
    protected $signature = 'cart:prune {days=7}'; // Mặc định là 7 ngày

    protected $description = 'Xóa các giỏ hàng vãng lai cũ quá hạn';

    public function handle()
    {
        $days = $this->argument('days');

        // Tính mốc thời gian: Hiện tại trừ đi số ngày
        $cutOffDate = Carbon::now()->subDays($days);

        // Đếm số lượng sẽ xóa để báo cáo
        $count = Cart::whereNull('user_id') // Chỉ xóa của khách vãng lai
            ->where('updated_at', '<', $cutOffDate)
            ->count();

        if ($count > 0) {
            // Thực hiện xóa
            Cart::whereNull('user_id')
                ->where('updated_at', '<', $cutOffDate)
                ->delete();

            $this->info("Đã dọn dẹp sạch sẽ {$count} giỏ hàng rác cũ hơn {$days} ngày!");
        } else {
            $this->info("Không có giỏ hàng nào cần dọn dẹp.");
        }
    }
}
