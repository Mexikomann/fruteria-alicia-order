# Admin Panel Design Spec — "Mi Tienda" Store Owner Backend
### For Claude: design brief | For Hermes: wiring contract
Version 1.0 — 2026-07-16 — Status: DRAFT, pending Cannon approval

---

## 1. What this is

A single-page, phone-first admin panel (`admin.html`) where a non-technical store owner manages their product catalog. It is the owner-side companion to the existing customer order form (`index.html`, designed by Claude — its look/feel is the visual reference).

Two deployments of the SAME build:
| Store | Products | Primary language | Currency |
|---|---|---|---|
| Frutería Alicia (Mazatlán) | up to 200 | Spanish (EN toggle) | MXN $ |
| Marli's Salsa (US) | 30-50, usually less | English (ES toggle) | USD $ |

Store-specific values (name, WhatsApp number, colors) are read from data/config — never hardcoded in markup.

## 2. The user

The store owner: middle-aged or older, uses WhatsApp daily, has never used an "admin dashboard." Spanish-first for Alicia. Everything must be answerable with a glance and doable with a thumb. If a feature needs explaining, it's designed wrong.

## 3. Architecture (already decided — do not change)

- No servers. Static page hosted on GitHub Pages in the same repo as the order form.
- Single source of truth: `products.json`. The customer form reads it; this panel writes it.
- Publishing = the panel commits `products.json` back to the GitHub repo (Hermes wires this; design just needs the states).
- Changes appear on the customer form ~1 minute after publish.

## 4. Product data model (fixed contract)

```json
{
  "cat": "frutas",          // category id
  "es": "Papaya",           // Spanish name
  "en": "Papaya",           // English name
  "emoji": "🫐",            // display emoji
  "unit": "kg" | "pza" | "fijo",  // by weight | by piece | fixed-price item
  "price": 35,              // per kg / per piece / per item
  "active": true            // false = hidden from customer form
}
```

`fijo` (fixed price) is for bottled/packaged goods — a bottle of ketchup, a jar of hot sauce. Behaves like `pza` for quantities (whole numbers) but displays as "precio fijo / fixed price."

## 5. Screens & flows (design these)

### 5.1 Unlock screen
- Store name + logo emoji, one PIN field (4-6 digits), big "Entrar" button.
- Friendly error on wrong PIN. Nothing else. (PIN is a local gate; Hermes wires it.)

### 5.2 Main screen — the product list
- Header: store name + "Panel de productos", count badge "42 activos / 50".
- Search box: filters as you type (accent-insensitive).
- Category filter chips (horizontal scroll): Todas | Frutas | Verduras | ...  Categories come from the data, not hardcoded.
- Product rows (the heart of the design). Each row, thumb-height (≥60px):
  - emoji · name (ES) · price + unit chip ("$35/kg", "$18/pza", "$18 fijo")
  - BIG availability toggle at the right — the most-used control in the app. ON = green/visible, OFF = gray/hidden. Instant visual state change.
  - Tap anywhere else on the row → opens Edit sheet.
- Floating "+" button (bottom right) → Add sheet.
- Inactive products remain visible in the list, dimmed, with toggle OFF.

### 5.3 Edit / Add sheet (bottom sheet or full-screen modal)
Fields, in order:
1. Emoji picker (simple: text field with emoji keyboard hint + 12 common suggestions)
2. Nombre (ES) — required
3. Name (EN) — auto-suggested = ES value if left empty
4. Categoría — chips of existing categories
5. Unidad — 3-way segmented control: **Por kilo / Por pieza / Precio fijo**
6. Precio — big numeric field with currency prefix
7. Buttons: "Guardar" (primary, full width) · "Eliminar producto" (Edit mode only, red text link → confirm dialog "¿Eliminar Papaya? Esta acción no se puede deshacer." with Cancelar/Eliminar)

Validation (inline, friendly): price > 0, ES name required. Never a browser alert().

### 5.4 Publish flow (critical to get right)
- Any change (toggle, edit, add, delete) is LOCAL first. A sticky bottom bar slides up:
  "3 cambios sin publicar — [Publicar ahora]"
- Tap Publicar → spinner state → success state: "✓ Publicado. Visible para clientes en ~1 minuto." → bar slides away.
- Failure state: "No se pudo publicar. Tus cambios están guardados aquí. [Reintentar]" — calm, never alarming, changes never lost.
- Unpublished changes survive closing the page (draft kept locally — Hermes wires localStorage).

### 5.5 Safety net
- Overflow menu (⋮) with exactly one item: "Restaurar versión anterior" → confirm → restores the previous published catalog. (Hermes wires via git history.)

## 6. Design language

- Match the customer form's existing visual family: same green (#2e7d32 family), same friendly rounded cards, same typography feel. The two pages should feel like siblings.
- Phone-first (360px), works up to tablet. Big touch targets (≥48px, toggles ≥56px).
- Bilingual: ES default, EN via the same corner toggle as the customer form. All strings in a T{} dictionary.
- No frameworks. One HTML file, vanilla CSS + JS, works offline once loaded (except publish).
- Cheerful but calm. This is a tool the owner uses at 6am while opening the store.

## 7. What Claude does NOT need to build (Hermes wires after design)

- GitHub API calls (load latest products.json + sha, commit on publish, conflict re-check)
- PIN verification logic and token storage
- localStorage draft persistence
- The restore-previous-version mechanics
Claude should leave clearly named empty function stubs: `loadCatalog()`, `publishChanges(changes)`, `restorePrevious()`, `verifyPin(pin)` — and build all UI states (loading / success / failure / empty) so wiring is drop-in.

## 8. Acceptance checklist (Hermes verifies before pilot)

- [ ] Owner can toggle any product off and it disappears from the live customer form after publish
- [ ] Add product with each of the 3 unit types → renders correctly on customer form
- [ ] Delete requires confirm; deleted item gone from both panel and form
- [ ] Price edit reflects on customer form after publish
- [ ] Unpublished changes survive page close/reopen
- [ ] Wrong PIN cannot reach the panel
- [ ] Publish failure path: changes retained, retry works
- [ ] Works on a 360px phone screen with thumb only
- [ ] All flows work in both ES and EN
- [ ] 200-product catalog scrolls and searches smoothly on a mid-range phone
