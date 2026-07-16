# CLAUDE.md — Frutería Alicia Order System

## Who you're working for

Cannon — real estate broker and small-business builder in Mazatlán, Sinaloa. He is
non-technical on the code side and will NOT be reading diffs; his agent (Hermes)
orchestrates you, verifies your output, and wires backend logic behind your designs.
Cannon's #1 requirement, in his own words: **STABILITY.** His customers must never
hit a broken page. Simple and elegant beats clever and fancy, every time.

## What this project is

A WhatsApp-based ordering system for two small stores:

| Store | Catalog size | Language | Currency |
|---|---|---|---|
| Frutería Alicia (Mazatlán, MX) | up to 200 products | Spanish-first, EN toggle | MXN $ |
| Marli's Salsa (US) — future clone | 30-50 products, usually less | English-first, ES toggle | USD $ |

Customers open a web page, tap products, and hit "Enviar Pedido" — which opens
WhatsApp with the order pre-written, sent to the store's number. No accounts, no
payment processing, no server. Cash-first by design.

## Architecture (decided, not up for debate)

- **Static site only.** GitHub Pages hosting. No servers, no databases, no build
  step, no frameworks. Every page is one self-contained HTML file with vanilla
  CSS/JS. This is a stability decision made after painful experience with
  locally-hosted processes.
- **`products.json` is the single source of truth** for the catalog. The customer
  form fetches it at load and shows only items with `"active": true`.
- **The admin panel (your current job) edits that same file** — the owner's edits
  are committed back to this GitHub repo (Hermes wires that part; you build the UI).

## Files

| File | What it is | May you edit it? |
|---|---|---|
| `index.html` | Customer order form. YOUR earlier design — visual reference for everything new | **NO** — read-only reference |
| `products.json` | Catalog data contract | **NO** — read to understand the schema |
| `docs/admin-panel-spec.md` | **Full spec for the admin panel — READ THIS FIRST** | No |
| `admin.html` | The store-owner admin panel | **YES — this is what you create** |
| `og-image.png` | WhatsApp link preview image | No |

## Your job

Build `admin.html` exactly per `docs/admin-panel-spec.md`. Summary: a phone-first,
PIN-gated, single-file admin panel where the store owner (non-technical,
Spanish-speaking, uses her thumb) can:

1. Toggle product availability on/off — the most-used control, make it BIG
2. Add / edit / delete products (name ES+EN, emoji, category, price)
3. Choose unit type per product: **Por kilo / Por pieza / Precio fijo**
4. Publish all pending changes with one button (with clear pending/success/failure
   states — failure must NEVER lose her changes)
5. Restore the previous published version (one safety-net menu item)

## Hard rules

1. **One file.** All CSS and JS inline in `admin.html`. No CDNs, no fonts fetched
   from anywhere, no libraries. It must work when GitHub Pages is the only thing alive.
2. **Visual sibling of `index.html`.** Reuse its `:root` palette, card style,
   radii, and typography feel. The two pages must look like family.
3. **Leave the backend as clearly named stubs** — Hermes wires them after you:
   `loadCatalog()`, `publishChanges(changes)`, `restorePrevious()`, `verifyPin(pin)`.
   Build ALL UI states they need (loading / success / failure / empty / retry),
   driven by mock data so every state is demonstrable in a browser today.
4. **Bilingual from birth.** All strings in a `T = {es:{...}, en:{...}}` dictionary,
   ES default, same corner toggle pattern as `index.html`.
5. **Touch targets ≥48px, availability toggles ≥56px.** Owner is older; thumbs, not cursors.
6. **No `alert()`/`confirm()`/`prompt()`.** Inline validation and styled dialogs only.
7. **200 products must scroll and search smoothly** on a mid-range phone.
   Accent-insensitive search ("platano" finds "Plátano").
8. **Do not touch any file except `admin.html`.** If you believe another file must
   change, STOP and write your reasoning to `docs/claude-notes.md` instead.

## Definition of done

- `admin.html` opens directly in a browser (file:// or localhost) and every screen
  and state from the spec is reachable using mock data
- All acceptance-checklist items in the spec that are UI-only pass
- Zero console errors
- The stubs are empty, documented, and the ONLY places Hermes needs to touch

## Context for judgment calls

- Owner's mental model: WhatsApp and a paper notebook. When in doubt, simpler.
- The panel will be used at 6am while opening the store — calm colors, obvious states.
- If the spec is silent on something, prefer whatever `index.html` already does.
