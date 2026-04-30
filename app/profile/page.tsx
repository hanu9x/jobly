"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import { useState } from "react";

const initialSkills = [
  "Python",
  "SQL",
  "Statistics",
  "Data Analysis",
  "Product Thinking",
  "Leadership",
];

export default function ProfilePage() {
  const [skills, setSkills] = useState(initialSkills);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-medium uppercase tracking-[0.18em] text-indigo-600">
              Profile
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Personalize Jobly
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
              Set your resume, target roles, locations, and preferences so Jobly
              can recommend better jobs.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight">
                Resume Upload
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Uploading a resume helps Jobly understand your experience.
              </p>

              <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <div className="text-sm font-semibold text-slate-900">
                  Drop your resume here
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  PDF, DOCX, or plain text
                </p>
                <button className="mt-5 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200">
                  Upload Resume
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight">
                Job Preferences
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <div className="mb-2 text-sm font-medium text-slate-700">
                    Target Roles
                  </div>
                  <input
                    defaultValue="Data Analyst, Business Analyst, Product Analyst"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-300"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-sm font-medium text-slate-700">
                    Preferred Locations
                  </div>
                  <input
                    defaultValue="Bay Area, Remote, New York"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-300"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-sm font-medium text-slate-700">
                    Experience Level
                  </div>
                  <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-300">
                    <option>Student / Intern</option>
                    <option>New Grad</option>
                    <option>Entry Level</option>
                    <option>Mid Level</option>
                  </select>
                </label>

                <label className="block">
                  <div className="mb-2 text-sm font-medium text-slate-700">
                    Work Style
                  </div>
                  <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-300">
                    <option>Remote or Hybrid</option>
                    <option>Remote Only</option>
                    <option>Hybrid Only</option>
                    <option>Onsite</option>
                  </select>
                </label>

                <label className="block">
                  <div className="mb-2 text-sm font-medium text-slate-700">
                    Minimum Salary
                  </div>
                  <input
                    defaultValue="$80,000"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-300"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-sm font-medium text-slate-700">
                    Industries
                  </div>
                  <input
                    defaultValue="Tech, AI, Sports Analytics, Finance"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-300"
                  />
                </label>
              </div>

              <button className="mt-6 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200">
                Save Preferences
              </button>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight">
                Jobly Match Profile
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                This is what Jobly uses to rank opportunities.
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <div className="text-sm font-medium text-emerald-600">
                    Strongest Match
                  </div>
                  <div className="mt-1 text-lg font-semibold text-emerald-700">
                    Data + Product Analytics
                  </div>
                </div>

                <div className="rounded-2xl bg-violet-50 p-4">
                  <div className="text-sm font-medium text-violet-600">
                    Stretch Area
                  </div>
                  <div className="mt-1 text-lg font-semibold text-violet-700">
                    Strategy / Product Roles
                  </div>
                </div>

                <div className="rounded-2xl bg-amber-50 p-4">
                  <div className="text-sm font-medium text-amber-600">
                    Suggested Focus
                  </div>
                  <div className="mt-1 text-lg font-semibold text-amber-700">
                    Apply earlier + follow up faster
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight">Skills</h2>

              <div className="mt-5 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setSkills([...skills, "Machine Learning"])}
                className="mt-5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
              >
                Add Skill
              </button>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight">
                Notifications
              </h2>

              <div className="mt-5 space-y-3">
                {[
                  "Follow-up reminders",
                  "Interview prep alerts",
                  "Deadline warnings",
                  "New high-match jobs",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                  >
                    <div className="text-sm font-medium text-slate-700">
                      {item}
                    </div>
                    <div className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                      On
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}