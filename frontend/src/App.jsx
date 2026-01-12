import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ViewProfile from "./pages/ViewProfile";
import MySessions from "./pages/MySessions";
import BookTherapy from "./pages/BookTherapy";
import BookSession from "./pages/BookSession"; // ✅ ADD THIS

import AdminDashboard from "./pages/AdminDashboard";
import PractitionerHome from "./pages/PractitionerHome";
import ManageTherapies from "./pages/ManageTherapies";
import CreateTherapy from "./pages/CreateTherapy";
import EditTherapy from "./pages/EditTherapy";
import PractitionerSessions from "./pages/PractitionerSessions";

import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import PractitionerRoute from "./routes/PractitionerRoute";

/* 🔥 ROUTE DEBUGGER */
function RouteLogger() {
  const location = useLocation();

  useEffect(() => {
    console.log("📍 Route changed to:", location.pathname);
  }, [location]);

  return null;
}

export default function App() {
  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      console.error("🔥 FULL PAGE RELOAD DETECTED");
    });
  }, []);

  return (
    <Router>
      <RouteLogger />

      <Routes>
        {/* Root */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ============ USER ============ */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-sessions"
          element={
            <PrivateRoute>
              <MySessions />
            </PrivateRoute>
          }
        />

        <Route
          path="/book-therapy"
          element={
            <PrivateRoute>
              <BookTherapy />
            </PrivateRoute>
          }
        />

        {/* ✅ FINAL FIX — THIS WAS MISSING */}
        <Route
          path="/book-session/:id"
          element={
            <PrivateRoute>
              <BookSession />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <PrivateRoute>
              <ViewProfile />
            </PrivateRoute>
          }
        />

        {/* ============ ADMIN ============ */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* ============ PRACTITIONER ============ */}
        <Route
          path="/practitioner/home"
          element={
            <PractitionerRoute>
              <PractitionerHome />
            </PractitionerRoute>
          }
        />

        <Route
          path="/practitioner/therapies"
          element={
            <PractitionerRoute>
              <ManageTherapies />
            </PractitionerRoute>
          }
        />

        <Route
          path="/practitioner/therapies/create"
          element={
            <PractitionerRoute>
              <CreateTherapy />
            </PractitionerRoute>
          }
        />

        <Route
          path="/practitioner/therapies/edit/:id"
          element={
            <PractitionerRoute>
              <EditTherapy />
            </PractitionerRoute>
          }
        />

        <Route
          path="/practitioner/sessions"
          element={
            <PractitionerRoute>
              <PractitionerSessions />
            </PractitionerRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
