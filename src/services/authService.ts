import type { AxiosRequestConfig } from "axios";
import { apiClient } from "@/lib/api-client";
import type { IAuthService } from "@/core/interfaces/IAuthService";
import type {
  ApiEnvelope,
  LoginRequest,
  LoginResponse,
  LoginResponseData,
  RefreshResponse,
  RefreshResponseData,
  User,
} from "@/core/types/authTypes";

export const authService: IAuthService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<ApiEnvelope<LoginResponseData>>(
      "/auth/login",
      payload,
    );
    const inner = data.data;
    return {
      token: inner.access_token,
      refreshToken: inner.refresh_token,
      expiresAt: inner.expires_at,
      user: inner.user,
    };
  },

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const { data } = await apiClient.post<ApiEnvelope<RefreshResponseData>>(
      "/auth/refresh",
      { refresh_token: refreshToken },
      { skipAuthRefresh: true } as AxiosRequestConfig & {
        skipAuthRefresh?: boolean;
      },
    );
    const inner = data.data;
    return {
      token: inner.access_token,
      refreshToken: inner.refresh_token,
      expiresAt: inner.expires_at,
    };
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get<ApiEnvelope<User>>("/auth/me");
    return data.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // ignore — local cleanup happens regardless
    }
  },
};
