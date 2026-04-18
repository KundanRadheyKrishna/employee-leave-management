// import React, { useState } from "react";
// import { tablesDB, DB_ID, LEAVE_TABLE_ID } from "../../appwriteConfig";
// import useAuthStore from "../../store/authStore";

// const ApplyLeave = () => {
//   const user = useAuthStore((s) => s.user);
// console.log("USER:", user);
//   const [form, setForm] = useState({
//     from: "",
//     to: "",
//     reason: "",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // 🔥 SAFETY CHECK (MOST IMPORTANT)
//     if (!user || !user.id) {
//       alert("User not logged in");
//       return;
//     }

//     if (!user.department_id || !user.manager_id) {
//       alert("User department or manager not assigned");
//       return;
//     }

//     if (!form.from || !form.to || !form.reason) {
//       alert("All fields are required");
//       return;
//     }

//     try {
//       await tablesDB.createRow(
//         DB_ID,
//         LEAVE_TABLE_ID,
//         "unique()",
//         {
//           user_id: user.id,
//           department_id: user.department_id,
//           approver_id: user.manager_id, // HOD only
//           from_date: form.from,
//           to_date: form.to,
//           reason: form.reason,
//           status: "pending",
//           current_level: "hod",
//           created_at: new Date().toISOString(),
//         }
//       );

//       alert("Leave applied successfully");

//       setForm({ from: "", to: "", reason: "" });

//     } catch (err) {
//       console.log("Apply leave error:", err);
//       alert(err.message || "Failed to apply leave");
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow max-w-xl">
//       <h2 className="text-xl font-bold mb-4">Apply Leave</h2>

//       <form onSubmit={handleSubmit} className="space-y-3">

//         <input
//           type="date"
//           className="w-full border p-2 rounded"
//           value={form.from}
//           onChange={(e) => setForm({ ...form, from: e.target.value })}
//         />

//         <input
//           type="date"
//           className="w-full border p-2 rounded"
//           value={form.to}
//           onChange={(e) => setForm({ ...form, to: e.target.value })}
//         />

//         <textarea
//           className="w-full border p-2 rounded"
//           placeholder="Reason"
//           value={form.reason}
//           onChange={(e) => setForm({ ...form, reason: e.target.value })}
//         />

//         <button className="bg-green-600 text-white w-full py-2 rounded">
//           Submit Leave
//         </button>

//       </form>
//     </div>
//   );
// };

// export default ApplyLeave;

// import React, { useState } from "react";
// import { tablesDB, DB_ID, LEAVE_TABLE_ID } from "../../appwriteConfig";
// import useAuthStore from "../../store/authStore";

// const ApplyLeave = () => {
//   const user = useAuthStore((s) => s.user);

//   const [form, setForm] = useState({
//     from: "",
//     to: "",
//     reason: "",
//     leave_type: "",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!user || !user.id) {
//       alert("User not logged in");
//       return;
//     }

//     if (!user.department_id || !user.manager_id) {
//       alert("User department or manager not assigned");
//       return;
//     }

//     if (!form.from || !form.to || !form.reason || !form.leave_type) {
//       alert("All fields are required");
//       return;
//     }

//     try {
//       await tablesDB.createRow(DB_ID, LEAVE_TABLE_ID, "unique()", {
//         user_id: user.id,
//         department_id: user.department_id,
//         approver_id: user.manager_id,
//         leave_type: form.leave_type,
//         from_date: form.from,
//         to_date: form.to,
//         reason: form.reason,
//         status: "pending",
//         current_level: "hod",
//         created_at: new Date().toISOString(),
//       });

//       alert("Leave applied successfully");
//       setForm({ from: "", to: "", reason: "", leave_type: "" });

//     } catch (err) {
//       console.log("Apply leave error:", err);
//       alert(err.message || "Failed to apply leave");
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow max-w-xl">
//       <h2 className="text-xl font-bold mb-4">Apply Leave</h2>

//       {/* 🔒 READ ONLY USER INFO */}
//       <div className="space-y-2 mb-4">
//         <input
//           type="text"
//           className="w-full border p-2 rounded bg-gray-100"
//           value={user?.email || ""}
//           readOnly
//         />

//         <input
//           type="text"
//           className="w-full border p-2 rounded bg-gray-100"
//           value={user?.department_id || ""}
//           readOnly
//         />

//         <input
//           type="text"
//           className="w-full border p-2 rounded bg-gray-100"
//           value={user?.manager_id || ""}
//           readOnly
//         />
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-3">

//         {/* Leave Type */}
//         <select
//           className="w-full border p-2 rounded"
//           value={form.leave_type}
//           onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
//         >
//           <option value="">Select Leave Type</option>
//           <option value="casual">Casual</option>
//           <option value="sick">Sick</option>
//           <option value="paid">Paid</option>
//         </select>

//         {/* Dates */}
//         <input
//           type="date"
//           className="w-full border p-2 rounded"
//           value={form.from}
//           onChange={(e) => setForm({ ...form, from: e.target.value })}
//         />

//         <input
//           type="date"
//           className="w-full border p-2 rounded"
//           value={form.to}
//           onChange={(e) => setForm({ ...form, to: e.target.value })}
//         />

//         {/* Reason */}
//         <textarea
//           className="w-full border p-2 rounded"
//           placeholder="Reason"
//           value={form.reason}
//           onChange={(e) => setForm({ ...form, reason: e.target.value })}
//         />

//         <button className="bg-green-600 text-white w-full py-2 rounded">
//           Submit Leave
//         </button>

//       </form>
//     </div>
//   );
// };

// export default ApplyLeave;

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

    if (!user.department_id || !user.manager_id) {
      alert("User department or manager not assigned");
      return;
    }

    if (!form.from || !form.to || !form.reason || !form.leave_type) {
      alert("All fields are required");
      return;
    }

    try {
      await tablesDB.createRow(DB_ID, LEAVE_TABLE_ID, "unique()", {
        user_id: user.id,
        department_id: user.department_id,
        approver_id: user.manager_id,
        leave_type: form.leave_type,
        from_date: form.from,
        to_date: form.to,
        reason: form.reason,
        status: "pending",
        current_level: "hod",
        created_at: new Date().toISOString(),
      });

      alert("Leave applied successfully");
      setForm({ from: "", to: "", reason: "", leave_type: "" });

    } catch (err) {
      console.log("Apply leave error:", err);
      alert(err.message || "Failed to apply leave");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl">
      <h2 className="text-xl font-bold mb-4">Apply Leave</h2>

      {/* 🔒 READ ONLY USER INFO */}
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