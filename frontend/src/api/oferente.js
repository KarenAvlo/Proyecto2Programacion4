import { apiClient } from './client';

export const oferenteAPI = {
    getPerfil() {
        return apiClient.get('/oferente/perfil');
    },

    //Requiere responseType 'blob' para PDFs)
    async obtenerCVBlob(cedula) {
        const response = await apiClient.get(`/oferente/cv/descargar/${cedula}`);
        return response.blob();
    },

    //Subir el CV
    subirCV(file) {
        const formData = new FormData();
        formData.append('archivo', file);
        return apiClient.post('/oferente/cv/subir', formData);
    },
/*
    getCaracteristicasCatalogo() {
        // Usa la ruta que sepas que devuelve todas las características de la BD
        return apiClient.get('/caracteristicas');
    },
 */

    //Obtener las habilidades
    getHabilidades() {
        return apiClient.get('/oferente/habilidades');
    },

    //Guardar habilidad
    saveHabilidad(data) {
        return apiClient.post('/oferente/habilidades', data);
    },

    //obtiene la lista completa de caracteristicas
    getCaracteristicas(idPadre = null) {
        const url = idPadre
            ? `/oferente/caracteristicas?padreId=${idPadre}`
            : `/oferente/caracteristicas`;

        return apiClient.get(url);
    }
/*
    //Obtener categorías/características
    getSubcategorias(idPadre) {
        if (idPadre) {
            // Reemplaza esto por la ruta exacta de tu Spring Boot para "Listar Hijas"
            return apiClient.get(`/caracteristicas/hijas/${idPadre}`);
        } else {
            // Reemplaza esto por la ruta exacta de tu Spring Boot para "Listar Raíces"
            return apiClient.get('/caracteristicas/raices');
        }
    }
*/
};
