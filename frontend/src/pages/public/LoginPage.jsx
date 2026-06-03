import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { authAPI } from '../../api/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './LoginPage.css';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [clave, setClave] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.login(email, clave);
            const tipo = response.tipo?.replace('ROLE_', '').trim().toUpperCase();
            login(response.email, tipo, response.token);

            const path = {
                'ADMIN': '/admin/dashboard',
                'EMPRESA': '/empresa/dashboard',
                'OFERENTE': '/oferente/dashboard',
            }[tipo];

            if (!path) {
                throw new Error('Tipo de usuario no reconocido');
            }

            navigate(path, { replace: true });
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <Navbar />

            <main className="login-main">
                <div className="login-container">
                    <h2>Iniciar Sesión</h2>
                    <p className="login-subtitle">Accede a tu cuenta para continuar</p>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label>Correo Electrónico:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="ejemplo@correo.com"
                            />
                        </div>

                        <div className="form-group">
                            <label>Contraseña:</label>
                            <input
                                type="password"
                                value={clave}
                                onChange={(e) => setClave(e.target.value)}
                                required
                                placeholder="Ingresa tu contraseña"
                                minLength="6"
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>¿No tienes cuenta?</p>
                        <button
                            onClick={() => navigate('/registro/empresa')}
                            className="link-btn"
                        >
                            Registrarse como Empresa
                        </button>
                        <button
                            onClick={() => navigate('/registro/oferente')}
                            className="link-btn"
                        >
                            Registrarse como Oferente
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
