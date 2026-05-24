import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { empresaAPI } from '../../api/empresa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './PublicarPuesto.css';

export default function PublicarPuesto() {
    const navigate = useNavigate();

    // Estados para los campos básicos del puesto
    const [descripcion, setDescripcion] = useState('');
    const [salarioOfrecido, setSalarioOfrecido] = useState('');
    const [moneda, setMoneda] = useState('CRC');
    const [tipoPublicacion, setTipoPublicacion] = useState('PUBLICA');

    // Estados para el catálogo de habilidades y las seleccionadas para el puesto
    const [catalogoHabilidades, setCatalogoHabilidades] = useState([]);
    const [requisitosSeleccionados, setRequisitosSeleccionados] = useState([]); // [{ caracteristicaId: '', nivelDeseado: 3 }]

    // Estados de control de la interfaz
    const [loading, setLoading] = useState(false);
    const [mensajeError, setMensajeError] = useState(null);
    const [mensajeExito, setMensajeExito] = useState(null);

    // Cargar las habilidades reales de la Base de Datos al entrar a la pantalla
    useEffect(() => {
        const cargarHabilidades = async () => {
            try {
                const data = await empresaAPI.getCaracteristicasCatalogo();
                // Dejamos solo las habilidades hijas (las específicas, descartando las categorías raíces)
                if (Array.isArray(data)) {
                    const hijas = data.filter(c => c.padreId !== null);
                    setCatalogoHabilidades(hijas);
                }
            } catch (error) {
                console.error("Error al cargar habilidades:", error);
                setMensajeError("No se pudo conectar con el catálogo de habilidades.");
            }
        };
        cargarHabilidades();
    }, []);

    // Agregar una fila vacía para un nuevo requisito técnico
    const handleAgregarRequisito = () => {
        setRequisitosSeleccionados([
            ...requisitosSeleccionados,
            { caracteristicaId: '', nivelDeseado: 3 }
        ]);
    };

    // Modificar un requisito específico (ya sea cambiar de habilidad o cambiar el nivel técnico)
    const handleCambiarRequisito = (index, campo, valor) => {
        const nuevosRequisitos = [...requisitosSeleccionados];
        nuevosRequisitos[index][campo] = valor;
        setRequisitosSeleccionados(nuevosRequisitos);
    };

    // Eliminar una fila de requisito
    const handleEliminarRequisito = (index) => {
        setRequisitosSeleccionados(requisitosSeleccionados.filter((_, i) => i !== index));
    };

    // Enviar el formulario completo hacia Spring Boot
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setMensajeError(null);
        setMensajeExito(null);

        // Validaciones básicas antes de disparar el servicio
        if (!descripcion.trim() || !salarioOfrecido) {
            setMensajeError("Por favor complete la descripción y el salario ofrecido.");
            return;
        }

        // Filtrar requisitos que no tengan una habilidad seleccionada
        const caracteristicasFinales = requisitosSeleccionados
            .filter(r => r.caracteristicaId !== '')
            .map(r => ({
                id: parseInt(r.caracteristicaId, 10),
                nivelDeseado: parseInt(r.nivelDeseado, 10)
            }));

        // Construimos el objeto JSON exacto que espera tu Backend
        const puestoRequestData = {
            descripcion: descripcion,
            salarioOfrecido: parseFloat(salarioOfrecido),
            moneda: moneda,
            tipoPublicacion: tipoPublicacion,
            caracteristicas: caracteristicasFinales
        };

        setLoading(true);
        try {
            await empresaAPI.crearPuesto(puestoRequestData);
            setMensajeExito("¡Vacante publicada exitosamente en el sistema!");

            // Limpiamos el formulario
            setDescripcion('');
            setSalarioOfrecido('');
            setRequisitosSeleccionados([]);

            // Redirigir al dashboard o lista de puestos tras 2 segundos
            setTimeout(() => {
                navigate('/empresa/dashboard');
            }, 2000);

        } catch (error) {
            console.error("Error al guardar puesto:", error);
            setMensajeError(error.response?.data?.message || "Error interno al procesar la publicación.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="publicar-puesto-page">
            <div className="page-wrapper">
                <Navbar />
                <main className="main-content">
                    <div className="form-container form-large">
                        <h2>Publicar Nueva Vacante</h2>
                        <p className="subtitle">Crea una oferta laboral y define sus requisitos técnicos</p>

                        {mensajeError && <div className="error-banner">⚠️ {mensajeError}</div>}
                        {mensajeExito && <div className="success-banner">✅ {mensajeExito}</div>}

                        <form onSubmit={handleFormSubmit}>
                            {/* Fila: Moneda y Salario */}
                            <div className="form-row">
                                <div className="form-group val-moneda">
                                    <label>Moneda:</label>
                                    <select value={moneda} onChange={(e) => setMoneda(e.target.value)}>
                                        <option value="CRC">CRC (₡)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                    </select>
                                </div>
                                <div className="form-group val-salario">
                                    <label>Salario Ofrecido:</label>
                                    <input
                                        type="number"
                                        placeholder="Ej: 850000"
                                        value={salarioOfrecido}
                                        onChange={(e) => setSalarioOfrecido(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Campo: Tipo de publicación */}
                            <div className="form-group">
                                <label>Tipo de Publicación:</label>
                                <select value={tipoPublicacion} onChange={(e) => setTipoPublicacion(e.target.value)}>
                                    <option value="PUBLICA">Pública (Abierta a todos los oferentes)</option>
                                    <option value="PRIVADA">Privada (Por invitación)</option>
                                </select>
                            </div>

                            {/* Campo: Descripción General */}
                            <div className="form-group">
                                <label>Descripción del Puesto:</label>
                                <textarea
                                    rows="4"
                                    placeholder="Detalle las responsabilidades, tecnologías primarias y beneficios del puesto..."
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    required
                                />
                            </div>

                            {/* SECCIÓN DINÁMICA: Requisitos del perfil */}
                            <div className="requisitos-section">
                                <div className="requisitos-header">
                                    <h3>Habilidades Requeridas para el Match</h3>
                                    <button type="button" className="btn-secondary" onClick={handleAgregarRequisito}>
                                        + Añadir Requisito
                                    </button>
                                </div>

                                {requisitosSeleccionados.length === 0 ? (
                                    <p className="no-reqs-text">No has añadido habilidades requeridas aún. Añade al menos una para optimizar los filtros de match.</p>
                                ) : (
                                    requisitosSeleccionados.map((requisito, index) => (
                                        <div key={index} className="requisito-row">
                                            <select
                                                value={requisito.caracteristicaId}
                                                onChange={(e) => handleCambiarRequisito(index, 'caracteristicaId', e.target.value)}
                                                required
                                            >
                                                <option value="">-- Seleccione una Habilidad --</option>
                                                {catalogoHabilidades.map(skill => (
                                                    <option key={skill.id} value={skill.id}>{skill.nombre}</option>
                                                ))}
                                            </select>

                                            <div className="nivel-picker">
                                                <label>Nivel:</label>
                                                <select
                                                    value={requisito.nivelDeseado}
                                                    onChange={(e) => handleCambiarRequisito(index, 'nivelDeseado', e.target.value)}
                                                >
                                                    <option value="1">1 (Básico)</option>
                                                    <option value="2">2 (Regular)</option>
                                                    <option value="3">3 (Intermedio)</option>
                                                    <option value="4">4 (Avanzado)</option>
                                                    <option value="5">5 (Experto)</option>
                                                </select>
                                            </div>

                                            <button
                                                type="button"
                                                className="btn-delete"
                                                onClick={() => handleEliminarRequisito(index)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Botones de acción */}
                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => navigate('/empresa/dashboard')}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? "Publicando..." : "Publicar Vacante"}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
