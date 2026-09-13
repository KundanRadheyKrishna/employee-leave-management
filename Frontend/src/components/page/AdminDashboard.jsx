import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tablesDB, DB_ID, LEAVE_TABLE_ID } from "../../appwriteConfig";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);

  // Fetch pending VC leaves
  const fetchLeaves = async () => {
    try {
      const res = await tablesDB.listRows(
        DB_ID,
        LEAVE_TABLE_ID
      );

      const pending = res.rows.filter(
        (l) => l.status === "pending"
      );

      setLeaves(pending);
    } catch (err) {
      console.log(err);
    }
  };

  // Approve leave
  const approveLeave = async (id) => {
    try {
      await tablesDB.updateRow(
        DB_ID,
        LEAVE_TABLE_ID,
        id,
        { status: "approved" }
      );

      fetchLeaves();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-3">Manage VC</h2>
            <button onClick={() => navigate("/admin/manage-vc")}
              className="bg-black text-white px-4 py-2 rounded">
              Add / Remove VC
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-3">Departments</h2>
            <button onClick={() => navigate("/admin/create-dept")}
              className="bg-black text-white px-4 py-2 rounded mr-2">
              Create
            </button>

            <button onClick={() => navigate("/admin/assign-hod")}
              className="bg-black text-white px-4 py-2 rounded">
              Assign HOD
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-3">Employees</h2>
            <button onClick={() => navigate("/admin/manage-employee")}
              className="bg-black text-white px-4 py-2 rounded">
              Add / Remove Employee
            </button>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="font-semibold mb-4">VC Leave Requests</h2>

          {leaves.length === 0 && (
            <p className="text-gray-500">No Pending Requests</p>
          )}

          {leaves.map((leave) => (
            <div key={leave.$id} className="border p-3 mb-3 rounded">

              <p><b>From:</b> {leave.fromDate}</p>
              <p><b>To:</b> {leave.toDate}</p>
              <p><b>Reason:</b> {leave.reason}</p>

              <button
                onClick={() => approveLeave(leave.$id)}
                className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
              >
                Approve
              </button>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;