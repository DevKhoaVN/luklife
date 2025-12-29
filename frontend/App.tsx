import { useState } from "react";
import Footer from "./components/Footer.tsx";
import Header from "./components/Header.tsx";
import CardVochuer from "./components/CardVochuer.tsx";
import HotProductSection from "./components/HotProductSection.tsx";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header></Header>
      <main className=" max-w-7xl mx-auto px-4 py-4">
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

      <Footer></Footer>
    </>
  );
}

export default App;
