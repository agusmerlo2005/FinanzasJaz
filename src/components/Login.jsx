import { useState } from 'react'
import { AUTH } from '../config'
import LiveClock from './LiveClock'
import { saludoPorHora } from '../lib/time'

export default function Login({ onEntrar }) {
  const [usuario, setUsuario] = useState('')
  const [pass, setPass] = useState('')
  const [verPass, setVerPass] = useState(false)
  const [error, setError] = useState('')
  const [temblar, setTemblar] = useState(false)
  const saludo = saludoPorHora()

  function enviar(e) {
    e.preventDefault()
    const okUser = usuario.trim().toLowerCase() === AUTH.usuario.toLowerCase()
    const okPass = pass === AUTH.password
    if (okUser && okPass) {
      setError('')
      onEntrar()
    } else {
      setError('Usuario o contraseña incorrectos')
      setTemblar(true)
      setTimeout(() => setTemblar(false), 480)
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-5">
      <div className={`tarjeta filo-oro w-full max-w-md p-7 sm:p-9 aparecer ${temblar ? 'sacudir' : ''}`}>
        <div className="text-center mb-7">
          <div
            className="flotar-suave inline-grid place-items-center mb-4 rounded-2xl"
            style={{
              width: 56, height: 56,
              background: 'linear-gradient(135deg, var(--income-2), var(--gold))',
              color: '#04120d', fontFamily: 'var(--font-display)', fontSize: '1.9rem',
              fontStyle: 'italic', fontWeight: 700,
              boxShadow: '0 14px 30px -12px rgba(53,208,165,0.6)',
            }}
          >
            J
          </div>
          <p className="eyebrow">{saludo.texto} {saludo.emoji}</p>
          <h1 className="display mt-2" style={{ fontSize: '2.1rem' }}>
            Finanzas de <span className="texto-oro">Jazmín</span>
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: 'var(--text-soft)' }}>
            Tu debe y haber, en tiempo real
          </p>
        </div>

        <div
          className="mb-6 py-5 rounded-2xl"
          style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid var(--border)' }}
        >
          <LiveClock variante="grande" />
        </div>

        <form onSubmit={enviar} className="space-y-4">
          <div>
            <label className="etiqueta">Usuario</label>
            <input
              className="campo"
              placeholder="Tu nombre completo"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="etiqueta">Contraseña</label>
            <div className="relative">
              <input
                className="campo pr-12"
                type={verPass ? 'text' : 'password'}
                placeholder="••••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setVerPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg"
                aria-label="Mostrar contraseña"
              >
                {verPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-center text-sm font-semibold" style={{ color: 'var(--expense-2)' }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primario w-full mt-2">
            Entrar
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-mute)' }}>
          Hecho con dedicación · solo para vos
        </p>
      </div>
    </div>
  )
}
