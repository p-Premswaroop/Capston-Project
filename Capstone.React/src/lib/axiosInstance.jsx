import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/ITSRPAPI/` || "https://localhost:5193/api/ITSRPAPI/",  ///to map url to backend url
    headers: {
        "Content-Type": "application/json"
    }
});

// Add JWT token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;