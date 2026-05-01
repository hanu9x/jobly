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
  content: string;
};

type Profile = {
  skills: string[];
  interests: string[];
  preferred_locations: string[];
  target_roles: string[];
};

const boards = [
  { name: "stripe", company: "Stripe" },
  { name: "notion", company: "Notion" },
  { name: "airbnb", company: "Airbnb" },
  { name: "ramp", company: "Ramp" },
  { name: "databricks", company: "Databricks" },
];

const SKILL_KEYWORDS = [
  "Python",
  "SQL",
  "JavaScript",
  "TypeScript",
  "React",
  "Excel",
  "Analytics",
  "Statistics",
  "Machine Learning",
  "AI",
  "Data Analysis",
  "Product",
  "Experimentation",
  "Communication",
  "Strategy",
  "Operations",
  "Finance",
];

const INTEREST_KEYWORDS = [
  "AI",
  "Data",
  "Product",
  "Finance",
  "Startups",
  "Strategy",
  "Analytics",
  "Machine Learning",
  "Operations",
];

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function extractKeywords(text: string, keywords: string[]) {
  const lower = text.toLowerCase();
  return keywords.filter((keyword) => lower.includes(keyword.toLowerCase()));
}

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function getJobKey(job: { company: string; title: string }) {
  return `${job.company.toLowerCase()}-${job.title.toLowerCase()}`;
}

