import api from "./api";

export const getReviews = async (hostelId) => {
    const res = await api.get(`/reviews/${hostelId}`);
    return res.data;
};

export const getFeaturedReviews = async () => {
    const res = await api.get("/reviews/featured");
    return res.data;
};

export const addReview = async (
    userId,
    hostelId,
    rating,
    comment
) => {
    const res = await api.post(
        `/reviews/?user_id=${userId}&hostel_id=${hostelId}&rating=${rating}&comment=${encodeURIComponent(comment)}`
    );

    return res.data;
};

export const deleteReview = async (reviewId) => {
    const res = await api.delete(`/reviews/${reviewId}`);
    return res.data;
};