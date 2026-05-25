import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { oferenteAPI } from '../../api/oferente'; // Ajusta la ruta si es necesario
import './OferenteHabilidades.css';

export default function OferenteHabilidades() {
    // --- ESTADOS ---
    const [misHabilidades, setMisHabilidades] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]); // Opciones en pantalla
    const [ruta, setRuta] = useState([]); // Historial de navegación
    const [categoriaActual, setCategoriaActual] = useState(null); // ID de donde estamos parados

    // Estados del formulario
    const [habilidadSeleccionada, setHabilidadSeleccionada] = useState('');
    const [nivel, setNivel] = useState('4');
    const [loading, setLoading] = useState(true);

    // 1. Cargar las habilidades que ya tiene el usuario (Panel Izquierdo)
    const cargarDatosIniciales = async () => {
        try {
            const data = await oferenteAPI.getHabilidades();
            console.log("ESTO LLEGÓ DEL BACKEND (Habilidades):", data); // Para depurar en consola

            // Validación robusta para evitar el error "misHabilidades.map is not a function"
            if (Array.isArray(data)) {
                setMisHabilidades(data);
            } else if (data && Array.isArray(data.habilidades)) {
                setMisHabilidades(data.habilidades);
            } else if (data && Array.isArray(data.lista)) {
                setMisHabilidades(data.lista);
            } else {
                setMisHabilidades([]);
            }
        } catch (error) {
            console.error("Error al cargar las habilidades del usuario:", error);
            setMisHabilidades([]); // Aseguramos que sea un arreglo vacío en caso de error
        }
    };

    // 2. Cargar un nivel específico desde el Backend (Panel Central y Derecho)
    const cargarNivel = async (idPadre) => {
        setLoading(true);
        try {
            const data = await oferenteAPI.getCaracteristicas(idPadre);
            console.log("Datos de categorías recibidos:", data);

            // Como el API devuelve el arreglo directo, asignamos data directamente
            setSubcategorias(Array.isArray(data) ? data : []);
            setHabilidadSeleccionada('');
        } catch (error) {
            console.error("Error al cargar:", error);
            setSubcategorias([]);
        } finally {
            setLoading(false);
        }
    };

    // Al cargar la página, traemos los datos del usuario y las categorías "Raíz"
    useEffect(() => {
        // Envolvemos en una función asíncrona para evitar el warning de ESLint
        const inicializar = async () => {
            await cargarDatosIniciales();
            await cargarNivel(null); // null = cargar raíces
        };
        inicializar();
    }, []);

    // --- MANEJADORES DE NAVEGACIÓN ---
    const handleEntrarCategoria = (categoria) => {
        setRuta((prev) => [...prev, categoria]);
        setCategoriaActual(categoria.id);
        cargarNivel(categoria.id); // Pide al server los hijos de esta categoría
    };

    const handleIrACategoriaDeRuta = (index, categoriaId) => {
        setRuta((prev) => prev.slice(0, index + 1));
        setCategoriaActual(categoriaId);
        cargarNivel(categoriaId);
    };

    const handleIrARaices = (e) => {
        e.preventDefault();
        setRuta([]);
        setCategoriaActual(null);
        cargarNivel(null);
    };

    // --- GUARDAR NUEVA HABILIDAD ---
    const handleGuardarHabilidad = async (e) => {
        e.preventDefault();
        if (!habilidadSeleccionada) return alert("Seleccione una característica válida.");

        const payload = {
            habilidades: [
                {
                    caracteristicaId: parseInt(habilidadSeleccionada, 10),
                    nivel: parseInt(nivel, 10)
                }
            ]
        };

        try {
            await oferenteAPI.saveHabilidad(payload);
            alert("Habilidad guardada con éxito");
            await cargarDatosIniciales(); // Refresca la tabla de la izquierda para ver la nueva habilidad
            setHabilidadSeleccionada('');
            setNivel('4');
        } catch (error) {
            console.error("Error al almacenar la nueva habilidad:", error);
            alert("Hubo un error al guardar la habilidad.");
        }
    };

    return (
        <div className="page-habilidades-container">
            <div className="admin-wrapper">
                <Navbar />

                <main className="oferente-main-content">
                    <h2>Mis habilidades</h2>

                    <div className="main-skills-container">

                        {/* PANEL 1: TABLA (Habilidades Registradas) */}
                        <div className="panel panel-habilidades">
                            <table className="skills-table">
                                <thead>
                                <tr>
                                    <th>Característica</th>
                                    <th className="text-right">Nivel</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Array.isArray(misHabilidades) && misHabilidades.length > 0 ? (
                                    misHabilidades.map((h, index) => (
                                        <tr key={h.id || index}>
                                            {/* Usamos el operador de encadenamiento opcional (?.) para evitar el error de "undefined" */}
                                            <td>{h.caracteristica?.nombre || h.caracteristicaNombre || "Sin nombre"}</td>
                                            <td className="text-right skill-level-badge">{h.nivel}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="text-muted text-center">
                                            Aún no has registrado ninguna habilidad.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* PANEL 2: EXPLORADOR */}
                        <div className="panel panel-navegacion">
                            <p className="breadcrumb-title">Ruta de exploración:</p>
                            <div className="skills-breadcrumb">
                                <a href="#" onClick={handleIrARaices} className="breadcrumb-item">
                                    Raíces
                                </a>
                                {ruta.map((r, index) => (
                                    <span key={r.id}>
                                        <span className="breadcrumb-separator"> / </span>
                                        <button
                                            onClick={() => handleIrACategoriaDeRuta(index, r.id)}
                                            className="breadcrumb-link-btn"
                                        >
                                            {r.nombre}
                                        </button>
                                    </span>
                                ))}
                            </div>

                            <div className="subcategories-list">
                                {loading ? (
                                    <p style={{ fontSize: '13px', color: '#666' }}>Cargando opciones...</p>
                                ) : Array.isArray(subcategorias) && subcategorias.length > 0 ? (
                                    subcategorias.map((sub) => (
                                        <div key={sub.id} className="subcategory-row-card">
                                            <span className="subcategory-name">{sub.nombre}</span>
                                            {/* El botón "Entrar" ahora siempre se muestra. Si la categoría no tiene hijos,
                                                simplemente mostrará "No hay características en este nivel" al entrar. */}
                                            <button
                                                onClick={() => handleEntrarCategoria(sub)}
                                                className="btn-entrar"
                                            >
                                                Entrar
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ fontSize: '13px', color: '#666', marginTop: '10px' }}>
                                        No hay características hijas en este nivel.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* PANEL 3: FORMULARIO */}
                        <div className="panel panel-agregar">
                            <form onSubmit={handleGuardarHabilidad}>
                                <h4 className="form-title">
                                    {categoriaActual ? 'Agregar Subcategoría' : 'Agregar Categoría Raíz'}
                                </h4>

                                <div className="form-group-skills">
                                    <label htmlFor="idCaracteristica">
                                        {categoriaActual ? 'Seleccione la Subcategoría' : 'Seleccione la Característica'}
                                    </label>
                                    <select
                                        id="idCaracteristica"
                                        value={habilidadSeleccionada}
                                        onChange={(e) => setHabilidadSeleccionada(e.target.value)}
                                        required
                                        disabled={loading || subcategorias.length === 0}
                                    >
                                        <option value="" disabled>
                                            -- Seleccione una opción --
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

                                <button
                                    type="submit"
                                    className="btn-agregar"
                                    disabled={loading || subcategorias.length === 0}
                                >
                                    Guardar Habilidad
                                </button>
                            </form>
                        </div>

                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}