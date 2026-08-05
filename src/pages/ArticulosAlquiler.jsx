import React, { useState, useEffect } from 'react';
import { obtenerArticulos, crearArticulo, actualizarArticulo, eliminarArticulo } from '../services/articulosService';

// ─── Design tokens (same system as Cotizaciones & Usuarios) ───────────────────
const S = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    minWidth: 0,
  },
  // ── Stats ──
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  statCard: (accent) => ({
    background: '#fff',
    border: '0.5px solid #e2e8f0',
    borderRadius: '10px',
    padding: '16px 20px',
    borderLeft: `3px solid ${accent}`,
  }),
  statNumber: { fontSize: '22px', fontWeight: '700', color: '#0f172a', lineHeight: 1 },
  statLabel: {
    fontSize: '11px', fontWeight: '500', color: '#94a3b8',
    marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em',
  },
  // ── Main grid ──
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '300px minmax(0, 1fr)',
    gap: '20px',
    alignItems: 'start',
  },
  // ── Form card ──
  formCard: {
    background: '#fff',
    border: '0.5px solid #e2e8f0',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  formHeader: (editing) => ({
    padding: '16px 20px',
    borderBottom: '0.5px solid #f1f5f9',
    background: editing ? '#fffbeb' : '#f0fdf4',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  }),
  formDot: (editing) => ({
    width: '8px', height: '8px', borderRadius: '50%',
    background: editing ? '#f59e0b' : '#10b981',
    flexShrink: 0,
  }),
  formTitle: { fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: 0 },
  formBody: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '13px' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: {
    fontSize: '11px', fontWeight: '600', color: '#64748b',
    textTransform: 'uppercase', letterSpacing: '0.06em',
  },
  input: {
    width: '100%', padding: '9px 12px', fontSize: '13px',
    border: '0.5px solid #cbd5e1', borderRadius: '8px',
    background: '#fff', color: '#0f172a', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
  },
  textarea: {
    width: '100%', padding: '9px 12px', fontSize: '13px',
    border: '0.5px solid #cbd5e1', borderRadius: '8px',
    background: '#fff', color: '#0f172a', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
    height: '80px', resize: 'none',
  },
  btnPrimary: (editing) => ({
    padding: '10px 16px',
    background: editing ? '#f59e0b' : '#10b981',
    color: '#fff', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '13px', fontWeight: '600',
    width: '100%', fontFamily: 'inherit',
  }),
  btnCancel: {
    padding: '9px 16px', background: 'transparent',
    border: '0.5px solid #cbd5e1', borderRadius: '8px',
    cursor: 'pointer', fontSize: '13px', color: '#64748b',
    width: '100%', fontFamily: 'inherit',
  },
  // ── Table card ──
  tableCard: {
    background: '#fff',
    border: '0.5px solid #e2e8f0',
    borderRadius: '12px',
    overflow: 'hidden',
    minWidth: 0,
  },
  tableScroll: { overflowX: 'auto', width: '100%' },
  tableHeaderBar: {
    padding: '16px 20px',
    borderBottom: '0.5px solid #f1f5f9',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  tableTitle: { fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: 0 },
  tableSubtitle: { fontSize: '12px', color: '#94a3b8', margin: 0 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: {
    padding: '10px 16px', textAlign: 'left',
    fontSize: '11px', fontWeight: '600', color: '#94a3b8',
    textTransform: 'uppercase', letterSpacing: '0.05em',
    background: '#fafafa', borderBottom: '0.5px solid #f1f5f9',
  },
  td: { padding: '12px 16px', borderBottom: '0.5px solid #f8fafc', verticalAlign: 'middle' },
  // ── Stock badge ──
  stockBadge: (n) => {
    if (n === 0)  return { bg: '#fef2f2', color: '#b91c1c', border: '#fca5a5' };
    if (n <= 3)   return { bg: '#fef9c3', color: '#854d0e', border: '#fde047' };
    return              { bg: '#dcfce7', color: '#15803d', border: '#86efac' };
  },
  iconBtn: (bg, color, border) => ({
    padding: '5px 10px', borderRadius: '6px',
    fontSize: '11px', fontWeight: '600',
    background: bg, color: color,
    border: `0.5px solid ${border ?? 'transparent'}`,
    cursor: 'pointer', fontFamily: 'inherit',
  }),
};

const emptyForm = { nombre: '', descripcion: '', precioAlquiler: '', stockTotal: '', fotoUrl: '' };

const ArticulosAlquiler = () => {
  const [articulos, setArticulos]     = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEdicion, setIdEdicion]     = useState(null);
  const [formData, setFormData]       = useState(emptyForm);
  const [imagenModal, setImagenModal] = useState(null); // { src, nombre }

  useEffect(() => { cargarArticulos(); }, []);

  const cargarArticulos = async () => {
    try { setArticulos(await obtenerArticulos()); }
    catch (e) { console.error(e); }
  };

  const manejarCambio = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const enviarFormulario = async (e) => {
    e.preventDefault();
    try {
      const res = modoEdicion
        ? await actualizarArticulo(idEdicion, formData)
        : await crearArticulo(formData);
      if (res.ok) { cancelarEdicion(); cargarArticulos(); }
      else alert('Error en la operación.');
    } catch (err) { console.error(err); }
  };

  const prepararEdicion = (a) => {
    setModoEdicion(true); setIdEdicion(a.id);
    setFormData({
      nombre: a.nombre, descripcion: a.descripcion,
      precioAlquiler: a.precioAlquiler, stockTotal: a.stockTotal,
      fotoUrl: a.fotoUrl || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => { setModoEdicion(false); setIdEdicion(null); setFormData(emptyForm); };

  const manejarEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este artículo del inventario?')) return;
    const res = await eliminarArticulo(id);
    if (res.ok) cargarArticulos();
  };

  // ── Stats derivadas ──
  const totalStock   = articulos.reduce((s, a) => s + Number(a.stockTotal || 0), 0);
  const sinStock     = articulos.filter(a => Number(a.stockTotal) === 0).length;
  const valorTotal   = articulos.reduce((s, a) => s + Number(a.precioAlquiler || 0) * Number(a.stockTotal || 0), 0);

  return (
    <div style={S.page}>

      {/* ── Modal imagen ── */}
      {imagenModal && (
        <div
          onClick={() => setImagenModal(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: '16px',
              padding: '20px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '14px',
              maxWidth: '420px', width: '90%',
              boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
            }}
          >
            <img
              src={imagenModal.src}
              alt={imagenModal.nombre}
              style={{
                width: '100%', maxHeight: '320px',
                borderRadius: '10px', objectFit: 'contain',
                border: '0.5px solid #e2e8f0', background: '#f8fafc',
              }}
            />
            <p style={{ margin: 0, fontWeight: '600', color: '#0f172a', fontSize: '14px', textAlign: 'center' }}>
              {imagenModal.nombre}
            </p>
            <button
              onClick={() => setImagenModal(null)}
              style={{ padding: '7px 24px', borderRadius: '8px', border: '0.5px solid #e2e8f0', background: '#f8fafc', color: '#64748b', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}
            >Cerrar</button>
          </div>
        </div>
      )}

      {/* ── Métricas ── */}
      <div style={S.statsRow}>
        <div style={S.statCard('#10b981')}>
          <div style={S.statNumber}>{articulos.length}</div>
          <div style={S.statLabel}>Artículos</div>
        </div>
        <div style={S.statCard('#3b82f6')}>
          <div style={S.statNumber}>{totalStock}</div>
          <div style={S.statLabel}>Unidades en stock</div>
        </div>
        <div style={S.statCard('#ef4444')}>
          <div style={S.statNumber}>{sinStock}</div>
          <div style={S.statLabel}>Sin stock</div>
        </div>
        <div style={S.statCard('#6366f1')}>
          <div style={{ ...S.statNumber, fontSize: '17px' }}>
            ${valorTotal.toLocaleString('es-CO')}
          </div>
          <div style={S.statLabel}>Valor inventario</div>
        </div>
      </div>

      {/* ── Grid principal ── */}
      <div style={S.mainGrid}>

        {/* ── Formulario ── */}
        <div style={S.formCard}>
          <div style={S.formHeader(modoEdicion)}>
            <div style={S.formDot(modoEdicion)} />
            <h2 style={S.formTitle}>
              {modoEdicion ? `Editando artículo #${idEdicion}` : 'Nuevo artículo'}
            </h2>
          </div>

          <div style={S.formBody}>
            <form onSubmit={enviarFormulario} style={{ display: 'contents' }}>

              <div style={S.fieldGroup}>
                <label style={S.label}>Nombre del artículo</label>
                <input
                  type="text" name="nombre" value={formData.nombre}
                  onChange={manejarCambio} required
                  style={S.input} placeholder="Ej: Silla Tiffany"
                />
              </div>

              <div style={S.fieldGroup}>
                <label style={S.label}>URL de la imagen</label>
                <input
                  type="text" name="fotoUrl" value={formData.fotoUrl}
                  onChange={manejarCambio}
                  style={S.input} placeholder="https://i.imgur.com/..."
                />
                {/* Preview inline si hay URL */}
                {formData.fotoUrl && (
                  <img
                    src={formData.fotoUrl}
                    alt="preview"
                    style={{ marginTop: '6px', width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '0.5px solid #e2e8f0' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                )}
              </div>

              <div style={S.fieldGroup}>
                <label style={S.label}>Descripción</label>
                <textarea
                  name="descripcion" value={formData.descripcion}
                  onChange={manejarCambio} required
                  style={S.textarea} placeholder="Breve descripción del artículo..."
                />
              </div>

              <div style={S.twoCol}>
                <div style={S.fieldGroup}>
                  <label style={S.label}>Precio (COP)</label>
                  <input
                    type="number" name="precioAlquiler" value={formData.precioAlquiler}
                    onChange={manejarCambio} required min="0"
                    style={S.input} placeholder="0"
                  />
                </div>
                <div style={S.fieldGroup}>
                  <label style={S.label}>Stock</label>
                  <input
                    type="number" name="stockTotal" value={formData.stockTotal}
                    onChange={manejarCambio} required min="0"
                    style={S.input} placeholder="0"
                  />
                </div>
              </div>

              <button type="submit" style={S.btnPrimary(modoEdicion)}>
                {modoEdicion ? '💾 Guardar cambios' : '+ Registrar artículo'}
              </button>
              {modoEdicion && (
                <button type="button" onClick={cancelarEdicion} style={S.btnCancel}>
                  Cancelar
                </button>
              )}
            </form>
          </div>
        </div>

        {/* ── Tabla ── */}
        <div style={S.tableCard}>
          <div style={S.tableHeaderBar}>
            <div>
              <p style={S.tableTitle}>Inventario de artículos</p>
              <p style={S.tableSubtitle}>{articulos.length} artículos registrados</p>
            </div>
          </div>

          <div style={S.tableScroll}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={{ ...S.th, minWidth: '60px' }}>Foto</th>
                  <th style={{ ...S.th, minWidth: '160px' }}>Artículo</th>
                  <th style={{ ...S.th, minWidth: '130px' }}>Precio</th>
                  <th style={{ ...S.th, minWidth: '90px', textAlign: 'center' }}>Stock</th>
                  <th style={{ ...S.th, minWidth: '130px', textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {articulos.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ ...S.td, textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                      No hay artículos en el inventario aún.
                    </td>
                  </tr>
                ) : (
                  articulos.map(a => {
                    const stock    = Number(a.stockTotal);
                    const stockCfg = S.stockBadge(stock);
                    const imgSrc   = a.fotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.nombre)}&background=e2e8f0&color=94a3b8&size=80`;

                    return (
                      <tr
                        key={a.id}
                        style={{ transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        {/* Foto */}
                        <td style={S.td}>
                          <img
                            src={imgSrc}
                            alt={a.nombre}
                            title="Ver imagen"
                            onClick={() => setImagenModal({ src: imgSrc, nombre: a.nombre })}
                            style={{
                              width: '44px', height: '44px', borderRadius: '8px',
                              objectFit: 'cover', border: '0.5px solid #e2e8f0',
                              cursor: 'zoom-in', flexShrink: 0,
                              transition: 'transform 0.15s, box-shadow 0.15s',
                            }}
                            onMouseEnter={e => { e.target.style.transform = 'scale(1.08)'; e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; }}
                            onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = 'none'; }}
                            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(a.nombre)}&background=e2e8f0&color=64748b`; }}
                          />
                        </td>

                        {/* Artículo */}
                        <td style={S.td}>
                          <p style={{ fontWeight: '600', color: '#0f172a', margin: 0, fontSize: '13px' }}>
                            {a.nombre}
                          </p>
                          <p style={{
                            color: '#94a3b8', fontSize: '11px', margin: 0,
                            maxWidth: '200px', overflow: 'hidden',
                            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {a.descripcion}
                          </p>
                        </td>

                        {/* Precio */}
                        <td style={S.td}>
                          <span style={{ fontWeight: '700', color: '#059669', fontSize: '14px' }}>
                            {Number(a.precioAlquiler).toLocaleString('es-CO', {
                              style: 'currency', currency: 'COP', maximumFractionDigits: 0,
                            })}
                          </span>
                          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>por evento</p>
                        </td>

                        {/* Stock */}
                        <td style={{ ...S.td, textAlign: 'center' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            minWidth: '36px', padding: '4px 10px', borderRadius: '20px',
                            background: stockCfg.bg, color: stockCfg.color,
                            border: `0.5px solid ${stockCfg.border}`,
                            fontSize: '12px', fontWeight: '700',
                          }}>
                            {stock}
                          </span>
                        </td>

                        {/* Acciones */}
                        <td style={{ ...S.td, textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => prepararEdicion(a)}
                              style={S.iconBtn('#fffbeb', '#92400e', '#fde047')}
                            >✏️ Editar</button>
                            <button
                              onClick={() => manejarEliminar(a.id)}
                              style={S.iconBtn('#fef2f2', '#b91c1c', '#fca5a5')}
                            >🗑️</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticulosAlquiler;