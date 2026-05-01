"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type JobType = "Best Fit" | "High Upside" | "Stretch";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: JobType;
  reason: string;
  skills: string[];
  interests: string[];
  posted: string;
};

type Profile = {
  skills: string[];
  interests: string[];
  preferred_locations: string[];
  target_roles: string[];
};

const jobs: Job[] = [
  {
    id: 101,
    title: "Data Analyst Intern",
    company: "Stripe",
    location: "Remote",
    salary: "$35/hr",
    type: "Best Fit",
    reason: "Strong overlap with stats, Python, SQL, and analytics work.",
    skills: ["Python", "SQL", "Statistics", "Analytics"],
    interests: ["Finance", "Startups", "Data"],
    posted: "2d ago",
  },
  {
    id: 102,
    title: "Business Analyst Intern",
    company: "Google",
    location: "Mountain View",
    salary: "$42/hr",
    type: "High Upside",
    reason: "Good fit for data storytelling, modeling, and structured problem solving.",
    skills: ["SQL", "Excel", "Analytics", "Communication"],
    interests: ["Tech", "Strategy", "Data"],
    posted: "1d ago",
  },
  {
    id: 103,
    title: "Product Analyst",
    company: "Notion",
    location: "San Francisco",
    salary: "$95k-$120k",
    type: "Stretch",
    reason: "Fits product thinking, experimentation, and user behavior interests.",
    skills: ["Product", "Analytics", "Experimentation"],
    interests: ["Startups", "Product", "AI"],
    posted: "3d ago",
  },
  {
    id: 104,
    title: "Sports Analytics Intern",
    company: "ESPN",
    location: "Remote",
    salary: "$30/hr",
    type: "Best Fit",
    reason: "Strong fit if you’re interested in sports, data, and predictive analytics.",
    skills: ["Python", "Statistics", "Data Analysis"],
    interests: ["Sports Analytics", "Sports", "Data"],
    posted: "4d ago",
  },
];

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function getMatchScore(job: Job, profile: Profile | null) {
  if (!profile) return 60;

  const profileSkills = profile.skills.map(normalize);
  const profileInterests = profile.interests.map(normalize);
  const profileLocations = profile.preferred_locations.map(normalize);
  const profileRoles = profile.target_roles.map(normalize);

  const jobSkills = job.skills.map(normalize);
  const jobInterests = job.interests.map(normalize);
  const jobTitle = normalize(job.title);
  const jobLocation = normalize(job.location);

  let score = 50;

  const skillMatches = jobSkills.filter((skill) =>
    profileSkills.some((userSkill) => skill.includes(userSkill) || userSkill.includes(skill))
  ).length;

  const interestMatches = jobInterests.filter((interest) =>
    profileInterests.some(
      (userInterest) => interest.includes(userInterest) || userInterest.includes(interest)
    )
  ).length;

  const roleMatch = profileRoles.some(
    (role) => jobTitle.includes(role) || role.includes(jobTitle)
  );

  const locationMatch = profileLocations.some(
    (location) =>
      jobLocation.includes(location) ||
      location.includes(jobLocation) ||
      jobLocation.includes("remote") ||
      location.includes("remote")
  );

  score += skillMatches * 10;
  score += interestMatches * 7;
  if (roleMatch) score += 15;
  if (locationMatch) score += 8;

  return Math.min(score, 98);
}

function getTagStyles(type: JobType) {
  switch (type) {
    case "Best Fit":
      return "bg-emerald-100 text-emerald-700";
    case "High Upside":
      return "bg-blue-100 text-blue-700";
    case "Stretch":
      return "bg-violet-100 text-violet-700";
  }
}

export default function DiscoverPage() {
  const [selectedType, setSelectedType] = useState<"All" | JobType>("All");
  const [query, setQuery] = useState("");
  const [savingJobId, setSavingJobId] = useState<number | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        setProfile(null);
        setLoadingProfile(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("skills, interests, preferred_locations, target_roles")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error(error);
        setProfile(null);
      } else if (data) {
        setProfile(data as Profile);
      }

      setLoadingProfile(false);
    };

    fetchProfile();
  }, []);

  const rankedJobs = useMemo(() => {
    return jobs
      .map((job) => ({
        ...job,
        match: getMatchScore(job, profile),
      }))
      .sort((a, b) => b.match - a.match);
  }, [profile]);

  const filteredJobs = useMemo(() => {
    return rankedJobs.filter((job) => {
      const matchesType = selectedType === "All" || job.type === selectedType;
      const matchesQuery =
        query === "" ||
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase()) ||
        job.location.toLowerCase().includes(query.toLowerCase());

      return matchesType && matchesQuery;
    });
  }, [selectedType, query, rankedJobs]);

  const trackJob = async (job: Job & { match: number }) => {
    setSavingJobId(job.id);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setSavingJobId(null);
      alert("Please log in first.");
      window.location.href = "/login";
      return;
    }

    const { error } = await supabase.from("applications").insert([
      {
        user_id: user.id,
        company: job.company,
        role: job.title,
        location: job.location,
        status: "saved",
        notes: `${job.reason} Match score: ${job.match}%. Skills: ${job.skills.join(
          ", "
        )}.`,
      },
    ]);

    setSavingJobId(null);

    if (error) {
      console.error(error);
      alert("Error tracking job.");
      return;
    }

    alert(`${job.company} saved to your applications.`);
    window.location.href = "/applications";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-medium uppercase tracking-[0.18em] text-indigo-600">
              Discover
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Personalized job matches
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Jobs ranked based on your saved profile, skills, interests, and target roles.
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
              href="/profile"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
            >
              Edit Profile
            </Link>

            <Link
              href="/applications"
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200"
            >
              Applications
            </Link>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-indigo-200 bg-indigo-50 p-5">
          <div className="text-sm font-semibold text-indigo-800">
            {loadingProfile
              ? "Loading your match profile..."
              : profile
              ? "Personalization is active."
              : "No profile found yet."}
          </div>
          <p className="mt-1 text-sm text-indigo-700">
            {profile
              ? `Using ${profile.skills.length} skills, ${profile.target_roles.length} target roles, and ${profile.interests.length} interests to rank jobs.`
              : "Create a profile so Jobly can personalize Discover for you."}
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs, companies, or locations..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-300 md:max-w-md"
          />

          <div className="flex flex-wrap gap-2">
            {(["All", "Best Fit", "High Upside", "Stretch"] as const).map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    selectedType === type
                      ? "bg-indigo-600 text-white"
                      : "border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {type}
                </button>
              )
            )}
          </div>
        </div>

        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{job.title}</h2>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getTagStyles(
                        job.type
                      )}`}
                    >
                      {job.type}
                    </span>
                  </div>

                  <div className="mt-1 text-sm text-slate-600">
                    {job.company} • {job.location} • {job.salary} • Posted{" "}
                    {job.posted}
                  </div>

                  <p className="mt-3 text-sm text-slate-500">{job.reason}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="min-w-[150px] md:text-right">
                  <div className="text-sm text-slate-500">Personalized Match</div>
                  <div className="text-2xl font-semibold text-emerald-600">
                    {job.match}%
                  </div>

                  <div className="mt-3 flex gap-2 md:justify-end">
                    <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
                      Save
                    </button>

                    <button
                      onClick={() => trackJob(job)}
                      disabled={savingJobId === job.id}
                      className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {savingJobId === job.id ? "Tracking..." : "Track Job"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredJobs.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No matches yet — try broadening your search or updating your
              profile.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}