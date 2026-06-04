# 🏆 MUNDIAL 2026 — DESIGN SYSTEM & BRIEF PROFESIONAL

> Sistema completo de identidad visual, guía de componentes y especificaciones técnicas para el sitio web oficial del torneo más grande de la historia.
>
> **48 SELECCIONES · 3 SEDES · USA / CANADA / MEXICO · JUNIO–JULIO 2026**

---

## 01 — Introducción y Visión General

El Mundial 2026 es el torneo más grande de la historia: 48 selecciones, tres países anfitriones (Estados Unidos, Canadá y México) y una audiencia global proyectada de más de 5 mil millones de espectadores. Este documento define el sistema de diseño completo para la plataforma digital oficial, cubriendo identidad visual, componentes, estructura y lineamientos técnicos.

| Concepto | Detalle |
|---|---|
| Torneo | FIFA World Cup 2026™ |
| Edición | 23.ª Copa del Mundo FIFA |
| Países sede | USA · Canadá · México |
| Selecciones | 48 equipos (nuevo formato) |
| Periodo | 11 de Junio – 19 de Julio 2026 |
| Audiencia objetivo | Global — 5.000 M+ espectadores |
| Plataforma principal | Web responsive + App nativa |

---

## 02 — Paleta de Colores

La identidad cromática combina la potencia del rojo pasión, la elegancia del dorado y la profundidad del azul noche, creando una paleta que evoca competencia, gloria y modernidad global.

### Colores Primarios

| Nombre | Hex | Uso |
|---|---|---|
| 🔴 Rojo Fuego | `#D10A11` | CTAs, goles, alertas, badges activos |
| 🟡 Oro Trofeo | `#C8922A` | Títulos, bordes, iconos premium |
| 🌑 Azul Noche | `#0A1628` | Background principal |
| 🔵 Azul Medio | `#152238` | Cards, sidebars, headers |

### Colores Secundarios

| Nombre | Hex | Uso |
|---|---|---|
| Azul Acento | `#1B3A6B` | Hover states, links, highlights |
| Blanco Cálido | `#F5F0E8` | Texto principal, iconos sobre oscuro |
| Verde Gol | `#00B341` | Confirmaciones, goles, éxito |
| Gris Neutro | `#8A8A8A` | Textos secundarios, placeholders |

### Tokens CSS

```css
:root {
  --color-rojo:        #D10A11;
  --color-oro:         #C8922A;
  --color-azul-noche:  #0A1628;
  --color-azul-medio:  #152238;
  --color-azul-acento: #1B3A6B;
  --color-blanco:      #F5F0E8;
  --color-verde-gol:   #00B341;
  --color-gris:        #8A8A8A;
}
```

---

## 03 — Sistema Tipográfico

| Rol | Familia | Peso | Tamaño | Uso Principal |
|---|---|---|---|---|
| Display / Hero | Bebas Neue | Regular 400 | 64–96px | Títulos de portada, scoreboard |
| Subtítulos | Barlow Condensed | Bold 700 | 24–48px | Encabezados de sección |
| Navegación | Barlow Condensed | SemiBold 600 | 12–14px | Menú, etiquetas, badges |
| Cuerpo | Barlow | Regular 400 | 14–16px | Párrafos, descripciones |
| Datos / Stats | Barlow | Medium 500 | 12–13px | Estadísticas, tablas |
| Fallback web | Impact → Arial Narrow | — | — | Compatibilidad universal |

### Import (Google Fonts)

```html
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet">
```

---

## 04 — Estructura del Sitio

El sitio se organiza en seis módulos principales, cada uno con sub-secciones específicas y objetivos de UX definidos:

### 🏠 HOME / HERO
- Countdown animado al pitazo inicial
- Video loop de jugadas épicas (autoplay mute)
- Acceso rápido: Grupos · Fixture · Resultados en vivo
- Carrusel de noticias de última hora

### 📅 FIXTURE & RESULTADOS
- Vista calendario por fase (Grupos → Octavos → Final)
- Scoreboard en tiempo real con animaciones de gol
- Filtros por sede, fecha y selección
- Historial de ediciones anteriores

### 🌍 SELECCIONES
- Fichas de los 48 países con escudo, plantel y estadísticas
- Comparador head-to-head entre dos selecciones
- Mapa interactivo de trayectorias por grupo
- Perfil detallado por jugador con heatmaps

### 🏟️ SEDES & ESTADIOS
- Tour virtual 360° de los 16 estadios
- Información de acceso, transporte y alojamiento
- Clima en tiempo real en cada ciudad sede
- Mapa interactivo USA · Canadá · México

### 📊 ESTADÍSTICAS
- Dashboard de goleadores, asistentes y porteros
- Gráficas avanzadas: pases, xG, posesión, presión
- Rankings en tiempo real actualizados tras cada partido
- Exportación de datos en CSV/PDF

### 🎉 EXPERIENCIA DE FAN
- Fantasy League integrado con puntuación en vivo
- Predictor de resultados con IA
- Galería de fotos y videos UGC verificados
- Tienda oficial con kits y merchandising

---

## 05 — Fixture Oficial — Junio 2026 (Fase de Grupos)

> Todos los horarios corresponden a **Argentina/Uruguay (UTC-3)**. `*` = partido pasada la medianoche.

### Grupos

