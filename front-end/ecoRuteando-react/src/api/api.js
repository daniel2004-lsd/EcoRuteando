import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:7076/api", // Cambia al puerto de tu API
    headers: {
        "Content-Type": "application/json"
    }
});

// Antes de cada petición agrega el Access Token
api.interceptors.request.use((config) => {

    const token = localStorage.getItem("accessToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;