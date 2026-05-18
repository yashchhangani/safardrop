import { Navigate } from "react-router-dom";
import { clearStoredUser, getStoredUser } from "../services/api";

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = getStoredUser();
  const token = localStorage.getItem("token");

  if (!user || !user.userId || !token) {
    clearStoredUser();
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
