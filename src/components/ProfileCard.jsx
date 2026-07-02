import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { guardarPerfil } from '../lib/api'
import { infoCumple } from '../lib/time'

const INICIALES = (p) =>
  `${p.nombre?.[0] ?? ''}${p.apellido?.[0] ?? ''}`.toUpperCase() || 'J'

export default function ProfileCard({ perfil, setPerfil, onSalir }) {
  const [editando, setEditando] = useState(false)
  const [draft, setDraft] = useState(perfil)
  const fileRef = useRef(null)
  const cumple = infoCumple(perfil.nacimiento)

  // Bloquea el scroll del fondo mientras el modal está abierto.
  useEffect(() => {
    if (editando) document.body.classList.add('modal-abierto')
    else document.body.classList.remove('modal-abierto')
    return () => document.body.classList.remove('modal-abierto')
  }, [editando])

  // Cerrar con Escape
  useEffect(() => {
    if (!editando) return
    const onKey = (e) => e.key === 'Escape' && setEditando(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [editando])

  function abrir() {
    setDraft(perfil)
    setEditando(true)
  }
  function guardar() {
    setPerfil(draft)
    guardarPerfil(draft)
    setEditando(false)
  }
  function subirFoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setDraft((d) => ({ ...d, foto: reader.result }))
    reader.readAsDataURL(file)
  }

  return (
    <>
      <div className="tarjeta filo-oro p-5 sm:p-6 aparecer">
        <div className="flex items-center gap-4">
          <Avatar perfil={perfil} size={60} />
          <div className="min-w-0">
            <p className="eyebrow">Su cuenta</p>
            <h2 className="display truncate" style={{ fontSize: '1.35rem' }}>
              {perfil.nombre} {perfil.apellido}
            </h2>
            {perfil.apodo && (
              <p className="text-sm" style={{ color: 'var(--text-soft)' }}>@{perfil.apodo}</p>
            )}
          </div>
        </div>

        {perfil.frase && (
          <p
            className="text-sm mt-4 pl-3 italic"
            style={{ color: 'var(--text-soft)', borderLeft: '2px solid var(--gold)' }}
          >
            {perfil.frase}
          </p>
        )}

        {cumple && (
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="chip" style={{ cursor: 'default' }}>🎂 {cumple.edad} años</span>
            {cumple.esHoy ? (
              <span className="chip activo-ingreso" style={{ cursor: 'default' }}>🥳 ¡Hoy es tu cumple!</span>
            ) : (
              <span className="chip" style={{ cursor: 'default' }}>🎈 faltan {cumple.diasFaltan} días</span>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-5">
          <button className="btn btn-fantasma flex-1" onClick={abrir}>✏️ Editar perfil</button>
          <button className="btn btn-fantasma" onClick={onSalir} title="Cerrar sesión" style={{ padding: '0.72rem 0.9rem' }}>
            🚪
          </button>
        </div>
      </div>

      {editando && <ModalEditar {...{ draft, setDraft, fileRef, subirFoto, guardar, cerrar: () => setEditando(false) }} />}
    </>
  )
}

function ModalEditar({ draft, setDraft, fileRef, subirFoto, guardar, cerrar }) {
  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 100, background: 'rgba(4,5,7,0.72)', backdropFilter: 'blur(6px)' }}
      onClick={cerrar}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="tarjeta filo-oro w-full max-w-lg p-6 sm:p-7 aparecer scroll-fino"
        style={{ maxHeight: 'calc(100dvh - 2rem)', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="display" style={{ fontSize: '1.5rem' }}>Personalizá tu perfil</h3>
          <button className="btn btn-fantasma" onClick={cerrar} style={{ padding: '0.5rem 0.8rem' }}>✕</button>
        </div>

        <div className="flex items-center gap-4 sm:gap-5 mb-6">
          <Avatar perfil={draft} size={78} />
          <div className="flex flex-col gap-2">
            <button className="btn btn-oro" onClick={() => fileRef.current?.click()}>📷 Cambiar foto</button>
            {draft.foto && (
              <button className="btn btn-fantasma" onClick={() => setDraft((d) => ({ ...d, foto: '' }))}>
                Quitar foto
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={subirFoto} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nombre" value={draft.nombre} onChange={(v) => setDraft({ ...draft, nombre: v })} />
          <Field label="Apellido" value={draft.apellido} onChange={(v) => setDraft({ ...draft, apellido: v })} />
          <Field label="Apodo" value={draft.apodo} onChange={(v) => setDraft({ ...draft, apodo: v })} />
          <div>
            <label className="etiqueta">Fecha de nacimiento</label>
            <input
              type="date"
              className="campo"
              value={draft.nacimiento}
              onChange={(e) => setDraft({ ...draft, nacimiento: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="etiqueta">Frase favorita</label>
          <textarea
            className="campo"
            rows={2}
            value={draft.frase}
            onChange={(e) => setDraft({ ...draft, frase: e.target.value })}
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button className="btn btn-fantasma flex-1" onClick={cerrar}>Cancelar</button>
          <button className="btn btn-primario flex-1" onClick={guardar}>Guardar</button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function Avatar({ perfil, size }) {
  return (
    <div
      className="rounded-2xl flex items-center justify-center shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        border: '1px solid var(--border-hi)',
        background: 'linear-gradient(135deg, var(--income), var(--gold))',
        color: '#04120d',
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontWeight: 700,
        fontSize: size * 0.4,
      }}
    >
      {perfil.foto ? (
        <img src={perfil.foto} alt="Foto de perfil" className="w-full h-full object-cover" />
      ) : (
        INICIALES(perfil)
      )}
    </div>
  )
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="etiqueta">{label}</label>
      <input className="campo" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
