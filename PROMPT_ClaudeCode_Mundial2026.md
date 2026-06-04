# 🏆 CLAUDE CODE — PROMPT MAESTRO
## FIFA World Cup 2026 · Fixture App · Producción

---

## ⚡ INSTRUCCIÓN PRINCIPAL

Eres un senior full-stack engineer especializado en aplicaciones deportivas de alto tráfico. Tu misión es construir la **aplicación web oficial del Fixture del Mundial 2026** desde cero, production-ready, con todos los detalles del sistema de diseño especificados en `Mundial2026_DesignBrief.md` (disponible en el proyecto).

**Empieza a codear ahora. No preguntes, no planifiques en texto — ejecuta.**

El documento de referencia completo con todos los requisitos, colores, tipografía, fixture, APIs y especificaciones técnicas está en `Mundial2026_DesignBrief.md`. Léelo antes de escribir la primera línea de código.

---

## 🎯 OBJETIVO DEL PROYECTO

Construir una **Next.js 15 App** que muestre:
1. **Hero con Countdown** al pitazo inicial (11 Jun 2026 · 16:00 ARG)
2. **Fixture completo** de los 48 equipos — Fase de Grupos + Eliminatorias
3. **Scoreboard en tiempo real** con animaciones de gol
4. **Perfiles de jugadores** con foto (API TheSportsDB) y estadísticas
5. **Escudos de los 48 equipos** con efectos hover
6. **Estadios** — capacidad, imágenes y mapa interactivo
7. **Animaciones futboleras** — confetti, flip cards, parallax

---

## 🛠️ STACK EXACTO — NO CAMBIAR

```bash
# Inicializar el proyecto
npx create-next-app@latest mundial-2026 \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd mundial-2026

# Dependencias de producción
npm install \
  gsap \
  framer-motion \
  lottie-react \
  socket.io-client \
  @supabase/supabase-js \
  mapbox-gl \
  react-map-gl \
  recharts \
  d3 \
  date-fns \
  clsx \
  tailwind-merge \
  lucide-react \
  @radix-ui/react-dialog \
  @radix-ui/react-tabs \
  @radix-ui/react-tooltip \
  next-intl \
  zustand \
  react-query

# Dev dependencies
npm install -D \
  @types/mapbox-gl \
  @types/d3
```

---

## 🎨 DESIGN SYSTEM — IMPLEMENTAR EXACTAMENTE ESTO

### Archivo: `src/styles/globals.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500;700&display=swap');

/* ── Fuente de display: Bebas Neue (importar via @font-face o CDN) ── */
@import url('https://fonts.cdnfonts.com/css/bebas-neue');

:root {
  /* Colores primarios */
  --rojo:         #D10A11;
  --oro:          #C8922A;
  --oro-claro:    #E5B857;
  --azul-noche:   #0A1628;
  --azul-medio:   #152238;

  /* Colores secundarios */
  --azul-acento:  #1B3A6B;
  --blanco:       #F5F0E8;
  --verde-gol:    #00B341;
  --gris:         #8A8A8A;
  --gris-claro:   #B0BEC5;

  /* Tipografía */
  --font-display: 'Bebas Neue', Impact, sans-serif;
  --font-heading: 'Barlow Condensed', Arial Narrow, sans-serif;
  --font-body:    'Barlow', system-ui, sans-serif;

  /* Espaciado */
  --max-width:    1600px;
  --section-px:   clamp(1rem, 4vw, 4rem);

  /* Sombras */
  --shadow-oro:   0 0 20px rgba(200, 146, 42, 0.4);
  --shadow-rojo:  0 0 20px rgba(209, 10, 17, 0.4);
  --shadow-card:  0 8px 32px rgba(0, 0, 0, 0.4);

  /* Transiciones */
  --transition-fast:   150ms ease;
  --transition-base:   300ms ease;
  --transition-spring: 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background-color: var(--azul-noche);
  color: var(--blanco);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.5;
  overflow-x: hidden;
}

