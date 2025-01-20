import React from "react";
import { AuthProvider } from "./AuthContext";
import Navigation from "./Navigation";
import Toast from 'react-native-toast-message';

export default App = () => {
    return (
        <AuthProvider>
            <Navigation />
            <Toast />
        </AuthProvider>
    );
};