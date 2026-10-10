import React, { useMemo, useState } from "react";
import useAuthStore from "../../store/authStore";
import {
  createLeave,
  createNotification,
  explainAppwriteError,
} from "../../utils/appwriteData";
import { LEAVE_TYPES, getWeekdays } from "../../utils/leaveRules";

const ApplyLeave = () => {
  const user = useAuthStore((state) => state.user);
  const [form, setForm] = useState({ leave_type: "", from_date: "", to_date: "", reason: "" });
  const [state, setState] = useState({ loading: false, error: "", success: "" });
  const days = useMemo(() => getWeekdays(form.from_date, form.to_date), [form.from_date, form.to_date]);

  const submit = async (event) => {
    event.preventDefault();
    if (!user?.department_id && user?.role !== "vc") {
      setState({ loading: false, error: "Ask an admin to assign your department first.", success: "" });
      return;
    }
    if ((user.role === "employee" || user.role === "hod") && !user.manager_id) {
      setState({
        loading: false,
        error: "No approver is assigned to your account. Ask an admin to assign your manager first.",
        success: "",
      });
      return;
    }
    if (days < 1 || !form.leave_type || !form.reason.trim()) {
      setState({ loading: false, error: "Choose valid working-day dates, leave type and reason.", success: "" });
      return;
    }
    if (form.leave_type !== "half_day" && days > Number(user.leave_balance ?? 20)) {
      setStaemp@gmail.comte({ loading: false, error: "You do not have enough leave balance.", success: "" });
      return;
    }
    const approverId =
      user.role === "employee" || user.role === "hod"
        ? user.manager_id
        : null;
    const currentLevel =
      user.role === "employee" ? "hod" : user.role === "hod" ? "vc" : "admin";
    setState({ loading: true, error: "", success: "" });
    try {
      const leave = await createLeave({
        user_id: user.id,
        department_id: user.department_id || "university",
        approver_id: approverId || null,
        leave_type: form.leave_type,
        from_date: form.from_date,
        to_date: form.to_date,
        reason: form.reason.trim(),
        status: "pending",
        current_level: currentLevel,
        created_at: new Date().toISOString(),
      });
      let notificationWarning = "";
      if (approverId) {
        // Notification storage is optional; a missing/locked notifications table
        // must not make a successfully-created leave request appear failed.
        await createNotification({
          user_id: approverId,
          leave_id: leave.$id,
          message: `New ${form.leave_type} leave request from ${user.name}.`,
        }).catch((notificationError) => {
          notificationWarning = ` Leave submitted, but notification could not be created: ${notificationError.message}`;
        });
      }
      setForm({ leave_type: "", from_date: "", to_date: "", reason: "" });
      setState({ loading: false, error: "", success: `Leave request submitted.${notificationWarning}` });
    } catch (submitError) {
      setState({
        loading: false,
        error: explainAppwriteError(submitError, "Unable to submit leave."),
        success: "",
      });
    }
  };

  return (
    <section className="rounded-xl bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold">Apply for leave</h2>
      <p className="mt-1 text-sm text-slate-500">Working days only. Weekends are excluded automatically.</p>
      {state.error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
      {state.success && <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{state.success}</p>}
      <form onSubmit={submit} className="mt-5 space-y-4">
        <select value={form.leave_type} onChange={(event) => setForm({ ...form, leave_type: event.target.value })} className="w-full rounded-lg border p-3" required>
          <option value="">Select leave type</option>
          {LEAVE_TYPES.map((type) => <option key={type} value={type}>{type.replace("_", " ")}</option>)}
        </select>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">From<input type="date" value={form.from_date} onChange={(event) => setForm({ ...form, from_date: event.target.value })} className="mt-1 w-full rounded-lg border p-3" required /></label>
          <label className="text-sm">To<input type="date" min={form.from_date} value={form.to_date} onChange={(event) => setForm({ ...form, to_date: event.target.value })} className="mt-1 w-full rounded-lg border p-3" required /></label>
        </div>
        <p className="text-sm text-slate-500">Counted leave days: <strong>{days}</strong> · Balance: <strong>{user?.leave_balance ?? 20}</strong></p>
        <textarea value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} placeholder="Reason" className="min-h-24 w-full rounded-lg border p-3" required />
        <button disabled={state.loading} className="w-full rounded-lg bg-green-600 p-3 font-semibold text-white disabled:opacity-50">{state.loading ? "Submitting..." : "Submit leave request"}</button>
      </form>
    </section>
  );
};

export default ApplyLeave;
