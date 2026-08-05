import api from "./api";

export const getProfile = async (id) => {
    const res = await api.get(`/profile/${id}`);
    return res.data;
};

export const updateProfile = async (id, data) => {
    const res = await api.put(`/profile/${id}`, data);
    return res.data;
};