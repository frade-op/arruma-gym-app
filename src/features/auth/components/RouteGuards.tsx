import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "@/shared/components/Spinner";

/** Protege rotas privadas; guarda a rota original para voltar após o login. */
export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") return <Spinner fullScreen />;
  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return <Outlet />;
}

/** Impede usuário autenticado de ver telas de visitante (ex.: login). */
export function GuestRoute() {
  const { status } = useAuth();
  if (status === "loading") return <Spinner fullScreen />;
  if (status === "authenticated") return <Navigate to="/" replace />;
  return <Outlet />;
}
