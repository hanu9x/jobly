import Link from "next/link";

type ApplicationStatus =
  | "Saved"
  | "Applying"
  | "Applied"
  | "Interview"
  | "Offer"
  | "Rejected";

type EventType = "Deadline" | "Apply" | "Interview" | "Follow-up";

type Application = {
  id: number;
  company: string;
  role: string;
  location: string;
  status: ApplicationStatus;
  type: EventType;
  recruiter: string;
  recruiterEmail: string;
  notes: string;
  nextStep: string;
  compensation: string;
};

const applications: Application[] = [
  {
    id: 1,
    company: "Stripe",
    role: "Data Analyst Intern",
    location: "Remote",
    status: "Applied",
    type: "Follow-up",
    recruiter: "Sarah Kim",
    recruiterEmail: "sarah@stripe.com",
    notes:
      "Strong fit based on analytics + Python background. Submitted last week.",
    nextStep: "Send follow-up email tomorrow.",
    compensation: "$35/hr",
  },
  {
    id: 2,
    company: "Google",
    role: "Business Analyst Intern",
    location: "Mountain View",
    status: "Interview",
    type: "Interview",
    recruiter: "Daniel Lee",
    recruiterEmail: "daniel@google.com",
    notes:
      "Behavioral + case interview. Focus on structured thinking + storytelling.",
    nextStep: "Practice 2 cases + STAR stories.",
    compensation: "$42/hr",
  },
  {
    id: 3,
    company: "Uber",
    role: "Strategy & Operations Intern",
    location: "San Francisco",
    status: "Saved",
    type: "Deadline",
    recruiter: "—",
    recruiterEmail: "—",
    notes: "High priority role. Resume mostly ready.",
    nextStep: "Submit before deadline.",
    compensation: "$38/hr",
  },
  {
    id: 4,
    company: "Ramp",
    role: "Growth Analyst",
    location: "New York",
    status: "Applying",
    type: "Apply",
    recruiter: "—",
    recruiterEmail: "—",
    notes:
      "Good fit with startup + analytics interests. Resume edits are almost done.",
    nextStep: "Finish resume edits and submit application.",
    compensation: "$90k–$110k",
  },
  {
    id: 5,
    company: "Meta",
    role: "Data Science Intern",
    location: "Menlo Park",
    status: "Applied",
    type: "Follow-up",
    recruiter: "Ava Martinez",
    recruiterEmail: "ava@meta.com",
    notes:
      "Application submitted through careers portal. Good alignment with data modeling work.",
    nextStep: "Follow up next week.",
    compensation: "$45/hr",
  },
  {
    id: 6,
    company: "Amazon",
    role: "Business Analyst",
    location: "Seattle",
    status: "Interview",
    type: "Interview",
    recruiter: "Noah Patel",
    recruiterEmail: "noah@amazon.com",
    notes:
      "Likely SQL + metrics questions. Need Amazon LP prep too.",
    nextStep: "Prep SQL questions and leadership stories.",
    compensation: "$105k",
  },
  {
    id: 7,
    company: "Notion",
    role: "Product Analyst",
    location: "San Francisco",
    status: "Saved",
    type: "Deadline",
    recruiter: "—",
    recruiterEmail: "—",
    notes:
      "Stretch role but very aligned with product thinking and user behavior.",
    nextStep: "Apply before deadline.",
    compensation: "$95k–$120k",
  },
  {
    id: 8,
    company: "Figma",
    role: "Strategy Intern",
    location: "San Francisco",
    status: "Offer",
    type: "Apply",
    recruiter: "Julia Park",
    recruiterEmail: "julia@figma.com",
    notes:
      "Offer received. Strong fit and exciting team.",
    nextStep: "Review offer terms and decide.",
    compensation: "$36/hr",
  },
  {
    id: 9,
    company: "Palantir",
    role: "Forward Deployed Intern",
    location: "New York",
    status: "Rejected",
    type: "Deadline",
    recruiter: "—",
    recruiterEmail: "—",
    notes:
      "Application closed out after review.",
    nextStep: "Archive and move on.",
    compensation: "$40/hr",
  },
];

function getTypeColor(type: EventType) {
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
}

export default function ApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const app = applications.find((a) => a.id === Number(params.id));

  if (!app) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <Link
          href="/applications"
          className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm"
        >
          ← Back to Applications
        </Link>
        <h1 className="mt-6 text-2xl font-semibold">Application not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <Link
          href="/applications"
          className="mb-6 inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
        >
          ← Back to Applications
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-sm font-medium uppercase tracking-[0.18em] text-indigo-600">
                Application Detail
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                {app.role}
              </h1>
              <p className="mt-1 text-lg text-slate-600">{app.company}</p>
            </div>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${getTypeColor(
                app.type
              )}`}
            >
              {app.type}
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Status</p>
              <p className="mt-1 font-semibold">{app.status}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Compensation</p>
              <p className="mt-1 font-semibold">{app.compensation}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Location</p>
              <p className="mt-1 font-semibold">{app.location}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Recruiter</p>
              <p className="mt-1 font-semibold">{app.recruiter}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">Notes</h2>
            <div className="mt-3 rounded-2xl border border-slate-200 p-4 text-slate-700">
              {app.notes}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">Next Step</h2>
            <div className="mt-3 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-indigo-900">
              {app.nextStep}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}