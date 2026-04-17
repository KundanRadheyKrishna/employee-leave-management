import React from "react";

const Notifications = () => {
  const notifications = [
    "Your leave is approved",
    "HR updated leave policy",
    "Pending leave request reminder",
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>

      <ul className="space-y-2">
        {notifications.map((n, i) => (
          <li key={i} className="p-2 bg-gray-100 rounded">
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;