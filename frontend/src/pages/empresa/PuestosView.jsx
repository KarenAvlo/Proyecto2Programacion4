import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { empresaAPI } from '../../api/empresa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './EmpresaDashboard.css';

export default function PuestosView() {
    const [puestos, setPuestos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPuestos = async () => {
        try {
            setLoading(true);
            const puestosData = await empresaAPI.getPuestos();
            setPuestos(puestosData);
        } catch (error) {
            console.error('Error al cargar puestos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPuestos();
    }, []);

    const handleDesactivar = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas desactivar este puesto?')) {
            try {
                await empresaAPI.desactivarPuesto(id);
                fetchPuestos();
            } catch (error) {
                console.error('Error al desactivar:', error);
            }
        }
    };

    return (
        <div className="empresa-wrapper">
            <Navbar />
            <main className="empresa-content">
                <div className="dashboard-header">
                    <h1>Mis Puestos</h1>

                    <Link to="/empresa/publicar-puesto" className="btn-match">
                        + Publicar Puesto
                    </Link>
                </div>

                {loading ? (
                    <div className="loading">Cargando...</div>
                ) : (
                    <section className="table-section">
                        <table className="puestos-table">
                            <thead>
                            <tr>
                                <th>Descripción</th>
                                <th>Salario</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {puestos.map((puesto) => (
                                <tr key={puesto.id}>
                                    <td>{puesto.descripcion}</td>
                                    <td>{puesto.moneda} {puesto.salarioOfrecido}</td>
                                    <td>
                                            <span className={`status-badge ${puesto.activo ? 'activo' : 'inactivo'}`}>
                                                {puesto.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                    </td>
                                    <td className="actions-cell">
                                        <Link to={`/empresa/puestos/${puesto.id}/match`} className="btn-match">
                                            Ver Match
                                        </Link>

                                        {puesto.activo && (
                                            <button
                                                className="btn-danger"
                                                onClick={() => handleDesactivar(puesto.id)}
                                            >
                                                Desactivar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </section>
                )}
            </main>
            <Footer />
        </div>
    );
}