/* Scrollbar custom */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--azul-medio); }
::-webkit-scrollbar-thumb { background: var(--oro); border-radius: 3px; }
```

### Archivo: `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        rojo:        '#D10A11',
        oro:         '#C8922A',
        'oro-claro': '#E5B857',
        noche:       '#0A1628',
        medio:       '#152238',
        acento:      '#1B3A6B',
        blanco:      '#F5F0E8',
        gol:         '#00B341',
        gris:        '#8A8A8A',
      },
      fontFamily: {
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        heading: ['Barlow Condensed', 'Arial Narrow', 'sans-serif'],
        body:    ['Barlow', 'system-ui', 'sans-serif'],
      },
      maxWidth: { site: '1600px' },
      animation: {
        shimmer:    'shimmer 2s infinite',
        'flip-in':  'flipIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        pulse-gol:  'pulseGol 0.6s ease-out',
        'fade-up':  'fadeUp 0.5s ease forwards',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '200%' },
          '100%': { backgroundPosition: '-200%' },
        },
        flipIn: {
          '0%':   { transform: 'rotateX(-90deg)', opacity: '0' },
          '100%': { transform: 'rotateX(0deg)',   opacity: '1' },
        },
        pulseGol: {
          '0%':   { transform: 'scale(1)',    boxShadow: 'none' },
          '50%':  { transform: 'scale(1.08)', boxShadow: '0 0 30px #00B341' },
          '100%': { transform: 'scale(1)',    boxShadow: 'none' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

---

## 📁 ESTRUCTURA DE ARCHIVOS — CREAR EXACTAMENTE ESTA

```
src/
├── app/
│   ├── layout.tsx                  # Root layout con fuentes y providers
│   ├── page.tsx                    # Home — Hero + Countdown + resumen
│   ├── fixture/
│   │   └── page.tsx                # Fixture completo — Grupos + Eliminatorias
│   ├── equipos/
│   │   ├── page.tsx                # Grid de los 48 equipos
│   │   └── [slug]/page.tsx         # Perfil detallado del equipo
│   ├── estadios/
│   │   └── page.tsx                # Los 16 estadios con mapa
│   ├── estadisticas/
│   │   └── page.tsx                # Goleadores + Stats en tiempo real
│   └── api/
│       ├── matches/route.ts        # Proxy → football-data.org
│       ├── standings/route.ts
│       └── players/route.ts        # Proxy → TheSportsDB
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Nav con logo + links + buscador
│   │   ├── Footer.tsx
│   │   └── MobileMenu.tsx
│   │
│   ├── hero/
│   │   ├── HeroSection.tsx         # Video loop + título + CTA
│   │   ├── Countdown.tsx           # ⭐ Flip cards DÍAS/HORAS/MIN/SEG
│   │   └── HeroBackground.tsx      # Parallax estadio
│   │
│   ├── fixture/
│   │   ├── GroupsGrid.tsx          # Grid de los 12 grupos
│   │   ├── GroupTable.tsx          # Tabla de un grupo con posiciones
│   │   ├── MatchCard.tsx           # ⭐ Tarjeta de partido (equipos + hora + sede)
│   │   ├── MatchCardLive.tsx       # Versión en vivo con animación gol
│   │   ├── FixtureFilters.tsx      # Filtros: fecha · grupo · sede
│   │   ├── PhaseNav.tsx            # Tabs: Grupos / 1/32 / OF / QF / SF / F
│   │   └── BracketView.tsx         # Vista eliminatoria en bracket
│   │
│   ├── scoreboard/
│   │   ├── LiveScoreboard.tsx      # ⭐ Marcador en tiempo real
│   │   ├── ScoreFlip.tsx           # Animación flip al cambiar marcador
│   │   ├── GoalAlert.tsx           # Overlay animado cuando hay gol
│   │   ├── MatchTimeline.tsx       # Feed minuto a minuto
│   │   └── LiveStats.tsx           # Posesión, remates, córners
│   │
│   ├── players/
│   │   ├── PlayerCard.tsx          # ⭐ Foto + nombre + stats + club
│   │   ├── PlayerGrid.tsx          # Grid filtrable de jugadores
│   │   ├── PlayerModal.tsx         # Modal con detalle + heatmap
│   │   └── TopScorers.tsx          # Ranking goleadores
│   │
│   ├── teams/
│   │   ├── TeamCard.tsx            # ⭐ Escudo + nombre + grupo
│   │   ├── TeamsGrid.tsx           # Grid 48 equipos
│   │   ├── TeamProfile.tsx         # Perfil completo del equipo
│   │   └── HeadToHead.tsx          # Comparador entre dos equipos
│   │
│   ├── stadiums/
│   │   ├── StadiumCard.tsx         # ⭐ Imagen + nombre + capacidad
│   │   ├── StadiumsMap.tsx         # Mapbox con los 16 estadios
│   │   ├── StadiumGallery.tsx      # Lightbox con imágenes
│   │   └── StadiumInfo.tsx         # Ficha técnica
│   │
│   └── ui/
│       ├── Badge.tsx               # Badges: LIVE, GOL, GRP
│       ├── FlagEmoji.tsx           # Bandera por código de país
│       ├── CrestImage.tsx          # Escudo con fallback
│       ├── SkeletonCard.tsx        # Loading skeleton
│       ├── CountryFlag.tsx         # Flag + nombre del país
│       ├── StatBar.tsx             # Barra de estadística animada
│       └── SectionHeader.tsx       # Header de sección con línea dorada
│
├── hooks/
│   ├── useLiveMatch.ts             # ⭐ WebSocket hook
│   ├── useCountdown.ts             # Countdown al Mundial
│   ├── useMatches.ts               # React Query → matches API
│   ├── useStandings.ts             # React Query → standings API
│   ├── usePlayers.ts               # React Query → TheSportsDB
│   └── useConfetti.ts              # Canvas confetti hook
│
├── lib/
│   ├── football-api.ts             # Cliente football-data.org
│   ├── sportsdb-api.ts             # Cliente TheSportsDB
│   ├── balldontlie-api.ts          # Cliente fifa.balldontlie.io
│   ├── socket.ts                   # Socket.io client singleton
│   └── utils.ts                    # cn(), formatDate(), formatScore()
│
├── store/
│   └── matchStore.ts               # Zustand: estado global de partidos live
│
├── data/
│   ├── groups.ts                   # Los 12 grupos con equipos (hardcoded del brief)
│   ├── fixture-june.ts             # Fixture completo junio 2026
│   ├── fixture-july.ts             # Fixture eliminatorias julio 2026
│   └── stadiums.ts                 # Los 16 estadios con datos completos
│
└── types/
    ├── match.ts                    # Match, Team, Player, Stadium interfaces
    ├── api.ts                      # API response types
    └── live.ts                     # LiveEvent, GoalEvent, SubEvent types
```

---

## 📋 FASES DE DESARROLLO — EJECUTAR EN ESTE ORDEN

### FASE 1 — Setup + Design System (hacer primero)

1. Crear el proyecto con el comando de instalación exacto de arriba
2. Configurar `globals.css` y `tailwind.config.ts` con los tokens exactos
3. Crear `src/app/layout.tsx` con fuentes, metadata y dark background
4. Crear `src/components/layout/Navbar.tsx`:
   - Logo "MUNDIAL 2026" en Bebas Neue + dorado
   - Links: Inicio · Fixture · Equipos · Estadios · Stats
   - Badge animado "⚽ EN VIVO" cuando hay partidos activos
   - Mobile: hamburger menu con slide-in
5. Hardcodear los datos del fixture en `src/data/` (no depender de la API aún)

---

### FASE 2 — Hero + Countdown (impacto inmediato)

**`HeroSection.tsx`** — Debe incluir:
```typescript
// Diseño visual:
// - Background: video loop de estadio (fallback: imagen con parallax CSS)
// - Overlay: gradiente de azul-noche al 70% de opacidad
// - Título: "MUNDIAL 2026" en Bebas Neue 96px, animado con GSAP
// - Subtítulo: "11 JUN — 19 JUL · USA · CANADA · MEXICO"
// - CTA buttons: "VER FIXTURE" (rojo) + "EQUIPOS" (outline dorado)
// - Abajo: el componente Countdown

// GSAP animation al montar:
// gsap.from('.hero-title', { y: -100, opacity: 0, duration: 0.8, stagger: 0.1 })
```

**`Countdown.tsx`** — Flip cards estilo aeropuerto:
```typescript
// Props: targetDate = new Date('2026-06-11T19:00:00Z')
// 4 flip cards: DÍAS | HORAS | MIN | SEG
// Cada card: 
//   - Fondo #0F1E38, borde dorado 1px, border-radius 8px
//   - Número: Bebas Neue 72px, blanco
//   - Label: Barlow Condensed 12px, dorado, letra-espaciado 3px
//   - Efecto flip: CSS perspective + rotateX en transición
//   - Separadores ":" entre cards en dorado
// Si targetDate pasó → mostrar "¡MUNDIAL EN CURSO!" con badge rojo pulsante
```

---

### FASE 3 — Fixture Completo (core del producto)

**`MatchCard.tsx`** — El componente más importante:
```typescript
interface MatchCardProps {
  homeTeam:    { name: string; flag: string; crest?: string }
  awayTeam:    { name: string; flag: string; crest?: string }
  date:        string   // "11 JUN JUE"
  time:        string   // "16:00 ARG"
  venue:       string   // "Azteca, Ciudad de México"
  group:       string   // "A"
  status:      'SCHEDULED' | 'LIVE' | 'FINISHED'
  homeScore?:  number
  awayScore?:  number
}

// Diseño:
// - Background: #152238, border 1px solid #1B3A6B
// - Hover: translateY(-2px) + border-color: #C8922A + shadow dorado
// - Layout: [escudo] [nombre equipo] --- [hora/score] --- [nombre] [escudo]
// - Si LIVE: badge "⚽ EN VIVO" rojo pulsante + score animado
// - Si FINISHED: score centrado grande en blanco
// - Sede: texto pequeño #8A8A8A en la parte inferior
```

**`GroupsGrid.tsx`** — Los 12 grupos:
```typescript
// Grid 3 columnas en desktop, 2 en tablet, 1 en mobile
// Cada grupo: título "GRUPO A" en Bebas Neue + rojo
// Tabla con columnas: # | Equipo | PJ | G | E | P | GF | GC | Pts
// Filas hover: background #1B3A6B + translateX(4px)
// Clasificados (top 2): borde izquierdo verde
// Posibles clasificados (3° mejor): borde izquierdo amarillo
```

**`PhaseNav.tsx`** — Navegación de fases:
```typescript
// Tabs estilo pill: [GRUPOS] [1/32] [OCTAVOS] [CUARTOS] [SEMIS] [FINAL]
// Tab activo: background rojo, texto blanco
// Tab inactivo: background #152238, texto gris
// Indicador animado que se desliza con framer-motion layout animation
```

---

### FASE 4 — Scoreboard en Tiempo Real

**`LiveScoreboard.tsx`**:
```typescript
// Conecta al WebSocket → useLiveMatch(matchId)
// Muestra: 
//   - Minuto actual con reloj animado (flicker cada segundo)
//   - Score con flip animation al cambiar
//   - Goleadores debajo de cada equipo
//   - Estadísticas en vivo: posesión (barra), remates, córners, faltas
// Cuando hay GOL:
//   1. GoalAlert overlay aparece (2 segundos)
//   2. Confetti Canvas explota (200 partículas #D10A11 + #C8922A + #F5F0E8)
//   3. Score flipea con animación rotateX
//   4. Lottie animation de pelota+red (si disponible)
```

**`useConfetti.ts`** — Implementar desde cero con Canvas API:
```typescript
// triggerConfetti(canvas: HTMLCanvasElement) → void
// 200 partículas con:
//   - colores aleatorios de ['#D10A11','#C8922A','#F5F0E8','#00B341']
//   - velocidad inicial random (-8 a 8 en x, -15 a -5 en y)
//   - gravedad: +0.3 por frame
//   - rotación aleatoria
//   - fade out después de 2.5s
//   - limpiar canvas cuando todas las partículas cayeron
```

**`MatchTimeline.tsx`** — Feed minuto a minuto:
```typescript
// Lista vertical con iconos por tipo de evento:
// ⚽ GOL → verde, texto bold, fondo levemente verde
// 🟨 AMARILLA → amarillo
// 🟥 ROJA → rojo
// 📋 SUSTITUCIÓN → gris
// 🏁 INICIO/FIN → azul acento
// Cada evento: slide-in desde la izquierda con framer-motion
// Scroll automático al evento más reciente
```

---

### FASE 5 — Jugadores & Equipos

**`PlayerCard.tsx`**:
```typescript
// Fetch de imagen: TheSportsDB /api/v1/json/3/searchplayers.php?t={team}
// Diseño:
//   - Foto del jugador (strCutout) con fondo degradado oscuro
//   - Nombre en Barlow Condensed Bold 18px
//   - País + bandera emoji
//   - Posición como badge (DEL/MED/DEF/POR)
//   - Número de camiseta grande en el fondo (opacity 0.1)
//   - Stats: Goles | Asist. | Amarillas
// Hover: scale(1.05) + shadow dorado (--shadow-oro)
// Click: abre PlayerModal con detalle completo
```

**`TeamCard.tsx`**:
```typescript
// Fetch escudo: football-data.org /v4/teams/{id} → crest URL
// Diseño:
//   - Escudo centrado, 80x80px con object-fit: contain
//   - Nombre del equipo en Barlow Condensed Bold
//   - Badge "GRUPO X" en rojo
//   - Hover: clip-path wipe diagonal del fondo dorado
//   - Fallback: emoji de bandera nacional
```

---

### FASE 6 — Estadios & Mapa

**`StadiumCard.tsx`**:
```typescript
// Imagen del estadio (Mapbox Static Tiles como fallback)
// const mapImg = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/
//   ${lng},${lat},15,0/600x300@2x?access_token=${MAPBOX_TOKEN}`
// Overlay gradiente oscuro en la parte inferior
// Texto: nombre + ciudad + capacidad con ícono 👥
// Hover: brightness(1.2) + saturate(1.1) en la imagen
```

**`StadiumsMap.tsx`**:
```typescript
// Mapbox GL JS con estilo 'mapbox://styles/mapbox/dark-v11'
// 16 marcadores custom (color según país: rojo=USA, verde=MEX, azul=CAN)
// Click en marcador → Popup con nombre + capacidad + próximo partido
// Fit bounds para que entren los 3 países al cargar
```

---

### FASE 7 — Animaciones & Polish

**Implementar en este orden:**

1. **Parallax en Hero**: `useEffect` con `scroll` event → `backgroundPositionY`
2. **Skeleton loaders**: Para todas las cards mientras carga la API
3. **Page transitions**: `framer-motion` `AnimatePresence` en layout.tsx
4. **Intersection Observer**: Fade-up de secciones al entrar en viewport
5. **Hover states globales**: Revisar que TODOS los elementos interactivos tengan feedback

---

## 🔌 INTEGRACIÓN DE APIs

### Variables de entorno — `.env.local`

```bash
FOOTBALL_DATA_API_KEY=tu_key_aqui
NEXT_PUBLIC_MAPBOX_TOKEN=tu_token_aqui
NEXT_PUBLIC_WS_URL=ws://localhost:3001
SUPABASE_URL=tu_url
SUPABASE_ANON_KEY=tu_key
```

### `src/lib/football-api.ts`

```typescript
const BASE = 'https://api.football-data.org/v4';
const HEADERS = { 'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY! };

export const footballAPI = {
  async getMatches(competitionCode = 'WC') {
    const res = await fetch(`${BASE}/competitions/${competitionCode}/matches`, {
      headers: HEADERS,
      next: { revalidate: 60 }  // ISR: revalidar cada 60s
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },

  async getStandings(competitionCode = 'WC') {
    const res = await fetch(`${BASE}/competitions/${competitionCode}/standings`, {
      headers: HEADERS,
      next: { revalidate: 120 }
    });
    return res.json();
  },

  async getTeam(teamId: number) {
    const res = await fetch(`${BASE}/teams/${teamId}`, {
      headers: HEADERS,
      next: { revalidate: 3600 }  // escudos no cambian
    });
    return res.json();
  },

  async getScorers(competitionCode = 'WC') {
    const res = await fetch(`${BASE}/competitions/${competitionCode}/scorers`, {
      headers: HEADERS,
      next: { revalidate: 300 }
    });
    return res.json();
  },
};
```

### `src/lib/sportsdb-api.ts`

```typescript
const BASE = 'https://www.thesportsdb.com/api/v1/json/3';

export const sportsDB = {
  async searchPlayers(teamName: string) {
    const res = await fetch(
      `${BASE}/searchplayers.php?t=${encodeURIComponent(teamName)}`
    );
    return res.json();
  },

  async searchVenues() {
    const res = await fetch(`${BASE}/searchvenues.php?e=World_Cup_2026`);
    return res.json();
  },

  async getPlayerByName(name: string) {
    const res = await fetch(`${BASE}/searchplayers.php?p=${encodeURIComponent(name)}`);
    return res.json();
  },
};
```

### `src/hooks/useLiveMatch.ts`

```typescript
'use client';
import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useMatchStore } from '@/store/matchStore';

interface LiveEvent {
  type:    'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'KICKOFF' | 'FINAL_WHISTLE';
  minute:  number;
  team:    'HOME' | 'AWAY';
  player?: string;
  detail?: string;
}

interface LiveMatch {
  matchId:    string;
  homeScore:  number;
  awayScore:  number;
  minute:     number;
  status:     'LIVE' | 'HT' | 'FT';
  possession: { home: number; away: number };
  shots:      { home: number; away: number };
}

export function useLiveMatch(matchId: string) {
  const [match,     setMatch]     = useState<LiveMatch | null>(null);
  const [events,    setEvents]    = useState<LiveEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const { triggerGoalAnimation }  = useMatchStore();

  useEffect(() => {
    const socket: Socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on('connect',    () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.emit('join-match', matchId);

    socket.on('match-update', (data: LiveMatch) => setMatch(data));
    socket.on('match-event',  (evt: LiveEvent)  => {
      setEvents(prev => [evt, ...prev.slice(0, 99)]); // max 100 eventos
      if (evt.type === 'GOAL') triggerGoalAnimation(matchId);
    });

    // Fallback: polling cada 30s si WebSocket no disponible
    const fallback = setInterval(async () => {
      if (!connected) {
        try {
          const res  = await fetch(`/api/matches/${matchId}`);
          const data = await res.json();
          setMatch(data);
        } catch {}
      }
    }, 30_000);

    return () => {
      socket.disconnect();
      clearInterval(fallback);
    };
  }, [matchId]);

  return { match, events, connected };
}
```

---

## 📊 DATOS HARDCODEADOS — CARGAR DESDE `src/data/`

> **Importante:** La API puede fallar o no tener el Mundial 2026 aún. Los datos del fixture completo están en `Mundial2026_DesignBrief.md`. Hardcodearlos en `src/data/fixture-june.ts` y `src/data/fixture-july.ts` como fallback.

```typescript
// src/data/groups.ts
export const GROUPS = [
  { id: 'A', teams: ['México', 'Sudáfrica', 'Corea del Sur', 'Rep. Checa'] },
  { id: 'B', teams: ['Canadá', 'Bosnia y Herz.', 'Qatar', 'Suiza'] },
  { id: 'C', teams: ['Brasil', 'Marruecos', 'Haití', 'Escocia'] },
  { id: 'D', teams: ['Estados Unidos', 'Paraguay', 'Australia', 'Turquía'] },
  { id: 'E', teams: ['Alemania', 'Curazao', 'Costa de Marfil', 'Ecuador'] },
  { id: 'F', teams: ['Países Bajos', 'Japón', 'Suecia', 'Túnez'] },
  { id: 'G', teams: ['Bélgica', 'Egipto', 'Irán', 'Nueva Zelanda'] },
  { id: 'H', teams: ['España', 'Cabo Verde', 'Arabia Saudita', 'Uruguay'] },
  { id: 'I', teams: ['Francia', 'Senegal', 'Irak', 'Noruega'] },
  { id: 'J', teams: ['Argentina', 'Argelia', 'Austria', 'Jordania'] },
  { id: 'K', teams: ['Portugal', 'RD de Congo', 'Uzbekistán', 'Colombia'] },
  { id: 'L', teams: ['Inglaterra', 'Croacia', 'Ghana', 'Panamá'] },
] as const;

// src/data/stadiums.ts
export const STADIUMS = [
  { name: 'Estadio Azteca',        city: 'Ciudad de México', country: 'MEX', capacity: 87523, lat: 19.3029,  lng: -99.1505,  surface: 'Pasto nat.', year: 1966 },
  { name: 'MetLife Stadium',        city: 'Nueva Jersey',    country: 'USA', capacity: 82500, lat: 40.8128,  lng: -74.0742,  surface: 'FieldTurf',  year: 2010 },
  { name: 'AT&T Stadium',           city: 'Arlington TX',    country: 'USA', capacity: 80000, lat: 32.7473,  lng: -97.0945,  surface: 'FieldTurf',  year: 2009 },
  { name: 'Arrowhead Stadium',      city: 'Kansas City MO',  country: 'USA', capacity: 76416, lat: 39.0489,  lng: -94.4839,  surface: 'Pasto nat.', year: 1972 },
  { name: 'NRG Stadium',            city: 'Houston TX',      country: 'USA', capacity: 72220, lat: 29.6847,  lng: -95.4107,  surface: 'FieldTurf',  year: 2002 },
  { name: 'Mercedes-Benz Stadium',  city: 'Atlanta GA',      country: 'USA', capacity: 71000, lat: 33.7553,  lng: -84.4006,  surface: 'FieldTurf',  year: 2017 },
  { name: 'SoFi Stadium',           city: 'Los Ángeles CA',  country: 'USA', capacity: 70240, lat: 33.9534,  lng: -118.3392, surface: 'FieldTurf',  year: 2020 },
  { name: 'Lincoln Financial Field',city: 'Philadelphia PA', country: 'USA', capacity: 69796, lat: 39.9008,  lng: -75.1675,  surface: 'Pasto nat.', year: 2003 },
  { name: 'Lumen Field',            city: 'Seattle WA',      country: 'USA', capacity: 69000, lat: 47.5952,  lng: -122.3316, surface: 'FieldTurf',  year: 2002 },
  { name: 'Levi\'s Stadium',        city: 'Santa Clara CA',  country: 'USA', capacity: 68500, lat: 37.4032,  lng: -121.9698, surface: 'FieldTurf',  year: 2014 },
  { name: 'Gillette Stadium',       city: 'Boston MA',       country: 'USA', capacity: 65878, lat: 42.0909,  lng: -71.2643,  surface: 'FieldTurf',  year: 2002 },
  { name: 'Hard Rock Stadium',      city: 'Miami FL',        country: 'USA', capacity: 64767, lat: 25.9580,  lng: -80.2389,  surface: 'Pasto nat.', year: 1987 },
  { name: 'BC Place',               city: 'Vancouver',       country: 'CAN', capacity: 54500, lat: 49.2767,  lng: -123.1118, surface: 'Pasto art.', year: 1983 },
  { name: 'Estadio BBVA',           city: 'Monterrey',       country: 'MEX', capacity: 51348, lat: 25.6694,  lng: -100.2438, surface: 'Pasto nat.', year: 2015 },
  { name: 'Estadio Akron',          city: 'Guadalajara',     country: 'MEX', capacity: 46232, lat: 20.6717,  lng: -103.4769, surface: 'Pasto nat.', year: 2010 },
  { name: 'BMO Field',              city: 'Toronto',         country: 'CAN', capacity: 45736, lat: 43.6333,  lng: -79.4189,  surface: 'Pasto nat.', year: 2007 },
] as const;
```

---

## 🎭 ANIMACIONES — ESPECIFICACIONES EXACTAS

### Confetti (Canvas API) — `src/hooks/useConfetti.ts`

```typescript
export function useConfetti() {
  const triggerConfetti = (canvasId = 'confetti-canvas') => {
    const canvas  = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx     = canvas.getContext('2d')!;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS  = ['#D10A11', '#C8922A', '#F5F0E8', '#00B341', '#E5B857'];
    const TOTAL   = 200;

    const particles = Array.from({ length: TOTAL }, () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height * 0.3,
      vx:      (Math.random() - 0.5) * 10,
      vy:      Math.random() * -12 - 4,
      color:   COLORS[Math.floor(Math.random() * COLORS.length)],
      size:    Math.random() * 8 + 4,
      rotation:Math.random() * 360,
      rotSpeed:(Math.random() - 0.5) * 8,
      alpha:   1,
    }));

    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.x        += p.vx;
        p.vy       += 0.3;       // gravity
        p.y        += p.vy;
        p.rotation += p.rotSpeed;
        p.alpha    -= 0.008;
        if (p.alpha > 0) { alive = true; }
        ctx.save();
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.fillStyle   = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
        ctx.restore();
      });
      if (alive) { frame = requestAnimationFrame(animate); }
      else { ctx.clearRect(0, 0, canvas.width, canvas.height); }
    };
    animate();
    return () => cancelAnimationFrame(frame);
  };
  return { triggerConfetti };
}
```

### Flip Card (Countdown) — CSS

```css
.flip-card {
  perspective: 800px;
  width: 90px;
  height: 110px;
}
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.flip-card.flipping .flip-card-inner {
  animation: flipDown 0.4s ease-in-out;
}
@keyframes flipDown {
  0%   { transform: rotateX(0deg);   }
  50%  { transform: rotateX(-90deg); }
  100% { transform: rotateX(0deg);   }
}
.flip-card-face {
  background:    #0F1E38;
  border:        1px solid #C8922A;
  border-radius: 8px;
  display:       flex;
  flex-direction:column;
  align-items:   center;
  justify-content:center;
  color:         #F5F0E8;
}
/* Línea del pliegue (efecto aeropuerto) */
.flip-card-face::after {
  content:    '';
  position:   absolute;
  left:       0;
  top:        50%;
  width:      100%;
  height:     1px;
  background: rgba(0, 0, 0, 0.5);
}
```

---

## ✅ CRITERIOS DE ACEPTACIÓN (DEFINITION OF DONE)

Al terminar la primera sesión de desarrollo, la app DEBE:

- [ ] Correr con `npm run dev` sin errores en consola
- [ ] Mostrar el Hero con countdown funcionando (restando segundos)
- [ ] Renderizar el fixture completo de junio 2026 (al menos los datos hardcodeados)
- [ ] Tener la tabla de grupos de los 12 grupos visible
- [ ] Cards de partidos con equipos, hora y sede
- [ ] Navbar responsive con mobile menu
- [ ] Grid de los 16 estadios con capacidad
- [ ] Paleta de colores exacta (`#D10A11`, `#C8922A`, `#0A1628`)
- [ ] Tipografía: Bebas Neue en títulos, Barlow en cuerpo
- [ ] Hover states en todas las cards (escala + sombra dorada)
- [ ] Sin layout shifts, sin textos cortados, sin overlaps
- [ ] `npm run build` sin errores TypeScript

