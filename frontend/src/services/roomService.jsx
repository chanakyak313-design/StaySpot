import api from "./api";

export const createRoom = async (room) => {
    const res = await api.post("/rooms/", room);
    return res.data;
};

export const getRooms = async (hostelId) => {
    const res = await api.get(`/rooms/hostel/${hostelId}`);
    return res.data;
};

export const deleteRoom = async (id) => {
    await api.delete(`/rooms/${id}`);
};
