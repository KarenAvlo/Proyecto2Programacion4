
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(false);
    }, []);

    const userEmail = user?.email || 'usuario@correo.com';

    return (
        <div className="admin-wrapper">
            <nav className="navbar">
                <div>
                    <a href="/">Bolsa de Empleo</a>
                </div>

                <div>
                    <a href="/admin/dashboard">Dashboard</a>
                    <a href="/admin/empresas">Empresas Pendientes</a>
                    <a href="/admin/oferentes">Oferentes Pendientes</a>
                    <a href="/admin/caracteristicas">Características</a>
                    <a href="/admin/reportes">Reportes</a>

                    <span style={{ color: 'white', textDecoration: 'none' }}>
                        {userEmail}
                    </span>

                    <a href="/logout"
                       style={{
                           color: 'white',
                           textDecoration: 'none',
                           border: '1px solid white',
                           padding: '4px 12px',
                           borderRadius: '4px'
                       }}>
                        Salir
                    </a>
                </div>
            </nav>

            <main className="admin-content">
                <h1 style={{ textAlign: 'left', fontSize: '2.5rem', marginBottom: 0 }}>
                    Administrador
                </h1>
                <p style={{ textAlign: 'left', color: '#666', marginBottom: '30px' }}>
                    Gestión de aprobaciones y catálogos del sistema.
                </p>

                {!loading && (
                    <div className="admin-grid">
                        <a href="/admin/empresas" className="card-admin">
                            Empresas Pendientes
                        </a>
                        <a href="/admin/oferentes" className="card-admin">
                            Oferentes Pendientes
                        </a>
                        <a href="/admin/caracteristicas" className="card-admin">
                            Características
                        </a>
                        <a href="/admin/reportes" className="card-admin">
                            Reportes
                        </a>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}