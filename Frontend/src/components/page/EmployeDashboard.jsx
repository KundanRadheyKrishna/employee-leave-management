import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../appwriteConfig";
import useAuthStore from "../../store/authStore";

import ApplyLeave from "../common/ApplyLeave";
import LeaveHistory from "../common/LeaveHistory";
import Notifications from "../common/Notifications";

import { Menu } from "lucide-react";

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
    { id: "apply", label: "Apply Leave" },
    { id: "history", label: "Leave History" },
    { id: "notifications", label: "Notifications" },
  ];

  return (
    <div className="min-h-screen flex bg-green-50">

      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow p-4 flex justify-between items-center z-50">
        <h1 className="font-bold text-green-700">Employee Panel</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu />
        </button>
      </div>

      {/* SIDEBAR */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white shadow-lg p-5 transform transition-transform duration-300 z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <h1 className="text-xl font-bold text-green-700 mb-6 hidden md:block">
          Employee Panel
        </h1>

        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setSidebarOpen(false);
            }}
            className={`w-full text-left p-3 rounded-lg mb-2 transition
              ${
                activeTab === item.id
                  ? "bg-green-100 text-green-800 font-semibold"
                  : "hover:bg-green-50"
              }`}
          >
            {item.label}
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* OVERLAY (mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 md:hidden"
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-8 md:ml-64 mt-16 md:mt-0">

        <div className="bg-white shadow rounded-2xl p-5 border border-green-100">

          {activeTab === "apply" && <ApplyLeave />}
          {activeTab === "history" && <LeaveHistory />}
          {activeTab === "notifications" && <Notifications />}

        </div>

      </div>
    </div>
  );
};

export default EmployeeDashboard;