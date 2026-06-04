import data from '../data/worldcup-data.json'

const PAIS_COLOR = { USA: '#002868', MEX: '#006847', CAN: '#FF0000' }
const PAIS_FLAG  = { USA: '🇺🇸', MEX: '🇲🇽', CAN: '🇨🇦' }

function StadiumCard({ estadio }) {
  const pColor = PAIS_COLOR[estadio.pais] || '#1B3A6B'

  return (
    <div
      className="relative bg-azul-medio rounded-xl overflow-hidden border border-azul-acento group cursor-pointer"
      style={{ transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s' }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(200,146,42,0.35)'
        e.currentTarget.style.borderColor = '#C8922A'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = '#1B3A6B'
      }}
    >
      {/* Map image via Google Static Maps fallback image area */}
      <div
        className="h-40 w-full bg-azul-acento relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${pColor}88, #0A1628)`,
        }}
      >
        {/* Decorative grid lines */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(#C8922A 1px, transparent 1px), linear-gradient(90deg, #C8922A 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Stadium icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-60 group-hover:scale-110 transition-transform duration-300">🏟️</span>
        </div>
        {/* Capacity bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: '#C8922A', width: `${(estadio.capacidad / 90000) * 100}%` }} />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-condensed font-bold text-blanco text-base leading-tight">{estadio.nombre}</h3>
          <span className="text-xl shrink-0">{PAIS_FLAG[estadio.pais]}</span>
        </div>
        <p className="text-gris text-xs mb-3">{estadio.ciudad}</p>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-oro">👥</span>
            <span className="font-condensed font-semibold text-blanco">
              {estadio.capacidad.toLocaleString('es-AR')}
            </span>
            <span className="text-gris">esp.</span>
          </div>
          <div
            className="ml-auto px-2 py-0.5 rounded font-condensed font-bold text-xs text-white"
            style={{ background: pColor }}
          >
            {estadio.pais}
          </div>
        </div>

        {/* Coords */}
        <p className="text-gris text-[10px] mt-2 font-mono">
          {estadio.lat.toFixed(4)}, {estadio.lng.toFixed(4)}
        </p>
      </div>
    </div>
  )
}

export default function EstadiosPage() {
  const estadios = [...data.estadios].sort((a, b) => b.capacidad - a.capacidad)

  const byPais = estadios.reduce((acc, e) => {
    if (!acc[e.pais]) acc[e.pais] = []
    acc[e.pais].push(e)
    return acc
  }, {})

  const totalCap = estadios.reduce((s, e) => s + e.capacidad, 0)

  return (
    <section>
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-condensed text-3xl sm:text-4xl text-oro tracking-wide mb-1">
          SEDES & ESTADIOS
        </h2>
        <p className="text-gris text-sm">
          {estadios.length} estadios · {totalCap.toLocaleString('es-AR')} espectadores combinados
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { flag: '🇺🇸', label: 'USA', count: byPais.USA?.length ?? 0, color: '#002868' },
          { flag: '🇲🇽', label: 'México', count: byPais.MEX?.length ?? 0, color: '#006847' },
          { flag: '🇨🇦', label: 'Canadá', count: byPais.CAN?.length ?? 0, color: '#FF0000' },
        ].map(({ flag, label, count, color }) => (
          <div key={label} className="bg-azul-medio rounded-lg p-4 text-center border border-azul-acento">
            <span className="text-3xl">{flag}</span>
            <p className="font-condensed text-blanco text-xl mt-1">{count}</p>
            <p className="font-condensed text-gris text-xs tracking-widest">{label.toUpperCase()}</p>
          </div>
        ))}
      </div>

      {/* Largest stadium highlight */}
      <div className="mb-8 bg-azul-medio rounded-xl border border-oro p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ boxShadow: '0 0 20px rgba(200,146,42,0.2)' }}>
        <span className="text-5xl">🏟️</span>
        <div className="flex-1">
          <p className="font-condensed text-gris text-xs tracking-widest mb-0.5">ESTADIO MÁS GRANDE</p>
          <h3 className="font-condensed text-oro text-2xl font-bold">{estadios[0].nombre}</h3>
          <p className="text-gris text-sm">{estadios[0].ciudad} · {PAIS_FLAG[estadios[0].pais]}</p>
        </div>
        <div className="text-right">
          <p className="font-condensed text-blanco text-3xl font-bold">{estadios[0].capacidad.toLocaleString('es-AR')}</p>
          <p className="font-condensed text-gris text-xs tracking-widest">ESPECTADORES</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {estadios.map(e => <StadiumCard key={e.id} estadio={e} />)}
      </div>

      {/* Capacity ranking */}
      <div className="mt-10">
        <h3 className="font-condensed text-xl text-oro tracking-wide mb-4">RANKING POR CAPACIDAD</h3>
        <div className="space-y-2">
          {estadios.map((e, i) => (
            <div key={e.id} className="flex items-center gap-3 bg-azul-medio rounded-lg px-4 py-2.5 hover:bg-azul-acento transition-colors duration-150 group">
              <span className="font-condensed text-gris text-sm w-6 text-right">{i + 1}</span>
              <span className="text-sm">{PAIS_FLAG[e.pais]}</span>
              <span className="font-condensed text-blanco text-sm flex-1">{e.nombre}</span>
              <span className="text-gris text-xs hidden sm:block">{e.ciudad}</span>
              {/* Bar */}
              <div className="hidden md:flex items-center gap-2 w-32">
                <div className="flex-1 bg-azul-acento rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(e.capacidad / estadios[0].capacidad) * 100}%`,
                      background: '#C8922A',
                    }}
                  />
                </div>
              </div>
              <span className="font-condensed font-bold text-sm text-oro">{e.capacidad.toLocaleString('es-AR')}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
