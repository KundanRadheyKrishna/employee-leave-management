import React from "react";
import logo from "../../assets/logo.png";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import useAuthStore from "../../store/authStore";

const Navbar = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const loading = useAuthStore((s) => s.loading);
  const openLogin = useAuthStore((s) => s.openLogin);
  const scrolltosection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <nav className="bg-white w-full fixed top-0 left-0 z-50 ">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="w-24 object-contain" />
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <span
              onClick={() => scrolltosection("home")}
              className="hover:text-black cursor-pointer"
            >
              Home
            </span>
            <span
              onClick={() => scrolltosection("features")}
              className="hover:text-black cursor-pointer"
            >
              Feature
            </span>
            <span
              onClick={() => scrolltosection("footer")}
              className="hover:text-black cursor-pointer"
            >
              footer
            </span>
          </div>

          {/* Right Buttons */}
          <div className="flex items-center gap-4">
            {loading ? null : user 
  ? <LogoutButton onClick={logout} /> 
  : <LoginButton onClick={openLogin} />
}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
