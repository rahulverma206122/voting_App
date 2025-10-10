import React, { useEffect, useState } from "react";
import { addCandidate, fetchResults, fetchCandidates } from "../api";

export default function AdminDashboard() {
  const [form, setForm] = useState({ name: "", party: "", age: "", imageUrl: "" });
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const c = await fetchCandidates();
      if (!c) setCandidates([]);
      else if (Array.isArray(c)) setCandidates(c);
      else if (c.candidates && Array.isArray(c.candidates)) setCandidates(c.candidates);
      else setCandidates(c || []);

      const r = await fetchResults();
      if (!r) setResults([]);
      else if (Array.isArray(r)) setResults(r);
      else if (r.results && Array.isArray(r.results)) setResults(r.results);
      else if (r.voteRecord && Array.isArray(r.voteRecord)) setResults(r.voteRecord);
      else setResults(r || []);
    } catch (err) {
      console.error("Load error:", err);
      setError("Failed to load data from server");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.party.trim()) {
      setError("Name and Party are required");
      return;
    }

    setAdding(true);
    try {
      const payload = {
        name: form.name.trim(),
        party: form.party.trim(),
        age: form.age ? Number(form.age) : undefined,
        imageUrl: form.imageUrl ? form.imageUrl.trim() : undefined,
      };

      const res = await addCandidate(payload);

      if ((res && res.success) || (res && res.response) || (res && res._id) || (res && res.name)) {
        setForm({ name: "", party: "", age: "", imageUrl: "" });
        await loadAll();
      } else {
        const msg = (res && (res.error || res.message)) || "Add candidate failed";
        throw new Error(msg);
      }
    } catch (err) {
      console.error("Add candidate error:", err);
      setError(err.message || "Network error");
    } finally {
      setAdding(false);
    }
  }

  const sortedResults = (results || []).slice().sort((a, b) => {
    const va = a.votes ?? a.voteCount ?? a.count ?? 0;
    const vb = b.votes ?? b.voteCount ?? b.count ?? 0;
    return vb - va;
  });

  const totalVotes = sortedResults.reduce((s, r) => s + (r.votes ?? r.voteCount ?? r.count ?? 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Admin Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Manage candidates and review voting results</p>
          </div>

          <div className="flex gap-3 items-center">
            <div className="bg-white shadow rounded-xl px-4 py-3 text-center">
              <div className="text-lg font-bold text-indigo-600">{candidates.length}</div>
              <div className="text-xs text-slate-500">Candidates</div>
            </div>
            <div className="bg-white shadow rounded-xl px-4 py-3 text-center">
              <div className="text-lg font-bold text-indigo-600">{totalVotes}</div>
              <div className="text-xs text-slate-500">Total Votes</div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-6">
          {/* Add candidate card */}
          <section className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-lg font-semibold mb-3">Add Candidate</h2>

            <form onSubmit={handleAdd} className="space-y-3">
              <input
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Party"
                value={form.party}
                onChange={(e) => setForm({ ...form, party: e.target.value })}
                required
              />

              <div className="flex gap-2">
                <input
                  className="w-28 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Age"
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                />
                <input
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Image URL"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={adding}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 disabled:opacity-60"
                >
                  {adding ? "Adding..." : "Add Candidate"}
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ name: "", party: "", age: "", imageUrl: "" })}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Reset
                </button>
              </div>

              {error && <div className="text-sm text-red-600 font-medium mt-2">{error}</div>}
            </form>
          </section>

          {/* Right column: candidates + results */}
          <div className="space-y-6">
            {/* Candidates */}
            <section className="bg-white rounded-2xl shadow p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">All Candidates</h2>
                <div className="text-sm text-slate-500">{loading ? "Refreshing..." : `${candidates.length} total`}</div>
              </div>

              {loading && <div className="text-sm text-slate-500">Loading candidates…</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {!loading && candidates.length === 0 && <div className="text-sm text-slate-500">No candidates yet.</div>}

                {!loading &&
                  candidates.map((c) => (
                    <article
                      key={c._id || c.name}
                      className="rounded-lg overflow-hidden border border-slate-100 bg-white shadow-sm transform hover:-translate-y-1 transition"
                    >
                      <div className="h-60 w-full bg-slate-100">
                        <img
                          src={c.imageUrl || c.image || "https://via.placeholder.com/600x360?text=No+Image"}
                          alt={c.name}
                          className="w-full h-60 object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-slate-800">{c.name}</div>
                          <div className="text-sm text-slate-500">{c.age || "-"}</div>
                        </div>
                        <div className="text-sm text-slate-500 mt-1">{c.party}</div>
                        <div className="mt-3 font-bold text-indigo-600">{c.voteCount || c.votes || 0} votes</div>
                      </div>
                    </article>
                  ))}
              </div>
            </section>

            {/* Results */}
            <section className="bg-white rounded-2xl shadow p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Results (sorted)</h2>
                <div className="text-sm text-slate-500">{sortedResults.length} rows</div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[640px] w-full table-auto text-sm">
                  <thead>
                    <tr className="text-left text-slate-500">
                      <th className="px-4 py-3">Candidate</th>
                      <th className="px-4 py-3">Party</th>
                      <th className="px-4 py-3 text-center">Votes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedResults && sortedResults.length > 0 ? (
                      sortedResults.map((r, idx) => {
                        const name = r.name || r.candidateName || "";
                        const party = r.party || r.partyName || "";
                        const votes = r.votes ?? r.voteCount ?? r.count ?? 0;
                        return (
                          <tr key={idx} className="odd:bg-slate-50">
                            <td className="px-4 py-3 font-medium">{name}</td>
                            <td className="px-4 py-3 text-slate-600">{party}</td>
                            <td className="px-4 py-3 text-center font-extrabold text-indigo-600">{votes}</td>
                          </tr>
                        );
                      })
                    ) : candidates && candidates.length > 0 ? (
                      candidates.map((c) => (
                        <tr key={c._id || c.name} className="odd:bg-slate-50">
                          <td className="px-4 py-3 font-medium">{c.name}</td>
                          <td className="px-4 py-3 text-slate-600">{c.party}</td>
                          <td className="px-4 py-3 text-center font-extrabold text-indigo-600">{c.voteCount || c.votes || 0}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-slate-500 text-center">
                          No results yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
