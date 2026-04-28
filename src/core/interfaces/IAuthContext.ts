import type { LoginRequest, User } from "@/core/types/authTypes";

export interface IAuthContext {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login(payload: LoginRequest): Promise<void>;
  logout(): Promise<void>;
}
