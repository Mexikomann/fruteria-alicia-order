# picker-spec.md — Picker app (the employee's packing screen)

## Who uses it, and how

An employee at the store — the *picker* — opens a link on their phone. The link arrives by
WhatsApp and looks like:

    https://mexikomann.github.io/fruteria-alicia-order/picker.html?order=1042

They pack the order, tick items off, correct weights, flag what is missing, and finish with
**Listo para facturar**. Used standing up, one-handed, in daylight, sometimes with wet hands.
Older user: big targets, calm colours, no cleverness.

## Deliverable

ONE new file: `picker.html`. Self-contained (inline CSS + JS). Nothing else may be touched.
If something in this spec looks wrong, write your reasoning to `docs/picker-notes.md` and
still deliver the file.

## Screens

### A. Inbox — pending orders (default when no `?order=`)

- Title: "Pedidos por surtir"
- One card per pending order, >=72px tall: `#1042 · María García`, `6 artículos · hace 12 min`,
  payment badge `Efectivo` / `Tarjeta`
- Tap a card -> open that order (screen B)
- Empty: "No hay pedidos pendientes" + a small refresh button
- Loading: two skeleton cards. Error: "No se pudieron cargar los pedidos" + `Reintentar`

### B. Packing an order

Sticky header, always visible: `#1042`, customer name, a tap-to-call `📞`, the address
(2 lines max, tap to expand), order age, payment badge.

Item list — one card per line, each card >=96px:

- left: emoji (large) + product name in Spanish + requested qty + unit
- actions, each >=48px tall, always visible, labelled in Spanish:
  - `✓ Listo`
  - `⚖ Cambiar` — kg lines: decimal stepper in 0.05 steps; pza lines: whole-number stepper ±1
  - `✗ No hay`
  - `💬 Nota`
- the line's state must be readable at a glance: pending (neutral), listo (green tick, card
  dimmed), cambiado (shows the new quantity), no hay (red, shows the substitution or "quitar")
- `No hay` opens a styled dialog (never `alert()`): `Reemplazar por…` (free text) or
  `Quitar del pedido`, then save
- `Nota` opens a styled dialog with a textarea (e.g. "está muy maduro")

Sticky bottom bar, >=64px tall: `Total: $312.50` + primary button `Listo para facturar`,
>=56px tall.

- the button stays disabled until EVERY line has a state
- tapping it opens a summary dialog: each adjusted line, substitutions, notes, final total;
  buttons `Confirmar` / `Regresar`

### C. Success

Full screen: `✓ Pedido #1042 listo para facturar`, the final total, and `Volver a pedidos`.
No auto-navigation away.

## Data contract — these are stubs; Hermes wires them later

Leave the three functions empty, clearly named and commented. Build every state on
`MOCK_ORDERS`.

```js
async function loadPendingOrders() {}            // -> [OrderSummary]
async function loadOrder(orderId) {}             // -> Order
async function submitPicked(orderId, result) {}  // -> {ok:true}
```

```js
// Order
{
  id: 1042,
  created_at: "2026-07-16 09:12:00",
  status: "CONFIRMED",
  payment_method: "cash",          // "cash" | "card"
  customer: {
    name: "María García",
    phone: "6691234567",
    address: "Calle Hidalgo #123, Col. Centro, atrás del Oxxo"
  },
  delivery_notes: "portón azul",
  lines: [
    { id: 11, product_name: "Manzana Roja", emoji: "🍎", unit: "kg",  price_cents: 4500, quantity: 2, picked: 0 },
    { id: 12, product_name: "Lechuga",      emoji: "🥬", unit: "pza", price_cents: 1800, quantity: 1, picked: 0 }
  ]
}
```

```js
// result handed to submitPicked()
{
  total_cents: 31250,
  lines: [
    { id: 11, picked: 1,  quantity: 2 },
    { id: 12, picked: -1, substitution: "Espinaca", note: "" }
  ],
  employee_notes: ""
}
```

- `quantity` is a NUMBER. For `unit:"kg"` it may be fractional (1.35). For `unit:"pza"` it is a
  whole number.
- `picked`: 0 = pendiente, 1 = listo, -1 = no hay.
- Money is ALWAYS integer cents; format `$45.00` (MXN, two decimals). Never float arithmetic on
  pesos.
- `MOCK_ORDERS`: three realistic orders using the vocabulary in `products.json`
  (frutas / verduras / lácteos / abarrotes / bebidas / botanas). One with a kg line already
  weighing 1.35, one with an item missing, one clean.

Small dev helper for verification only, documented in a comment:
`?state=loading|error|empty|success` forces a state; `?order=<id>` opens a specific mock order.

## Hard rules

1. **One file, everything inline.** No external requests at all — no CDN, no Google Fonts, no
   images from the network. System font stack only. Emoji come from the data.
2. **Visual sibling of `index.html`** — reuse its `:root` palette, card radius, spacing and type
   scale, and the same corner language-toggle pattern.
3. **Bilingual from birth.** All strings in `T = {es:{…}, en:{…}}`, **Spanish default**, EN
   toggle top-right.
4. **Touch targets >=48px, primary actions >=56px.** Nothing smaller. No hover-only affordance.
5. **No `alert()` / `confirm()` / `prompt()`.** Styled dialogs and inline validation only.
6. **Works from `file://` with mock data, offline**, on a mid-range Android phone. Zero console
   errors.
7. Spanish accents correct (surtir, artículos, efectivo, kilo).
8. Do not touch any other file.

## Definition of done

- `picker.html` opens directly and every screen and state above is reachable with mock data
- all four line states and both dialogs work by tap
- the total recomputes correctly for fractional kg and whole pza
- zero console errors, one self-contained page
