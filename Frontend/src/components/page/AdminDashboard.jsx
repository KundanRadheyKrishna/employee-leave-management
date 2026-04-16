import React from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../appwriteConfig";
import useAuthStore from "../../store/authStore";

const AdminDashboard = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  // const handleLogout = async () => {
  //   try {
  //     await account.deleteSession("current");
  //     setUser(null);
  //     navigate("/");
  //   } catch (err) {
  //     console.log("logout error", err);
  //   }
  // };

  const stats = [
    { title: "Total Employees", value: 120 },
    { title: "Departments", value: 8 },
    { title: "Total Leaves", value: 300 },
    { title: "Pending Approvals", value: 20 },
  ];

  const actions = [
    "Manage Employees",
    "Manage Departments",
    "Assign Roles",
    "System Settings",
    "View Reports",
    "Audit Logs",
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Full system control & management</p>
        </div>

        {/* <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button> */}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow text-center hover:scale-105 transition"
          >
            <p className="text-gray-500 text-sm">{item.title}</p>
            <p className="text-xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Admin Controls</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {actions.map((action, i) => (
            <button
              key={i}
              className="bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
