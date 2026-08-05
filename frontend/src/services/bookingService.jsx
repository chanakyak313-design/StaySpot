import api from "./api";

export const createBooking = async (booking) => {
    const res = await api.post("/bookings/", booking);
    return res.data;
};

export const getMyBookings = async () => {
    const res = await api.get("/bookings/my");
    return res.data;
};

export const cancelBooking = async (bookingId) => {
    const res = await api.delete(`/bookings/${bookingId}`);
    return res.data;
};

export const getUserBookings = async (userId) => {
    const res = await api.get(`/bookings/user/${userId}`);
    return res.data;
};

export const downloadReceipt = async (bookingId) => {
    const res = await api.get(`/bookings/${bookingId}/receipt`, {
        responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `StaySpot_Receipt_${bookingId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};
