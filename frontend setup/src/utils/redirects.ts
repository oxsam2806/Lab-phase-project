import type { Role } from "../types/user";

export const getDashboardPath = (role: Role) => {
  if (role === "admin") return "/admin";
  if (role === "seller") return "/seller";
  return "/";
};