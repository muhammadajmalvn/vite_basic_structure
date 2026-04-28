import type {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  User,
} from "@/core/types/authTypes";

export interface IAuthService {
  login(payload: LoginRequest): Promise<LoginResponse>;
  refresh(refreshToken: string): Promise<RefreshResponse>;
  me(): Promise<User>;
  logout(): Promise<void>;
}
