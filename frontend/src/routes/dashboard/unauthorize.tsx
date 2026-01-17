import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/dashboard/unauthorize")({
  component: UnauthorizedPage,
});

function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-6">
            <ShieldAlert className="h-16 w-16 text-red-600" />
          </div>
        </div>

        {/* Content */}
        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          Truy cập bị từ chối
        </h1>

        <p className="mb-8 text-gray-600">
          Bạn không có quyền truy cập vào trang này
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate({ to: "/" })}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
          >
            <Home className="h-5 w-5" />
            Về trang chủ
          </button>

          <button
            onClick={() => window.history.back()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5" />
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