| Grupo | Equipos |
|---|---|
| A | México · Sudáfrica · Corea del Sur · Rep. Checa |
| B | Canadá · Bosnia y Herz. · Qatar · Suiza |
| C | Brasil · Marruecos · Haití · Escocia |
| D | Estados Unidos · Paraguay · Australia · Turquía |
| E | Alemania · Curazao · Costa de Marfil · Ecuador |
| F | Países Bajos · Japón · Suecia · Túnez |
| G | Bélgica · Egipto · Irán · Nueva Zelanda |
| H | España · Cabo Verde · Arabia Saudita · Uruguay |
| I | Francia · Senegal · Irak · Noruega |
| J | Argentina · Argelia · Austria · Jordania |
| K | Portugal · RD de Congo · Uzbekistán · Colombia |
| L | Inglaterra · Croacia · Ghana · Panamá |

### Calendario Completo

| Fecha | Partido | Grp | Hora (ARG) | Sede |
|---|---|---|---|---|
| 11 JUN JUE | México vs. Sudáfrica | A | 16:00 | Azteca, Ciudad de México |
| 11 JUN JUE | Corea del Sur vs. Rep. Checa | A | 23:00 | Akron, Guadalajara |
| 12 JUN VIE | Canadá vs. Bosnia y Herz. | B | 16:00 | BMO Field, Toronto |
| 12 JUN VIE | Estados Unidos vs. Paraguay | D | 22:00 | SoFi Stadium, Los Ángeles |
| 13 JUN SÁB | Qatar vs. Suiza | B | 16:00 | Levi's Stadium, San Francisco |
| 13 JUN SÁB | Brasil vs. Marruecos | C | 19:00 | MetLife, Nueva Jersey |
| 13 JUN SÁB | Haití vs. Escocia | C | 22:00 | Gillette, Boston |
| 13 JUN SÁB | Australia vs. Turquía | D | 01:00* | BC Place, Vancouver |
| 14 JUN DOM | Alemania vs. Curazao | E | 14:00 | NRG Stadium, Houston |
| 14 JUN DOM | Países Bajos vs. Japón | F | 17:00 | AT&T Stadium, Dallas |
| 14 JUN DOM | Costa de Marfil vs. Ecuador | E | 20:00 | Lincoln Financial, Philadelphia |
| 14 JUN DOM | Suecia vs. Túnez | F | 23:00 | BBVA Stadium, Monterrey |
| 15 JUN LUN | España vs. Cabo Verde | H | 13:00 | Mercedes-Benz, Atlanta |
| 15 JUN LUN | Bélgica vs. Egipto | G | 16:00 | Lumen Field, Seattle |
| 15 JUN LUN | Arabia Saudita vs. Uruguay | H | 19:00 | Hard Rock, Miami |
| 15 JUN LUN | Irán vs. Nueva Zelanda | G | 22:00 | SoFi Stadium, Los Ángeles |
| 16 JUN MAR | Francia vs. Senegal | I | 16:00 | MetLife, Nueva Jersey |
| 16 JUN MAR | Irak vs. Noruega | I | 19:00 | Gillette, Boston |
| 16 JUN MAR | Argentina vs. Argelia | J | 22:00 | Arrowhead, Kansas City |
| 16 JUN MAR | Austria vs. Jordania | J | 01:00* | Levi's, San Francisco |
| 17 JUN MIÉ | Portugal vs. RD de Congo | K | 14:00 | NRG Stadium, Houston |
| 17 JUN MIÉ | Inglaterra vs. Croacia | L | 17:00 | AT&T Stadium, Dallas |
| 17 JUN MIÉ | Ghana vs. Panamá | L | 20:00 | BMO Field, Toronto |
| 17 JUN MIÉ | Uzbekistán vs. Colombia | K | 23:00 | Azteca, Ciudad de México |
| 18 JUN JUE | Rep. Checa vs. Sudáfrica | A | 13:00 | Mercedes-Benz, Atlanta |
| 18 JUN JUE | Suiza vs. Bosnia y Herz. | B | 16:00 | SoFi Stadium, Los Ángeles |
| 18 JUN JUE | Canadá vs. Qatar | B | 19:00 | BC Place, Vancouver |
| 18 JUN JUE | México vs. Corea del Sur | A | 22:00 | Akron, Guadalajara |
| 19 JUN VIE | Estados Unidos vs. Australia | D | 16:00 | Lumen Field, Seattle |
| 19 JUN VIE | Escocia vs. Marruecos | C | 19:00 | Gillette, Boston |
| 19 JUN VIE | Brasil vs. Haití | C | 21:30 | Lincoln Financial, Philadelphia |
| 19 JUN VIE | Turquía vs. Paraguay | D | 00:00* | Levi's, San Francisco |
| 20 JUN SÁB | Países Bajos vs. Suecia | F | 14:00 | NRG Stadium, Houston |
| 20 JUN SÁB | Alemania vs. Costa de Marfil | E | 17:00 | BMO Field, Toronto |
| 20 JUN SÁB | Ecuador vs. Curazao | E | 23:00 | Arrowhead, Kansas City |
| 20 JUN SÁB | Túnez vs. Japón | F | 01:00* | BBVA Stadium, Monterrey |
| 21 JUN DOM | España vs. Arabia Saudita | H | 13:00 | Mercedes-Benz, Atlanta |
| 21 JUN DOM | Bélgica vs. Irán | G | 16:00 | SoFi Stadium, Los Ángeles |
| 21 JUN DOM | Uruguay vs. Cabo Verde | H | 19:00 | Hard Rock, Miami |
| 21 JUN DOM | Nueva Zelanda vs. Egipto | G | 22:00 | BC Place, Vancouver |
| 22 JUN LUN | Argentina vs. Austria | J | 14:00 | AT&T Stadium, Dallas |
| 22 JUN LUN | Francia vs. Irak | I | 18:00 | Lincoln Financial, Philadelphia |
| 22 JUN LUN | Noruega vs. Senegal | I | 21:00 | MetLife, Nueva Jersey |
| 22 JUN LUN | Jordania vs. Argelia | J | 00:00* | Levi's, San Francisco |
| 23 JUN MAR | Portugal vs. Uzbekistán | K | 14:00 | NRG Stadium, Houston |
| 23 JUN MAR | Inglaterra vs. Ghana | L | 17:00 | Gillette, Boston |
| 23 JUN MAR | Panamá vs. Croacia | L | 20:00 | BMO Field, Toronto |
| 23 JUN MAR | Colombia vs. RD de Congo | K | 23:00 | Akron, Guadalajara |
| 24 JUN MIÉ | Suiza vs. Canadá | B | 16:00 | BC Place, Vancouver |
| 24 JUN MIÉ | Bosnia y Herz. vs. Qatar | B | 16:00 | NRG Stadium, Houston |
| 24 JUN MIÉ | Sudáfrica vs. Corea del Sur | A | 22:00 | BBVA Stadium, Monterrey |
| 24 JUN MIÉ | Rep. Checa vs. México | A | 22:00 | Azteca, Ciudad de México |
| 25 JUN JUE | Paraguay vs. Australia | D | 16:00 | Arrowhead, Kansas City |
| 25 JUN JUE | Turquía vs. Estados Unidos | D | 16:00 | Lumen Field, Seattle |
| 25 JUN JUE | Marruecos vs. Haití | C | 22:00 | MetLife, Nueva Jersey |
| 25 JUN JUE | Escocia vs. Brasil | C | 22:00 | Mercedes-Benz, Atlanta |
| 26 JUN VIE | Costa de Marfil vs. Alemania | E | 16:00 | AT&T Stadium, Dallas |
| 26 JUN VIE | Curazao vs. Ecuador | E | 16:00 | Lincoln Financial, Philadelphia |
| 26 JUN VIE | Túnez vs. Países Bajos | F | 22:00 | Akron, Guadalajara |
| 26 JUN VIE | Suecia vs. Japón | F | 22:00 | Hard Rock, Miami |
| 27 JUN SÁB | Egipto vs. Bélgica | G | 16:00 | Lumen Field, Seattle |
| 27 JUN SÁB | Nueva Zelanda vs. Irán | G | 16:00 | BC Place, Vancouver |
| 27 JUN SÁB | Cabo Verde vs. España | H | 22:00 | Gillette, Boston |
| 27 JUN SÁB | Uruguay vs. Arabia Saudita | H | 22:00 | NRG Stadium, Houston |
| 28 JUN DOM | Senegal vs. Francia | I | 16:00 | AT&T Stadium, Dallas |
| 28 JUN DOM | Noruega vs. Irak | I | 16:00 | MetLife, Nueva Jersey |
| 28 JUN DOM | Argelia vs. Austria | J | 22:00 | BMO Field, Toronto |
| 28 JUN DOM | Jordania vs. Argentina | J | 22:00 | Arrowhead, Kansas City |
| 29 JUN LUN | RD de Congo vs. Uzbekistán | K | 16:00 | Levi's, San Francisco |
| 29 JUN LUN | Colombia vs. Portugal | K | 16:00 | Mercedes-Benz, Atlanta |
| 29 JUN LUN | Ghana vs. Croacia | L | 22:00 | Lincoln Financial, Philadelphia |
| 29 JUN LUN | Panamá vs. Inglaterra | L | 22:00 | SoFi Stadium, Los Ángeles |

