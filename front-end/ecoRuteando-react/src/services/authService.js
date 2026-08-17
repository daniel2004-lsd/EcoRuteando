import api from "../api/api";

export const login = async (email, password) => {
    const response = await api.post("/auth/login", {
        email,
        password
    });

    return response.data;
};

export const register = async (user) => {
    const response = await api.post("/auth/register", user);

    return response.data;
};

export const refresh = async (refreshToken) => {
    const response = await api.post("/auth/refresh", {
        refreshToken
    });

    return response.data;
};

export const logout = async (refreshToken) => {
    const response = await api.post("/auth/logout", {
        refreshToken
    });

    return response.data;
};

export const me = async () => {
    const response = await api.get("/auth/me");

    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password", {
        email
    });

    return response.data;
};

export const resetPassword = async (token, newPassword) => {
    const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
        usageIp: null
    })
};
