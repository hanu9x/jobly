"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type EventType = "Deadline" | "Apply" | "Interview" | "Follow-up";

type CalendarEvent = {
  id: number;
  title: string;
  company: string;
  role: string;
  date: Date;
  type: EventType;
};

export default function CalendarPage() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const monthName = today.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const events: CalendarEvent[] = [
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
    }, {} as Record<number, CalendarEvent[]>);
  }, [events]);

  const selectedDayEvents =
    selectedDay !== null ? calendarEventsByDay[selectedDay] || [] : [];

  const upcoming = [...events].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-medium uppercase tracking-[0.18em] text-indigo-600">
              Calendar
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Your job search schedule
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
              See interviews, deadlines, follow-ups, and application tasks in one
              place.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/applications"
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200"
            >
              Applications
            </Link>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.7fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  {monthName}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Click any event count to see details.
                </p>
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
                    className={`min-h-[125px] rounded-2xl border p-3 text-left ${
                      day
                        ? "border-slate-200 bg-slate-50"
                        : "border-transparent bg-transparent"
                    }`}
                  >
                    {day && (
                      <>
                        <div
                          className={`mb-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                            isToday ? "bg-indigo-600 text-white" : "text-slate-700"
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

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold tracking-tight">Upcoming</h2>
            <p className="mt-1 text-sm text-slate-500">
              Your next scheduled actions.
            </p>

            <div className="mt-5 space-y-3">
              {upcoming.slice(0, 7).map((event) => (
                <Link
                  key={event.id}
                  href={`/applications/${event.id}`}
                  className="block rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">{event.title}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        {event.date.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        • {formatOnlyTime(event.date)}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {event.company} • {event.role}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getEventColor(
                        event.type
                      )}`}
                    >
                      {event.type}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      {selectedDay !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h3 className="text-xl font-semibold tracking-tight">
                  Events due on {monthName.split(" ")[0]} {selectedDay}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedDayEvents.length}{" "}
                  {selectedDayEvents.length === 1 ? "item" : "items"} scheduled
                </p>
              </div>

              <button
                onClick={() => setSelectedDay(null)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
              <div className="space-y-4">
                {selectedDayEvents
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
                            {formatOnlyTime(event.date)}
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