import { createFileRoute } from "@tanstack/react-router";
import CardVochuer from "../components/CardVochuer";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination, Autoplay } from "swiper/modules";

import HotProducts from "../features/product/components/HotProducts";
import WhiteListProducts from "../features/product/components/WhiteListProducts";
import OnlineExclusiveOffer from "../features/product/components/OnlineExclusiveOffer";
import { brandDescription, commitments } from "../constant";

export const Route = createFileRoute("/")({
  component: Index,
});
function Index() {
  // Dữ liệu mẫu
  const slidesData = [
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
  return (
    <>
      <main className=" max-w-7xl mx-auto px-4 pb-4">
        {/* Banner */}
        <div className="h-full border-2xl w-full max-w-7xl mx-auto">
          {/* Swiper sẽ mở rộng theo chiều ngang của div cha (max-w-7xl nếu có) */}
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            // Cấu hình cơ bản
            slidesPerView={1}
            loop={true}
            // Tùy chỉnh Navigation và Pagination

            pagination={{
              clickable: true,
              dynamicBullets: true, // Dots sẽ thu nhỏ khi ở xa slide hiện tại
            }}
            autoplay={{
              delay: 4000, // Tăng delay lên 4 giây
              disableOnInteraction: false,
            }}
            // Class tối ưu hóa hiển thị
            className="main-banner-swiper "
          >
            {slidesData.map((slide) => (
              <SwiperSlide
                key={slide.id}
                // Loại bỏ class cũ không tồn tại (color, text-3xl)
                className="relative w-full h-full"
              >
                {/* 🌟 SỬA LỖI QUAN TRỌNG: Dùng thẻ <img> để hiển thị URL */}
                <img
                  src={slide.image_url}
                  alt={slide.alt}
                  // Tối ưu hóa class cho hình ảnh
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.01]"
                  loading="lazy"
                />

                {/* Ví dụ về lớp phủ (Overlay) hoặc Văn bản nổi (Tùy chọn) */}
                <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors duration-300"></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <section className="my-16">
          <h2 className="title-primary text-xl uppercase  text-center font-bold mb-4">
            Nhận voucher độc quyền online
          </h2>
          <div className="flex justify-center items-center">
            <CardVochuer code="YEARA26" discount="100K" minOrder={699000} />
            <CardVochuer code="YEARA26" discount="100K" minOrder={699000} />
            <CardVochuer code="YEARA26" discount="100K" minOrder={699000} />
          </div>
        </section>

        <WhiteListProducts />
        <HotProducts />
        <OnlineExclusiveOffer />
        <section className="my-16">
          <img
            src="https://tokyolife.vn/_next/image?url=https%3A%2F%2Fs3-hni02.higiocloud.vn%2Fgppm2%2Fprod%2Fcms%2F17624294258164892.png&w=3840&q=100"
            alt=""
          />
        </section>

        <section className="my-16">
          <img
            src="https://tokyolife.vn/_next/image?url=https%3A%2F%2Fs3-hni02.higiocloud.vn%2Fgppm2%2Fprod%2Fcms%2F17625995251538528.png&w=3840&q=100"
            alt=""
          />
        </section>

        <section className="my-16">
          <img
            src="https://tokyolife.vn/_next/image?url=https%3A%2F%2Fs3-hni02.higiocloud.vn%2Fgppm2%2Fprod%2Fcms%2F17611242928598404.png&w=3840&q=100"
            alt=""
          />
        </section>

        <section>
          <img
            src="https://tokyolife.vn/_next/image?url=https%3A%2F%2Fs3-hni02.higiocloud.vn%2Fgppm2%2Fprod%2Fcms%2F17611062336535301.jpg&w=1920&q=100"
            alt=""
          />
        </section>
        <section>
          {/* Phần 4 cột Cam kết */}
          <div className="max-w-7xl mx-auto py-10 px-4 my-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              {commitments.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 border border-gray-100 rounded-lg shadow-sm flex flex-col items-center"
                >
                  <div className="h-14 w-14 mb-4 flex items-center justify-center rounded-full bg-red-600 text-white">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <section>
        {/* Phần Banner Đỏ - Cam kết trách nhiệm xã hội */}
        <div className="bg-red-800 w-full text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo giữa */}
            <h2 className="text-4xl font-serif font-extrabold mb-4 tracking-wider">
              LUKLIFE
            </h2>

            {/* Trích dẫn lớn (Gần như trong ảnh) */}
            <div className="relative">
              <blockquote className="text-base leading-relaxed italic px-8">
                <p className="mb-4 font-semibold">
                Luklife trân trọng cảm ơn sự đồng hành của Quý Khách, góp phần tạo nên quỹ hỗ trợ việc làm cho{" "}
                  <span className="text-yellow-300">150 nhân sự tài năng</span> vượt lên nghịch cảnh.
                </p>
                <p className="text-sm font-light leading-relaxed">
                  {brandDescription}
                </p>
              </blockquote>

              {/* Icon trích dẫn lớn, mờ (Giả định) */}
              <span className="absolute left-0 top-0 text-white/10 text-[100px] leading-none transform -translate-x-1/2 -translate-y-1/2">
                “
              </span>
              <span className="absolute right-0 bottom-0 text-white/10 text-[100px] leading-none transform translate-x-1/2 translate-y-1/2">
                ”
              </span>
            </div>

            {/* Placeholder cho sticker/voucher (Tùy chọn) */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
              {/* Đây là vị trí của voucher sticker 200K trong ảnh */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
