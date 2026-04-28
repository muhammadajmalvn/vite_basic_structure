import type { ReactNode } from "react";

export interface IProtectedRouteProps {
  children?: ReactNode;
  redirectTo?: string;
}
