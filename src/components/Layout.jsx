import { authFetch } from '../services/http';
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  quotes: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  services: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  ),
  logout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  inventory: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  // NUEVO: ícono de contacto (sobre/email)
  contact: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
};

// NOTA: corregido el prefijo /admin en todos los "to" (antes apuntaban a /usuarios,
// /cotizaciones, etc. en vez de /admin/usuarios, /admin/cotizaciones — no calzaba
// con las rutas anidadas reales definidas en App.jsx)
const navItems = [
  { to: '/admin',             label: 'Inicio',                  icon: icons.dashboard },
  { to: '/admin/usuarios',     label: 'Gestión de Usuarios',     icon: icons.users     },
  { to: '/admin/cotizaciones', label: 'Cotizaciones y Eventos',  icon: icons.quotes    },
  { to: '/admin/servicios',    label: 'Catálogo de Servicios',   icon: icons.services  },
  { to: '/admin/articulos',    label: 'Inventario Alquiler',     icon: icons.inventory },
  // NUEVO: Contactos Recibidos
  { to: '/admin/contactos',    label: 'Contactos Recibidos',     icon: icons.contact   },
];

const pageTitles = {
  '/admin':              'Panel de Control',
  '/admin/usuarios':      'Gestión de Usuarios',
  '/admin/cotizaciones':  'Cotizaciones y Eventos',
  '/admin/servicios':     'Catálogo de Servicios',
  '/admin/articulos':     'Inventario de Alquiler',
  '/admin/contactos':     'Contactos Recibidos', // NUEVO
};

const Layout = () => {
  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] ?? 'Panel de Control';
  const [pendientes, setPendientes] = useState(0);
  const [totalContactos, setTotalContactos] = useState(0); // NUEVO

  useEffect(() => {
    const fetchPendientes = async () => {
      try {
        const response = await authFetch('http://localhost:8080/api/cotizaciones');
        if (response.ok) {
          const data = await response.json();
          const count = data.filter(cotizacion => cotizacion.estado === 'Pendiente').length;
          setPendientes(count);
        }
      } catch (error) {
        console.error("Error cargando notificaciones:", error);
      }
    };

    // NUEVO: cargar total de contactos recibidos
    const fetchContactos = async () => {
      try {
        const response = await authFetch('http://localhost:8080/api/contactos');
        if (response.ok) {
          const data = await response.json();
          // El endpoint GET /api/contactos responde { success, total, contactos }
          setTotalContactos(data.total ?? 0);
        }
      } catch (error) {
        console.error("Error cargando contactos:", error);
      }
    };

    fetchPendientes();
    fetchContactos();
    const intervalId = setInterval(() => {
      fetchPendientes();
      fetchContactos();
    }, 30000);
    return () => clearInterval(intervalId);
  }, [location.pathname]);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Inter', system-ui, sans-serif", background: '#F1F5F9' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: '256px',
        background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
        boxShadow: '4px 0 24px rgba(0,0,0,0.18)',
      }}>

        {/* Logo */}
        <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, #6366F1, #818CF8)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <div style={{ color: '#F8FAFC', fontWeight: '700', fontSize: '15px', letterSpacing: '0.08em' }}>CHICAEME</div>
              <div style={{ color: '#64748B', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '1px' }}>Administración</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ color: '#475569', fontSize: '10px', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '8px 12px 6px' }}>
            Menú principal
          </div>
          {navItems.map(({ to, label, icon }) => {
            const isActive = location.pathname === to;
            const isCotizacionesItem = to === '/admin/cotizaciones';
            const isContactosItem = to === '/admin/contactos'; // NUEVO
            const showBadge =
              (isCotizacionesItem && pendientes > 0) ||
              (isContactosItem && totalContactos > 0); // NUEVO
            const badgeValue = isCotizacionesItem ? pendientes : totalContactos; // NUEVO

            return (
              <Link
                key={to} to={to}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: '12px', padding: '10px 12px', borderRadius: '8px',
                  textDecoration: 'none', fontSize: '14px',
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? '#F8FAFC' : '#94A3B8',
                  background: isActive ? 'rgba(99,102,241,0.18)' : 'transparent',
                  borderLeft: isActive ? '3px solid #6366F1' : '3px solid transparent',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#CBD5E1'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94A3B8'; } }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ opacity: isActive ? 1 : 0.6, color: isActive ? '#818CF8' : 'currentColor', flexShrink: 0 }}>
                    {icon}
                  </span>
                  {label}
                </div>
                {showBadge && (
                  <span style={{ background: '#EF4444', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '12px', minWidth: '16px', textAlign: 'center' }}>
                    {badgeValue}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
            </svg>
          </div>
          <div>
            <div style={{ color: '#475569', fontSize: '11px' }}>Versión 1.0.0</div>
            <div style={{ color: '#334155', fontSize: '10px' }}>Chicaeme SAS</div>
          </div>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* TOPBAR */}
        <header style={{
          height: '64px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '500', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '2px' }}>Panel de Control</div>
            <h1 style={{ margin: 0, fontSize: '17px', fontWeight: '600', color: '#0F172A', lineHeight: 1 }}>{currentTitle}</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', position: 'relative' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {pendientes > 0 ? (
                <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#EF4444', color: 'white', fontSize: '10px', fontWeight: 'bold', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1.5px solid white' }}>
                  {pendientes}
                </span>
              ) : (
                <span style={{ position: 'absolute', top: '4px', right: '4px', width: '7px', height: '7px', background: '#CBD5E1', borderRadius: '50%', border: '1.5px solid white' }} />
              )}
            </button>

            <div style={{ width: '1px', height: '28px', background: '#E2E8F0' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1, #818CF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: '600' }}>AL</div>
                <span style={{ position: 'absolute', bottom: '1px', right: '1px', width: '8px', height: '8px', background: '#22C55E', borderRadius: '50%', border: '1.5px solid white' }} />
              </div>
              <div style={{ lineHeight: 1.3 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>Admin Local</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>Administrador</div>
              </div>
            </div>

            <div style={{ width: '1px', height: '28px', background: '#E2E8F0' }} />

            <button
              style={{ background: 'none', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', color: '#64748B', padding: '7px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500', transition: 'all 0.15s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#FCA5A5'; e.currentTarget.style.color = '#EF4444'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#64748B'; }}
            >
              {icons.logout} Salir
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '32px', background: '#F1F5F9' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;