import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importamos el Layout (para el admin) y las páginas de cliente
import Layout from './components/Layout';
import Inicio from './pages/Inicio';
import Usuarios from './pages/Usuarios';
import Cotizaciones from './pages/Cotizaciones';
import Servicios from './pages/Servicios';
import ArticulosAlquiler from './pages/ArticulosAlquiler';
import GestionarProductos from './pages/GestionarProductos';

// Tus páginas de cliente
import SolicitudServicio from './pages/SolicitudServicio'; 
import FormularioAlquiler from './pages/FormularioAlquiler';
import Login from './pages/Login';
import MisPedidos from './pages/MisPedidos';
import EditarPedido from './pages/EditarPedido';
import Landinpage from './pages/Landinpage';
import Perfil from './pages/Perfil'; 

// NUEVO: Contactos (formulario público, archivo se llama Contactos.jsx) y ContactosAdmin (panel admin)
import Contacto from './pages/Contactos';
import ContactosAdmin from './pages/ContactosAdmin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* 1. PORTAL PÚBLICO Y DE CLIENTES */}
        <Route path="/" element={<Landinpage />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/solicitar" element={<SolicitudServicio />} />
        <Route path="/catalogo" element={<FormularioAlquiler />} />
        <Route path="/mis-pedidos" element={<MisPedidos />} />
        <Route path="/editar-pedido/:id" element={<EditarPedido />} />
        <Route path="/perfil" element={<Perfil />} />

        {/* NUEVA RUTA - Contacto (pública, sin login requerido) */}
        <Route path="/contacto" element={<Contacto />} />

        {/* 3. RUTA ADMINISTRATIVA (Dashboard) */}
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="cotizaciones" element={<Cotizaciones />} />
          <Route path="servicios" element={<Servicios />} />
          <Route path="articulos" element={<ArticulosAlquiler />} />
          <Route path="pedido/:id/productos" element={<GestionarProductos />} />
          {/* NUEVA RUTA - Contactos recibidos */}
          <Route path="contactos" element={<ContactosAdmin />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;