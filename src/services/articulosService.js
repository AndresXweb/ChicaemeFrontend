const API_URL = 'http://localhost:8080/api/articulos';

export const obtenerArticulos = async () => {
    const res = await fetch(API_URL);
    return res.json();
};

// --- MÉTODO NUEVO PARA COMPLETAR EL SERVICIO ---
export const obtenerArticuloPorId = async (id) => {
    const res = await fetch(`${API_URL}/${id}`);
    return res.json();
};

export const crearArticulo = async (articulo) => {
    return await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articulo)
    });
};

export const actualizarArticulo = async (id, articulo) => {
    return await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articulo)
    });
};

export const eliminarArticulo = async (id) => {
    return await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
};