import { createFileRoute } from "@tanstack/react-router";
import ProductsPage from "../../components/ProductPage";

export const Route = createFileRoute("/danh-muc-san-pham/$slug")({
  component: ProductsPage,
});
