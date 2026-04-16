import React, { useState } from "react";
import logo from "../../assets/logo.png";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import useAuthStore from "../../store/authStore";
import SkeletonWrapper from "./SkeletonWrapper";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const loading = useAuthStore((s) => s.loading);
  const openLogin = useAuthStore((s) => s.openLogin);

  const scrolltosection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white w-full fixed top-0 left-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <img src={logo} alt="logo" className="w-24 object-contain" />

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <span
              onClick={() => scrolltosection("home")}
              className="cursor-pointer hover:text-black"
            >
              Home
            </span>
            <span
              onClick={() => scrolltosection("features")}
              className="cursor-pointer hover:text-black"
            >
              Feature
            </span>
            <span
              onClick={() => scrolltosection("footer")}
              className="cursor-pointer hover:text-black"
            >
              Footer
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Desktop Auth Button */}
            <div className="hidden md:block">
              <SkeletonWrapper loading={loading}  width={37} height={20}>
                {user ? (
                  <LogoutButton onClick={logout} />
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
          <div className="md:hidden flex flex-col gap-4 py-4 text-gray-600 border-t">
            <span
              onClick={() => scrolltosection("home")}
              className="cursor-pointer"
            >
              Home
            </span>
            <span
              onClick={() => scrolltosection("features")}
              className="cursor-pointer"
            >
              Feature
            </span>
            <span
              onClick={() => scrolltosection("footer")}
              className="cursor-pointer"
            >
              Footer
            </span>

            {/* Mobile Auth Button */}
            <SkeletonWrapper loading={loading} type="button">
              {user ? (
                <LogoutButton onClick={logout} />
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
