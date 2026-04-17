import { Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import LandingPage from "./components/page/LandingPage";
import EmployeDashboard from "./components/page/EmployeDashboard";
import { useEffect } from "react";
import HodDashboard from "./components/page/HodDashboard";
import VcDashboard from "./components/page/VcDashboard";
import AdminDashboard from "./components/page/AdminDashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import useAuthStore from "./store/authStore";
import { account } from "./appwriteConfig";
const App = () => {
  const { pathname } = useLocation();
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
useEffect(() => {
  const checkUser = async () => {
    const { setUser, setLoading } = useAuthStore.getState();

    try {
      const user = await account.get();

      setUser({
        $id: user.$id,
        email: user.email,
        name: user.name,
        department_id: user.department_id,
        manager_id: user.manager_id,
        role: user.role,
      });

    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  checkUser();
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
