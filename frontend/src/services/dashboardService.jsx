import api from "./api";

export const getDashboard = async (ownerId) => {
    const res = await api.get(`/dashboard/${ownerId}`);
    return res.data;
};
