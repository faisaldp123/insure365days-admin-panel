import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://insure365days-backend.onrender.com/api", // ✅ FIXED
});

// ✅ Attach token correctly
API.interceptors.request.use(
  (req) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    }

    return req;
  },
  (error) => Promise.reject(error)
);

export default API;