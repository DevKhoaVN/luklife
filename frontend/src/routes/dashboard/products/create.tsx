import { createFileRoute } from "@tanstack/react-router";
import CreateProductForm from "../../../pages/CreateProduct";

export const Route = createFileRoute("/dashboard/products/create")({
  component: CreateProductForm,
});
