import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, showToast } = useAuth();

  useEffect(() => {
    if (!user) {
      showToast("pleaseSignIn");
    }
  }, [user, showToast]);

  if (!user) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};
