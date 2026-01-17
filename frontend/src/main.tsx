import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { AppContextProvider } from "./context/AppContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer, Slide } from "react-toastify";
// Tạo QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Tắt refetch khi focus vào window
      retry: 1, // Số lần retry khi request thất bại
      staleTime: 5 * 60 * 1000, // Dữ liệu được coi là "fresh" trong 5 phút
    },
    mutations: {
      retry: 0, // Không retry mutations khi thất bại
    },
  },
});

const router = createRouter({
  routeTree,
  context: {
    auth: undefined,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider router={router}>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={500}
          hideProgressBar={true} // ✅ Ẩn thanh progress bar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false} // ✅ Tắt để mượt hơn
          draggable
          pauseOnHover
          theme="light"
          transition={Slide}
          limit={3}
          stacked
          closeButton={false} // ✅ Ẩn nút close (X)
          style={{
            fontSize: "13px",
            width: "300px",
          }}
        />
      </AppContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
