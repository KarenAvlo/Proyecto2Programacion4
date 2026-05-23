import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { oferenteAPI } from '../../api/oferente';
import './CVform.css';

export default function OferenteCV() {
    const [perfil, setPerfil] = useState(null);
    const [curriculoPath, setCurriculoPath] = useState(null);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subiendo, setSubiendo] = useState(false);
    const [mensajeExito, setMensajeExito] = useState(null);
    const [mensajeError, setMensajeError] = useState(null);

    const cargarPerfil = useCallback(async () => {
        setLoading(true);
        setMensajeError(null);
        try {
            const data = await oferenteAPI.getPerfil();
            setPerfil(data);
            setCurriculoPath(data.curriculoPath || null);
        } catch (error) {
            console.error('Error al verificar el estado del CV:', error);
            setMensajeError('No se pudo conectar con el servidor para verificar tu currículum.');
            setPerfil(null);
            setCurriculoPath(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarPerfil();
    }, [cargarPerfil]);

    const handleFileChange = (e) => {
        setArchivoSeleccionado(e.target.files?.[0] || null);
        setMensajeError(null);
        setMensajeExito(null);
    };

    const handleVerCVActual = async () => {
        if (!perfil?.cedula || !curriculoPath) {
            setMensajeError('No tienes un currículum cargado actualmente.');
            return;
        }

        try {
            setMensajeError(null);
            const blob = await oferenteAPI.obtenerCVBlob(perfil.cedula);
            const url = window.URL.createObjectURL(blob);
            const newWindow = window.open(url, '_blank', 'noopener,noreferrer');

            if (!newWindow) {
                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.click();
            }

            setTimeout(() => window.URL.revokeObjectURL(url), 10000);
        } catch (error) {
            console.error('Error al abrir el CV:', error);
            setMensajeError('No se pudo abrir el PDF del currículum.');
        }
    };

    const handleSubirCV = async (e) => {
        e.preventDefault();

        if (!archivoSeleccionado) {
            setMensajeError('Por favor, selecciona un archivo PDF válido.');
            return;
        }

        setMensajeError(null);
        setMensajeExito(null);

        try {
            setSubiendo(true);
            const response = await oferenteAPI.subirCV(archivoSeleccionado);

            await cargarPerfil();
            setArchivoSeleccionado(null);
            setMensajeExito(response?.mensaje || '¡Tu currículum se ha subido y reemplazado correctamente!');
        } catch (error) {
            console.error('Error en la subida del documento:', error);
            setMensajeError('Ocurrió un error al subir el PDF o el archivo no es válido.');
        } finally {
            setSubiendo(false);
        }
    };

    return (
        <div className="page-cv-container">
            <div className="admin-wrapper">
                <Navbar />

                <main className="oferente-cv-content">
                    <div className="cv-card-wrapper">
                        {mensajeExito && <div className="alert-cv alert-success-cv">{mensajeExito}</div>}
                        {mensajeError && <div className="alert-cv alert-error-cv">{mensajeError}</div>}

                        <h2>Gestión de Currículum</h2>
                        <p className="cv-description">
                            Visualiza el PDF guardado en la base de datos, o sube uno nuevo para reemplazar el anterior.
                        </p>

                        {loading ? (
                            <div className="loading-placeholder">Consultando repositorios...</div>
                        ) : (
                            <div className="status-section-cv">
                                {curriculoPath ? (
                                    <div className="cv-registered-box">
                                        <span className="status-badge-cv status-ok-cv">● CV Registrado</span>
                                        <p className="file-info-text">
                                            Archivo actual: <span>{curriculoPath}</span>
                                        </p>
                                        <button type="button" onClick={handleVerCVActual} className="btn-view-cv">
                                            Ver mi CV actual
                                        </button>
                                    </div>
                                ) : (
                                    <div className="cv-empty-box">
                                        <span className="status-badge-cv status-none-cv">○ Sin currículum</span>
                                        <p className="file-info-text muted-text">
                                            Aún no has subido tu hoja de vida al sistema.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <form onSubmit={handleSubirCV} className="upload-cv-form">
                            <div className="upload-drag-area">
                                <label htmlFor="archivo" className="file-input-label">
                                    Seleccionar documento PDF
                                </label>
                                <input
                                    type="file"
                                    name="archivo"
                                    id="archivo"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    required
                                />
                                {archivoSeleccionado && (
                                    <p className="selected-filename">
                                        📎 Listo para subir: <strong>{archivoSeleccionado.name}</strong>
                                    </p>
                                )}
                                <p className="max-size-hint">
                                    Al subir uno nuevo, se reemplaza el currículum guardado en la base de datos.
                                </p>
                            </div>

                            <button type="submit" className="btn-upload-cv" disabled={subiendo}>
                                {subiendo ? 'Guardando...' : 'Guardar y subir currículum'}
                            </button>
                        </form>

                        <div className="back-link-cv-container">
                            <Link to="/oferente/dashboard" className="btn-back-cv">
                                &larr; Volver al Dashboard
                            </Link>
                        </div>

                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}