import React from "react";

const HodDashboard = () => {
  const hod = {
    name: "Dr. Sharma",
    department: "Computer Science",
  };

  const requests = [
    { name: "Amit Kumar", type: "Casual Leave", status: "Pending" },
    { name: "Neha Singh", type: "Medical Leave", status: "Approved" },
    { name: "Rahul Verma", type: "Earned Leave", status: "Rejected" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">HOD Dashboard</h1>
          <p className="text-gray-600">
            Welcome, <span className="font-semibold">{hod.name}</span>
          </p>
          <p className="text-sm text-gray-500">{hod.department}</p>
        </div>

        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Pending Requests</p>
          <p className="text-2xl font-bold">5</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Approved</p>
          <p className="text-2xl font-bold">12</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Rejected</p>
          <p className="text-2xl font-bold">3</p>
        </div>
      </div>

      {/* REQUEST TABLE */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Leave Requests</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th className="py-2">Employee</th>
                <th className="py-2">Type</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3">{req.name}</td>
                  <td>{req.type}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        req.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : req.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>

                  <td className="text-center">
                    <button className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600">
                      Approve
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default HodDashboard;