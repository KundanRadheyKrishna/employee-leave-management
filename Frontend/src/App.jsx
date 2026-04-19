import { Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import LandingPage from "./components/page/LandingPage";
import EmployeDashboard from "./components/page/EmployeDashboard";
import HodDashboard from "./components/page/HodDashboard";
import VcDashboard from "./components/page/VcDashboard";
import AdminDashboard from "./components/page/AdminDashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import useAuthStore from "./store/authStore";

const App = () => {
  const { pathname } = useLocation();

  // scroll fix
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // 🔥 FIX: initUser use kiya (role + login dono yahin se aayega)
  useEffect(() => {
    useAuthStore.getState().initUser(); // ✅ correct
  }, []);

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