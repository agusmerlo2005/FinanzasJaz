import { CATEGORIAS } from '../config'

// Categorías editables por la usuaria (se guardan en el dispositivo).
// Arrancan desde las de config.js la primera vez.
const KEY = 'jaz_categorias'

const clon = (obj) => JSON.parse(JSON.stringify(obj))

export function leerCategorias() {
  try {
    const g = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (g && Array.isArray(g.gasto) && Array.isArray(g.ingreso)) return g
  } catch {
    /* ignore */
  }
  return clon(CATEGORIAS)
}

export function guardarCategorias(cats) {
  localStorage.setItem(KEY, JSON.stringify(cats))
}
