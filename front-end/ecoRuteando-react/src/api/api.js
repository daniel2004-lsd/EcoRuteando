import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json"
    }
});

// Request interceptor — attach Access Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor — auto refresh on 401
let isRefreshing = false;
let failedQueue = [];

// Endpoints públicos de autenticación: un 401 aquí es una validación normal
// (p.ej. "correo o contraseña incorrectos"), NO una sesión expirada. No deben
// disparar el refresh automático ni la redirección, para que el componente
// pueda mostrar el mensaje de error al usuario.
const AUTH_PUBLIC_URLS = [
    "/auth/login",
    "/auth/register",
    "/auth/refresh",
    "/auth/recover",
    "/auth/reset-password",
    "/auth/send-verification",
];

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

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Salta el manejo de sesión para endpoints públicos de auth: se deja pasar
        // el 401 tal cual para que la UI muestre el error.
        if (originalRequest?.url && AUTH_PUBLIC_URLS.some((u) => originalRequest.url.includes(u))) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
                // Sin sesión: /auth/me falla en silencio (modo invitado)
                if (originalRequest.url === "/auth/me") {
                    return Promise.reject(error);
                }
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post("/api/auth/refresh", {
                    refreshToken,
                });

                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);

                processQueue(null, data.accessToken);

                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
