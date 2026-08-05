import api from "./api";

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
};
