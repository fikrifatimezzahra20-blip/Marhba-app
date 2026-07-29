import axios from "axios";
import { useAuthStore } from "../store/auth.store";

// Determine default backend API URL based on environment/platform
const BASE_URL =
    process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.46:3000/api";

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// Request Interceptor: Attach Access Token directly from Zustand store
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Token Refresh on 401
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/login") &&
            !originalRequest.url?.includes("/auth/register")
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const storedRefreshToken = useAuthStore.getState().refreshToken;

                if (!storedRefreshToken) {
                    throw new Error("No refresh token available");
                }

                const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
                    refreshToken: storedRefreshToken,
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                // Automatically update Zustand store and persisted storage
                useAuthStore.setState({
                    accessToken,
                    refreshToken: newRefreshToken,
                });

                api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                processQueue(null, accessToken);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                useAuthStore.getState().clearAuth();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