---

## 06 — Fixture Oficial — Julio 2026 (Fases Eliminatorias)

> A partir del 30 de junio comienzan los dieciseisavos de final. Las llaves exactas se definen según la clasificación de la fase de grupos. Horarios en ARG (UTC-3).

| Fase | Descripción |
|---|---|
| 1/32 | Dieciseisavos de final (32 → 16 equipos) |
| OF | Octavos de final (16 → 8 equipos) |
| QF | Cuartos de final (8 → 4 equipos) |
| SF | Semifinales (4 → 2 equipos) |
| 3° | Partido por el tercer puesto |
| **F** | **GRAN FINAL — MetLife Stadium, Nueva Jersey** |

| Fecha | Partido | Fase | Hora (ARG) | Sede |
|---|---|---|---|---|
| 30 JUN MAR | 1° Grupo A vs. 3° mejor | 1/32 | 17:00 | Por confirmar |
| 30 JUN MAR | 1° Grupo B vs. 3° mejor | 1/32 | 21:00 | Por confirmar |
| 01 JUL MIÉ | 1° Grupo C vs. 3° mejor | 1/32 | 17:00 | Por confirmar |
| 01 JUL MIÉ | 1° Grupo D vs. 3° mejor | 1/32 | 21:00 | Por confirmar |
| 02 JUL JUE | 1° Grupo E vs. 3° mejor | 1/32 | 17:00 | Por confirmar |
| 02 JUL JUE | 1° Grupo F vs. 3° mejor | 1/32 | 21:00 | Por confirmar |
| 03 JUL VIE | 1° Grupo G vs. 3° mejor | 1/32 | 17:00 | Por confirmar |
| 03 JUL VIE | 1° Grupo H vs. 3° mejor | 1/32 | 21:00 | Por confirmar |
| 04 JUL SÁB | 2° Grupo A vs. 2° mejor | 1/32 | 17:00 | Por confirmar |
| 04 JUL SÁB | 2° Grupo B vs. 2° mejor | 1/32 | 21:00 | Por confirmar |
| 05 JUL DOM | 2° Grupo C vs. 2° mejor | 1/32 | 17:00 | Por confirmar |
| 05 JUL DOM | 2° Grupo D vs. 2° mejor | 1/32 | 21:00 | Por confirmar |
| 06 JUL LUN | 2° Grupo E vs. 2° mejor | 1/32 | 17:00 | Por confirmar |
| 06 JUL LUN | 2° Grupo F vs. 2° mejor | 1/32 | 21:00 | Por confirmar |
| 07 JUL MAR | Octavo de final 1 | OF | 17:00 | Mercedes-Benz, Atlanta |
| 07 JUL MAR | Octavo de final 2 | OF | 21:00 | Lumen Field, Seattle |
| 08 JUL MIÉ | Octavo de final 3 | OF | 17:00 | AT&T Stadium, Dallas |
| 08 JUL MIÉ | Octavo de final 4 | OF | 21:00 | Hard Rock, Miami |
| 09 JUL JUE | Octavo de final 5 | OF | 17:00 | MetLife, Nueva Jersey |
| 09 JUL JUE | Octavo de final 6 | OF | 21:00 | Levi's, San Francisco |
| 10 JUL VIE | Octavo de final 7 | OF | 17:00 | Lincoln Financial, Philadelphia |
| 10 JUL VIE | Octavo de final 8 | OF | 21:00 | NRG Stadium, Houston |
| 11 JUL SÁB | Cuarto de final 1 | QF | 20:00 | Arrowhead, Kansas City |
| 12 JUL DOM | Cuarto de final 2 | QF | 20:00 | Mercedes-Benz, Atlanta |
| 13 JUL LUN | Cuarto de final 3 | QF | 20:00 | SoFi Stadium, Los Ángeles |
| 14 JUL MAR | Cuarto de final 4 | QF | 20:00 | MetLife, Nueva Jersey |
| 15 JUL MIÉ | Semifinal 1 | SF | 20:00 | Mercedes-Benz, Atlanta |
| 16 JUL JUE | Semifinal 2 | SF | 20:00 | AT&T Stadium, Dallas |
| 19 JUL DOM | Tercer puesto | 3° | 16:00 | Hard Rock, Miami |
| **19 JUL DOM** | **GRAN FINAL** | **F** | **20:00** | **MetLife Stadium, Nueva Jersey** |

