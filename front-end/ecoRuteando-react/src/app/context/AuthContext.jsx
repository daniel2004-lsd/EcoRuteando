import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("accessToken")
    );

    const [refreshToken, setRefreshToken] = useState(
        localStorage.getItem("refreshToken")
    );

    const saveTokens = (access, refresh) => {

        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);

        setAccessToken(access);
        setRefreshToken(refresh);
    };

    const logout = () => {

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setAccessToken(null);
        setRefreshToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
                saveTokens,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);