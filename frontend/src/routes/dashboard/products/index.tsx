import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import React, { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  X,
  AlertTriangle,
  Save,
  XCircle,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit2,
  Trash,
  SquarePen,
} from "lucide-react";

// Import hooks thật từ project
import {
  useGetAllProducts,
  useDeleteProduct,
  useUpdateProduct,
} from "../../../hooks/usePorduct";

// Hàm gọi API tìm kiếm (bạn đã cung cấp)
export const searchProduct = async (
  searchKey: string | undefined,
  page: number,
) => {
  const response = await apiClient.get(
    `/product?search=${searchKey || ""}&page=${page}`,
  );
  return response.data;
};

export const Route = createFileRoute("/dashboard/products/")({
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) || 1,
    search: (search.search as string) || "",
  }),
  component: ProductList,
});

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// Format currency
const formatCurrency = (value: number | string) => {
  if (!value) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value));
};

// Generate Slug
const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

const Badge = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning";
}) => {
  const styles = {
    default: "bg-zinc-100 text-zinc-600",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
  };
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border tracking-wider",
        styles[variant],
      )}
    >
      {children}
    </span>
  );
};

// Modal Component
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "md" | "lg" | "xl";
}) => {
  if (!isOpen) return null;

  const sizes = {
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={cn(
          "bg-white rounded-lg shadow-xl w-full overflow-hidden border border-zinc-200 flex flex-col max-h-[90vh]",
          sizes[size],
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
          <h3 className="font-semibold text-zinc-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-200 rounded text-zinc-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>
  );
};

// Simplified useForm
const useForm = (defaultValues: Record<string, any>) => {
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});

  const register = (name: string, rules: { required?: string } = {}) => ({
    name,
    value: values[name] || "",
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const value = e.target.value;
      setValues((prev) => ({ ...prev, [name]: value }));
      if (rules.required && !value) {
        setErrors((prev) => ({ ...prev, [name]: rules.required }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
  });

  const setValue = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const reset = (newValues: Record<string, any>) => {
    setValues(newValues);
    setErrors({});
  };

  return { register, values, setValue, reset, errors };
};

// Edit Modal
const EditProductModal = ({
  isOpen,
  onClose,
  product,
  onSave,
  isPending,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onSave: (data: FormData) => void;
  isPending: boolean;
}) => {
  const [variants, setVariants] = useState<any[]>([]);

  const { register, values, setValue, reset, errors } = useForm({
    name: "",
    slug: "",
    price: "",
    discount_percentage: 0,
    is_featured: false,
    description: "",
    thumbnail: "",
    thumbnailFile: null,
  });

  React.useEffect(() => {
    if (values.name) {
      setValue("slug", generateSlug(values.name));
    }
  }, [values.name, setValue]);

  React.useEffect(() => {
    if (product && isOpen) {
      reset({
        name: product.name || "",
        slug: product.slug || "",
        price: product.price || "",
        discount_percentage: product.discount_percentage || 0,
        is_featured: product.is_featured || false,
        description: product.description || "",
        thumbnail: product.thumbnail || "",
        thumbnailFile: null,
      });

      setVariants(
        product.product_variants?.map((v: any) => ({
          ...v,
          tempId: Math.random().toString(36).substr(2, 9),
          isExisting: true,
        })) || [],
      );
    }
  }, [product, isOpen, reset]);

  React.useEffect(() => {
    setVariants((prev) =>
      prev.map((v) => ({
        ...v,
        sale_price: values.price,
      })),
    );
  }, [values.price]);

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        tempId: Math.random().toString(36).substr(2, 9),
        color: "",
        size: "",
        sale_price: values.price || 0,
        stock_quantity: 0,
        image_url: "",
        imageFile: null,
        isExisting: false,
      },
    ]);
  };

  const removeVariant = (tempId: string) => {
    setVariants((prev) => prev.filter((v) => v.tempId !== tempId));
  };

  const updateVariant = (tempId: string, field: string, value: any) => {
    setVariants((prev) =>
      prev.map((v) => (v.tempId === tempId ? { ...v, [field]: value } : v)),
    );
  };

  const handleVariantImageChange = (
    tempId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateVariant(tempId, "image_url", reader.result as string);
        updateVariant(tempId, "imageFile", file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("thumbnailFile", file);
      const reader = new FileReader();
      reader.onloadend = () => setValue("thumbnail", reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!values.name || !values.price) return;

    const formData = new FormData();
    formData.append("id", product.id);
    formData.append("name", values.name);
    formData.append("slug", values.slug);
    formData.append("price", parseInt(values.price, 10).toString());
    formData.append(
      "discount_percentage",
      values.discount_percentage.toString(),
    );
    formData.append("is_featured", values.is_featured ? "1" : "0");
    formData.append("description", values.description);

    if (values.thumbnailFile)
      formData.append("thumbnail", values.thumbnailFile);

    variants.forEach((v, index) => {
      if (v.id) formData.append(`variants[${index}][id]`, v.id);
      formData.append(`variants[${index}][color]`, v.color);
      formData.append(`variants[${index}][size]`, v.size);
      formData.append(
        `variants[${index}][sale_price]`,
        parseInt(v.sale_price, 10).toString(),
      );
      formData.append(
        `variants[${index}][stock_quantity]`,
        v.stock_quantity.toString(),
      );
      if (v.imageFile)
        formData.append(`variants[${index}][image_url]`, v.imageFile);
    });

    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chỉnh sửa sản phẩm"
      size="xl"
    >
      <div className="space-y-6">
        <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name", { required: "Bắt buộc" })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                Giá bán
              </label>
              <input
                type="number"
                {...register("price", { required: "Bắt buộc" })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                Giảm giá %
              </label>
              <input
                type="number"
                {...register("discount_percentage")}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                Mô tả sản phẩm
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm custom-scrollbar resize-none focus:outline-none focus:ring-2 focus:ring-zinc-300"
                placeholder="Nhập mô tả chi tiết sản phẩm..."
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                Ảnh đại diện
              </label>
              <input
                type="file"
                onChange={handleThumbnailChange}
                className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 transition-colors"
              />
              {values.thumbnail && (
                <img
                  src={values.thumbnail}
                  alt="Thumbnail preview"
                  className="h-16 w-16 mt-2 rounded border object-cover"
                />
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-blue-700 uppercase">
              Biến thể ({variants.length})
            </h4>
            <button
              onClick={addVariant}
              type="button"
              className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> Thêm biến thể
            </button>
          </div>

          <div className="space-y-3">
            {variants.map((variant: any) => (
              <div
                key={variant.tempId}
                className={cn(
                  "p-3 rounded-md border relative transition-all",
                  variant.isExisting
                    ? "bg-white border-zinc-200"
                    : "bg-green-50 border-green-200",
                )}
              >
                <button
                  type="button"
                  onClick={() => removeVariant(variant.tempId)}
                  className="absolute -top-2 -right-2 z-10 p-1 bg-red-100 text-red-500 rounded-full hover:bg-red-200 hover:scale-110 transition-all shadow-sm border border-red-200"
                >
                  <X className="h-3 w-3" />
                </button>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-400">
                      Màu
                    </label>
                    <input
                      value={variant.color}
                      onChange={(e) =>
                        updateVariant(variant.tempId, "color", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-zinc-200 rounded text-sm h-8 focus:outline-none focus:ring-2 focus:ring-zinc-300"
                      placeholder="Màu..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-400">
                      Size
                    </label>
                    <input
                      value={variant.size}
                      onChange={(e) =>
                        updateVariant(variant.tempId, "size", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-zinc-200 rounded text-sm h-8 focus:outline-none focus:ring-2 focus:ring-zinc-300"
                      placeholder="Size..."
                    />
                  </div>

                  <input type="hidden" value={variant.sale_price || ""} />

                  <div className="flex items-end">
                    <label className="cursor-pointer bg-zinc-100 hover:bg-zinc-200 text-zinc-600 px-3 py-1.5 rounded text-xs w-full text-center h-8 flex items-center justify-center border border-zinc-200 transition-colors">
                      {variant.image_url ? "Đổi ảnh" : "Up ảnh"}
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          handleVariantImageChange(variant.tempId, e)
                        }
                      />
                    </label>
                  </div>
                </div>

                {variant.image_url && (
                  <div className="mt-2">
                    <img
                      src={variant.image_url}
                      alt=""
                      className="h-10 w-10 rounded object-cover border"
                    />
                  </div>
                )}
              </div>
            ))}
            {variants.length === 0 && (
              <div className="text-center py-4 text-zinc-400 text-sm italic">
                Chưa có biến thể nào
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-4 py-2 bg-zinc-900 text-white text-sm font-bold rounded-md hover:bg-zinc-800 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Lưu thay đổi
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Main Component
export default function ProductList() {
  const navigate = useNavigate();
  const { page = 1, search: urlSearch = "" } = useSearch({
    from: "/dashboard/products/",
  });

  // State cho input tìm kiếm
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Gọi API với page và urlSearch
  const { data: apiResponse, isLoading } = useGetAllProducts({
    search: urlSearch,
    page,
  });

  const products = apiResponse?.data?.data || [];
  const pagination = apiResponse?.data || {
    current_page: page,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
  };

  const deleteMutation = useDeleteProduct();
  const updateMutation = useUpdateProduct();

  // Xử lý tìm kiếm
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchInput.trim();
    navigate({
      search: (prev: any) => ({
        ...prev,
        search: trimmed,
        page: 1,
      }),
    });
  };

  // Xử lý Enter trong input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Xóa tìm kiếm
  const handleClearSearch = () => {
    setSearchInput("");
    navigate({
      search: (prev: any) => ({
        ...prev,
        search: "",
        page: 1,
      }),
    });
  };

  // Chuyển trang
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.last_page) return;
    navigate({
      search: (prev: any) => ({ ...prev, page: newPage }),
    });
  };

  const openDeleteModal = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedProduct) return;

    deleteMutation.mutate(selectedProduct.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);

        if (products.length === 1 && page > 1) {
          handlePageChange(page - 1);
        }
      },
    });
  };

  const handleSaveEdit = (data: FormData) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setSelectedProduct(null);
      },
    });
  };

  const openEditModal = (p: any) => {
    setSelectedProduct(p);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-10 flex justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-zinc-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-10 font-sans text-zinc-900">
      <main className="mx-auto max-w-6xl px-6 pt-10">
        {/* Header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold">Sản phẩm</h1>
            <p className="text-zinc-500 text-sm">
              Quản lý kho hàng ({pagination.total || 0} sản phẩm)
            </p>
          </div>
          <button className="bg-zinc-900 text-white px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 hover:bg-zinc-800 transition-colors">
            <Plus className="h-4 w-4" /> Thêm mới
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tìm kiếm sản phẩm theo tên..."
                className="w-full pl-10 pr-10 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300"
              />
              {searchInput && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => handleSearch()}
              className="px-4 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Tìm kiếm
            </button>
          </div>
          {urlSearch && (
            <p className="text-xs text-zinc-500 mt-2">
              Kết quả tìm kiếm cho: <strong>"{urlSearch}"</strong>
            </p>
          )}
        </div>

        {/* Table */}
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mb-4">
          <table className="w-full text-left">
            <thead className="bg-zinc-50/50 border-b border-zinc-100">
              <tr>
                <th className="px-6 py-3 text-[11px] uppercase font-bold text-zinc-500">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-[11px] uppercase font-bold text-zinc-500">
                  Giá
                </th>
                <th className="px-6 py-3 text-[11px] uppercase font-bold text-zinc-500 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {products.map((product: any) => (
                <tr
                  key={product.id}
                  className="hover:bg-zinc-50/50 transition-colors"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.thumbnail}
                        className="h-10 w-10 rounded object-cover border border-zinc-100"
                        alt=""
                      />
                      <div>
                        <div className="font-bold text-sm text-zinc-900">
                          {product.name}
                        </div>
                        <div className="text-xs text-zinc-500">
                          ID: {product.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-zinc-700">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 hover:bg-zinc-100 rounded text-zinc-400 hover:text-zinc-900 transition-colors"
                      >
                        <SquarePen className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(product)}
                        className="p-2 hover:bg-zinc-100 rounded text-zinc-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="p-12 text-center text-zinc-400 text-sm">
              {urlSearch
                ? `Không tìm thấy sản phẩm nào với từ khóa "${urlSearch}"`
                : "Không tìm thấy sản phẩm nào."}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="flex items-center justify-between px-6 py-4 text-sm text-zinc-600 bg-white border border-zinc-200 rounded-lg">
            <div>
              Hiển thị {pagination.from || 0}-{pagination.to || 0} trong tổng{" "}
              {pagination.total} sản phẩm
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-medium min-w-[100px] text-center">
                Trang {page} / {pagination.last_page}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pagination.last_page}
                className="p-2 rounded border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Delete Modal - giữ nguyên code cũ của bạn */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Xác nhận xóa"
        size="md"
      >
        <div className="flex flex-col items-center text-center pt-2">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h4 className="text-lg font-bold text-zinc-900 mb-2">
            Bạn có chắc chắn muốn xóa?
          </h4>
          <p className="text-sm text-zinc-500 mb-6 max-w-xs mx-auto">
            Sản phẩm{" "}
            <strong className="text-zinc-900">{selectedProduct?.name}</strong>{" "}
            sẽ bị xóa vĩnh viễn khỏi hệ thống. Hành động này không thể hoàn tác.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 px-4 py-2 border border-zinc-200 text-zinc-700 font-medium rounded-md hover:bg-zinc-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-red-200"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Xóa ngay
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        onSave={handleSaveEdit}
        isPending={updateMutation.isPending}
      />
    </div>
  );
}
