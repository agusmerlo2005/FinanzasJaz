import { useState } from 'react'
import { plata } from '../lib/format'
import { fechaCorta, horaCorta } from '../lib/time'

// Libro debe/haber: lista de movimientos con filtro y borrado.
export default function Ledger({ movimientos, onBorrar, cargando }) {
  const [filtro, setFiltro] = useState('todos')

  const lista = movimientos.filter((m) =>
    filtro === 'todos' ? true : m.tipo === filtro,
  )

  return (
    <div className="tarjeta filo-oro p-5 sm:p-6 aparecer">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <p className="eyebrow">El libro</p>
          <h3 className="display" style={{ fontSize: '1.35rem' }}>Debe &amp; Haber</h3>
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border)' }}>
          {[
            { id: 'todos', label: 'Todo' },
            { id: 'ingreso', label: 'Haber' },
            { id: 'gasto', label: 'Debe' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className="px-3.5 py-1.5 rounded-lg text-sm font-semibold transition"
              style={
                filtro === f.id
                  ? { background: 'var(--surface-hi)', color: 'var(--title)' }
                  : { color: 'var(--text-soft)' }
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="scroll-fino" style={{ maxHeight: 460, overflowY: 'auto' }}>
        {cargando ? (
          <Vacio icono="⏳" texto="Cargando movimientos…" />
        ) : lista.length === 0 ? (
          <Vacio icono="🕊️" texto="Todavía no hay movimientos. ¡Anotá el primero!" />
        ) : (
          <ul className="space-y-1">
            {lista.map((m, i) => (
              <li
                key={m.id}
                className="group grid grid-cols-[1fr_auto_auto] gap-2 sm:gap-3 items-center px-2 sm:px-3 py-2.5 rounded-xl transition"
                style={{ animation: `aparecer 0.4s ${Math.min(i * 0.03, 0.4)}s both` }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="shrink-0 grid place-items-center rounded-xl text-lg"
                    style={{
                      width: 42, height: 42,
                      background: m.tipo === 'gasto' ? 'var(--expense-dim)' : 'var(--income-dim)',
                    }}
                  >
                    {m.emoji || (m.tipo === 'gasto' ? '💸' : '💰')}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold truncate" style={{ color: 'var(--text)' }}>{m.concepto}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-mute)' }}>
                      {m.categoriaLabel} · {fechaCorta(m.fecha)} · {horaCorta(m.fecha)} hs
                    </p>
                  </div>
                </div>

                <p
                  className={`display numeros text-right whitespace-nowrap txt-${m.tipo}`}
                  style={{ fontSize: '1.05rem' }}
                >
                  {m.tipo === 'gasto' ? '−' : '+'}{plata(m.monto)}
                </p>

                <button
                  onClick={() => onBorrar(m.id)}
                  className="sm:opacity-0 sm:group-hover:opacity-100 transition text-sm justify-self-end"
                  style={{ width: 26, color: 'var(--expense-2)' }}
                  title="Borrar"
                  aria-label="Borrar movimiento"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function Vacio({ icono, texto }) {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-3">{icono}</div>
      <p className="italic" style={{ color: 'var(--text-soft)' }}>{texto}</p>
    </div>
  )
}
