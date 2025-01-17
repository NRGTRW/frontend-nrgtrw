import axios from "axios";
const baseURL = process.env.BASE_URL
const api = axios.create({
  baseURL // Update for production
});
export default api;

