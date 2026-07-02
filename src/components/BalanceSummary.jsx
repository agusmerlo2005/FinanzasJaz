import { plata } from '../lib/format'

// Resumen: Haber (ingresos), Debe (gastos) y Saldo, con anillo de balance.
export default function BalanceSummary({ ingresos, gastos }) {
  const saldo = ingresos - gastos
  const total = ingresos + gastos
  const pctIngreso = total ? (ingresos / total) * 100 : 50
  const positivo = saldo >= 0

  const r = 52
  const c = 2 * Math.PI * r
  const dash = (pctIngreso / 100) * c

  return (
    <div className="tarjeta filo-oro p-5 sm:p-7 aparecer">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-7">
        {/* Anillo */}
        <div className="relative shrink-0" style={{ width: 148, height: 148 }}>
          <svg width="148" height="148" viewBox="0 0 148 148" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="74" cy="74" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="13" />
            <circle
              cx="74" cy="74" r={r} fill="none"
              stroke="url(#gradIngreso)" strokeWidth="13" strokeLinecap="round"
              strokeDasharray={`${dash} ${c}`}
            />
            <defs>
              <linearGradient id="gradIngreso" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="var(--income-2)" />
                <stop offset="1" stopColor="var(--income)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="eyebrow" style={{ fontSize: '0.56rem' }}>Saldo</span>
            <span
              className="display numeros"
              style={{ fontSize: '1.1rem', color: positivo ? 'var(--income-2)' : 'var(--expense-2)' }}
            >
              {plata(saldo)}
            </span>
          </div>
        </div>

        {/* Cifras */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1 w-full">
          <Metrica etiqueta="Haber · Ingresos" valor={ingresos} tipo="ingreso" emoji="↑" />
          <Metrica etiqueta="Debe · Gastos" valor={gastos} tipo="gasto" emoji="↓" />
          <div
            className="col-span-2 tarjeta-plana p-4 flex items-center justify-between"
            style={{ background: positivo ? 'var(--income-dim)' : 'var(--expense-dim)' }}
          >
            <div className="min-w-0">
              <p className="eyebrow">Balance del período</p>
              <p
                className={`display numeros ${positivo ? 'txt-ingreso' : 'txt-gasto'}`}
                style={{ fontSize: 'clamp(1.5rem, 5vw, 1.9rem)' }}
              >
                {plata(saldo)}
              </p>
            </div>
            <span className="text-2xl sm:text-3xl shrink-0 ml-3">{positivo ? '🌿' : '🔥'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Metrica({ etiqueta, valor, tipo, emoji }) {
  return (
    <div className="tarjeta-plana p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full punto-${tipo}`} />
        <p className="eyebrow" style={{ fontSize: '0.58rem' }}>{etiqueta}</p>
      </div>
      <p className={`display numeros txt-${tipo}`} style={{ fontSize: 'clamp(1.2rem, 4vw, 1.55rem)' }}>
        <span style={{ fontSize: '0.9rem', opacity: 0.6 }}>{emoji}</span> {plata(valor)}
      </p>
    </div>
  )
}
