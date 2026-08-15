"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import {
  FiArrowRight,
  FiChevronDown,
  FiChevronRight,
  FiX,
  FiMenu,
} from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { RiShoppingBag4Fill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";

type NavItem = {
  label: string;
  href?: string;
  dropdown?: NavItem[];
  forceReload?: boolean;
};

function isExternalLink(href?: string) {
  return !!href && /^https?:\/\//.test(href);
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "T-SHIRT",
    dropdown: [
      { label: "All T-Shirts", href: "/all-tshirt" },
      { label: "Oversized", href: "/oversized" },
      { label: "Drop Shoulder", href: "/dropshulder" },
      { label: "Racing Collection", href: "/racing" },
      { label: "Graphic Tees", href: "/graphic-tees" },
    ],
  },
  { label: "Contact", href: "/contact" },
  {
    label: "Shop",
    dropdown: [
      { label: "ALL PRODUCTS", href: "/all-products" },
      { label: "T-SHIRT", href: "/t-shirt" },
      { label: "JERSEYS", href: "/jerseys" },
      { label: "ACCESSORIES", href: "/accesseries" },
      { label: "SALE", href: "/sale" },
    ],
  },
  {
    label: "WINTER PRODUCT",href: "winrer"
  }
];

/* ---------------- Desktop recursive menu item ---------------- */
function DesktopMenuItem({ item, level }: { item: NavItem; level: number }) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!item.dropdown?.length;
  const external = isExternalLink(item.href);

  const topLevelClasses = `flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
    item.label === "Home" ? "text-black" : "text-black hover:text-[#4A1942]"
  }`;
  const nestedClasses =
    "flex w-full items-center justify-between gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#4A1942]";

  const labelClasses = level === 0 ? topLevelClasses : nestedClasses;
  const Icon = level === 0 ? FiChevronDown : FiChevronRight;

  const labelContent = (
    <>
      {item.label}
      {hasChildren && (
        <Icon
          size={14}
          className={
            level === 0
              ? `transition-transform duration-200 ${open ? "rotate-180" : ""}`
              : "shrink-0"
          }
        />
      )}
    </>
  );

  return (
    <li
      className="relative"
      onMouseEnter={() => hasChildren && setOpen(true)}
      onMouseLeave={() => hasChildren && setOpen(false)}
    >
      {item.href ? (
        item.forceReload ? (
          <a href={item.href} className={labelClasses}>
            {labelContent}
          </a>
        ) : (
          <Link
            href={item.href}
            className={labelClasses}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {labelContent}
          </Link>
        )
      ) : (
        <span
          className={`${labelClasses} ${level === 0 ? "" : "cursor-default select-none"}`}
        >
          {labelContent}
        </span>
      )}

      {hasChildren && (
        <ul
          className={`absolute min-w-[220px] rounded-lg bg-white py-2 shadow-xl ring-1 ring-black/5 transition-all duration-200 ${
            level === 0 ? "left-0 top-full" : "left-full top-0"
          } ${
            open
              ? "visible translate-x-0 translate-y-0 opacity-100"
              : level === 0
                ? "invisible -translate-y-2 opacity-0"
                : "invisible -translate-x-2 opacity-0"
          }`}
        >
          {item.dropdown!.map((child, i) => (
            <DesktopMenuItem
              key={`${child.label}-${i}`}
              item={child}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/* ---------------- Mobile recursive menu item ---------------- */
function MobileMenuItem({
  item,
  level,
  onNavigate,
}: {
  item: NavItem;
  level: number;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!item.dropdown?.length;
  const external = isExternalLink(item.href);

  const labelClasses =
    level === 0
      ? `flex-1 py-2.5 text-sm font-medium ${
          item.label === "Home" ? "text-[#FFBC01]" : "text-gray-700"
        }`
      : "flex-1 select-none py-2 pl-3 text-sm text-gray-500";

  return (
    <div className={level > 0 ? "border-l-2 border-gray-100" : ""}>
      <div className="flex items-center justify-between">
        {item.href ? (
          item.forceReload ? (
            <a href={item.href} onClick={onNavigate} className={labelClasses}>
              {item.label}
            </a>
          ) : (
            <Link
              href={item.href}
              onClick={onNavigate}
              className={labelClasses}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
            >
              {item.label}
            </Link>
          )
        ) : (
          <span className={labelClasses}>{item.label}</span>
        )}
        {hasChildren && (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="p-2 text-gray-400"
            aria-label={`Toggle ${item.label} submenu`}
          >
            <FiChevronDown
              size={14}
              className={`transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      {hasChildren && (
        <div
          className={`overflow-hidden pl-4 transition-[max-height] duration-200 ${
            open ? "max-h-[2000px]" : "max-h-0"
          }`}
        >
          {item.dropdown!.map((child, i) => (
            <MobileMenuItem
              key={`${child.label}-${i}`}
              item={child}
              level={level + 1}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`inset-x-4 z-50 bg-white shadow-lg transition-all duration-300 sm:inset-x-7 ${
        scrolled ? "top-0" : "top-5 sm:top-7"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-4">
        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex z-50">
          {navItems.map((item, i) => (
            <DesktopMenuItem key={`${item.label}-${i}`} item={item} level={0} />
          ))}
        </ul>

        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src={logo}
            alt="Barishal Home Economics College"
            width={100}
            height={100}
            className="h-20 w-20 lg:h-11 lg:w-11"
          />
        </Link>

        {/* shopping card/search/userIcon- desktop */}
        <div className="flex gap-2 items-center">
          <IoSearch />
          <RiShoppingBag4Fill />
          <FaUser />
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#4A1942] lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>

      {/* Mobile nav panel */}
      <div
        className={`overflow-hidden bg-white transition-[max-height] duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "max-h-[80vh] overflow-y-auto" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-1 border-t border-black px-4 py-3">
          {navItems.map((item, i) => (
            <li key={`${item.label}-${i}`}>
              <MobileMenuItem
                item={item}
                level={0}
                onNavigate={() => setMobileOpen(false)}
              />
            </li>
          ))}

          <li className="mt-2">
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 rounded-full bg-[#4A1942] py-2.5 text-sm font-semibold text-white"
            >
              CONTACT US
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFBC01] text-[#4A1942]">
                <FiArrowRight size={12} />
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
