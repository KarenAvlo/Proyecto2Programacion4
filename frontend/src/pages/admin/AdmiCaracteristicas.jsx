import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminAPI } from '../../api/admin';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './AdmiCaracteristicas.css';

export default function AdmiCaracteristicas() {
    const [searchParams] = useSearchParams();
    const padreId = searchParams.get('padreId');

    const [lista, setLista] = useState([]);
    const [raices, setRaices] = useState([]);
    const [padre, setPadre] = useState(null);
    const [nombre, setNombre] = useState('');
    const [padreIdForm, setPadreIdForm] = useState(padreId || '');
    const [loading, setLoading] = useState(true);
    const [allCaracteristicas, setAllCaracteristicas] = useState([]);

    useEffect(() => {
        fetchCaracteristicas();
    }, [padreId]);

    const fetchCaracteristicas = async () => {
        try {
            setLoading(true);
            // Obtener todas las características
            const todasData = await adminAPI.getCaracteristicas();
            setAllCaracteristicas(todasData);

            // Obtener raíces
            const raicesData = await adminAPI.getCaracteristicasRaices();
            setRaices(raicesData);

            // Si hay padreId, obtener los hijos de ese padre
            if (padreId) {
                const padreObj = todasData.find(c => c.id === parseInt(padreId));
                setPadre(padreObj);

                try {
                    const hijosData = await adminAPI.getCaracteristicasPorPadre(parseInt(padreId));
                    setLista(hijosData);
                } catch (error) {
                    console.log('No hay hijas para este padre');
                    setLista([]);
                }
            } else {
                setLista(raicesData);
                setPadre(null);
            }
        } catch (error) {
            console.error('Error cargando características:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre.trim()) {
            alert('Por favor ingresa un nombre');
            return;
        }

        try {
            const padreIdValue = padreIdForm ? parseInt(padreIdForm) : null;
            await adminAPI.crearCaracteristica(nombre, padreIdValue);
            setNombre('');
            setPadreIdForm(padreId || '');
            alert('Característica creada exitosamente');
            fetchCaracteristicas();
        } catch (error) {
            console.error('Error creando característica:', error);
            alert('Error al crear la característica');
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta característica?')) {
            return;
        }

        try {
            await adminAPI.eliminarCaracteristica(id);
            alert('Característica eliminada');
            fetchCaracteristicas();
        } catch (error) {
            console.error('Error eliminando característica:', error);
            alert('Error al eliminar la característica');
        }
    };

    return (
        <div className="admin-wrapper">
            <Navbar />

            <main className="admin-content">
                <h1 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>Características</h1>

                {loading ? (
                    <div className="loading">Cargando características...</div>
                ) : (
                    <div className="characteristics-grid">
                        {/* Listado de características */}
                        <div className="container-green">
                            <p><strong>Ruta:</strong></p>
                            <div className="breadcrumb">
                                <a href="/admin/caracteristicas" className="breadcrumb-item">Raíces</a>
                                {padre && (
                                    <>
                                        <span> / </span>
                                        <span className="breadcrumb-item">{padre.nombre}</span>
                                    </>
                                )}
                            </div>

                            <p className="category-label">
                                Categorías: <span style={{ fontWeight: 'bold' }}>
                  {padre ? padre.nombre : 'raíces'}
                </span>
                            </p>

                            {lista.length === 0 ? (
                                <div className="empty-state">
                                    No hay subcategorías aquí.
                                </div>
                            ) : (
                                <div className="list-items">
                                    {lista.map((c) => (
                                        <div key={c.id} className="list-item-card">
                      <span style={{ fontWeight: 'bold', color: '#2d3748' }}>
                        {c.nombre}
                      </span>
                                            <div className="item-actions">
                                                <a href={`/admin/caracteristicas?padreId=${c.id}`} className="btn-entrar">
                                                    Entrar
                                                </a>
                                                <button
                                                    className="btn-eliminar"
                                                    onClick={() => handleEliminar(c.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Formulario para agregar */}
                        <div className="container-green form-container">
                            <h3 style={{ marginTop: 0 }}>Agregar Característica</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="nombre">Nombre</label>
                                    <input
                                        id="nombre"
                                        type="text"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="padreId">Padre</label>
                                    <select
                                        id="padreId"
                                        value={padreIdForm}
                                        onChange={(e) => setPadreIdForm(e.target.value)}
                                    >
                                        <option value="">(sin padre)</option>
                                        {raices.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                {r.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button type="submit" className="btn-crear">
                                    Crear
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}