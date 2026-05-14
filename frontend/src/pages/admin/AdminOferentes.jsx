import { useEffect, useState } from 'react';
import { adminAPI } from '../../api/admin';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './AdminOferentes.css';

export default function AdminOferentes() {
    const [oferentes, setOferentes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOferentes();
    }, []);

    const fetchOferentes = async () => {
        try {
            const data = await adminAPI.getOferentesPendientes();
            setOferentes(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAprobar = async (email) => {
        if (!window.confirm('¿Está seguro de que desea aprobar este oferente?')) {
            return;
        }

        try {
            await adminAPI.aprobarOferente(email);
            alert('Oferente aprobado correctamente');
            fetchOferentes();
        } catch (error) {
            alert('Error al aprobar el oferente');
        }
    };

    return (
        <div className="admin-wrapper">
            <Navbar />

            <main className="admin-content">
                <h1>Oferentes Pendientes de Aprobación</h1>
                <p className="subtitle">Lista de oferentes que esperan aprobación para acceder al sistema</p>

                {loading ? (
                    <div className="loading">Cargando oferentes...</div>
                ) : oferentes.length === 0 ? (
                    <div className="empty-state">
                        <p>No hay oferentes pendientes por el momento</p>
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
                            {oferentes.map((oferente) => (
                                <tr key={oferente.email}>
                                    <td>{oferente.email}</td>
                                    <td>{oferente.tipo}</td>
                                    <td>
                                        <button
                                            className="btn-approve"
                                            onClick={() => handleAprobar(oferente.email)}
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