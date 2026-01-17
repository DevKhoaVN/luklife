import React from "react";
import { useLocation } from "@tanstack/react-router";
import { Menu, Bell, Maximize2 } from "lucide-react";

export function Header({ onToggleSidebar, statsData }) {
  const location = useLocation();

  // Get active menu name from pathname
  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      "/dashboard": "Tổng quan",
      "/dashboard/orders": "Đơn hàng",
      "/dashboard/orders/pending": "Đơn hàng - Chờ xử lý",
      "/dashboard/orders/processing": "Đơn hàng - Đang xử lý",
      "/dashboard/orders/completed": "Đơn hàng - Hoàn thành",
      "/dashboard/orders/cancelled": "Đơn hàng - Đã hủy",
      "/dashboard/products": "Sản phẩm",
      "/dashboard/customers": "Khách hàng",
      "/dashboard/analytics": "Thống kê",
      "/dashboard/settings": "Cài đặt",
    };
    return titles[path] || "Dashboard";
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Get current time formatted
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Count pending orders for notification badge
  const pendingOrdersCount =
    statsData?.data?.by_order_status?.pending?.count || 0;

  return (
    <header className="h-16 border-b border-gray-200 px-6 flex items-center justify-between bg-white shadow-sm flex-shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-xs text-gray-500">
            Cập nhật lúc {getCurrentTime()}
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notification Button */}
        <button
          className="relative p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {pendingOrdersCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label="Toggle fullscreen"
        >
          <Maximize2 size={20} />
        </button>
      </div>
    </header>
  );
}
