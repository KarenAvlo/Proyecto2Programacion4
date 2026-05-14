import { useEffect, useState } from 'react';
import { adminAPI } from '../../api/admin';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './AdminEmpresas.css';

export default function AdminEmpresas() {
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmpresas();
    }, []);

    const fetchEmpresas = async () => {
        try {
            const data = await adminAPI.getEmpresasPendientes();
            setEmpresas(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAprobar = async (email) => {
        if (!window.confirm('¿Está seguro de que desea aprobar esta empresa?')) {
            return;
        }

        try {
            await adminAPI.aprobarEmpresa(email);
            alert('Empresa aprobada correctamente');
            fetchEmpresas();
        } catch (error) {
            alert('Error al aprobar la empresa');
        }
    };

    return (
        <div className="admin-wrapper">
            <Navbar />

            <main className="admin-content">
                <h1>Empresas Pendientes de Aprobación</h1>
                <p className="subtitle">Lista de empresas que esperan aprobación para acceder al sistema</p>

                {loading ? (
                    <div className="loading">Cargando empresas...</div>
                ) : empresas.length === 0 ? (
                    <div className="empty-state">
                        <p>No hay empresas pendientes por el momento</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table-admin">
                            <thead>
                            <tr>
                                <th>Email</th>
                                <th>Tipo</th>
                                <th>Acción</th>
                            </tr>
                            </thead>
                            <tbody>
                            {empresas.map((empresa) => (
                                <tr key={empresa.email}>
                                    <td>{empresa.email}</td>
                                    <td>{empresa.tipo}</td>
                                    <td>
                                        <button
                                            className="btn-approve"
                                            onClick={() => handleAprobar(empresa.email)}
                                        >
                                            Aprobar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}