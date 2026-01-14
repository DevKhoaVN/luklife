import React, { useState } from "react";
// Import các icon cần thiết (Giả định sử dụng lucide-react)
import { Plus, MapPin, X } from "lucide-react";

// Hàm component chính để render nội dung Địa chỉ
const renderAddressContent = () => {
  // === State cho Địa chỉ ===
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

  // Khởi tạo form trống
  const initialAddressForm = {
    fullName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    street: "",
    isDefault: false,
  };

  // === XỬ LÝ ĐỊA CHỈ ===
  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;
    setAddressForm({
      ...addressForm,
      [name]: value,
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
      setAddressForm(address); // Điền dữ liệu để chỉnh sửa
    } else {
      setEditingAddress(null);
      setAddressForm(initialAddressForm); // Đặt lại form trống
    }
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
    setAddressForm(initialAddressForm); // Đặt lại form sau khi đóng
  };

  const handleSaveAddress = () => {
    if (
      !addressForm.fullName ||
      !addressForm.phone ||
      !addressForm.street ||
      !addressForm.province ||
      !addressForm.district ||
      !addressForm.ward
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    if (editingAddress) {
      // Logic Cập nhật Địa chỉ
      setAddresses((prevAddresses) =>
        prevAddresses.map((addr) => {
          if (addr.id === editingAddress.id) {
            // Cập nhật địa chỉ đang chỉnh sửa
            return { ...addressForm, id: addr.id };
          } else if (addressForm.isDefault) {
            // Nếu địa chỉ mới được đặt làm mặc định, hủy mặc định của các địa chỉ khác
            return { ...addr, isDefault: false };
          }
          return addr;
        })
      );
    } else {
      // Logic Thêm Địa chỉ mới
      const newAddress = {
        ...addressForm,
        id: Date.now(), // Sử dụng timestamp làm ID tạm thời
      };
      setAddresses((prevAddresses) => {
        if (addressForm.isDefault) {
          // Nếu đặt mặc định, hủy mặc định của tất cả địa chỉ cũ
          return [
            ...prevAddresses.map((addr) => ({ ...addr, isDefault: false })),
            newAddress,
          ];
        } else {
          // Thêm địa chỉ mới
          return [...prevAddresses, newAddress];
        }
      });
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

  // === UI RENDER ===
  return (
    <div className="rounded-lg bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-black">Địa chỉ của tôi</h2>
        <button
          onClick={() => openAddressModal()}
          className="flex items-center gap-2 rounded bg-red-700 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-red-800"
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
              className="rounded-lg border border-gray-200 p-5 transition-colors hover:border-red-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="font-semibold ">{address.fullName}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-sm text-gray-600">
                      {address.phone}
                    </span>
                    {address.isDefault && (
                      <span className="rounded border border-red-600 bg-red-50/50 px-2 py-0.5 text-xs font-medium text-red-600">
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
                  className="mt-3 rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-gray-400"
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
              <h3 className="text-md font-bold uppercase">
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
                    className="w-full rounded border border-gray-300 px-4 py-2 text-xs focus:border-red-700 focus:outline-none focus:ring-0"
                    placeholder="Nhập họ và tên"
                    required
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
                    className="w-full rounded border border-gray-300 px-4 py-2 text-xs focus:border-red-700 focus:outline-none focus:ring-0"
                    placeholder="Nhập số điện thoại"
                    required
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
                  className="w-full rounded border border-gray-300 px-4 py-2 text-xs focus:border-red-700 focus:outline-none focus:ring-0"
                  placeholder="Nhập tỉnh/thành phố"
                  required
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
                    className="w-full rounded border border-gray-300 px-4 py-2 text-xs focus:border-red-700 focus:outline-none focus:ring-0"
                    placeholder="Nhập quận/huyện"
                    required
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
                    className="w-full rounded border border-gray-300 px-4 py-2 text-xs focus:border-red-700 focus:outline-none focus:ring-0"
                    placeholder="Nhập phường/xã"
                    required
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
                  className="w-full rounded border border-gray-300 px-4 py-2 text-xs focus:border-red-700 focus:outline-none focus:ring-0"
                  placeholder="Số nhà, tên đường..."
                  required
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
                className="rounded border border-gray-300 px-6 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveAddress}
                className="rounded bg-red-700 px-6 py-2 text-xs font-medium text-white transition-colors hover:bg-red-800"
              >
                {editingAddress ? "Cập nhật" : "Thêm địa chỉ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default renderAddressContent;

// Ví dụ về cách sử dụng component này (Bạn có thể bỏ qua phần này nếu đã biết cách dùng)
// function MyProfilePage() {
//   return (
//     <div className="p-10 bg-gray-100 min-h-screen">
//       {renderAddressContent()}
//     </div>
//   );
// }
// export default MyProfilePage;
