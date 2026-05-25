
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const apiClient = {
    async request(method, endpoint, data = null, options = {}) {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method,
            headers,
            ...options,
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            if (data instanceof FormData) {
                config.body = data;
                // Dejamos que el navegador decida el Content-Type y su boundary
                delete headers['Content-Type'];
            } else {
                config.body = JSON.stringify(data);
            }
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

            if (!response.ok) {
                const error = await response.json().catch(() => ({ mensaje: 'Error desconocido' }));
                const err = new Error(error.mensaje || `HTTP ${response.status}`);
                err.status = response.status;
                throw err;
            }

            // Algunas respuestas no tienen body
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            }
            return response;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    get(endpoint, options = {}) {
        return this.request('GET', endpoint, null, options);
    },

    post(endpoint, data, options = {}) {
        return this.request('POST', endpoint, data, options);
    },

    put(endpoint, data, options = {}) {
        return this.request('PUT', endpoint, data, options);
    },

    delete(endpoint, options = {}) {
        return this.request('DELETE', endpoint, null, options);
    },
};
