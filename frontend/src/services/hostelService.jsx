import api from "./api";

export const getAllHostels = async (params = {}) => {
  const response = await api.get("/hostels/", {
    params,
  });

  return response.data;
};

export const getHostelById = async (id) => {
  const response = await api.get(`/hostels/${id}`);

  return response.data;
};

export const searchHostels = async (params) => {
  const response = await api.get("/hostels/search", {
    params,
  });

  return response.data;
};

export const deleteHostel = async (id) => {
  const response = await api.delete(`/hostels/${id}`);
  return response.data;
};