---

## 07 — Efectos Visuales y Animaciones

| Efecto | Tecnología | Descripción |
|---|---|---|
| Entrada en hero | CSS + GSAP | Texto cae desde arriba con fade-in escalonado (stagger 0.1s) |
| Confetti de gol | Canvas API | Explosión al marcar gol — 200 partículas tricolores |
| Scoreboard flip | CSS 3D Transform | Números giran como tablero de aeropuerto clásico |
| Parallax estadio | Intersection Observer | El fondo se desplaza a 0.4× del scroll del usuario |
| Hover de bandera | CSS clip-path | Reveal con wipe diagonal al pasar el cursor |
| Carga de datos | Skeleton screens | Barras grises animadas mientras llegan los resultados |
| Gol live | Lottie Animation | Animación JSON vectorial: pelota + red + ovación |
| Dark / Light mode | CSS custom props | Transición suave de 300ms con prefers-color-scheme |
| Countdown | JS requestAnimFrame | Reloj regresivo flip cards días/horas/min/seg |
| Mapa interactivo | Mapbox GL JS | Zoom, click en estadio, popup con info del partido |

---

## 08 — Responsive Design & Breakpoints

| Dispositivo | Breakpoint | Grid | Comportamiento Clave |
|---|---|---|---|
| Mobile S | < 360px | 1 col | Stack total, menú hamburguesa, scoreboard compacto |
| Mobile M/L | 360–767px | 1–2 col | Cards apiladas, tablas con scroll horizontal |
| Tablet | 768–1023px | 2–3 col | Sidebar colapsable, fixture en grid 2 col |
| Desktop | 1024–1439px | 4–6 col | Layout completo, sidebar fijo, hover states activos |
| Wide / 4K | ≥ 1440px | 12 col | Max-width 1600px centrado, tipografía escalada |

```css
/* Breakpoints en Tailwind / CSS */
--bp-mobile:  360px;
--bp-tablet:  768px;
--bp-desktop: 1024px;
--bp-wide:    1440px;
--max-width:  1600px;
```

---

## 09 — Stack Tecnológico Recomendado

### Frontend Framework
- **Next.js 15** — SSR / ISR / App Router
- **React 19** — UI components
- **TypeScript** — tipado estricto
- **Tailwind CSS 4** — estilos utilitarios

