# order-form-spec.md — the customer order form, coordinated

## The goal

The customer taps products on their phone and sends the order by WhatsApp — and the **same order can be
read by the store's own system without guessing**. Everything downstream (the order database, the picker
screen) needs an exact machine-readable order, not Spanish prose a model has to interpret.

## Work on a copy

    cp index.html pedido.html

Everything below applies to **`pedido.html`**. Do not touch `index.html` — it is live and stays live
until Cannon swaps it. Do not redesign it: keep the existing look, colours, layout, tabs, scroll-spy,
steppers and details form, and change only what this spec asks for.

## Must fix — correctness

1. **Wrong store name.** The WhatsApp message header says `Fruteria la Perla`. The store is
   **Fruteria Alicia**. Fix every occurrence, in both languages.
2. **Money in integer cents.** Every price is held as an integer number of cents and formatted by one
   helper (`cents → $45.00`). No float arithmetic on money anywhere. `products.json` holds pesos —
   convert once at load with `Math.round(price * 100)`.
3. **No `alert()`.** The current form validates name and phone with a browser alert. Replace it with
   inline styled validation: the field outlined in the error colour and a short message beneath it, the
   way `picker.html` does it. No `alert`, `confirm` or `prompt` anywhere.

## Coordination with the rest of the system

4. **The WhatsApp message carries a machine-readable block** on one single line, after the
   human-readable order and a blank line:

       --PEDIDO--
       {"v":1,"code":"FAL-20261011-1842-7C3","ts":"2026-10-11T18:42:11-07:00","cur":"MXN","lines":[{"n":"Manzana Roja","u":"kg","qty":2,"cents":4500}],"total_cents":9000,"pay":"cash","cust":{"name":"…","phone":"…","addr":"…","notes":"…"}}

   - `n` — the product name in **Spanish, exactly as written in `products.json`**
   - `u` — `kg` or `pza`, the catalogue's vocabulary (never `kilo` or `pieza`)
   - `qty` — a number; fractional is allowed for `kg`
   - `cents` — the unit price in cents, snapshotted at order time
   - `code` — `FAL-<YYYYMMDD>-<HHMM>-<4 hex characters>`, generated once per order
   - `pay` — `cash` or `card`
   - The whole JSON object must be one line, valid for `JSON.parse`, and `total_cents` must equal the
     sum of `qty × cents` over the lines, to the cent.

5. **Show the customer their order code** on the page after they press send, so they can quote it (the
   confirmation area, not an alert).

## Behaviour — the same repairs the picker already got

6. **The cart survives a reload** — persist the product ids and quantities to `localStorage` under
   `pedido_cart`, restore them on load, and clear them once the order is sent.
7. **The language choice survives a reload** — `localStorage` key `pedido_lang`. Today it is forgotten.

## Keep exactly as it is

Category tabs with scroll-spy; per-product steppers and typed quantities (kg in 0.5 steps, pieces in
whole numbers); the sticky total bar with item count; the details form (name, phone, address, notes,
cash/card); Spanish first with the EN toggle; the WhatsApp deep link to the shop number; one
self-contained file.

## Hard rules

One file. **The only permitted network request is the same-origin fetch of `products.json`** — the
catalogue is the single source of truth, keep the existing load-error and retry behaviour. No CDN, no
fonts, no libraries, no other request of any kind. Touch targets ≥48px. Styled dialogs only. Spanish
default, English toggle. Zero console errors.

## Definition of done

- the catalogue, cart, total, details form and WhatsApp link all work
- the message ends with one single-line `--PEDIDO--` block that `JSON.parse` accepts, whose
  `total_cents` equals the line arithmetic exactly
- the store name reads Fruteria Alicia everywhere; no `alert`/`confirm`/`prompt` anywhere
- a reload keeps both the cart and the chosen language
- only `pedido.html` is created; `index.html`, `picker.html` and `products.json` are untouched
- judgement calls go in `docs/agy-notes.md`
