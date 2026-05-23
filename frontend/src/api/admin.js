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

<<<<<<< HEAD
    getCaracteristicasRaices() {
        return apiClient.get('/admin/caracteristicas/raices');
    },

    getCaracteristicasPorPadre(padreId) {
        return apiClient.get(`/admin/caracteristicas/${padreId}/hijas`);
    },

    crearCaracteristica(nombre, padreId = null) {
        const data = {
            nombre: nombre,
            padreId: padreId
        };
=======
    getRaices() {
        return apiClient.get('/admin/caracteristicas/raices');
    },

    getPorPadre(padreId) {
        return apiClient.get(`/admin/caracteristicas/${padreId}/hijas`);
    },

    crearCaracteristica(data) {
>>>>>>> origin/kevin
        return apiClient.post('/admin/caracteristicas', data);
    },

    eliminarCaracteristica(id) {
        return apiClient.delete(`/admin/caracteristicas/${id}`);
    }
};