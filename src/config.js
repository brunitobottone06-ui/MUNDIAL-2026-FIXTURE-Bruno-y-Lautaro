/* ══════════════════════════════════════════════════════════════
   CONFIGURACIÓN GLOBAL — FIFA World Cup 2026™ App
   ══════════════════════════════════════════════════════════════

   ┌─────────────────────────────────────────────────────────┐
   │  🚀 EL DÍA DEL MUNDIAL (11 jun 2026):                  │
   │                                                          │
   │  1. Cambiá LIVE_MODE de  false  →  true                 │
   │  2. Guardá el archivo                                    │
   │  3. La app empieza a mostrar resultados en vivo ✅       │
   └─────────────────────────────────────────────────────────┘
══════════════════════════════════════════════════════════════ */

/**
 * LIVE_MODE = false  →  Usa worldcup-data.json (datos estáticos)
 * LIVE_MODE = true   →  Usa API-Football v3 en tiempo real
 *
 * ⚠️  Requiere VITE_API_KEY configurada en .env.local
 *      y que el plan de API-Football permita season=2026
 */
export const LIVE_MODE = true

/* Intervalo de polling durante partidos en vivo (ms) */
export const POLL_INTERVAL_LIVE    = 30_000   // 30 seg — 1 request por partido activo
export const POLL_INTERVAL_STANDBY = 120_000  // 2 min  — cuando no hay partidos en curso

/* Liga FIFA World Cup en API-Football */
export const WC_LEAGUE  = 1
export const WC_SEASON  = 2026
