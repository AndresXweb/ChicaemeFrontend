// src/services/authService.js
const API_URL = 'http://localhost:8080/api/usuarios';

const TOKEN_KEY = 'chicaeme_token';
const USUARIO_KEY = 'usuarioChicaeme'; // se mantiene el mismo nombre que ya usa el resto del proyecto

export const loginUsuario = async (email, password) => {
    try {
        // Hacemos exactamente lo mismo que hiciste en Thunder Client: un POST con JSON
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        // Si el servidor responde con error (ej. 401 Unauthorized)
        if (!response.ok) {
            throw new Error('Correo o contraseña incorrectos');
        }

        // IMPORTANTE: desde que se agregó JWT en el backend, /login ya NO devuelve
        // el usuario directamente. Ahora devuelve { token, usuario }.
        const data = await response.json();

        // Guardamos el token (lo necesita cada petición protegida) y el usuario
        // por separado, usando la MISMA clave 'usuarioChicaeme' que ya usa el
        // resto de la app para no tener que tocar cada página que lo lee.
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USUARIO_KEY, JSON.stringify(data.usuario));

        return data.usuario;

    } catch (error) {
        console.error("Error en el login:", error);
        throw error; // Rebotamos el error para mostrarlo en la interfaz
    }
};

// Pide el enlace de recuperación. El backend SIEMPRE responde con el mismo
// texto (exista o no el correo), y en TEXTO PLANO, no JSON — por eso .text()
// y no .json() (si no, truena igual que nos pasó con ContactosAdmin).
export const solicitarRecuperacion = async (email) => {
    const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    return await response.text();
};

// Restablece la contraseña con el token que llegó por correo.
// También responde en texto plano, y aquí SÍ nos interesa si fue error o no
// (token vencido/ inválido), por eso revisamos response.ok.
export const restablecerPassword = async (token, password) => {
    const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
    });

    const mensaje = await response.text();

    if (!response.ok) {
        throw new Error(mensaje || 'El enlace no es válido o ya expiró.');
    }

    return mensaje;
};

export const logoutUsuario = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

// Header listo para pegar en cualquier fetch protegido.
// Si no hay token todavía, no agrega nada (así no rompe los endpoints públicos).
export const authHeader = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};