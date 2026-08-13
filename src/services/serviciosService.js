import { authFetch } from './http';
const API_URL = 'http://localhost:8080/api/servicios';

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