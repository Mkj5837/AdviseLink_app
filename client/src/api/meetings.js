import api from "./axios";

export const fetchMeetingsApi = (params) =>
  api.get("/meetings", { params });

export default { fetchMeetingsApi };
