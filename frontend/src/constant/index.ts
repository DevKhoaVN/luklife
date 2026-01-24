import { ThumbsUp, Headset, Truck, Wallet } from 'lucide-react';
import Gift from '../../public/assets/gift.svg'
// nav home page

// Dữ liệu menu với cấu trúc 3 cấp
export const MENU_CATEGORIES = [{ id: 2, label: "Sale", slug: "sale" }, { id: 3, label: "Nữ", slug: "nu" }, { id: 4, label: "Nam", slug: "name" }, { id: 5, label: "Trẻ em", slug: "tre-em" }, { id: 6, label: "Giày dép", slug: "giay-dep" }, { id: 7, label: "Phụ kiện", slug: "phu-kien" }, { id: 8, label: "Mỹ phẩm", slug: "my-pham" }, { id: 9, label: "Nhà cửa - Đời sống", slug: "nha-cua-doi-song" }, { id: 10, label: "Voucher", slug: "vouchuer" }, { id: 11, label: "Tin tức", slug: "news" }];
// Dữ liệu footer
export const footerData = [
  {
    title: 'VỀ LUKLIFE',
    items: [
      'Chúng tôi là ai',
      'Cam kết của chúng tôi',
      'Tin tuyển dụng',
      'Hệ thống cửa hàng',
    ],
  },
  {
    title: 'HỖ TRỢ KHÁCH HÀNG',
    items: [
      'Hướng dẫn đặt hàng',
      'Phương thức thanh toán',
      'Chính sách sinh nhật thành viên',
      'Chính sách tích - tiêu điểm',
      'Chính sách hoàn tiền',
    ],
  },
  {
    title: 'CHÍNH SÁCH',
    items: [
      'Chính sách vận chuyển',
      'Chính sách kiểm hàng',
      'Chính sách đổi trả',
      'Điều kiện & Điều khoản',
      'Chính sách bảo mật',
    ],
  },
];

// Dữ liệu liên hệ
export const contactData = {
  title: 'LIÊN HỆ',
  info: [
    { label: 'Tư vấn mua online', value: '024 7308 2882' },
    { label: 'Khiếu nại và bảo hành', value: '024 7300 6999' },
    { label: 'Email', value: 'cskh@luklife.vn' },
  ],
  workingHours: 'Giờ làm việc: 8:30 - 22:00 hàng ngày',
};

 // Dữ liệu cho 4 cột cam kết
export const commitments = [
    { icon: ThumbsUp, title: "HÀNG HOÁ CHẤT LƯỢNG", description: "Tận hưởng các mặt hàng chất lượng hàng đầu với giá cả hợp lý" },
    { icon: Headset, title: "HỖ TRỢ 24/7", description: "Nhân hỗ trợ ngay lập tức bất cứ khi nào bạn cần" },
    { icon: Truck, title: "VẬN CHUYỂN NHANH CHÓNG", description: "Tùy chọn giao hàng nhanh chóng và đáng tin cậy" },
    { icon: Wallet, title: "THANH TOÁN AN TOÀN", description: "Nhiều phương thức thanh toán an toàn" },
  ];

  // Đoạn văn bản mô tả thương hiệu dài (Lấy từ ảnh)
export const brandDescription = "Luklife là chuỗi cửa hàng tiện ích, chuyên phân phối các dòng sản phẩm gia dụng thông minh, mỹ phẩm và phụ kiện chuẩn Nhật - Hàn. Đối tác chiến lược của các thương hiệu quốc tế: SakuraHome, FujiClean, OsakaStyle, KyotoLab, Hokaido (Hadaowa, MelaX...), Kiko (Dong Soft), Shinsegae (Anesso, Tsuba, U-Pro), KAWA (Biro, Lauri), Rosie, UniMan, Roctet...";

  // banner
export const slidesData = [
    {
      id: 1,
      image_url:
        "https://s3-hni02.higiocloud.vn/gppm2/prod/cms/17667138083114784.jpg",
      alt: "Banner Thời trang Hè 2024",
    },
    {
      id: 2,
      image_url:
        "https://s3-hni02.higiocloud.vn/gppm2/prod/cms/17645741711879463.jpg",
      alt: "Banner Khuyến mãi lớn",
    },
  ];

export const MOCK_VOUCHERS = [
  { code: "NEWA26", discount: "300.000đ", minOrder: "399.000đ", icon: Gift },
  { code: "YEARA26", discount: "100.000đ", minOrder: "699.000đ", icon: Gift },
  { code: "HAPPY2026", discount: "126.000đ", minOrder: "999.000đ", icon: Gift },
  {
    code: "FREE_SHIP",
    discount: "Miễn phí vận chuyển 0đ",
    minOrder: "249.000đ",
    icon: Gift,
  },
];