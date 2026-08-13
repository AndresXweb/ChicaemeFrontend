// src/services/http.js
import { authHeader } from './authService';

// Wrapper sobre fetch que agrega automáticamente el header
// "Authorization: Bearer <token>" si hay una sesión guardada.
// Es seguro usarlo también en endpoints públicos: si no hay token,
// simplemente no agrega el header y la petición sigue igual que antes.
export const authFetch = (url, options = {}) => {
    const headers = {
        ...(options.headers || {}),
        ...authHeader()
    };
    return fetch(url, { ...options, headers });
};