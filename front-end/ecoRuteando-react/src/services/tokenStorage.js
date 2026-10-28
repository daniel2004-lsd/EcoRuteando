/**
 * In-memory token storage (H-40 remediation).
 * Prevents tokens from being accessed via XSS by storing access, refresh,
 * and 2FA temporary tokens exclusively in memory rather than in localStorage/sessionStorage.
 */

let inMemoryAccessToken = null;
let inMemoryRefreshToken = null;
let inMemoryTwoFactorToken = null;
let inMemoryTrustedDeviceToken = null;

const subscribers = new Set();

export const tokenStorage = {
    getAccessToken: () => inMemoryAccessToken,
    setAccessToken: (token) => {
        inMemoryAccessToken = token || null;
        notifySubscribers();
    },

    getRefreshToken: () => inMemoryRefreshToken,
    setRefreshToken: (token) => {
        inMemoryRefreshToken = token || null;
        notifySubscribers();
    },

    getTwoFactorToken: () => inMemoryTwoFactorToken,
    setTwoFactorToken: (token) => {
        inMemoryTwoFactorToken = token || null;
    },
    clearTwoFactorToken: () => {
        inMemoryTwoFactorToken = null;
    },

    getTrustedDeviceToken: () => inMemoryTrustedDeviceToken,
    setTrustedDeviceToken: (token) => {
        inMemoryTrustedDeviceToken = token || null;
    },

    setTokens: (accessToken, refreshToken) => {
        inMemoryAccessToken = accessToken || null;
        inMemoryRefreshToken = refreshToken || null;
        notifySubscribers();
    },

    clearTokens: () => {
        inMemoryAccessToken = null;
        inMemoryRefreshToken = null;
        inMemoryTwoFactorToken = null;
        inMemoryTrustedDeviceToken = null;
        purgeLegacyStorage();
        notifySubscribers();
    },

    subscribe: (callback) => {
        subscribers.add(callback);
        return () => subscribers.delete(callback);
    },

    purgeLegacyStorage: () => {
        purgeLegacyStorage();
    }
};

function notifySubscribers() {
    subscribers.forEach((callback) => {
        try {
            callback({
                accessToken: inMemoryAccessToken,
                refreshToken: inMemoryRefreshToken,
            });
        } catch {
            // Prevent subscriber exceptions from breaking caller
        }
    });
}

function purgeLegacyStorage() {
    try {
        if (typeof window !== "undefined") {
            if (window.localStorage) {
                window.localStorage.removeItem("accessToken");
                window.localStorage.removeItem("refreshToken");
                window.localStorage.removeItem("userRole");
                window.localStorage.removeItem("trustedDeviceToken");
            }
            if (window.sessionStorage) {
                window.sessionStorage.removeItem("twoFactorToken");
            }
        }
    } catch {
        // Storage access may throw in sandboxed environments or private browsing
    }
}

// Automatically purge residual tokens from prior versions on load
purgeLegacyStorage();

export default tokenStorage;
