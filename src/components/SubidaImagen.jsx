import React, { useRef, useState } from 'react';
import { subirImagen } from '../services/archivoService';

// Selector de imagen reutilizable: muestra vista previa, sube el archivo apenas
// se elige, y devuelve la URL final vía onChange. El padre solo guarda esa URL
// en su propio formData - igual que antes con el input de texto, pero ahora
// la URL la genera el backend en vez de escribirla la persona a mano.
const SubidaImagen = ({ value, onChange, label = 'Foto' }) => {
  const inputRef = useRef(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState('');

  const manejarSeleccion = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setError('');
    setSubiendo(true);
    try {
      const url = await subirImagen(archivo);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubiendo(false);
      e.target.value = ''; // permite elegir el mismo archivo otra vez si hace falta
    }
  };

  return (
    <div>
      {label && (
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>
          {label}
        </label>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '12px', overflow: 'hidden',
          background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', color: '#94A3B8', flexShrink: 0, border: '1px solid #E2E8F0'
        }}>
          {value ? (
            <img src={value} alt="Vista previa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : 'Sin foto'}
        </div>

        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={subiendo}
            style={{
              padding: '8px 14px', borderRadius: '8px', border: '1px solid #E2E8F0',
              background: 'white', fontSize: '13px', fontWeight: '500',
              cursor: subiendo ? 'not-allowed' : 'pointer', color: '#334155'
            }}
          >
            {subiendo ? 'Subiendo...' : (value ? 'Cambiar foto' : 'Subir foto')}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={manejarSeleccion}
            style={{ display: 'none' }}
          />
          {error && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '6px' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default SubidaImagen;
