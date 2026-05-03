"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { label: "Dashboard", href: "/" },
  { label: "Discover", href: "/discover" },
  { label: "Applications", href: "/applications" },
  { label: "Calendar", href: "/calendar" },
  { label: "AI Coach", href: "/coach" },
  { label: "Profile", href: "/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="text-2xl font-semibold tracking-tight">Jobly</div>
        <div className="mt-1 text-sm text-slate-500">
          Your AI job search operating system
        </div>
      </div>

      <nav className="px-4 py-6">
        <div className="space-y-1">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                pathname === item.href
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className="mr-3 inline-block h-2.5 w-2.5 rounded-full bg-current opacity-60" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="mt-auto border-t border-slate-200 p-4">
        <div className="rounded-3xl bg-slate-900 p-4 text-white shadow-sm">
          <div className="text-sm font-semibold">Upgrade to Pro</div>
          <p className="mt-1 text-sm text-slate-300">
            AI recommendations, analytics, and automated follow-ups.
          </p>
        </div>
      </div>
    </aside>
  );
}