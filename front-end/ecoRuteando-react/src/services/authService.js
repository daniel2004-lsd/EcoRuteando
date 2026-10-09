import api from "../api/api";

// ── Auth ────────────────────────────────────────────────────────

export const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
};

export const register = async (user) => {
    const response = await api.post("/auth/register", user);
    return response.data;
};

export const refresh = async (refreshToken) => {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
};

export const logout = async (refreshToken) => {
    const response = await api.post("/auth/logout", { refreshToken });
    return response.data;
};

export const me = async () => {
    const response = await api.get("/auth/me");
    return response.data;
};

// ── Password Recovery ──────────────────────────────────────────

export const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
};

export const resetPassword = async (token, newPassword) => {
    const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
    });
    return response.data;
};

// ── Email Verification ─────────────────────────────────────────

export const sendVerificationEmail = async (email) => {
    const response = await api.post("/auth/send-verification", { email });
    return response.data;
};

export const verifyEmail = async (code) => {
    const response = await api.post("/auth/verify-email", { code });
    return response.data;
};

// ── OAuth ──────────────────────────────────────────────────────

export const oauthLogin = async (provider, accessToken) => {
    const response = await api.post("/auth/oauth/login", {
        provider,
        accessToken,
    });
    return response.data;
};

// ── Two-Factor Authentication ──────────────────────────────────

export const enable2FA = async () => {
    const response = await api.post("/auth/2fa/enable");
    return response.data;
};

export const verify2FA = async (code) => {
    const response = await api.post("/auth/2fa/verify", { code });
    return response.data;
};

export const disable2FA = async (code) => {
    const response = await api.post("/auth/2fa/disable", { code });
    return response.data;
};

// ── Sessions ───────────────────────────────────────────────────

export const getSessions = async () => {
    const response = await api.get("/auth/sessions");
    return response.data;
};

export const revokeSession = async (sessionId) => {
    const response = await api.delete(`/auth/sessions/${sessionId}`);
    return response.data;
};

export const revokeAllSessions = async () => {
    const response = await api.delete("/auth/sessions");
    return response.data;
};
