"use client";

import { useState } from "react";
import DashboardSidebar from "./dashboard/components/dashboardSideBar";
import DashboardNavbar from "./dashboard/components/dashboardNavbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <div className="flex">
      <DashboardSidebar
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
      />
      <div className="flex-1 bg-[#f5f5f5] min-w-0">
        <DashboardNavbar onMenuClick={handleDrawerToggle} />
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
