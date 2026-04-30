"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type ApplicationStatus =
  | "Saved"
  | "Applying"
  | "Applied"
  | "Interview"
  | "Offer"
  | "Rejected";

type ApplicationItem = {
  id: number;
  company: string;
  role: string;
  location: string;
  status: ApplicationStatus;
  appliedDate: string;
  nextAction: string;
  recruiter: string;
};

const applications: ApplicationItem[] = [
  {
    id: 1,
    company: "Stripe",
    role: "Data Analyst Intern",
    location: "Remote",
    status: "Applied",
    appliedDate: "Apr 3",
    nextAction: "Follow up tomorrow",
    recruiter: "Sarah Kim",
  },
  {
    id: 2,
    company: "Google",
    role: "Business Analyst Intern",
    location: "Mountain View",
    status: "Interview",
    appliedDate: "Apr 5",
    nextAction: "Interview on Friday",
    recruiter: "Daniel Lee",
  },
  {
    id: 3,
    company: "Uber",
    role: "Strategy & Operations Intern",
    location: "San Francisco",
    status: "Saved",
    appliedDate: "—",
    nextAction: "Deadline on Sunday",
    recruiter: "—",
  },
  {
    id: 4,
    company: "Ramp",
    role: "Growth Analyst",
    location: "New York",
    status: "Applying",
    appliedDate: "—",
    nextAction: "Finish resume edits",
    recruiter: "—",
  },
  {
    id: 5,
    company: "Meta",
    role: "Data Science Intern",
    location: "Menlo Park",
    status: "Applied",
    appliedDate: "Apr 7",
    nextAction: "Follow up next week",
    recruiter: "Ava Martinez",
  },
  {
    id: 6,
    company: "Amazon",
    role: "Business Analyst",
    location: "Seattle",
    status: "Interview",
    appliedDate: "Apr 2",
    nextAction: "Prep SQL questions",
    recruiter: "Noah Patel",
  },
  {
    id: 7,
    company: "Notion",
    role: "Product Analyst",
    location: "San Francisco",
    status: "Saved",
    appliedDate: "—",
    nextAction: "Apply before deadline",
    recruiter: "—",
  },
  {
    id: 8,
    company: "Figma",
    role: "Strategy Intern",
    location: "San Francisco",
    status: "Offer",
    appliedDate: "Mar 28",
    nextAction: "Review offer terms",
    recruiter: "Julia Park",
  },
  {
    id: 9,
    company: "Palantir",
    role: "Forward Deployed Intern",
    location: "New York",
    status: "Rejected",
    appliedDate: "Mar 22",
    nextAction: "Archive",
    recruiter: "—",
  },
];

const columns: ApplicationStatus[] = [
  "Saved",
  "Applying",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

function getStatusStyles(status: ApplicationStatus) {
  switch (status) {
    case "Saved":
      return "bg-slate-100 text-slate-700";
    case "Applying":
      return "bg-emerald-100 text-emerald-700";
    case "Applied":
      return "bg-blue-100 text-blue-700";
    case "Interview":
      return "bg-violet-100 text-violet-700";
    case "Offer":
      return "bg-amber-100 text-amber-700";
    case "Rejected":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function ApplicationsPage() {
  const [view, setView] = useState<"board" | "table">("board");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("");

  const grouped = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column] = applications.filter((app) => app.status === column);
      return acc;
    }, {} as Record<ApplicationStatus, ApplicationItem[]>);
  }, []);

  const addApplication = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      alert("You must be logged in first. Next step: we add login.");
      return;
    }

    const { error } = await supabase.from("applications").insert([
      {
        user_id: user.id,
        company,
        role,
        location,
        deadline: deadline || null,
        status: "saved",
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error adding application.");
      return;
    }

    alert("Application added!");
    setCompany("");
    setRole("");
    setLocation("");
    setDeadline("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-[1600px] px-5 py-6 md:px-8 md:py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-medium uppercase tracking-[0.18em] text-indigo-600">
              Applications
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Your application pipeline
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
              Track every role, see what stage it is in, and jump into details
              fast.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/discover"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
            >
              AI Matches
            </Link>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight">
            Add Application
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            This is the first real database-connected action. Login comes next.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-300"
            />

            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Role"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-300"
            />

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-300"
            />

            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-300"
            />
          </div>

          <button
            onClick={addApplication}
            className="mt-4 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200"
          >
            Add to Database
          </button>
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="grid gap-4 sm:grid-cols-3 md:w-[520px]">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm text-slate-500">Total Applications</div>
              <div className="mt-2 text-2xl font-semibold">
                {applications.length}
              </div>
            </div>
            <div className="rounded-2xl bg-violet-50 p-4">
              <div className="text-sm text-violet-500">Interviews</div>
              <div className="mt-2 text-2xl font-semibold text-violet-700">
                {grouped.Interview.length}
              </div>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4">
              <div className="text-sm text-amber-500">Offers</div>
              <div className="mt-2 text-2xl font-semibold text-amber-700">
                {grouped.Offer.length}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => setView("board")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                view === "board"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setView("table")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                view === "table"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Table
            </button>
          </div>
        </div>

        {view === "board" ? (
          <div className="grid gap-4 xl:grid-cols-6">
            {columns.map((column) => (
              <div
                key={column}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-900">
                    {column}
                  </div>
                  <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                    {grouped[column].length}
                  </div>
                </div>

                <div className="space-y-3">
                  {grouped[column].map((app) => (
                    <Link
                      key={app.id}
                      href={`/applications/${app.id}`}
                      className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white hover:shadow-sm"
                    >
                      <div className="text-sm font-semibold text-slate-900">
                        {app.company}
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        {app.role}
                      </div>
                      <div className="mt-3 text-xs text-slate-500">
                        {app.location}
                      </div>
                      <div className="mt-3 text-xs font-medium text-slate-500">
                        {app.nextAction}
                      </div>
                    </Link>
                  ))}

                  {grouped[column].length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-400">
                      No applications here yet
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr className="text-left text-sm text-slate-500">
                    <th className="px-6 py-4 font-medium">Company</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Applied</th>
                    <th className="px-6 py-4 font-medium">Recruiter</th>
                    <th className="px-6 py-4 font-medium">Next Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr
                      key={app.id}
                      className="border-t border-slate-200 text-sm hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/applications/${app.id}`}
                          className="font-semibold text-slate-900 hover:text-indigo-600"
                        >
                          {app.company}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{app.role}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {app.appliedDate}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {app.recruiter}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {app.nextAction}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}