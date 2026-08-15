// src/components/dashboard/DashboardNavbar.tsx
"use client";

import { FaBars } from "react-icons/fa";


interface DashboardNavbarProps {
  onMenuClick: () => void;
}

const DashboardNavbar = ({ onMenuClick }: DashboardNavbarProps) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#e0e0e0]">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        <div className="flex items-center gap-1">
          {/* Mobile menu button - only visible on small screens */}
          <button
            onClick={onMenuClick}
            className="inline-flex md:hidden items-center justify-center w-10 h-10 rounded-full text-black hover:bg-black/5 transition-colors"
            aria-label="Open menu"
          >
            <FaBars size={22} />
          </button>

          <h1 className="text-black font-semibold font-inherit text-base sm:text-xl">
            ড্যাশবোর্ড
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-black font-inherit">
            রাব্বি মিয়া
          </span>

          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700 overflow-hidden">
            {/* Replace with <img> or <Image> if you have an avatar URL */}
            RM
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
