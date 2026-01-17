import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

export const Route = createRootRoute({
  component: RootRouteComponent,
});

function RootRouteComponent() {
  const location = useLocation();

  // Nếu là trang admin, chỉ hiển thị Outlet
  if (location.pathname.startsWith("/dashboard")) {
    return <Outlet />;
  }

  return (
    <>
      <Header /> {/* Layout của trang chính */}
      <Outlet />
      <Footer />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
