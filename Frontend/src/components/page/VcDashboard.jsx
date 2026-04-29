import React, { useEffect, useState } from "react";
import { account, tablesDB, DB_ID, LEAVE_TABLE_ID } from "../../appwriteConfig";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";

import LeaveHistory from "../common/LeaveHistory";
import VcApplyLeave from "../common/VcApplyLeave"; // ✅ IMPORT FIX

const VcDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState([]);

  // 🔥 FETCH HOD REQUESTS
  const fetchRequests = async () => {
    try {
      const res = await tablesDB.listRows(DB_ID, LEAVE_TABLE_ID);

      const filtered = res.rows.filter(
        (item) =>
          item.current_level === "vc" ||
          item.current_level === "done"
      );

      setRequests(filtered);
    } catch (err) {
      console.log("VC fetch error", err);
    }
  };

  useEffect(() => {
    if (user?.id) fetchRequests();
  }, [user]);

  // 🔥 APPROVE / REJECT
  const handleAction = async (id, action) => {
    try {
      await tablesDB.updateRow(DB_ID, LEAVE_TABLE_ID, id, {
        status: action,
        current_level: "done", // ✅ stays visible
      });

      fetchRequests();
    } catch (err) {
      console.log("VC action error", err);
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.log("logout error", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">

      {/* HEADER */}
      <div className="bg-white p-5 rounded-xl shadow flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">VC Dashboard</h1>
          <p className="text-gray-500">{user?.name}</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button onClick={() => setActiveTab("requests")} className="tab">Requests</button>
        <button onClick={() => setActiveTab("apply")} className="tab">Apply</button>
        <button onClick={() => setActiveTab("my")} className="tab">My Leaves</button>
      </div>

      {/* CONTENT */}
      <div className="bg-white p-5 rounded-xl shadow">

        {/* REQUESTS */}
        {activeTab === "requests" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">HOD Requests</h2>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th>User</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((r) => (
                  <tr key={r.$id} className="border-b">
                    <td>{r.user_id}</td>
                    <td>{r.leave_type}</td>

                    <td>{r.status}</td>

                    <td className="flex gap-2">
                      <button
                        onClick={() => handleAction(r.$id, "approved")}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleAction(r.$id, "rejected")}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* APPLY */}
        {activeTab === "apply" && <VcApplyLeave />}

        {/* MY HISTORY */}
        {activeTab === "my" && <LeaveHistory userId={user.id} />}

      </div>
    </div>
  );
};

export default VcDashboard;