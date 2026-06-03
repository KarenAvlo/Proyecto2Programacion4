import { useEffect, useState } from 'react';

import { adminAPI } from '../../api/admin';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './AdmiCaracteristicas.css';


export default function AdminCaracteristicas() {
    // --- ESTADOS (Datos del Back-end) ---
    const [lista, setLista] = useState([]);         // Características actuales (raices o hijas de padre)
    const [raices, setRaices] = useState([]);       // Categorías raíz para el select
    const [padre, setPadre] = useState(null);       // Categoría actual (null = raices)
    const [loading, setLoading] = useState(true);
    const [tieneHijos, setTieneHijos] = useState({}); // Mapeo de id -> boolean: si tiene hijos

    // --- ESTADOS DEL FORMULARIO ---
    const [nombreNueva, setNombreNueva] = useState('');
    const [padreIdSeleccionado, setPadreIdSeleccionado] = useState('');

    // Función para cargar características desde el backend
    const fetchData = async () => {
        setLoading(true);
        try {
            // Siempre cargar las raices (para el select y para mostrar al inicio)
            const raicesData = await adminAPI.getRaices();
            setRaices(raicesData);

            // Si padre es null, mostrar raices. Si no, mostrar hijas del padre
            let subCategoriasData = [];
            if (padre?.id) {
                subCategoriasData = await adminAPI.getPorPadre(padre.id);
            } else {
                // Al inicio (padre = null), mostrar las raices
                subCategoriasData = raicesData;
            }

            setLista(subCategoriasData);

            // Determinar cuáles categorías tienen hijos
            // Para cada categoría en lista, hacer una llamada para ver si tiene hijas
            const hijosMap = {};
            for (const cat of subCategoriasData) {
                try {
                    const hijas = await adminAPI.getPorPadre(cat.id);
                    hijosMap[cat.id] = hijas.length > 0;
                } catch {
                    hijosMap[cat.id] = false;
                }
            }
            setTieneHijos(hijosMap);

        } catch (error) {
            console.error('Error al cargar características:', error);
            alert('Error al cargar características de la base de datos');

        } finally {
            setLoading(false);
        }
    };


    // Al cargar la página o cambiar de categoría padre, pedimos los datos
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [padre]);

    // --- ACCIONES DE NAVEGACIÓN INTERNA ---
    const handleEntrarCategoria = (id, nombre) => {
        setPadre({ id, nombre });
    };

    const handleIrARaices = () => {
        setPadre(null);
    };

    // --- ACCIÓN DE GUARDAR (POST hacia el Back-end) ---
    const handleGuardar = async (e) => {
        e.preventDefault();

        if (!nombreNueva.trim()) {
            alert('El nombre de la característica es requerido');
            return;
        }

        const nueva = {
            nombre: nombreNueva,
            padreId: padreIdSeleccionado ? parseInt(padreIdSeleccionado) : null
        };

        try {
            // Enviar los datos al backend
            const response = await adminAPI.crearCaracteristica(nueva);
            console.log('Característica creada exitosamente:', response);
            alert('¡Característica creada exitosamente!');

            // Limpiar formulario y refrescar lista
            setNombreNueva('');
            setPadreIdSeleccionado('');
            fetchData();
        } catch (error) {
            console.error('Error al guardar características:', error);
            alert('Error al crear la característica. Intenta de nuevo.');

        }
    };

    const handleEliminar = async (id, nombre) => {
        if (!window.confirm(`Eliminar "${nombre}"?`)) {
            return;
        }

        try {
            await adminAPI.eliminarCaracteristica(id);
            fetchData();
        } catch (error) {
            console.error('Error al eliminar caracteristica:', error);
            alert(error.message || 'Error al eliminar la caracteristica.');
        }
    };

    return (

        <div className="page-caracteristicas-container">
            <div className="admin-wrapper">
                <Navbar />

                <main className="admin-content">
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>Características</h1>

                    {loading ? (
                        <div className="loading">Cargando características...</div>
                    ) : (
                        <div className="caracteristicas-grid">

                            {/* COLUMNA IZQUIERDA: EXPLORADOR DE CATEGORÍAS */}
                            <div className="container-green">
                                <p><strong>Ruta:</strong></p>
                                <div className="breadcrumb-row">
                                    <button onClick={handleIrARaices} className="breadcrumb-item">
                                        Raíces
                                    </button>
                                    {padre && (
                                        <>
                                            <span> / </span>
                                            <span className="breadcrumb-text">{padre.nombre}</span>
                                        </>
                                    )}
                                </div>

                                <p className="current-category-label">
                                    Categorías: <span>{padre ? padre.nombre : 'raíces'}</span>
                                </p>

                                {/* Lista dinámica */}
                                {lista.length > 0 ? (
                                    lista.map((c) => (
                                        <div key={c.id} className="list-item-card">
                                            <span className="item-name">{c.nombre}</span>
                                            {/* Solo mostrar botón "Entrar" si tiene hijos */}
                                            {tieneHijos[c.id] && (
                                                <button
                                                    onClick={() => handleEntrarCategoria(c.id, c.nombre)}
                                                    className="btn-entrar"
                                                >
                                                    Entrar
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleEliminar(c.id, c.nombre)}
                                                className="btn-eliminar"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-data-text">
                                        No hay características aquí.
                                    </div>
                                )}
                            </div>

                            {/* COLUMNA DERECHA: FORMULARIO DE CREACIÓN */}
                            <div className="container-green">
                                <h3 style={{ marginTop: 0 }}>Agregar Característica</h3>
                                <form onSubmit={handleGuardar}>
                                    <div className="form-group-local">
                                        <label>Nombre</label>
                                        <input
                                            type="text"
                                            value={nombreNueva}
                                            onChange={(e) => setNombreNueva(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-local">
                                        <label>Padre</label>
                                        <select
                                            value={padreIdSeleccionado}
                                            onChange={(e) => setPadreIdSeleccionado(e.target.value)}
                                        >
                                            <option value="">(sin padre - Raíz)</option>
                                            {raices.map((r) => (
                                                <option key={r.id} value={r.id}>
                                                    {r.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <button type="submit" className="btn-crear">Crear</button>
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
