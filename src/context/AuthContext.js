import { createContext, useContext, useState } from "react";

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuthContext = () => {
    return useContext(AuthContext);
};

// AuthProvider component that provides the context
export const AuthProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(true); // State to track if the user is admin

    return (
        <AuthContext.Provider value={{ isAdmin, setIsAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};
