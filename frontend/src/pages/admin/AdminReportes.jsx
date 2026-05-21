
import { useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './AdminReportes.css';

export default function AdminReportes() {
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

