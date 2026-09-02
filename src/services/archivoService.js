const API_URL = 'http://localhost:8080/api/archivos';

// Sube un archivo de imagen y devuelve la URL pública donde quedó guardado.
export const subirImagen = async (archivo) => {
    const formData = new FormData();
    formData.append('archivo', archivo);

    const response = await fetch(`${API_URL}/imagen`, {
        method: 'POST',
        body: formData, // OJO: no poner Content-Type a mano, el navegador arma el boundary del multipart solo
    });

    // El backend a veces responde JSON ({ url }) y a veces texto plano (errores).
    const textoBruto = await response.text();
    let data;
    try {
        data = JSON.parse(textoBruto);
    } catch {
        data = textoBruto;
    }

    if (!response.ok) {
        throw new Error(typeof data === 'string' ? data : 'No se pudo subir la imagen.');
    }

    return data.url;
};
