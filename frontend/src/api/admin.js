import { apiClient } from './client';

export const adminAPI = {
    getEmpresasPendientes() {
        return apiClient.get('/admin/empresas/pendientes');
    },

    getOferentesPendientes() {
        return apiClient.get('/admin/oferentes/pendientes');
    },

    aprobarEmpresa(email) {
        return apiClient.put(`/admin/empresas/${email}/aprobar`, {});
    },

    aprobarOferente(email) {
        return apiClient.put(`/admin/oferentes/${email}/aprobar`, {});
    },

    getCaracteristicas() {
        return apiClient.get('/admin/caracteristicas');
    },

    crearCaracteristica(data) {
        return apiClient.post('/admin/caracteristicas', data);
    },
};