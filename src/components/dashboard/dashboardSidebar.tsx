"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

interface DashboardSidebarProps {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
}

const DashboardSidebar = ({
  mobileOpen,
  onDrawerToggle,
}: DashboardSidebarProps) => {
  const pathname = usePathname();

  const navItems = [
    { label: "ড্যাশবোর্ড", path: "/dashboard" },
    { label: "প্রোডাক্টস", path: "/dashboard/products" },
    { label: "অর্ডারস", path: "/dashboard/orders" },
    { label: "কাস্টম অর্ডার", path: "/dashboard/custom-order" },
    { label: "হিস্টোরি", path: "/dashboard/orderHistory" },
  ];

  const sidebarContent = (
    <div className="w-[260px] h-full bg-[#EEEEEE] p-6">
      {/* Logo */}
      <h1 className="text-3xl font-bold mb-10 text-primary">FLAME</h1>

      {/* Nav Items */}
      <nav>
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={() => {
                    // মোবাইলে মেনু আইটেম ক্লিক করলে ড্রয়ার বন্ধ হয়ে যাবে
                    if (mobileOpen) onDrawerToggle();
                  }}
                  className={`block rounded-lg px-4 py-2.5 no-underline transition-colors ${
                    isActive
                      ? "bg-primary text-white font-semibold"
                      : "text-gray-800 font-normal hover:bg-[#FFF5F4]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop - সবসময় দৃশ্যমান, permanent sidebar */}
      <nav className="hidden md:block w-[260px] shrink-0">
        <div className="w-[260px] sticky top-0 h-screen">{sidebarContent}</div>
      </nav>

      {/* Mobile - toggle করা যায় এমন temporary drawer */}
      {mobileOpen && (
        <Fragment>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onDrawerToggle}
          />
          {/* Drawer panel */}
          <div className="fixed inset-y-0 left-0 z-50 w-[260px] md:hidden shadow-xl">
            {sidebarContent}
          </div>
        </Fragment>
      )}
    </>
  );
};

export default DashboardSidebar;
