import api from "./axios";

export const postCheckIn = (payload) => api.post("/checkin", payload);

export default { postCheckIn };
