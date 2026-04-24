"use client";

import Link from "next/link";

type Priority = "High" | "Medium" | "Low";

const actions = [
  {
    id: 1,
    title: "Follow up with Stripe today",
    description:
      "You applied several days ago and this is a strong-fit role. A short follow-up could help keep momentum.",
    priority: "High" as Priority,
    href: "/applications/1",
  },
  {
    id: 2,
    title: "Prep for Google interview",
    description:
      "Focus on structured thinking, analytics cases, and 3–4 STAR stories before your interview.",
    priority: "High" as Priority,
    href: "/applications/2",
  },
  {
    id: 3,
    title: "Submit Uber before the deadline",
    description:
      "This role is still saved, but the deadline is coming up. Finish the application today.",
    priority: "Medium" as Priority,
    href: "/applications/3",
  },
  {
    id: 4,
    title: "Apply to 2 more high-match analyst roles",
    description:
      "Your strongest fit is data/product analytics. Add two more applications to keep your weekly pace strong.",
    priority: "Medium" as Priority,
    href: "/discover",
  },
];

const insights = [
  "You are getting the strongest matches in data analyst and product analyst roles.",
  "Your calendar is deadline-heavy this week, so focus on finishing saved applications first.",
  "Follow-ups are becoming a bottleneck. Clearing them could improve your response chances.",
];

const prepPlan = [
  "Review your strongest analytics project.",
  "Prepare one story about leadership and one about failure.",
  "Practice explaining a metric or dashboard you would build.",
  "Write 3 questions to ask the interviewer.",
];

function getPriorityStyle(priority: Priority) {
  switch (priority) {
    case "High":
      return "bg-rose-100 text-rose-700";
    case "Medium":
      return "bg-amber-100 text-amber-700";
    case "Low":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function CoachPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-medium uppercase tracking-[0.18em] text-indigo-600">
              AI Coach
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Your next best moves
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
              Jobly turns your applications, deadlines, and interviews into a
              clear action plan.
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
              href="/discover"
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200"
            >
              Discover Jobs
            </Link>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Top Priorities
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Ranked by urgency, opportunity fit, and timeline.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {actions.map((action, index) => (
                <Link
                  key={action.id}
                  href={action.href}
                  className="block rounded-3xl border border-slate-200 p-5 transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-sm font-bold text-indigo-700">
                        {index + 1}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-slate-900">
                            {action.title}
                          </h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                              action.priority
                            )}`}
                          >
                            {action.priority}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-600">
                          {action.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm font-semibold text-indigo-600">
                      Open →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight">
                Job Search Diagnosis
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                What Jobly notices from your current pipeline.
              </p>

              <div className="mt-5 space-y-3">
                {insights.map((insight) => (
                  <div
                    key={insight}
                    className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700"
                  >
                    {insight}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight">
                Interview Prep Plan
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Suggested prep for your upcoming interviews.
              </p>

              <div className="mt-5 space-y-3">
                {prepPlan.map((item, index) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-2xl bg-violet-50 p-4"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-xs font-bold text-violet-700">
                      {index + 1}
                    </div>
                    <div className="text-sm font-medium text-violet-800">
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight">
                Weekly Target
              </h2>

              <div className="mt-5 space-y-5">
                {[
                  { label: "Applications to submit", value: "5", width: "65%" },
                  { label: "Follow-ups to complete", value: "3", width: "45%" },
                  { label: "Interview prep blocks", value: "2", width: "70%" },
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
      </div>
    </div>
  );
}