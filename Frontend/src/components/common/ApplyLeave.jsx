// import React, { useState } from "react";
// // import { databases, ID } from "../../appwriteConfig";
// import { Databases ,ID } from "appwrite";
// import useAuthStore from "../../store/authStore";

// const DB_ID = "YOUR_DB_ID";
// const LEAVE_COLLECTION = "leaves";

// const ApplyLeave = () => {
//   const user = useAuthStore((s) => s.user);

//   const [form, setForm] = useState({
//     from: "",
//     to: "",
//     reason: "",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await databases.createDocument(
//         DB_ID,
//         LEAVE_COLLECTION,
//         ID.unique(),
//         {
//           user_id: user.$id,
//           department_id: user.department_id,
//           approver_id: user.manager_id, // 🔥 HOD ONLY
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
//       console.log(err);
//       alert("Error applying leave");
//     }
//   };

//   return (
//     <div className="bg-white p-5 rounded-xl shadow max-w-xl">
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

// // const LEAVE_TABLE_ID = "YOUR_LEAVES_COLLECTION_ID";

// const ApplyLeave = () => {
//   const user = useAuthStore((s) => s.user);

//   const [form, setForm] = useState({
//     from: "",
//     to: "",
//     reason: "",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await tablesDB.createRow(
//         DB_ID,
//         LEAVE_TABLE_ID,
//         "unique()",
//         {
//           user_id: user.$id,
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
//       alert("Failed to apply leave");
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


import React, { useState } from "react";
import { tablesDB, DB_ID, LEAVE_TABLE_ID } from "../../appwriteConfig";
import useAuthStore from "../../store/authStore";

const ApplyLeave = () => {
  const user = useAuthStore((s) => s.user);
console.log("USER:", user);
  const [form, setForm] = useState({
    from: "",
    to: "",
    reason: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 SAFETY CHECK (MOST IMPORTANT)
    if (!user || !user.id) {
      alert("User not logged in");
      return;
    }

    if (!user.department_id || !user.manager_id) {
      alert("User department or manager not assigned");
      return;
    }

    if (!form.from || !form.to || !form.reason) {
      alert("All fields are required");
      return;
    }

    try {
      await tablesDB.createRow(
        DB_ID,
        LEAVE_TABLE_ID,
        "unique()",
        {
          user_id: user.id,
          department_id: user.department_id,
          approver_id: user.manager_id, // HOD only
          from_date: form.from,
          to_date: form.to,
          reason: form.reason,
          status: "pending",
          current_level: "hod",
          created_at: new Date().toISOString(),
        }
      );

      alert("Leave applied successfully");

      setForm({ from: "", to: "", reason: "" });

    } catch (err) {
      console.log("Apply leave error:", err);
      alert(err.message || "Failed to apply leave");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl">
      <h2 className="text-xl font-bold mb-4">Apply Leave</h2>

      <form onSubmit={handleSubmit} className="space-y-3">

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

        <button className="bg-green-600 text-white w-full py-2 rounded">
          Submit Leave
        </button>

      </form>
    </div>
  );
};

export default ApplyLeave;