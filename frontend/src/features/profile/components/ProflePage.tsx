// src/components/ProfilePage.tsx
import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Lock,
  Package,
  Ticket,
  Star,
  Eye,
  Plus,
  X,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useGetProfile, useUpdateProfile } from "../../../hooks/useUser";
import { toast } from "react-toastify";
import { getImageUrl } from "../../../utils/inedx";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  // States cho Profile
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    gender: "male",
    phone: "",
    email: "",
  });
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // React Query hooks
  const { data: profileData, isLoading: isLoadingProfile } = useGetProfile();
  const updateProfileMutation = useUpdateProfile();

  // Load profile data khi component mount
  useEffect(() => {
    if (profileData?.data) {
      setFormData({
        fullName: profileData.data.full_name || "",
        birthDate: profileData.data.date_of_birth || "",
        gender: profileData.data.gender || "male",
        phone: profileData.data.phone || "",
        email: profileData.data.email || "",
      });

      if (profileData.data.avatar) {
        setAvatar(getImageUrl(profileData.data.avatar));
      }
    }
  }, [profileData]);

  // State cho các tab khác (Địa chỉ, Đơn hàng, v.v.)
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
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    street: "",
    isDefault: false,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Menu items
  const menuItems = [
    { id: "orders", label: "Đơn hàng của tôi", icon: Package },
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
    { id: "vouchers", label: "Mã khuyến mại", icon: Ticket },
    { id: "reviews", label: "Đánh giá của tôi", icon: Star },
    { id: "viewed", label: "Sản phẩm đã xem", icon: Eye },
  ];

  // === HANDLERS CHO PROFILE ===
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (1MB)
    if (file.size > 1024 * 1024) {
      toast.error("Kích thước ảnh phải nhỏ hơn 1MB");
      return;
    }

    // Validate file type
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Chỉ chấp nhận file .JPEG hoặc .PNG");
      return;
    }

    setAvatarFile(file);

    // Preview ảnh
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const validateProfileForm = () => {
    if (!formData.fullName?.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return false;
    }

    if (!formData.email?.trim()) {
      toast.error("Vui lòng nhập email");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email không hợp lệ");
      return false;
    }

    if (formData.phone && !/^\d{10,11}$/.test(formData.phone)) {
      toast.error("Số điện thoại phải có 10-11 chữ số");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateProfileForm()) return;

    try {
      const profileData = {
        full_name: formData.fullName || null,
        gender: formData.gender || null,
        date_of_birth: formData.birthDate || null,
        phone: formData.phone || null,
        avatar: avatarFile || null,
      };

      await updateProfileMutation.mutateAsync(profileData);
      setAvatarFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // === RENDER PROFILE CONTENT ===
  const renderProfileContent = () => {
    if (isLoadingProfile) {
      return (
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-red-700" />
            <span className="ml-2 text-gray-600">Đang tải thông tin...</span>
          </div>
        </div>
      );
    }

    return (
      <div className=" rounded-lg bg-white p-8 shadow-sm">
        <h2 className="mb-8 text-xl font-bold text-black">Hồ sơ của tôi</h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Avatar Section */}
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
              {avatarFile && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <label className="mb-2 cursor-pointer rounded bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={updateProfileMutation.isPending}
              />
              Chọn ảnh
            </label>
            <p className="mt-2 text-center text-xs text-gray-500">
              Dung lượng tối đa 1MB. Định dạng
              <br />
              .JPEG, .PNG
            </p>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-3 items-center gap-4">
              <label className="text-start text-sm text-gray-700">
                Họ và tên <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={updateProfileMutation.isPending}
                className="col-span-2 rounded border border-gray-300 px-4 py-2 text-sm focus:border-red-700 focus:outline-none disabled:bg-gray-50"
                placeholder="Nhập họ và tên"
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
                disabled={updateProfileMutation.isPending}
                className="col-span-2 rounded border border-gray-300 px-4 py-2 text-sm focus:border-red-700 focus:outline-none disabled:bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <label className="text-start text-sm text-gray-700">
                Giới tính
              </label>
              <div className="col-span-2 flex gap-6">
                {["male", "female", "other"].map((g) => (
                  <label
                    key={g}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleInputChange}
                      disabled={updateProfileMutation.isPending}
                      className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">
                      {g === "male" ? "Nam" : g === "female" ? "Nữ" : "Khác"}
                    </span>
                  </label>
                ))}
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
                disabled={updateProfileMutation.isPending}
                className="col-span-2 rounded border border-gray-300 px-4 py-2 text-sm focus:border-red-700 focus:outline-none disabled:bg-gray-50"
                placeholder="Nhập số điện thoại"
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
                disabled={updateProfileMutation.isPending}
                className="col-span-2 rounded border border-gray-300 px-4 py-2 text-sm focus:border-red-700 focus:outline-none disabled:bg-gray-50"
                placeholder="Nhập email"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={updateProfileMutation.isPending}
            className="rounded bg-red-700 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-red-800 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {updateProfileMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </button>
        </div>
      </div>
    );
  };

  // Main render với sidebar
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-6">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {formData.fullName || "User"}
                  </p>
                  <p className="text-xs text-gray-500">{formData.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  if (item.hasSubmenu) {
                    return (
                      <div key={item.id}>
                        <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700">
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </div>
                        <div className="ml-8 space-y-1">
                          {item.submenu?.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => setActiveTab(sub.id)}
                              className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                                activeTab === sub.id
                                  ? "bg-red-50 text-red-700 font-medium"
                                  : "text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex w-full items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeTab === item.id
                          ? "bg-red-50 text-red-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{renderProfileContent()}</div>
        </div>
      </div>
    </div>
  );
}
