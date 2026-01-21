// src/components/ProfilePage.tsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
  Loader2,
  Edit2,
  Trash2,
  EyeOff,
  CheckCircle,
  Search,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  Printer,
  Phone,
  ArrowLeft,
  ReceiptText,
  LogOut,
} from "lucide-react";
import {
  useGetProfile,
  useUpdateProfile,
  useGetAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  useResetPassword,
} from "../../../hooks/useUser";
import { toast } from "react-toastify";
import { getImageUrl } from "../../../utils/inedx";
import { useGetOrderDetailByUser } from "../../../hooks/Admin";
import { logout } from "../../../api/auth.api";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

// ==================== TYPES ====================
interface ProfileFormData {
  fullName: string;
  birthDate: string;
  gender: "male" | "female" | "other";
  phone: string;
  email: string;
  avatar: any;
}

interface AddressFormData {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  isDefault: boolean;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // ==================== HOOKS ====================
  const { data: profileData, isLoading: isLoadingProfile } = useGetProfile();
  const updateProfileMutation = useUpdateProfile();
  const { data: addressesData, isLoading: isLoadingAddresses } =
    useGetAddresses();
  const { data: orderData, isLoading: isLoadingOrder } =
    useGetOrderDetailByUser();
  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();
  const setDefaultAddressMutation = useSetDefaultAddress();
  const resetPasswordMutation = useResetPassword();

