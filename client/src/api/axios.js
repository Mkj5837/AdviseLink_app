import axios from "axios";

const api = axios.create({
  // This points React to your Express server
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

export default api;
