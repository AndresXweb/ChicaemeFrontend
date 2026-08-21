import React from 'react';
import { Link } from 'react-router-dom';

const Terminos = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9', fontFamily: 'Inter', padding: '40px 20px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>

        <Link to="/registro" style={{ color: '#6366F1', fontSize: '13px', textDecoration: 'none', fontWeight: '600' }}>← Volver al registro</Link>

        <h1 style={{ color: '#0F172A', fontSize: '26px', marginTop: '20px' }}>Términos y Condiciones</h1>
        <p style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '30px' }}>Chicaeme SAS — Última actualización: 2026</p>

        <div style={{ color: '#334155', fontSize: '14px', lineHeight: 1.7 }}>

          <h2 style={sectionTitle}>1. Objeto</h2>
          <p>
            Estos Términos y Condiciones regulan el uso de la plataforma de Chicaeme SAS para la
            solicitud de cotizaciones de servicios de banquetería, eventos y alquiler de artículos.
            Al crear una cuenta, aceptas quedar sujeto a estos términos.
          </p>

          <h2 style={sectionTitle}>2. Registro y cuenta de usuario</h2>
          <p>
            Para solicitar cotizaciones debes registrarte con información veraz y actualizada.
            Eres responsable de mantener la confidencialidad de tu contraseña y de toda actividad
            realizada desde tu cuenta.
          </p>

          <h2 style={sectionTitle}>3. Cotizaciones y contratación de servicios</h2>
          <p>
            Las cotizaciones generadas a través de la plataforma son estimaciones sujetas a
            confirmación por parte de Chicaeme SAS. La contratación efectiva del servicio, sus
            condiciones de pago y cancelación se formalizan por los canales que la empresa indique.
          </p>

          <h2 style={sectionTitle}>4. Uso aceptable</h2>
          <p>
            Te comprometes a no usar la plataforma para fines ilícitos, a no intentar acceder a
            cuentas ajenas ni a información que no te pertenezca, y a no interferir con el
            funcionamiento normal del sistema.
          </p>

          <h2 style={sectionTitle}>5. Modificaciones</h2>
          <p>
            Chicaeme SAS puede actualizar estos términos en cualquier momento. Los cambios se
            entienden aceptados al continuar usando la plataforma después de su publicación.
          </p>

          <h1 style={{ color: '#0F172A', fontSize: '22px', marginTop: '40px' }}>
            Política de Tratamiento de Datos Personales
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '20px' }}>
            En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013 (Colombia)
          </p>

          <h2 style={sectionTitle}>1. Responsable del tratamiento</h2>
          <p>Chicaeme SAS es responsable del tratamiento de los datos personales que recolecta a través de esta plataforma.</p>

          <h2 style={sectionTitle}>2. Datos que recolectamos</h2>
          <p>
            Nombres, apellidos, dirección, ciudad, teléfono y correo electrónico, suministrados
            voluntariamente al registrarte, solicitar una cotización o contactarnos.
          </p>

          <h2 style={sectionTitle}>3. Finalidad</h2>
          <p>
            Usamos tus datos para gestionar tu cuenta, procesar solicitudes de cotización,
            contactarte sobre tus pedidos y, si lo autorizas, enviarte información comercial.
          </p>

          <h2 style={sectionTitle}>4. Derechos del titular (Habeas Data)</h2>
          <p>
            Tienes derecho a conocer, actualizar, rectificar y solicitar la supresión de tus datos,
            así como a revocar la autorización otorgada, contactando a Chicaeme SAS por los canales
            dispuestos para ello.
          </p>

          <h2 style={sectionTitle}>5. Seguridad</h2>
          <p>
            Adoptamos medidas técnicas y administrativas razonables para proteger tus datos contra
            acceso no autorizado, pérdida o alteración.
          </p>

          <div style={{ marginTop: '32px', padding: '14px', background: '#FFFBEB', borderRadius: '8px', fontSize: '12px', color: '#92400E' }}>
            Este texto es un borrador de referencia general y no constituye asesoría legal.
            Antes de publicarlo, se recomienda que sea revisado por un abogado para ajustarlo
            a la operación real de Chicaeme SAS.
          </div>

        </div>
      </div>
    </div>
  );
};

const sectionTitle = { color: '#0F172A', fontSize: '15px', fontWeight: '600', marginTop: '22px', marginBottom: '6px' };

export default Terminos;
