import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as authService from "../../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("accessToken")
    );
    const [refreshToken, setRefreshToken] = useState(
        localStorage.getItem("refreshToken")
    );
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user on mount if token exists
    useEffect(() => {
        const loadUser = async () => {
            if (!accessToken) {
                setLoading(false);
                return;
            }
            try {
                const userData = await authService.me();
                setUser(userData);
            } catch {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                setAccessToken(null);
                setRefreshToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const saveTokens = useCallback((access, refresh) => {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        setAccessToken(access);
        setRefreshToken(refresh);
    }, []);

    const loginUser = useCallback(async (email, password) => {
        const data = await authService.login(email, password);

        // 2FA required
        if (data.requiresTwoFactor) {
            return {
                requiresTwoFactor: true,
                twoFactorToken: data.twoFactorToken,
            };
        }

        saveTokens(data.accessToken, data.refreshToken);

        const userData = await authService.me();
        setUser(userData);

        return data;
    }, [saveTokens]);

    const loginWithOAuth = useCallback(async (provider, token) => {
        const data = await authService.oauthLogin(provider, token);
        saveTokens(data.accessToken, data.refreshToken);

        const userData = await authService.me();
        setUser(userData);

        return data;
    }, [saveTokens]);

    const logout = useCallback(async () => {
        try {
            if (refreshToken) {
                await authService.logout(refreshToken);
            }
        } catch {
            // Ignore logout errors
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
    }, [refreshToken]);

    const isAuthenticated = !!accessToken && !!user;
    const userRole = user?.role?.toLowerCase() || "user";

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
                user,
                loading,
                isAuthenticated,
                userRole,
                saveTokens,
                loginUser,
                loginWithOAuth,
                logout,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
