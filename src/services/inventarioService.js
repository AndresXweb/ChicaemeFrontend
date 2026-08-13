import { authFetch } from './http';
// src/services/inventarioService.js
const API_URL = 'http://localhost:8080/api/articulos';

export const obtenerInventarioParaCotizar = async () => {
    const response = await authFetch(API_URL);
    return await response.json();
};