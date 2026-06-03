import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextValue';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Limpiar sesiones viejas que quedaron guardadas permanentemente.
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('email');

        const token = sessionStorage.getItem('token');
        const tipo = sessionStorage.getItem('userType');
        const email = sessionStorage.getItem('email');

        if (token && tipo && email) {
            setUser({ email, tipo, token });
        }

        setLoading(false);
    }, []);

    const login = (email, tipo, token) => {
        const userData = { email, tipo, token };
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userType', tipo);
        sessionStorage.setItem('email', email);
        setUser(userData);
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userType');
        sessionStorage.removeItem('email');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