function getJobType(score: number): JobType {
  if (score >= 82) return "Best Fit";
  if (score >= 68) return "High Upside";
  return "Stretch";
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
  const jobContent = normalize(job.content);

  let score = 50;

  const skillMatches = jobSkills.filter((skill) =>
    profileSkills.some(
      (userSkill) => skill.includes(userSkill) || userSkill.includes(skill)
    )
  ).length;

  const interestMatches = jobInterests.filter((interest) =>
    profileInterests.some(
      (userInterest) =>
        interest.includes(userInterest) || userInterest.includes(interest)
    )
  ).length;

  const roleMatch = profileRoles.some(
    (role) => jobTitle.includes(role) || jobContent.includes(role)
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
  const [realJobs, setRealJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [trackedKeys, setTrackedKeys] = useState<string[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoadingJobs(true);

      try {
        const allJobs: Job[] = [];

        for (const board of boards) {
          try {
            const res = await fetch(
              `https://boards-api.greenhouse.io/v1/boards/${board.name}/jobs?content=true`
            );

            if (!res.ok) continue;

            const data = await res.json();

            const formatted: Job[] = (data.jobs || [])
              .slice(0, 15)
              .map((job: any) => {
                const cleanContent = stripHtml(job.content || "");
                const extractedSkills = extractKeywords(
                  cleanContent,
                  SKILL_KEYWORDS
                );

                const extractedInterests = extractKeywords(
                  `${job.title} ${cleanContent}`,
                  INTEREST_KEYWORDS
                );

                return {
                  id: job.id,
                  title: job.title,
                  company: board.company,
                  location: job.location?.name || "Unknown",
                  salary: "Not listed",
                  type: "Stretch",
                  reason:
                    extractedSkills.length > 0
                      ? `Detected real signals: ${extractedSkills
                          .slice(0, 4)
                          .join(", ")}.`
                      : "Live job from company career board.",
                  skills:
                    extractedSkills.length > 0 ? extractedSkills : ["General"],
                  interests:
                    extractedInterests.length > 0
                      ? extractedInterests
                      : ["General"],
                  posted: "Live",
                  content: cleanContent,
                };
              });

            allJobs.push(...formatted);
          } catch (err) {
            console.log(`Failed ${board.company}`, err);
          }
        }

        setRealJobs(allJobs);
      } catch (err) {
        console.error(err);
      }

      setLoadingJobs(false);
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchProfileAndTrackedJobs = async () => {
      setLoadingProfile(true);

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        setProfile(null);
        setTrackedKeys([]);
        setLoadingProfile(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("skills, interests, preferred_locations, target_roles")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error(profileError);
        setProfile(null);
      } else if (profileData) {
        setProfile(profileData as Profile);
      }

      const { data: appData, error: appError } = await supabase
        .from("applications")
        .select("company, role")
        .eq("user_id", user.id);

      if (appError) {
        console.error(appError);
        setTrackedKeys([]);
      } else {
        setTrackedKeys(
          (appData || []).map((app) =>
            getJobKey({ company: app.company, title: app.role })
          )
        );
      }

      setLoadingProfile(false);
    };

    fetchProfileAndTrackedJobs();
  }, []);

  const rankedJobs = useMemo(() => {
    return realJobs
      .map((job) => {
        const match = getMatchScore(job, profile);
        return {
          ...job,
          match,
          type: getJobType(match),
          tracked: trackedKeys.includes(getJobKey(job)),
        };
      })
      .sort((a, b) => b.match - a.match);
  }, [profile, realJobs, trackedKeys]);

  const filteredJobs = useMemo(() => {
    return rankedJobs.filter((job) => {
      const matchesType = selectedType === "All" || job.type === selectedType;
      const matchesQuery =
        query === "" ||
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase()) ||
        job.location.toLowerCase().includes(query.toLowerCase()) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(query.toLowerCase())
        );

      return matchesType && matchesQuery;
    });
  }, [selectedType, query, rankedJobs]);

  const trackJob = async (job: Job & { match: number; tracked: boolean }) => {
    const jobKey = getJobKey(job);

    if (trackedKeys.includes(jobKey)) return;

    setSavingJobId(job.id);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setSavingJobId(null);
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
        notes: `${job.reason} Match score: ${job.match}%. Extracted skills: ${job.skills.join(
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

    setTrackedKeys((prev) => [...prev, jobKey]);
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
              Live jobs from multiple company career boards ranked with your
              profile.
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
            {loadingJobs || loadingProfile
              ? "Loading live jobs and your match profile..."
              : profile
              ? "Real multi-company matching is active."
              : "Live jobs loaded. Create a profile for personalization."}
          </div>
          <p className="mt-1 text-sm text-indigo-700">
            {profile
              ? `Using ${profile.skills.length} skills, ${profile.target_roles.length} target roles, and ${profile.interests.length} interests to rank ${realJobs.length} live jobs.`
              : `Jobly loaded ${realJobs.length} live jobs. Add a profile to improve ranking.`}
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs, companies, locations, or skills..."
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
          {loadingJobs ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
              Loading live jobs...
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={`${job.company}-${job.id}`}
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
                      {job.tracked && (
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                          Tracked
                        </span>
                      )}
                    </div>

                    <div className="mt-1 text-sm text-slate-600">
                      {job.company} • {job.location} • {job.salary} •{" "}
                      {job.posted}
                    </div>

                    <p className="mt-3 text-sm text-slate-500">{job.reason}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.skills.slice(0, 8).map((skill) => (
                        <span
                          key={`${job.id}-${skill}`}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="min-w-[150px] md:text-right">
                    <div className="text-sm text-slate-500">
                      Personalized Match
                    </div>
                    <div className="text-2xl font-semibold text-emerald-600">
                      {job.match}%
                    </div>

                    <div className="mt-3 flex gap-2 md:justify-end">
                      <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
                        Save
                      </button>

                      <button
                        onClick={() => trackJob(job)}
                        disabled={savingJobId === job.id || job.tracked}
                        className={`rounded-xl px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed ${
                          job.tracked
                            ? "bg-slate-200 text-slate-500"
                            : "bg-indigo-600 text-white disabled:opacity-60"
                        }`}
                      >
                        {savingJobId === job.id
                          ? "Tracking..."
                          : job.tracked
                          ? "Tracked"
                          : "Track Job"}
                      </button>
                    </div>

                    {job.tracked && (
                      <Link
                        href="/applications"
                        className="mt-3 inline-block text-sm font-semibold text-indigo-600"
                      >
                        View in Applications →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {!loadingJobs && filteredJobs.length === 0 && (
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