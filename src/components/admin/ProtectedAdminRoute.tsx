import { ReactNode } from "react";
import { useRequireAuth } from "@/hooks/use-auth";

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  useRequireAuth();
  return <>{children}</>;
}
