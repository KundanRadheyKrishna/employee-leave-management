import React, { useEffect, useState } from "react";
import { tablesDB, DB_ID, LEAVE_TABLE_ID } from "../../appwriteConfig";
import useAuthStore from "../../store/authStore";
import { Query } from "appwrite";
import {
  Calendar,
  FileText,
  BadgeCheck,
  XCircle,
  Clock,
  X,
} from "lucide-react";

const LeaveHistory = () => {
  const user = useAuthStore((s) => s.user);
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null); // 🔥 new

  useEffect(() => {
    const fetchLeaves = async () => {
      if (!user?.id) return;

      try {
        const res = await tablesDB.listRows(DB_ID, LEAVE_TABLE_ID, [
          Query.equal("user_id", user.id),
          Query.orderDesc("created_at"),
        ]);

        setLeaves(res.rows);
      } catch (err) {
        console.log("Fetch leaves error:", err);
      }
    };

    fetchLeaves();
  }, [user]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const statusStyle = {
    approved: "bg-green-100 text-green-600",
    rejected: "bg-red-100 text-red-600",
    pending: "bg-yellow-100 text-yellow-600",
  };

  const statusIcon = {
    approved: <BadgeCheck size={16} />,
    rejected: <XCircle size={16} />,
    pending: <Clock size={16} />,
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Leave History</h2>

      {leaves.length === 0 ? (
        <p className="text-gray-500 text-center">No leave records</p>
      ) : (
        <div className="grid gap-4">
          {leaves.map((l) => (
            <div
              key={l.$id}
              onClick={() => setSelectedLeave(l)} // 🔥 click
              className="bg-white p-4 rounded-xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 font-semibold text-lg">
                  <FileText size={18} />
                  {l.leave_type}
                </div>

                <div
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusStyle[l.status]}`}
                >
                  {statusIcon[l.status]}
                  {l.status}
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Calendar size={16} />
                <span>
                  {formatDate(l.from_date)} → {formatDate(l.to_date)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔥 MODAL */}
      {selectedLeave && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md rounded-xl p-6 relative shadow-xl animate-scaleIn">

            {/* Close */}
            <button
              onClick={() => setSelectedLeave(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText size={20} />
              Leave Details
            </h3>

            <div className="space-y-3 text-sm">

              <p><strong>Type:</strong> {selectedLeave.leave_type}</p>

              <p><strong>Status:</strong> {selectedLeave.status}</p>

              <p>
                <strong>From:</strong>{" "}
                {formatDate(selectedLeave.from_date)}
              </p>

              <p>
                <strong>To:</strong>{" "}
                {formatDate(selectedLeave.to_date)}
              </p>

              {/* optional fields */}
              {selectedLeave.reason && (
                <p><strong>Reason:</strong> {selectedLeave.reason}</p>
              )}

              <p>
                <strong>Applied On:</strong>{" "}
                {formatDate(selectedLeave.created_at)}
              </p>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveHistory;