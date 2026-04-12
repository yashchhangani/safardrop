// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {

  // ✅ get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ correct check
  if (!user || !user.userId) {
    return <Navigate to="/login" replace />;
  }

  return children;
}