"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";

type ApplicationStatus =
  | "saved"
  | "applying"
  | "applied"
  | "interview"
  | "offer"
  | "rejected";

type ApplicationItem = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  status: ApplicationStatus;
  deadline: string | null;
  created_at: string;
  notes?: string | null;
};

type EventType = "Deadline" | "Application" | "Interview" | "Follow-up";
type PanelType = "Deadlines" | "Applications" | "Interviews" | "Follow-Ups Due";

type CalendarEvent = {
  id: string;
  title: string;
  company: string;
  role: string;
  date: Date;
  type: EventType;
};

export default function HomePage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedPanel, setSelectedPanel] = useState<PanelType | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const fetchApplications = async () => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setUserEmail(null);
      setApplications([]);
      setLoading(false);
      return;
    }

    setUserEmail(user.email || null);

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setApplications([]);
    } else {
      setApplications((data || []) as ApplicationItem[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const events: CalendarEvent[] = useMemo(() => {
    return applications
      .filter((app) => app.deadline)
      .map((app) => {
        let type: EventType = "Deadline";

        if (app.status === "interview") type = "Interview";
        else if (app.status === "applied") type = "Follow-up";
        else if (app.status === "saved" || app.status === "applying") {
          type = "Application";
        }

        return {
          id: app.id,
          title:
            type === "Interview"
              ? `${app.company} interview`
              : type === "Follow-up"
              ? `Follow up with ${app.company}`
              : type === "Application"
              ? `Apply to ${app.company}`
              : `${app.company} deadline`,
          company: app.company,
          role: app.role,
          date: new Date(app.deadline as string),
          type,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [applications]);

  const monthName = today.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

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
      case "Application":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case "interview":
        return "bg-violet-100 text-violet-700";
      case "applied":
        return "bg-blue-100 text-blue-700";
      case "offer":
        return "bg-amber-100 text-amber-700";
      case "rejected":
        return "bg-rose-100 text-rose-700";
      case "applying":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const formatStatus = (status: ApplicationStatus) =>
    status.charAt(0).toUpperCase() + status.slice(1);

  const formatOnlyTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

  const formatEventTime = (date: Date) =>
    date.toLocaleString("en-US", {
      weekday: "long",
      hour: "numeric",
      minute: "2-digit",
    });

  const calendarEventsByDay = useMemo(() => {
    return events.reduce((acc, event) => {
      const day = event.date.getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(event);
      return acc;
    }, {} as Record<number, CalendarEvent[]>);
  }, [events]);

  const deadlineApps = applications.filter((app) => app.deadline);
  const interviewApps = applications.filter((app) => app.status === "interview");
  const followUpApps = applications.filter((app) => app.status === "applied");

  const stats = [
    {
      label: "Deadlines" as PanelType,
      value: String(deadlineApps.length),
      card: "bg-rose-50 border-rose-200 hover:bg-rose-100",
      text: "text-rose-700",
      subtext: "text-rose-500",
      description: "Due in 3 days or less",
    },
    {
      label: "Applications" as PanelType,
      value: String(applications.length),
      card: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
      text: "text-emerald-700",
      subtext: "text-emerald-500",
      description: "All tracked roles",
    },
    {
      label: "Interviews" as PanelType,
      value: String(interviewApps.length),
      card: "bg-violet-50 border-violet-200 hover:bg-violet-100",
      text: "text-violet-700",
      subtext: "text-violet-500",
      description: "Interview stage",
    },
    {
      label: "Follow-Ups Due" as PanelType,
      value: String(followUpApps.length),
      card: "bg-amber-50 border-amber-200 hover:bg-amber-100",
      text: "text-amber-700",
      subtext: "text-amber-500",
      description: "Applied roles",
    },
  ];

  const selectedDayEvents =
    selectedDay !== null ? calendarEventsByDay[selectedDay] || [] : [];

  const selectedPanelApplications =
    selectedPanel === "Deadlines"
      ? deadlineApps
      : selectedPanel === "Applications"
      ? applications
      : selectedPanel === "Interviews"
      ? interviewApps
      : selectedPanel === "Follow-Ups Due"
      ? followUpApps
      : [];

  const upcoming = events.slice(0, 3);
  const recentApplications = applications.slice(0, 3);

  const closeModals = () => {
    setSelectedDay(null);
    setSelectedPanel(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="w-full max-w-xl">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">
              Search jobs, companies, or notes...
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={userEmail ? "/applications" : "/login"}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            >
              {userEmail ? userEmail : "Log in"}
            </Link>

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
              Welcome back — glad to see you. Here’s what we’re focusing on
              today.
            </p>

            <div className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
              Based on your pipeline, Jobly is prioritizing your upcoming
              deadlines, interviews, and follow-ups.
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/discover"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
            >
              Discover
            </Link>
            <Link
              href="/applications"
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200"
            >
              Open Applications
            </Link>
          </div>
        </section>

        {!userEmail && !loading && (
          <div className="mb-8 rounded-3xl border border-indigo-200 bg-indigo-50 p-5">
            <div className="text-sm font-semibold text-indigo-800">
              Log in to unlock your real dashboard
            </div>
            <p className="mt-1 text-sm text-indigo-700">
              Your dashboard will update with your saved applications,
              deadlines, interviews, and next actions.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-flex rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Log in
            </Link>
          </div>
        )}

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
                {loading ? "..." : stat.value}
              </div>
              <div className={`mt-2 text-xs font-medium ${stat.subtext}`}>
                {stat.description}
              </div>
            </button>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Calendar</h2>
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
                  Recent Applications
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your latest saved roles from the database
                </p>
              </div>
              <Link
                href="/applications"
                className="text-sm font-semibold text-indigo-600"
              >
                View all
              </Link>
            </div>

            <div className="mt-5 space-y-4">
              {recentApplications.length > 0 ? (
                recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-3xl border border-slate-200 p-5 transition hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold">{app.role}</h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                              app.status
                            )}`}
                          >
                            {formatStatus(app.status)}
                          </span>
                        </div>
                        <div className="mt-1 text-sm font-medium text-slate-700">
                          {app.company}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          {app.location || "No location"}{" "}
                          {app.deadline
                            ? `• Deadline ${new Date(
                                app.deadline
                              ).toLocaleDateString()}`
                            : ""}
                        </div>
                      </div>

                      <Link
                        href="/applications"
                        className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                      >
                        Open
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                  No applications yet. Add your first application to see it
                  here.
                </div>
              )}
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
                {events.length > 0 ? (
                  events.slice(0, 4).map((event, idx) => (
                    <Link
                      key={event.id}
                      href="/applications"
                      className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100"
                    >
                      <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                          event.type === "Deadline"
                            ? "bg-rose-100 text-rose-600"
                            : event.type === "Follow-up"
                            ? "bg-amber-100 text-amber-600"
                            : event.type === "Interview"
                            ? "bg-violet-100 text-violet-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {idx + 1}
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {event.title}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          {event.company} • {formatEventTime(event.date)}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                    Add deadlines to your applications and Jobly will turn them
                    into next actions.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">
                  Upcoming
                </h2>
                <Link
                  href="/calendar"
                  className="text-sm font-semibold text-indigo-600"
                >
                  Calendar
                </Link>
              </div>

              <div className="mt-5 space-y-3">
                {upcoming.length > 0 ? (
                  upcoming.map((item) => (
                    <Link
                      key={item.id}
                      href="/applications"
                      className="block rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"
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
                    </Link>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-400">
                    No upcoming deadlines yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
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
                      {selectedDayEvents.length === 1 ? "item" : "items"}{" "}
                      scheduled
                    </p>
                  </>
                ) : selectedPanel !== null ? (
                  <>
                    <h3 className="text-xl font-semibold tracking-tight">
                      {selectedPanel}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedPanelApplications.length}{" "}
                      {selectedPanelApplications.length === 1
                        ? "application"
                        : "applications"}{" "}
                      found
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
              {selectedDay !== null ? (
                <div className="space-y-4">
                  {selectedDayEvents
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((event) => (
                      <Link
                        key={event.id}
                        href="/applications"
                        className="block rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"
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

                          <div className="inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200">
                            Open Applications
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedPanelApplications.length > 0 ? (
                    selectedPanelApplications.map((app) => (
                      <Link
                        key={app.id}
                        href="/applications"
                        className="block rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="text-base font-semibold text-slate-900">
                                {app.company}
                              </div>
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                                  app.status
                                )}`}
                              >
                                {formatStatus(app.status)}
                              </span>
                            </div>

                            <div className="mt-2 text-sm font-medium text-slate-700">
                              {app.role}
                            </div>

                            <div className="mt-1 text-sm text-slate-500">
                              {app.location || "No location"}
                              {app.deadline
                                ? ` • Deadline ${new Date(
                                    app.deadline
                                  ).toLocaleDateString()}`
                                : ""}
                            </div>
                          </div>

                          <div className="inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200">
                            Open Applications
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
                      Nothing here yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}