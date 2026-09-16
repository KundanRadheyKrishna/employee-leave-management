import React, { useState } from "react";
import DashboardLayout from "../common/DashboardLayout";
import ApprovalQueue from "../common/ApprovalQueue";
import ApplyLeave from "../common/ApplyLeave";
import LeaveHistory from "../common/LeaveHistory";

const HodDashboard = () => {
  const [tab, setTab] = useState("requests");
  const tabs = [{ id: "requests", label: "Department requests" }, { id: "apply", label: "Apply leave" }, { id: "history", label: "My history" }];
  return <DashboardLayout title="HOD dashboard" tabs={tabs} activeTab={tab} onTabChange={setTab}>{tab === "requests" ? <ApprovalQueue level="hod" /> : tab === "apply" ? <ApplyLeave /> : <LeaveHistory />}</DashboardLayout>;
};

export default HodDashboard;
