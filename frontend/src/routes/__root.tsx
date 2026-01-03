import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

export const Route = createRootRoute({
  component: () => {
    return (
      <div className="min-h-screen">
        <Header />
        <Outlet />
        <Footer />
        <TanStackRouterDevtools />
      </div>
    );
  },
});
