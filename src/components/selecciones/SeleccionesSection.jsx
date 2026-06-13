import { useState, useEffect, useMemo } from 'react'
import { useWC2026Teams, initAfPhotoCache } from '../../hooks/useSportsDB.js'
import { useWCSquads } from '../../hooks/useFootballData.js'
import TeamCard    from './TeamCard.jsx'
import PlayerModal from './PlayerModal.jsx'
import './SeleccionesSection.css'

const SKELETON_COUNT = 24

/* Normaliza para búsqueda sin acentos ni mayúsculas */
function normSearch(str = '') {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export default function SeleccionesSection() {
  const { teams, loading, error, fetchTeams } = useWC2026Teams()
  const { squadsMap, loading: squadsLoading }  = useWCSquads()
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [search, setSearch]             = useState('')

  /* Auto-fetch al montar — TheSportsDB es público, sin key */
  useEffect(() => { fetchTeams() }, [fetchTeams])

  /* Pre-cargar cache de fotos AF en background (48 requests, quota permitting) */
  useEffect(() => { initAfPhotoCache() }, [])

  /* Filtro bilingüe: nombre español + inglés + código FIFA */
  const filtered = useMemo(() => {
    if (!search.trim()) return teams
    const q = normSearch(search.trim())
    return teams.filter(({ team: t }) =>
      normSearch(t.name).includes(q)      ||
      normSearch(t._nameEN ?? '').includes(q) ||
      normSearch(t._codigo  ?? '').includes(q)
    )
  }, [teams, search])

  return (
    <section className="selecciones">

      {/* ── Encabezado ── */}
      <div className="selecciones__header">
        <p className="selecciones__eyebrow">FIFA WORLD CUP 2026™ · 48 SELECCIONES</p>
        <h2 className="selecciones__title">SELECCIONES</h2>
        <div className="selecciones__title-divider" />
        <p className="selecciones__subtitle">
          {teams.length > 0
            ? <><strong style={{ color: '#F5F0E8' }}>{teams.length} selecciones</strong> · Hacé click en un equipo para ver su plantilla</>
            : 'Cargando equipos del Mundial 2026…'}
        </p>
        {teams.length > 0 && (
          <div
            className="selecciones__demo-badge"
            style={{
              borderColor: 'rgba(200,146,42,0.35)',
              background:  'rgba(200,146,42,0.08)',
              color:       '#E5B857',
            }}
          >
            🏆 {teams.length} selecciones · Escudos vía TheSportsDB
          </div>
        )}
      </div>

      {/* ── Cargando ── */}
      {loading && (
        <>
          <div className="selecciones__loading">
            <div className="selecciones__spinner" />
            <p className="selecciones__spinner-text">Conectando con TheSportsDB…</p>
          </div>
          <div className="selecciones__skeletons">
            {Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <div key={i} className="selecciones__skeleton-card" />
            ))}
          </div>
        </>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div className="selecciones__error">
          <div className="selecciones__error-icon">🔌</div>
          <p className="selecciones__error-title">Error de conexión</p>
          <p className="selecciones__error-msg">{error}</p>
          <button className="selecciones__error-btn" onClick={() => fetchTeams()}>
            Reintentar
          </button>
        </div>
      )}

      {/* ── Grid de equipos ── */}
      {!loading && !error && teams.length > 0 && (
        <>
          {/* Barra búsqueda + contador */}
          <div className="selecciones__controls">
            <div className="selecciones__search-wrap">
              <span className="selecciones__search-icon">🔍</span>
              <input
                type="search"
                className="selecciones__search"
                placeholder="Buscar selección…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Buscar selección"
              />
            </div>
            <p className="selecciones__count">
              <strong>{filtered.length}</strong> equipo{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="selecciones__no-results">
              <div className="selecciones__no-results-icon">🔎</div>
              <p className="selecciones__no-results-text">Sin resultados para "{search}"</p>
              <p className="selecciones__no-results-sub">Probá con otro nombre de país</p>
            </div>
          ) : (
            <div className="selecciones__grid">
              {filtered.map((team, i) => (
                <TeamCard
                  key={team.team.id}
                  team={team}
                  index={i}
                  onClick={setSelectedTeam}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Modal de plantilla ── */}
      {selectedTeam && (
        <PlayerModal
          team={selectedTeam}
          squad={squadsMap[selectedTeam?.team?._codigo]}
          squadsLoading={squadsLoading}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </section>
  )
}
