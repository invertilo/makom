# Makom design system

<!-- Adapted craft from Mercav; own visual world. -->

World: **sello de hechsher sobre atlas de calle**. The craft of Mercav (framed signs, plates, rules, display type, one motion moment) applied to a kosher community atlas. Palette is seal teal on map paper — never Mercav gold-on-black.

## Principles

1. Seal is stamp, not light. Solid plates, 1px rules, lettering. No glows or gradient text.
2. Structure from rules and signs, not cards. `.sign` is the container.
3. Real counts from seed/data only. No invented metrics.
4. One motion moment per surface (landing Text Morph). Map chrome stays quiet.
5. Blur only on floating chrome (header, bottom nav), never on content panels.
6. Icons from Lucide / SVG pins — no emoji.

## Tokens

| Role | Value | Use |
| --- | --- | --- |
| Page | `#FAF9F6` | Atlas paper |
| Panel | `#FFFFFF` | Signs |
| Inset | `#F0EDE6` | Fields |
| Seal | `#0B5F58` / ink `#084A44` | Plates, rules, pins |
| Reported | `#9A5B12` | Community reports |
| Ink | `#1A1714` / `#4A453C` / `#6E685C` | Text ranks |

Type: Rubik (display + body, Hebrew-capable), DM Mono (counts, agencies).

## Components

`Sign`, `Plate`, `Rule`, `PageHeader`, `BottomNav`, map listing rows, SVG `MapPinMarker`.

## Do not

Copy Mercav gold/black. Eyebrows. Pill clusters. Emoji icons. Glow shadows.
