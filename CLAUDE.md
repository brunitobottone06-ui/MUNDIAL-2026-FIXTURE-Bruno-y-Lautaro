# FIFA World Cup 2026™ — App Fixture

## Stack
- **React 18** + **Vite 5** + **Tailwind CSS 3**
- Sin TypeScript (JS puro con JSX)
- Sin router externo — navegación por estado local en `App.jsx`

## Comandos
```bash
npm install        # primera vez
npm run dev        # servidor local → http://localhost:5173
npm run build      # producción en dist/
npm run preview    # preview del build
npm run lint       # ESLint
```

## Colores (tokens Tailwind)
| Token            | Hex       | Uso                        |
|------------------|-----------|----------------------------|
| `azul-noche`     | #0A1628   | Background principal       |
| `azul-medio`     | #152238   | Cards, headers             |
| `azul-acento`    | #1B3A6B   | Hover, borders             |
| `rojo`           | #D10A11   | CTAs, goles, live badge    |
| `oro`            | #C8922A   | Títulos, bordes premium    |
| `blanco`         | #F5F0E8   | Texto principal            |
| `verde-gol`      | #00B341   | Goles, clasificados        |
| `gris`           | #8A8A8A   | Texto secundario           |

## Tipografía
- **Headings / labels**: `font-condensed` → Barlow Condensed 600/700
- **Cuerpo**: `font-barlow` → Barlow 400/500

## Estructura de carpetas
```
src/
  components/
    fixture/      ← MatchCard, ScoreBoard, MatchTimeline
    grupos/       ← GrupoTable, StandingsRow
    ui/           ← Badge, Button, Modal, Skeleton
    layout/       ← Header, Footer, NavTab
  hooks/          ← useLiveMatch, useCountdown, useFixture
  data/
    worldcup-data.json   ← fuente estática única
  pages/
    FixturePage.jsx
    GruposPage.jsx
  styles/
    index.css     ← tokens CSS + clases Tailwind custom
```

## Datos — worldcup-data.json
Estructura escalable para todas las fases:
- `torneo` — metadatos del torneo
- `estadios[]` — los 16 estadios con lat/lng
- `selecciones{}` — las 48 selecciones indexadas por código FIFA
- `grupos{}` — A-L con array de códigos
- `partidos[]` — fase de grupos completa (24 jornada 1 + restantes)
- `eliminatorias{}` — arrays vacíos listos para popular (dieciseisavos → final)
- `llaves_eliminacion{}` — metadatos de estructura eliminatoria

Cada partido tiene: `id, fase, grupo, jornada, local, visitante, goles_local, goles_visitante, estado, fecha, hora_arg, estadio_id, eventos[]`

Estados de partido: `"programado"` | `"en_vivo"` | `"finalizado"`

## Reglas de estilo
- No comentarios salvo WHY no obvio
- No TypeScript — JS puro
- Tailwind utility-first, clases custom en `index.css` solo para animaciones
- Responsive mobile-first: `sm:` 640px · `md:` 768px · `lg:` 1024px · `xl:` 1280px
- Max-width del site: `max-w-site` (1600px)

## Prerequisito
Node.js debe estar instalado. Descargá desde https://nodejs.org (versión LTS recomendada).
