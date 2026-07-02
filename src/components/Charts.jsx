import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { plata, plataCompacta } from '../lib/format'
import { nombreMes } from '../lib/time'

const COLORES = ['#35d0a5', '#ff7a66', '#e4b95b', '#6ee7c7', '#ff9e8f', '#f2d38a', '#4fd1c5', '#f6a08e']

export default function Charts({ movimientos }) {
  const porCategoria = {}
  movimientos
    .filter((m) => m.tipo === 'gasto')
    .forEach((m) => {
      porCategoria[m.categoriaLabel] = (porCategoria[m.categoriaLabel] || 0) + Number(m.monto)
    })
  const dataPie = Object.entries(porCategoria)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const porMes = {}
  movimientos.forEach((m) => {
    const k = nombreMes(m.fecha)
    if (!porMes[k]) porMes[k] = { mes: k, ingreso: 0, gasto: 0, orden: new Date(m.fecha).getTime() }
    porMes[k][m.tipo] += Number(m.monto)
  })
  const dataBar = Object.values(porMes).sort((a, b) => a.orden - b.orden).slice(-6)

  const hayGastos = dataPie.length > 0
  const hayMeses = dataBar.length > 0

  return (
    <div className="grid lg:grid-cols-2 gap-4 sm:gap-5">
      {/* Donut de gastos */}
      <div className="tarjeta filo-oro p-5 sm:p-6 aparecer">
        <p className="eyebrow">Distribución</p>
        <h3 className="display mb-4" style={{ fontSize: '1.25rem' }}>¿En qué se van tus gastos?</h3>
        {hayGastos ? (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={dataPie} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  paddingAngle={2} stroke="none" isAnimationActive={false}
                >
                  {dataPie.map((_, i) => (
                    <Cell key={i} fill={COLORES[i % COLORES.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => plata(v)} contentStyle={tooltipStyle} itemStyle={{ color: 'var(--text)' }} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="flex-1 w-full space-y-2">
              {dataPie.slice(0, 6).map((d, i) => (
                <li key={d.name} className="flex items-center justify-between text-sm gap-2">
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORES[i % COLORES.length] }} />
                    <span className="truncate" style={{ color: 'var(--text-soft)' }}>{d.name}</span>
                  </span>
                  <span className="numeros font-semibold whitespace-nowrap" style={{ color: 'var(--text)' }}>{plata(d.value)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <VacioChart texto="Sin gastos para mostrar todavía" />
        )}
      </div>

      {/* Barras por mes */}
      <div className="tarjeta filo-oro p-5 sm:p-6 aparecer">
        <p className="eyebrow">Mes a mes</p>
        <h3 className="display mb-4" style={{ fontSize: '1.25rem' }}>Haber vs. Debe</h3>
        {hayMeses ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dataBar} barGap={4}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: 'var(--text-soft)' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => plataCompacta(v)} tick={{ fontSize: 11, fill: 'var(--text-mute)' }} axisLine={false} tickLine={false} width={52} />
              <Tooltip formatter={(v) => plata(v)} cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={tooltipStyle} itemStyle={{ color: 'var(--text)' }} />
              <Bar dataKey="ingreso" name="Haber" fill="var(--income)" radius={[6, 6, 0, 0]} isAnimationActive={false} />
              <Bar dataKey="gasto" name="Debe" fill="var(--expense)" radius={[6, 6, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <VacioChart texto="Cargá movimientos para ver la evolución" />
        )}
      </div>
    </div>
  )
}

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid var(--border-hi)',
  background: 'rgba(15,17,22,0.96)',
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  color: 'var(--text)',
  boxShadow: 'var(--shadow-md)',
}

function VacioChart({ texto }) {
  return (
    <div className="grid place-items-center" style={{ height: 180 }}>
      <p className="italic text-center" style={{ color: 'var(--text-soft)' }}>{texto}</p>
    </div>
  )
}
