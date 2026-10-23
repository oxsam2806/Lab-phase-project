import api from "./axiosInstance";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "../../types/user";

export const authApi = {
  register: (data: RegisterPayload) =>
    api.post<AuthResponse>("/auth/register", data).then((res) => res.data),

  login: (data: LoginPayload) =>
    api.post<AuthResponse>("/auth/login", data).then((res) => res.data),

  logout: () =>
    api.post<{ message: string }>("/auth/logout").then((res) => res.data),

  me: () =>
    api.get<{ user: User }>("/auth/me").then((res) => res.data.user),
};