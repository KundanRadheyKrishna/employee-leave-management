import React, { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
import {
  createNotification,
  explainAppwriteError,
  listLeaves,
  listUsers,
  updateLeave,
} from "../../utils/appwriteData";
import { displayDate } from "../../utils/leaveRules";

const ApprovalQueue = ({ level }) => {
  const user = useAuthStore((state) => state.user);
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  const load = async () => {
    try {
      const leaveResponse = await listLeaves();
      try {
        const userResponse = await listUsers();
        setUsers(Object.fromEntries(userResponse.rows.map((row) => [row.$id, row])));
      } catch {
        // Approval does not depend on the optional users list permission.
        setUsers({});
      }
      setRows(leaveResponse.rows.filter((leave) => {
        if (leave.status !== "pending" || leave.current_level !== level) return false;
        return level === "hod" ? leave.department_id === user.department_id : true;
      }));
    } catch (loadError) {
      setError(explainAppwriteError(loadError, "Unable to load approval queue."));
    }
  };

  useEffect(() => {
    if (user?.id) load();
    // Queue data is intentionally refreshed when the signed-in role changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, level]);

  const act = async (row, status) => {
    setBusy(row.$id);
    setError("");
    try {
      const nextLevel = status === "rejected" ? "done" : level === "hod" ? "vc" : "done";
      const nextApprover = status === "rejected" ? null : level === "hod" ? user.manager_id : null;
      await updateLeave(row.$id, { status, current_level: nextLevel, approver_id: nextApprover });
      let notificationWarning = "";
      await createNotification({
        user_id: row.user_id,
        leave_id: row.$id,
        message: `Your leave request was ${status} by ${user.name}.`,
      }).catch((notificationError) => {
        notificationWarning = ` Request updated, but notification failed: ${notificationError.message}`;
      });
      if (status === "approved" && nextApprover) {
        await createNotification({
          user_id: nextApprover,
          leave_id: row.$id,
          message: `A leave request from ${users[row.user_id]?.name || row.user_id} needs your approval.`,
        }).catch((notificationError) => {
          notificationWarning = ` Request updated, but next approver notification failed: ${notificationError.message}`;
        });
      }
      if (notificationWarning) setError(notificationWarning);
      setRows((current) => current.filter((item) => item.$id !== row.$id));
    } catch (actionError) {
      setError(explainAppwriteError(actionError, "Unable to process request."));
    } finally {
      setBusy("");
    }
  };

  return (
    <section className="rounded-xl bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold">{level === "hod" ? "Department requests" : "HOD requests"}</h2>
      {error && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-5 space-y-3">
        {rows.length === 0 && <p className="rounded-lg bg-slate-50 p-8 text-center text-sm text-slate-500">No pending requests.</p>}
        {rows.map((row) => (
          <article key={row.$id} className="rounded-lg border p-4">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="font-semibold">{users[row.user_id]?.name || row.user_id}</p>
                <p className="text-sm text-slate-500">{row.leave_type?.replace("_", " ")} · {row.days} working day(s)</p>
              </div>
              <p className="text-sm">{displayDate(row.from_date)} - {displayDate(row.to_date)}</p>
            </div>
            <p className="mt-2 text-sm text-slate-600">{row.reason}</p>
            <div className="mt-3 flex gap-2">
              <button disabled={busy === row.$id} onClick={() => act(row, "approved")} className="rounded bg-green-600 px-3 py-2 text-sm text-white disabled:opacity-50">Approve</button>
              <button disabled={busy === row.$id} onClick={() => act(row, "rejected")} className="rounded bg-red-600 px-3 py-2 text-sm text-white disabled:opacity-50">Reject</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ApprovalQueue;
