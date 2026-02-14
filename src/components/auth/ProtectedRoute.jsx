import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 text-sm text-slate-500">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
        Authenticating…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    if (requiredRole === "admin") {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

