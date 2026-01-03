import { createFileRoute } from "@tanstack/react-router";
import CardVochuer from "../components/CardVochuer";
import HotProductSection from "../components/HotProductSection";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination, Autoplay } from "swiper/modules";

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
      <main className=" max-w-7xl mx-auto px-4 py-4">
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
        <section className="mt-16">
          <h2 className="title-primary text-xl uppercase  text-center font-bold mb-4">
            Nhận vochuer độc quyền online
          </h2>
          <div className="flex justify-center items-center">
            <CardVochuer code="YEARA26" discount="100K" minOrder={699000} />
            <CardVochuer code="YEARA26" discount="100K" minOrder={699000} />
            <CardVochuer code="YEARA26" discount="100K" minOrder={699000} />
          </div>
        </section>

        <section>
          <HotProductSection />
        </section>
        <section className="my-16">
          <img
            src="https://tokyolife.vn/_next/image?url=https%3A%2F%2Fs3-hni02.higiocloud.vn%2Fgppm2%2Fprod%2Fcms%2F17624294258164892.png&w=3840&q=100"
            alt=""
          />
        </section>
        <section>
          <HotProductSection />
        </section>
        <section className="my-16">
          <img
            src="https://tokyolife.vn/_next/image?url=https%3A%2F%2Fs3-hni02.higiocloud.vn%2Fgppm2%2Fprod%2Fcms%2F17625995251538528.png&w=3840&q=100"
            alt=""
          />
        </section>
        <section>
          <HotProductSection />
        </section>
        <section className="my-16">
          <img
            src="https://tokyolife.vn/_next/image?url=https%3A%2F%2Fs3-hni02.higiocloud.vn%2Fgppm2%2Fprod%2Fcms%2F17611242928598404.png&w=3840&q=100"
            alt=""
          />
        </section>
        <section>
          <HotProductSection />
        </section>
      </main>
    </>
  );
}
