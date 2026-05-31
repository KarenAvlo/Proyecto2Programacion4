
import { useState } from 'react';
import { Link } from 'react-router-dom';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './AdminReportes.css';

export default function AdminReportes() {

    // Apunta al puerto de tu backend de Spring Boot (Cámbialo si usas otro puerto)
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

    const [mesSeleccionado, setMesSeleccionado] = useState('1');

    // helper: descargar blob recibido y abrir en nueva pestaña
    const openBlobInNewTab = (blob, filename) => {
        const url = window.URL.createObjectURL(blob);
        const newWindow = window.open(url, '_blank');
        if (!newWindow) {
            // fallback: for browsers blocking popups, force download
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
        // liberar objeto después de un tiempo
        setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    };

    const fetchPdf = async (path) => {
        try {
            const token = sessionStorage.getItem('token') || localStorage.getItem('token');
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${API_BASE_URL}${path}`, {
                method: 'GET',
                headers,
                credentials: 'include',
            });

            if (!res.ok) {
                const text = await res.text().catch(() => '');
                throw new Error(`Error ${res.status}: ${text}`);
            }

            const blob = await res.blob();
            return blob;
        } catch (error) {
            console.error('Error fetching PDF:', error);
            throw error;
        }
    };

    const handleDescargarMensual = async () => {
        try {
            const blob = await fetchPdf(`/admin/reporte/mensual?mes=${mesSeleccionado}`);
            openBlobInNewTab(blob, `Reporte_Mes_${mesSeleccionado}.pdf`);
        } catch {
            alert('No se pudo generar el reporte. Asegúrate de estar autenticado.');
        }
    };

    const handleExportarOferentes = async () => {
        try {
            const blob = await fetchPdf(`/admin/reportes/exportar/oferentes`);
            openBlobInNewTab(blob, 'Reporte_Estadistico_Oferentes.pdf');
        } catch {
            alert('No se pudo exportar oferentes. Asegúrate de estar autenticado.');
        }
    };

    return (
        <div className="page-reportes-container">
            <div className="admin-wrapper">
                <Navbar />

                <main className="admin-content-reportes">
                    <h1>Centro de Reportes</h1>
                    <p className="subtitle-reportes">
                        Genera informes detallados de empresas, puestos y oferentes del sistema.
                    </p>

                    <div className="report-card-container">

                        {/* SECCIÓN 1: REPORTE MENSUAL */}
                        <div className="section-report">
                            <label htmlFor="mes">Seleccione el Mes de Publicación:</label>
                            <select
                                id="mes"
                                name="mes"
                                value={mesSeleccionado}
                                onChange={(e) => setMesSeleccionado(e.target.value)}
                                required
                            >
                                <option value="1">Enero</option>
                                <option value="2">Febrero</option>
                                <option value="3">Marzo</option>
                                <option value="4">Abril</option>
                                <option value="5">Mayo</option>
                                <option value="6">Junio</option>
                                <option value="7">Julio</option>
                                <option value="8">Agosto</option>
                                <option value="9">Septiembre</option>
                                <option value="10">Octubre</option>
                                <option value="11">Noviembre</option>
                                <option value="12">Diciembre</option>
                            </select>

                            <button onClick={handleDescargarMensual} type="button" className="btn-report btn-puestos">
                                1) Reporte PDF: Empresas y Puestos
                            </button>
                        </div>

                        <hr className="divider-reportes" />

                        {/* SECCIÓN 2: REPORTE GENERAL DE OFERENTES */}
                        <div className="section-report">
                            <p className="description-reporte">
                                Genera un informe detallado con estadísticas de todos los oferentes registrados en la plataforma.
                            </p>
                            <button type="button" className="btn-report btn-oferentes" onClick={handleExportarOferentes}>
                                2) Reporte PDF: Oferentes y Estadísticas
                            </button>
                        </div>

                        <div className="back-link-container">
                            <Link to="/admin/dashboard" className="btn-back-dashboard">
                                &larr; Volver al Panel Principal
                            </Link>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}

