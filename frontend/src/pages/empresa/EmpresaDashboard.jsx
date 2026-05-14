import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { empresaAPI } from '../../api/empresa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './EmpresaDashboard.css';

export default function EmpresaDashboard() {
    const navigate = useNavigate();
    const [perfil, setPerfil] = useState(null);
    const [puestos, setPuestos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [perfilData, puestosData] = await Promise.all([
                empresaAPI.getPerfil(),
                empresaAPI.getPuestos(),
            ]);
            setPerfil(perfilData);
            setPuestos(puestosData);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="empresa-wrapper">
            <Navbar />

            <main className="empresa-content">
                <h1>Dashboard Empresa</h1>
                <p className="subtitle">Gestiona tus puestos de trabajo</p>

                {loading ? (
                    <div className="loading">Cargando datos...</div>
                ) : (
                    <>
                        {perfil && (
                            <div className="perfil-card">
                                <h2>Mi Empresa</h2>
                                <div className="perfil-info">
                                    <p><strong>Nombre:</strong> {perfil.nombre}</p>
                                    <p><strong>Email:</strong> {perfil.email}</p>
                                    <p><strong>Teléfono:</strong> {perfil.telefono}</p>
                                    <p><strong>Localización:</strong> {perfil.localizacion}</p>
                                    <p><strong>Descripción:</strong> {perfil.descripcion}</p>
                                </div>
                            </div>
                        )}

                        <div className="puestos-section">
                            <div className="section-header">
                                <h2>Mis Puestos ({puestos.length})</h2>
                                <button
                                    className="btn-primary"
                                    onClick={() => navigate('/empresa/crear-puesto')}
                                >
                                    + Publicar Puesto
                                </button>
                            </div>

                            {puestos.length === 0 ? (
                                <div className="empty-state">
                                    <p>No tienes puestos publicados aún</p>
                                </div>
                            ) : (
                                <div className="puestos-list">
                                    {puestos.map((puesto) => (
                                        <div key={puesto.id} className="puesto-item">
                                            <div className="puesto-info">
                                                <h3>{puesto.descripcion}</h3>
                                                <p>{puesto.moneda} {puesto.salarioOfrecido}</p>
                                                <span className={puesto.activo ? 'badge-activo' : 'badge-inactivo'}>
                          {puesto.activo ? 'Activo' : 'Inactivo'}
                        </span>
                                            </div>
                                            <div className="puesto-actions">
                                                <button
                                                    className="btn-secondary"
                                                    onClick={() => navigate(`/empresa/candidatos/${puesto.id}`)}
                                                >
                                                    Ver Candidatos
                                                </button>
                                                {puesto.activo && (
                                                    <button
                                                        className="btn-danger"
                                                        onClick={() => {
                                                            if (window.confirm('¿Desactivar este puesto?')) {
                                                                empresaAPI.desactivarPuesto(puesto.id).then(() => {
                                                                    fetchData();
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        Desactivar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}