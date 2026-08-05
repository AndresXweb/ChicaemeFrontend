import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obtenerInventarioParaCotizar } from '../services/inventarioService';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const COP = (n) =>
  Number(n).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: '32px 24px',
  },
  header: {
    padding: '20px 80px',
    background: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    marginBottom: '32px'
  },
  logo: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#6366F1'
  },
  nav: {
    display: 'flex',
    gap: '25px',
    alignItems: 'center'
  },
  navLink: {
    textDecoration: 'none',
    color: '#475569',
    fontWeight: '500',
    transition: 'color 0.3s'
  },
  cartIcon: {
    position: 'relative',
    cursor: 'pointer'
  },
  cartBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: '#ef4444',
    color: 'white',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700'
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 4px',
  },
  pageSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0 0 20px',
  },
  // ── Search bar ──
  searchWrap: {
    position: 'relative',
    maxWidth: '1200px',
    margin: '0 auto 24px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 40px 12px 40px',
    fontSize: '14px',
    border: '0.5px solid #e2e8f0',
    borderRadius: '12px',
    background: '#fff',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    fontSize: '15px',
    pointerEvents: 'none',
  },
  searchClear: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: '#f1f5f9',
    border: 'none',
    borderRadius: '50%',
    width: '22px',
    height: '22px',
    cursor: 'pointer',
    color: '#64748b',
    fontSize: '13px',
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit',
  },
  resultsCount: {
    fontSize: '12px',
    color: '#94a3b8',
    margin: '8px 0 0 2px',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 380px',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
    alignItems: 'start',
  },
  // ── Catalog grid ──
  catalogGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '16px',
  },
  itemCard: (inCart) => ({
    background: '#fff',
    border: inCart ? '1.5px solid #10b981' : '0.5px solid #e2e8f0',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: inCart ? '0 0 0 3px rgba(16,185,129,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
    transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  }),
  itemImg: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
    cursor: 'zoom-in',
    display: 'block',
    transition: 'transform 0.25s',
  },
  itemBody: {
    padding: '14px 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1
  },
  itemName: {
    fontWeight: '700',
    color: '#0f172a',
    fontSize: '14px',
    margin: 0
  },
  itemDesc: {
    color: '#64748b',
    fontSize: '12px',
    margin: 0,
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  itemPrice: {
    fontWeight: '700',
    color: '#059669',
    fontSize: '15px',
    margin: 0
  },
  stockBadge: (n) => {
    if (n === 0) return { bg: '#fef2f2', color: '#b91c1c', label: 'Sin stock' };
    if (n <= 3) return { bg: '#fef9c3', color: '#854d0e', label: `Solo ${n} disp.` };
    return { bg: '#dcfce7', color: '#15803d', label: `${n} disponibles` };
  },
  qtyRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginTop: '4px',
  },
  qtyInput: {
    width: '56px',
    padding: '7px 8px',
    fontSize: '13px',
    textAlign: 'center',
    border: '0.5px solid #cbd5e1',
    borderRadius: '8px',
    outline: 'none',
    fontFamily: 'inherit',
    color: '#0f172a',
  },
  addBtn: (disabled) => ({
    flex: 1,
    padding: '8px 12px',
    background: disabled ? '#f1f5f9' : '#10b981',
    color: disabled ? '#94a3b8' : '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    fontFamily: 'inherit',
    transition: 'background 0.15s',
  }),
  noResults: {
    gridColumn: '1/-1',
    textAlign: 'center',
    color: '#94a3b8',
    padding: '48px 0',
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  // ── Cart panel ──
  panel: {
    background: '#fff',
    border: '0.5px solid #e2e8f0',
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'sticky',
    top: '80px',
  },
  panelHeader: {
    padding: '18px 20px',
    borderBottom: '0.5px solid #f1f5f9',
    background: '#fafafa',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  panelDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#10b981'
  },
  panelTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  },
  panelBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#f8fafc',
    padding: '10px 12px',
    borderRadius: '8px',
    gap: '8px',
  },
  cartItemName: {
    fontWeight: '600',
    color: '#0f172a',
    fontSize: '13px',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  cartItemQty: {
    color: '#6366f1',
    fontWeight: '700',
    fontSize: '13px'
  },
  cartItemPrice: {
    color: '#059669',
    fontWeight: '600',
    fontSize: '12px'
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '0 4px',
    lineHeight: 1,
    fontFamily: 'inherit',
    transition: 'color 0.1s',
  },
  totalBox: {
    background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
    border: '0.5px solid #86efac',
    borderRadius: '12px',
    padding: '14px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: '#15803d',
    fontWeight: '700',
    fontSize: '13px'
  },
  totalValue: {
    color: '#0f172a',
    fontWeight: '800',
    fontSize: '20px'
  },
  ctaBtn: (disabled) => ({
    width: '100%',
    padding: '14px',
    background: disabled ? '#e2e8f0' : 'linear-gradient(135deg, #10b981, #059669)',
    color: disabled ? '#94a3b8' : '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: '700',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxShadow: disabled ? 'none' : '0 4px 14px rgba(16,185,129,0.3)',
    transition: 'opacity 0.15s',
  }),
  emptyCart: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '13px',
    padding: '12px 0',
  },
  // ── Image modal ──
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'zoom-out',
    padding: '20px',
  },
  modalBox: {
    background: '#fff',
    borderRadius: '16px',
    padding: '20px',
    maxWidth: '520px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
    cursor: 'default',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
const CatalogoPublico = () => {
  const [inventario, setInventario] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [busqueda, setBusqueda] = useState('');
  const [imagenModal, setImagenModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarInventario();
    cargarCarrito();
  }, []);

  // Guardar carrito en localStorage cada vez que cambié
  useEffect(() => {
    localStorage.setItem('carritoAlquiler', JSON.stringify(carrito));
  }, [carrito]);

  const cargarInventario = async () => {
    try {
      const data = await obtenerInventarioParaCotizar();
      setInventario(data);
    } catch (e) {
      console.error('Error cargando inventario:', e);
    }
  };

  const cargarCarrito = () => {
    try {
      const carritoGuardado = localStorage.getItem('carritoAlquiler');
      if (carritoGuardado) {
        setCarrito(JSON.parse(carritoGuardado));
      }
    } catch (e) {
      console.error('Error cargando carrito:', e);
    }
  };

  const totalCarrito = carrito.reduce((s, i) => s + i.cantidad * i.precioAlquiler, 0);

  const inventarioFiltrado = inventario.filter(item => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return true;
    return (
      item.nombre?.toLowerCase().includes(texto) ||
      item.descripcion?.toLowerCase().includes(texto)
    );
  });

  const manejarCantidad = (id, val) =>
    setCantidades({ ...cantidades, [id]: parseInt(val) || 1 });

  const agregarAlCarrito = (articulo) => {
    const cant = cantidades[articulo.id] || 1;
    setCarrito(prev => {
      const existe = prev.find(i => i.id === articulo.id);
      return existe
        ? prev.map(i => i.id === articulo.id ? { ...i, cantidad: i.cantidad + cant } : i)
        : [...prev, { ...articulo, cantidad: cant }];
    });
    // Reset cantidad
    setCantidades({ ...cantidades, [articulo.id]: 1 });
  };

  const quitarDelCarrito = (id) => setCarrito(prev => prev.filter(i => i.id !== id));

  const irAConfirmar = () => {
    const usuarioString = localStorage.getItem('usuarioChicaeme');
    if (!usuarioString) {
      // No está logueado - redirige a login
      alert('Debes iniciar sesión para confirmar tu cotización');
      navigate('/login');
    } else {
      // Está logueado - va a formulario de cotización
      navigate('/solicitar');
    }
  };

  const enCarrito = (id) => carrito.find(i => i.id === id);

  return (
    <div style={S.page}>
      {/* ── Modal imagen ── */}
      {imagenModal && (
        <div style={S.modalOverlay} onClick={() => setImagenModal(null)}>
          <div style={S.modalBox} onClick={e => e.stopPropagation()}>
            <img
              src={imagenModal.src}
              alt={imagenModal.nombre}
              style={{ width: '100%', maxHeight: '380px', objectFit: 'contain', borderRadius: '10px', border: '0.5px solid #e2e8f0', background: '#f8fafc' }}
            />
            <div>
              <p style={{ margin: '0 0 2px', fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>
                {imagenModal.nombre}
              </p>
              <p style={{ margin: 0, color: '#059669', fontWeight: '700', fontSize: '17px' }}>
                {COP(imagenModal.precio)}
                <span style={{ color: '#94a3b8', fontWeight: '400', fontSize: '13px' }}> / unidad</span>
              </p>
              {imagenModal.descripcion && (
                <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '13px', lineHeight: '1.6' }}>
                  {imagenModal.descripcion}
                </p>
              )}
            </div>
            <button
              onClick={() => setImagenModal(null)}
              style={{ alignSelf: 'flex-end', padding: '7px 20px', borderRadius: '8px', border: '0.5px solid #e2e8f0', background: '#f8fafc', color: '#64748b', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}
            >Cerrar</button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header style={S.header}>
        <div style={S.logo}>AUTO<span style={{ color: '#0F172A' }}>MARKET</span></div>
        <nav style={S.nav}>
          <Link to="/" style={S.navLink}>Inicio</Link>
          <Link to="/catalogo" style={S.navLink}>Catálogo</Link>
          <div style={S.cartIcon}>
            🛒
            {carrito.length > 0 && <span style={S.cartBadge}>{carrito.length}</span>}
          </div>
        </nav>
      </header>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={S.pageTitle}>Catálogo de productos</h1>
        <p style={S.pageSubtitle}>Selecciona los artículos que necesitas. Cuando estés listo, confirma tu cotización.</p>

        {/* ── Buscador ── */}
        <div style={S.searchWrap}>
          <span style={S.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Buscar artículos por nombre o descripción..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={S.searchInput}
            onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}
            onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}
          />
          {busqueda && (
            <button style={S.searchClear} onClick={() => setBusqueda('')} title="Limpiar búsqueda">×</button>
          )}
        </div>
        {busqueda && inventario.length > 0 && (
          <p style={S.resultsCount}>
            {inventarioFiltrado.length} de {inventario.length} artículo{inventario.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* ── Main layout ── */}
      <div style={S.layout}>

        {/* ── Catálogo ── */}
        <div style={S.catalogGrid}>
          {inventario.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8', padding: '48px 0', fontSize: '14px' }}>
              Cargando artículos...
            </div>
          )}
          {inventario.length > 0 && inventarioFiltrado.length === 0 && (
            <div style={S.noResults}>
              <span>No encontramos artículos que coincidan con "{busqueda}"</span>
              <button style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }} onClick={() => setBusqueda('')}>
                Limpiar búsqueda
              </button>
            </div>
          )}
          {inventarioFiltrado.map(item => {
            const stock = Number(item.stockTotal ?? item.stockDisponible ?? 0);
            const stockCfg = S.stockBadge(stock);
            const agotado = stock === 0;
            const enPedido = enCarrito(item.id);
            const imgSrc = item.fotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.nombre)}&background=e2e8f0&color=94a3b8&size=200`;

            return (
              <div key={item.id} style={S.itemCard(!!enPedido)}>
                {/* Imagen */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={imgSrc}
                    alt={item.nombre}
                    style={S.itemImg}
                    onClick={() => setImagenModal({ src: imgSrc, nombre: item.nombre, precio: item.precioAlquiler, descripcion: item.descripcion })}
                    onMouseEnter={e => { e.target.style.transform = 'scale(1.04)'; }}
                    onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.nombre)}&background=e2e8f0&color=64748b`; }}
                  />
                  {/* Stock badge */}
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: stockCfg.bg,
                    color: stockCfg.color,
                    fontSize: '10px',
                    fontWeight: '700',
                    padding: '3px 8px',
                    borderRadius: '20px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                  }}>
                    {stockCfg.label}
                  </span>
                  {/* En carrito badge */}
                  {enPedido && (
                    <span style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: '#10b981',
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '20px',
                    }}>
                      ✓ En carrito
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={S.itemBody}>
                  <p style={S.itemName}>{item.nombre}</p>
                  {item.descripcion && <p style={S.itemDesc}>{item.descripcion}</p>}

                  <p style={S.itemPrice}>
                    {COP(item.precioAlquiler)}
                    <span style={{ color: '#94a3b8', fontWeight: '400', fontSize: '13px' }}> / unidad</span>
                  </p>

                  {/* Cantidad + agregar */}
                  <div style={S.qtyRow}>
                    <input
                      type="number"
                      min="1"
                      max={stock || 999}
                      value={cantidades[item.id] || 1}
                      onChange={e => manejarCantidad(item.id, e.target.value)}
                      disabled={agotado}
                      style={{ ...S.qtyInput, background: agotado ? '#f8fafc' : '#fff' }}
                    />
                    <button
                      onClick={() => agregarAlCarrito(item)}
                      disabled={agotado}
                      style={S.addBtn(agotado)}
                    >
                      {agotado ? 'Sin stock' : enPedido ? '+ Agregar' : 'Agregar'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Carrito ── */}
        <div style={S.panel}>
          <div style={S.panelHeader}>
            <div style={S.panelDot} />
            <h3 style={S.panelTitle}>Tu carrito ({carrito.length})</h3>
          </div>

          <div style={S.panelBody}>
            {/* Lista de artículos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '350px', overflowY: 'auto' }}>
              {carrito.length === 0 ? (
                <p style={S.emptyCart}>Aún no has agregado artículos</p>
              ) : (
                carrito.map(item => (
                  <div key={item.id} style={S.cartItem}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={S.cartItemName}>{item.nombre}</p>
                      <p style={{ ...S.cartItemPrice, margin: 0 }}>
                        {COP(item.precioAlquiler)} × {item.cantidad} = {COP(item.precioAlquiler * item.cantidad)}
                      </p>
                    </div>
                    <span style={S.cartItemQty}>×{item.cantidad}</span>
                    <button
                      onClick={() => quitarDelCarrito(item.id)}
                      style={S.removeBtn}
                      onMouseEnter={e => { e.target.style.color = '#ef4444'; }}
                      onMouseLeave={e => { e.target.style.color = '#94a3b8'; }}
                      title="Quitar"
                    >×</button>
                  </div>
                ))
              )}
            </div>

            {/* Total */}
            {carrito.length > 0 && (
              <>
                <div style={{ borderTop: '0.5px solid #f1f5f9', margin: '0' }}></div>
                <div style={S.totalBox}>
                  <span style={S.totalLabel}>Total estimado</span>
                  <span style={S.totalValue}>{COP(totalCarrito)}</span>
                </div>
              </>
            )}

            {/* Botón confirmar */}
            <button
              onClick={irAConfirmar}
              disabled={carrito.length === 0}
              style={S.ctaBtn(carrito.length === 0)}
            >
              {carrito.length === 0 ? 'Agrega artículos' : `Confirmar cotización (${carrito.length})`}
            </button>

            <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', margin: 0 }}>
              {carrito.length > 0 ? 'Click en confirmar para completar los datos' : 'Selecciona productos para empezar'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogoPublico;