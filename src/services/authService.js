// src/services/authService.js
const API_URL = 'http://localhost:8080/api/usuarios';

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

        // Si es 200 OK, convertimos la respuesta a JSON y la devolvemos
        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Error en el login:", error);
        throw error; // Rebotamos el error para mostrarlo en la interfaz
    }
};