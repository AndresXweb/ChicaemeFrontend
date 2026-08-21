import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { crearUsuario } from '../services/usuarioService';

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
