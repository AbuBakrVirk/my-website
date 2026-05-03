/**
 * Central API client.
 * - Development: BASE_URL="" → requests go to /api/... → Vite proxies to localhost:5000
 * - Production:  BASE_URL="https://motorly.up.railway.app" → requests go to full URL
 */

const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api$/, "")
  : "";

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
  } catch (err) {
    const isDev = import.meta.env.DEV;
    throw new Error(
      isDev
        ? "Cannot connect to the server. Make sure the backend is running:\n  cd backend && npm run dev"
        : "Service temporarily unavailable. Please try again in a moment."
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
    const msg = data.errors?.[0]?.msg || data.message || `Server error (${res.status}). Please try again.`;
    throw new Error(msg);
  }

  return data;
};

/* ── Auth ── */
export const authAPI = {
  register: (body)            => request("/api/auth/register",       { method: "POST", body: JSON.stringify(body) }),
  login:    (body)            => request("/api/auth/login",          { method: "POST", body: JSON.stringify(body) }),
  me:       ()                => request("/api/auth/me"),
  forgotPassword: (email)     => request("/api/auth/forgot-password",{ method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (token, pwd) => request("/api/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password: pwd }) }),
};

/* ── Orders ── */
export const ordersAPI = {
  getProducts: ()     => request("/api/orders/products"),
  placeOrder:  (body) => request("/api/orders",     { method: "POST", body: JSON.stringify(body) }),
  getMyOrders: ()     => request("/api/orders"),
  getOrder:    (id)   => request(`/api/orders/${id}`),
};

/* ── Subscribe ── */
export const subscribeAPI = {
  subscribe: (email) => request("/api/subscribe", { method: "POST", body: JSON.stringify({ email }) }),
};

/* ── Contact ── */
export const contactAPI = {
  send: (body) => request("/api/contact", { method: "POST", body: JSON.stringify(body) }),
};
