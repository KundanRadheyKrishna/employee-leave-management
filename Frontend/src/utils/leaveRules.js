export const LEAVE_TYPES = ["casual", "sick", "earned", "half_day"];
export const LEAVE_STATUSES = ["pending", "approved", "rejected", "cancelled"];

export const getWeekdays = (from, to) => {
  if (!from || !to) return 0;
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return 0;
  }
  let days = 0;
  for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    if (date.getDay() !== 0 && date.getDay() !== 6) days += 1;
  }
  return days;
};

export const roleDashboard = {
  admin: "/admin-dashboard",
  employee: "/employee-dashboard",
  hod: "/hod-dashboard",
  vc: "/vc-dashboard",
};

export const displayDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";
