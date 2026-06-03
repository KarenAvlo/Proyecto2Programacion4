import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { oferenteAPI } from '../../api/oferente';
import './CVform.css';

export default function OferenteCV() {
    const fileInputRef = useRef(null);
    const [curriculoPath, setCurriculoPath] = useState('');
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subiendo, setSubiendo] = useState(false);
    const [mensajeExito, setMensajeExito] = useState(null);
    const [mensajeError, setMensajeError] = useState(null);

    const obtenerNombreCV = (data) => (
        data?.curriculoPath
        || data?.curriculo_path
        || data?.nombreArchivo
        || ''
    );

    const esArchivoPdf = (file) => {
        if (!file) return false;
        return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    };

    const cargarPerfil = useCallback(async () => {
        setLoading(true);
        setMensajeError(null);
        try {
            const data = await oferenteAPI.getPerfil();
            setCurriculoPath(obtenerNombreCV(data));
        } catch (error) {
            console.error('Error al verificar el estado del CV:', error);
            setMensajeError('No se pudo conectar con el servidor para verificar tu curriculum.');
            setCurriculoPath('');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void Promise.resolve().then(cargarPerfil);
    }, [cargarPerfil]);

    const crearUrlCV = async () => {
        if (!curriculoPath) {
            throw new Error('No tienes un curriculum cargado actualmente.');
        }

        const blob = await oferenteAPI.obtenerCVBlob();
        if (blob.type && blob.type !== 'application/pdf') {
            throw new Error('El archivo recibido no es un PDF valido.');
        }
        return window.URL.createObjectURL(blob);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        setMensajeError(null);
        setMensajeExito(null);

        if (file && !esArchivoPdf(file)) {
            setArchivoSeleccionado(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            setMensajeError('Solo se permiten archivos PDF.');
            return;
        }

        setArchivoSeleccionado(file);
    };

    const handleVerCVActual = async () => {
        try {
            setMensajeError(null);
            const url = await crearUrlCV();
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
            setMensajeError(error.message || 'No se pudo abrir el PDF del curriculum.');
        }
    };

    const handleSubirCV = async (e) => {
        e.preventDefault();

        if (!archivoSeleccionado) {
            setMensajeError('Por favor, selecciona un archivo PDF valido.');
            return;
        }

        if (!esArchivoPdf(archivoSeleccionado)) {
            setMensajeError('Solo se permiten archivos PDF.');
            return;
        }

        setMensajeError(null);
        setMensajeExito(null);

        try {
            setSubiendo(true);
            const response = await oferenteAPI.subirCV(archivoSeleccionado);

            await cargarPerfil();
            if (response?.nombreArchivo) {
                setCurriculoPath(response.nombreArchivo);
            }
            setArchivoSeleccionado(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            setMensajeExito(response?.mensaje || 'Tu curriculum se guardo correctamente.');
        } catch (error) {
            console.error('Error en la subida del documento:', error);
            setMensajeError(error.message || 'Ocurrio un error al subir el PDF.');
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

                        <h2>Gestion de Curriculum</h2>
                        <p className="cv-description">
                            Consulta el PDF guardado o sube uno nuevo para agregarlo o reemplazarlo.
                        </p>

                        {loading ? (
                            <div className="loading-placeholder">Verificando curriculum...</div>
                        ) : (
                            <div className="status-section-cv">
                                {curriculoPath ? (
                                    <div className="cv-registered-box">
                                        <span className="status-badge-cv status-ok-cv">CV registrado</span>
                                        <p className="file-info-text">
                                            Archivo actual: <span>{curriculoPath}</span>
                                        </p>
                                        <div className="cv-actions">
                                            <button type="button" onClick={handleVerCVActual} className="btn-view-cv">
                                                Ver CV
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="cv-empty-box">
                                        <span className="status-badge-cv status-none-cv">Sin curriculum</span>
                                        <p className="file-info-text muted-text">
                                            Aun no tienes un PDF registrado en el sistema.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <form onSubmit={handleSubirCV} className="upload-cv-form">
                            <div className="upload-drag-area">
                                <label htmlFor="archivo" className="file-input-label">
                                    Seleccionar PDF
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    name="archivo"
                                    id="archivo"
                                    accept="application/pdf,.pdf"
                                    onChange={handleFileChange}
                                    required
                                />
                                {archivoSeleccionado && (
                                    <p className="selected-filename">
                                        Listo para subir: <strong>{archivoSeleccionado.name}</strong>
                                    </p>
                                )}
                                <p className="max-size-hint">
                                    El archivo debe ser PDF. Si ya existe uno, se reemplazara.
                                </p>
                            </div>

                            <button type="submit" className="btn-upload-cv" disabled={subiendo}>
                                {subiendo ? 'Guardando...' : 'Guardar curriculum'}
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
