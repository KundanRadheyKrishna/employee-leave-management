import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../appwriteConfig";
import useAuthStore from "../../store/authStore";

import ApplyLeave from "../common/ApplyLeave";
import LeaveHistory from "../common/LeaveHistory";
import Notifications from "../common/Notifications";

import { Menu, X, Bell, FileText, ClipboardList, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EmployeeDashboard = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("apply");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.log("logout error", err);
    }
  };

  const menuItems = [
    { id: "apply", label: "Apply Leave", icon: <FileText size={18} /> },
    { id: "history", label: "Leave History", icon: <ClipboardList size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-white flex">

      {/* TOP NAVBAR */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow flex items-center justify-between px-4 md:px-8 z-50">
        <h1 className="text-lg md:text-xl font-bold text-green-700">
          Employee Panel
        </h1>

        <button
          className="md:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu />
        </button>
      </div>

      {/* SIDEBAR DESKTOP */}
      <div className="hidden md:flex flex-col w-64 bg-white shadow-lg p-5 mt-16">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition-all duration-200
              ${
                activeTab === item.id
                  ? "bg-green-100 text-green-800 font-semibold"
                  : "hover:bg-green-50"
              }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 mt-auto bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* OVERLAY */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />

            {/* SIDEBAR */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 flex flex-col justify-center px-6"
            >
              <button
                className="absolute top-4 right-4"
                onClick={() => setSidebarOpen(false)}
              >
                <X />
              </button>

              <div className="flex flex-col gap-4 items-center">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl text-center transition
                      ${
                        activeTab === item.id
                          ? "bg-green-100 text-green-800 font-semibold"
                          : "hover:bg-green-50"
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </motion.button>
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full mt-6 bg-red-500 text-white p-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div className="flex-1 mt-16 p-4 md:p-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-xl rounded-2xl p-5 border border-green-100"
        >
          {activeTab === "apply" && <ApplyLeave />}
          {activeTab === "history" && <LeaveHistory />}
          {activeTab === "notifications" && <Notifications />}
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
