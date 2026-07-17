import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, showToast } = useAuth();
  const location = useLocation();

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

  // Role-based route protection
  const accountType = user.account_type; // 'buyer', 'seller', 'both'

  if (location.pathname === "/" && accountType === "seller") {
    // Seller trying to access buyer page -> Redirect to seller dashboard
    return <Navigate to="/seller" replace />;
  }

  if (location.pathname === "/seller" && accountType === "buyer") {
    // Buyer trying to access seller page -> Redirect to buyer dashboard
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
