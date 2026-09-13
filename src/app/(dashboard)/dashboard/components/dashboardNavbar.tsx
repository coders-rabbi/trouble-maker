// src/components/dashboard/DashboardNavbar.tsx
"use client";

import { IoMdMenu } from "react-icons/io";

interface DashboardNavbarProps {
  onMenuClick: () => void;
}

const DashboardNavbar = ({ onMenuClick }: DashboardNavbarProps) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#e0e0e0] shadow-none">
      <div className="flex items-center justify-between px-4 py-2 min-h-[64px]">
        <div className="flex items-center gap-2">
          {/* Mobile menu button - only visible on small screens */}
          <button
            onClick={onMenuClick}
            className="inline-flex md:hidden items-center justify-center p-2 rounded-full text-black hover:bg-black/5 transition-colors"
          >
            <IoMdMenu size={24} />
          </button>

          <h6 className="text-black font-semibold font-inherit text-base sm:text-xl">
            ড্যাশবোর্ড
          </h6>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-black font-inherit">
            অরণ্য শিকদার
          </span>

          <div className="w-10 h-10 rounded-full bg-gray-300" />
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
