import React, { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  AlertTriangle,
  Save,
} from "lucide-react";
import {
  useGetAllProducts,
  useDeleteProduct,
  useUpdateProduct,
} from "../../../hooks/usePorduct"; // Đảm bảo import đúng hooks

// --- CONFIG ROUTE ---
export const Route = createFileRoute("/dashboard/products/")({
  component: ProductList,
});

// --- UI HELPERS ---
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Badge = ({ children, variant = "default" }) => {
  const styles = {
    default: "bg-zinc-100 text-zinc-600",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
  };
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border tracking-wider",
        styles[variant]
      )}
    >
      {children}
    </span>
  );
};

// --- COMPONENT: MODAL BASE ---
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-zinc-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 bg-zinc-50/50">
          <h3 className="font-semibold text-zinc-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-200 rounded text-zinc-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function ProductList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // State cho Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // State form edit nhanh
  const [editFormData, setEditFormData] = useState({ name: "", price: "" });

  // Hooks API
  const { data: apiResponse, isLoading, isError } = useGetAllProducts();
  const deleteMutation = useDeleteProduct();
  const updateMutation = useUpdateProduct(); // Giả sử bạn có hook này

  // Data processing
  const products = apiResponse?.data?.data || [];

  // --- LOGIC XÓA ---
  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedProduct) return;
    deleteMutation.mutate(selectedProduct.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
      },
    });
  };

  // --- LOGIC SỬA (Quick Edit) ---
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditFormData({
      name: product.name,
      price: product.price,
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const confirmEdit = () => {
    if (!selectedProduct) return;

    // Gọi API update
    updateMutation.mutate(
      {
        id: selectedProduct.id,
        ...selectedProduct, // Giữ các trường cũ
        ...editFormData, // Ghi đè trường mới
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        },
      }
    );
  };

  // Lọc client-side
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading)
    return (
      <div className="p-10 text-center">
        <Loader2 className="animate-spin h-8 w-8 mx-auto text-zinc-400" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-10 font-sans antialiased text-zinc-900">
      <main className="mx-auto max-w-6xl px-6 pt-10">
        {/* Header & Filter giữ nguyên như cũ... */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Sản phẩm
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Danh sách hàng hóa trong kho của bạn.
            </p>
          </div>
          <Link
            to="/dashboard/products/create"
            className="flex items-center justify-center gap-2 bg-zinc-900 px-4 py-2 text-sm font-bold text-white rounded-md hover:bg-zinc-800 transition-all shadow-sm active:scale-95"
          >
            <Plus className="h-4 w-4" /> Thêm sản phẩm
          </Link>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  Danh mục
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  Giá bán
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-zinc-500 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-zinc-50/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-md border border-zinc-100 bg-zinc-50 overflow-hidden flex-shrink-0">
                        <img
                          src={product.thumbnail}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/150")
                          }
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-zinc-900 line-clamp-1">
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {product.categories?.map((c) => (
                        <Badge key={c.id}>{c.name}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-700">
                    {Number(product.price).toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      {/* Nút Sửa mở Modal */}
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 hover:bg-zinc-100 rounded-md text-zinc-500 hover:text-zinc-900 transition-all"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      {/* Nút Xóa mở Modal */}
                      <button
                        onClick={() => openDeleteModal(product)}
                        className="p-2 hover:bg-red-50 rounded-md text-zinc-300 hover:text-red-600 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* --- MODAL XÓA --- */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Xác nhận xóa"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h4 className="text-lg font-medium text-zinc-900 mb-2">
            Bạn có chắc chắn?
          </h4>
          <p className="text-sm text-zinc-500 mb-6">
            Hành động này sẽ xóa sản phẩm{" "}
            <strong className="text-zinc-900">{selectedProduct?.name}</strong>{" "}
            khỏi hệ thống và không thể hoàn tác.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 px-4 py-2 border border-zinc-300 text-zinc-700 font-medium rounded-md hover:bg-zinc-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              {deleteMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Xóa ngay
            </button>
          </div>
        </div>
      </Modal>

      {/* --- MODAL EDIT NHANH --- */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh sửa nhanh"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
              Tên sản phẩm
            </label>
            <input
              type="text"
              name="name"
              value={editFormData.name}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
              Giá bán (VNĐ)
            </label>
            <input
              type="number"
              name="price"
              value={editFormData.price}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-sm text-zinc-500 font-medium hover:bg-zinc-100 rounded-md"
            >
              Hủy
            </button>
            <button
              onClick={confirmEdit}
              disabled={updateMutation.isPending}
              className="px-4 py-2 bg-zinc-900 text-white text-sm font-bold rounded-md hover:bg-zinc-800 flex items-center gap-2"
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Lưu thay đổi
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
