import { LOCALE, MONEDA } from '../config'

const fmt = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: MONEDA,
  minimumFractionDigits: 2,
})

const fmtCompacto = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: MONEDA,
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function plata(n) {
  return fmt.format(Number(n) || 0)
}

export function plataCompacta(n) {
  return fmtCompacto.format(Number(n) || 0)
}

// Devuelve el monto sin signo, formateado.
export function plataAbs(n) {
  return fmt.format(Math.abs(Number(n) || 0))
}
