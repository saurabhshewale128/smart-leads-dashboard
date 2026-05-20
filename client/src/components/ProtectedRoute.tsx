import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: any) {

  const token = localStorage.getItem("token");

  // If no token
  if (!token) {
    return <Navigate to="/" />;
  }

  // If token exists
  return children;
}