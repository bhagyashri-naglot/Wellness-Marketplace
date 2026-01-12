import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";

export default function PrivateRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      console.log("🔐 Checking token:", token);

      if (!token) {
        console.error("❌ No token found");
        setIsAuth(false);
        return;
      }

      try {
        const res = await api.get("/users/me");
        console.log("✅ Token valid, user:", res.data);
        setIsAuth(true);
      } catch (err) {
        console.error("❌ Auth failed:", err?.response?.status);
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) {
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        🔄 Checking authentication...
      </div>
    );
  }

  if (isAuth === false) {
    console.warn("➡️ Redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  return children;
}
