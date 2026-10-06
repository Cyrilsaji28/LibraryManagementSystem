import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5281/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("library_auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response, // If the request succeeds, do nothing
  (error) => {
    if (error.response && error.response.status === 401) {
      // 1. Clear saved credentials
      localStorage.removeItem("library_auth_token");
      localStorage.removeItem("library_auth_user");
      // 2. Redirect to login page if not already there
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login?sessionExpired=true";
      }
    }
    return Promise.reject(error);
  }
);
export default apiClient;