import { useEffect, useMemo, useState } from 'react'
import Login from './components/Login'
import LiveClock from './components/LiveClock'
import ProfileCard from './components/ProfileCard'
import BalanceSummary from './components/BalanceSummary'
import AddTransaction from './components/AddTransaction'
import Ledger from './components/Ledger'
import Charts from './components/Charts'
import InstallButton from './components/InstallButton'
import {
  listarMovimientos, agregarMovimiento, borrarMovimiento,
  leerPerfil, estaEnLaNube,
} from './lib/api'
import { leerCategorias } from './lib/categories'
import { saludoPorHora } from './lib/time'

export default function App() {
  const [logueada, setLogueada] = useState(
    () => sessionStorage.getItem('jaz_auth') === '1',
  )
  const [perfil, setPerfil] = useState(leerPerfil)
  const [categorias, setCategorias] = useState(leerCategorias)
  const [movimientos, setMovimientos] = useState([])
  const [cargando, setCargando] = useState(true)
  const saludo = saludoPorHora()

  useEffect(() => {
    if (!logueada) return
    let vivo = true
    listarMovimientos().then((data) => {
      if (vivo) {
        setMovimientos(data)
        setCargando(false)
      }
    })
    return () => { vivo = false }
  }, [logueada])

  function entrar() {
    sessionStorage.setItem('jaz_auth', '1')
    setLogueada(true)
  }
  function salir() {
    sessionStorage.removeItem('jaz_auth')
    setLogueada(false)
  }

  async function agregar(mov) {
    const nuevo = await agregarMovimiento(mov)
    setMovimientos((prev) => [nuevo, ...prev])
  }
  async function borrar(id) {
    setMovimientos((prev) => prev.filter((m) => m.id !== id))
    await borrarMovimiento(id)
  }

  const { ingresos, gastos } = useMemo(() => {
    let ing = 0, gas = 0
    for (const m of movimientos) {
      if (m.tipo === 'ingreso') ing += Number(m.monto)
      else gas += Number(m.monto)
    }
    return { ingresos: ing, gastos: gas }
  }, [movimientos])

  if (!logueada) {
    return (
      <>
        <Fondo />
        <Login onEntrar={entrar} />
      </>
    )
  }

  return (
    <>
      <Fondo />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-9" style={{ paddingTop: 'max(1.25rem, env(safe-area-inset-top))' }}>
        {/* Encabezado */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-7">
          <div className="aparecer min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="eyebrow">{saludo.texto}, {perfil.nombre} {saludo.emoji}</p>
              <InstallButton />
            </div>
            <h1 className="display mt-1.5" style={{ fontSize: 'clamp(1.9rem, 6vw, 3rem)' }}>
              Tu <span className="texto-oro">debe &amp; haber</span>
            </h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap text-sm" style={{ color: 'var(--text-soft)' }}>
              <span className="italic">Cada movimiento, en tiempo real.</span>
              <span className="numeros"><LiveClock variante="chico" /></span>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{
                  background: estaEnLaNube() ? 'var(--income-dim)' : 'rgba(228,185,91,0.14)',
                  color: estaEnLaNube() ? 'var(--income-2)' : 'var(--gold-2)',
                }}
              >
                {estaEnLaNube() ? '☁️ en Sheets' : '💾 en este dispositivo'}
              </span>
            </div>
          </div>

          {/* Reloj grande: solo en pantallas medianas+ para no duplicar en mobile */}
          <div className="tarjeta px-6 py-4 shrink-0 hidden md:block">
            <LiveClock variante="grande" />
          </div>
        </header>

        {/* Grilla principal */}
        <div className="grid lg:grid-cols-[340px_1fr] gap-4 sm:gap-5 items-start">
          <aside className="space-y-4 sm:space-y-5 lg:sticky lg:top-6">
            <ProfileCard perfil={perfil} setPerfil={setPerfil} onSalir={salir} />
            <AddTransaction onAgregar={agregar} categorias={categorias} setCategorias={setCategorias} />
          </aside>

          <main className="space-y-4 sm:space-y-5">
            <BalanceSummary ingresos={ingresos} gastos={gastos} />
            <Charts movimientos={movimientos} />
            <Ledger movimientos={movimientos} onBorrar={borrar} cargando={cargando} />
          </main>
        </div>

        <footer className="text-center mt-9 pb-6">
          <p className="italic text-sm" style={{ color: 'var(--text-soft)' }}>{perfil.frase}</p>
          <p className="text-xs mt-2" style={{ color: 'var(--text-mute)' }}>
            Finanzas de {perfil.nombre} · hecho con dedicación
          </p>
        </footer>
      </div>
    </>
  )
}

function Fondo() {
  return (
    <>
      <div className="fondo-aurora" />
      <div className="grano" />
    </>
  )
}
