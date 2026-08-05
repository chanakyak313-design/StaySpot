import api from "./api";

export const addFavorite = async (userId, hostelId) => {
    const res = await api.post(
        `/favorites/?user_id=${userId}&hostel_id=${hostelId}`
    );
    return res.data;
};

export const getFavorites = async (userId) => {
    const res = await api.get(`/favorites/${userId}`);
    return res.data;
};

export const removeFavorite = async (favoriteId) => {
    const res = await api.delete(`/favorites/${favoriteId}`);
    return res.data;
};