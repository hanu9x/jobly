"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type JobType = "Best Fit" | "High Upside" | "Stretch";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  match: number;
  type: JobType;
  reason: string;
  skills: string[];
  posted: string;
};

const jobs: Job[] = [
  {
    id: 101,
    title: "Data Analyst Intern",
    company: "Stripe",
    location: "Remote",
    salary: "$35/hr",
    match: 92,
    type: "Best Fit",
    reason: "Strong overlap with your stats, Python, and analytics background.",
    skills: ["Python", "SQL", "Analytics"],
    posted: "2d ago",
  },
  {
    id: 102,
    title: "Business Analyst Intern",
    company: "Google",
    location: "Mountain View",
    salary: "$42/hr",
    match: 88,
    type: "High Upside",
    reason: "Good fit for data storytelling and problem solving.",
    skills: ["SQL", "Excel", "Analytics"],
    posted: "1d ago",
  },
  {
    id: 103,
    title: "Product Analyst",
    company: "Notion",
    location: "San Francisco",
    salary: "$95k-$120k",
    match: 84,
    type: "Stretch",
    reason: "Fits your product thinking and user behavior interests.",
    skills: ["Product", "Analytics", "Experimentation"],
    posted: "3d ago",
  },
];

function getTagStyles(type: JobType) {
  switch (type) {
    case "Best Fit":
      return "bg-emerald-100 text-emerald-700";
    case "High Upside":
      return "bg-blue-100 text-blue-700";
    case "Stretch":
      return "bg-violet-100 text-violet-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function DiscoverPage() {
  const [selectedType, setSelectedType] = useState<"All" | JobType>("All");
  const [query, setQuery] = useState("");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesType = selectedType === "All" || job.type === selectedType;
      const matchesQuery =
        query === "" ||
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase());

      return matchesType && matchesQuery;
    });
  }, [selectedType, query]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-medium uppercase tracking-[0.18em] text-indigo-600">
              Discover
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              AI job recommendations
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Jobs ranked based on your profile, fit, and potential upside.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs..."
            className="w-full md:max-w-md rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-300"
          />

          <div className="flex gap-2">
            {["All", "Best Fit", "High Upside", "Stretch"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type as any)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                  selectedType === type
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-slate-200 text-slate-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-3xl border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{job.title}</h2>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getTagStyles(
                        job.type
                      )}`}
                    >
                      {job.type}
                    </span>
                  </div>

                  <div className="text-sm text-slate-600 mt-1">
                    {job.company} • {job.location} • {job.salary}
                  </div>

                  <p className="text-sm text-slate-500 mt-3">
                    {job.reason}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-sm text-slate-500">Match</div>
                  <div className="text-xl font-semibold text-emerald-600">
                    {job.match}%
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
                      Save
                    </button>
                    <button className="rounded-xl bg-indigo-600 text-white px-3 py-2 text-sm">
                      Track
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredJobs.length === 0 && (
            <div className="text-center text-slate-500 py-10">
              No jobs match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}