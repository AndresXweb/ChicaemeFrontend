import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { restablecerPassword } from '../services/authService';

const pageStyle = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9', fontFamily: 'Inter', padding: '20px' };
const cardStyle = { background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box', outline: 'none' };

const ResetPassword = () => {
  // El link del correo es .../reset-password?token=xxxx (ver EmailService.java del backend)
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await restablecerPassword(token, password);
      setExito(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.message || 'El enlace no es válido o ya expiró.');
    } finally {
      setLoading(false);
    }
  };

  // Si alguien entra a /reset-password sin token en la URL, no tiene sentido mostrar el formulario
  if (!token) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={{ padding: '16px', background: '#FEF2F2', color: '#EF4444', borderRadius: '8px', fontSize: '14px', textAlign: 'center', lineHeight: 1.5 }}>
            Este enlace no es válido. Solicita uno nuevo desde{' '}
            <Link to="/olvide-password" style={{ color: '#EF4444', fontWeight: '600' }}>aquí</Link>.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ margin: 0, color: '#0F172A', fontSize: '22px' }}>Nueva contraseña</h1>
        </div>

        {exito ? (
          <div style={{ padding: '16px', background: '#F0FDF4', color: '#15803D', borderRadius: '8px', fontSize: '14px', textAlign: 'center' }}>
            Contraseña actualizada. Redirigiendo a inicio de sesión...
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && (
              <div style={{ padding: '12px', background: '#FEF2F2', color: '#EF4444', borderRadius: '8px', fontSize: '14px', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <div>
              <label style={labelStyle}>Nueva contraseña</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="••••••••" />
            </div>

            <div>
              <label style={labelStyle}>Confirmar contraseña</label>
              <input type="password" required value={confirmar} onChange={(e) => setConfirmar(e.target.value)} style={inputStyle} placeholder="••••••••" />
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
              {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
