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
} from "lucide-react";
import { useGetUsers, useDeleteUser } from "../hooks/useUser";

export const Route = createFileRoute("/dashboard/customers")({
  component: Customers,
});

function Customers() {
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy dữ liệu từ Hook (Bạn cần điều chỉnh hook cho đúng với API)
  const { data: usersData, isLoading } = useGetUsers();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  // Logic Tìm kiếm: theo tên, email hoặc số điện thoại
  const filteredUsers =
    usersData?.data?.filter(
      (user: any) =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm),
    ) || [];

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa khách hàng này? Hành động này không thể hoàn tác.",
      )
    ) {
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Danh sách khách hàng
        </h1>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Thông tin liên hệ
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Ngày sinh / Giới tính
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user: any) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar & Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${user.full_name}`
                        }
                        alt={user.full_name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {user.full_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: #{user.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} /> {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} /> {user.phone}
                      </div>
                    </div>
                  </td>

                  {/* Gender & DOB */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />{" "}
                      {user.date_of_birth || "Chưa cập nhật"}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 uppercase">
                      Giới tính:{" "}
                      {user.gender === "male"
                        ? "Nam"
                        : user.gender === "female"
                          ? "Nữ"
                          : "Khác"}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {user.is_active ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle2 size={12} /> Hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <XCircle size={12} /> Bị khóa
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={isDeleting}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa người dùng"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <UserX size={48} strokeWidth={1} />
                    <p>Không tìm thấy khách hàng phù hợp</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
