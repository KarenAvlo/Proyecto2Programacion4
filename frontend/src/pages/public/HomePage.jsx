import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicAPI } from '../../api/public';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './HomePage.css';

export default function HomePage() {
    const navigate = useNavigate();
    const [puestos, setPuestos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredPuesto, setHoveredPuesto] = useState(null);

    useEffect(() => {
        fetchPuestos();
    }, []);

    const fetchPuestos = async () => {
        try {
            const data = await publicAPI.getPuestosRecientes();
            setPuestos(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-wrapper">
            <Navbar />

            <main className="home-main">
                <section className="hero">
                    <h1>Bolsa de Empleo</h1>
                    <p>Conecta empresas con los mejores talentos</p>
                    <button
                        className="btn-hero"
                        onClick={() => navigate('/puestos/buscar')}
                    >
                        Buscar Puestos
                    </button>
                </section>

                <section className="recent-puestos">
                    <h2>Últimos Puestos Publicados</h2>
                    <p className="subtitle">Descubre las oportunidades más recientes</p>

                    {loading ? (
                        <div className="loading">Cargando puestos...</div>
                    ) : puestos.length === 0 ? (
                        <div className="empty-state">
                            <p>No hay puestos disponibles por el momento</p>
                        </div>
                    ) : (
                        <div className="puestos-grid">
                            {puestos.map((puesto) => (
                                <div
                                    key={puesto.id}
                                    className="puesto-card"
                                    onMouseEnter={() => setHoveredPuesto(puesto.id)}
                                    onMouseLeave={() => setHoveredPuesto(null)}
                                >
                                    <div className="puesto-header">
                                        <h3>{puesto.empresa}</h3>
                                        <span className="badge-public">Pública</span>
                                    </div>

                                    <div className="puesto-body">
                                        <p className="puesto-descripcion">{puesto.descripcion}</p>
                                        <div className="puesto-meta">
                      <span className="salary">
                        {puesto.moneda} {puesto.salarioOfrecido}
                      </span>
                                            <span className="fecha">
                        {new Date(puesto.fechaPublicacion).toLocaleDateString()}
                      </span>
                                        </div>
                                    </div>

                                    {hoveredPuesto === puesto.id && (
                                        <div className="puesto-details">
                                            <h4>Características Requeridas:</h4>
                                            {puesto.caracteristicas && puesto.caracteristicas.length > 0 ? (
                                                <ul>
                                                    {puesto.caracteristicas.map((car, idx) => (
                                                        <li key={idx}>
                                                            {car.nombre} - Nivel: {car.nivelDeseado}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="no-caracteristicas">Sin características específicas</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}