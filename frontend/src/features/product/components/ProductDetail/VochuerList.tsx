import { Copy } from "lucide-react";

const VoucherList = ({ vouchers }: { vouchers: any[] }) => {
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Đã sao chép mã: ${code}`);
  };

  return (
    <div className="mb-8">
      <h2 className="text-md font-sans text-black font-bold mb-2">
        KHUYẾN MÃI
      </h2>
      <ul className="space-y-3">
        {vouchers.map((v, index) => {
          const Icon = v.icon;
          const isFreeShip = v.code === "FREE_SHIP";
          return (
            <li key={index} className="flex items-start text-sm text-gray-700">
              <img
                src={Icon}
                alt=""
                className="mr-2 flex-shrink-0 mt-0.5 w-5 h-5"
              />
              <span className="flex-1 text-black font-medium">
                {isFreeShip
                  ? `Giao nhanh và miễn phí vận chuyển 0đ toàn quốc cho đơn hàng từ ${v.minOrder}`
                  : `Giảm thêm ${v.discount} khi nhập mã ${v.code} tại bước thanh toán cho đơn từ ${v.minOrder}`}
              </span>
              {!isFreeShip && (
                <button
                  onClick={() => copyToClipboard(v.code)}
                  className="ml-2 text-blue-600 hover:text-blue-800 transition duration-150 flex items-center flex-shrink-0"
                >
                  Sao chép <Copy size={14} className="ml-1" />
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <div className="inline-block mt-4 bg-orange-100 text-sm font-semibold text-orange-800 px-3 py-1 rounded">
        Giá độc quyền online
      </div>
    </div>
  );
};
export default VoucherList;
