import { apiClient } from './client';

export const empresaAPI = {
    getPerfil() {
        return apiClient.get('/empresa/perfil');
    },

    crearPuesto(data) {
        return apiClient.post('/empresa/puestos', data);
    },

    getPuestos() {
        return apiClient.get('/empresa/puestos');
    },

    getPuesto(id) {
        return apiClient.get(`/empresa/puestos/${id}`);
    },

    desactivarPuesto(id) {
        return apiClient.delete(`/empresa/puestos/${id}`);
    },

    buscarCandidatos(puestoId) {
        return apiClient.get(`/empresa/puestos/${puestoId}/candidatos`);
    },
};