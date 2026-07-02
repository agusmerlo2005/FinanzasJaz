import { APPS_SCRIPT_URL } from '../config'

// ============================================================
//  Capa de datos
//  - Si hay APPS_SCRIPT_URL -> Google Sheets (vía Apps Script)
//  - Si no -> localStorage (modo local / demo)
// ============================================================

const LS_KEY = 'jaz_movimientos'
const usaSheets = () => Boolean(APPS_SCRIPT_URL)

// ---------- LocalStorage ----------
function leerLocal() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]')
  } catch {
    return []
  }
}
function guardarLocal(lista) {
  localStorage.setItem(LS_KEY, JSON.stringify(lista))
}

// ---------- Google Sheets ----------
async function sheetsGet() {
  const res = await fetch(`${APPS_SCRIPT_URL}?action=list`, {
    method: 'GET',
  })
  const data = await res.json()
  return Array.isArray(data) ? data : data.movimientos || []
}

async function sheetsPost(payload) {
  // Apps Script + text/plain evita el preflight CORS
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  })
  return res.json()
}

// ---------- API pública ----------
export const estaEnLaNube = usaSheets

export async function listarMovimientos() {
  if (usaSheets()) {
    try {
      return await sheetsGet()
    } catch (e) {
      console.warn('Fallo Sheets, uso local:', e)
      return leerLocal()
    }
  }
  return leerLocal()
}

export async function agregarMovimiento(mov) {
  const nuevo = {
    id: crypto.randomUUID(),
    fecha: new Date().toISOString(),
    ...mov,
  }
  if (usaSheets()) {
    try {
      await sheetsPost({ action: 'add', movimiento: nuevo })
    } catch (e) {
      console.warn('Fallo Sheets al agregar, guardo local:', e)
    }
  }
  const lista = leerLocal()
  lista.unshift(nuevo)
  guardarLocal(lista)
  return nuevo
}

export async function borrarMovimiento(id) {
  if (usaSheets()) {
    try {
      await sheetsPost({ action: 'delete', id })
    } catch (e) {
      console.warn('Fallo Sheets al borrar:', e)
    }
  }
  const lista = leerLocal().filter((m) => m.id !== id)
  guardarLocal(lista)
}

// ---------- Perfil (siempre local: foto, cumple, etc.) ----------
const PERFIL_KEY = 'jaz_perfil'
const PERFIL_DEFAULT = {
  nombre: 'Jazmín',
  apellido: 'De Grande Muscatelo',
  apodo: 'Jaz',
  nacimiento: '',
  foto: '',
  frase: 'Cada peso cuenta cuando se trata de tus sueños ✨',
  color: 'vino',
}

export function leerPerfil() {
  try {
    return { ...PERFIL_DEFAULT, ...JSON.parse(localStorage.getItem(PERFIL_KEY) || '{}') }
  } catch {
    return PERFIL_DEFAULT
  }
}
export function guardarPerfil(p) {
  localStorage.setItem(PERFIL_KEY, JSON.stringify(p))
}
