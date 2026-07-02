import { useState } from 'react'
import { CATEGORIAS } from '../config'

export default function AddTransaction({ onAgregar }) {
  const [tipo, setTipo] = useState('gasto')
  const [monto, setMonto] = useState('')
  const [concepto, setConcepto] = useState('')
  const [categoria, setCategoria] = useState('comida')
  const [guardando, setGuardando] = useState(false)
  const [ok, setOk] = useState(false)

  const cats = CATEGORIAS[tipo]

  function cambiarTipo(nuevo) {
    setTipo(nuevo)
    setCategoria(CATEGORIAS[nuevo][0].id)
  }

  async function enviar(e) {
    e.preventDefault()
    const n = parseFloat(String(monto).replace(',', '.'))
    if (!n || n <= 0) return
    setGuardando(true)
    const cat = cats.find((c) => c.id === categoria)
    await onAgregar({
      tipo,
      monto: n,
      concepto: concepto.trim() || cat.label,
      categoria: cat.id,
      categoriaLabel: cat.label,
      emoji: cat.emoji,
    })
    setGuardando(false)
    setMonto('')
    setConcepto('')
    setOk(true)
    setTimeout(() => setOk(false), 1400)
  }

  const esGasto = tipo === 'gasto'
  const activo = (on) =>
    on
      ? esGasto
        ? { background: 'var(--expense-dim)', color: 'var(--expense-2)', borderColor: 'rgba(255,122,102,0.4)' }
        : { background: 'var(--income-dim)', color: 'var(--income-2)', borderColor: 'rgba(53,208,165,0.4)' }
      : { background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-soft)' }

  return (
    <form onSubmit={enviar} className="tarjeta filo-oro p-5 sm:p-6 aparecer">
      <p className="eyebrow mb-1">Nuevo movimiento</p>
      <h3 className="display mb-4" style={{ fontSize: '1.35rem' }}>
        Anotá tu {esGasto ? 'gasto' : 'ingreso'}
      </h3>

      {/* Selector tipo */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button type="button" onClick={() => cambiarTipo('gasto')} className="btn"
          style={{ ...activo(esGasto), border: '1px solid' }}>
          ↓ Debe · Gasto
        </button>
        <button type="button" onClick={() => cambiarTipo('ingreso')} className="btn"
          style={{ ...activo(!esGasto), border: '1px solid' }}>
          ↑ Haber · Ingreso
        </button>
      </div>

      {/* Monto */}
      <div className="mb-4">
        <label className="etiqueta">Monto</label>
        <div className="relative">
          <span
            className="absolute top-1/2 -translate-y-1/2 display pointer-events-none"
            style={{ left: '1rem', color: 'var(--gold)', fontSize: '1.3rem', lineHeight: 1 }}
          >
            $
          </span>
          <input
            className="campo numeros"
            style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', paddingLeft: '2.75rem' }}
            inputMode="decimal"
            placeholder="0,00"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
        </div>
      </div>

      {/* Concepto */}
      <div className="mb-4">
        <label className="etiqueta">Concepto (opcional)</label>
        <input
          className="campo"
          placeholder={esGasto ? 'Ej: Café con amigas' : 'Ej: Sueldo de julio'}
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
        />
      </div>

      {/* Categorías (altura reservada para que la tarjeta no salte al cambiar de tipo) */}
      <div className="mb-5">
        <label className="etiqueta">Categoría</label>
        <div className="flex flex-wrap gap-2 content-start" style={{ minHeight: '9.5rem' }}>
          {cats.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoria(c.id)}
              className={`chip ${categoria === c.id ? (esGasto ? 'activo-gasto' : 'activo-ingreso') : ''}`}
            >
              <span>{c.emoji}</span> {c.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="btn w-full"
        disabled={guardando}
        style={
          esGasto
            ? { background: 'linear-gradient(135deg,var(--expense-2),var(--expense))', color: '#2a0d08', fontWeight: 700 }
            : { background: 'linear-gradient(135deg,var(--income-2),var(--income))', color: '#04120d', fontWeight: 700 }
        }
      >
        {guardando ? 'Guardando…' : ok ? '¡Anotado! ✓' : `Agregar ${esGasto ? 'gasto' : 'ingreso'}`}
      </button>
    </form>
  )
}
