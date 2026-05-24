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

// Reemplaza los métodos del final en src/api/empresa.js con esto:

    // Usamos el endpoint que tu EmpresaRestController expone legalmente para buscar candidatos de un puesto
    getOferentesPorPuesto(puestoId) {
        return apiClient.get(`/empresa/puestos/${puestoId}/candidatos`);
    },

    // Endpoint individual accesible para ver las habilidades detalladas
    getDetalleCandidato(cedula) {
        return apiClient.get(`/empresa/candidatos/${cedula}/detalle`);
    },

    // Usamos las características del controlador de oferentes que está abierto para consulta de catálogos


    getOferentesGlobales() {
        // Apunta al nuevo endpoint seguro en la sección de empresas
        return apiClient.get('/empresa/busqueda-global');
    },
    getCaracteristicasCatalogo() {
        // Trae las habilidades desde la zona autorizada de empresas
        return apiClient.get('/empresa/catalogo-caracteristicas');
    }
};
