"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

type EventType = "Deadline" | "Apply" | "Interview" | "Follow-up";
type PanelKey = "Deadlines" | "Applications" | "Interviews" | "Follow-Ups Due";

type EventItem = {
  id: number;
  title: string;
  company: string;
  role: string;
  date: Date;
  type: EventType;
};

export default function HomePage() {
  const pathname = usePathname();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedPanel, setSelectedPanel] = useState<PanelKey | null>(null);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const monthName = today.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const nav = [
    { label: "Dashboard", href: "/" },
    { label: "Discover Jobs", href: "/discover" },
    { label: "Applications", href: "/applications" },
    { label: "Calendar", href: "/calendar" },
    { label: "AI Coach", href: "/coach" },
    { label: "Profile", href: "/profile" },
  ] as const;

  const events: EventItem[] = [
    {
      id: 1,
      title: "Follow up with Stripe recruiter",
      company: "Stripe",
      role: "Data Analyst Intern",
      date: new Date(currentYear, currentMonth, today.getDate(), 10, 0),
      type: "Follow-up",
    },
    {
      id: 2,
      title: "Google interview",
      company: "Google",
      role: "Business Analyst Intern",
      date: new Date(currentYear, currentMonth, today.getDate() + 1, 14, 0),
      type: "Interview",
    },
    {
      id: 3,
      title: "Uber application deadline",
      company: "Uber",
      role: "Strategy & Operations Intern",
      date: new Date(currentYear, currentMonth, today.getDate() + 2, 23, 59),
      type: "Deadline",
    },
    {
      id: 4,
      title: "Apply to Ramp Growth Analyst",
      company: "Ramp",
      role: "Growth Analyst",
      date: new Date(currentYear, currentMonth, today.getDate() + 3, 18, 0),
      type: "Apply",
    },
    {
      id: 5,
      title: "Follow up with Meta recruiter",
      company: "Meta",
      role: "Data Science Intern",
      date: new Date(currentYear, currentMonth, today.getDate() + 4, 11, 0),
      type: "Follow-up",
    },
    {
      id: 6,
      title: "Amazon business analyst interview",
      company: "Amazon",
      role: "Business Analyst",
      date: new Date(currentYear, currentMonth, today.getDate() + 6, 13, 30),
      type: "Interview",
    },
    {
      id: 7,
      title: "Notion product analyst deadline",
      company: "Notion",
      role: "Product Analyst",
      date: new Date(currentYear, currentMonth, today.getDate() + 7, 23, 59),
      type: "Deadline",
    },
    {
      id: 8,
      title: "Palantir application deadline",
      company: "Palantir",
      role: "Forward Deployed Intern",
      date: new Date(currentYear, currentMonth, today.getDate() + 2, 17, 0),
      type: "Deadline",
    },
    {
      id: 9,
      title: "Follow up with Tesla recruiter",
      company: "Tesla",
      role: "Data Analyst Intern",
      date: new Date(currentYear, currentMonth, today.getDate() + 2, 12, 30),
      type: "Follow-up",
    },
    {
      id: 10,
      title: "Apply to Figma strategy intern",
      company: "Figma",
      role: "Strategy Intern",
      date: new Date(currentYear, currentMonth, today.getDate() + 2, 19, 0),
      type: "Apply",
    },
  ];

  const panelTypeMap: Record<PanelKey, EventType> = {
    Deadlines: "Deadline",
    Applications: "Apply",
    Interviews: "Interview",
    "Follow-Ups Due": "Follow-up",
  };

  const stats = [
    {
      label: "Deadlines" as PanelKey,
      value: String(events.filter((e) => e.type === "Deadline").length),
      card: "bg-rose-50 border-rose-200 hover:bg-rose-100",
      text: "text-rose-700",
      subtext: "text-rose-500",
    },
    {
      label: "Applications" as PanelKey,
      value: String(events.filter((e) => e.type === "Apply").length),
      card: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
      text: "text-emerald-700",
      subtext: "text-emerald-500",
    },
    {
      label: "Interviews" as PanelKey,
      value: String(events.filter((e) => e.type === "Interview").length),
      card: "bg-violet-50 border-violet-200 hover:bg-violet-100",
      text: "text-violet-700",
      subtext: "text-violet-500",
    },
    {
      label: "Follow-Ups Due" as PanelKey,
      value: String(events.filter((e) => e.type === "Follow-up").length),
      card: "bg-amber-50 border-amber-200 hover:bg-amber-100",
      text: "text-amber-700",
      subtext: "text-amber-500",
    },
  ];

  const recommendedJobs = [
    {
      title: "Data Analyst Intern",
      company: "Stripe",
      meta: "Remote • $35/hr • Posted 2d ago",
      match: "92%",
      reason: "Matches your Python, stats, and analytics background.",
      tag: "Best Fit",
    },
    {
      title: "Business Analyst Intern",
      company: "Google",
      meta: "Mountain View • Hybrid • Posted 1d ago",
      match: "88%",
      reason: "Strong overlap with data storytelling and modeling skills.",
      tag: "High Upside",
    },
    {
      title: "Product Analyst",
      company: "Notion",
      meta: "San Francisco • Hybrid • Posted 3d ago",
      match: "84%",
      reason: "Fits your startup, user behavior, and experimentation interests.",
      tag: "Stretch",
    },
  ];

  const actions = [
    "Follow up with Google today",
    "Apply to 3 new roles this week",
    "Prep for your interview tomorrow at 2:00 PM",
    "Tailor your resume for analyst roles",
  ];

  const pipeline = {
    Saved: [
      { id: 4, label: "Ramp — Growth Analyst" },
      { id: 8, label: "Figma — Strategy Intern" },
    ],
    Applied: [
      { id: 1, label: "Stripe — Data Analyst Intern" },
      { id: 5, label: "Meta — Data Science Intern" },
    ],
    Interview: [
      { id: 2, label: "Google — Business Analyst Intern" },
      { id: 6, label: "Amazon — Business Analyst" },
    ],
    Offer: [{ id: 8, label: "Figma — Strategy Intern" }],
  };

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startWeekday = firstDayOfMonth.getDay();

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) calendarCells.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarCells.push(day);
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getEventColor = (type: EventType) => {
    switch (type) {
      case "Interview":
        return "bg-violet-100 text-violet-700";
      case "Follow-up":
        return "bg-amber-100 text-amber-700";
      case "Deadline":
        return "bg-rose-100 text-rose-700";
      case "Apply":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const formatEventTime = (date: Date) =>
    date.toLocaleString("en-US", {
      weekday: "long",
      hour: "numeric",
      minute: "2-digit",
    });

  const formatOnlyTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

  const calendarEventsByDay = useMemo(() => {
    return events.reduce((acc, event) => {
      const day = event.date.getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(event);
      return acc;
    }, {} as Record<number, EventItem[]>);
  }, [events]);

  const upcoming = [...events]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  const nextFourDays = Array.from({ length: 4 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dayEvents = events
      .filter((event) => event.date.toDateString() === date.toDateString())
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return {
      date,
      events: dayEvents,
    };
  });

  const selectedDayEvents =
    selectedDay !== null ? calendarEventsByDay[selectedDay] || [] : [];

  const selectedPanelEvents = selectedPanel
    ? events
        .filter((event) => event.type === panelTypeMap[selectedPanel])
        .sort((a, b) => a.date.getTime() - b.date.getTime())
    : [];

  const closeModals = () => {
    setSelectedDay(null);
    setSelectedPanel(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="text-2xl font-semibold tracking-tight">Jobly</div>
            <div className="mt-1 text-sm text-slate-500">
              Your AI job search operating system
            </div>
          </div>

          <nav className="px-4 py-6">
            <div className="space-y-1">
              {nav.map((item) =>
                item.href ? (
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
                ) : (
                  <div
                    key={item.label}
                    className="flex w-full cursor-not-allowed items-center rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-400"
                  >
                    <span className="mr-3 inline-block h-2.5 w-2.5 rounded-full bg-current opacity-40" />
                    {item.label}
                  </div>
                )
              )}
            </div>
          </nav>

          <div className="border-t border-slate-200 px-4 py-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">
                Upcoming Schedule
              </div>
              <span className="text-xs font-medium text-indigo-600">4 days</span>
            </div>

            <div className="space-y-4">
              {nextFourDays.map((day) => (
                <div key={day.date.toDateString()}>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {day.date.toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </div>

                  {day.events.length > 0 ? (
                    <div className="space-y-2">
                      {day.events.map((item) => (
                        <Link
                          key={item.id}
                          href={`/applications/${item.id}`}
                          className="block rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:bg-white hover:shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="truncate text-xs font-semibold text-slate-900">
                              {item.company}
                            </div>
                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${getEventColor(
                                item.type
                              )}`}
                            >
                              {item.type}
                            </span>
                          </div>

                          <div className="mt-1 truncate text-xs text-slate-500">
                            {item.role}
                          </div>

                          <div className="mt-2 text-[11px] font-medium text-slate-500">
                            {formatOnlyTime(item.date)}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs text-slate-400">
                      No events
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto border-t border-slate-200 p-4">
            <div className="rounded-3xl bg-slate-900 p-4 text-white shadow-sm">
              <div className="text-sm font-semibold">Upgrade to Pro</div>
              <p className="mt-1 text-sm text-slate-300">
                Get AI recommendations, deeper analytics, and automated
                follow-ups.
              </p>
              <button className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                View Plans
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8">
              <div className="w-full max-w-xl">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">
                  Search jobs, companies, or notes...
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                  Notifications
                </button>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                    HT
                  </div>
                  <div className="hidden text-left sm:block">
                    <div className="text-sm font-semibold">Hanu</div>
                    <div className="text-xs text-slate-500">Student plan</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="px-5 py-6 md:px-8 md:py-8">
            <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.18em] text-indigo-600">
                  Dashboard
                </div>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                  Good morning, Hanu
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
                Welcome back — glad to see you. Here’s what we’re focusing on today.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
                Great news! Based on your background in statistics and Python, we found 12 high-fit roles to prioritize.</div>
              </div>

              <div className="flex gap-3">
                <Link
                  href="/discover"
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
                >
                  Discover Jobs
                </Link>
                <Link
                  href="/applications"
                  className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200"
                >
                  Open Applications
                </Link>
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <button
                  key={stat.label}
                  onClick={() => setSelectedPanel(stat.label)}
                  className={`rounded-3xl border p-5 text-left shadow-sm transition ${stat.card}`}
                >
                  <div className={`text-sm font-medium ${stat.subtext}`}>
                    {stat.label}
                  </div>
                  <div
                    className={`mt-3 text-3xl font-semibold tracking-tight ${stat.text}`}
                  >
                    {stat.value}
                  </div>
                </button>
              ))}
            </section>

            <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    Calendar
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    See everything due this month at a glance
                  </p>
                </div>
                <div className="text-sm font-semibold text-indigo-600">
                  {monthName}
                </div>
              </div>

              <div className="grid grid-cols-7 gap-3 text-center text-sm font-semibold text-slate-500">
                {weekDays.map((day) => (
                  <div key={day} className="py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="mt-2 grid grid-cols-7 gap-3">
                {calendarCells.map((day, idx) => {
                  const isToday = day === today.getDate();
                  const dayEvents = day ? calendarEventsByDay[day] || [] : [];

                  return (
                    <div
                      key={idx}
                      className={`min-h-[120px] rounded-2xl border p-3 text-left ${
                        day
                          ? "border-slate-200 bg-slate-50"
                          : "border-transparent bg-transparent"
                      }`}
                    >
                      {day && (
                        <>
                          <div
                            className={`mb-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                              isToday
                                ? "bg-indigo-600 text-white"
                                : "text-slate-700"
                            }`}
                          >
                            {day}
                          </div>

                          {dayEvents.length > 0 && (
                            <button
                              onClick={() => setSelectedDay(day)}
                              className="rounded-xl bg-indigo-50 px-3 py-2 text-left text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                            >
                              {dayEvents.length}{" "}
                              {dayEvents.length === 1 ? "event" : "events"}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                      Recommended Jobs
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Personalized opportunities ranked for you
                    </p>
                  </div>
                  <Link
                    href="/discover"
                    className="text-sm font-semibold text-indigo-600"
                  >
                    View all
                  </Link>
                </div>

                <div className="mt-5 space-y-4">
                  {recommendedJobs.map((job) => (
                    <div
                      key={job.title}
                      className="rounded-3xl border border-slate-200 p-5 transition hover:border-slate-300 hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold">{job.title}</h3>
                            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                              {job.tag}
                            </span>
                          </div>
                          <div className="mt-1 text-sm font-medium text-slate-700">
                            {job.company}
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            {job.meta}
                          </div>
                          <p className="mt-3 text-sm text-slate-600">
                            {job.reason}
                          </p>
                        </div>

                        <div className="flex min-w-[120px] flex-col items-start gap-3 md:items-end">
                          <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                            Match {job.match}
                          </div>
                          <div className="flex gap-2">
                            <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
                              Save
                            </button>
                            <button className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white">
                              Track
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold tracking-tight">
                    AI Next Actions
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Your smartest moves right now
                  </p>

                  <div className="mt-5 space-y-3">
                    {actions.map((action, idx) => (
                      <div
                        key={action}
                        className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"
                      >
                        <div
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                            idx === 0
                              ? "bg-rose-100 text-rose-600"
                              : idx === 1
                              ? "bg-amber-100 text-amber-600"
                              : idx === 2
                              ? "bg-violet-100 text-violet-600"
                              : "bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          {idx + 1}
                        </div>

                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {action}
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            Recommended based on your timeline and application
                            activity.
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">
                      Upcoming
                    </h2>
                    <button className="text-sm font-semibold text-indigo-600">
                      Calendar
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    {upcoming.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold">
                              {item.title}
                            </div>
                            <div className="mt-1 text-sm text-slate-500">
                              {formatEventTime(item.date)}
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getEventColor(
                              item.type
                            )}`}
                          >
                            {item.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_1fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                      Application Pipeline
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      A quick view of where everything stands
                    </p>
                  </div>
                  <Link
                    href="/applications"
                    className="text-sm font-semibold text-indigo-600"
                  >
                    Open board
                  </Link>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {Object.entries(pipeline).map(([column, items]) => (
                    <div key={column} className="rounded-2xl bg-slate-50 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="text-sm font-semibold text-slate-900">
                          {column}
                        </div>
                        <div className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500">
                          {items.length}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {items.map((item) => (
                          <Link
                            key={item.id}
                            href={`/applications/${item.id}`}
                            className="block rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                      Weekly Momentum
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      A simple analytics snapshot
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  {[
                    { label: "Applications sent", value: "8", width: "72%" },
                    { label: "Response rate", value: "31%", width: "31%" },
                    { label: "Interview rate", value: "12%", width: "12%" },
                    { label: "Follow-ups completed", value: "4", width: "48%" },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">
                          {metric.label}
                        </span>
                        <span className="text-slate-500">{metric.value}</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-100">
                        <div
                          className="h-3 rounded-full bg-indigo-600"
                          style={{ width: metric.width }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {(selectedDay !== null || selectedPanel !== null) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                {selectedDay !== null ? (
                  <>
                    <h3 className="text-xl font-semibold tracking-tight">
                      Events due on {monthName.split(" ")[0]} {selectedDay}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedDayEvents.length}{" "}
                      {selectedDayEvents.length === 1 ? "item" : "items"} scheduled
                    </p>
                  </>
                ) : selectedPanel !== null ? (
                  <>
                    <h3 className="text-xl font-semibold tracking-tight">
                      {selectedPanel}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedPanelEvents.length}{" "}
                      {selectedPanelEvents.length === 1 ? "item" : "items"} in this
                      category
                    </p>
                  </>
                ) : null}
              </div>

              <button
                onClick={closeModals}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
              <div className="space-y-4">
                {(selectedDay !== null ? selectedDayEvents : selectedPanelEvents)
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((event) => (
                    <div
                      key={event.id}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="text-base font-semibold text-slate-900">
                              {event.title}
                            </div>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${getEventColor(
                                event.type
                              )}`}
                            >
                              {event.type}
                            </span>
                          </div>

                          <div className="mt-2 text-sm font-medium text-slate-700">
                            {event.company} • {event.role}
                          </div>

                          <div className="mt-1 text-sm text-slate-500">
                            {event.date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            • {formatOnlyTime(event.date)}
                          </div>
                        </div>

                        <Link
                          href={`/applications/${event.id}`}
                          className="inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200"
                        >
                          Open Application
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}