import { useState, useEffect } from "react";

export default function App() {
  // ---------- STATE ----------

  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem("jobs");
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState("All");
  const [editingIndex, setEditingIndex] = useState(null);
  const [search, setSearch] = useState("");

  // 🌙 Dark mode state (saved in localStorage)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  const [form, setForm] = useState({
    company: "",
    role: "",
    location: "",
    salary: "",
    date: "",
    status: "Applied",
    link: "",
    notes: "",
  });

  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  // ---------- HELPERS ----------

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const addJob = () => {
    if (!form.company.trim() || !form.role.trim()) {
      alert("Company & Role required!");
      return;
    }

    if (editingIndex !== null) {
      const updated = [...jobs];
      updated[editingIndex] = form;
      setJobs(updated);
      setEditingIndex(null);
    } else {
      setJobs((prev) => [...prev, form]);
    }

    setForm({
      company: "",
      role: "",
      location: "",
      salary: "",
      date: "",
      status: "Applied",
      link: "",
      notes: "",
    });
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setForm(jobs[index]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteJob = (index) => {
    setJobs((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  // search + filter
  const lowerSearch = search.toLowerCase();
  const filteredJobs = jobs.filter((job) => {
    const matchFilter = filter === "All" || job.status === filter;
    const matchSearch =
      !lowerSearch ||
      (job.company || "").toLowerCase().includes(lowerSearch) ||
      (job.role || "").toLowerCase().includes(lowerSearch) ||
      (job.location || "").toLowerCase().includes(lowerSearch) ||
      (job.notes || "").toLowerCase().includes(lowerSearch);

    return matchFilter && matchSearch;
  });

  // salary formatting with $
  const formatSalary = (salary) => {
    if (!salary) return "";
    const num = Number(String(salary).replace(/[^\d.]/g, ""));
    if (!num) return `$${salary}`;
    return `$${num.toLocaleString()}`;
  };

  // ---------- STYLING SHORTCUTS (depend on darkMode) ----------

  const appBg =
    "min-h-screen transition-colors " +
    (darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900");

  const cardClass =
    "rounded-2xl border p-5 shadow-sm transition-colors " +
    (darkMode
      ? "border-slate-800 bg-slate-900"
      : "border-slate-200 bg-white");

  const inputClass =
    "w-full rounded-xl border px-3 py-2 text-sm shadow-sm outline-none placeholder:text-slate-400 " +
    (darkMode
      ? "border-slate-700 bg-slate-900 text-slate-100"
      : "border-slate-300 bg-white text-slate-900") +
    " focus:ring-2 focus:ring-slate-400/60";

  const primaryButtonClass =
    "mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium shadow transition-colors " +
    (darkMode
      ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
      : "bg-slate-900 text-white hover:bg-slate-800");

  const filterActiveClass =
    "rounded-full px-3 py-1 text-xs font-medium border transition-colors " +
    (darkMode
      ? "border-slate-100 bg-slate-100 text-slate-900"
      : "border-slate-900 bg-slate-900 text-white");

  const filterInactiveClass =
    "rounded-full px-3 py-1 text-xs font-medium border transition-colors " +
    (darkMode
      ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100");

  const smallText = darkMode
    ? "text-xs text-slate-300"
    : "text-xs text-slate-600";

  // ---------- JSX ----------

  return (
    <div className={appBg}>
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className={
            "ml-auto mb-6 flex items-center gap-2 rounded-full border px-4 py-1 text-sm shadow-sm transition-colors " +
            (darkMode
              ? "border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
              : "border-slate-300 bg-white text-slate-800 hover:bg-slate-100")
          }
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>

        {/* Header */}
        <header className="mb-6">
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
            <span className="text-2xl">🚀</span>
            <span>Job Tracker</span>
          </h1>
          <p
            className={
              "mt-1 text-sm " +
              (darkMode ? "text-slate-300" : "text-slate-600")
            }
          >
            Add jobs and track your applications.
          </p>
        </header>

        {/* Form card */}
        <section className={cardClass}>
          <div className="space-y-3">
            <input
              className={inputClass}
              placeholder="Company"
              value={form.company}
              onChange={handleChange("company")}
            />
            <input
              className={inputClass}
              placeholder="Role"
              value={form.role}
              onChange={handleChange("role")}
            />
            <input
              className={inputClass}
              placeholder="Location"
              value={form.location}
              onChange={handleChange("location")}
            />
            <input
              className={inputClass}
              placeholder="Salary (e.g., 65000)"
              value={form.salary}
              onChange={handleChange("salary")}
            />
            <input
              type="date"
              className={inputClass}
              value={form.date}
              onChange={handleChange("date")}
            />
            <select
              className={inputClass}
              value={form.status}
              onChange={handleChange("status")}
            >
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
            <input
              className={inputClass}
              placeholder="Job Link"
              value={form.link}
              onChange={handleChange("link")}
            />
            <textarea
              className={inputClass + " h-20 resize-none"}
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange("notes")}
            />

            <button onClick={addJob} className={primaryButtonClass}>
              {editingIndex !== null ? "Save Changes" : "＋ Add Job"}
            </button>
          </div>
        </section>

        {/* Search + filters */}
        <section className="mt-4 space-y-3">
          <input
            type="text"
            placeholder="Search jobs... (company, role, notes, location)"
            className={inputClass}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-wrap gap-2">
            {["All", "Applied", "Interview", "Offer", "Rejected"].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={
                    filter === type ? filterActiveClass : filterInactiveClass
                  }
                >
                  {type}
                </button>
              )
            )}
          </div>
        </section>

        {/* Jobs list */}
        <section className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
            <span className="text-lg">📄</span>
            <span>Your Jobs</span>
          </h2>

          {filteredJobs.length === 0 ? (
            <p className={smallText}>No jobs found.</p>
          ) : (
            <ul className="space-y-3">
              {filteredJobs.map((job, i) => (
                <li
                  key={i}
                  className={
                    "flex flex-col gap-3 rounded-2xl border p-4 shadow-sm transition-colors sm:flex-row sm:items-center sm:justify-between " +
                    (darkMode
                      ? "border-slate-800 bg-slate-900"
                      : "border-slate-200 bg-white")
                  }
                >
                  <div className="space-y-1">
                    {/* Top line: company — role (status) */}
                    <div className="text-sm font-semibold">
                      {job.company || "—"}{" "}
                      <span className="font-normal">
                        — {job.role || "—"}
                      </span>{" "}
                      <span
                        className={
                          "ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs " +
                          (darkMode
                            ? "bg-slate-800 text-slate-200"
                            : "bg-slate-100 text-slate-700")
                        }
                      >
                        {job.status}
                      </span>
                    </div>

                    {/* SECOND LINE: date • location • salary all in one line */}
                    <div className={smallText + " flex flex-wrap gap-x-3"}>
                      {job.date && <span>{job.date}</span>}
                      {job.location && <span>{job.location}</span>}
                      {job.salary && <span>{formatSalary(job.salary)}</span>}
                    </div>

                    {/* Link */}
                    {job.link && (
                      <div className="pt-1">
                        <a
                          href={job.link}
                          target="_blank"
                          rel="noreferrer"
                          className={
                            "text-xs font-medium underline " +
                            (darkMode
                              ? "text-sky-400 hover:text-sky-300"
                              : "text-sky-600 hover:text-sky-500")
                          }
                        >
                          View job posting
                        </a>
                      </div>
                    )}

                    {/* Notes */}
                    {job.notes && (
                      <p
                        className={
                          "pt-1 text-xs " +
                          (darkMode
                            ? "text-slate-400"
                            : "text-slate-500")
                        }
                      >
                        {job.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => startEdit(i)}
                      className={
                        "rounded-lg border px-3 py-1 text-xs font-medium transition-colors " +
                        (darkMode
                          ? "border-slate-700 hover:bg-slate-800"
                          : "border-slate-300 hover:bg-slate-100")
                      }
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteJob(i)}
                      className={
                        "rounded-lg border px-3 py-1 text-xs font-medium transition-colors " +
                        (darkMode
                          ? "border-red-500/70 bg-red-900/20 text-red-200 hover:bg-red-900/40"
                          : "border-red-300 bg-red-50 text-red-700 hover:bg-red-100")
                      }
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
