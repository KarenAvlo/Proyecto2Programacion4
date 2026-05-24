import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './EmpresaDashboard.css';

export default function EmpresaDashboard() {
    return (
        <div className="empresa-wrapper">
            <Navbar />
            <main className="empresa-content">
                <div className="dashboard-header">
                    <div>
                        <h1>Dashboard Empresa</h1>
                        <p className="subtitle">Desde aquí podés administrar tus puestos y buscar oferentes.</p>
                    </div>
                </div>

                <section className="table-section">
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Link to="/empresa/puestos" className="btn-match">
                            Mis Puestos
                        </Link>

                        <Link to="/empresa/publicar-puesto" className="btn-match">
                            + Publicar Puesto
                        </Link>

                        <Link to="/empresa/buscar-oferentes" className="btn-global">
                            Buscar Oferentes Globales
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
