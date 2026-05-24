import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // No restaurar sesiones viejas al volver a abrir/correr la app.
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('email');
        setUser(null);
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
