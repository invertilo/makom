![Makom — Where there is kosher](docs/assets/banner.png)

<p align="center">
  <strong>מקום</strong> · Atlas comunitario de lugares kosher y kehilot<br/>
  <em>A scalable community atlas — built to grow, and kept improving.</em>
</p>

<p align="center">
  <a href="#english">English</a> ·
  <a href="#español">Español</a> ·
  <a href="#stack--start">Stack</a> ·
  <a href="#roadmap">Roadmap</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MapLibre-GL-4264FB?style=for-the-badge&logo=mapbox&logoColor=white" alt="MapLibre" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/i18n-17_locales-0B5F58?style=for-the-badge" alt="17 locales" />
  <img src="https://img.shields.io/badge/author-invertilo-111?style=for-the-badge&logo=github" alt="Author invertilo" />
</p>

---

> [!IMPORTANT]
> **EN:** Makom maps places and community reports. It does **not** issue a hechsher or pasken.  
> **ES:** Makom muestra lugares y reportes comunitarios. **No** otorga hechsher ni pasken.

---

## At a glance · De un vistazo

<table>
<tr>
<td width="33%" valign="top">

### Map-first
MapLibre atlas with clusters, near-me, and filters for **Eat · Shop · Kehilla · Tefilla**.

</td>
<td width="33%" valign="top">

### Stock / Sucursal
Wine, matzah, meat, cheese… reported **per branch**, with a 14-day freshness window.

</td>
<td width="33%" valign="top">

### Trust / Confianza
Certified · reported · disputed · unknown · closed — never color alone. Moderator queue.

</td>
</tr>
<tr>
<td width="33%" valign="top">

### Kehilot & tefillá
Synagogues with nusach & stream · community size with source + year.

</td>
<td width="33%" valign="top">

### Local threads
Conversation tied to a **place** or a **city** — no global chat.

</td>
<td width="33%" valign="top">

### Shabbat mode
Opt-in read-only from candle lighting to nightfall · PWA-ready shell.

</td>
</tr>
</table>

```text
 ┌────────────┐    ┌─────────────┐    ┌──────────────────┐
 │  MapLibre  │───▶│ Place sheet │───▶│ Stock · Thread   │
 │  clusters  │    │ status line │    │ suggest edit     │
 └────────────┘    └─────────────┘    └──────────────────┘
        │                                     │
        ▼                                     ▼
 ┌────────────┐                       ┌──────────────────┐
 │  Kehillot  │                       │ Moderation queue │
 │  + nusach  │                       │ (scales with use)│
 └────────────┘                       └──────────────────┘
```

---

<a id="english"></a>

# English

### Why Makom

| You need… | Makom gives you… |
|:----------|:-----------------|
| Kosher food abroad | Interactive map + search by city, agency, type |
| The right supermarket aisle | Stock **per branch** (a chain ≠ one kosher kitchen) |
| A minyan | Synagogues with nusach, denomination, stream, times |
| Cleaner data | Suggest edits → moderator queue |
| Local talk | Threads scoped to place or city |

### Features

- **Map-first atlas** — Positron basemap, clustering, near-me, layer filters
- **Kashrut status lines** — Certified · community report · disputed · unknown · closed
- **Branch stock** — wine, matzah, meat, cheese… with freshness window
- **Kehillot layer** — population estimates with cited source + year
- **Synagogues & judaica** — Ashkenaz, Sefarad, Chabad… · Modern / Yeshivish / Hasidic…
- **Community threads** — rate-limited, reportable, place- or city-scoped
- **Shabbat mode** — opt-in read-only window
- **i18n + RTL** — en · he · es · pt · fr · de · ru (+ yi, ar, it, nl, hu, fa, tr, uk, pl, am)
- **PWA shell** — manifest + service worker

### Built to scale — planned to keep improving

Makom is a **product architecture**, not a throwaway demo.

| Pillar | Today | Next |
|:-------|:------|:-----|
| Domain | Places, branches, stock, kehillot, queue | Live writes at city scale |
| Data | In-memory seed + PostGIS schema | Supabase Auth + PostGIS |
| Locales | 17 catalogs, RTL routing | Phase-2 polish (Yiddish first) |
| Trust | Status lines + edit suggestions | Agency / local moderator roles |
| Coverage | Seed + OSM helper | City-by-city expansion |

We intend to **keep shipping improvements**: map UX, live database, agency workflows, locale quality, and geographic coverage.

---

<a id="español"></a>

# Español

### Por qué Makom

