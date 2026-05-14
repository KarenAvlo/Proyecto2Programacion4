
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './RegistroEmpresa.css';

export default function RegistroEmpresa() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        clave: '',
        telefono: '',
        localizacion: '',
        descripcion: '',
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
            await authAPI.registroEmpresa(formData);
            alert('Empresa registrada correctamente. Queda pendiente de aprobación.');
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
                    <h2>Registro Empresa</h2>
                    <p className="registro-subtitle">Crea una cuenta para publicar tus puestos</p>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit} className="registro-form">
                        <div className="form-group">
                            <label>Nombre de la Empresa:</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                placeholder="Nombre de tu empresa"
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
                                    placeholder="empresa@correo.com"
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

                        <div className="form-row">
                            <div className="form-group">
                                <label>Teléfono:</label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    required
                                    placeholder="8888-8888"
                                />
                            </div>
                            <div className="form-group">
                                <label>Localización:</label>
                                <input
                                    type="text"
                                    name="localizacion"
                                    value={formData.localizacion}
                                    onChange={handleChange}
                                    required
                                    placeholder="San José, CR"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Descripción de la Empresa:</label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                required
                                placeholder="Describe tu empresa"
                                rows="4"
                            />
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