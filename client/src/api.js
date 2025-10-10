// client/src/api.js
const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    credentials: "same-origin",
    ...options,
  });

  const text = await res.text().catch(() => "");
  const data = text ? JSON.parse(text) : {};
  if (!res.ok)
    throw new Error(data.error || data.message || res.statusText || "Network error");
  return data;
}

// ✅ fixed endpoints with `/api` prefix

export const register = (userData) =>
  request("/api/user/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const login = (credentials) =>
  request("/api/user/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const getProfile = () => request("/api/user/profile");

export const fetchCandidates = () => request("/api/candidate");

export const addCandidate = (candidate) =>
  request("/api/candidate", {
    method: "POST",
    body: JSON.stringify(candidate),
  });

export const submitVote = (candidateId) =>
  request(`/api/candidate/vote/${candidateId}`, { method: "POST" });

export const fetchResults = () => request("/api/candidate/results");
