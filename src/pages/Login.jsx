import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUsuario, loginConGoogle } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const botonGoogleRef = useRef(null);

  // Misma regla de redirección que usa el login normal — la comparten los dos caminos.
  const irSegunRol = (usuario) => {
    const esAdmin = ['administrador', 'admin'].includes(
      (usuario.tipoUsuario || '').trim().toLowerCase()
    );
    navigate(esAdmin ? '/admin' : '/');
  };

  // El botón de Google llama a esto con un credential (el idToken) cuando el
  // usuario elige su cuenta. aceptoTerminos no se manda desde login (queda en
  // false) porque esta pantalla es para quien YA tiene cuenta; si el correo es
  // nuevo, el backend responde pidiendo ir a /registro a aceptar términos.
  const manejarRespuestaGoogle = async (respuestaGoogle) => {
    setError('');
    setLoading(true);
    try {
      const usuario = await loginConGoogle(respuestaGoogle.credential);
      irSegunRol(usuario);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Identity Services carga su script de forma asíncrona (ver index.html),
  // así que puede no estar listo todavía cuando este componente se monta.
  // Reintentamos cada 200ms durante ~4s en vez de asumir que ya está disponible.
  useEffect(() => {
    let intentos = 0;
    const intervalo = setInterval(() => {
      intentos++;
      if (window.google?.accounts?.id) {
        clearInterval(intervalo);
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: manejarRespuestaGoogle,
        });
        if (botonGoogleRef.current) {
          window.google.accounts.id.renderButton(botonGoogleRef.current, {
            theme: 'outline', size: 'large', width: 320, text: 'signin_with',
          });
        }
      } else if (intentos > 20) {
        clearInterval(intervalo); // el script no cargó — el botón simplemente no aparece
      }
    }, 200);
    return () => clearInterval(intervalo);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setError('');
    setLoading(true);

    try {
      // 1. Llamamos a tu backend a través del servicio
      // (authService ya guarda el token y el usuario en localStorage internamente)
      const usuario = await loginUsuario(email, password);

      // 2. Si es admin lo mandamos al panel, si es cliente a solicitar servicio
      irSegunRol(usuario);
      
    } catch (err) {
      // Si el backend dice "Correo o contraseña incorrectos", lo mostramos aquí
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9', fontFamily: 'Inter' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, color: '#0F172A', fontSize: '24px' }}>Chicaeme SAS</h1>
          <p style={{ color: '#64748B', fontSize: '14px', marginTop: '8px' }}>Ingrese a su cuenta para cotizar</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Mensaje de Error */}
          {error && (
            <div style={{ padding: '12px', background: '#FEF2F2', color: '#EF4444', borderRadius: '8px', fontSize: '14px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box', outline: 'none' }}
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box', outline: 'none' }}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '10px', width: '100%', padding: '14px', 
              background: loading ? '#94A3B8' : '#6366F1', 
              color: 'white', border: 'none', borderRadius: '8px', 
              fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' 
            }}
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginTop: '4px' }}>
            <Link to="/olvide-password" style={{ color: '#6366F1', textDecoration: 'none', fontWeight: '500' }}>
              ¿Olvidaste tu contraseña?
            </Link>
            <Link to="/registro" style={{ color: '#6366F1', textDecoration: 'none', fontWeight: '500' }}>
              Crear cuenta
            </Link>
          </div>

        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          <span style={{ fontSize: '12px', color: '#94A3B8' }}>o</span>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
        </div>

        {/* Google dibuja su propio botón acá adentro (renderButton) */}
        <div ref={botonGoogleRef} style={{ display: 'flex', justifyContent: 'center' }} />

      </div>
    </div>
  );
};

export default Login;