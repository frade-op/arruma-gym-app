import { Navigate, Route, Routes } from "react-router-dom";
import { GuestRoute, ProtectedRoute } from "@/features/auth/components/RouteGuards";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { HomePage } from "@/features/home/pages/HomePage";
import { PaymentsPage } from "@/features/home/pages/PaymentsPage";
import { AttendancePage } from "@/features/home/pages/AttendancePage";
import { EstablishmentsPage } from "@/features/establishments/pages/EstablishmentsPage";
import { AppLayout } from "@/shared/components/AppLayout";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="establishments" element={<EstablishmentsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