---

## 🚀 COMANDO DE INICIO

```bash
# 1. Leer el design brief completo (OBLIGATORIO antes de codear)
cat Mundial2026_DesignBrief.md

# 2. Crear el proyecto
npx create-next-app@latest mundial-2026 --typescript --tailwind --eslint --app --src-dir

# 3. Instalar dependencias
cd mundial-2026 && npm install gsap framer-motion lottie-react socket.io-client zustand @supabase/supabase-js mapbox-gl react-map-gl recharts date-fns clsx tailwind-merge lucide-react @radix-ui/react-dialog @radix-ui/react-tabs

# 4. Empezar por globals.css y tailwind.config.ts
# 5. Luego layout.tsx → Navbar → HeroSection → Countdown → MatchCard → GroupsGrid
# 6. Seguir el orden de las FASES exactamente
```

---

## ⚠️ REGLAS CRÍTICAS

1. **Nunca usar colores genéricos** — solo los tokens del design system
2. **Nunca usar fuentes genéricas** — solo Bebas Neue / Barlow Condensed / Barlow
3. **Todo componente debe tener hover state** — sin excepción
4. **Skeleton loaders en TODAS las llamadas a API** — sin pantallas en blanco
5. **Mobile-first** — probar en 375px antes de desktop
6. **TypeScript estricto** — no usar `any`, definir interfaces en `src/types/`
7. **Error boundaries** — si la API falla, mostrar datos hardcodeados del `src/data/`
8. **No inventar datos** — el fixture completo está en `Mundial2026_DesignBrief.md`
9. **ISR para datos de la API** — `next: { revalidate: 60 }` en todos los fetches
10. **Accesibilidad** — `alt` en imágenes, `aria-label` en botones, foco visible

---

*Referencia completa: `Mundial2026_DesignBrief.md` — 828 líneas con todo el sistema de diseño, fixture, APIs y especificaciones técnicas.*
