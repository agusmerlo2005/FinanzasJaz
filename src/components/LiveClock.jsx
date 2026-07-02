import { useEffect, useState } from 'react'
import { ahoraArgentina } from '../lib/time'

// Reloj en vivo de Argentina: fecha completa + hora con segundos.
export default function LiveClock({ variante = 'grande' }) {
  const [t, setT] = useState(ahoraArgentina)

  useEffect(() => {
    const id = setInterval(() => setT(ahoraArgentina()), 1000)
    return () => clearInterval(id)
  }, [])

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

  if (variante === 'chico') {
    return (
      <span className="numeros" style={{ color: 'var(--income-2)' }}>
        {t.hora}:{t.min}
        <span className="parpadea">:</span>
        {t.seg}
      </span>
    )
  }

  return (
    <div className="text-center">
      <p className="eyebrow mb-2">{cap(t.diaSemana)} · Argentina 🇦🇷</p>
      <div
        className="display numeros flex items-baseline justify-center gap-1"
        style={{ fontSize: 'clamp(2.4rem, 7vw, 4.2rem)', color: 'var(--title)' }}
      >
        <span>{t.hora}</span>
        <span className="parpadea" style={{ color: 'var(--gold)' }}>:</span>
        <span>{t.min}</span>
        <span className="parpadea" style={{ color: 'var(--gold)' }}>:</span>
        <span style={{ color: 'var(--income-2)' }}>{t.seg}</span>
      </div>
      <p className="mt-1.5" style={{ fontSize: '0.95rem', color: 'var(--text-soft)' }}>
        {t.dia} de {cap(t.mes)} de {t.anio}
      </p>
    </div>
  )
}
