import { authFetch } from './http';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api/servicios`;

export const obtenerServicios = async () => {
    const response = await authFetch(API_URL);
    return await response.json();
};

export const crearServicio = async (servicio) => {
    const response = await authFetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(servicio)
    });
    return response;
};

export const actualizarServicio = async (id, servicio) => {
    const response = await authFetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(servicio)
    });
    return response;
};

export const eliminarServicio = async (id) => {
    return await authFetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
};
