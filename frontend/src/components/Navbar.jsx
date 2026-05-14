import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import './Navbar.css';

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <a onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    Bolsa de Empleo
                </a>
            </div>

            <div className="nav-links">
                {!user ? (
                    <>
                        <a onClick={() => navigate('/')}>Inicio</a>
                        <a onClick={() => navigate('/puestos/buscar')}>Buscar Puestos</a>
                        <a onClick={() => navigate('/registro/empresa')} className="btn-outline">
                            Registro Empresa
                        </a>
                        <a onClick={() => navigate('/registro/oferente')} className="btn-outline">
                            Registro Oferente
                        </a>
                        <a onClick={() => navigate('/login')}>Iniciar Sesión</a>
                    </>
                ) : (
                    <>
                        {user.tipo === 'ADMIN' && (
                            <>
                                <a onClick={() => navigate('/admin/dashboard')}>Dashboard</a>
                                <a onClick={() => navigate('/admin/empresas')}>Empresas Pendientes</a>
                                <a onClick={() => navigate('/admin/oferentes')}>Oferentes Pendientes</a>
                                <a onClick={() => navigate('/admin/caracteristicas')}>Características</a>
                            </>
                        )}
                        {user.tipo === 'EMPRESA' && (
                            <>
                                <a onClick={() => navigate('/empresa/dashboard')}>Dashboard</a>
                                <a onClick={() => navigate('/empresa/puestos')}>Mis Puestos</a>
                                <a onClick={() => navigate('/empresa/crear-puesto')}>Publicar Puesto</a>
                            </>
                        )}
                        {user.tipo === 'OFERENTE' && (
                            <>
                                <a onClick={() => navigate('/oferente/dashboard')}>Dashboard</a>
                                <a onClick={() => navigate('/oferente/habilidades')}>Mis Habilidades</a>
                                <a onClick={() => navigate('/oferente/cv')}>Mi CV</a>
                            </>
                        )}

                        <span className="user-email">{user.email}</span>
                        <a onClick={handleLogout} className="btn-logout">
                            Salir
                        </a>
                    </>
                )}
            </div>
        </nav>
    );
}