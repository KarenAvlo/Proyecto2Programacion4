import { apiClient } from './client';

export const publicAPI = {
    getPuestosRecientes() {
        return apiClient.get('/public/puestos/recientes');
    },

    buscarPuestos({ caracteristicaIds = [], moneda = '' } = {}) {
        const params = new URLSearchParams();

        if (moneda) {
            params.append('moneda', moneda);
        }

        caracteristicaIds.forEach(id => {
            params.append('caracteristicaIds', id);
        });

        const query = params.toString();
        return apiClient.get(`/public/puestos/buscar${query ? `?${query}` : ''}`);
    },

    getCaracteristicasPublicas() {
        return apiClient.get('/public/caracteristicas');
    },
};
