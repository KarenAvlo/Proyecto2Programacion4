import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Restaurar sesión desde localStorage
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');
        const email = localStorage.getItem('email');

        if (token && userType && email) {
            setUser({ email, tipo: userType, token });
        }
        setLoading(false);
    }, []);

    const login = (email, tipo, token) => {
        const userData = { email, tipo, token };
        localStorage.setItem('token', token);
        localStorage.setItem('userType', tipo);
        localStorage.setItem('email', email);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('email');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}