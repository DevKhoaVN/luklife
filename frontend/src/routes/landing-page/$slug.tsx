import { createFileRoute } from "@tanstack/react-router";
import HotProducts from "../../features/product/components/HotProducts";
import WhiteListProducts from "../../features/product/components/WhiteListProducts";
import OnlineExclusiveOffer from "../../features/product/components/OnlineExclusiveOffer";

export const Route = createFileRoute("/landing-page/$slug")({
  component: OnlineExclusiveOffer,
});
