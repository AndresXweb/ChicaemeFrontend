import { authFetch } from './http';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api/articulos`;

export const obtenerArticulos = async () => {
    const res = await authFetch(API_URL);
    return res.json();
};

// --- MÉTODO NUEVO PARA COMPLETAR EL SERVICIO ---
export const obtenerArticuloPorId = async (id) => {
    const res = await authFetch(`${API_URL}/${id}`);
    return res.json();
};

export const crearArticulo = async (articulo) => {
    return await authFetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articulo)
    });
};

export const actualizarArticulo = async (id, articulo) => {
    return await authFetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articulo)
    });
};

export const eliminarArticulo = async (id) => {
    return await authFetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
};
