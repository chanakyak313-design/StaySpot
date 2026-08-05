import api from "./api";

export const getDashboard = async () => {
    const res = await api.get("/admin/dashboard");
    return res.data;
};

export const getUsers = async () => {
    const res = await api.get("/admin/users");
    return res.data;
};

export const getHostels = async () => {
    const res = await api.get("/admin/hostels");
    return res.data;
};

export const getBookings = async () => {
    const res = await api.get("/admin/bookings");
    return res.data;
};

export const getReviews = async () => {
    const res = await api.get("/admin/reviews");
    return res.data;
};
export const deleteUser = async (id) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
};

export const deleteHostel = async (id) => {
    const res = await api.delete(`/admin/hostels/${id}`);
    return res.data;
};