import { createFileRoute } from "@tanstack/react-router";
import ProductDetailPage from "../../features/product/components/ProductDetail/ProductDetailPage";

export const Route = createFileRoute("/san-pham/$slug")({
  component: ProductDetailPage,
});
