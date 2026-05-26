import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { oferenteAPI } from '../../api/oferente';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './OferenteDashboard.css';

export default function OferenteDashboard() {
    const navigate = useNavigate();
    const [perfil, setPerfil] = useState(null);
    const [puestosRecientes, setPuestosRecientes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const [perfilData, puestosData] = await Promise.all([
                    oferenteAPI.getPerfil(),
                    oferenteAPI.getPuestosRecientes(),
                ]);

                if (mounted) {
                    setPerfil(perfilData);
                    setPuestosRecientes(Array.isArray(puestosData) ? puestosData : []);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="oferente-wrapper">
            <Navbar />

            <main className="oferente-content">
                <h1>Dashboard Oferente</h1>
                <p className="subtitle">Gestiona tu perfil y candidaturas</p>

                {loading ? (
                    <div className="loading">Cargando datos...</div>
                ) : (
                    <>
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
                                <p>{perfil?.curriculoPath ? 'CV subido ✓' : 'Sube tu CV en PDF'}</p>
                                <button
                                    className="btn-primary"
                                    onClick={() => navigate('/oferente/cv')}
                                >
                                    Ir a CV
                                </button>
                            </div>
                        </div>

                        {perfil ? (
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
                        ) : (
                            <div className="empty-state">
                                <p>Error cargando el perfil</p>
                            </div>
                        )}

                        <section className="puestos-privados-section">
                            <div className="section-header">
                                <h2>Ultimos puestos disponibles</h2>
                                <p>Oportunidades publicas y privadas recientes disponibles para oferentes registrados.</p>
                            </div>

                            {puestosRecientes.length > 0 ? (
                                <div className="puestos-privados-grid">
                                    {puestosRecientes.map((puesto) => (
                                        <article className="puesto-privado-card" key={puesto.id}>
                                            <div className="puesto-privado-header">
                                                <h3>{puesto.empresa || 'Empresa'}</h3>
                                                <span className={puesto.tipoPublicacion === 'PRIVADA' ? 'badge-private' : 'badge-publica'}>
                                                    {puesto.tipoPublicacion === 'PRIVADA' ? 'Privada' : 'Publica'}
                                                </span>
                                            </div>
                                            <p className="puesto-descripcion">{puesto.descripcion}</p>
                                            <div className="puesto-meta">
                                                <span>{puesto.moneda} {puesto.salarioOfrecido}</span>
                                                {puesto.fechaPublicacion && (
                                                    <span>{new Date(puesto.fechaPublicacion).toLocaleDateString()}</span>
                                                )}
                                            </div>
                                            {puesto.caracteristicas?.length > 0 && (
                                                <ul className="puesto-caracteristicas">
                                                    {puesto.caracteristicas.map((car) => (
                                                        <li key={`${puesto.id}-${car.id}`}>
                                                            {car.nombre} - Nivel {car.nivelDeseado}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <p>No hay puestos recientes disponibles.</p>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
