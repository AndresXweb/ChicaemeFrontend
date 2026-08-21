import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { solicitarRecuperacion } from '../services/authService';

const OlvidePassword = () => {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await solicitarRecuperacion(email);
      // El backend responde SIEMPRE el mismo mensaje (exista o no el correo),
      // así que acá también mostramos siempre el mismo estado de éxito.
      setEnviado(true);
    } catch (err) {
      setError('Error de conexión con el servidor. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9', fontFamily: 'Inter', padding: '20px' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ margin: 0, color: '#0F172A', fontSize: '22px' }}>Recuperar contraseña</h1>
          <p style={{ color: '#64748B', fontSize: '14px', marginTop: '8px' }}>
            Te enviaremos un enlace a tu correo para crear una nueva contraseña.
          </p>
        </div>

        {enviado ? (
          <div style={{ padding: '16px', background: '#F0FDF4', color: '#15803D', borderRadius: '8px', fontSize: '14px', textAlign: 'center', lineHeight: 1.5 }}>
            Si el correo existe en nuestro sistema, te llegará un enlace de recuperación.
            Revisa tu bandeja de entrada (y la carpeta de spam).
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && (
              <div style={{ padding: '12px', background: '#FEF2F2', color: '#EF4444', borderRadius: '8px', fontSize: '14px', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box', outline: 'none' }}
                placeholder="ejemplo@correo.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#94A3B8' : '#6366F1',
                color: 'white', border: 'none', borderRadius: '8px',
                fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748B', marginTop: '20px' }}>
          <Link to="/login" style={{ color: '#6366F1', fontWeight: '600', textDecoration: 'none' }}>← Volver a iniciar sesión</Link>
        </p>

      </div>
    </div>
  );
};

export default OlvidePassword;
