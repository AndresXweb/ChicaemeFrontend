import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setError('');
    setLoading(true);

    try {
      // 1. Llamamos a tu backend a través del servicio
      // (authService ya guarda el token y el usuario en localStorage internamente)
      await loginUsuario(email, password);

      // 2. Lo enviamos directo a la pantalla de servicios
      navigate('/solicitar');
      
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

        </form>
      </div>
    </div>
  );
};

export default Login;