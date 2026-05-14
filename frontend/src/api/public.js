import { apiClient } from './client';

export const publicAPI = {
    getPuestosRecientes() {
        return apiClient.get('/public/puestos/recientes');
    },

    buscarPuestos(caracteristicaIds = []) {
        if (!caracteristicaIds || caracteristicaIds.length === 0) {
            return apiClient.get('/public/puestos/buscar');
        }
        const params = caracteristicaIds.map(id => `caracteristicaIds=${id}`).join('&');
        return apiClient.get(`/public/puestos/buscar?${params}`);
    },

    getCaracteristicasRaices() {
        return apiClient.get('/admin/caracteristicas/raices');
    },

    getCaracteristicasHijas(padreId) {
        return apiClient.get(`/admin/caracteristicas/${padreId}/hijas`);
    },
};