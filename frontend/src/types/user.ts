export type Role = "customer" | "seller" | "admin";
export type AccountStatus = "active" | "pending" | "suspended";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  status: AccountStatus;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "customer" | "seller";
}

export interface AuthResponse {
  user: User;
  message: string;
}