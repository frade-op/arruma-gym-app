import { Loader2 } from "lucide-react";

export function Spinner({ fullScreen = false }: { fullScreen?: boolean }) {
  return (
    <div
      role="status"
      aria-label="Carregando"
      className={`flex items-center justify-center ${fullScreen ? "min-h-screen" : ""}`}
    >
      <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
    </div>
  );
}
