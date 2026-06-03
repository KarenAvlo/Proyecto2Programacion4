import { useEffect, useMemo, useState } from 'react';
import { publicAPI } from '../../api/public';
import { useAuth } from '../../auth/useAuth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './BuscarPuestos.css';

export default function BuscarPuestos() {
    const { user } = useAuth();
    const [categorias, setCategorias] = useState([]);
    const [puestos, setPuestos] = useState([]);
    const [moneda, setMoneda] = useState('');
    const [seleccionadas, setSeleccionadas] = useState([]);
    const [loadingCatalogo, setLoadingCatalogo] = useState(true);
    const [loadingResultados, setLoadingResultados] = useState(false);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    const [error, setError] = useState('');
    const mostrarPrivados = Boolean(user);

    const totalFiltros = useMemo(() => {
        return seleccionadas.length + (moneda ? 1 : 0);
    }, [seleccionadas, moneda]);

    useEffect(() => {
        const cargarCatalogo = async () => {
            try {
                setLoadingCatalogo(true);
                const data = await publicAPI.getCaracteristicasPublicas();
                setCategorias(data);
            } catch (err) {
                console.error('Error cargando caracteristicas:', err);
                setError('No se pudo cargar el catalogo de caracteristicas.');
            } finally {
                setLoadingCatalogo(false);
            }
        };

        cargarCatalogo();
    }, []);

    const toggleCaracteristica = (id) => {
        setSeleccionadas((actuales) => {
            if (actuales.includes(id)) {
                return actuales.filter(item => item !== id);
            }
            return [...actuales, id];
        });
    };

    const buscar = async (event) => {
        event.preventDefault();
        setError('');
        setLoadingResultados(true);
        setBusquedaRealizada(true);

        try {
            const data = await publicAPI.buscarPuestos({
                caracteristicaIds: seleccionadas,
                moneda,
            });
            setPuestos(data);
        } catch (err) {
            console.error('Error buscando puestos:', err);
            setError('No se pudo realizar la busqueda de puestos.');
            setPuestos([]);
        } finally {
            setLoadingResultados(false);
        }
    };

    const limpiar = async () => {
        setMoneda('');
        setSeleccionadas([]);
        setPuestos([]);
        setBusquedaRealizada(false);
        setError('');
    };

    return (
        <div className="buscar-puestos-page">
            <Navbar />

            <main className="buscar-puestos-main">
                <section className="search-box">
                    <div className="search-header">
                        <div>
                            <h1>Buscar puestos por caracteristicas</h1>
                            <p>
                                {mostrarPrivados
                                    ? 'Filtra oportunidades publicas y privadas por moneda y habilidades requeridas.'
                                    : 'Filtra oportunidades publicas por moneda y habilidades requeridas.'}
                            </p>
                        </div>
                        {totalFiltros > 0 && (
                            <span className="filter-count">{totalFiltros} filtros</span>
                        )}
                    </div>

                    {error && <div className="error-banner">{error}</div>}

                    <form onSubmit={buscar}>
                        <div className="filter-group">
                            <label htmlFor="moneda">Filtrar por moneda</label>
                            <select
                                id="moneda"
                                value={moneda}
                                onChange={(event) => setMoneda(event.target.value)}
                            >
                                <option value="">Todas las monedas</option>
                                <option value="CRC">Colones (CRC)</option>
                                <option value="USD">Dolares (USD)</option>
                                <option value="EUR">Euros (EUR)</option>
                            </select>
                        </div>

                        {loadingCatalogo ? (
                            <div className="loading-box">Cargando filtros...</div>
                        ) : (
                            <div className="category-grid">
                                {categorias.map((categoria) => (
                                    <div className="category-block" key={categoria.id}>
                                        <h2>{categoria.nombre}</h2>

                                        {categoria.hijas?.length > 0 ? (
                                            <div className="checks-list">
                                                {categoria.hijas.map((sub) => (
                                                    <label className="check-item" key={sub.id}>
                                                        <input
                                                            type="checkbox"
                                                            checked={seleccionadas.includes(sub.id)}
                                                            onChange={() => toggleCaracteristica(sub.id)}
                                                        />
                                                        <span>{sub.nombre}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="empty-category">Sin subcategorias registradas</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="btn-row">
                            <button type="submit" className="btn-primary" disabled={loadingResultados}>
                                {loadingResultados ? 'Buscando...' : 'Buscar'}
                            </button>
                            <button type="button" className="btn-clear" onClick={limpiar}>
                                Limpiar
                            </button>
                        </div>
                    </form>
                </section>

                {busquedaRealizada && (
                    <section className="resultados-section">
                        <h2>Resultados</h2>

                        {loadingResultados ? (
                            <div className="loading-box">Buscando puestos...</div>
                        ) : puestos.length > 0 ? (
                            <div className="puestos-grid">
                                {puestos.map((puesto) => (
                                    <article className="puesto-card" key={puesto.id}>
                                        <div className="puesto-header">
                                            <h3>{puesto.empresa || 'Empresa'}</h3>
                                            <span className={puesto.tipoPublicacion === 'PRIVADA' ? 'badge-private' : 'badge-public'}>
                                                {puesto.tipoPublicacion === 'PRIVADA' ? 'Privada' : 'Publica'}
                                            </span>
                                        </div>

                                        <p className="puesto-descripcion">{puesto.descripcion}</p>

                                        <div className="puesto-meta">
                                            <span className="salary">{puesto.moneda} {puesto.salarioOfrecido}</span>
                                            {puesto.fechaPublicacion && (
                                                <span className="fecha">
                                                    {new Date(puesto.fechaPublicacion).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>

                                        <div className="puesto-details">
                                            <h4>Caracteristicas requeridas</h4>
                                            {puesto.caracteristicas?.length > 0 ? (
                                                <ul>
                                                    {puesto.caracteristicas.map((car) => (
                                                        <li key={`${puesto.id}-${car.id}`}>
                                                            {car.nombre} - Nivel {car.nivelDeseado}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="no-caracteristicas">Sin caracteristicas especificas</p>
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">No se encontraron resultados.</div>
                        )}
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