### Animación
- **GSAP 3** — animaciones complejas y ScrollTrigger
- **Framer Motion** — transiciones de página y microinteracciones
- **Lottie Web** — animaciones JSON vectoriales (gol, confetti)
- **CSS @keyframes** — animaciones simples y shimmer effects

### Datos en Tiempo Real
- **WebSockets** — conexión bidireccional para eventos en vivo
- **Server-Sent Events** — alternativa unidireccional
- **Supabase Realtime** — base de datos reactiva
- **Socket.io** — rooms por partido, broadcast de eventos

### Mapas & Geo
- **Mapbox GL JS** — mapa interactivo de estadios
- **Leaflet.js** — alternativa open-source
- **Google Maps API** — Street View de estadios
- **Turf.js** — operaciones geoespaciales

### Gráficas & Stats
- **D3.js** — visualizaciones customizadas (heatmaps, xG)
- **Recharts** — gráficas React declarativas
- **Chart.js 4** — charts rápidos
- **Victory** — gráficas para React Native

### CMS & Backend
- **Sanity CMS** — contenido editorial (noticias, perfiles)
- **Prisma ORM** — queries tipadas
- **PostgreSQL** — base de datos principal
- **Vercel Edge** — deploy + Edge Functions

### Performance
- **Lighthouse CI** — auditoría automática en CI/CD
- **Core Web Vitals** — LCP < 2.5s, FID < 100ms, CLS < 0.1
- **next/image** — optimización automática de imágenes
- **ISR / SSG** — regeneración estática incremental

### Extras Premium
- **PWA / Service Worker** — instalable y offline
- **i18n (8 idiomas)** — next-intl / i18next
- **AR Bandera** — WebXR + filtro de cámara
- **Modo Estadio** — UI alto contraste para pantallas LED

---

## 10 — Extras Premium y Diferenciadores

### 🤖 Predictor IA
Modelo de ML entrenado con datos históricos de mundiales para predecir resultados. Interfaz conversacional con chatbot deportivo 24/7.

### 🏟️ Modo Estadio
UI especial con tipografía gigante y contrastes extremos optimizada para pantallas LED de estadios y zonas de fan con alta iluminación ambiental.

### 📱 Realidad Aumentada
Filtro de cámara con banderas y escudos de las 48 selecciones. Integración con Instagram y TikTok para contenido UGC viral.

### ⚽ Fantasy League
Selección de 11 jugadores con presupuesto virtual. Puntuación automática en tiempo real. Rankings semanales con premios digitales.

### ♿ Accesibilidad WCAG 2.2
Contraste AA/AAA garantizado, navegación completa por teclado, soporte de lectores de pantalla, subtítulos automáticos en videos.

### 📲 PWA & Offline
Instalable en móvil sin App Store. Funciona sin conexión mostrando el último estado del fixture. Push notifications de goles y resultados.

---

## 11 — API de Datos — football-data.org

La fuente de datos oficial para este proyecto es **football-data.org**, una API RESTful gratuita y confiable que provee información en tiempo real sobre fixtures, resultados, tablas de posiciones, planteles y estadísticas.

> 🔗 **Sitio oficial:** https://www.football-data.org  
> 📖 **Documentación:** https://docs.football-data.org  
> 🔑 **Registro gratuito:** https://www.football-data.org/client/register

### Endpoints Principales (API v4)

| Endpoint | Método | Descripción |
|---|---|---|
| `/v4/competitions/WC/matches` | GET | Todos los partidos del Mundial — fixture completo |
| `/v4/competitions/WC/standings` | GET | Tabla de posiciones por grupo en tiempo real |
| `/v4/competitions/WC/teams` | GET | Lista de las 48 selecciones clasificadas |
| `/v4/competitions/WC/scorers` | GET | Tabla de goleadores del torneo |
| `/v4/matches/{id}` | GET | Detalle completo de un partido por ID |
| `/v4/teams/{id}/matches` | GET | Historial y próximos partidos de un equipo |
| `/v4/teams/{id}` | GET | Plantel completo, escudo y datos del equipo |

### Planes y Precios

| Plan | Precio | Límite | Incluye |
|---|---|---|---|
| Free | Gratis | 10 req/min | Mundial + Top 6 ligas · Datos en vivo con delay |
| Standard | €10/mes | 60 req/min | Todas las competiciones · Sin delay |
| Pro | €30/mes | Ilimitado | Datos históricos + Lineups + Odds en vivo |

### Ejemplo de Integración

```javascript
const API_KEY  = 'TU_API_KEY_AQUI';
const BASE_URL = 'https://api.football-data.org/v4';

// Obtener todos los partidos del Mundial 2026
const response = await fetch(`${BASE_URL}/competitions/WC/matches`, {
  headers: { 'X-Auth-Token': API_KEY }
});
const data = await response.json();

// Obtener tabla de posiciones
const standings = await fetch(`${BASE_URL}/competitions/WC/standings`, {
  headers: { 'X-Auth-Token': API_KEY }
});
```

> **Nota:** El header requerido en cada request es `X-Auth-Token: {tu_token}`.

---

## 12 — Plataformas de Uso Ideal

