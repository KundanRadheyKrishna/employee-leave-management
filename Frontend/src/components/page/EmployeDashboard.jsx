import React, { useState } from "react";
import DashboardLayout from "../common/DashboardLayout";
import ApplyLeave from "../common/ApplyLeave";
import LeaveHistory from "../common/LeaveHistory";

const EmployeeDashboard = () => {
  const [tab, setTab] = useState("apply");
  const tabs = [{ id: "apply", label: "Apply leave" }, { id: "history", label: "My history" }];
  return <DashboardLayout title="Employee dashboard" tabs={tabs} activeTab={tab} onTabChange={setTab}>{tab === "apply" ? <ApplyLeave /> : <LeaveHistory />}</DashboardLayout>;
};

export default EmployeeDashboard;
