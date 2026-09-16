import React, { useEffect, useState } from "react";
import { Query } from "appwrite";
import useAuthStore from "../../store/authStore";
import { explainAppwriteError, listLeaves } from "../../utils/appwriteData";
import { displayDate, getWeekdays } from "../../utils/leaveRules";

const LeaveHistory = ({ scope = "mine" }) => {
  const user = useAuthStore((state) => state.user);
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const queries = scope === "mine" ? [Query.equal("user_id", user.id)] : [];
        const response = await listLeaves(queries);
        setLeaves(response.rows);
      } catch (loadError) {
        setError(explainAppwriteError(loadError, "Unable to load leave history."));
      }
    };
    if (user?.id) load();
  }, [scope, user]);

  return (
    <section className="rounded-xl bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold">Leave history</h2>
      {error && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b text-slate-500"><tr><th className="p-3">Dates</th><th className="p-3">Type</th><th className="p-3">Days</th><th className="p-3">Status</th><th className="p-3">Reason</th></tr></thead>
          <tbody>
            {[...leaves].sort((a, b) => String(b.created_at || b.$createdAt).localeCompare(String(a.created_at || a.$createdAt))).map((leave) => <tr key={leave.$id} className="border-b last:border-0"><td className="p-3">{displayDate(leave.from_date)} - {displayDate(leave.to_date)}</td><td className="p-3 capitalize">{leave.leave_type?.replace("_", " ")}</td><td className="p-3">{leave.days || getWeekdays(leave.from_date, leave.to_date)}</td><td className="p-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs capitalize">{leave.status}</span></td><td className="max-w-xs truncate p-3">{leave.reason}</td></tr>)}
          </tbody>
        </table>
        {leaves.length === 0 && <p className="p-8 text-center text-sm text-slate-500">No leave records found.</p>}
      </div>
    </section>
  );
};

export default LeaveHistory;
