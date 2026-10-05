import { authFetch } from './http';
import { API_BASE_URL } from '../config';

// src/services/inventarioService.js
const API_URL = `${API_BASE_URL}/api/articulos`;

export const obtenerInventarioParaCotizar = async () => {
    const response = await authFetch(API_URL);
    return await response.json();
};
