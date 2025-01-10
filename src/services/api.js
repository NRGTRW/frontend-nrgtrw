import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8088/api", // Replace with your production URL later
});

export default api;
