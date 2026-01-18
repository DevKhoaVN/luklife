import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  Trash2,
  Loader2,
  UserX,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  SquarePen,
  X,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  useGetAllUsers,
  useDeleteUser,
  useUpdatePasswordUser,
} from "../../hooks/useUser";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/dashboard/customers")({
  component: Customers,
});

function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { data: response, isLoading } = useGetAllUsers();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutate: editPassUser, isPending: isUpdating } =
    useUpdatePasswordUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const allUsers = response?.data?.data || [];

  const filteredUsers = allUsers.filter(
    (user: any) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm),
  );

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowPassword(false);
    reset();
  };

  const onUpdatePassword = (data: any) => {
    editPassUser(
      { userId: selectedUser.id, newPassword: data.password },
      {
        onSuccess: () => {
          alert("Đổi mật khẩu thành công!");
          handleCloseModal();
        },
      },
    );
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      deleteUser(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý khách hàng
          </h1>
          <p className="text-sm text-gray-500">
            Hiển thị {filteredUsers.length} trên tổng số{" "}
            {response?.data?.total || 0} người dùng
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Liên hệ
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Thông tin
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user: any) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.avatar ||
                            `https://ui-avatars.com/api/?name=${user.full_name}&background=random`
                          }
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
                        />
                        <div>
                          <div className="text-sm font-bold text-gray-900">
                            {user.full_name}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono uppercase tracking-tight">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium tracking-tight">
                          <Mail size={14} className="text-gray-400" />{" "}
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} className="text-gray-400" />{" "}
                          {user.phone || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />{" "}
                          {user.date_of_birth || "N/A"}
                        </div>
                        <div className="text-xs text-gray-400 capitalize">
                          {user.gender === "female"
                            ? "Nữ"
                            : user.gender === "male"
                              ? "Nam"
                              : "Khác"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.is_active === 1 ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}
                      >
                        {user.is_active === 1 ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <XCircle size={12} />
                        )}
                        {user.is_active === 1 ? "Đang hoạt động" : "Đã khóa"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={isDeleting}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          {isDeleting ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-20 text-center text-gray-400"
                  >
                    <UserX size={48} className="mx-auto mb-2 opacity-20" />{" "}
                    Không tìm thấy khách hàng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ENTERPRISE UPDATE PASSWORD MODAL --- */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px]"
            onClick={handleCloseModal}
          />

          <div className="relative bg-white w-full max-w-[380px] rounded-sm shadow-xl animate-in fade-in zoom-in duration-200 border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Cập nhật bảo mật
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md mb-6 border border-gray-100">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-sm shrink-0 overflow-hidden">
                  {selectedUser.avatar ? (
                    <img
                      src={selectedUser.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold">
                      {selectedUser.full_name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {selectedUser.full_name}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onUpdatePassword)}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-tight">
                    Mật khẩu hệ thống mới
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"} // Type input thay đổi theo state
                      {...register("password", {
                        required: "Vui lòng không để trống",
                        minLength: { value: 6, message: "Tối thiểu 6 ký tự" },
                      })}
                      placeholder="Nhập mật khẩu mới..."
                      className={`w-full px-4 pr-10 py-2.5 bg-white border rounded-md text-sm outline-none transition-all ${
                        errors.password
                          ? "border-red-500 focus:border-red-600"
                          : "border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                      }`}
                      autoFocus
                    />
                    <button
                      type="button" // QUAN TRỌNG: Phải là type="button" để không trigger submit form
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-red-500 font-medium flex items-center gap-1">
                      <AlertCircle size={12} />{" "}
                      {errors.password.message as string}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-[0.99] disabled:bg-gray-400 flex items-center justify-center gap-2 rounded-sm shadow-sm"
                  >
                    {isUpdating ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      "Xác nhận thay đổi"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full py-2 text-[11px] font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-tight"
                  >
                    Hủy bỏ thao tác
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
