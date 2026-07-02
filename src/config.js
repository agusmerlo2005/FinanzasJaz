// ============================================================
//  Configuración de la app de Jazmín
// ============================================================

// --- Acceso ---
// Login "simbólico": la contraseña vive en el navegador, no es
// seguridad real, pero sirve como traba personal.
export const AUTH = {
  usuario: 'Jazmin De Grande Muscatelo',
  password: '20032010Jaz',
}

// --- Base de datos ---
// Pegá acá la URL del despliegue de tu Google Apps Script (termina en /exec)
// para que los datos vayan a Google Sheets. Si lo dejás vacío, la app
// funciona igual guardando todo en el navegador (modo local).
// Ver instrucciones en INSTRUCCIONES.md
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwuLU0LXJoSIVLzS8ABHHf52FAAoP9y9_FVUhYRjTPjyiH67q2Gezib_XsbQEBJtl2P/exec'

// --- Zona horaria ---
export const TZ = 'America/Argentina/Buenos_Aires'
export const LOCALE = 'es-AR'
export const MONEDA = 'ARS'

// --- Categorías por defecto (podés editarlas desde el código) ---
export const CATEGORIAS = {
  gasto: [
    { id: 'comida', label: 'Comida', emoji: '🍓' },
    { id: 'salidas', label: 'Salidas', emoji: '🍸' },
    { id: 'ropa', label: 'Ropa & Belleza', emoji: '💄' },
    { id: 'transporte', label: 'Transporte', emoji: '🚕' },
    { id: 'hogar', label: 'Hogar', emoji: '🏡' },
    { id: 'salud', label: 'Salud', emoji: '🌿' },
    { id: 'caprichos', label: 'Caprichos', emoji: '🎀' },
    { id: 'otros_g', label: 'Otros', emoji: '✨' },
  ],
  ingreso: [
    { id: 'sueldo', label: 'Sueldo', emoji: '💼' },
    { id: 'regalo', label: 'Regalo', emoji: '🎁' },
    { id: 'ahorro', label: 'Ahorro', emoji: '🐷' },
    { id: 'extra', label: 'Extra', emoji: '🌟' },
    { id: 'otros_i', label: 'Otros', emoji: '💌' },
  ],
}
