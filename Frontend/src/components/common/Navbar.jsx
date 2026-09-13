import React, { useState } from "react";
import logo from "../../assets/logo.png";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import useAuthStore from "../../store/authStore";
import SkeletonWrapper from "./SkeletonWrapper";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "lucide-react"; // 🔥 icon

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const loading = useAuthStore((s) => s.loading);
  const openLogin = useAuthStore((s) => s.openLogin);

  // 🔥 role-based routing
  const getDashboardRoute = () => {
    if (!user || !user.role) return null;  
    const routes = {
      employee: "/employee-dashboard",
      hod: "/hod-dashboard",
      vc: "/vc-dashboard",
      admin: "/admin-dashboard",
    };
    return routes[user.role] || null;
  };

  // 🔥 click handler
  const handleDashboardClick = () => {
    const route = getDashboardRoute();
    if (!route) return;
    navigate(route);
  };

  const scrolltosection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white w-full fixed top-0 left-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <img src={logo} alt="logo" className="w-24 object-contain" />

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 text-sm text-gray-600">
            <span onClick={() => scrolltosection("home")} className="cursor-pointer hover:text-black">
              Home
            </span>
            <span onClick={() => scrolltosection("features")} className="cursor-pointer hover:text-black">
              Feature
            </span>
            <span onClick={() => scrolltosection("footer")} className="cursor-pointer hover:text-black">
              Footer
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <SkeletonWrapper loading={loading} width={90} height={32}>

                {/* 🔥 show only if logged in + role exists */}
                {user && user.role ? (
                  <div className="flex items-center gap-3">

                    {/* 🔥 Dashboard ICON button */}
                    <button
                      onClick={handleDashboardClick}
                      title="Dashboard"
                      className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition"
                    >
                      <LayoutDashboard size={20} className="text-green-700" />
                    </button>

                    <LogoutButton onClick={logout} />
                  </div>
                ) : (
                  <LoginButton onClick={openLogin} />
                )}

              </SkeletonWrapper>
            </div>

            {/* Hamburger */}
            <button
              className="md:hidden text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col items-center gap-4 py-4 border-t text-gray-600">

            <span onClick={() => scrolltosection("home")} className="cursor-pointer">
              Home
            </span>
            <span onClick={() => scrolltosection("features")} className="cursor-pointer">
              Feature
            </span>
            <span onClick={() => scrolltosection("footer")} className="cursor-pointer">
              Footer
            </span>

            <SkeletonWrapper loading={loading}>
              {user && user.role ? (
                <div className="flex flex-col items-center gap-3">

                  {/* 🔥 Mobile icon */}
                  <button
                    onClick={handleDashboardClick}
                    title="Dashboard"
                    className="p-3 rounded-full bg-green-100 hover:bg-green-200 transition"
                  >
                    <LayoutDashboard size={22} className="text-green-700" />
                  </button>

                  <LogoutButton onClick={logout} />
                </div>
              ) : (
                <LoginButton onClick={openLogin} />
              )}
            </SkeletonWrapper>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;