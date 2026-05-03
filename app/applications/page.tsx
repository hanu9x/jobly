"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

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
    notes: string | null;
    apply_url: string | null;
    created_at: string;
  };

const columns: ApplicationStatus[] = [
  "saved",
  "applying",
  "applied",
  "interview",
  "offer",
  "rejected",
];

function formatStatus(status: ApplicationStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getStatusStyles(status: ApplicationStatus) {
  switch (status) {
    case "saved":
      return "bg-slate-100 text-slate-700";
    case "applying":
      return "bg-emerald-100 text-emerald-700";
    case "applied":
      return "bg-blue-100 text-blue-700";
    case "interview":
      return "bg-violet-100 text-violet-700";
    case "offer":
      return "bg-amber-100 text-amber-700";
    case "rejected":
      return "bg-rose-100 text-rose-700";
  }
}

export default function ApplicationsPage() {
  const [view, setView] = useState<"board" | "table">("board");
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("");

  const fetchApplications = async () => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setApplications([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Error loading applications.");
    } else {
      setApplications((data || []) as ApplicationItem[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const grouped = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column] = applications.filter((app) => app.status === column);
      return acc;
    }, {} as Record<ApplicationStatus, ApplicationItem[]>);
  }, [applications]);

  const addApplication = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      alert("Please log in first.");
      window.location.href = "/login";
      return;
    }

    if (!company.trim() || !role.trim()) {
      alert("Please enter a company and role.");
      return;
    }

    const { error } = await supabase.from("applications").insert([
      {
        user_id: user.id,
        company,
        role,
        location: location || null,
        deadline: deadline || null,
        status: "saved",
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error adding application.");
      return;
    }

    setCompany("");
    setRole("");
    setLocation("");
    setDeadline("");

    await fetchApplications();
  };

  const updateStatus = async (id: string, status: ApplicationStatus) => {
    setUpdatingId(id);

    const previousApplications = applications;

    setApplications((current) =>
      current.map((app) => (app.id === id ? { ...app, status } : app))
    );

    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id);

    setUpdatingId(null);

    if (error) {
      console.error(error);
      setApplications(previousApplications);
      alert("Error updating status.");
    }
  };

  const deleteApplication = async (id: string) => {
    const { error } = await supabase.from("applications").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert("Error deleting application.");
      return;
    }

    await fetchApplications();
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
              Discover
            </Link>

            <Link
              href="/login"
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight">
            Add Application
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Add a real application to your database.
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
            Add Application
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
                {grouped.interview.length}
              </div>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4">
              <div className="text-sm text-amber-500">Offers</div>
              <div className="mt-2 text-2xl font-semibold text-amber-700">
                {grouped.offer.length}
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

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="text-lg font-semibold text-slate-900">
              No applications yet
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Add your first application above to start building your real
              pipeline.
            </p>
          </div>
        ) : view === "board" ? (
          <div className="grid gap-4 xl:grid-cols-6">
            {columns.map((column) => (
              <div
                key={column}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-900">
                    {formatStatus(column)}
                  </div>
                  <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                    {grouped[column].length}
                  </div>
                </div>

                <div className="space-y-3">
                  {grouped[column].map((app) => (
                    <div
                      key={app.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white hover:shadow-sm"
                    >
                      <div className="text-sm font-semibold text-slate-900">
                        {app.company}
                      </div>

                      <div className="mt-1 text-sm text-slate-600">
                        {app.role}
                      </div>

                      <div className="mt-3 text-xs text-slate-500">
                        {app.location || "No location"}
                      </div>

                      <div className="mt-3 text-xs font-medium text-slate-500">
                        {app.deadline
                          ? `Deadline: ${new Date(
                              app.deadline
                            ).toLocaleDateString()}`
                          : "No deadline"}
                      </div>

                      <select
                        value={app.status}
                        disabled={updatingId === app.id}
                        onChange={(e) =>
                          updateStatus(
                            app.id,
                            e.target.value as ApplicationStatus
                          )
                        }
                        className={`mt-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold outline-none ${getStatusStyles(
                          app.status
                        )}`}
                      >
                        {columns.map((status) => (
                          <option key={status} value={status}>
                            {formatStatus(status)}
                          </option>
                        ))}
                      </select>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        {app.apply_url ? (
                          <a
                            href={app.apply_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-indigo-600"
                          >
                            Apply →
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">No apply link</span>
                        )}

                        <button
                          onClick={() => deleteApplication(app.id)}
                          className="text-xs font-semibold text-rose-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
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
                    <th className="px-6 py-4 font-medium">Location</th>
                    <th className="px-6 py-4 font-medium">Deadline</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((app) => (
                    <tr
                      key={app.id}
                      className="border-t border-slate-200 text-sm hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {app.company}
                      </td>

                      <td className="px-6 py-4 text-slate-600">{app.role}</td>

                      <td className="px-6 py-4">
                        <select
                          value={app.status}
                          disabled={updatingId === app.id}
                          onChange={(e) =>
                            updateStatus(
                              app.id,
                              e.target.value as ApplicationStatus
                            )
                          }
                          className={`rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold outline-none ${getStatusStyles(
                            app.status
                          )}`}
                        >
                          {columns.map((status) => (
                            <option key={status} value={status}>
                              {formatStatus(status)}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {app.location || "—"}
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {app.deadline
                          ? new Date(app.deadline).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {app.apply_url ? (
                            <a
                              href={app.apply_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-indigo-600"
                            >
                              Apply
                            </a>
                          ) : (
                            <span className="text-sm text-slate-400">No link</span>
                          )}

                          <button
                            onClick={() => deleteApplication(app.id)}
                            className="text-sm font-semibold text-rose-600"
                          >
                            Delete
                          </button>
                        </div>
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