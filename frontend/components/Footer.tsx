import React, { useState } from "react";
import facebook from "../assets/facebook_icon.svg";
import tiktok from "../assets/tiktok_icon.svg";
import youtube from "../assets/youtube_icon.svg";
import zalo from "../assets/zalo_icon.svg";
import luk_logo from "../assets/logo.svg";
// Import icon từ Lucide React
import { ChevronDown, ChevronUp, Mail } from "lucide-react";

// Dữ liệu Footer (Giữ nguyên)
const footerData = [
  {
    title: "VỀ TOKYOLIFE",
    items: [
      "Chúng tôi là ai",
      "Cam kết của chúng tôi",
      "Tin tuyển dụng",
      "Hệ thống cửa hàng",
    ],
  },
  {
    title: "HỖ TRỢ KHÁCH HÀNG",
    items: [
      "Hướng dẫn đặt hàng",
      "Phương thức thanh toán",
      "Chính sách sinh nhật thành viên",
      "Chính sách tích - tiêu điểm",
      "Chính sách hoàn tiền",
    ],
  },
  {
    title: "CHÍNH SÁCH",
    items: [
      "Chính sách vận chuyển",
      "Chính sách kiểm hàng",
      "Chính sách đổi trả",
      "Điều kiện & Điều khoản",
      "Chính sách bảo mật",
    ],
  },
];

const contactData = {
  title: "LIÊN HỆ",
  info: [
    { label: "Tư vấn mua online", value: "024 7308 2882" },
    { label: "Khiếu nại và bảo hành", value: "024 7300 6999" },
    { label: "Email", value: "cskh@tokyolife.vn" },
  ],
  workingHours: "Giờ làm việc: 8:30 - 22:00 hàng ngày",
};

function Footer() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (title) => {
    // Chỉ kích hoạt toggle trên màn hình nhỏ (Mobile)
    // Trên desktop, click sẽ không có tác dụng
    if (window.innerWidth < 768) {
      // 768px là breakpoint 'md' của Tailwind
      setOpenSection(openSection === title ? null : title);
    }
  };

  return (
    // Đã sửa màu chữ tổng thể thành màu tối để phù hợp với nền sáng (#F5F5F5)
    <>
      <footer className="bg-[#F5F5F5] text-gray-700 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Phần 1: Các mục thông tin chính */}
          {footerData.map((section) => (
            <div key={section.title} className="col-span-1">
              {/* Tiêu đề: Có thể click trên mobile, nhưng là text-gray-800 */}
              <h3
                className="text-gray-800  text-xs  sm:text-sm font-bold mb-3 flex justify-between items-center transition-colors 
                         md:cursor-default cursor-pointer" // Desktop không có cursor-pointer
                onClick={() => toggleSection(section.title)}
              >
                {section.title}
                {/* Icon chỉ hiển thị trên màn hình nhỏ (md:hidden) */}
                <span className="md:hidden text-lg">
                  {openSection === section.title ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </span>
              </h3>

              {/* Nội dung:
                - Mobile: Dùng max-h và ẩn/hiện dựa trên state.
                - Desktop (md:block): LUÔN LUÔN HIỂN THỊ, không phụ thuộc vào state 'openSection'.
            */}
              <ul
                className={`space-y-2 text-sm transition-all duration-300 ease-in-out overflow-hidden 
                          md:block md:max-h-full md:space-y-3 // Trên Desktop: luôn block và full height
                          ${
                            openSection === section.title
                              ? "max-h-96" // Mobile: Đang mở
                              : "max-h-0" // Mobile: Đang đóng
                          }`}
              >
                {section.items.map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      // Thay đổi màu hover sang màu nổi bật hoặc màu tối hơn
                      className="font-normal hover:text-red-500 hover:ml-1 transition-all duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Phần 2: LIÊN HỆ & Kết nối */}
          <div className="col-span-1">
            <h3 className="text-gray-800 text-base font-bold mb-3">
              {contactData.title}
            </h3>
            <ul className="space-y-2 text-sm">
              {contactData.info.map((item, index) => (
                <li key={index} className="flex items-center">
                  {item.label === "Email" && (
                    <Mail size={16} className="mr-2 text-red-500" />
                  )}
                  <span className="font-medium mr-1 text-gray-600">
                    {item.label}:
                  </span>
                  <a
                    href={
                      item.label === "Email"
                        ? `mailto:${item.value}`
                        : `tel:${item.value.replace(/\s/g, "")}`
                    }
                    // Màu chữ đã sửa
                    className="text-gray-800 hover:text-red-500 transition duration-200"
                  >
                    {item.value}
                  </a>
                </li>
              ))}
              <li className="pt-2 text-gray-600">{contactData.workingHours}</li>
            </ul>

            <h3 className="text-gray-800 text-base font-bold mt-6 mb-3">
              Kết nối với LUKLIFE
            </h3>
            {/* Icons kết nối xã hội */}
            <div className="flex space-x-3">
              <a
                href="#"
                className="text-gray-600 hover:text-red-500 transition-colors"
              >
                <img src={tiktok} alt="Facebook" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-red-500 transition-colors"
              >
                <img src={facebook} alt="Facebook" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-red-500 transition-colors"
              >
                <img src={zalo} alt="Facebook" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-red-500 transition-colors"
              >
                <img src={youtube} alt="Facebook" />
              </a>
            </div>
          </div>
        </div>
      </footer>
      <div className="bg-black w-full  h-16 sm:h-10 pt-4 px-2 sm:flex items-center justify-center gap-6">
        <img
          src={luk_logo}
          alt="LUKLIFE Logo "
          className="h-4  mb-2 mx-auto sm:mx-0 sm:mb-0"
        />
        <p className="text-white text-center text-[10px] sm:text-xs">
          © {new Date().getFullYear()} Copyright © 2014-2025 Luklife.vn All
          Rights Reserved.
        </p>
      </div>
    </>
  );
}

export default Footer;
