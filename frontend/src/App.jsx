import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

// Páginas públicas
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegistroEmpresa from './pages/public/RegistroEmpresa';
import RegistroOferente from './pages/public/RegistroOferente';

// Dashboards
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEmpresas from './pages/admin/AdminEmpresas';
import AdminOferentes from './pages/admin/AdminOferentes';
import AdminCaracteristicas from './pages/admin/AdmiCaracteristicas';
import AdminReportes from './pages/admin/AdminReportes';
import EmpresaDashboard from './pages/empresa/EmpresaDashboard';
import OferenteDashboard from './pages/oferente/OferenteDashboard';
import OferenteHabilidades from './pages/oferente/OferenteHabilidades';
import CVform from './pages/oferente/CVform';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registro/empresa" element={<RegistroEmpresa />} />
                <Route path="/registro/oferente" element={<RegistroOferente />} />

                {/* Admin */}
                <Route element={<PrivateRoute requiredRole="ADMIN" />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/empresas" element={<AdminEmpresas />} />
                    <Route path="/admin/oferentes" element={<AdminOferentes />} />
                    <Route path="/admin/caracteristicas" element={<AdminCaracteristicas />} />
                    <Route path="/admin/reportes" element={<AdminReportes />} />
                </Route>

                {/* Empresa */}
                <Route element={<PrivateRoute requiredRole="EMPRESA" />}>
                    <Route path="/empresa/dashboard" element={<EmpresaDashboard />} />
                </Route>

                {/* Oferente */}
                <Route element={<PrivateRoute requiredRole="OFERENTE" />}>
                    <Route path="/oferente/dashboard" element={<OferenteDashboard />} />
                    <Route path="/oferente/habilidades" element={<OferenteHabilidades />} />
                    <Route path="/oferente/cv" element={<CVform />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}