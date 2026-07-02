import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { guardarCategorias } from '../lib/categories'

const PALETA = [
  '🛒', '🍔', '☕', '🍷', '🍸', '🍎', '🥐', '🍰',
  '👗', '💄', '💅', '👠', '🧴', '🌿', '💊', '🏥',
  '🚕', '⛽', '🚌', '🏠', '💡', '📶', '🐶', '🎀',
  '🎁', '📚', '🎬', '🎮', '✈️', '🏖️', '💻', '📱',
  '💼', '💰', '🐷', '🌟', '💌', '🎂', '🏋️', '🏷️',
]

export default function CategoryManager({ tipoInicial, categorias, setCategorias, onClose }) {
  const [tipo, setTipo] = useState(tipoInicial)
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(categorias)))
  const [nuevoEmoji, setNuevoEmoji] = useState('🏷️')
  const [nuevoLabel, setNuevoLabel] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    document.body.classList.add('modal-abierto')
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('modal-abierto')
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const lista = draft[tipo]
  const esGasto = tipo === 'gasto'

  function actualizar(id, campo, valor) {
    setDraft((d) => ({
      ...d,
      [tipo]: d[tipo].map((c) => (c.id === id ? { ...c, [campo]: valor } : c)),
    }))
  }
  function borrar(id) {
    setDraft((d) => ({ ...d, [tipo]: d[tipo].filter((c) => c.id !== id) }))
  }
  function agregar() {
    const label = nuevoLabel.trim()
    if (!label) return
    setDraft((d) => ({
      ...d,
      [tipo]: [
        ...d[tipo],
        { id: crypto.randomUUID(), emoji: nuevoEmoji || '🏷️', label },
      ],
    }))
    setNuevoLabel('')
    setNuevoEmoji('🏷️')
    setError('')
  }
  function guardar() {
    const limpiar = (arr) =>
      arr
        .map((c) => ({
          id: c.id,
          emoji: (c.emoji || '🏷️').trim() || '🏷️',
          label: (c.label || '').trim(),
        }))
        .filter((c) => c.label)
    const limpio = { gasto: limpiar(draft.gasto), ingreso: limpiar(draft.ingreso) }
    if (!limpio.gasto.length || !limpio.ingreso.length) {
      setError('Dejá al menos una categoría en gastos y una en ingresos.')
      return
    }
    setCategorias(limpio)
    guardarCategorias(limpio)
    onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 100, background: 'rgba(4,5,7,0.72)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="tarjeta filo-oro w-full max-w-lg p-6 sm:p-7 aparecer scroll-fino"
        style={{ maxHeight: 'calc(100dvh - 2rem)', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="display" style={{ fontSize: '1.5rem' }}>Categorías</h3>
          <button className="btn btn-fantasma" onClick={onClose} style={{ padding: '0.5rem 0.8rem' }}>✕</button>
        </div>

        {/* Toggle tipo */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl mb-5" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border)' }}>
          {['gasto', 'ingreso'].map((t) => (
            <button
              key={t}
              onClick={() => { setTipo(t); setError('') }}
              className="py-2 rounded-lg text-sm font-semibold transition"
              style={tipo === t ? { background: 'var(--surface-hi)', color: 'var(--title)' } : { color: 'var(--text-soft)' }}
            >
              {t === 'gasto' ? '↓ Gastos (Debe)' : '↑ Ingresos (Haber)'}
            </button>
          ))}
        </div>

        {/* Alta rápida */}
        <div className="tarjeta-plana p-4 mb-5">
          <label className="etiqueta">Nueva categoría de {esGasto ? 'gasto' : 'ingreso'}</label>
          <div className="flex gap-2">
            <input
              className="campo text-center"
              style={{ width: 56, fontSize: '1.3rem', padding: '0.5rem' }}
              value={nuevoEmoji}
              onChange={(e) => setNuevoEmoji(e.target.value)}
              aria-label="Emoji"
            />
            <input
              className="campo"
              placeholder="Nombre (ej: Mascotas)"
              value={nuevoLabel}
              onChange={(e) => setNuevoLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregar())}
            />
            <button className="btn btn-primario" onClick={agregar} style={{ padding: '0.5rem 1rem' }}>+</button>
          </div>
          {/* Paleta de emojis */}
          <div className="flex flex-wrap gap-1 mt-3">
            {PALETA.map((e) => (
              <button
                key={e}
                onClick={() => setNuevoEmoji(e)}
                className="rounded-lg text-lg transition"
                style={{
                  width: 34, height: 34,
                  background: nuevoEmoji === e ? 'var(--surface-hi)' : 'transparent',
                  border: nuevoEmoji === e ? '1px solid var(--border-hi)' : '1px solid transparent',
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Lista editable */}
        <label className="etiqueta">Tus categorías ({lista.length})</label>
        <ul className="space-y-2 mt-1">
          {lista.map((c) => (
            <li key={c.id} className="flex gap-2 items-center">
              <input
                className="campo text-center"
                style={{ width: 52, fontSize: '1.2rem', padding: '0.5rem' }}
                value={c.emoji}
                onChange={(e) => actualizar(c.id, 'emoji', e.target.value)}
                aria-label="Emoji"
              />
              <input
                className="campo"
                value={c.label}
                onChange={(e) => actualizar(c.id, 'label', e.target.value)}
              />
              <button
                onClick={() => borrar(c.id)}
                className="btn btn-fantasma"
                style={{ padding: '0.6rem 0.8rem', color: 'var(--expense-2)' }}
                title="Borrar"
              >
                🗑
              </button>
            </li>
          ))}
          {lista.length === 0 && (
            <li className="text-sm italic py-2" style={{ color: 'var(--text-soft)' }}>
              No hay categorías. Agregá al menos una arriba.
            </li>
          )}
        </ul>

        {error && (
          <p className="text-sm font-semibold mt-4" style={{ color: 'var(--expense-2)' }}>{error}</p>
        )}

        <div className="flex gap-3 mt-6">
          <button className="btn btn-fantasma flex-1" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primario flex-1" onClick={guardar}>Guardar</button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
