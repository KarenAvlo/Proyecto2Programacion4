import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../api/admin';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [empresasPendientes, setEmpresasPendientes] = useState(0);
    const [oferentesPendientes, setOferentesPendientes] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [empresas, oferentes] = await Promise.all([
                adminAPI.getEmpresasPendientes(),
                adminAPI.getOferentesPendientes(),
            ]);
            setEmpresasPendientes(empresas.length);
            setOferentesPendientes(oferentes.length);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-wrapper">
            <Navbar />

            <main className="admin-content">
                <h1>Dashboard Administrador</h1>
                <p className="subtitle">Gestiona las aprobaciones y características del sistema</p>

                {loading ? (
                    <div className="loading">Cargando datos...</div>
                ) : (
                    <div className="dashboard-grid">
                        <div className="dashboard-card">
                            <div className="card-icon">👥</div>
                            <h3>Empresas Pendientes</h3>
                            <p className="card-number">{empresasPendientes}</p>
                            <button
                                className="card-button"
                                onClick={() => navigate('/admin/empresas')}
                            >
                                Ver Detalles
                            </button>
                        </div>

                        <div className="dashboard-card">
                            <div className="card-icon">💼</div>
                            <h3>Oferentes Pendientes</h3>
                            <p className="card-number">{oferentesPendientes}</p>
                            <button
                                className="card-button"
                                onClick={() => navigate('/admin/oferentes')}
                            >
                                Ver Detalles
                            </button>
                        </div>

                        <div className="dashboard-card">
                            <div className="card-icon">⚙️</div>
                            <h3>Gestionar Características</h3>
                            <p className="card-desc">Crea y organiza las características del sistema</p>
                            <button
                                className="card-button"
                                onClick={() => navigate('/admin/caracteristicas')}
                            >
                                Ir a Características
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}