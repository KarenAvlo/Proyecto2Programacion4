import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { oferenteAPI } from '../../api/oferente';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './OferenteDashboard.css';

export default function OferenteDashboard() {
    const navigate = useNavigate();
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPerfil();
    }, []);

    const fetchPerfil = async () => {
        try {
            const data = await oferenteAPI.getPerfil();
            setPerfil(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="oferente-wrapper">
            <Navbar />

            <main className="oferente-content">
                <h1>Dashboard Oferente</h1>
                <p className="subtitle">Gestiona tu perfil y candidaturas</p>

                {loading ? (
                    <div className="loading">Cargando datos...</div>
                ) : perfil ? (
                    <>
                        <div className="perfil-card">
                            <h2>Mi Perfil</h2>
                            <div className="perfil-info">
                                <p><strong>Nombre:</strong> {perfil.nombre} {perfil.apellido}</p>
                                <p><strong>Cédula:</strong> {perfil.cedula}</p>
                                <p><strong>Email:</strong> {perfil.email}</p>
                                <p><strong>Teléfono:</strong> {perfil.telefono}</p>
                                <p><strong>Nacionalidad:</strong> {perfil.nacionalidad}</p>
                                <p><strong>Residencia:</strong> {perfil.residencia}</p>
                            </div>
                        </div>

                        <div className="acciones-grid">
                            <div className="accion-card">
                                <div className="accion-icon">🎓</div>
                                <h3>Mis Habilidades</h3>
                                <p>Registra y actualiza tus habilidades técnicas</p>
                                <button
                                    className="btn-primary"
                                    onClick={() => navigate('/oferente/habilidades')}
                                >
                                    Ir a Habilidades
                                </button>
                            </div>

                            <div className="accion-card">
                                <div className="accion-icon">📄</div>
                                <h3>Mi Currículum</h3>
                                <p>{perfil.curriculoPath ? 'CV subido ✓' : 'Sube tu CV en PDF'}</p>
                                <button
                                    className="btn-primary"
                                    onClick={() => navigate('/oferente/cv')}
                                >
                                    Ir a CV
                                </button>
                            </div>

                            <div className="accion-card">
                                <div className="accion-icon">💼</div>
                                <h3>Buscar Puestos</h3>
                                <p>Encuentra empleos que coincidan con tus habilidades</p>
                                <button
                                    className="btn-primary"
                                    onClick={() => navigate('/puestos/buscar')}
                                >
                                    Buscar Puestos
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="empty-state">
                        <p>Error cargando el perfil</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}