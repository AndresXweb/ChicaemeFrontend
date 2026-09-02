import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { actualizarUsuario } from '../services/usuarioService';
import SubidaImagen from '../components/SubidaImagen';

const Perfil = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const usuarioString = localStorage.getItem('usuarioChicaeme');
    
    if (!usuarioString) {
      navigate('/login');
      return;
    }

    try {
      const usuarioLogueado = JSON.parse(usuarioString);
      if (usuarioLogueado) {
        setFormData(usuarioLogueado);
      } else {
        localStorage.removeItem('usuarioChicaeme');
        navigate('/login');
      }
    } catch (e) {
      console.error("Error al leer usuario:", e);
      localStorage.removeItem('usuarioChicaeme');
      navigate('/login');
    } finally {
      setCargandoDatos(false);
    }
  }, [navigate]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const guardarCambiosPerfil = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await actualizarUsuario(formData.id, formData);

      if (response.ok) {
        const usuarioActualizado = await response.json();
        localStorage.setItem('usuarioChicaeme', JSON.stringify(usuarioActualizado));
        alert("¡Tu perfil ha sido actualizado con éxito!");
        navigate('/');
      } else {
        alert("Error al guardar en el servidor.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  if (cargandoDatos || !formData) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Inter' }}>Cargando perfil...</div>;
  }

  return (
    <div style={{ padding: '40px 20px', background: '#F1F5F9', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ maxWidth: '600px', margin: '0 auto 20px auto', display: 'block', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '15px', textAlign: 'left', width: '100%' }}
      >
        ← Volver al inicio
      </button>

      <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', maxWidth: '600px', margin: '0 auto', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0' }}>
        <h1 style={{ color: '#0F172A', fontSize: '24px', margin: '0 0 8px 0', textAlign: 'center' }}>Editar Mi Perfil</h1>
        
        <form onSubmit={guardarCambiosPerfil} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Campo para la foto */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <SubidaImagen
              label="Foto de Perfil"
              value={formData.imagen}
              onChange={(url) => setFormData({ ...formData, imagen: url })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Nombres</label>
              <input type="text" name="nombres" value={formData.nombres || ''} onChange={manejarCambio} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Apellidos</label>
              <input type="text" name="apellidos" value={formData.apellidos || ''} onChange={manejarCambio} required style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Correo Electrónico</label>
            <input type="email" value={formData.email || ''} disabled style={{ ...inputStyle, background: '#F8FAFC', color: '#94A3B8' }} />
          </div>

          <div>
            <label style={labelStyle}>Teléfono</label>
            <input type="text" name="telefono" value={formData.telefono || ''} onChange={manejarCambio} required style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Dirección</label>
              <input type="text" name="direccion" value={formData.direccion || ''} onChange={manejarCambio} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Ciudad</label>
              <input type="text" name="ciudad" value={formData.ciudad || ''} onChange={manejarCambio} required style={inputStyle} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Guardando...' : 'Guardar Información'}
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #CBD5E1', borderRadius: '8px', boxSizing: 'border-box' };
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px' };
const buttonStyle = { width: '100%', padding: '14px', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' };

export default Perfil;