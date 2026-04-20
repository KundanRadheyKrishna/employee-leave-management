import React, { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";
import { tablesDB, DB_ID, LEAVE_TABLE_ID } from "../../appwriteConfig";

import ApplyLeave from "../common/ApplyLeave";
import LeaveHistory from "../common/LeaveHistory";

const HodDashboard = () => {
  const user = useAuthStore((s) => s.user);

  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState([]);

  // 🔥 DEBUG + FETCH
  const fetchRequests = async () => {
    try {
      const res = await tablesDB.listRows(DB_ID, LEAVE_TABLE_ID);

      console.log("🔥 ALL LEAVES:", res.rows);
      console.log("🔥 CURRENT USER:", user);

      const filtered = res.rows.filter((item) => {
        console.log("➡️ ROW approver_id:", item.approver_id);
        console.log("➡️ USER ID:", user?.id);
        console.log("➡️ MATCH:", item.approver_id === user?.id);

        return item.approver_id === user?.id;
      });

      console.log("✅ FILTERED RESULT:", filtered);

      setRequests(filtered);
    } catch (err) {
      console.log("❌ fetch error", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchRequests();
    }
  }, [user]);

  // ✅ FINAL APPROVAL (HOD ONLY)
  const handleAction = async (row, action) => {
    try {
      if (row.status !== "pending") return;

      const updateData =
        action === "approved"
          ? { status: "approved", current_level: "hod" }
          : { status: "rejected", current_level: "hod" };

      await tablesDB.updateRow(DB_ID, LEAVE_TABLE_ID, row.$id, updateData);

      fetchRequests();
    } catch (err) {
      console.log("❌ action error", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">

      {/* HEADER */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h1 className="text-2xl font-bold">HOD Dashboard</h1>
        <p>{user?.name}</p>
        <p className="text-sm text-gray-500">{user?.department_id}</p>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => setActiveTab("requests")} className="tab">Requests</button>
        <button onClick={() => setActiveTab("apply")} className="tab">Apply</button>
        <button onClick={() => setActiveTab("my")} className="tab">My Leaves</button>
      </div>

      <div className="bg-white p-5 rounded-xl shadow">

        {/* 🔥 REQUESTS */}
        {activeTab === "requests" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Employee Requests</h2>

            {requests.length === 0 ? (
              <p className="text-gray-500">No requests found</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th>Employee</th>
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

                      <td>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            r.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : r.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      <td className="flex gap-2">
                        <button
                          disabled={r.status !== "pending"}
                          onClick={() => handleAction(r, "approved")}
                          className="bg-green-500 text-white px-2 py-1 rounded disabled:bg-gray-300"
                        >
                          Approve
                        </button>

                        <button
                          disabled={r.status !== "pending"}
                          onClick={() => handleAction(r, "rejected")}
                          className="bg-red-500 text-white px-2 py-1 rounded disabled:bg-gray-300"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* APPLY */}
        {activeTab === "apply" && <ApplyLeave />}

        {/* MY LEAVES */}
        {activeTab === "my" && <LeaveHistory userId={user?.id} />}
      </div>
    </div>
  );
};

export default HodDashboard;