import { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { oferenteAPI } from '../../api/oferente';
import './OferenteHabilidades.css';

export default function OferenteHabilidades() {
    const [misHabilidades, setMisHabilidades] = useState([]);
    const [opcionesActuales, setOpcionesActuales] = useState([]);
    const [ruta, setRuta] = useState([]);
    const [habilidadSeleccionada, setHabilidadSeleccionada] = useState('');
    const [nivel, setNivel] = useState('3');
    const [loadingHabilidades, setLoadingHabilidades] = useState(true);
    const [loadingOpciones, setLoadingOpciones] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);

    const cargarMisHabilidades = useCallback(async () => {
        setLoadingHabilidades(true);
        try {
            const data = await oferenteAPI.getHabilidades();
            setMisHabilidades(Array.isArray(data) ? data : (data?.habilidades || data?.lista || []));
        } catch (err) {
            console.error('Error al cargar habilidades del oferente:', err);
            setMisHabilidades([]);
            setError('No se pudieron cargar tus habilidades registradas.');
        } finally {
            setLoadingHabilidades(false);
        }
    }, []);

    const cargarOpciones = useCallback(async (padreId = null) => {
        setLoadingOpciones(true);
        setError(null);
        try {
            const data = await oferenteAPI.getCaracteristicas(padreId);
            setOpcionesActuales(Array.isArray(data) ? data : []);
            setHabilidadSeleccionada('');
        } catch (err) {
            console.error('Error al cargar caracteristicas:', err);
            setOpcionesActuales([]);
            setError('No se pudieron cargar las caracteristicas disponibles.');
        } finally {
            setLoadingOpciones(false);
        }
    }, []);

    useEffect(() => {
        void Promise.resolve().then(() => {
            cargarMisHabilidades();
            cargarOpciones(null);
        });
    }, [cargarMisHabilidades, cargarOpciones]);

    const opcionSeleccionada = useMemo(
        () => opcionesActuales.find((opcion) => String(opcion.id) === String(habilidadSeleccionada)),
        [habilidadSeleccionada, opcionesActuales]
    );

    const handleEntrarCategoria = (categoria) => {
        if (!categoria.tieneHijos) return;
        setRuta((prev) => [...prev, categoria]);
        cargarOpciones(categoria.id);
    };

    const handleIrARaices = () => {
        setRuta([]);
        cargarOpciones(null);
    };

    const handleIrACategoriaDeRuta = (index) => {
        const nuevaRuta = ruta.slice(0, index + 1);
        setRuta(nuevaRuta);
        cargarOpciones(nuevaRuta[index].id);
    };

    const handleGuardarHabilidad = async (e) => {
        e.preventDefault();

        if (!habilidadSeleccionada) {
            setError('Selecciona una caracteristica antes de guardar.');
            return;
        }

        const nivelNumerico = Number(nivel);
        if (Number.isNaN(nivelNumerico) || nivelNumerico < 1 || nivelNumerico > 5) {
            setError('El nivel debe estar entre 1 y 5.');
            return;
        }

        const payload = {
            habilidades: [
                {
                    caracteristicaId: Number(habilidadSeleccionada),
                    nivel: nivelNumerico,
                },
            ],
        };

        setGuardando(true);
        setMensaje(null);
        setError(null);
        try {
            const response = await oferenteAPI.saveHabilidad(payload);
            await cargarMisHabilidades();
            setHabilidadSeleccionada('');
            setNivel('3');
            setMensaje(response?.mensaje || 'Habilidad guardada correctamente.');
        } catch (err) {
            console.error('Error al guardar habilidad:', err);
            setError(err.message || 'Hubo un error al guardar la habilidad.');
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="page-habilidades-container">
            <div className="admin-wrapper">
                <Navbar />

                <main className="oferente-main-content">
                    <h2>Mis habilidades</h2>

                    {mensaje && <div className="skills-alert skills-alert-success">{mensaje}</div>}
                    {error && <div className="skills-alert skills-alert-error">{error}</div>}

                    <div className="main-skills-container">
                        <section className="panel panel-habilidades" aria-label="Habilidades registradas">
                            <h3 className="panel-title">Registradas</h3>
                            <table className="skills-table">
                                <thead>
                                <tr>
                                    <th>Caracteristica</th>
                                    <th className="text-right">Nivel</th>
                                </tr>
                                </thead>
                                <tbody>
                                {loadingHabilidades ? (
                                    <tr>
                                        <td colSpan="2" className="text-muted text-center">Cargando...</td>
                                    </tr>
                                ) : misHabilidades.length > 0 ? (
                                    misHabilidades.map((h) => (
                                        <tr key={h.id || `${h.caracteristicaId}-${h.nivel}`}>
                                            <td>{h.caracteristicaNombre || h.caracteristica?.nombre || 'Sin nombre'}</td>
                                            <td className="text-right skill-level-badge">{h.nivel}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="text-muted text-center">
                                            Aun no has registrado ninguna habilidad.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </section>

                        <section className="panel panel-navegacion" aria-label="Explorador de caracteristicas">
                            <h3 className="panel-title">Explorar</h3>
                            <p className="breadcrumb-title">Ruta</p>
                            <div className="skills-breadcrumb">
                                <button type="button" onClick={handleIrARaices} className="breadcrumb-link-btn">
                                    Raiz
                                </button>
                                {ruta.map((r, index) => (
                                    <span key={r.id} className="breadcrumb-segment">
                                        <span className="breadcrumb-separator">/</span>
                                        <button
                                            type="button"
                                            onClick={() => handleIrACategoriaDeRuta(index)}
                                            className="breadcrumb-link-btn"
                                        >
                                            {r.nombre}
                                        </button>
                                    </span>
                                ))}
                            </div>

                            <div className="subcategories-list">
                                {loadingOpciones ? (
                                    <p className="text-muted">Cargando opciones...</p>
                                ) : opcionesActuales.length > 0 ? (
                                    opcionesActuales.map((opcion) => (
                                        <div key={opcion.id} className="subcategory-row-card">
                                            <span className="subcategory-name">{opcion.nombre}</span>
                                            {opcion.tieneHijos && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleEntrarCategoria(opcion)}
                                                    className="btn-entrar"
                                                >
                                                    Entrar
                                                </button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted">No hay caracteristicas hijas en este nivel.</p>
                                )}
                            </div>
                        </section>

                        <section className="panel panel-agregar" aria-label="Agregar habilidad">
                            <form onSubmit={handleGuardarHabilidad}>
                                <h3 className="panel-title">Agregar o actualizar</h3>

                                <div className="form-group-skills">
                                    <label htmlFor="idCaracteristica">Caracteristica</label>
                                    <select
                                        id="idCaracteristica"
                                        value={habilidadSeleccionada}
                                        onChange={(e) => setHabilidadSeleccionada(e.target.value)}
                                        required
                                        disabled={loadingOpciones || opcionesActuales.length === 0}
                                    >
                                        <option value="" disabled>
                                            Seleccione una opcion
                                        </option>
                                        {opcionesActuales.map((opt) => (
                                            <option key={opt.id} value={opt.id}>
                                                {opt.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group-skills">
                                    <label htmlFor="nivel">Nivel</label>
                                    <select
                                        id="nivel"
                                        value={nivel}
                                        onChange={(e) => setNivel(e.target.value)}
                                        required
                                    >
                                        {[1, 2, 3, 4, 5].map((valor) => (
                                            <option key={valor} value={valor}>
                                                {valor}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {opcionSeleccionada && (
                                    <p className="selected-skill-note">
                                        Se guardara: <strong>{opcionSeleccionada.nombre}</strong>
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="btn-agregar"
                                    disabled={guardando || loadingOpciones || opcionesActuales.length === 0}
                                >
                                    {guardando ? 'Guardando...' : 'Guardar habilidad'}
                                </button>
                            </form>
                        </section>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}