| Plataforma | Aplicación Sugerida |
|---|---|
| Figma | Importar tokens de color y tipografía. Crear componentes y auto-layouts reutilizables. |
| Canva | Presentaciones comerciales, posts para redes sociales y propuestas visuales con la paleta oficial. |
| IA Generadora | Usar como prompt en Midjourney, DALL-E o Stable Diffusion para mockups automáticos. |
| Desarrollo Web | Configurar tokens CSS/SCSS, integrar el design system en Next.js. |
| Presentaciones | Base para decks en PowerPoint, Keynote o Google Slides. |
| Informes Técnicos | Documento de referencia para equipos de producto, QA, marketing y dirección ejecutiva. |

> Este documento es la base completa para construir la experiencia digital del Mundial 2026. Todos los apartados son extensibles y pueden adaptarse según las necesidades del equipo de producto. **¡Que empiece el juego!**

---

## 13 — Información de Jugadores con Rostros & Escudos de Equipos

### 👤 Perfiles de Jugadores

| Campo | API / Fuente |
|---|---|
| Foto oficial / rostro | TheSportsDB · `strCutout` |
| Nombre completo | `strPlayer` |
| Nacionalidad / bandera | `strNationality` + flag emoji |
| Posición en el campo | `strPosition` |
| Club actual | `strTeam` · escudo incluido |
| Número de camiseta | `intSquadNumber` |
| Altura / Peso | `strHeight` / `strWeight` |
| Goles en el torneo | Calculado en tiempo real |
| Asistencias | Calculado en tiempo real |
| Tarjetas amarillas / rojas | Acumulado por partido |
| Heatmap de posiciones | D3.js · canvas overlay |

### 🛡️ Escudos de los 48 Equipos

| Campo | Detalle |
|---|---|
| Fuente principal | football-data.org · `/v4/teams/{id}` |
| Campo crestUrl | URL directa al escudo SVG/PNG |
| Alternativa | TheSportsDB · `strTeamBadge` |
| Resolución mínima | 128 × 128 px (512px para hero) |
| Formato preferido | SVG vectorial — escala infinita |
| Lazy loading | IntersectionObserver + skeleton |
| Fallback | Emoji de bandera nacional |
| Cache | Service Worker · 7 días |
| Hover effect | CSS clip-path wipe diagonal |
| Fondo adaptativo | `mix-blend-mode: multiply` |

### 🔌 APIs para Jugadores & Escudos

| API | Endpoint | Dato Obtenido | Autenticación |
|---|---|---|---|
| football-data.org | `/v4/teams/{id}` | Escudo (crestUrl) + plantel | `X-Auth-Token` header |
| TheSportsDB | `/api/v1/json/3/searchplayers.php` | Foto recortada (strCutout) | API key gratis |
| fifa.balldontlie.io | `/players` | Stats globales del torneo | Bearer token |
| worldcup26.ir | `/api/players` | Información adicional del torneo | Sin auth (pública) |

### Implementación — Fetch Jugadores + Escudos

```javascript
const BASE   = 'https://api.football-data.org/v4';
const SPORTS = 'https://www.thesportsdb.com/api/v1/json/3';

async function getTeamData(teamId, teamName) {
  const [teamRes, playersRes] = await Promise.all([
    fetch(`${BASE}/teams/${teamId}`, { headers: { 'X-Auth-Token': API_KEY } }),
    fetch(`${SPORTS}/searchplayers.php?t=${encodeURIComponent(teamName)}`)
  ]);
  const team = await teamRes.json();    // crestUrl incluido
  const pl   = await playersRes.json(); // strCutout por jugador
  return { crest: team.crest, squad: pl.player };
}
```

### Hover & Display Specs

| Componente | Efecto CSS |
|---|---|
| Grid layout | `auto-fill · minmax(160px, 1fr) · gap 16px` |
| Card hover | `scale(1.05) + box-shadow 0 8px 24px rgba(200,146,42,.6)` |
| Foto entrada | `fade-in 0.4s + translateY(-8px)` al aparecer en viewport |
| Escudo hover | `clip-path wipe diagonal + brightness(1.2)` |
| Lazy load | `IntersectionObserver threshold 0.1` + skeleton shimmer |

---

## 14 — Estadios — Capacidad, Imágenes & Tour Virtual

### 🏟️ Los 16 Estadios Sede

| Estadio | Ciudad / País | Cap. | Superficie | Año |
|---|---|---|---|---|
| Estadio Azteca | Ciudad de México, MEX | 87,523 | Pasto nat. | 1966 |
| MetLife Stadium | Nueva Jersey, USA | 82,500 | FieldTurf | 2010 |
| AT&T Stadium | Arlington TX, USA | 80,000 | FieldTurf | 2009 |
| Arrowhead Stadium | Kansas City MO, USA | 76,416 | Pasto nat. | 1972 |
| NRG Stadium | Houston TX, USA | 72,220 | FieldTurf | 2002 |
| Mercedes-Benz Stadium | Atlanta GA, USA | 71,000 | FieldTurf | 2017 |
| SoFi Stadium | Los Ángeles CA, USA | 70,240 | FieldTurf | 2020 |
| Lincoln Financial Field | Philadelphia PA, USA | 69,796 | Pasto nat. | 2003 |
| Lumen Field | Seattle WA, USA | 69,000 | FieldTurf | 2002 |
| Levi's Stadium | Santa Clara CA, USA | 68,500 | FieldTurf | 2014 |
| Gillette Stadium | Boston MA, USA | 65,878 | FieldTurf | 2002 |
| Hard Rock Stadium | Miami FL, USA | 64,767 | Pasto nat. | 1987 |
| BC Place | Vancouver, CAN | 54,500 | Pasto art. | 1983 |
| Estadio BBVA | Monterrey, MEX | 51,348 | Pasto nat. | 2015 |
| Estadio Akron | Guadalajara, MEX | 46,232 | Pasto nat. | 2010 |
| BMO Field | Toronto, CAN | 45,736 | Pasto nat. | 2007 |

