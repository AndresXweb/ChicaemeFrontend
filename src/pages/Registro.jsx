import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { crearUsuario } from '../services/usuarioService';
import { loginConGoogle } from '../services/authService';

const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#334155' };
const inputStyle = { width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' };

const Registro = () => {
  const [formData, setFormData] = useState({
    nombres: '', apellidos: '', direccion: '', ciudad: '',
    telefono: '', email: '', password: '',
  });
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const botonGoogleRef = useRef(null);

  const manejarRespuestaGoogle = async (respuestaGoogle) => {
    setError('');
    setLoading(true);
    try {
      // Si llegamos hasta acá es porque el botón solo se muestra con el
      // checkbox ya marcado, así que mandamos aceptoTerminos=true.
      const usuario = await loginConGoogle(respuestaGoogle.credential, true);
      const esAdmin = ['administrador', 'admin'].includes(
        (usuario.tipoUsuario || '').trim().toLowerCase()
      );
      // loginConGoogle ya deja la sesión guardada (token + usuario),
      // así que va directo adentro, no de vuelta a /login.
      navigate(esAdmin ? '/admin' : '/solicitar');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Solo inicializamos/dibujamos el botón de Google cuando el checkbox de
  // términos está marcado — así nadie crea cuenta por Google sin aceptar,
  // igual que exige el registro manual.
  useEffect(() => {
    if (!aceptoTerminos) return;

    let intentos = 0;
    const intervalo = setInterval(() => {
      intentos++;
      if (window.google?.accounts?.id && botonGoogleRef.current) {
        clearInterval(intervalo);
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: manejarRespuestaGoogle,
        });
        window.google.accounts.id.renderButton(botonGoogleRef.current, {
          theme: 'outline', size: 'large', width: 320, text: 'signup_with',
        });
      } else if (intentos > 20) {
        clearInterval(intervalo);
      }
    }, 200);
    return () => clearInterval(intervalo);
  }, [aceptoTerminos]);

  const manejarCambio = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // El backend también valida esto, pero lo chequeamos acá primero
    // para no hacer una petición de más si el checkbox no está marcado.
    if (!aceptoTerminos) {
      setError('Debes aceptar los términos y condiciones para registrarte.');
      return;
    }

    setLoading(true);
    try {
      // NOTA: no se manda tipoUsuario. El backend lo ignora si viene de todas
      // formas para un registro público y fuerza "Cliente" (ver UsuarioController).
      const res = await crearUsuario({ ...formData, aceptoTerminos });

      if (res.ok) {
        navigate('/login');
      } else {
        const mensaje = await res.text();
        setError(mensaje || 'No se pudo completar el registro.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9', fontFamily: 'Inter', padding: '20px' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: '100%', maxWidth: '440px' }}>

        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <h1 style={{ margin: 0, color: '#0F172A', fontSize: '24px' }}>Crear cuenta</h1>
          <p style={{ color: '#64748B', fontSize: '14px', marginTop: '8px' }}>Regístrate para solicitar cotizaciones</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {error && (
            <div style={{ padding: '12px', background: '#FEF2F2', color: '#EF4444', borderRadius: '8px', fontSize: '14px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Nombres</label>
              <input name="nombres" required value={formData.nombres} onChange={manejarCambio} style={inputStyle} placeholder="Juan" />
            </div>
            <div>
              <label style={labelStyle}>Apellidos</label>
              <input name="apellidos" required value={formData.apellidos} onChange={manejarCambio} style={inputStyle} placeholder="Pérez" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Dirección</label>
            <input name="direccion" required value={formData.direccion} onChange={manejarCambio} style={inputStyle} placeholder="Calle 123 # 45-67" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Ciudad</label>
              <input name="ciudad" required value={formData.ciudad} onChange={manejarCambio} style={inputStyle} placeholder="Bogotá" />
            </div>
            <div>
              <label style={labelStyle}>Teléfono</label>
              <input name="telefono" required value={formData.telefono} onChange={manejarCambio} style={inputStyle} placeholder="300 000 0000" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Correo electrónico</label>
            <input type="email" name="email" required value={formData.email} onChange={manejarCambio} style={inputStyle} placeholder="ejemplo@correo.com" />
          </div>

          <div>
            <label style={labelStyle}>Contraseña</label>
            <input type="password" name="password" required value={formData.password} onChange={manejarCambio} style={inputStyle} placeholder="••••••••" />
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer', marginTop: '4px' }}>
            <input
              type="checkbox"
              checked={aceptoTerminos}
              onChange={(e) => setAceptoTerminos(e.target.checked)}
              style={{ marginTop: '2px', flexShrink: 0 }}
            />
            <span>
              Acepto los <Link to="/terminos" target="_blank" style={{ color: '#6366F1' }}>términos y condiciones</Link> y
              la política de tratamiento de datos personales.
            </span>
          </label>

          {aceptoTerminos ? (
            <div ref={botonGoogleRef} style={{ display: 'flex', justifyContent: 'center' }} />
          ) : (
            <p style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', margin: 0 }}>
              Marca la casilla de arriba para poder registrarte con Google
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>o con tu correo</span>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '6px', width: '100%', padding: '14px',
              background: loading ? '#94A3B8' : '#6366F1',
              color: 'white', border: 'none', borderRadius: '8px',
              fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748B', margin: 0 }}>
            ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#6366F1', fontWeight: '600' }}>Inicia sesión</Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Registro;
