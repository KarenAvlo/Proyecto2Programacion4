import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

// Páginas públicas
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegistroEmpresa from './pages/public/RegistroEmpresa';
import RegistroOferente from './pages/public/RegistroOferente';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEmpresas from './pages/admin/AdminEmpresas';
import AdminOferentes from './pages/admin/AdminOferentes';
import AdminReportes from './pages/admin/AdminReportes';
import AdmiCaracteristicas from './pages/admin/AdmiCaracteristicas';

// Empresa
import EmpresaDashboard from './pages/empresa/EmpresaDashboard';

// Oferente
import OferenteDashboard from './pages/oferente/OferenteDashboard';

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
                    <Route path="/admin/reportes" element={<AdminReportes />} />
                    <Route path="/admin/caracteristicas" element={<AdmiCaracteristicas />} />
                </Route>

                {/* Empresa */}
                <Route element={<PrivateRoute requiredRole="EMPRESA" />}>
                    <Route path="/empresa/dashboard" element={<EmpresaDashboard />} />
                </Route>

                {/* Oferente */}
                <Route element={<PrivateRoute requiredRole="OFERENTE" />}>
                    <Route path="/oferente/dashboard" element={<OferenteDashboard />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}