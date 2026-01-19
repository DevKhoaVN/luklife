import { createFileRoute } from "@tanstack/react-router";
import { Overview } from "../../pages/Overview";

export const Route = createFileRoute("/dashboard/")({
  validateSearch: (search: Record<string, unknown>) => ({
    status: (search.status as string) || "all",
    page: Number(search.page) || 1,
  }),
  component: Overview,
});
