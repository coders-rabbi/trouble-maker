"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    { label: "কাস্টম অর্ডার", path: "/dashboard/custom-orders" },
    { label: "হিস্টোরি", path: "/dashboard/history" },
  ];

  const sidebarContent = (
    <div className="w-[260px] h-full bg-[#EEEEEE] p-6">
      {/* Logo */}
      <h4 className="text-3xl font-bold mb-5 text-primary">
        Trouble Maker Bangladesh
      </h4>

      {/* Nav Items */}
      <ul className="list-none p-0 m-0">
        {navItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <li key={item.path}>
              <Link
                href={item.path}
                className="no-underline"
                onClick={() => {
                  // মোবাইলে মেনু আইটেম ক্লিক করলে ড্রয়ার বন্ধ হয়ে যাবে
                  if (mobileOpen) onDrawerToggle();
                }}
              >
                <div
                  className={`rounded-lg mb-2 px-4 py-2.5 transition-colors ${
                    isActive
                      ? "bg-primary hover:bg-primary"
                      : "bg-transparent hover:bg-[#FFF5F4]"
                  }`}
                >
                  <span
                    className={`font-inherit ${
                      isActive
                        ? "text-white font-semibold"
                        : "text-gray-900 font-normal"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
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
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onDrawerToggle}
        />
      )}
      <div
        className={`fixed top-0 left-0 z-50 h-screen w-[260px] transform transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default DashboardSidebar;
