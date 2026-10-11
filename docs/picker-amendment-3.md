# picker-amendment-3.md — the language switch

Reported from a phone: *"the language switch between English and Spanish does not work."*

What I measured on the live page: the toggle **does** flip the interface strings — `Listo → Done`,
`Efectivo → Cash`, `artículos → items`, `hace 12 min → 12 min ago`, and it flips back again. Two real
gaps remain, and they are exactly why it reads as broken:

1. **Product names never translate.** Every line keeps its Spanish name in English mode — "Manzana
   Roja", "Piña", "Tortillas de Harina" — including substitute names. The catalogue carries both
   names per product; the picker only ever renders the Spanish one. The order line itself carries only
   the Spanish snapshot (the store database stores a single `name`), so the English name has to come
   from the **catalogue**.
2. **The choice is thrown away on every reload.** `LANG` is a plain variable (`let LANG = "es"`), so
   reopening the link, reloading, or coming back from another app resets the screen to Spanish. A
   language choice is a preference; it should stick.

## Required changes — `picker.html` only

**A. Remember the choice.** Persist it in `localStorage` under the key `picker_lang`, read it at
start-up (wrapped in `try/catch` — storage can be unavailable), and write it every time the toggle is
used. Spanish stays the default for a first visit.

**B. Translate product names from the catalogue.**

- Extend the catalogue item contract to `{ name, name_en, unit, price_cents, emoji, cat }`.
- Give every `MOCK_CATALOG` entry a `name_en`, and add the products the mock orders use that are
  missing from it — `Manzana Roja`, `Jitomate`, `Queso Fresco`, `Huevo San Juan`, `Cebolla Blanca` —
  so every mocked line can translate. The English names must match `products.json` exactly.
- Build a Spanish→English map wherever the catalogue arrives, and at start-up from `MOCK_CATALOG`
  when `USE_MOCK` is true. Match accent- and case-insensitively (reuse the existing normaliser).
- Add **one** display helper and use it at every place a product name is printed: the packing card,
  the three dialog titles (quantity, no-hay, note), the summary rows, the substitute search rows and
  the chosen substitute. It returns the English name when the language is English and a match exists,
  and the Spanish name unchanged otherwise.

**C. Leave alone:** the delivery address, the customer name, the product emoji (an address is literal
and an emoji has no language), and everything about money.

## Definition of done

- In English mode every product name on every screen is English — `Manzana Roja → Red Apple`,
  `Piña → Pineapple`, `Tortillas de Harina → Flour Tortillas`, `Mango Ataulfo → Ataulfo Mango`; in
  Spanish mode they are Spanish, exactly as today.
- The choice survives a reload.
- The checks in `verify-picker.py` still pass with the totals **unchanged** (order 1042 = **$337.30**,
  order 1043 = **$229.00**, tap-replace = **$219.00**). **Do not run any test or verification script
  yourself** — Hermes runs them after you finish.
- One self-contained file, no external request of any kind, zero console errors.
- Only `picker.html` changed; put any judgement call in `docs/agy-notes.md`.
