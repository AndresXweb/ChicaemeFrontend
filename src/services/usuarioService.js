import { authFetch } from './http';
const API_URL = 'http://localhost:8080/api/usuarios';

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