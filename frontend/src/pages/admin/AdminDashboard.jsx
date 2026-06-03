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

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="admin-wrapper">
            <Navbar />

            <main className="admin-content">
                <h1 style={{ textAlign: 'left', fontSize: '2.5rem', marginBottom: 0 }}>
                    Administrador
                </h1>
                <p style={{ textAlign: 'left', color: '#666', marginBottom: '30px' }}>
                    Gestión de aprobaciones y catálogos del sistema.
                </p>

                {loading ? (
                    <div className="loading">Cargando datos...</div>
                ) : (
                    <div className="dashboard-grid">
                        <div className="dashboard-card">
                            <div className="card-icon">EP</div>
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
                            <div className="card-icon">OP</div>
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
                            <div className="card-icon">CAT</div>
                            <h3>Gestionar Características</h3>
                            <p className="card-desc">Crea y organiza las características del sistema</p>
                            <button
                                className="card-button"
                                onClick={() => navigate('/admin/caracteristicas')}
                            >
                                Ir a Características
                            </button>
                        </div>

                        <div className="dashboard-card">
                            <div className="card-icon">PDF</div>
                            <h3>Reportes</h3>
                            <p className="card-desc">Genera reportes PDF y exportaciones de datos</p>
                            <button
                                className="card-button"
                                onClick={() => navigate('/admin/reportes')}
                            >
                                Ver Reportes
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
