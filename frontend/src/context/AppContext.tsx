import { createContext, useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

const AppContext = createContext(null);

// Provider component
export const AppContextProvider = ({ children, router }) => {
  const [cartItems, setCartItems] = useState(null);
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  // Cập nhật router context mỗi khi user thay đổi
  useEffect(() => {
    router.update({
      context: {
        auth: {
          user,
          isAuthenticated: !!user,
        },
      },
    });
  }, [user, router]);

  useEffect(() => {
    console.log("🟢 User changed:", user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);
  const value = {
    user,
    setUser,
    cartItems,
    setCartItems,
    navigate,
    token,
    setToken,
    products,
    setProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext; // Export Context để dùng ở nơi khác với useContext
