import { apiClient } from './client';

export const authAPI = {
    login(email, clave) {
        return apiClient.post('/auth/login', { email, clave });
    },

    registroEmpresa(data) {
        return apiClient.post('/public/empresas/registro', data);
    },

    registroOferente(data) {
        return apiClient.post('/public/oferentes/registro', data);
    },
};