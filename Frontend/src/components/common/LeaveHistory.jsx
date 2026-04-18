import React, { useEffect, useState } from "react";
import { tablesDB, DB_ID, LEAVE_TABLE_ID } from "../../appwriteConfig";
import useAuthStore from "../../store/authStore";
import { Query } from "appwrite";

const LeaveHistory = () => {
  const user = useAuthStore((s) => s.user);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      if (!user || !user.id) return;

      try {
        const res = await tablesDB.listRows(
          DB_ID,
          LEAVE_TABLE_ID,
          [
            Query.equal("user_id", user.id),
            Query.orderDesc("created_at"),
          ]
        );

        setLeaves(res.rows);

      } catch (err) {
        console.log("Fetch leaves error:", err);
      }
    };

    fetchLeaves();
  }, [user]);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Leave History</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No leave records
              </td>
            </tr>
          ) : (
            leaves.map((l) => (
              <tr key={l.$id} className="border-b">
                <td>{l.leave_type}</td>
                <td>{l.from_date}</td>
                <td>{l.to_date}</td>
                <td
                  className={
                    l.status === "approved"
                      ? "text-green-600"
                      : l.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {l.status}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveHistory;