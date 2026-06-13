import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import data from '../data/worldcup-data.json'
import { FlagImg } from '../utils/flagUtils.jsx'
import './EstadiosPage.css'

/* ── Rich metadata (PDF + knowledge) ────────────────────────── */
const STADIUM_META = {
  azteca: {
    inauguration: '1966',
    shortDesc: 'El Coloso de Santa Úrsula. 3 inauguraciones mundialistas: 1970, 1986 y 2026.',
    fullDesc: 'El legendario "Coloso de Santa Úrsula" se convertirá en el único estadio del planeta en albergar partidos inaugurales de tres Copas del Mundo (1970, 1986 y 2026). Para cumplir con las exigencias modernas, está siendo sometido a la remodelación más profunda de su historia: pantallas LED de última generación, paneles solares, nuevo césped híbrido y un rediseño integral de tribunas y zonas VIP. Es la cancha donde Pelé y Maradona se consagraron campeones del mundo.',
    badge: '⭐ PARTIDO INAUGURAL',
    badgeColor: '#C8922A',
  },
  metlife: {
    inauguration: '2010',
    shortDesc: 'La casa de la Gran Final. El destino de los campeones del mundo 2026.',
    fullDesc: 'Elegido por la FIFA para albergar la Gran Final del Mundial 2026, el MetLife Stadium es un coloso a cielo abierto en East Rutherford, Nueva Jersey. Su diseño exterior combina lamas de aluminio con iluminación dinámica que le permite cambiar de color en cada evento. Hogar de los Giants y los Jets de la NFL, ha sido adaptado en múltiples ocasiones para el fútbol internacional y es el escenario definitivo donde se conocerá al nuevo campeón del mundo.',
    badge: '🏆 GRAN FINAL',
    badgeColor: '#C8922A',
  },
  att: {
    inauguration: '2009',
    shortDesc: '"Jerry World": techo retráctil y la mayor pantalla suspendida del planeta.',
    fullDesc: 'Conocido extraoficialmente como "Jerry World", este recinto en Arlington es una obra maestra del diseño deportivo y albergará una de las semifinales del torneo. Su gigantesco techo retráctil y sus puertas de cristal de 36 metros en las zonas de anotación son dos de sus íconos visuales. Además, cuenta con una de las pantallas de video HD suspendidas más grandes del mundo, garantizando que ningún espectador pierda un solo detalle de la acción.',
    badge: '⚡ SEMIFINAL',
    badgeColor: '#D10A11',
  },
  sofi: {
    inauguration: '2020',
    shortDesc: 'USD 5.000 millones de inversión. El estadio más caro jamás construido.',
    fullDesc: 'Inaugurado en 2020 con un costo estimado de 5.000 millones de dólares, el SoFi Stadium es el estadio más caro de la historia. Su techo translúcido de ETFE protege tanto el campo como una plaza peatonal adyacente, creando un ambiente interior-exterior único en el mundo. La "Infinity Screen", su pantalla ovalada de doble cara, revolucionó la forma en que se consume el entretenimiento en vivo.',
    badge: null,
  },
  mercedes: {
    inauguration: '2017',
    shortDesc: 'El techo-diafragma que imita el obturador de una cámara fotográfica.',
    fullDesc: 'Mundialmente famoso por su techo retráctil estilo rehilete, compuesto por ocho paneles triangulares translúcidos que se abren y cierran imitando el diafragma de una cámara fotográfica. Justo bajo la apertura, una pantalla LED circular de 360 grados envuelve al espectador. Es además uno de los estadios más sustentables de Norteamérica, diseñado para recolectar y reutilizar agua de lluvia.',
    badge: null,
  },
  arrowhead: {
    inauguration: '1972',
    shortDesc: 'Récord Guinness: el estadio al aire libre más ruidoso del mundo.',
    fullDesc: 'Hogar de los Kansas City Chiefs, es uno de los estadios más temidos por los equipos visitantes gracias a su diseño en forma de tazón cerrado que atrapa el sonido. Posee el récord Guinness como el estadio al aire libre más ruidoso del mundo. Para el Mundial 2026, aportará una atmósfera ensordecedora y tradicional, marcando un fuerte contraste con las nuevas sedes ultra-tecnológicas del torneo.',
    badge: '🔊 RÉC. GUINNESS',
    badgeColor: '#7B2FBE',
  },
  nrg: {
    inauguration: '2002',
    shortDesc: 'Pionero: el primer estadio de la NFL con techo retráctil. Houston imparable.',
    fullDesc: 'Cuando se inauguró en 2002, hizo historia al ser el primer estadio de la NFL con un techo retráctil. Su diseño permite que la inmensa estructura del techo se abra o cierre en minutos, adaptándose al impredecible y caluroso clima de Texas. Para el Mundial 2026, garantizará condiciones climáticas perfectas tanto para los jugadores como para los más de 72.000 aficionados en las gradas.',
    badge: null,
  },
  lincoln: {
    inauguration: '2003',
    shortDesc: '"The Linc": energía solar, turbinas eólicas y visión perfecta desde cada asiento.',
    fullDesc: 'Conocido por los locales como "The Linc", fue diseñado con un enfoque principal en maximizar la línea de visión de cada asiento. Más allá de su excelente ergonomía, el estadio ha invertido fuertemente en energía renovable: cuenta con miles de paneles solares y turbinas eólicas en su estructura, convirtiéndolo en el recinto ecológico líder de la costa este de Estados Unidos.',
    badge: null,
  },
  lumen: {
    inauguration: '2002',
    shortDesc: 'El corazón del fútbol norteamericano. Atmósfera europea en el Pacífico.',
    fullDesc: 'La arquitectura en forma de herradura del Lumen Field, junto con sus techos voladizos parciales, fue diseñada para amplificar el sonido de los fanáticos y protegerlos de la lluvia constante del noroeste del Pacífico. Es el corazón del fútbol en Estados Unidos, con una cultura de hinchada que se asemeja al ambiente que se vive en los estadios europeos o sudamericanos.',
    badge: null,
  },
  levis: {
    inauguration: '2014',
    shortDesc: 'Silicon Valley meets el fútbol. Tecnología de punta y energía 100% solar.',
    fullDesc: 'Ubicado en pleno Silicon Valley, es considerado uno de los estadios más avanzados tecnológicamente del mundo, con una conectividad Wi-Fi sin precedentes para sus asistentes. Tiene un techo verde con especies de plantas nativas de California y una granja solar integrada que genera suficiente energía para alimentar todos los partidos del torneo.',
    badge: null,
  },
  gillette: {
    inauguration: '2002',
    shortDesc: 'El faro de 66 metros con plataforma de observación 360° para el Mundial.',
    fullDesc: 'A solo 45 minutos del centro de Boston, en Foxborough, este recinto se caracteriza por su arquitectura de acero expuesto y sus amplios pasillos. Para el Mundial 2026, los visitantes podrán disfrutar de la renovación más reciente del estadio, que incluye el icónico faro de 66 metros de altura en la cabecera norte, equipado con una plataforma de observación de 360 grados abierta al público.',
    badge: null,
  },
  hardrock: {
    inauguration: '1987',
    shortDesc: 'La marquesina monumental que protege al 90% del público del sol de Miami.',
    fullDesc: 'Originalmente inaugurado en 1987, el Hard Rock Stadium ha sido sometido a transformaciones radicales. La más notable: la instalación de una inmensa marquesina estructural que ahora protege a más del 90% de los espectadores de las lluvias tropicales y el intenso sol de Florida, sin perder la sensación de estar al aire libre. Es un recinto con enorme experiencia en recibir eventos de escala global.',
    badge: null,
  },
  bcplace: {
    inauguration: '1983',
    shortDesc: 'Uno de los techos retráctiles por cable más grandes del planeta.',
    fullDesc: 'Ubicado en el corazón del centro de Vancouver, este recinto está coronado por uno de los techos retráctiles sostenidos por cables más grandes del planeta. Para el Mundial 2026 recibió una inversión multimillonaria: actualizó sus zonas VIP, incorporó mejoras de accesibilidad y reemplazó su superficie sintética por un campo de césped híbrido que cumple con los estándares obligatorios de la FIFA.',
    badge: null,
  },
  bbva: {
    inauguration: '2015',
    shortDesc: 'El "Gigante de Acero" con vista ininterrumpida al Cerro de la Silla.',
    fullDesc: 'Galardonado internacionalmente por su diseño arquitectónico, el "Gigante de Acero" tiene una característica inigualable: sus gradas cuentan con un recorte que abre una vista espectacular e ininterrumpida hacia el Cerro de la Silla, símbolo natural de Monterrey. Es un estadio moderno y compacto, con graderías muy cercanas al campo, garantizando una presión constante sobre los equipos rivales.',
    badge: null,
  },
  akron: {
    inauguration: '2010',
    shortDesc: 'Arquitectura volcánica: base de pasto vivo y techo de nube de cenizas.',
    fullDesc: 'Desde el exterior, el Estadio Akron en Jalisco simula la forma de un volcán a punto de hacer erupción. Su base está recubierta de pasto natural que se funde con el paisaje circundante, mientras que la cubierta del techo imita una nube de cenizas flotante. Cuenta además con un sistema de captación de agua pluvial que la filtra y reutiliza para el mantenimiento de sus propias instalaciones.',
    badge: null,
  },
  bmo: {
    inauguration: '2007',
    shortDesc: 'Vista al Lago Ontario. La mayor expansión temporal del torneo: +17.000 butacas.',
    fullDesc: 'Originalmente diseñado para la MLS, el BMO Field enfrentará la transformación temporal más drástica del torneo. Para cumplir con los requisitos de la FIFA, incorporará estructuras adicionales en sus cabeceras norte y sur que sumarán más de 17.000 localidades, elevando su capacidad a casi 46.000 asientos. Su ubicación a orillas del Lago Ontario le da un marco visual único e inigualable.',
    badge: null,
  },
}

