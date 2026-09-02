import React, { useState, useEffect } from 'react';
import { obtenerServicios, crearServicio, actualizarServicio, eliminarServicio } from '../services/serviciosService';
import SubidaImagen from '../components/SubidaImagen';

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  fontSize: '13px',
  border: '0.5px solid var(--color-border-secondary, #cbd5e1)',
  borderRadius: '8px',
  background: 'var(--color-background-primary, #fff)',
  color: 'var(--color-text-primary, #0f172a)',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const labelStyle = {
  display: 'block', fontSize: '12px', fontWeight: 500,
  color: 'var(--color-text-secondary, #64748b)',
  marginBottom: '6px', letterSpacing: '0.02em',
};

const Servicios = () => {
  const [servicios, setServicios]       = useState([]);
  const [modoEdicion, setModoEdicion]   = useState(false);
  const [idEdicion, setIdEdicion]       = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  // Estados para el Visor de Imágenes (Lightbox)
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [nivelZoom, setNivelZoom]                   = useState(1);

  const emptyForm = { nombre: '', descripcion: '', precioBase: '', unidadMedida: '', imagen: '' };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { cargarServicios(); }, []);

  const cargarServicios = async () => {
    try { setServicios(await obtenerServicios()); }
    catch (e) { console.error(e); }
  };

  const manejarCambio = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const enviarFormulario = async (e) => {
    e.preventDefault();
    try {
      const res = modoEdicion ? await actualizarServicio(idEdicion, formData) : await crearServicio(formData);
      if (res.ok) { cancelarEdicion(); cargarServicios(); }
      else alert('Error en la operación.');
    } catch (err) { console.error(err); }
  };

  const prepararEdicion = (s) => {
    setModoEdicion(true); setIdEdicion(s.id);
    setFormData({ 
        nombre: s.nombre, 
        descripcion: s.descripcion, 
        precioBase: s.precioBase, 
        unidadMedida: s.unidadMedida,
        imagen: s.imagen || '' 
    });
  };

  const cancelarEdicion = () => { setModoEdicion(false); setIdEdicion(null); setFormData(emptyForm); };

  const manejarEliminar = async (id) => {
    if (window.confirm('¿Eliminar este servicio del catálogo?')) {
      const res = await eliminarServicio(id);
      if (res.ok) cargarServicios();
    }
  };

  const focused = (name) => ({
    ...inputStyle,
    borderColor: focusedInput === name ? '#6366f1' : undefined,
    boxShadow: focusedInput === name ? '0 0 0 3px rgba(99,102,241,0.12)' : undefined,
  });

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>

        {/* ── FORMULARIO ── */}
        <div style={{
          background: 'var(--color-background-primary, #fff)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: '12px', overflow: 'hidden',
        }}>
          <div style={{ height: '3px', background: modoEdicion ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#0ea5e9,#38bdf8)' }} />
          <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {modoEdicion ? `Editar #${idEdicion}` : 'Nuevo servicio'}
              </div>
              <div style={{ fontSize: '17px', fontWeight: 500, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                {modoEdicion ? 'Modificar servicio' : 'Agregar al catálogo'}
              </div>
            </div>

            <form onSubmit={enviarFormulario} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Nombre del servicio</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={manejarCambio} required
                  placeholder="Ej: Alquiler de sillas cocteleras"
                  onFocus={() => setFocusedInput('nombre')} onBlur={() => setFocusedInput(null)}
                  style={focused('nombre')} />
              </div>

              <div>
                <label style={labelStyle}>Descripción</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={manejarCambio} required
                  placeholder="Detalles del servicio..."
                  onFocus={() => setFocusedInput('descripcion')} onBlur={() => setFocusedInput(null)}
                  style={{ ...focused('descripcion'), height: '90px', resize: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Precio base (COP)</label>
                  <input type="number" name="precioBase" value={formData.precioBase} onChange={manejarCambio} required placeholder="5000"
                    onFocus={() => setFocusedInput('precioBase')} onBlur={() => setFocusedInput(null)}
                    style={focused('precioBase')} />
                </div>
                <div>
                  <label style={labelStyle}>Unidad de medida</label>
                  <input type="text" name="unidadMedida" value={formData.unidadMedida} onChange={manejarCambio} required placeholder="Unidad / Hora"
                    onFocus={() => setFocusedInput('unidadMedida')} onBlur={() => setFocusedInput(null)}
                    style={focused('unidadMedida')} />
                </div>
              </div>

              <div>
                <SubidaImagen
                  label="Foto del servicio"
                  value={formData.imagen}
                  onChange={(url) => setFormData({ ...formData, imagen: url })}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                <button type="submit" style={{
                  padding: '10px', background: modoEdicion ? '#f59e0b' : '#0ea5e9',
                  color: '#fff', border: 'none', borderRadius: '8px',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  {modoEdicion ? 'Guardar cambios' : 'Registrar servicio'}
                </button>
                {modoEdicion && (
                  <button type="button" onClick={cancelarEdicion} style={{
                    padding: '10px', background: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    color: 'var(--color-text-secondary)', border: '0.5px solid var(--color-border-secondary)',
                    borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                  }}>Cancelar</button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* ── TABLA ── */}
        <div style={{
          background: 'var(--color-background-primary, #fff)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: '12px', overflow: 'hidden',
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '0.5px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Catálogo</div>
              <div style={{ fontSize: '17px', fontWeight: 500, color: 'var(--color-text-primary)', marginTop: '2px' }}>Servicios disponibles</div>
            </div>
            <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '12px', fontWeight: 500, padding: '4px 10px', borderRadius: '20px' }}>
              {servicios.length} servicios
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                  {['Imagen', 'Servicio', 'Descripción', 'Precio base', 'Medida', 'Acciones'].map(h => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: h === 'Acciones' || h === 'Imagen' ? 'center' : 'left',
                      fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)',
                      textTransform: 'uppercase', letterSpacing: '0.07em',
                      background: 'var(--color-background-secondary, #f8fafc)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {servicios.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                    Sin servicios en el catálogo.
                  </td></tr>
                ) : servicios.map(s => (
                  <tr key={s.id}
                    style={{ borderBottom: '0.5px solid var(--color-border-tertiary)', transition: 'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-background-secondary, #f8fafc)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '8px 16px', textAlign: 'center', width: '60px' }}>
                      <img 
                        src={s.imagen || 'https://via.placeholder.com/600?text=S/I'} 
                        alt="Servicio" 
                        onClick={() => setImagenSeleccionada(s.imagen || 'https://via.placeholder.com/600?text=S/I')}
                        style={{ 
                          width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', 
                          border: '0.5px solid #cbd5e1', cursor: 'zoom-in', transition: 'transform 0.2s' 
                        }} 
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        title="Clic para agrandar"
                      />
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--color-text-primary)', whiteSpace: 'nowrap' }}>{s.nombre}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)', maxWidth: '220px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.descripcion}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#059669', whiteSpace: 'nowrap' }}>
                      {Number(s.precioBase).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        background: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)',
                        border: '0.5px solid var(--color-border-secondary)',
                        fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '20px',
                      }}>{s.unidadMedida}</span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button onClick={() => prepararEdicion(s)} style={{
                          padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                          background: '#fffbeb', color: '#92400e', border: '0.5px solid #fcd34d',
                          cursor: 'pointer', fontFamily: 'inherit',
                        }}>Editar</button>
                        <button onClick={() => manejarEliminar(s.id)} style={{
                          padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                          background: '#fef2f2', color: '#991b1b', border: '0.5px solid #fca5a5',
                          cursor: 'pointer', fontFamily: 'inherit',
                        }}>Borrar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── MODAL VISOR DE IMAGEN (LIGHTBOX) ── */}
      {imagenSeleccionada && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.9)', zIndex: 9999,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => { setImagenSeleccionada(null); setNivelZoom(1); }} // Cierra al hacer clic afuera
        >
          {/* Botón de cerrar */}
          <button 
            style={{
              position: 'absolute', top: '20px', right: '30px',
              background: 'none', border: 'none', color: '#fff', fontSize: '36px',
              cursor: 'pointer', fontFamily: 'inherit'
            }}
            onClick={() => { setImagenSeleccionada(null); setNivelZoom(1); }}
          >
            &times;
          </button>

          {/* Indicador de ayuda */}
          <div style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '16px', fontWeight: 500, letterSpacing: '0.05em' }}>
            {nivelZoom >= 2 ? 'Haz clic para alejar' : 'Haz clic en la imagen para acercar'}
          </div>

          {/* Imagen expandida con lógica de zoom */}
          <img 
            src={imagenSeleccionada} 
            alt="Vista ampliada" 
            onClick={(e) => {
              e.stopPropagation(); // Evita que el clic cierre el modal
              setNivelZoom(prev => prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1);
            }}
            style={{
              maxWidth: '85%', maxHeight: '80vh', objectFit: 'contain',
              transform: `scale(${nivelZoom})`, transition: 'transform 0.3s ease-in-out',
              cursor: nivelZoom >= 2 ? 'zoom-out' : 'zoom-in',
              borderRadius: '8px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          />
        </div>
      )}
    </>
  );
};

export default Servicios;