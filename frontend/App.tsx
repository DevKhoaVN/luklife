import { useState } from "react";
import Footer from "./components/Footer.tsx";
import Header from "./components/Header.tsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header></Header>
      <div className="h-screen"></div>
      <Footer></Footer>
    </>
  );
}

export default App;
