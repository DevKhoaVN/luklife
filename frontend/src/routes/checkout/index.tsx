import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/")({
  component: ProfilePage,
});

import React, { useState } from "react";
import {
  User,
  MapPin,
  Lock,
  Package,
  Ticket,
  Star,
  Eye,
  Upload,
  Facebook,
  Chrome,
  Plus,
  Edit2,
  Trash2,
  X,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  ShoppingCart,
  Search,
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    fullName: "Le Van Khoa",
    birthDate: "2005-08-20",
    gender: "male",
    phone: "84966140378",
    email: "khoavanle2@gmail.com",
  });
  const [avatar, setAvatar] = useState(null);

  // State cho Địa chỉ
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      fullName: "Lê Văn Khoa",
      phone: "84966140378",
      province: "Hà Nội",
      district: "Hoàn Kiếm",
      ward: "Hàng Bạc",
      street: "Số 10, Phố Hàng Bạc",
      isDefault: true,
    },
  ]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    street: "",
    isDefault: false,
  });

  // State cho Đổi mật khẩu
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State cho Đơn hàng
  const [orders, setOrders] = useState([
    {
      id: "DH001",
      date: "2026-01-08",
      status: "delivering",
      items: [
        {
          id: 1,
          name: "Áo thun nam cổ tròn",
          image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200",
          quantity: 2,
          price: 250000,
        },
        {
          id: 2,
          name: "Quần jean nam slim fit",
          image:
            "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200",
          quantity: 1,
          price: 450000,
        },
      ],
      total: 950000,
      address: "Số 10, Phố Hàng Bạc, Hàng Bạc, Hoàn Kiếm, Hà Nội",
    },
    {
      id: "DH002",
      date: "2026-01-05",
      status: "delivered",
      items: [
        {
          id: 3,
          name: "Giày thể thao nam",
          image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
          quantity: 1,
          price: 850000,
        },
      ],
      total: 850000,
      address: "Số 10, Phố Hàng Bạc, Hàng Bạc, Hoàn Kiếm, Hà Nội",
    },
    {
      id: "DH003",
      date: "2026-01-03",
      status: "pending",
      items: [
        {
          id: 4,
          name: "Áo khoác hoodie",
          image:
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200",
          quantity: 1,
          price: 550000,
        },
      ],
      total: 550000,
      address: "Số 10, Phố Hàng Bạc, Hàng Bạc, Hoàn Kiếm, Hà Nội",
    },
  ]);
  const [orderFilter, setOrderFilter] = useState("all");

  // State cho Sản phẩm đã xem
  const [viewedProducts, setViewedProducts] = useState([
    {
      id: 1,
      name: "Áo thun nam basic",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
      price: 199000,
      originalPrice: 299000,
      discount: 33,
      rating: 4.5,
      sold: 234,
    },
    {
      id: 2,
      name: "Quần jean nam slim fit",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300",
      price: 450000,
      originalPrice: 650000,
      discount: 31,
      rating: 4.8,
      sold: 567,
    },
    {
      id: 3,
      name: "Giày thể thao sneaker",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
      price: 850000,
      originalPrice: 1200000,
      discount: 29,
      rating: 4.9,
      sold: 892,
    },
    {
      id: 4,
      name: "Áo khoác hoodie",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300",
      price: 550000,
      originalPrice: 750000,
      discount: 27,
      rating: 4.6,
      sold: 345,
    },
    {
      id: 5,
      name: "Túi xách nam da",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300",
      price: 680000,
      originalPrice: 900000,
      discount: 24,
      rating: 4.7,
      sold: 123,
    },
    {
      id: 6,
      name: "Đồng hồ nam thời trang",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300",
      price: 1250000,
      originalPrice: 1800000,
      discount: 31,
      rating: 4.9,
      sold: 678,
    },
  ]);

  // Menu items
  const menuItems = [
    {
      id: "orders",
      label: "Đơn hàng của tôi",
      icon: Package,
      path: "/orders",
    },
    {
      id: "account",
      label: "Tài khoản của tôi",
      icon: User,
      hasSubmenu: true,
      submenu: [
        { id: "profile", label: "Hồ sơ" },
        { id: "address", label: "Địa chỉ" },
        { id: "password", label: "Đổi mật khẩu" },
      ],
    },
    {
      id: "vouchers",
      label: "Mã khuyến mại",
      icon: Ticket,
      path: "/vouchers",
    },
    {
      id: "reviews",
      label: "Đánh giá của tôi",
      icon: Star,
      path: "/reviews",
    },
    {
      id: "viewed",
      label: "Sản phẩm đã xem",
      icon: Eye,
      path: "/viewed",
    },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("Saving profile:", formData);
    alert("Đã lưu thông tin!");
  };

  // === XỬ LÝ ĐỊA CHỈ ===
  const handleAddressFormChange = (e) => {
    setAddressForm({
      ...addressForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressCheckbox = (e) => {
    setAddressForm({
      ...addressForm,
      isDefault: e.target.checked,
    });
  };

  const openAddressModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setAddressForm(address);
    } else {
      setEditingAddress(null);
      setAddressForm({
        fullName: "",
        phone: "",
        province: "",
        district: "",
        ward: "",
        street: "",
        isDefault: false,
      });
    }
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
  };

  const handleSaveAddress = () => {
    if (!addressForm.fullName || !addressForm.phone || !addressForm.street) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (editingAddress) {
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingAddress.id
            ? { ...addressForm, id: addr.id }
            : addressForm.isDefault
              ? { ...addr, isDefault: false }
              : addr
        )
      );
    } else {
      const newAddress = {
        ...addressForm,
        id: Date.now(),
      };
      setAddresses(
        addressForm.isDefault
          ? [
              ...addresses.map((addr) => ({ ...addr, isDefault: false })),
              newAddress,
            ]
          : [...addresses, newAddress]
      );
    }
    closeAddressModal();
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      setAddresses(addresses.filter((addr) => addr.id !== id));
    }
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  // === XỬ LÝ ĐỔI MẬT KHẨU ===
  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    console.log("Changing password:", passwordForm);
    alert("Đổi mật khẩu thành công!");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // === XỬ LÝ ĐỐN HÀNG ===
  const getOrderStatus = (status) => {
    const statusMap = {
      pending: {
        label: "Chờ xác nhận",
        color: "text-yellow-600 bg-yellow-50 border-yellow-200",
        icon: Clock,
      },
      delivering: {
        label: "Đang giao",
        color: "text-blue-600 bg-blue-50 border-blue-200",
        icon: Truck,
      },
      delivered: {
        label: "Đã giao",
        color: "text-green-600 bg-green-50 border-green-200",
        icon: CheckCircle,
      },
      cancelled: {
        label: "Đã hủy",
        color: "text-red-600 bg-red-50 border-red-200",
        icon: XCircle,
      },
    };
    return statusMap[status];
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const filteredOrders =
    orderFilter === "all"
      ? orders
      : orders.filter((order) => order.status === orderFilter);

  const handleCancelOrder = (orderId) => {
    if (window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
      alert("Đã hủy đơn hàng!");
    }
  };

  // === XỬ LÝ SẢN PHẨM ĐÃ XEM ===
  const handleRemoveViewedProduct = (productId) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi danh sách?")) {
      setViewedProducts(
        viewedProducts.filter((product) => product.id !== productId)
      );
    }
  };

  const handleAddToCart = (product) => {
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  // === RENDER CONTENT THEO TAB ===
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileContent();
      case "address":
        return renderAddressContent();
      case "password":
        return renderPasswordContent();
      case "orders":
        return renderOrdersContent();
      case "viewed":
        return renderViewedProductsContent();
      default:
        return renderProfileContent();
    }
  };

  // Render Hồ sơ
  const renderProfileContent = () => (
    <div className="rounded-lg bg-white p-8 shadow-sm">
      <h2 className="mb-8 text-xl font-bold text-black">Hồ sơ của tôi</h2>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4 flex flex-col items-center border-r border-gray-100 pl-8">
          <div className="relative mb-4">
            <div className="h-32 w-32 overflow-hidden rounded-full bg-gray-200 ring-4 ring-gray-100">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>
          <label className="mb-2 cursor-pointer rounded bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 transition-colors">
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleAvatarChange}
              className="hidden"
            />
            Chọn ảnh
          </label>
          <p className="mt-2 text-center text-xs text-gray-500">
            Dung lượng tối đa 1MB. Định dạng
            <br />
            .JPEG, .PNG
          </p>
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-3 items-center gap-4">
            <label className="text-start text-sm text-gray-700">
              Họ và tên
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="col-span-2 rounded border border-gray-300 px-4 py-2 text-xs focus:border-red-700 focus:outline-none focus:ring-0 focus:ring-red-700"
            />
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <label className="text-start text-sm text-gray-700">
              Ngày sinh
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              className="col-span-2 rounded border border-gray-300 px-4 py-2 text-sm focus:border-red-700 focus:outline-none focus:ring-0 focus:ring-red-700"
            />
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <label className="text-start text-sm text-gray-700">
              Giới tính
            </label>
            <div className="col-span-2 flex gap-6">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleInputChange}
                  className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">Nam</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleInputChange}
                  className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">Nữ</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={formData.gender === "other"}
                  onChange={handleInputChange}
                  className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">Khác</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <label className="text-start text-sm text-gray-700">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="col-span-2 rounded border border-gray-300 px-4 py-2 text-sm focus:border-red-700 focus:outline-none focus:ring-0 focus:ring-red-700"
            />
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <label className="text-start text-sm text-gray-700">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="col-span-2 rounded border border-gray-300 px-4 py-2 text-sm focus:border-red-700 focus:outline-none focus:ring-0 focus:ring-red-700"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          className="rounded bg-red-700 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-red-800 hover:shadow-lg"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );

  // Render Địa chỉ
  const renderAddressContent = () => (
    <div className="rounded-lg bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-black">Địa chỉ của tôi</h2>
        <button
          onClick={() => openAddressModal()}
          className="flex items-center gap-2 rounded bg-red-700 px-4 py-2 text-xs font-medium text-white hover:bg-red-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Thêm địa chỉ mới
        </button>
      </div>

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <MapPin className="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <p>Chưa có địa chỉ nào</p>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className="rounded-lg border border-gray-200 p-5 hover:border-red-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="font-semibold ">{address.fullName}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-600 text-sm">
                      {address.phone}
                    </span>
                    {address.isDefault && (
                      <span className="rounded border border-red-600 px-2 py-0.5 text-xs font-medium text-red-600">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="mb-1 text-xs text-gray-600">{address.street}</p>
                  <p className="text-xs text-gray-500">
                    {address.ward}, {address.district}, {address.province}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => openAddressModal(address)}
                    className="text-xs font-medium text-gray-600 hover:underline"
                  >
                    Sửa
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefaultAddress(address.id)}
                  className="mt-3 rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-gray-400 transition-colors"
                >
                  Thiết lập mặc định
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal thêm/sửa địa chỉ */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-md uppercase font-bold">
                {editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
              </h3>
              <button
                onClick={closeAddressModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={addressForm.fullName}
                    onChange={handleAddressFormChange}
                    className="w-full rounded border border-gray-300 px-4 py-2 text-xs focus:border-red-700 focus:outline-none focus:ring-0 focus:ring-red-700"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={addressForm.phone}
                    onChange={handleAddressFormChange}
                    className="w-full rounded border border-gray-300 px-4 py-2 text-xs focus:border-red-700 focus:outline-none focus:ring-0 focus:ring-red-700"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Tỉnh/Thành phố *
                </label>
                <input
                  type="text"
                  name="province"
                  value={addressForm.province}
                  onChange={handleAddressFormChange}
                  className="w-full rounded border border-gray-300 px-4 py-2 text-xs focus:border-red-700 focus:outline-none focus:ring-0 focus:ring-red-700"
                  placeholder="Nhập tỉnh/thành phố"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Quận/Huyện *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={addressForm.district}
                    onChange={handleAddressFormChange}
                    className="w-full rounded border border-gray-300 px-4 py-2 text-xs focus:border-red-700 focus:outline-none focus:ring-0 focus:ring-red-700"
                    placeholder="Nhập quận/huyện"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Phường/Xã *
                  </label>
                  <input
                    type="text"
                    name="ward"
                    value={addressForm.ward}
                    onChange={handleAddressFormChange}
                    className="w-full rounded border border-gray-300 px-4 py-2 text-xs focus:border-red-700 focus:outline-none focus:ring-0 focus:ring-red-700"
                    placeholder="Nhập phường/xã"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Địa chỉ cụ thể *
                </label>
                <textarea
                  name="street"
                  value={addressForm.street}
                  onChange={handleAddressFormChange}
                  rows="3"
                  className="w-full rounded border border-gray-300 px-4 py-2 text-xs focus:border-red-700 focus:outline-none focus:ring-0 focus:ring-red-700"
                  placeholder="Số nhà, tên đường..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={handleAddressCheckbox}
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="isDefault" className="text-xs text-gray-700">
                  Đặt làm địa chỉ mặc định
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeAddressModal}
                className="rounded border border-gray-300 px-6 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveAddress}
                className="rounded bg-red-700 px-6 py-2 text-xs font-medium text-white hover:bg-red-800 transition-colors"
              >
                {editingAddress ? "Cập nhật" : "Thêm địa chỉ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render Đổi mật khẩu
  const renderPasswordContent = () => (
    <div className="rounded-lg bg-white p-8 shadow-sm">
      <h2 className="mb-8 text-2xl font-bold text-gray-900">Đổi mật khẩu</h2>

      <div className="max-w-xl space-y-6">
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-700">
            Mật khẩu *
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className="w-full rounded border border-gray-300 px-4 py-2.5 pr-10 text-xs focus:border-red-700 focus:outline-none focus:ring-0 focus:ring-red-700"
              placeholder="Nhập mật khẩu hiện tại"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurrentPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <Lock className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-gray-700">
            Mật khẩu mới *
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full rounded border border-gray-300 px-4 py-2.5 pr-10 text-xs focus:border-red-700 focus:outline-none focus:ring-0 focus:ring-red-700"
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <Lock className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium font-sans text-gray-700">
            Xác nhận mật khẩu mới *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full rounded border border-gray-300 px-4 py-2.5 pr-10 text-xs focus:border-red-700 focus:outline-none focus:ring-0 focus:ring-red-700"
              placeholder="Nhập lại mật khẩu mới"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <Lock className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
          <p className="text-xs text-yellow-800">
            <strong>Lưu ý:</strong> Mật khẩu phải có ít nhất 6 ký tự và nên bao
            gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={handleChangePassword}
            className="uppercase rounded bg-red-700 px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-red-800 hover:shadow-lg"
          >
            cập nhật
          </button>
        </div>
      </div>
    </div>
  );

  // Render Đơn hàng của tôi
  const renderOrdersContent = () => (
    <div className="rounded-lg bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-black">Đơn hàng của tôi</h2>

      {/* Tabs lọc đơn hàng */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setOrderFilter("all")}
          className={`pb-3 px-4 text-xs font-medium transition-colors ${
            orderFilter === "all"
              ? "border-b-2 border-red-700 text-red-700"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setOrderFilter("pending")}
          className={`pb-3 px-4 text-sm font-medium transition-colors ${
            orderFilter === "pending"
              ? "border-b-2 border-red-700 text-red-700"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Chờ xác nhận
        </button>
        <button
          onClick={() => setOrderFilter("delivering")}
          className={`pb-3 px-4 text-sm font-medium transition-colors ${
            orderFilter === "delivering"
              ? "border-b-2 border-red-700 text-red-700"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Đang giao
        </button>
        <button
          onClick={() => setOrderFilter("delivered")}
          className={`pb-3 px-4 text-sm font-medium transition-colors ${
            orderFilter === "delivered"
              ? "border-b-2 border-red-700 text-red-700"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Đã giao
        </button>
        <button
          onClick={() => setOrderFilter("cancelled")}
          className={`pb-3 px-4 text-sm font-medium transition-colors ${
            orderFilter === "cancelled"
              ? "border-b-2 border-red-700 text-red-700"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Đã hủy
        </button>
      </div>

      {/* Danh sách đơn hàng */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <Package className="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <p>Chưa có đơn hàng nào</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const status = getOrderStatus(order.status);
            const StatusIcon = status.icon;

            return (
              <div
                key={order.id}
                className="rounded-lg border border-gray-200 p-5 hover:border-red-300 transition-colors"
              >
                {/* Header đơn hàng */}
                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-900">
                      Mã đơn: {order.id}
                    </span>
                    <span className="text-xs text-gray-500">{order.date}</span>
                    <span
                      className={`flex items-center gap-1 rounded border px-2 py-1 text-xs font-medium ${status.color}`}
                    >
                      <StatusIcon className="h-4 w-4" />
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Số lượng: {item.quantity}
                        </p>
                        <p className="mt-1 text-sm font-bold text-red-700">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Địa chỉ giao hàng */}
                <div className="mt-4 rounded-lg bg-gray-50 p-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    Địa chỉ giao hàng:
                  </p>
                  <p className="text-xs text-gray-600">{order.address}</p>
                </div>

                {/* Footer đơn hàng */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="text-sm">
                    <span className="text-gray-600">Tổng tiền: </span>
                    <span className="text-lg font-bold text-red-700">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      Xem chi tiết
                    </button>
                    {order.status === "pending" && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="rounded border border-red-600 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Hủy đơn
                      </button>
                    )}
                    {order.status === "delivered" && (
                      <button className="rounded bg-red-700 px-4 py-2 text-xs font-medium text-white hover:bg-red-800 transition-colors">
                        Đánh giá
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  // Render Sản phẩm đã xem
  const renderViewedProductsContent = () => (
    <div className="rounded-lg bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-black">Sản phẩm đã xem</h2>
        <div className="text-sm text-gray-500">
          {viewedProducts.length} sản phẩm
        </div>
      </div>

      {viewedProducts.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <Eye className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p>Chưa có sản phẩm nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {viewedProducts.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-lg border border-gray-200 p-4 transition-all hover:border-red-300 hover:shadow-lg"
            >
              {/* Nút xóa */}
              <button
                onClick={() => handleRemoveViewedProduct(product.id)}
                className="absolute right-2 top-2 z-10 rounded-full bg-white p-1.5 shadow-md opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50"
              >
                <X className="h-4 w-4 text-red-600" />
              </button>

              {/* Badge giảm giá */}
              {product.discount > 0 && (
                <div className="absolute left-2 top-2 z-10 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
                  -{product.discount}%
                </div>
              )}

              {/* Hình ảnh */}
              <div className="mb-3 overflow-hidden rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-48 w-full object-cover transition-transform group-hover:scale-110"
                />
              </div>

              {/* Thông tin sản phẩm */}
              <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900">
                {product.name}
              </h3>

              {/* Rating và đã bán */}
              <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{product.rating}</span>
                </div>
                <span>|</span>
                <span>Đã bán {product.sold}</span>
              </div>

              {/* Giá */}
              <div className="mb-3 flex items-baseline gap-2">
                <span className="text-lg font-bold text-red-700">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Nút thêm vào giỏ */}
              <button
                onClick={() => handleAddToCart(product)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-700 py-2 text-sm font-medium text-white transition-colors hover:bg-red-800"
              >
                <ShoppingCart className="h-4 w-4" />
                Thêm vào giỏ
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF9F8] py-8 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
            <User className="h-6 w-6 text-gray-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Xin chào,</p>
            <p className="text-base font-bold text-gray-900">
              {formData.fullName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* SIDEBAR MENU */}
          <div className="lg:col-span-3">
            <nav className="space-y-2 rounded-lg bg-white p-4 shadow-sm">
              {menuItems.map((item) => {
                // 1. Kiểm tra xem mục cha có active không (khi một mục con của nó được chọn)
                const isParentActive = item.hasSubmenu
                  ? item.submenu.some((sub) => sub.id === activeTab)
                  : false;

                // 2. Kiểm tra trạng thái active tổng thể
                const isActive = activeTab === item.id || isParentActive;

                return (
                  <div key={item.id}>
                    <button
                      onClick={() => {
                        if (item.hasSubmenu) {
                          // Khi click vào menu cha, chuyển đến mục con đầu tiên nếu nó chưa active
                          if (!isParentActive) {
                            setActiveTab(item.submenu[0].id);
                          }
                        } else {
                          // Menu đơn giản, chuyển activeTab
                          setActiveTab(item.id);
                        }
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-xs font-semibold transition-colors ${
                        isActive
                          ? "bg-red-600 text-white hover:bg-red-700" // Active + Hover
                          : "text-gray-700 hover:bg-gray-100" // Chưa Active + Hover
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </button>

                    {/* Submenu */}
                    {item.hasSubmenu &&
                      isParentActive && ( // Chỉ hiển thị submenu nếu cha đang active
                        <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-100 pl-6">
                          {item.submenu.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => setActiveTab(sub.id)}
                              className={`block w-full py-2 text-left text-xs transition-colors ${
                                activeTab === sub.id
                                  ? "font-bold text-red-600" // Mục con active: Màu đỏ đậm
                                  : "text-gray-600 hover:text-red-500" // Mục con hover: Đổi màu khi hover
                              }`}
                            >
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* CONTENT */}
          <div className="lg:col-span-9">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