const PAIS_LABEL = { USA: 'Estados Unidos', MEX: 'México', CAN: 'Canadá' }
const PAIS_COLOR = { USA: '#002868', MEX: '#006847', CAN: '#D80000' }

const FILTERS = [
  { id: 'Todos', label: 'Todos · 16',  flag: null  },
  { id: 'USA',   label: 'USA · 11',    flag: 'USA' },
  { id: 'MEX',   label: 'México · 3',  flag: 'MEX' },
  { id: 'CAN',   label: 'Canadá · 2',  flag: 'CAN' },
]

const MAX_CAPACITY = 87523

/* ── Stadium Card ────────────────────────────────────────────── */
function StadiumCard({ estadio, meta, index, onClick }) {
  const bgImage = estadio.imagen
    ? `linear-gradient(180deg, rgba(10,22,40,0.25) 0%, rgba(10,22,40,0.88) 100%), url(${estadio.imagen})`
    : `linear-gradient(135deg, ${PAIS_COLOR[estadio.pais]}99, #0A1628)`

  return (
    <article
      className="stadium-card"
      style={{ animationDelay: `${Math.min(index * 0.055, 0.72)}s` }}
      onClick={() => onClick(estadio)}
      onKeyDown={e => e.key === 'Enter' && onClick(estadio)}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${estadio.nombre}`}
    >
      <div className="stadium-card__image" style={{ backgroundImage: bgImage }}>
        {meta?.badge && (
          <span className="stadium-card__badge" style={{ background: meta.badgeColor }}>
            {meta.badge}
          </span>
        )}
        <div className="stadium-card__hover-overlay">
          <span className="stadium-card__cta">Explorar Sede →</span>
        </div>
      </div>

      <div className="stadium-card__body">
        <div className="stadium-card__header">
          <h3 className="stadium-card__name">{estadio.nombre}</h3>
          <FlagImg code={estadio.pais} alt={PAIS_LABEL[estadio.pais]} size={28} className="stadium-card__flag" />
        </div>
        <p className="stadium-card__city">{estadio.ciudad}</p>
        <p className="stadium-card__short-desc">{meta?.shortDesc}</p>

        <div className="stadium-card__stats">
          <div className="stadium-card__stat">
            <span className="stadium-card__stat-value">{estadio.capacidad.toLocaleString('es-AR')}</span>
            <span className="stadium-card__stat-label">espectadores</span>
          </div>
          <div className="stadium-card__stat">
            <span className="stadium-card__stat-value">{meta?.inauguration ?? '—'}</span>
            <span className="stadium-card__stat-label">inauguración</span>
          </div>
        </div>

        <div className="stadium-card__bar-track">
          <div
            className="stadium-card__bar-fill"
            style={{ width: `${(estadio.capacidad / MAX_CAPACITY) * 100}%` }}
          />
        </div>
      </div>
    </article>
  )
}

/* ── Stadium Modal ───────────────────────────────────────────── */
function StadiumModal({ estadio, meta, onClose }) {
  const [closing, setClosing] = useState(false)

  const handleClose = useCallback(() => setClosing(true), [])

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleClose])

  function handleAnimationEnd(e) {
    if (closing && e.target === e.currentTarget) onClose()
  }

  const heroImage = estadio.imagen
    ? `linear-gradient(180deg, rgba(10,22,40,0.15) 0%, rgba(10,22,40,0.92) 100%), url(${estadio.imagen})`
    : `linear-gradient(135deg, ${PAIS_COLOR[estadio.pais]}88, #0A1628)`

  return (
    <div
      className={`stadium-modal__backdrop${closing ? ' stadium-modal__backdrop--closing' : ''}`}
      onClick={e => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div
        className={`stadium-modal__panel${closing ? ' stadium-modal__panel--closing' : ''}`}
        onAnimationEnd={handleAnimationEnd}
        role="dialog"
        aria-modal="true"
        aria-label={estadio.nombre}
      >
        {/* Hero */}
        <div className="stadium-modal__hero" style={{ backgroundImage: heroImage }}>
          {meta?.badge && (
            <span className="stadium-modal__hero-badge" style={{ background: meta.badgeColor }}>
              {meta.badge}
            </span>
          )}
          <button className="stadium-modal__close" onClick={handleClose} aria-label="Cerrar">✕</button>
        </div>

        {/* Body */}
        <div className="stadium-modal__body">
          <div className="stadium-modal__title-row" style={{ animationDelay: '0.04s' }}>
            <h2 className="stadium-modal__name">{estadio.nombre}</h2>
            <FlagImg code={estadio.pais} alt={PAIS_LABEL[estadio.pais]} size={32} />
          </div>

          <p className="stadium-modal__location" style={{ animationDelay: '0.1s' }}>
            📍 {estadio.ciudad} · {PAIS_LABEL[estadio.pais]}
          </p>

          <div className="stadium-modal__stats-row" style={{ animationDelay: '0.16s' }}>
            <div className="stadium-modal__stat-pill">
              <span className="stadium-modal__stat-icon">👥</span>
              <div>
                <span className="stadium-modal__stat-value">{estadio.capacidad.toLocaleString('es-AR')}</span>
                <span className="stadium-modal__stat-key">Espectadores</span>
              </div>
            </div>
            <div className="stadium-modal__stat-pill">
              <span className="stadium-modal__stat-icon">📅</span>
              <div>
                <span className="stadium-modal__stat-value">{meta?.inauguration ?? '—'}</span>
                <span className="stadium-modal__stat-key">Inauguración</span>
              </div>
            </div>
            <div className="stadium-modal__stat-pill">
              <FlagImg code={estadio.pais} alt={PAIS_LABEL[estadio.pais]} size={26} />
              <div>
                <span className="stadium-modal__stat-value">{estadio.pais}</span>
                <span className="stadium-modal__stat-key">{PAIS_LABEL[estadio.pais]}</span>
              </div>
            </div>
          </div>

          <div className="stadium-modal__divider" style={{ animationDelay: '0.22s' }} />

          <p className="stadium-modal__desc" style={{ animationDelay: '0.28s' }}>
            {meta?.fullDesc ?? 'Información del estadio próximamente.'}
          </p>

          <p className="stadium-modal__coords" style={{ animationDelay: '0.34s' }}>
            🌐 {estadio.lat.toFixed(4)}°, {estadio.lng.toFixed(4)}°
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ───────────────────────────────────────────────── */
export default function EstadiosPage() {
  const [filter,   setFilter]   = useState('Todos')
  const [selected, setSelected] = useState(null)

  const estadios = [...data.estadios].sort((a, b) => b.capacidad - a.capacidad)
  const filtered  = filter === 'Todos' ? estadios : estadios.filter(e => e.pais === filter)
  const totalCap  = estadios.reduce((s, e) => s + e.capacidad, 0)

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selected])

  return (
    <section className="estadios-page">

      {/* ── Hero Header ── */}
      <header className="estadios-header">
        <p className="estadios-header__eyebrow">FIFA WORLD CUP 2026™ · 16 ESTADIOS · 3 NACIONES · 1 SUEÑO</p>
        <h2 className="estadios-header__title">El Escenario Está Listo</h2>
        <div className="estadios-header__divider" />
        <p className="estadios-header__subtitle">Explora los <strong style={{ color: '#F5F0E8' }}>Templos del Fútbol</strong> de Norteamérica</p>

        <div className="estadios-header__stats">
          <div className="estadios-header__stat">
            <span className="estadios-header__stat-n">11</span>
            <span className="estadios-header__stat-l" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <FlagImg code="USA" alt="USA" size={22} /> USA
            </span>
          </div>
          <div className="estadios-header__sep" />
          <div className="estadios-header__stat">
            <span className="estadios-header__stat-n">3</span>
            <span className="estadios-header__stat-l" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <FlagImg code="MEX" alt="México" size={22} /> México
            </span>
          </div>
          <div className="estadios-header__sep" />
          <div className="estadios-header__stat">
            <span className="estadios-header__stat-n">2</span>
            <span className="estadios-header__stat-l" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <FlagImg code="CAN" alt="Canadá" size={22} /> Canadá
            </span>
          </div>
          <div className="estadios-header__sep" />
          <div className="estadios-header__stat">
            <span className="estadios-header__stat-n">{Math.round(totalCap / 1000)}K</span>
            <span className="estadios-header__stat-l">cap. total</span>
          </div>
        </div>
      </header>

      {/* ── Filters ── */}
      <div className="estadios-filters">
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={`estadios-filter-btn${filter === f.id ? ' estadios-filter-btn--active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.flag && <FlagImg code={f.flag} alt={f.label} size={18} />}
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Cards Grid ── */}
      <div className="estadios-grid">
        {filtered.map((e, i) => (
          <StadiumCard
            key={e.id}
            estadio={e}
            meta={STADIUM_META[e.id]}
            index={i}
            onClick={setSelected}
          />
        ))}
      </div>

      {/* ── Detail Modal (portal → document.body para evitar transforms de ancestros) ── */}
      {selected && createPortal(
        <StadiumModal
          estadio={selected}
          meta={STADIUM_META[selected.id]}
          onClose={() => setSelected(null)}
        />,
        document.body
      )}
    </section>
  )
}