### 📷 Fuentes de Imágenes

- Getty Images API · licencia oficial FIFA
- Wikimedia Commons · CC-BY-SA libre
- TheSportsDB · `strStadiumThumb`
- Google Street View · API estática
- Imágenes aéreas · Mapbox Static Tiles

### 🔭 Tour Virtual 360°

- Motor: **A-Frame + WebXR API**
- Fotos 360°: **Matterport embed**
- Hotspots interactivos en asientos
- Vista desde el campo de juego
- Compatible con Google Cardboard / Meta Quest

### 🎨 Componentes de UI

- `StadiumCard` — foto + overlay degradado
- `CapacityMeter` — barra animada fill
- `MapPin` — Mapbox GL JS marker custom
- `GalleryModal` — lightbox con swipe
- `WeatherWidget` — temperatura en vivo

### Fetch Estadios — TheSportsDB + Mapbox

```javascript
// TheSportsDB — imágenes del estadio
const stadium = await fetch(
  `https://www.thesportsdb.com/api/v1/json/3/searchvenues.php?e=World_Cup_2026`
).then(r => r.json());
// strVenue, strStadiumThumb, strStadiumDescription, intCapacity

// Mapbox Static — imagen aérea del estadio
const lat = 40.8128, lng = -74.0742; // MetLife Stadium
const mapImg = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/
  ${lng},${lat},15,0/600x300@2x?access_token=${MAPBOX_TOKEN}`;
```

---

## 15 — Contador Regresivo & Animaciones Futboleras

### ⏱️ Countdown — 11 Junio 2026 · 16:00 ARG

```
┌──────┐  :  ┌───────┐  :  ┌─────┐  :  ┌─────┐
│  00  │     │  00   │     │ 00  │     │ 00  │
│ DÍAS │     │ HORAS │     │ MIN │     │ SEG │
└──────┘     └───────┘     └─────┘     └─────┘
```

- **Tecnología:** `requestAnimationFrame` + `Date.now()` — actualización cada 1 segundo
- **Flip effect:** CSS 3D `perspective` + `rotateX(90deg)` en transición superior/inferior
- **Fecha target:** `new Date('2026-06-11T19:00:00Z')` (UTC = 16:00 ARG / UTC-3)
- **Fallback:** Si el Mundial ya comenzó → mostrar scoreboard del partido en curso

```javascript
const TARGET = new Date('2026-06-11T19:00:00Z');

function updateCountdown() {
  const diff = TARGET - Date.now();
  if (diff <= 0) { showLiveScore(); return; }
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000)  / 60000);
  const secs  = Math.floor((diff % 60000)    / 1000);
  flipCard('days',  days);
  flipCard('hours', hours);
  flipCard('mins',  mins);
  flipCard('secs',  secs);
  requestAnimationFrame(updateCountdown);
}
updateCountdown();
```

### ⚽ Catálogo de Animaciones Futboleras

#### Confetti Gol — Canvas API
- 200 partículas tricolores al marcar
- Física: velocidad + gravedad + drag
- Colores: `#D10A11` / `#C8922A` / `#F5F0E8`
- Duración: 3s · `cubic-bezier`

#### Pelota Rebote — CSS @keyframes
- `translateY` + `scaleX` al aterrizar
- Sombra que crece/encoge
- Loop infinito en loading screens

#### Scoreboard Flip — CSS 3D Transform
- Perspectiva 800px en contenedor
- `rotateX(-90deg)` → `0deg` en 0.4s
- Efecto tablero aeropuerto
- Trigger: WebSocket evento gol

#### Lottie Ovación — Lottie Web
- JSON vectorial < 50 KB
- Animación: pelota + red + estadio
- Autoplay al recibir evento gol

#### Entrada Hero — GSAP 3
- Texto: `from top -100px, opacity 0`
- `stagger: 0.1s` entre líneas
- `ScrollTrigger` en secciones

#### Parallax Estadio — Intersection Observer
- `backgroundPositionY` a 0.4× scroll
- `requestAnimationFrame` throttle
- `transform: translateY(offset)`

### 🖱️ Hover States — Animaciones al Pasar el Cursor

| Componente | Efecto |
|---|---|
| Flag Card | `clip-path` polygon wipe diagonal 300ms ease-in-out · escudo reveal |
| Player Card | `scale(1.06)` + `drop-shadow(0 8px 24px rgba(200,146,42,.6))` |
| Match Row | `background → #1B3A6B` · `translateX(4px)` · `border-left 3px #D10A11` |
| Stadium Thumb | `brightness(1.3)` + `saturate(1.2)` + overlay degradado dorado 40% |
| CTA Button | shimmer 200% `linear-gradient` + `box-shadow 0 0 20px #C8922A` |
| Nav Link | `::after` pseudo · `width 0 → 100%` · `border-bottom 2px #D10A11` 0.2s |
| Score Badge | `rotateY(180deg)` 0.5s — revela goleador al reverso |
| Group Table Row | `background rgba(27,58,107,.8)` · `translateX(6px)` |
| Stat Bar | fill animate width con spring · tooltip `fade-in 0.15s` |
| Crest Logo | `drop-shadow(0 0 8px #C8922A)` · `rotate(±5deg)` wiggle |

