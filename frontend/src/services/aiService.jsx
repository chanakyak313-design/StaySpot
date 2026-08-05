import api from "./api";

export const recommend = async (query) => {
    const res = await api.post("/ai/recommend", {
        query,
    });

    return res.data;
};