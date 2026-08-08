import api from "./api";

// The browser's native "storage" event only fires in OTHER tabs, never in
// the tab that actually made the change - so components like the Navbar
// need this instead to know "the user just logged in/out" right here.
const AUTH_CHANGED_EVENT = "stayspot:auth-changed";

export const notifyAuthChanged = () => {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

export const onAuthChanged = (callback) => {
  window.addEventListener(AUTH_CHANGED_EVENT, callback);
  return () => window.removeEventListener(AUTH_CHANGED_EVENT, callback);
};

export const loginUser = async (email, password) => {
  const params = new URLSearchParams();
  params.append("username", email);
  params.append("password", password);

  const res = await api.post("/users/login", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return res.data; // { access_token, token_type }
};

export const registerUser = async (data) => {
  const res = await api.post("/users/register", data);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  localStorage.removeItem("fullName");
  notifyAuthChanged();
};
