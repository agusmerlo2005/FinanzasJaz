import { TZ, LOCALE } from '../config'

// Devuelve las partes de la fecha/hora actual en Argentina.
export function ahoraArgentina() {
  const d = new Date()
  const partes = new Intl.DateTimeFormat(LOCALE, {
    timeZone: TZ,
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(d)

  const get = (t) => partes.find((p) => p.type === t)?.value ?? ''

  return {
    diaSemana: get('weekday'),
    dia: get('day'),
    mes: get('month'),
    anio: get('year'),
    hora: get('hour'),
    min: get('minute'),
    seg: get('second'),
    // ISO con offset argentino, útil para guardar
    iso: d.toISOString(),
  }
}

// Saludo según la hora argentina.
export function saludoPorHora() {
  const h = Number(
    new Intl.DateTimeFormat(LOCALE, {
      timeZone: TZ,
      hour: '2-digit',
      hour12: false,
    }).format(new Date()),
  )
  if (h >= 5 && h < 12) return { texto: 'Buenos días', emoji: '☀️' }
  if (h >= 12 && h < 20) return { texto: 'Buenas tardes', emoji: '🌤️' }
  return { texto: 'Buenas noches', emoji: '🌙' }
}

// Formatea un ISO a fecha corta local argentina.
export function fechaCorta(iso) {
  try {
    return new Intl.DateTimeFormat(LOCALE, {
      timeZone: TZ,
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

export function horaCorta(iso) {
  try {
    return new Intl.DateTimeFormat(LOCALE, {
      timeZone: TZ,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

export function nombreMes(iso) {
  try {
    return new Intl.DateTimeFormat(LOCALE, {
      timeZone: TZ,
      month: 'short',
      year: '2-digit',
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

// Edad y días para el próximo cumpleaños a partir de "YYYY-MM-DD".
export function infoCumple(fechaNacimiento) {
  if (!fechaNacimiento) return null
  const [y, m, d] = fechaNacimiento.split('-').map(Number)
  if (!y || !m || !d) return null
  const hoy = new Date()
  let edad = hoy.getFullYear() - y
  const cumpleEsteAnio = new Date(hoy.getFullYear(), m - 1, d)
  const yaPaso =
    hoy.getMonth() > m - 1 ||
    (hoy.getMonth() === m - 1 && hoy.getDate() > d)
  if (!yaPaso) edad -= 1

  const proximo = new Date(hoy.getFullYear(), m - 1, d)
  if (
    proximo < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  ) {
    proximo.setFullYear(hoy.getFullYear() + 1)
  }
  const diasFaltan = Math.round(
    (proximo - new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())) /
      86400000,
  )
  return { edad, diasFaltan, esHoy: diasFaltan === 0, cumpleEsteAnio }
}
