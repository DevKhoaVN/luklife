import React, { useMemo, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import axios from "axios"; // Đảm bảo bạn đã cài axios
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Package,
  Save,
  Layers,
  Settings,
  X,
  Check,
  Loader2,
} from "lucide-react";

import { useGetCategories } from "../hooks/Category";
import CategorySelector from "../components/CategorySelector";
import { useCreateProduct } from "../hooks/usePorduct";

// --- UI COMPONENTS ---
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Badge = ({ children, variant = "default", onRemove }) => {
  const styles = {
    default: "bg-zinc-100 text-zinc-600 border-zinc-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase border tracking-wider transition-all",
        styles[variant]
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:text-red-500 ml-1"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};

const Input = React.forwardRef(({ className, error, ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    className={cn(
      "flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10 focus-visible:border-zinc-900",
      error && "border-red-500",
      className
    )}
  />
));

const Label = ({ children, required }) => (
  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 ml-1 mb-1 block">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const Section = ({ title, icon: Icon, children, extra }) => (
  <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
    <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 bg-zinc-50/50">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-zinc-500" />}
        <h2 className="text-[12px] font-bold uppercase tracking-widest text-zinc-800">
          {title}
        </h2>
      </div>
      {extra}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const ImageUpload = ({ value, onChange }) => {
  const preview = useMemo(() => {
    if (!value) return null;
    return typeof value === "string" ? value : URL.createObjectURL(value);
  }, [value]);

  return (
    <div className="group relative flex aspect-square w-full max-w-[150px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 transition-all overflow-hidden cursor-pointer">
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center text-zinc-400">
          <ImageIcon className="h-6 w-6 mb-2" />
          <span className="text-[10px] uppercase font-bold">Tải ảnh</span>
        </div>
      )}
      <input
        type="file"
        className="absolute inset-0 cursor-pointer opacity-0"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(file);
        }}
      />
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function CreateProductForm() {
  const { data: catResponse } = useGetCategories();
  const categories = catResponse?.data?.data || [];
  const { mutateAsync: createProductServer } = useCreateProduct();

  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      name: "",
      category_ids: [],
      price: "",
      discount_percentage: 0,
      description: "",
      is_active: true,
      is_featured: false,
      thumbnail: null,
      variants: [{ color: "", size: "", stock_quantity: 1, image_url: null }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  // --- LOGIC XỬ LÝ SUBMIT TRỰC TIẾP ---
  const handleFormSubmit = async (data) => {
    setServerError(null);
    const formData = new FormData();

    // 1. Append thông tin cơ bản
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("discount_percentage", data.discount_percentage || 0);
    formData.append("description", data.description || "");
    formData.append("is_active", data.is_active ? 1 : 0);
    formData.append("is_featured", data.is_featured ? 1 : 0);

    if (data.thumbnail instanceof File) {
      formData.append("thumbnail", data.thumbnail);
    }

    // 2. Append Danh mục
    data.category_ids.forEach((id, index) => {
      formData.append(`category_ids[${index}]`, id);
    });

    // 3. Tính giá sale chung cho biến thể
    const originalPrice = parseFloat(data.price) || 0;
    const discount = parseFloat(data.discount_percentage) || 0;
    const finalSalePrice = originalPrice * (1 - discount / 100);

    // 4. Append Biến thể
    data.variants.forEach((v, i) => {
      formData.append(`variants[${i}][color]`, v.color);
      formData.append(`variants[${i}][size]`, v.size);
      formData.append(`variants[${i}][stock_quantity]`, v.stock_quantity);
      if (v.image_url instanceof File) {
        formData.append(`variants[${i}][image_url]`, v.image_url);
      }
    });

    try {
      // THAY ĐỔI URL API CỦA BẠN TẠI ĐÂY
      await createProductServer(formData);

      // Nếu thành công (React Query không ném lỗi), ta reset form
      reset();
    } catch (error) {
      console.error("Submit error:", error);
      setServerError(
        error.response?.data?.message || "Có lỗi xảy ra khi lưu sản phẩm."
      );
    }
  };

  const findCategoryName = (items, id) => {
    for (const item of items) {
      if (item.id === id) return item.name;
      if (item.children) {
        const found = findCategoryName(item.children, id);
        if (found) return found;
      }
    }
    return `ID: ${id}`;
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20 font-sans">
      <main className="mx-auto max-w-5xl px-6 pt-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Thêm sản phẩm mới
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Hệ thống quản lý kho hàng trung tâm.
            </p>
          </div>
          <button
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-zinc-900 px-6 py-2 text-sm font-bold text-white rounded-md hover:bg-zinc-800 shadow-lg active:scale-95 disabled:opacity-70 transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
          </button>
        </div>

        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium flex items-center gap-2">
            <X className="h-4 w-4" /> {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* CỘT TRÁI */}
          <div className="space-y-6 lg:col-span-8">
            <Section title="Thông tin chung" icon={Package}>
              <div className="space-y-5">
                <div>
                  <Label required>Tên sản phẩm</Label>
                  <Input
                    error={errors.name}
                    {...register("name", { required: "Vui lòng nhập tên" })}
                    placeholder="Ví dụ: Áo sơ mi Oxford"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-[10px] mt-1 font-bold italic">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <Label required>Giá niêm yết (VNĐ)</Label>
                    <Input
                      error={errors.price}
                      {...register("price", { required: "Thiếu giá", min: 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Giảm giá (%)</Label>
                    <Input
                      type="number"
                      {...register("discount_percentage", {
                        min: 0,
                        max: 100,
                        valueAsNumber: true,
                      })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label required>Mô tả chi tiết</Label>
                  <textarea
                    rows={5}
                    className={cn(
                      "flex w-full rounded-md border border-zinc-200 p-3 text-sm focus:border-zinc-900 outline-none",
                      errors.description && "border-red-500"
                    )}
                    {...register("description", {
                      required: "Cần mô tả sản phẩm",
                      minLength: { value: 10, message: "Mô tả quá ngắn" },
                    })}
                  />
                </div>
              </div>
            </Section>

            <Section
              title="Biến thể"
              icon={Layers}
              extra={
                <button
                  type="button"
                  onClick={() =>
                    append({ color: "", size: "", stock_quantity: 1 })
                  }
                  className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded"
                >
                  + Thêm biến thể
                </button>
              }
            >
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="relative p-4 bg-zinc-50 border border-zinc-100 rounded-lg flex gap-4"
                  >
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute right-2 top-2 text-zinc-300 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="w-20">
                      <Controller
                        control={control}
                        name={`variants.${index}.image_url`}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <div className="flex flex-col items-center">
                            <ImageUpload
                              value={field.value}
                              onChange={field.onChange}
                            />
                            {errors?.variants?.[index]?.image_file && (
                              <p className="text-red-500 text-[9px] mt-1 font-bold">
                                THIẾU ẢNH
                              </p>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    <div className="flex-1 grid grid-cols-3 gap-3 pt-2">
                      <div>
                        <Label required>Màu</Label>
                        <Input
                          error={errors?.variants?.[index]?.color}
                          {...register(`variants.${index}.color`, {
                            required: true,
                          })}
                        />
                      </div>
                      <div>
                        <Label required>Size</Label>
                        <Input
                          error={errors?.variants?.[index]?.size}
                          {...register(`variants.${index}.size`, {
                            required: true,
                          })}
                        />
                      </div>
                      <div>
                        <Label required>Kho</Label>
                        <Input
                          type="number"
                          {...register(`variants.${index}.stock_quantity`, {
                            required: true,
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* CỘT PHẢI */}
          <div className="space-y-6 lg:col-span-4">
            <Section title="Phân loại" icon={Layers}>
              <Controller
                control={control}
                name="category_ids"
                rules={{
                  validate: (v) => v?.length > 0 || "Chọn ít nhất 1 mục",
                }}
                render={({ field }) => (
                  <div className="space-y-4">
                    <CategorySelector
                      categories={categories}
                      selectedIds={field.value}
                      onChange={field.onChange}
                    />
                    <div className="flex flex-wrap gap-2">
                      {field.value?.map((id) => (
                        <Badge
                          key={id}
                          variant="success"
                          onRemove={() =>
                            field.onChange(field.value.filter((v) => v !== id))
                          }
                        >
                          {findCategoryName(categories, id)}
                        </Badge>
                      ))}
                    </div>
                    {errors.category_ids && (
                      <p className="text-red-500 text-[10px] text-center font-bold uppercase">
                        {errors.category_ids.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </Section>

            <Section title="Ảnh đại diện">
              <Controller
                control={control}
                name="thumbnail"
                rules={{ required: "Cần ảnh đại diện" }}
                render={({ field }) => (
                  <div className="flex flex-col items-center gap-2">
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                    />
                    {errors.thumbnail && (
                      <p className="text-red-500 text-[10px] font-bold uppercase">
                        {errors.thumbnail.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </Section>

            <Section title="Thiết lập" icon={Settings}>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[12px] font-bold text-zinc-600">
                    Đang kinh doanh
                  </span>
                  <input
                    type="checkbox"
                    className="accent-zinc-900"
                    {...register("is_active")}
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[12px] font-bold text-zinc-600">
                    Sản phẩm nổi bật
                  </span>
                  <input
                    type="checkbox"
                    className="accent-zinc-900"
                    {...register("is_featured")}
                  />
                </label>
              </div>
            </Section>
          </div>
        </div>
      </main>
    </div>
  );
}
