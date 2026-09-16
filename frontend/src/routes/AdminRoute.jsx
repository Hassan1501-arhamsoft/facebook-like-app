import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../features/auth/hooks/useAuth";

export default function AdminRoute() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 text-indigo-600 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
      </div>
    );
  }

  // Not logged in? Go to login.
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  // Logged in, but NOT an admin? Go to the normal dashboard.
  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}