  // ==================== REACT HOOK FORM - PROFILE ====================
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: errorsProfile },
    setValue: setValueProfile,
    watch: watchProfile,
  } = useForm<ProfileFormData>({
    defaultValues: {
      fullName: "",
      birthDate: "",
      gender: "male",
      phone: "",
      email: "",
    },
  });

  // ==================== REACT HOOK FORM - ADDRESS ====================
  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    formState: { errors: errorsAddress },
    setValue: setValueAddress,
    reset: resetAddress,
  } = useForm<AddressFormData>({
    defaultValues: {
      fullName: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      street: "",
      isDefault: false,
    },
  });

  // ==================== REACT HOOK FORM - PASSWORD ====================
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPasswordForm,
    watch: watchPassword,
  } = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // ==================== STATES ====================
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ==================== EFFECTS ====================
  // Load profile data
  useEffect(() => {
    if (profileData?.data) {
      setValueProfile("fullName", profileData.data.full_name || "");
      setValueProfile("birthDate", profileData.data.date_of_birth || "");
      setValueProfile("gender", profileData.data.gender || "male");
      setValueProfile("phone", profileData.data.phone || "");
      setValueProfile("email", profileData.data.email || "");

      if (profileData.data.avatar) {
        setAvatar(getImageUrl(profileData.data.avatar));
      }
    }
  }, [profileData, setValueProfile]);

  // Load addresses data
  useEffect(() => {
    if (addressesData?.data) {
      setAddresses(addressesData.data);
    }
  }, [addressesData]);

  // ==================== PROFILE HANDLERS ====================
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error("Kích thước ảnh phải nhỏ hơn 1MB");
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Chỉ chấp nhận file .JPEG hoặc .PNG");
      return;
    }

    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmitProfile = async (data: ProfileFormData) => {
    console.log("💾 Saving profile:", data);
    console.log("avatrt", avatarFile);

    try {
      const formData = new FormData();

      if (data.fullName) formData.append("full_name", data.fullName);
      if (data.gender) formData.append("gender", data.gender);
      if (data.birthDate) formData.append("date_of_birth", data.birthDate);
      if (data.phone) formData.append("phone", data.phone);

      if (avatarFile) {
        formData.append("avatar", avatarFile); // ✅ FILE Ở ĐÂY
      }

      console.log("💾 Saving profile:", formData);
      await updateProfileMutation.mutateAsync(formData);

      setAvatarFile(null);
      toast.success("Cập nhật profile thành công");
    } catch (error) {
      console.error(" Error updating profile:", error);
      toast.error("Cập nhật profile thất bại");
    }
  };

  // ==================== ADDRESS HANDLERS ====================
  const openAddressModal = (address?: any) => {
    if (address) {
      setEditingAddress(address);
      setValueAddress("fullName", address.full_name);
      setValueAddress("phone", address.phone);
      setValueAddress("province", address.province);
      setValueAddress("district", address.district);
      setValueAddress("ward", address.ward);
      setValueAddress("street", address.address_line);
      setValueAddress("isDefault", address.is_default);
    } else {
      setEditingAddress(null);
      resetAddress();
    }
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
    resetAddress();
  };

  const onSubmitAddress = async (data: AddressFormData) => {
    console.log("📤 Saving address:", data);

    const addressData = {
      full_name: data.fullName,
      phone: data.phone,
      address_line: data.street,
      province: data.province,
      district: data.district,
      ward: data.ward,
      is_default: data.isDefault,
    };

    try {
      if (editingAddress) {
        await updateAddressMutation.mutateAsync({
          addressId: editingAddress.id,
          data: addressData,
        });
        toast.success("Cập nhật địa chỉ thành công");
      } else {
        await createAddressMutation.mutateAsync(addressData);
        toast.success("Thêm địa chỉ thành công");
      }

      closeAddressModal();
    } catch (error) {
      console.error("❌ Error saving address:", error);
      toast.error("Lưu địa chỉ thất bại");
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (addresses.length === 1) {
      toast.error("Bạn phải có ít nhất 1 địa chỉ");
      return;
    }

    const addressToDelete = addresses.find((addr) => addr.id === id);
    if (addressToDelete?.is_default) {
      toast.error("Không thể xóa địa chỉ mặc định");
      return;
    }

    try {
      await deleteAddressMutation.mutateAsync(id);
      toast.success("Xóa địa chỉ thành công");
    } catch (error) {
      console.error("❌ Error deleting address:", error);
      toast.error("Xóa địa chỉ thất bại");
    }
  };

  const handleSetDefaultAddress = async (id: number) => {
    try {
      await setDefaultAddressMutation.mutateAsync(id);
      toast.success("Đã đặt làm địa chỉ mặc định");
    } catch (error) {
      console.error("❌ Error setting default address:", error);
      toast.error("Đặt địa chỉ mặc định thất bại");
    }
  };

  // ==================== PASSWORD HANDLERS ====================
  const onSubmitPassword = async (data) => {
    console.log("🔐 Changing password");
    console.log("data khi submit:", data);
    try {
      await resetPasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success("Đổi mật khẩu thành công");
      resetPasswordForm();
    } catch (error) {
      console.error("❌ Error changing password:", error);
      toast.error("Đổi mật khẩu thất bại");
    }
  };

  // ==================== MENU ITEMS ====================
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
    { id: "logout", label: "Đăng xuất", icon: LogOut },
  ];
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 1. Hàm Helper hiển thị Badge trạng thái (Dùng chung)
  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
      processing: "bg-blue-50 text-blue-700 ring-blue-600/20",
      delivered: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
      cancelled: "bg-red-50 text-red-700 ring-red-600/10",
    };
    const labels = {
      pending: "Chờ xử lý",
      processing: "Đang giao",
      delivered: "Hoàn thành",
      cancelled: "Đã hủy",
    };
    return (
      <span
        className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${styles[status] || styles.pending}`}
      >
        {labels[status] || status}
      </span>
    );
  };
  // 2. Component hiển thị CHI TIẾT đơn hàng

  const OrderDetailView = ({ order, onBack }) => {
    if (!order) return null;

    return (
      <div className="animate-in fade-in duration-300 max-w-5xl mx-auto text-slate-700 bg-white p-4">
        {/* Header đơn giản */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-300">
          <div>
            <button
              onClick={onBack}
              className="flex items-center text-sm text-gray-500 hover:text-black mb-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại danh sách
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              Chi tiết đơn hàng #{order.order_code}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Ngày đặt: {new Date(order.created_at).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded border border-gray-300 bg-gray-50 text-gray-600 text-xs font-medium">
              {order.order_status === "pending" ? "Đang xử lý" : "Hoàn thành"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Sản phẩm */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-300 bg-gray-50/50">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  Sản phẩm trong đơn hàng
                </h3>
              </div>

              <div className="divide-y divide-gray-200">
                {order.order_items.map((item) => (
                  <div key={item.id} className="p-4 flex gap-4 items-center">
                    <img
                      src={item.variant.product.thumbnail}
                      className="w-16 h-16 object-cover rounded border border-gray-300"
                      alt={item.variant.product.name}
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900 leading-tight">
                        {item.variant.product.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 uppercase tracking-tighter">
                        Phân loại: {item.variant.color} - {item.variant.size}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          Số lượng: {item.quantity}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {Number(item.sub_total).toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {order.notes && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                <p className="text-xs font-bold text-gray-600 uppercase mb-1">
                  Ghi chú vận chuyển
                </p>
                <p className="text-sm text-gray-700 italic">"{order.notes}"</p>
              </div>
            )}
          </div>

          {/* Cột phải: Thông tin & Thanh toán */}
          <div className="space-y-6">
            {/* Vận chuyển */}
            <div className="border border-gray-300 rounded-lg p-5 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 uppercase tracking-tight">
                Thông tin khách hàng
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <User className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span className="font-bold text-gray-800">
                    {order.recipient_name}
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-600">{order.recipient_phone}</span>
                </div>
                <div className="flex items-start gap-3 text-sm border-t border-gray-200 pt-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-600 text-xs leading-relaxed leading-relaxed">
                    {order.shipping_address}
                  </span>
                </div>
              </div>
            </div>

            {/* Hóa đơn */}
            <div className="border border-gray-300 rounded-lg p-5 bg-white shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4 uppercase tracking-tight">
                Chi tiết hóa đơn
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-medium">
                    {Number(order.total_amount).toLocaleString()}đ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium">
                    +{Number(order.shipping_fee).toLocaleString()}đ
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-300 flex justify-between items-center">
                  <span className="font-bold text-gray-900">
                    Tổng thanh toán
                  </span>
                  <span className="text-lg font-bold text-red-600">
                    {Number(order.grand_total).toLocaleString()}đ
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-dashed border-gray-300 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 uppercase">Hình thức</span>
                  <span className="font-bold text-gray-700 uppercase">
                    {order.payment_method}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 uppercase">Trạng thái</span>
                  <span
                    className={`font-bold uppercase ${order.payment_status === "paid" ? "text-green-600" : "text-gray-600"}`}
                  >
                    {order.payment_status === "paid"
                      ? "Đã thu tiền"
                      : "Chưa trả tiền"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== RENDER PROFILE ====================
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
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <h2 className="mb-8 text-xl font-bold text-black">Hồ sơ của tôi</h2>

        <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Avatar Section */}
            <div className="flex flex-col items-center border-r border-gray-100 pl-8 lg:col-span-4">
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
                  <div className="absolute -right-2 -top-2 rounded-full bg-green-500 p-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <label className="mb-2 cursor-pointer rounded bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition-colors hover:bg-gray-50">
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
            <div className="space-y-6 lg:col-span-8">
              {/* Họ và tên */}
              <div className="grid grid-cols-3 items-start gap-4">
                <label className="pt-2 text-start text-sm text-gray-700">
                  Họ và tên <span className="text-red-600">*</span>
                </label>
                <div className="col-span-2">
                  <input
                    type="text"
                    {...registerProfile("fullName", {
                      required: "Họ và tên là bắt buộc",
                      minLength: {
                        value: 2,
                        message: "Họ và tên phải có ít nhất 2 ký tự",
                      },
                    })}
                    disabled={updateProfileMutation.isPending}
                    className={`w-full rounded border px-4 py-2 text-sm focus:outline-none ${
                      errorsProfile.fullName
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-red-700"
                    } disabled:bg-gray-50`}
                    placeholder="Nhập họ và tên"
                  />
                  {errorsProfile.fullName && (
                    <p className="mt-1 text-xs text-red-600">
                      {errorsProfile.fullName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Ngày sinh */}
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-start text-sm text-gray-700">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  {...registerProfile("birthDate")}
                  disabled={updateProfileMutation.isPending}
                  className="col-span-2 rounded border border-gray-300 px-4 py-2 text-sm focus:border-red-700 focus:outline-none disabled:bg-gray-50"
                />
              </div>

              {/* Giới tính */}
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-start text-sm text-gray-700">
                  Giới tính
                </label>
                <div className="col-span-2 flex gap-6">
                  {(["male", "female", "other"] as const).map((g) => (
                    <label
                      key={g}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type="radio"
                        {...registerProfile("gender")}
                        value={g}
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

              {/* Số điện thoại */}
              <div className="grid grid-cols-3 items-start gap-4">
                <label className="pt-2 text-start text-sm text-gray-700">
                  Số điện thoại
                </label>
                <div className="col-span-2">
                  <input
                    type="tel"
                    {...registerProfile("phone", {
                      pattern: {
                        value: /^\d{10,11}$/,
                        message: "Số điện thoại phải có 10-11 chữ số",
                      },
                    })}
                    disabled={updateProfileMutation.isPending}
                    className={`w-full rounded border px-4 py-2 text-sm focus:outline-none ${
                      errorsProfile.phone
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-red-700"
                    } disabled:bg-gray-50`}
                    placeholder="Nhập số điện thoại"
                  />
                  {errorsProfile.phone && (
                    <p className="mt-1 text-xs text-red-600">
                      {errorsProfile.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="grid grid-cols-3 items-start gap-4">
                <label className="pt-2 text-start text-sm text-gray-700">
                  Email <span className="text-red-600">*</span>
                </label>
                <div className="col-span-2">
                  <input
                    type="email"
                    {...registerProfile("email", {
                      required: "Email là bắt buộc",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email không hợp lệ",
                      },
                    })}
                    disabled={updateProfileMutation.isPending}
                    className={`w-full rounded border px-4 py-2 text-sm focus:outline-none ${
                      errorsProfile.email
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-red-700"
                    } disabled:bg-gray-50`}
                    placeholder="Nhập email"
                  />
                  {errorsProfile.email && (
                    <p className="mt-1 text-xs text-red-600">
                      {errorsProfile.email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="flex items-center gap-2 rounded bg-red-700 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-red-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
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
        </form>
      </div>
    );
  };

  // ==================== RENDER ADDRESS ====================
  // ==================== RENDER ADDRESS ====================
  const renderAddressContent = () => {
    if (isLoadingAddresses) {
      return (
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-red-700" />
            <span className="ml-2 text-gray-600">Đang tải địa chỉ...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-black">Địa chỉ của tôi</h2>
          <button
            onClick={() => openAddressModal()}
            disabled={createAddressMutation.isPending}
            className="flex items-center gap-2 rounded bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-800 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Thêm địa chỉ mới
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p>Chưa có địa chỉ nào</p>
            <button
              onClick={() => openAddressModal()}
              className="mt-4 text-sm text-red-700 hover:underline"
            >
              Thêm địa chỉ đầu tiên
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="rounded-lg border border-gray-200 p-4 transition-all hover:border-red-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">
                        {address.recipient_name}
                      </h3>
                      {address.is_default && (
                        <span className="rounded border border-red-600 px-2 py-0.5 text-xs text-red-600">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <p className="mb-1 text-sm text-gray-600">
                      Số điện thoại: {address.recipient_phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.address_line1}
                      {address.ward && `, ${address.ward}`}
                      {address.district && `, ${address.district}`}
                      {address.city && `, ${address.city}`}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      disabled={deleteAddressMutation.isPending}
                      className="rounded p-2 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                      title="Xóa"
                    >
                      {deleteAddressMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {!address.is_default && (
                  <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
                    <button
                      onClick={() => handleSetDefaultAddress(address.id)}
                      disabled={setDefaultAddressMutation.isPending}
                      className="text-sm text-blue-600 transition-colors hover:text-blue-800 disabled:opacity-50"
                    >
                      {setDefaultAddressMutation.isPending ? (
                        <span className="flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Đang xử lý...
                        </span>
                      ) : (
                        "Đặt làm mặc định"
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Address Modal - TỰ NHẬP */}
        {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
                </h3>
                <button
                  onClick={closeAddressModal}
                  className="rounded p-1 transition-colors hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmitAddress(onSubmitAddress)}>
                <div className="space-y-4">
                  {/* Họ và tên + Số điện thoại */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Họ và tên */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Họ và tên <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        {...registerAddress("fullName", {
                          required: "Họ và tên là bắt buộc",
                          minLength: {
                            value: 2,
                            message: "Họ và tên phải có ít nhất 2 ký tự",
                          },
                        })}
                        className={`w-full rounded border px-3 py-2 text-sm focus:outline-none ${
                          errorsAddress.fullName
                            ? "border-red-500 focus:border-red-600"
                            : "border-gray-300 focus:border-red-700"
                        }`}
                        placeholder="Nhập họ và tên"
                      />
                      {errorsAddress.fullName && (
                        <p className="mt-1 text-xs text-red-600">
                          {errorsAddress.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* Số điện thoại */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Số điện thoại <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        {...registerAddress("phone", {
                          required: "Số điện thoại là bắt buộc",
                          pattern: {
                            value: /^\d{10,11}$/,
                            message: "Số điện thoại phải có 10-11 chữ số",
                          },
                        })}
                        className={`w-full rounded border px-3 py-2 text-sm focus:outline-none ${
                          errorsAddress.phone
                            ? "border-red-500 focus:border-red-600"
                            : "border-gray-300 focus:border-red-700"
                        }`}
                        placeholder="Ví dụ: 0987654321"
                      />
                      {errorsAddress.phone && (
                        <p className="mt-1 text-xs text-red-600">
                          {errorsAddress.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Số nhà, tên đường (Địa chỉ chi tiết) */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Số nhà, tên đường <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...registerAddress("street", {
                        required: "Địa chỉ chi tiết là bắt buộc",
                        minLength: {
                          value: 5,
                          message: "Địa chỉ phải có ít nhất 5 ký tự",
                        },
                      })}
                      className={`w-full rounded border px-3 py-2 text-sm focus:outline-none ${
                        errorsAddress.street
                          ? "border-red-500 focus:border-red-600"
                          : "border-gray-300 focus:border-red-700"
                      }`}
                      placeholder="Ví dụ: Số 10, Phố Hàng Bạc"
                    />
                    {errorsAddress.street && (
                      <p className="mt-1 text-xs text-red-600">
                        {errorsAddress.street.message}
                      </p>
                    )}
                  </div>

                  {/* Phường/Xã, Quận/Huyện, Tỉnh/TP */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Phường/Xã */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Phường/Xã <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        {...registerAddress("ward", {
                          required: "Phường/Xã là bắt buộc",
                        })}
                        className={`w-full rounded border px-3 py-2 text-sm focus:outline-none ${
                          errorsAddress.ward
                            ? "border-red-500 focus:border-red-600"
                            : "border-gray-300 focus:border-red-700"
                        }`}
                        placeholder="Ví dụ: Hàng Bạc"
                      />
                      {errorsAddress.ward && (
                        <p className="mt-1 text-xs text-red-600">
                          {errorsAddress.ward.message}
                        </p>
                      )}
                    </div>

                    {/* Quận/Huyện */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Quận/Huyện <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        {...registerAddress("district", {
                          required: "Quận/Huyện là bắt buộc",
                        })}
                        className={`w-full rounded border px-3 py-2 text-sm focus:outline-none ${
                          errorsAddress.district
                            ? "border-red-500 focus:border-red-600"
                            : "border-gray-300 focus:border-red-700"
                        }`}
                        placeholder="Ví dụ: Hoàn Kiếm"
                      />
                      {errorsAddress.district && (
                        <p className="mt-1 text-xs text-red-600">
                          {errorsAddress.district.message}
                        </p>
                      )}
                    </div>

                    {/* Tỉnh/Thành phố */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Tỉnh/Thành phố <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        {...registerAddress("province", {
                          required: "Tỉnh/Thành phố là bắt buộc",
                        })}
                        className={`w-full rounded border px-3 py-2 text-sm focus:outline-none ${
                          errorsAddress.province
                            ? "border-red-500 focus:border-red-600"
                            : "border-gray-300 focus:border-red-700"
                        }`}
                        placeholder="Ví dụ: Hà Nội"
                      />
                      {errorsAddress.province && (
                        <p className="mt-1 text-xs text-red-600">
                          {errorsAddress.province.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Gợi ý định dạng */}
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-600">
                      <strong>Ví dụ địa chỉ đầy đủ:</strong>
                      <br />
                      Số 10, Phố Hàng Bạc, Phường Hàng Bạc, Quận Hoàn Kiếm, Hà
                      Nội
                    </p>
                  </div>

                  {/* Đặt làm mặc định */}
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 p-3">
                    <input
                      type="checkbox"
                      id="isDefault"
                      {...registerAddress("isDefault")}
                      className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <label
                      htmlFor="isDefault"
                      className="text-sm text-gray-700"
                    >
                      Đặt làm địa chỉ mặc định
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeAddressModal}
                    className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={
                      createAddressMutation.isPending ||
                      updateAddressMutation.isPending
                    }
                    className="flex items-center gap-2 rounded bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-800 disabled:opacity-50"
                  >
                    {(createAddressMutation.isPending ||
                      updateAddressMutation.isPending) && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {editingAddress ? "Cập nhật" : "Thêm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==================== RENDER PASSWORD ====================
  const renderPasswordContent = () => {
    return (
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <h2 className="mb-8 text-xl font-bold text-black">Đổi mật khẩu</h2>

        <form
          onSubmit={handleSubmitPassword(onSubmitPassword)}
          className="mx-auto max-w-xl space-y-6"
        >
          {/* Mật khẩu hiện tại */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Mật khẩu hiện tại <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                {...registerPassword("currentPassword", {
                  required: "Mật khẩu hiện tại là bắt buộc",
                })}
                className={`w-full rounded border px-4 py-2 pr-10 text-sm focus:outline-none ${
                  errorsPassword.currentPassword
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-300 focus:border-red-700"
                }`}
                placeholder="Nhập mật khẩu hiện tại"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errorsPassword.currentPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errorsPassword.currentPassword.message}
              </p>
            )}
          </div>

          {/* Mật khẩu mới */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Mật khẩu mới <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                {...registerPassword("newPassword", {
                  required: "Mật khẩu mới là bắt buộc",
                  minLength: {
                    value: 8,
                    message: "Mật khẩu phải có ít nhất 8 ký tự",
                  },
                  validate: (value) =>
                    value !== watchPassword("currentPassword") ||
                    "Mật khẩu mới phải khác mật khẩu hiện tại",
                })}
                className={`w-full rounded border px-4 py-2 pr-10 text-sm focus:outline-none ${
                  errorsPassword.newPassword
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-300 focus:border-red-700"
                }`}
                placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errorsPassword.newPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errorsPassword.newPassword.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Mật khẩu phải có ít nhất 8 ký tự
            </p>
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Xác nhận mật khẩu mới <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...registerPassword("confirmPassword", {
                  required: "Vui lòng xác nhận mật khẩu mới",
                  validate: (value) =>
                    value === watchPassword("newPassword") ||
                    "Mật khẩu xác nhận không khớp",
                })}
                className={`w-full rounded border px-4 py-2 pr-10 text-sm focus:outline-none ${
                  errorsPassword.confirmPassword
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-300 focus:border-red-700"
                }`}
                placeholder="Nhập lại mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errorsPassword.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errorsPassword.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Yêu cầu mật khẩu */}
          <div className="rounded-lg bg-blue-50 p-4">
            <h4 className="mb-2 text-sm font-semibold text-blue-900">
              Yêu cầu mật khẩu:
            </h4>
            <ul className="space-y-1 text-xs text-blue-800">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3" />
                Tối thiểu 8 ký tự
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3" />
                Nên bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3" />
                Không trùng với mật khẩu hiện tại
              </li>
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => resetPasswordForm()}
              disabled={resetPasswordMutation.isPending}
              className="rounded border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="flex items-center gap-2 rounded bg-red-700 px-6 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-red-800 hover:shadow-lg disabled:opacity-50"
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Đổi mật khẩu"
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderOrderContent = () => {
    // Trạng thái Loading
    if (isLoadingOrder) {
      return (
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-black"></div>
          <p className="text-xs font-medium text-gray-400 tracking-widest uppercase">
            Đang tải dữ liệu...
          </p>
        </div>
      );
    }

    // Xử lý dữ liệu sang mảng
    const orders = Array.isArray(orderData?.data)
      ? orderData.data
      : orderData?.data
        ? [orderData.data]
        : [];

    // Không có dữ liệu
    if (orders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
          <div className="p-4 bg-white rounded-full shadow-sm mb-4">
            <Package className="h-8 w-8 text-gray-200" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">
            Không tìm thấy đơn hàng
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Lịch sử giao dịch của bạn sẽ xuất hiện tại đây.
          </p>
        </div>
      );
    }

    // Giao diện CHI TIẾT nếu đã chọn đơn hàng
    if (selectedOrder) {
      return (
        <OrderDetailView
          order={selectedOrder}
          onBack={() => setSelectedOrder(null)}
        />
      );
    }

    // Giao diện BẢNG DANH SÁCH
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-white">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <ReceiptText className="h-4 w-4" /> Lịch sử mua hàng
          </h2>
          <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">
            {orders.length} Giao dịch
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">
                  Tổng tiền
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50/30 transition-all group"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                      {order.order_code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                      {order.order_items.slice(0, 3).map((item, idx) => (
                        <img
                          key={idx}
                          className="h-7 w-7 rounded-full ring-2 ring-white object-cover shadow-sm border border-gray-100"
                          src={item.variant.product.thumbnail}
                          alt="product"
                        />
                      ))}
                      {order.order_items.length > 3 && (
                        <div className="h-7 w-7 flex items-center justify-center rounded-full bg-gray-100 text-[9px] font-bold text-gray-500 ring-2 ring-white">
                          +{order.order_items.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                    {Number(order.grand_total).toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4">
                    {getStatusStyle(order.order_status)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span className="text-[11px] font-bold uppercase">
                        Chi tiết
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderLogoutContent = () => {
    const handleLogout = async () => {
      console.log("Thực hiện đăng xuất...");

      // Gọi backend để xóa refresh cookie (kể cả fail cũng không sao)
      await logout();

      // Clear toàn bộ state phía FE
      queryClient.clear();

      toast.success("Đăng xuất thành công");
      navigate({ to: "/" });
    };

    return (
      <div className="flex items-center justify-center min-h-[400px] w-full bg-gray-50/50 rounded-xl">
        <div className="bg-white p-10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] max-w-md w-full border border-gray-100 transition-all">
          {/* Icon Wrapper */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full blur-lg opacity-50"></div>
              <div className="relative bg-red-50 p-5 rounded-full">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Xác nhận đăng xuất
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Bạn có chắc chắn muốn thoát khỏi tài khoản
              <span className="font-semibold text-gray-700 block mt-1">
                Tôn Ngộ Không?
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className=" w-full text-center">
            <button
              onClick={handleLogout}
              className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-white bg-[#ee0000] hover:bg-red-700 shadow-lg shadow-red-200 transition-all duration-200 active:scale-95"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==================== RENDER CONTENT ====================
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileContent();
      case "address":
        return renderAddressContent();
      case "password":
        return renderPasswordContent();
      case "orders":
        return renderOrderContent();
      case "logout":
        return renderLogoutContent();
      default:
        return (
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <p className="text-center text-gray-500">
              Tính năng đang được phát triển...
            </p>
          </div>
        );
    }
  };

  // ==================== MAIN RENDER ====================
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
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
                    {watchProfile("fullName") || "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {watchProfile("email")}
                  </p>
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
                              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                                activeTab === sub.id
                                  ? "bg-red-50 font-medium text-red-700"
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
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        activeTab === item.id
                          ? "bg-red-50 font-medium text-red-700"
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
          <div className="lg:col-span-3">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
