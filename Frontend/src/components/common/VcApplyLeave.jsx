import React, { useState } from "react";
import { tablesDB, DB_ID, LEAVE_TABLE_ID } from "../../appwriteConfig";
import useAuthStore from "../../store/authStore";

const VcApplyLeave = () => {
  const user = useAuthStore((s) => s.user);

  const [form, setForm] = useState({
    from: "",
    to: "",
    reason: "",
    leave_type: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.from || !form.to || !form.reason || !form.leave_type) {
      alert("All fields required");
      return;
    }

    try {
      await tablesDB.createRow(DB_ID, LEAVE_TABLE_ID, "unique()", {
        user_id: user.id,

        // ✅ FIX (NO NULL)
        department_id: user.department_id || "university",

        approver_id: null, // admin future
        leave_type: form.leave_type,
        from_date: form.from,
        to_date: form.to,
        reason: form.reason,

        status: "pending",
        current_level: "admin",
        created_at: new Date().toISOString(),
      });

      alert("Leave sent to Admin");

      setForm({
        from: "",
        to: "",
        reason: "",
        leave_type: "",
      });

    } catch (err) {
      console.log("VC Apply Error:", err);
      alert(err.message || "Error");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">Apply Leave (VC)</h2>

      <form onSubmit={handleSubmit} className="space-y-3">

        <select
          className="w-full border p-2 rounded"
          value={form.leave_type}
          onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
        >
          <option value="">Select Type</option>
          <option value="casual">Casual</option>
          <option value="sick">Sick</option>
          <option value="paid">Paid</option>
        </select>

        <input
          type="date"
          className="w-full border p-2 rounded"
          value={form.from}
          onChange={(e) => setForm({ ...form, from: e.target.value })}
        />

        <input
          type="date"
          className="w-full border p-2 rounded"
          value={form.to}
          onChange={(e) => setForm({ ...form, to: e.target.value })}
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />

        <button className="bg-purple-600 text-white w-full py-2 rounded">
          Submit
        </button>

      </form>
    </div>
  );
};

export default VcApplyLeave;