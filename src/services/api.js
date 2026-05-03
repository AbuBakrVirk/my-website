/**
 * Central API client.
 * In development, Vite proxies /api → http://localhost:5000/api
 * so we use a relative path. In production set VITE_API_URL.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const getToken = () => localStorage.getItem("motorly_token");

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let res;
  try {
    res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  } catch {
    throw new Error(
      "Cannot connect to the server. Make sure the backend is running:\n  cd server && npm run dev"
    );
  }

  // Guard: only parse JSON if there's actually a body
  const contentType = res.headers.get("content-type") || "";
  let data = {};
  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      throw new Error("Server returned an invalid response. Please try again.");
    }
  } else if (!res.ok) {
    // Non-JSON error (e.g. rate limiter plain-text, HTML error page)
    let text = "";
    try { text = await res.text(); } catch { /* ignore */ }
    if (res.status === 429) throw new Error("Too many attempts. Please wait a few minutes and try again.");
    throw new Error(text || `Server error (${res.status}). Please try again.`);
  }

  if (!res.ok) {
    const msg = data.errors?.[0]?.msg || data.message || "Something went wrong. Please try again.";
    throw new Error(msg);
  }

  return data;
};

/* ── Auth ── */
export const authAPI = {
  register: (body)            => request("/auth/register",       { method: "POST", body: JSON.stringify(body) }),
  login:    (body)            => request("/auth/login",          { method: "POST", body: JSON.stringify(body) }),
  me:       ()                => request("/auth/me"),
  forgotPassword: (email)     => request("/auth/forgot-password",{ method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (token, pwd) => request("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password: pwd }) }),
};

/* ── Orders ── */
export const ordersAPI = {
  getProducts: ()     => request("/orders/products"),
  placeOrder:  (body) => request("/orders",     { method: "POST", body: JSON.stringify(body) }),
  getMyOrders: ()     => request("/orders"),
  getOrder:    (id)   => request(`/orders/${id}`),
};

/* ── Subscribe ── */
export const subscribeAPI = {
  subscribe: (email) => request("/subscribe", { method: "POST", body: JSON.stringify({ email }) }),
};
