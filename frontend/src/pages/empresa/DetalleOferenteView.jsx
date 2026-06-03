import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { empresaAPI } from '../../api/empresa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './DetalleOferenteView.css';

export default function DetalleOferenteView() {
    const { puestoId, cedula } = useParams();
    const [oferente, setOferente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarDetalle = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await empresaAPI.getDetalleCandidato(cedula);
                setOferente(data);
            } catch (err) {
                console.error('Error cargando detalle del oferente:', err);
                setError('No se pudo cargar el perfil del oferente.');
            } finally {
                setLoading(false);
            }
        };

        if (cedula) {
            cargarDetalle();
        }
    }, [cedula]);

    const handleAbrirCV = async () => {
        try {
            const token = sessionStorage.getItem('token') || localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
            const response = await fetch(`${apiUrl}/empresa/candidatos/${cedula}/cv`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (!response.ok) {
                throw new Error('No se pudo abrir el CV');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank', 'noopener,noreferrer');
        } catch (err) {
            console.error('Error abriendo CV:', err);
            alert('No se pudo abrir el CV del oferente.');
        }
    };

    return (
        <div className="detalle-oferente-page">
            <div className="detalle-wrapper">
                <Navbar />

                <main className="detalle-content">
                    <div className="detalle-header">
                        <h1>Detalle de Oferente</h1>
                        <Link to={`/empresa/puestos/${puestoId}/match`} className="btn-back">
                            &larr; Volver a la lista de candidatos
                        </Link>
                    </div>

                    {loading ? (
                        <div className="loading-box">Cargando perfil del oferente...</div>
                    ) : error ? (
                        <div className="no-data-box">{error}</div>
                    ) : (
                        <section className="perfil-card">
                            <div className="perfil-header">
                                <h2>{oferente.nombre} {oferente.apellido}</h2>
                                <span className="badge">Candidato seleccionado</span>
                            </div>

                            <div className="perfil-body">
                                <div>
                                    <p><strong>Cedula:</strong> {oferente.cedula}</p>
                                    <p><strong>Nacionalidad:</strong> {oferente.nacionalidad || 'No indicada'}</p>
                                    <p><strong>Correo:</strong> {oferente.email}</p>
                                </div>

                                <div>
                                    <p><strong>Telefono:</strong> {oferente.telefono || 'No indicado'}</p>
                                    <p><strong>Residencia:</strong> {oferente.residencia || 'No indicada'}</p>
                                </div>
                            </div>

                            <div className="habilidades-section">
                                <h3>Habilidades</h3>
                                {oferente.habilidades?.length > 0 ? (
                                    <div className="skills-grid">
                                        {oferente.habilidades.map((habilidad, index) => (
                                            <div key={`${habilidad.caracteristicaNombre}-${index}`} className="skill-item">
                                                <span>{habilidad.caracteristicaNombre}</span>
                                                <strong>Nivel {habilidad.nivel}</strong>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="muted">Este oferente no tiene habilidades registradas.</p>
                                )}
                            </div>

                            <div className="cv-section">
                                <h3>Curriculum Vitae</h3>
                                {oferente.tieneCV ? (
                                    <>
                                        <p>El candidato ha subido un documento profesional en formato PDF.</p>
                                        <button type="button" className="btn-pdf" onClick={handleAbrirCV}>
                                            Abrir PDF
                                        </button>
                                    </>
                                ) : (
                                    <p className="muted">Este candidato aun no ha adjuntado su curriculum PDF.</p>
                                )}
                            </div>
                        </section>
                    )}
                </main>

                <Footer />
            </div>
        </div>
    );
}
