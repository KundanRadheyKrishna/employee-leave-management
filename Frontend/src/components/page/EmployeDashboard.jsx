import React from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../appwriteConfig";
import useAuthStore from "../../store/authStore";

const EmployeDashboard = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const handlelogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.log("logout erroe", error);
    }
  };
  const user = {
    name: "John Doe",
    role: "Employee",
    department: "IT",
  };

  const stats = [
    { title: "Total Leaves", value: 12 },
    { title: "Approved", value: 8 },
    { title: "Pending", value: 3 },
    { title: "Rejected", value: 1 },
  ];

  const actions = ["Apply Leave", "View Status", "Leave History", "Profile"];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <p className="text-gray-600">
          Welcome, <span className="font-semibold">{user.name}</span>
        </p>
        <p className="text-sm text-gray-500">
          {user.role} • {user.department}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow text-center"
          >
            <p className="text-gray-500 text-sm">{item.title}</p>
            <p className="text-xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              {action}
            </button>
          ))}

          <button onClick={handlelogout}>logout</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeDashboard;
