import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, showToast } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      showToast("pleaseSignIn");
    }
  }, [user, loading, showToast]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-bg text-app-text">
        <span className="h-3 w-3 rounded-full bg-primary animate-ping" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};
