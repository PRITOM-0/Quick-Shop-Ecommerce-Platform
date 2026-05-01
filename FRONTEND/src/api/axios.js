import axios from "axios";

const api = axios.create({
  baseURL: "https://e-commerce-webapp-mern.onrender.com/api",
  // baseURL: "http://localhost:5000/api",
});
export default api;
