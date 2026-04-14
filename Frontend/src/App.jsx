import { Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import LandingPage from "./components/page/LandingPage";
import EmployeDashboard from "./components/page/EmployeDashboard";
import { useEffect } from "react";
import HodDashboard from "./components/page/HodDashboard";
import VcDashboard from "./components/page/VcDashboard";
import AdminDashboard from "./components/page/AdminDashboard";
import ProtectedRoute from "./utils/ProtectedRoute";

const App = () => {
  const { pathname } = useLocation();
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute role="employee">
              <EmployeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hod-dashboard"
          element={
            <ProtectedRoute role="hod">
              <HodDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vc-dashboard"
          element={
            <ProtectedRoute role="vc">
              <VcDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
