import React, { useState } from "react";
import { tablesDB, DB_ID, LEAVE_TABLE_ID } from "../../appwriteConfig";
import useAuthStore from "../../store/authStore";

const ApplyLeave = () => {
  const user = useAuthStore((s) => s.user);

  const [form, setForm] = useState({
    from: "",
    to: "",
    reason: "",
    leave_type: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert("User not logged in");
      return;
    }

    // employee + hod ke liye required
    if (
      (user.role === "employee" || user.role === "hod") &&
      (!user.department_id || !user.manager_id)
    ) {
      alert("User department or manager not assigned");
      return;
    }

    if (!form.from || !form.to || !form.reason || !form.leave_type) {
      alert("All fields are required");
      return;
    }

    // 🔥 ROLE-BASED LOGIC
    let approverId = null;
    let level = "";
    let status = "pending";

    if (user.role === "employee") {
      approverId = user.manager_id; // HOD
      level = "hod";
    } else if (user.role === "hod") {
      approverId = user.manager_id; // VC
      level = "vc";
    } else if (user.role === "vc") {
      approverId = null;
      level = "vc";
      status = "approved"; // 🔥 auto approve
    }

    try {
      await tablesDB.createRow(DB_ID, LEAVE_TABLE_ID, "unique()", {
        user_id: user.id,
        department_id: user.department_id,
        approver_id: approverId,
        leave_type: form.leave_type,
        from_date: form.from,
        to_date: form.to,
        reason: form.reason,
        status: status,
        current_level: level,
        created_at: new Date().toISOString(),
      });

      alert(
        user.role === "vc"
          ? "Leave auto-approved"
          : "Leave applied successfully"
      );

      setForm({ from: "", to: "", reason: "", leave_type: "" });

    } catch (err) {
      console.log("Apply leave error:", err);
      alert(err.message || "Failed to apply leave");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl">
      <h2 className="text-xl font-bold mb-4">Apply Leave</h2>

      {/* 🔒 USER INFO (READ ONLY) */}
      <div className="space-y-3 mb-4">

        <div>
          <label className="text-sm font-medium">Employee Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded bg-gray-100"
            value={user?.name || ""}
            readOnly
          />
        </div>

        <div>
          <label className="text-sm font-medium">Department</label>
          <input
            type="text"
            className="w-full border p-2 rounded bg-gray-100"
            value={user?.department_id || ""}
            readOnly
          />
        </div>

        <div>
          <label className="text-sm font-medium">Manager</label>
          <input
            type="text"
            className="w-full border p-2 rounded bg-gray-100"
            value={user?.manager_id || ""}
            readOnly
          />
        </div>

      </div>

      <form onSubmit={handleSubmit} className="space-y-3">

        {/* Leave Type */}
        <div>
          <label className="text-sm font-medium">Leave Type</label>
          <select
            className="w-full border p-2 rounded"
            value={form.leave_type}
            onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
          >
            <option value="">Select Leave Type</option>
            <option value="casual">Casual</option>
            <option value="sick">Sick</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* Dates */}
        <div>
          <label className="text-sm font-medium">From Date</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={form.from}
            onChange={(e) => setForm({ ...form, from: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium">To Date</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={form.to}
            onChange={(e) => setForm({ ...form, to: e.target.value })}
          />
        </div>

        {/* Reason */}
        <div>
          <label className="text-sm font-medium">Reason</label>
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Enter reason"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />
        </div>

        <button className="bg-green-600 text-white w-full py-2 rounded">
          Submit Leave
        </button>

      </form>
    </div>
  );
};

export default ApplyLeave;