| Necesitás… | Makom te da… |
|:-----------|:-------------|
| Kosher en el extranjero | Mapa interactivo + búsqueda por ciudad, agencia, tipo |
| La sucursal correcta | Stock **por sucursal** (una cadena ≠ una cocina kosher) |
| Un minyán | Sinagogas con nusaj, denominación, corriente, horarios |
| Datos más limpios | Sugerir ediciones → cola de moderación |
| Hablar en local | Hilos por lugar o por ciudad |

### Funciones

- **Atlas centrado en el mapa** — estilo Positron, clusters, cerca de mí, filtros por capa
- **Estados de kashrut** — Certificado · reporte comunitario · en disputa · desconocido · cerrado
- **Stock por sucursal** — vino, matzá, carne, queso… con ventana de vigencia
- **Capa de kehilot** — estimaciones con fuente citada + año
- **Sinagogas y judaica** — nusaj y corrientes
- **Hilos comunitarios** — con límite de ritmo, reportables, atados a lugar o ciudad
- **Modo Shabat** — solo lectura opt-in
- **i18n + RTL** — en · he · es · pt · fr · de · ru (+ más)
- **Cáscara PWA** — manifest + service worker

### Escalable — y pensado para seguir mejorando

Makom es una **arquitectura de producto**, no un demo descartable.

| Pilar | Hoy | Después |
|:------|:----|:--------|
| Dominio | Lugares, sucursales, stock, kehilot, cola | Escrituras en vivo a escala ciudad |
| Datos | Semilla en memoria + esquema PostGIS | Auth + PostGIS (Supabase) |
| Idiomas | 17 catálogos, rutas RTL | Pulido fase 2 (prioridad yiddish) |
| Confianza | Líneas de estado + sugerencias | Roles de agencia / moderadores locales |
| Cobertura | Semilla + helper OSM | Expansión ciudad a ciudad |

**Se piensa mejorar de forma continua**: mapa, base de datos en vivo, flujos de agencias, calidad de idiomas y cobertura geográfica.

---

<a id="stack--start"></a>

## Stack & start

```text
Next.js 16 (App Router) · TypeScript · Tailwind CSS 4
next-intl · MapLibre GL · shadcn/ui
Supabase / PostGIS schema ready  ·  seed in-memory for now
```

Design → [`DESIGN.md`](./DESIGN.md) · SQL → [`supabase/migrations/001_init.sql`](./supabase/migrations/001_init.sql)

### Quick start · Inicio rápido

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) (`/en` by default).

```bash
pnpm build       # production
pnpm lint
pnpm osm:seed    # OSM → scripts/osm-seed.json
```

<details>
<summary><strong>Environment · Variables</strong> (optional)</summary>

<br/>

Copy `.env.example` → `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_MAP_STYLE=https://tiles.openfreemap.org/styles/positron
```

</details>

### Layout

```text
src/
├── app/[locale]/      Landing · map · communities · suggest · moderation · account
├── components/        Map · place sheet · chat · auth · layout · ui
├── i18n/              Routing + next-intl
├── messages/          Locale catalogs
└── lib/data/          Seed + in-memory store
supabase/              PostGIS migration
scripts/               OSM Overpass seed helper
docs/assets/           README banner (PNG)
```

| Command | Purpose |
|:--------|:--------|
| `pnpm dev` | Local development |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | ESLint |
| `pnpm osm:seed` | Pull OSM tags → `scripts/osm-seed.json` |

---

<a id="roadmap"></a>

## Roadmap · Hoja de ruta

```text
[████████████████████░░░░]  foundation shipped

 ✔ Map, search, place sheets, seed
 ✔ Stock reports, edit queue, threads
 ✔ Shabbat mode, i18n, PWA shell
 □ Live Supabase Auth + PostGIS
 □ Agency / local moderator roles
 □ Broader coverage + locale polish
```

### Principles · Principios

1. **Label the source** — agency certification ≠ a passerby’s aisle note.  
2. **Stock is per branch** — chains are not restaurants.  
3. **Disputes stay open** — the app does not pick a winner.  
4. **Filters narrow** — they don’t hide unlabeled truth.  
5. **No global chat** — conversation stays tied to place or city.

---

<p align="center">
  <strong>Makom</strong> (מקום)<br/>
  <sub>Where there is kosher · Donde hay kosher</sub><br/><br/>
  Author · Autor — <a href="https://github.com/invertilo"><strong>@invertilo</strong></a>
  ·
  <a href="https://github.com/invertilo/makom">github.com/invertilo/makom</a>
</p>

<p align="center">
  <sub>Private / all rights reserved unless otherwise stated by the repository owner.</sub>
</p>