### CSS — Animaciones Clave

```css
/* Player Card hover */
.player-card {
  transition: transform .3s cubic-bezier(.34, 1.56, .64, 1), box-shadow .3s;
}
.player-card:hover {
  transform: scale(1.06);
  box-shadow: 0 8px 24px rgba(200, 146, 42, .55);
}

/* Flag wipe reveal */
.flag-wrap {
  clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
  transition: clip-path .35s ease;
}
.flag-wrap:hover {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

/* Shimmer CTA button */
.btn-cta {
  background: linear-gradient(90deg, #C8922A 0%, #E5B857 50%, #C8922A 100%);
  background-size: 200%;
  animation: shimmer 2s infinite;
}
@keyframes shimmer {
  0%   { background-position: 200%; }
  100% { background-position: -200%; }
}
```

---

## 16 — Datos en Tiempo Real · Minuto a Minuto

### 📺 Componente Scoreboard — Vista en Vivo

```
🔴 LIVE  67'  MetLife Stadium, Nueva Jersey
─────────────────────────────────────────────
   ARG          2  -  1          FRA
 Argentina                    Francia
⚽ Messi 23' · Álvarez 61'    ⚽ Mbappé 45'
```

### 🔧 Arquitectura de Datos en Tiempo Real

#### Fuente de Datos
- `football-data.org /v4/matches/{id}`
- Polling cada 30s (plan Free)
- WebSocket (plan Standard+)
- Server-Sent Events alternativo
- `fifa.balldontlie.io /live-matches`

#### Backend / Broker
- **Supabase Realtime** (PostgreSQL)
- **Socket.io** room por partido
- **Redis Pub/Sub** para eventos gol
- Edge Function en Vercel
- Retry con exponential backoff

#### Frontend Consumer
- `useWebSocket()` hook custom
- React Context → `LiveMatchCtx`
- Optimistic UI en marcador
- Lottie trigger en evento gol
- Push Notification API (PWA)

### 📋 Estructura del Timeline Minuto a Minuto

```
90+3' ⛔  Fin del partido — Argentina 2 - 1 Francia
  90' 📋  Sustitución ARG: Dybala → De Paul
  67' 📋  Sustitución ARG: Mac Allister → Lo Celso
  61' ⚽  GOL — Julián Álvarez  →  ARG 2 - 1 FRA
  45' ⚽  GOL — Kylian Mbappé (pen.)  →  ARG 1 - 1 FRA
  42' 🟥  Expulsión — Upamecano (FRA) · doble amarilla
  38' 🟨  Amarilla — Rodrigo De Paul (ARG)
  23' ⚽  GOL — Lionel Messi  →  ARG 1 - 0 FRA
   1' 🏁  Inicio del partido — MetLife Stadium
```

### Estadísticas en Vivo

| Stat | ARG | FRA |
|---|---|---|
| Posesión | 62% | 38% |
| Remates | 14 | 8 |
| Córners | 6 | 3 |
| Faltas | 9 | 14 |

### Hook — WebSocket Actualización en Tiempo Real

```javascript
// hooks/useLiveMatch.js
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export function useLiveMatch(matchId) {
  const [match,  setMatch]  = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL);
    socket.emit('join-match', matchId);

    socket.on('match-update', (data) => setMatch(data));
    socket.on('match-event',  (evt)  => {
      setEvents(prev => [evt, ...prev]);
      if (evt.type === 'GOAL') triggerConfetti(); // Canvas API
    });

    return () => socket.disconnect();
  }, [matchId]);

  return { match, events };
}
```

### Configuración del Servidor (Socket.io + Redis)

```javascript
// server/matchSocket.js
import { Server } from 'socket.io';
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

io.on('connection', (socket) => {
  socket.on('join-match', (matchId) => {
    socket.join(`match:${matchId}`);
  });
});

// Subscriber para eventos de gol
const sub = redis.duplicate();
await sub.subscribe('match-events', (message) => {
  const event = JSON.parse(message);
  io.to(`match:${event.matchId}`).emit('match-event', event);
});
```

---

## 🔗 Recursos y APIs Adicionales

| API | URL | Descripción |
|---|---|---|
| FIFA Ball Don't Lie API | https://fifa.balldontlie.io | API oficial con datos en tiempo real del Mundial 2026 |
| WorldCup26.ir | https://worldcup26.ir/?lang=en | Portal informativo completo sobre el Mundial 2026 |
| TheSportsDB | https://www.thesportsdb.com | Base de datos deportiva con estadísticas y medios del torneo |
| football-data.org | https://www.football-data.org | API RESTful principal — fixture, standings, scorers |
| Mapbox GL JS | https://docs.mapbox.com/mapbox-gl-js | Mapas interactivos de estadios y sedes |

---

*© 2026 FIFA World Cup Design System | Confidencial | Pág. 18 de 18*
