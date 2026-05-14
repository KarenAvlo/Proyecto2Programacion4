import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './RegistroOferente.css';

export default function RegistroOferente() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        cedula: '',
        nombre: '',
        apellido: '',
        nacionalidad: '',
        telefono: '',
        residencia: '',
        email: '',
        clave: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authAPI.registroOferente(formData);
            alert('Oferente registrado correctamente. Queda pendiente de aprobación.');
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Error en el registro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registro-wrapper">
            <Navbar />

            <main className="registro-main">
                <div className="registro-container">
                    <h2>Registro Oferente</h2>
                    <p className="registro-subtitle">Crea una cuenta para buscar empleos</p>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit} className="registro-form">
                        <div className="form-group">
                            <label>Cédula (Identificación):</label>
                            <input
                                type="text"
                                name="cedula"
                                value={formData.cedula}
                                onChange={handleChange}
                                required
                                minLength="9"
                                maxLength="9"
                                placeholder="1-1111-1111"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    placeholder="Tu nombre"
                                />
                            </div>
                            <div className="form-group">
                                <label>Primer Apellido:</label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    required
                                    placeholder="Tu apellido"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Nacionalidad:</label>
                                <input
                                    type="text"
                                    name="nacionalidad"
                                    value={formData.nacionalidad}
                                    onChange={handleChange}
                                    required
                                    placeholder="Costarricense"
                                />
                            </div>
                            <div className="form-group">
                                <label>Teléfono:</label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    required
                                    minLength="8"
                                    maxLength="8"
                                    placeholder="8888-8888"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Lugar de Residencia:</label>
                            <input
                                type="text"
                                name="residencia"
                                value={formData.residencia}
                                onChange={handleChange}
                                required
                                placeholder="San José, CR"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Correo Electrónico:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>Contraseña:</label>
                                <input
                                    type="password"
                                    name="clave"
                                    value={formData.clave}
                                    onChange={handleChange}
                                    required
                                    minLength="6"
                                    placeholder="Mínimo 6 caracteres"
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Registrando...' : 'Registrarse'}
                        </button>
                    </form>

                    <div className="registro-footer">
                        <p>¿Ya tienes cuenta? <a onClick={() => navigate('/login')}>Inicia sesión aquí</a></p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}