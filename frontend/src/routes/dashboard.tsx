import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "../components/Admin/Layout/DashboardLayout";
import { useContext } from "react";
import AppContext from "../context/AppContext";
import { useStaticData } from "../hooks/Admin";
import { logout } from "../api/auth.api";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context, location }) => {
    const { user } = context.auth ?? {};
    if (!user) {
      throw redirect({
        to: "/dashboard/login",
        search: { redirect: location.href },
      });
    }
    return { currentUser: user };
  },
  component: () => {
    const { currentUser } = Route.useRouteContext();
    const { data: statsData } = useStaticData();

    return <DashboardLayout currentUser={currentUser} statsData={statsData} />;
  },
});
