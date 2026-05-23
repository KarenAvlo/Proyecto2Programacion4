<<<<<<< HEAD

import { useState } from 'react';
import { useAuth } from '../../auth/useAuth';
=======
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/client';
>>>>>>> origin/kevin
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './AdminReportes.css';

export default function AdminReportes() {
<<<<<<< HEAD
    const { user } = useAuth();
    const [selectedMonth, setSelectedMonth] = useState('1');

    const userEmail = user?.email || 'admin@correo.com';

    const months = [
        { value: '1', label: 'Enero' },
        { value: '2', label: 'Febrero' },
        { value: '3', label: 'Marzo' },
        { value: '4', label: 'Abril' },
        { value: '5', label: 'Mayo' },
        { value: '6', label: 'Junio' },
        { value: '7', label: 'Julio' },
        { value: '8', label: 'Agosto' },
        { value: '9', label: 'Septiembre' },
        { value: '10', label: 'Octubre' },
        { value: '11', label: 'Noviembre' },
        { value: '12', label: 'Diciembre' }
    ];

    const handleMonthlyReport = (e) => {
        e.preventDefault();
        // Abre el reporte en una nueva ventana
        window.open(`/admin/reporte/mensual?mes=${selectedMonth}`, '_blank');
    };

    const handleOferentesReport = () => {
        // Abre el reporte en una nueva ventana
        window.open('/admin/reportes/exportar/oferentes', '_blank');
    };

    return (
        <div className="reports-wrapper">
            <Navbar />

            <main className="reports-main">
                <h1>Centro de Reportes</h1>
                <p className="subtitle">
                    Genera informes detallados de empresas, puestos y oferentes del sistema.
                </p>

                <div className="report-card-container">
                    {/* Reporte 1: Mensual de Empresas y Puestos */}
                    <div className="section-report">
                        <form onSubmit={handleMonthlyReport}>
                            <label htmlFor="mes">Seleccione el Mes de Publicación:</label>
                            <select
                                id="mes"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                required
                            >
                                {months.map((month) => (
                                    <option key={month.value} value={month.value}>
                                        {month.label}
                                    </option>
                                ))}
                            </select>
                            <button type="submit" className="btn-report btn-puestos">
                                1) Reporte PDF: Empresas y Puestos
                            </button>
                        </form>
                    </div>

                    <hr />

                    {/* Reporte 2: Oferentes y Estadísticas */}
                    <div className="section-report">
                        <p className="report-description">
                            Genera un informe detallado con estadísticas de todos los oferentes registrados en la plataforma.
                        </p>
                        <button
                            onClick={handleOferentesReport}
                            className="btn-report btn-oferentes"
                        >
                            2) Reporte PDF: Oferentes y Estadísticas
                        </button>
                    </div>

                    {/* Link para volver */}
                    <div className="back-link-container">
                        <a href="/admin/dashboard" className="back-link">
                            ← Volver al Panel Principal
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

=======
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
            const token = localStorage.getItem('token');
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
        } catch (error) {
            alert('No se pudo generar el reporte. Asegúrate de estar autenticado.');
        }
    };

    const handleExportarOferentes = async () => {
        try {
            const blob = await fetchPdf(`/admin/reportes/exportar/oferentes`);
            openBlobInNewTab(blob, 'Reporte_Estadistico_Oferentes.pdf');
        } catch (error) {
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
>>>>>>> origin/kevin
