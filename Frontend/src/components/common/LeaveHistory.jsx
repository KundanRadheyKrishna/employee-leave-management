import React from "react";

const LeaveHistory = () => {
  const leaves = [
    { from: "2026-04-10", to: "2026-04-12", status: "Approved" },
    { from: "2026-03-01", to: "2026-03-03", status: "Pending" },
    { from: "2026-02-15", to: "2026-02-16", status: "Rejected" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Leave History</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th>From</th>
            <th>To</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {leaves.map((l, i) => (
            <tr key={i} className="border-b">
              <td>{l.from}</td>
              <td>{l.to}</td>
              <td className={
                l.status === "Approved"
                  ? "text-green-600"
                  : l.status === "Rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }>
                {l.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveHistory;