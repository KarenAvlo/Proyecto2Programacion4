import { apiClient } from './client';

export const oferenteAPI = {
    getPerfil() {
        return apiClient.get('/oferente/perfil');
    },

    getHabilidades() {
        return apiClient.get('/oferente/habilidades');
    },

    guardarHabilidades(habilidades) {
        return apiClient.post('/oferente/habilidades', { habilidades });
    },

    subirCV(archivo) {
        const formData = new FormData();
        formData.append('archivo', archivo);

        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
        return fetch(`${apiUrl}/oferente/cv/subir`, {
            method: 'POST',
            headers,
            body: formData,
        }).then(r => {
            if (!r.ok) throw new Error('Error al subir CV');
            return r.json();
        });
    },

    async obtenerCVBlob(cedula) {
        const response = await apiClient.get(`/oferente/cv/descargar/${cedula}`);
        return response.blob();
    },

    descargarCV(cedula) {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
        window.open(`${apiUrl}/oferente/cv/descargar/${cedula}?token=${token}`);
    },

    getDetalles(cedula) {
        return apiClient.get(`/oferente/detalles/${cedula}`);
    },
};
