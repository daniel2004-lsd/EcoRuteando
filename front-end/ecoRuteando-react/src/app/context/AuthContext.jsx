import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as authService from "../../services/authService";
import tokenStorage from "../../services/tokenStorage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(() => tokenStorage.getAccessToken());
    const [refreshToken, setRefreshToken] = useState(() => tokenStorage.getRefreshToken());
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sync state with in-memory token updates (e.g. from axios interceptor refresh)
    useEffect(() => {
        const unsubscribe = tokenStorage.subscribe(({ accessToken: newAccess, refreshToken: newRefresh }) => {
            setAccessToken(newAccess);
            setRefreshToken(newRefresh);
        });
        return unsubscribe;
    }, []);

    // Restore session on mount via HttpOnly refresh cookie or in-memory token
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                let currentToken = tokenStorage.getAccessToken();
                if (!currentToken) {
                    // Try to restore session via HttpOnly cookie
                    const refreshData = await authService.refresh();
                    if (refreshData?.accessToken) {
                        tokenStorage.setAccessToken(refreshData.accessToken);
                        currentToken = refreshData.accessToken;
                    }
                }

                if (currentToken) {
                    const userData = await authService.me();
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch {
                tokenStorage.clearTokens();
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        initializeAuth();
    }, []);

    const saveTokens = useCallback((access, refresh) => {
        tokenStorage.setTokens(access, refresh);
    }, []);

    const saveTwoFactorToken = useCallback((token) => {
        tokenStorage.setTwoFactorToken(token);
    }, []);

    const clearTwoFactorToken = useCallback(() => {
        tokenStorage.clearTwoFactorToken();
    }, []);

    const loginUser = useCallback(async (email, password) => {
        const data = await authService.login(email, password);

        // 2FA required: store temporary 2FA token strictly in memory, isolated from access token
        if (data.requiresTwoFactor) {
            tokenStorage.setTwoFactorToken(data.twoFactorToken);
            return {
                requiresTwoFactor: true,
                twoFactorToken: data.twoFactorToken,
            };
        }

        // Email verification required — no tokens yet
        if (data.requiresEmailVerification) {
            return {
                requiresEmailVerification: true,
            };
        }

        saveTokens(data.accessToken, data.refreshToken);

        const userData = await authService.me();
        setUser(userData);

        return data;
    }, [saveTokens]);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch {
            // Ignore logout errors
        }
        tokenStorage.clearTokens();
        setUser(null);
    }, []);

    const isAuthenticated = !!accessToken && !!user;
    const isGuest = !accessToken && !user && !loading;
    const userRole = user?.role?.toLowerCase() || "user";

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
                twoFactorToken: tokenStorage.getTwoFactorToken(),
                saveTwoFactorToken,
                clearTwoFactorToken,
                user,
                loading,
                isAuthenticated,
                isGuest,
                userRole,
                saveTokens,
                loginUser,
                logout,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
