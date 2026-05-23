import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './OferenteHabilidades.css';

export default function OferenteHabilidades() {
    // --- ESTADOS ---
    const [misHabilidades, setMisHabilidades] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [ruta, setRuta] = useState([]);
    const [categoriaActual, setCategoriaActual] = useState(null);

    // Estados del formulario
    const [habilidadSeleccionada, setHabilidadSeleccionada] = useState('');
    const [nivel, setNivel] = useState('4');
    const [loading, setLoading] = useState(true);

    // Carga inicial de datos (Habilidades del usuario y categorías raíz)
    const cargarDatosIniciales = async () => {
        setLoading(true);
        try {
            // TODO: reemplazar por llamadas reales (oferenteAPI.getHabilidades())
            const habilidadesMock = [
                { id: 1, idCaracteristica: { id: 101, nombre: 'React' }, nivel: 5 },
                { id: 2, idCaracteristica: { id: 102, nombre: 'Java Boot' }, nivel: 4 }
            ];
            setMisHabilidades(habilidadesMock);
        } catch (error) {
            console.error("Error al cargar las habilidades del usuario:", error);
        } finally {
            setLoading(false);
        }
    };

    const cargarSubcategorias = async (idPadre) => {
        try {
            // TODO: reemplazar por llamada al backend (adminAPI.getPorPadre)
            if (!idPadre) {
                setSubcategorias([
                    { id: 10, nombre: 'Lenguajes de Programación' },
                    { id: 20, nombre: 'Bases de Datos' },
                    { id: 30, nombre: 'Habilidades Blandas' }
                ]);
                setRuta([]);
            } else {
                if (idPadre === 10) {
                    setSubcategorias([
                        { id: 101, nombre: 'JavaScript' },
                        { id: 102, nombre: 'Java' },
                        { id: 103, nombre: 'Python' }
                    ]);
                    setRuta([{ id: 10, nombre: 'Lenguajes de Programación' }]);
                } else if (idPadre === 20) {
                    setSubcategorias([
                        { id: 201, nombre: 'PostgreSQL' },
                        { id: 202, nombre: 'MongoDB' }
                    ]);
                    setRuta([{ id: 20, nombre: 'Bases de Datos' }]);
                } else {
                    setSubcategorias([]);
                }
            }

            setHabilidadSeleccionada('');
        } catch (error) {
            console.error("Error al mapear subcategorías:", error);
        }
    };

    // Carga inicial y reaccionar a cambios de categoría (usar IIFE async para evitar warnings)
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                await cargarDatosIniciales();
            } catch (e) {
                console.error(e);
            } finally {
                if (mounted) {
                    // cargarDatosIniciales ya maneja loading
                }
            }
        })();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                await cargarSubcategorias(categoriaActual);
            } catch (e) {
                console.error(e);
            } finally {
                if (mounted) {
                    // noop
                }
            }
        })();
        return () => { mounted = false; };
    }, [categoriaActual]);

    const handleEntrarCategoria = (id) => {
        setCategoriaActual(id);
    };

    const handleIrARaices = (e) => {
        e.preventDefault();
        setCategoriaActual(null);
    };

    const handleGuardarHabilidad = async (e) => {
        e.preventDefault();
        if (!habilidadSeleccionada) return alert("Seleccione una característica válida.");

        const nuevaHabilidad = {
            idCaracteristica: habilidadSeleccionada,
            nivel: parseInt(nivel, 10)
        };

        try {
            console.log("Enviando al backend:", nuevaHabilidad);
            // Aquí llamarías a tu API (e.g., await oferenteAPI.saveHabilidad(nuevaHabilidad))

            // Recargamos o refrescamos la lista localmente para ver el cambio instantáneo
            cargarDatosIniciales();
            // Limpieza básica del formulario
            setHabilidadSeleccionada('');
            setNivel('4');
        } catch (error) {
            console.error("Error al almacenar la nueva habilidad:", error);
        }
    };

    return (
        <div className="page-habilidades-container">
            <div className="admin-wrapper">
                <Navbar />

                <main className="oferente-main-content">
                    <h2>Mis habilidades</h2>

                    {loading ? (
                        <div className="loading-spinner">Cargando tu perfil de habilidades...</div>
                    ) : (
                        <div className="main-skills-container">

                            {/* TABLA DE MIS HABILIDADES */}
                            <div className="panel panel-habilidades">
                                <table className="skills-table">
                                    <thead>
                                    <tr>
                                        <th>Característica</th>
                                        <th className="text-right">Nivel</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {misHabilidades.map((h) => (
                                        <tr key={h.id}>
                                            <td>{h.idCaracteristica.nombre}</td>
                                            <td className="text-right skill-level-badge">{h.nivel}</td>
                                        </tr>
                                    ))}
                                    {misHabilidades.length === 0 && (
                                        <tr>
                                            <td colSpan="2" className="text-muted text-center">
                                                Aún no has registrado ninguna habilidad.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            {/* EXPLORADOR DE NAVEGACIÓN */}
                            <div className="panel panel-navegacion">
                                <p className="breadcrumb-title">Ruta:</p>
                                <div className="skills-breadcrumb">
                                    <a href="#" onClick={handleIrARaices} className="breadcrumb-item">
                                        Raíces
                                    </a>
                                    {ruta.map((r) => (
                                        <span key={r.id}>
                                            <span className="breadcrumb-separator"> / </span>
                                            <button
                                                onClick={() => handleEntrarCategoria(r.id)}
                                                className="breadcrumb-link-btn"
                                            >
                                                {r.nombre}
                                            </button>
                                        </span>
                                    ))}
                                </div>

                                <div className="subcategories-list">
                                    {Array.isArray(subcategorias) && subcategorias.length > 0
                                        ? subcategorias.map((sub) => (
                                            <div key={sub.id} className="subcategory-row-card">
                                                <span className="subcategory-name">{sub.nombre}</span>
                                                <button
                                                    onClick={() => handleEntrarCategoria(sub.id)}
                                                    className="btn-entrar"
                                                >
                                                    Entrar
                                                </button>
                                            </div>
                                        ))
                                        : null}
                                </div>
                            </div>

                            {/* FORMULARIO DE AGREGAR */}
                            <div className="panel panel-agregar">
                                <form onSubmit={handleGuardarHabilidad}>
                                    <h4 className="form-title">Agregar Habilidad</h4>

                                    <div className="form-group-skills">
                                        <label htmlFor="idCaracteristica">Característica</label>
                                        <select
                                            id="idCaracteristica"
                                            value={habilidadSeleccionada}
                                            onChange={(e) => setHabilidadSeleccionada(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>
                                                -- Seleccione una --
                                            </option>
                                            {subcategorias.map((opt) => (
                                                <option key={opt.id} value={opt.id}>
                                                    {opt.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group-skills">
                                        <label htmlFor="nivel">Nivel (1-5)</label>
                                        <input
                                            id="nivel"
                                            type="number"
                                            min="1"
                                            max="5"
                                            value={nivel}
                                            onChange={(e) => setNivel(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="btn-agregar">
                                        Guardar
                                    </button>
                                </form>
                            </div>

                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </div>
    );
}
