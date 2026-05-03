"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type ProfileRow = {
  id: string;
  user_id: string;
  skills: string[];
  interests: string[];
  preferred_locations: string[];
  target_roles: string[];
  created_at: string;
  updated_at: string;
};

function splitInput(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinArray(value: string[] | null | undefined) {
  return value?.join(", ") || "";
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [preferredLocations, setPreferredLocations] = useState("");
  const [targetRoles, setTargetRoles] = useState("");
  const [showRejected, setShowRejected] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);

    const savedPreference = localStorage.getItem("showRejected");
    setShowRejected(savedPreference === "true");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setUserEmail(null);
      setLoading(false);
      return;
    }

    setUserEmail(user.email || null);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error(error);
      alert("Error loading profile.");
      setLoading(false);
      return;
    }

    const profile = data as ProfileRow | null;

    if (profile) {
      setSkills(joinArray(profile.skills));
      setInterests(joinArray(profile.interests));
      setPreferredLocations(joinArray(profile.preferred_locations));
      setTargetRoles(joinArray(profile.target_roles));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateShowRejected = (value: boolean) => {
    setShowRejected(value);
    localStorage.setItem("showRejected", String(value));
  };

  const saveProfile = async () => {
    setSaving(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setSaving(false);
      alert("Please log in first.");
      window.location.href = "/login";
      return;
    }

    const payload = {
      user_id: user.id,
      skills: splitInput(skills),
      interests: splitInput(interests),
      preferred_locations: splitInput(preferredLocations),
      target_roles: splitInput(targetRoles),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "user_id" });

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Error saving profile.");
      return;
    }

    alert("Profile saved.");
    await fetchProfile();
  };

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
              Tell Jobly what you’re good at and what you’re looking for, so it
              can rank opportunities around you.
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
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200"
            >
              Discover
            </Link>
          </div>
        </div>

        {!userEmail && !loading && (
          <div className="mb-6 rounded-3xl border border-indigo-200 bg-indigo-50 p-5">
            <div className="text-sm font-semibold text-indigo-800">
              Log in to save your profile
            </div>
            <p className="mt-1 text-sm text-indigo-700">
              Your profile powers personalized job matching.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-flex rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Log in
            </Link>
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            Loading profile...
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
            <section className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold tracking-tight">
                  Match Profile
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Use commas to separate each item.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <div className="mb-2 text-sm font-medium text-slate-700">
                      Skills
                    </div>
                    <input
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="Python, SQL, Statistics, Data Analysis"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-300"
                    />
                  </label>

                  <label className="block">
                    <div className="mb-2 text-sm font-medium text-slate-700">
                      Target Roles
                    </div>
                    <input
                      value={targetRoles}
                      onChange={(e) => setTargetRoles(e.target.value)}
                      placeholder="Data Analyst, Product Analyst, Strategy Intern"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-300"
                    />
                  </label>

                  <label className="block">
                    <div className="mb-2 text-sm font-medium text-slate-700">
                      Interests
                    </div>
                    <input
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      placeholder="AI, Sports Analytics, Startups, Finance"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-300"
                    />
                  </label>

                  <label className="block">
                    <div className="mb-2 text-sm font-medium text-slate-700">
                      Preferred Locations
                    </div>
                    <input
                      value={preferredLocations}
                      onChange={(e) => setPreferredLocations(e.target.value)}
                      placeholder="Bay Area, Remote, New York"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-300"
                    />
                  </label>
                </div>

                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="mt-6 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold tracking-tight">
                  Resume Upload
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Coming soon: upload your resume so Jobly can auto-detect your
                  skills and experience.
                </p>

                <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <div className="text-sm font-semibold text-slate-900">
                    Resume parsing coming soon
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    PDF, DOCX, or plain text
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold tracking-tight">
                  Jobly Match Profile
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  This is what Jobly will use to rank opportunities.
                </p>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <div className="text-sm font-medium text-emerald-600">
                      Skills
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {splitInput(skills).length > 0 ? (
                        splitInput(skills).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <div className="text-sm text-emerald-700">
                          Add skills to improve matching.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-violet-50 p-4">
                    <div className="text-sm font-medium text-violet-600">
                      Target Roles
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {splitInput(targetRoles).length > 0 ? (
                        splitInput(targetRoles).map((role) => (
                          <span
                            key={role}
                            className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-violet-700"
                          >
                            {role}
                          </span>
                        ))
                      ) : (
                        <div className="text-sm text-violet-700">
                          Add target roles to guide Discover.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-amber-50 p-4">
                    <div className="text-sm font-medium text-amber-600">
                      Interests
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {splitInput(interests).length > 0 ? (
                        splitInput(interests).map((interest) => (
                          <span
                            key={interest}
                            className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-amber-700"
                          >
                            {interest}
                          </span>
                        ))
                      ) : (
                        <div className="text-sm text-amber-700">
                          Add interests to personalize recommendations.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-blue-50 p-4">
                    <div className="text-sm font-medium text-blue-600">
                      Preferred Locations
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {splitInput(preferredLocations).length > 0 ? (
                        splitInput(preferredLocations).map((location) => (
                          <span
                            key={location}
                            className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700"
                          >
                            {location}
                          </span>
                        ))
                      ) : (
                        <div className="text-sm text-blue-700">
                          Add locations to filter matches.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold tracking-tight">
                  Preferences
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Control how your workspace looks.
                </p>

                <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Show rejected applications
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      Turn this on only when you want to review rejected roles.
                    </div>
                  </div>

                  <button
                    onClick={() => updateShowRejected(!showRejected)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      showRejected
                        ? "bg-rose-100 text-rose-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {showRejected ? "On" : "Off"}
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold tracking-tight">
                  Personalization Status
                </h2>

                <div className="mt-5 space-y-3">
                  {[
                    { label: "Skills added", value: splitInput(skills).length },
                    {
                      label: "Target roles added",
                      value: splitInput(targetRoles).length,
                    },
                    {
                      label: "Interests added",
                      value: splitInput(interests).length,
                    },
                    {
                      label: "Locations added",
                      value: splitInput(preferredLocations).length,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                    >
                      <div className="text-sm font-medium text-slate-700">
                        {item.label}
                      </div>
                      <div className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold tracking-tight">
                  Signed In
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {userEmail || "Not signed in"}
                </p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}