import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { empresaAPI } from '../../api/empresa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './CandidatoMatchView.css';

export default function CandidatoMatchView() {
    // Captura el parámetro de la URL (/empresa/puestos/:puestoId/match)
    const { puestoId } = useParams();

    // Estados reactivos para controlar la data y el spinner de carga
    const [candidatos, setCandidatos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Consulta al backend usando la función de empresa.js
    const obtenerCandidatosMatch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await empresaAPI.buscarCandidatos(puestoId);
            setCandidatos(data);
        } catch (error) {
            console.error("Error consultando el match con el servidor:", error);
        } finally {
            setLoading(false);
        }
    }, [puestoId]);

    // Disparador del ciclo de vida al montar el componente
    useEffect(() => {
        if (puestoId) {
            obtenerCandidatosMatch();
        }
    }, [puestoId, obtenerCandidatosMatch]);

    // Función auxiliar para asignar el color del badge según el porcentaje de coincidencia
    const obtenerEstiloBadge = (porcentaje) => {
        if (porcentaje >= 75) return "badge-match match-alto";
        if (porcentaje >= 40) return "badge-match match-medio";
        return "badge-match match-bajo";
    };

    return (
        <div className="match-view-page">
            <div className="match-wrapper">
                <Navbar />

                <main className="match-content">
                    <div className="match-header">
                        <h1>Match de Candidatos</h1>
                        <Link to="/empresa/dashboard" className="btn-back">
                            &larr; Volver al Dashboard
                        </Link>
                    </div>

                    {loading ? (
                        <div className="loading-box">
                            Procesando perfiles del sistema y calculando porcentajes de coincidencia...
                        </div>
                    ) : (
                        <div className="panel-resultados">
                            <h3>Candidatos que cumplen con los requisitos del puesto</h3>

                            {candidatos.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="candidatos-table">
                                        <thead>
                                        <tr>
                                            <th>Cédula</th>
                                            <th>Nombre Completo</th>
                                            <th>Correo Electrónico</th>
                                            <th>Coincidencias</th>
                                            <th style={{ textAlign: 'center' }}>Porcentaje Match</th>
                                            <th style={{ textAlign: 'center' }}>Acciones</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {candidatos.map((cand, idx) => (
                                            <tr key={cand.cedula || idx}>
                                                <td style={{ fontWeight: 'bold' }}>{cand.cedula}</td>
                                                <td>{cand.nombre} {cand.apellido}</td>
                                                <td>{cand.email}</td>
                                                <td>{cand.coincidencias || 0} habilidades coincidentes</td>
                                                <td style={{ textAlign: 'center' }}>
                                                        <span className={obtenerEstiloBadge(cand.porcentaje)}>
                                                            {cand.porcentaje}%
                                                        </span>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <Link
                                                        to={`/empresa/puestos/${puestoId}/candidatos/${cand.cedula}`}
                                                        className="btn-ver-candidato"
                                                    >
                                                        Ver Candidato
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="no-data-box">
                                    Actualmente ningún oferente registrado en la bolsa cumple con las características requeridas para esta posición.
                                </div>
                            )}
                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </div>
    );
}
