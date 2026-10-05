import { authFetch } from './http';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api/usuarios`;

export const obtenerUsuarios = async () => {
    const response = await authFetch(API_URL);
    return await response.json();
};

export const crearUsuario = async (usuario) => {
    const response = await authFetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    });
    return response;
};

// --- NUEVA FUNCIÓN AGREGADA COINCIDIENDO CON TU CONFIGURACIÓN DE SPRING ---
export const actualizarUsuario = async (id, usuario) => {
    const response = await authFetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    });
    return response;
};
