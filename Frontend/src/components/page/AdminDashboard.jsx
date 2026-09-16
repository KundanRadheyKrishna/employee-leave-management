import React, { useEffect, useMemo, useState } from "react";
import { Query } from "appwrite";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import {
  tablesDB,
  DB_ID,
  DEPARTMENT_TABLE_ID,
  LEAVE_TABLE_ID,
  USER_TABLE_ID,
} from "../../appwriteConfig";
import { ID } from "appwrite";
import useAuthStore from "../../store/authStore";
import { explainAppwriteError } from "../../utils/appwriteData";

const initialEdit = {
  name: "",
  role: "employee",
  department_id: "",
  manager_id: "",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [leaves, setLeaves] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState(initialEdit);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [leaveResponse, userResponse] = await Promise.all([
        tablesDB.listRows(DB_ID, LEAVE_TABLE_ID, [
          Query.orderDesc("created_at"),
          Query.limit(100),
        ]),
        tablesDB.listRows(DB_ID, USER_TABLE_ID, [Query.limit(100)]),
      ]);
      setLeaves(leaveResponse.rows);
      setUsers(userResponse.rows);
      try {
        const departmentResponse = await tablesDB.listRows(DB_ID, DEPARTMENT_TABLE_ID, [Query.limit(100)]);
        setDepartments(departmentResponse.rows);
      } catch (departmentError) {
        setDepartments([]);
        setError(`Departments could not be loaded: ${departmentError.message}`);
      }
    } catch (loadError) {
      setError(explainAppwriteError(loadError, "Unable to load admin data."));
    } finally {
      setLoading(false);
    }
  };

  const createDepartment = async (event) => {
    event.preventDefault();
    const name = departmentName.trim();
    if (!name) return;
    try {
      const department = await tablesDB.createRow(DB_ID, DEPARTMENT_TABLE_ID, ID.unique(), {
        name,
        hod_id: null,
        created_at: new Date().toISOString(),
      });
      setDepartments((current) => [...current, department].sort((a, b) => a.name.localeCompare(b.name)));
      setDepartmentName("");
      setNotice("Department created.");
    } catch (departmentError) {
      setError(explainAppwriteError(departmentError, "Unable to create department."));
    }
  };

  const deleteDepartment = async (department) => {
    const hasUsers = users.some((user) => user.department_id === department.$id || user.department_id === department.name);
    if (hasUsers) {
      setError("A department cannot be deleted while users are assigned to it.");
      return;
    }
    try {
      await tablesDB.deleteRow(DB_ID, DEPARTMENT_TABLE_ID, department.$id);
      setDepartments((current) => current.filter((item) => item.$id !== department.$id));
      setNotice("Department deleted.");
    } catch (departmentError) {
      setError(explainAppwriteError(departmentError, "Unable to delete department."));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredLeaves = useMemo(() => {
    const query = search.trim().toLowerCase();
    return leaves.filter((leave) => {
      const matchesStatus =
        statusFilter === "all" || leave.status === statusFilter;
      const matchesSearch =
        !query ||
        [leave.user_id, leave.leave_type, leave.reason, leave.department_id]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      return matchesStatus && matchesSearch;
    });
  }, [leaves, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: leaves.length,
      pending: leaves.filter((leave) => leave.status === "pending").length,
      approved: leaves.filter((leave) => leave.status === "approved").length,
      rejected: leaves.filter((leave) => leave.status === "rejected").length,
    }),
    [leaves]
  );

  const updateLeaveStatus = async (leave, status) => {
    setActionId(leave.$id);
    setError("");
    try {
      await tablesDB.updateRow(DB_ID, LEAVE_TABLE_ID, leave.$id, {
        status,
        current_level: "done",
      });
      setLeaves((current) =>
        current.map((item) =>
          item.$id === leave.$id
            ? { ...item, status, current_level: "done" }
            : item
        )
      );
      setNotice(`Leave request ${status}.`);
    } catch (actionError) {
      setError(explainAppwriteError(actionError, "Unable to update leave request."));
    } finally {
      setActionId(null);
    }
  };

  const startEditing = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      role: user.role || "employee",
      department_id: user.department_id || "",
      manager_id: user.manager_id || "",
    });
    setNotice("");
  };

  const saveUser = async (event) => {
    event.preventDefault();
    if (!editingUser || !editForm.name.trim()) {
      setError("Name is required.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const oldDepartment = departments.find(
        (department) =>
          department.$id === editingUser.department_id ||
          department.name === editingUser.department_id
      );
      const newDepartment = departments.find(
        (department) =>
          department.$id === editForm.department_id ||
          department.name === editForm.department_id
      );
      if (editForm.role === "hod") {
        if (!newDepartment) throw new Error("Select a valid department before assigning an HOD.");
        if (newDepartment.hod_id && newDepartment.hod_id !== editingUser.$id) {
          throw new Error("This department already has an HOD. Assign a replacement first.");
        }
      }
      if (editingUser.role === "hod" && editForm.role !== "hod" && oldDepartment?.hod_id === editingUser.$id) {
        throw new Error("Assign a replacement HOD before removing the current HOD.");
      }
      if (
        editingUser.role === "hod" &&
        editForm.role === "hod" &&
        oldDepartment?.hod_id === editingUser.$id &&
        newDepartment &&
        oldDepartment.$id !== newDepartment.$id
      ) {
        throw new Error("Assign a replacement HOD before moving the current HOD.");
      }
      const updated = await tablesDB.updateRow(
        DB_ID,
        USER_TABLE_ID,
        editingUser.$id,
        {
          name: editForm.name.trim(),
          role: editForm.role,
          department_id: editForm.department_id.trim(),
          manager_id: editForm.manager_id || "",
        }
      );
      if (newDepartment && editForm.role === "hod" && newDepartment.hod_id !== editingUser.$id) {
        await tablesDB.updateRow(DB_ID, DEPARTMENT_TABLE_ID, newDepartment.$id, { hod_id: editingUser.$id });
      }
      setUsers((current) =>
        current.map((user) => (user.$id === updated.$id ? updated : user))
      );
      setEditingUser(null);
      setNotice("User profile updated.");
    } catch (saveError) {
      setError(explainAppwriteError(saveError, "Unable to update user profile."));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-green-700">Administration</p>
          <h1 className="text-3xl font-bold text-slate-900">Admin Control Center</h1>
          <p className="text-sm text-slate-500">
            Signed in as {currentUser?.name || currentUser?.email}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm hover:bg-slate-50"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-7xl">
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={18} /> {error}
          </div>
        )}
        {notice && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            <CheckCircle2 size={18} /> {notice}
          </div>
        )}

        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ["Total requests", stats.total, <ClipboardList size={21} />, "text-blue-600"],
            ["Pending", stats.pending, <AlertCircle size={21} />, "text-amber-600"],
            ["Approved", stats.approved, <CheckCircle2 size={21} />, "text-green-600"],
            ["Rejected", stats.rejected, <XCircle size={21} />, "text-red-600"],
          ].map(([label, value, icon, color]) => (
            <div key={label} className="rounded-xl bg-white p-4 shadow-sm">
              <span className={color}>{icon}</span>
              <p className="mt-2 text-2xl font-bold">{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="mb-5 flex gap-2 border-b border-slate-200">
          {[
            ["overview", "Leave requests"],
            ["users", "Manage users"],
            ["departments", "Departments"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`border-b-2 px-4 py-3 text-sm font-medium ${
                activeTab === id
                  ? "border-green-600 text-green-700"
                  : "border-transparent text-slate-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-xl bg-white p-12 text-slate-500">
            <Loader2 className="mr-2 animate-spin" size={20} /> Loading admin data...
          </div>
        ) : activeTab === "overview" ? (
          <section className="rounded-xl bg-white p-4 shadow-sm md:p-6">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-semibold">Leave requests</h2>
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                  <Search size={16} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search user, type, reason..."
                    className="w-full outline-none sm:w-56"
                  />
                </label>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-lg border px-3 py-2 text-sm"
                >
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            {filteredLeaves.length === 0 ? (
              <p className="rounded-lg bg-slate-50 p-8 text-center text-slate-500">
                No matching leave requests.
              </p>
            ) : activeTab === "departments" ? (
              <section className="rounded-xl bg-white p-4 shadow-sm md:p-6">
                <h2 className="text-xl font-semibold">Departments</h2>
                <p className="mt-1 text-sm text-slate-500">A department is kept until all assigned users are moved out.</p>
                <form onSubmit={createDepartment} className="mt-5 flex gap-2">
                  <input value={departmentName} onChange={(event) => setDepartmentName(event.target.value)} placeholder="Department name" className="flex-1 rounded-lg border p-2.5" required />
                  <button className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white">Create</button>
                </form>
                <div className="mt-5 space-y-2">
                  {departments.map((department) => (
                    <div key={department.$id} className="flex items-center justify-between rounded-lg border p-3">
                      <div><p className="font-medium">{department.name}</p><p className="text-xs text-slate-500">HOD: {department.hod_id || "Not assigned"}</p></div>
                      <button onClick={() => deleteDepartment(department)} className="rounded bg-red-600 px-3 py-1.5 text-xs text-white">Delete</button>
                    </div>
                  ))}
                  {departments.length === 0 && <p className="text-sm text-slate-500">No departments found.</p>}
                </div>
              </section>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="border-b text-slate-500">
                    <tr>
                      <th className="p-3">Applicant</th>
                      <th className="p-3">Dates</th>
                      <th className="p-3">Type / reason</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaves.map((leave) => (
                      <tr key={leave.$id} className="border-b last:border-0">
                        <td className="p-3">
                          <p className="font-medium">{leave.user_id || "-"}</p>
                          <p className="text-xs text-slate-500">{leave.department_id || "-"}</p>
                        </td>
                        <td className="p-3">
                          {formatDate(leave.from_date)} - {formatDate(leave.to_date)}
                        </td>
                        <td className="max-w-xs p-3">
                          <p className="font-medium capitalize">{leave.leave_type || "-"}</p>
                          <p className="truncate text-slate-500">{leave.reason || "-"}</p>
                        </td>
                        <td className="p-3">
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs capitalize">
                            {leave.status || "unknown"}
                          </span>
                        </td>
                        <td className="p-3">
                          {leave.status === "pending" ? (
                            <div className="flex gap-2">
                              <button
                                disabled={actionId === leave.$id}
                                onClick={() => updateLeaveStatus(leave, "approved")}
                                className="rounded bg-green-600 px-3 py-1.5 text-xs text-white disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                disabled={actionId === leave.$id}
                                onClick={() => updateLeaveStatus(leave, "rejected")}
                                className="rounded bg-red-600 px-3 py-1.5 text-xs text-white disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : (
          <section className="rounded-xl bg-white p-4 shadow-sm md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Users className="text-green-600" size={21} />
              <h2 className="text-xl font-semibold">Manage users</h2>
            </div>
            <p className="mb-4 text-sm text-slate-500">
              Update role, department, and reporting manager. Auth accounts must be created through Appwrite.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b text-slate-500">
                  <tr>
                    <th className="p-3">Name / email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Manager</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.$id} className="border-b last:border-0">
                      <td className="p-3">
                        <p className="font-medium">{user.name || "-"}</p>
                        <p className="text-xs text-slate-500">{user.email || user.$id}</p>
                      </td>
                      <td className="p-3 capitalize">{user.role || "-"}</td>
                      <td className="p-3">{user.department_id || "-"}</td>
                      <td className="p-3">{user.manager_id || "-"}</td>
                      <td className="p-3">
                        <button
                          onClick={() => startEditing(user)}
                          className="rounded bg-slate-900 px-3 py-1.5 text-xs text-white hover:bg-slate-700"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={saveUser} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold">Edit user</h2>
            <div className="space-y-3">
              <input
                value={editForm.name}
                onChange={(event) => setEditForm({ ...editForm, name: event.target.value })}
                placeholder="Full name"
                className="w-full rounded-lg border p-2.5"
              />
              <select
                value={editForm.role}
                disabled={editingUser.$id === currentUser?.id}
                onChange={(event) => setEditForm({ ...editForm, role: event.target.value })}
                className="w-full rounded-lg border p-2.5 disabled:bg-slate-100"
              >
                <option value="employee">Employee</option>
                <option value="hod">HOD</option>
                <option value="vc">VC</option>
                <option value="admin">Admin</option>
              </select>
              <input
                value={editForm.department_id}
                onChange={(event) =>
                  setEditForm({ ...editForm, department_id: event.target.value })
                }
                placeholder="Department ID"
                className="w-full rounded-lg border p-2.5"
              />
              <select
                value={editForm.manager_id}
                onChange={(event) =>
                  setEditForm({ ...editForm, manager_id: event.target.value })
                }
                className="w-full rounded-lg border p-2.5"
              >
                <option value="">No manager</option>
                {users
                  .filter((user) => user.$id !== editingUser.$id)
                  .map((user) => (
                    <option key={user.$id} value={user.$id}>
                      {user.name || user.email || user.$id} ({user.role || "user"})
                    </option>
                  ))}
              </select>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                {saving && <Loader2 className="animate-spin" size={16} />}
                Save changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
