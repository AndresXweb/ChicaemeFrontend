import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../services/authService';

const USUARIO_KEY = 'usuarioChicaeme';

// Uso:
//   <RutaProtegida><Perfil /></RutaProtegida>                 -> requiere estar logueado
//   <RutaProtegida soloAdmin><Layout /></RutaProtegida>       -> requiere estar logueado Y ser admin
const RutaProtegida = ({ children, soloAdmin = false }) => {
  const token = getToken();
  const raw = localStorage.getItem(USUARIO_KEY);
  const usuario = raw ? JSON.parse(raw) : null;

  // Sin token o sin usuario guardado -> no hay sesión válida
  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }

  // El backend guarda el rol como "Administrador" (ver CustomUserDetailsService.mapearRol,
  // que acepta "administrador" o "admin" sin importar mayúsculas).
  const esAdmin = ['administrador', 'admin'].includes(
    (usuario.tipoUsuario || '').trim().toLowerCase()
  );

  if (soloAdmin && !esAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RutaProtegida;
