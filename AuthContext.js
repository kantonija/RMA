import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    const login = (user, name) => {
        setUser({ ...user, name });
        setIsLoggedIn(true);
    }
    
    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{login, logout, user, isLoggedIn}}>
            {children}
        </AuthContext.Provider>
    )
};