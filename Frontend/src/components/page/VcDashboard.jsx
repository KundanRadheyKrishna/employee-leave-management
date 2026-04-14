import React from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../appwriteConfig";
import useAuthStore from "../../store/authStore";

const VcDashboard = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.log("logout error", err);
    }
  };

  const stats = [
    { title: "University Requests", value: 60 },
    { title: "Approved", value: 40 },
    { title: "Pending", value: 15 },
    { title: "Rejected", value: 5 },
  ];

  const actions = [
    "Final Approvals",
    "View All Departments",
    "Policy Control",
    "Reports",
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow mb-6">
        <div>
          <h1 className="text-2xl font-bold">VC Dashboard</h1>
          <p className="text-gray-500">Final authority on leave approvals</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-gray-500 text-sm">{item.title}</p>
            <p className="text-xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Controls</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action, i) => (
            <button
              key={i}
              className="bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VcDashboard;
