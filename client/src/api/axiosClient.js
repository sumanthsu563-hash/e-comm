import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // For sending and receiving cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Attach the in-memory access token if present
axiosClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Transparent 401 refresh token handling
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't loop refresh on auth routes like login or register
      if (
        originalRequest.url.includes('/auth/login') ||
        originalRequest.url.includes('/auth/register') ||
        originalRequest.url.includes('/auth/refresh-token')
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.data?.accessToken;
        if (newAccessToken) {
          setAccessToken(newAccessToken);
          axiosClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAccessToken();
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
