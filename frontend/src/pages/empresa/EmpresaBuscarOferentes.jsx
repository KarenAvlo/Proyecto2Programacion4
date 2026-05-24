import { useState, useEffect } from 'react';
import { empresaAPI } from '../../api/empresa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './EmpresaBuscarOferentes.css';

export default function EmpresaBuscarOferentes() {
    const [oferentes, setOferentes] = useState([]);
    const [habilidadesCatalogo, setHabilidadesCatalogo] = useState([]);
    const [filtrosSeleccionados, setFiltrosSeleccionados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorBD, setErrorBD] = useState(null);

    useEffect(() => {
        cargarDatosDesdeBackend();
    }, []);

    const cargarDatosDesdeBackend = async () => {
        setLoading(true);
        setErrorBD(null);
        try {
            // 1. Consumir el buscador global que creamos en Spring Boot
            const datosOferentes = await empresaAPI.getOferentesGlobales();
            if (Array.isArray(datosOferentes)) {
                setOferentes(datosOferentes);
            }

            // 2. Extraer dinámicamente las habilidades únicas existentes en los oferentes
            // Esto asegura que si no podés acceder al endpoint de admin, los filtros sigan funcionando con la data real de la BD
            const todasLasHabilidades = datosOferentes.reduce((acc, current) => {
                const skills = current.habilidades || [];
                skills.forEach(s => {
                    if (!acc.includes(s)) acc.push(s);
                });
                return acc;
            }, []);

            setHabilidadesCatalogo(todasLasHabilidades.map((h, index) => ({ id: index, nombre: h })));

        } catch (error) {
            console.error("Error conectando con el Backend:", error);
            setErrorBD("Error de comunicación con el servidor. Asegúrate de que Spring Boot esté corriendo.");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (nombreHabilidad) => {
        if (filtrosSeleccionados.includes(nombreHabilidad)) {
            setFiltrosSeleccionados(filtrosSeleccionados.filter(h => h !== nombreHabilidad));
        } else {
            setFiltrosSeleccionados([...filtrosSeleccionados, nombreHabilidad]);
        }
    };

    const procesarOferentesConMatch = () => {
        if (filtrosSeleccionados.length === 0) {
            return oferentes.map(o => ({ ...o, porcentajeMatch: 100 }));
        }

        const resultado = oferentes.map(oferente => {
            const listaHabilidades = oferente.habilidades || [];
            const coincidentes = listaHabilidades.filter(h => filtrosSeleccionados.includes(h));
            const porcentaje = Math.round((coincidentes.length / filtrosSeleccionados.length) * 100);
            return { ...oferente, porcentajeMatch: porcentaje };
        });

        return resultado.sort((a, b) => b.porcentajeMatch - a.porcentajeMatch);
    };

    const oferentesProcesados = procesarOferentesConMatch();

    const obtenerColorBarra = (porcentaje) => {
        if (porcentaje >= 75) return "#2f8659";
        if (porcentaje >= 40) return "#dd6b20";
        return "#e53e3e";
    };

    return (
        <div className="search-oferentes-page">
            <div className="page-wrapper">
                <Navbar />

                <main className="main-content">
                    <h1>Buscador Global de Oferentes</h1>
                    <p className="subtitle">Conectado nativamente a la Base de Datos del Sistema</p>

                    {errorBD && <div className="error-banner" style={{ color: 'red', padding: '10px' }}>⚠️ {errorBD}</div>}

                    {loading ? (
                        <div className="loading-box" style={{ textAlign: 'center', padding: '40px' }}>
                            Consultando registros en Spring Boot...
                        </div>
                    ) : (
                        <div className="layout-grid">

                            <aside className="filter-sidebar">
                                <h3>Habilidades Hojas</h3>
                                <div className="filter-group">
                                    {habilidadesCatalogo.map((skill) => (
                                        <label key={skill.id} className="filter-checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={filtrosSeleccionados.includes(skill.nombre)}
                                                onChange={() => handleCheckboxChange(skill.nombre)}
                                            />
                                            {skill.nombre}
                                        </label>
                                    ))}
                                </div>
                            </aside>

                            <section className="cards-container">
                                <div className="cards-grid">
                                    {oferentesProcesados.map((oferente, index) => (
                                        <div key={oferente.cedula || index} className="oferente-card">
                                            <div className="card-header">
                                                <h2>{oferente.nombre} {oferente.apellido}</h2>
                                                <div className="card-cedula">Cédula: {oferente.cedula}</div>
                                            </div>

                                            <div className="card-body">
                                                <div className="card-info-row">
                                                    <strong>Correo:</strong> {oferente.email}
                                                </div>
                                                <div className="card-info-row">
                                                    <strong>Ubicación:</strong> {oferente.residencia || 'Costa Rica'}
                                                </div>

                                                <div className="skills-tags">
                                                    {(oferente.habilidades || []).map((h, i) => (
                                                        <span key={i} className="tag-skill">{h}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="match-section">
                                                <div className="match-labels" style={{ color: obtenerColorBarra(oferente.porcentajeMatch) }}>
                                                    <span>Grado Coincidencia</span>
                                                    <span>{oferente.porcentajeMatch}%</span>
                                                </div>
                                                <div className="progress-bar-container">
                                                    <div
                                                        className="progress-bar-fill"
                                                        style={{
                                                            width: `${oferente.porcentajeMatch}%`,
                                                            backgroundColor: obtenerColorBarra(oferente.porcentajeMatch)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </div>
    );
}