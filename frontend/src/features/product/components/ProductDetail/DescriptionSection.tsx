import { ChevronDown } from "lucide-react";
import { useState } from "react";

const DescriptionSection = ({
  productName,
  shortDesc,
  promoBanner,
}: {
  productName: string;
  shortDesc: string;
  promoBanner?: string;
}) => {
  const [isDescOpen, setIsDescOpen] = useState(true);
  const [isMaterialOpen, setIsMaterialOpen] = useState(true);
  const [isFullDescExpanded, setIsFullDescExpanded] = useState(false);

  return (
    <section className="mt-12 pt-8">
      <h2 className="font-sans text-black font-bold text-xl mb-6">
        MÔ TẢ SẢN PHẨM
      </h2>
      <div className="border-b border-gray-300 mb-6"></div>

      {/* Đặc điểm sản phẩm */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => setIsDescOpen(!isDescOpen)}
          className="flex justify-between items-center w-full py-4 font-sans text-black font-bold hover:bg-gray-50 transition-colors"
        >
          ĐẶC ĐIỂM SẢN PHẨM
          <ChevronDown
            size={20}
            className={`transition-transform duration-300 ${
              isDescOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
        {isDescOpen && (
          <div className="p-4">
            <p className="text-gray-700 mb-4 font-medium">{productName}</p>
            <p className="text-gray-700 mb-4">{shortDesc}</p>
            {promoBanner && (
              <img
                src={promoBanner}
                alt="Banner"
                className="w-[50%]  mx-auto  my-6 rounded-lg"
              />
            )}
            <button
              onClick={() => setIsFullDescExpanded(!isFullDescExpanded)}
              className="text-red-600 font-medium hover:text-red-700 flex items-center gap-1 transition-colors mt-4"
            >
              {isFullDescExpanded ? "Thu gọn" : "Xem thêm"}
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  isFullDescExpanded ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            {isFullDescExpanded && (
              <div className="mt-4 p-4 border-l-4 border-red-500 bg-gray-50 text-gray-700">
                <p>Nội dung mô tả chi tiết đầy đủ của sản phẩm...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Thành phần chất liệu */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => setIsMaterialOpen(!isMaterialOpen)}
          className="flex justify-between items-center w-full py-4 font-sans text-black font-bold hover:bg-gray-50 transition-colors"
        >
          THÀNH PHẦN, CHẤT LIỆU
          <ChevronDown
            size={20}
            className={`transition-transform duration-300 ${
              isMaterialOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
        {isMaterialOpen && (
          <div className="p-4">
            <ul className="space-y-3">
              <li>
                <span className="font-semibold text-gray-800">
                  Thành phần chính:
                </span>
                <span className="ml-2 text-gray-600">
                  95% Cotton, 5% Spandex
                </span>
              </li>
              <li>
                <span className="font-semibold text-gray-800">Công nghệ:</span>
                <span className="ml-2 text-gray-600">
                  Vải cao cấp, thoáng khí
                </span>
              </li>
              <li>
                <span className="font-semibold text-gray-800">
                  Hướng dẫn bảo quản:
                </span>
                <span className="ml-2 text-gray-600">
                  Giặt máy ở nhiệt độ thấp
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default DescriptionSection;
