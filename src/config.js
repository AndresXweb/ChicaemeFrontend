// src/config.js
// URL base del backend. En local usa localhost, en Railway usa la variable VITE_API_URL.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
