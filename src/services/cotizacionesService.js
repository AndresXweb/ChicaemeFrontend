import { authFetch } from './http';
const API_URL = 'http://localhost:8080/api/cotizaciones';

// 1. OBTENER TODAS (GET)
export const obtenerCotizaciones = async () => {
    const response = await authFetch(API_URL);
    return await response.json();
};

// 2. CREAR (POST)
export const crearCotizacion = async (cotizacion) => {
    const response = await authFetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cotizacion)
    });
    return response;
};

// 3. ACTUALIZAR (PUT)
export const actualizarCotizacion = async (id, cotizacion) => {
    const response = await authFetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cotizacion)
    });
    return response;
};

// 4. ELIMINAR (DELETE)
export const eliminarCotizacion = async (id) => {
    const response = await authFetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    return response;
};

// 5. NUEVO MOTOR DE ESTADOS (PUT) - Reemplaza a "aprobarCotizacion"
export const cambiarEstadoCotizacion = async (id, nuevoEstado) => {
    // Pasamos el nuevo estado como parámetro de consulta en la URL (?estado=...)
    const response = await authFetch(`${API_URL}/${id}/estado?estado=${nuevoEstado}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    });
    return response;
};