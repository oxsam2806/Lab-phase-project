import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppDispatch";
import type { Role } from "../types/user";

interface Props {
  allowedRoles?: Role[];
}

function ProtectedRoute({ allowedRoles }: Props) {
  const { user, initialized } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!initialized) {
    return <p className="text-center text-stone-500 py-16">Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;