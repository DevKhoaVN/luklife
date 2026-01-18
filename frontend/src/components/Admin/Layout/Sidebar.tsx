import React, { useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import logo from "../../../../public/assets/header_logo.svg";
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  ChevronDown,
  LogOut,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Plus,
  Edit2,
} from "lucide-react";

export function Sidebar({ currentUser, onLogout, statsData, isOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // Get active menu from current path
  const getActiveMenu = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "dashboard";
    if (path.includes("/orders")) {
      if (path === "/dashboard/orders") return "orders-all";
      if (path.includes("pending")) return "orders-pending";
      if (path.includes("processing")) return "orders-processing";
      if (path.includes("completed")) return "orders-completed";
      if (path.includes("cancelled")) return "orders-cancelled";
      return "orders";
    }
    if (path.includes("/products")) return "products";
    if (path.includes("/customers")) return "customers";
    if (path.includes("/analytics")) return "analytics";
    if (path.includes("/settings")) return "settings";

    if (path.includes("/products")) {
      // Nếu đang ở trang tạo mới
      if (path === "/dashboard/products/create") return "products-create";

      // Nếu đang ở trang edit (bất kể ID nào)
      if (path.includes("/products/edit")) return "products-all"; // Cho sáng đèn mục "Tất cả sản phẩm"

      // Mặc định là trang danh sách
      return "products-all";
    }
    return "dashboard";
  };

  const activeMenu = getActiveMenu();

  const menuItems = [
    {
      id: "dashboard",
      label: "Tổng quan",
      icon: Home,
      badge: null,
      path: "/dashboard",
    },
    {
      id: "orders",
      label: "Đơn hàng",
      icon: ShoppingCart,
      badge:
        statsData?.data?.by_order_status?.pending?.count?.toString() || null,
      submenu: [
        {
          id: "orders-all",
          label: "Tất cả đơn hàng",
          icon: FileText,

          path: "/dashboard/orders",
        },
        {
          id: "orders-pending",
          label: "Sản phẩm đơn hàng",
          icon: Clock,

          path: "/dashboard/orders/checking",
        },
      ],
    },
    {
      id: "products",
      label: "Sản phẩm",
      icon: Package,
      badge: null,
      // Thêm submenu cho Products
      submenu: [
        {
          id: "products-all",
          label: "Tất cả sản phẩm",
          icon: FileText,
          path: "/dashboard/products",
        },
        {
          id: "products-create",
          label: "Thêm sản phẩm",
          icon: Plus, // Bạn có thể dùng icon Plus từ lucide-react
          path: "/dashboard/products/create",
        },
      ],
    },
    {
      id: "customers",
      label: "Khách hàng",
      icon: Users,
      badge: null,
      path: "/dashboard/customers",
    },
    {
      id: "stock",
      label: "Tồn kho",
      icon: BarChart3,
      badge: null,
      path: "/dashboard/analytics",
    },
    {
      id: "settings",
      label: "Cài đặt",
      icon: Settings,
      badge: null,
      path: "/dashboard/settings",
    },
  ];

  const handleMenuClick = (item) => {
    if (item.submenu) {
      setOpenSubmenu(openSubmenu === item.id ? null : item.id);
    } else {
      navigate({ to: item.path });
      setOpenSubmenu(null);
    }
  };

  const handleLogout = () => {
    if (confirm("Đăng xuất?")) {
      onLogout();
    }
  };

  return (
    <aside
      className={`${
        isOpen ? "w-72" : "w-0"
      } bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden shadow-sm`}
    >
      {/* Header with Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-35" />
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">
          Manage
        </span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                activeMenu === item.id || openSubmenu === item.id
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  size={18}
                  strokeWidth={activeMenu === item.id ? 2.5 : 2}
                  className={
                    activeMenu === item.id || openSubmenu === item.id
                      ? "text-blue-600"
                      : ""
                  }
                />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
                    {item.badge}
                  </span>
                )}
                {item.submenu && (
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      openSubmenu === item.id ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>
            </button>

            {/* Submenu */}
            {item.submenu && (
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openSubmenu === item.id
                    ? "max-h-96 opacity-100 mt-1"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-3 pl-6 border-l-2 border-gray-100 space-y-1 py-1">
                  {item.submenu.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => navigate({ to: sub.path })}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeMenu === sub.id
                          ? "text-blue-700 font-semibold bg-blue-50/50"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <sub.icon size={14} />
                        <span>{sub.label}</span>
                      </div>
                      {sub.count && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                          {sub.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
          <img
            src={currentUser?.avatar || "/api/placeholder/40/40"}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100"
            alt="Avatar"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {currentUser?.full_name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {currentUser?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
            title="Đăng xuất"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
