# Notes for picker-amendment-3.md

## Judgement Calls

1. **`Limón` added to `MOCK_CATALOG`**:
   Amendment 3 explicitly requested:
   > "add the products the mock orders use that are missing from it — `Manzana Roja`, `Jitomate`, `Queso Fresco`, `Huevo San Juan`, `Cebolla Blanca` — so every mocked line can translate. The English names must match `products.json` exactly."

   Mock order 1043 also contains `Limón` (`id: 22`, unit: `kg`, price: `3500`), which was not present in `MOCK_CATALOG`. In order to ensure that literally every mocked line across all mock orders (1042, 1043, and 1044) translates to English, `Limón` (`name_en: "Lime"`) was also added to `MOCK_CATALOG` matching `products.json` exactly.

# Notes for order-form-spec.md (pedido.html)

## Judgement Calls

1. **Payment options**: Updated payment selection radio options from 3 (`Efectivo`, `Transferencia`, `Tarjeta`) to 2 (`Efectivo` [`cash`], `Tarjeta` [`card`]) to align strictly with the spec's machine-readable requirement (`pay` — `cash` or `card`) and section "Keep exactly as it is" specifying `details form (name, phone, address, notes, cash/card)`.
2. **Touch targets**: Stepper buttons (`.qbtn`) resized from 34px to 48px, category tabs (`.tab`) given min-height 48px, and language toggle (`#langBtn`) sized to min 48px × 48px to satisfy the repo-wide rule that every button measures ≥48px.
3. **Confirmation display**: To ensure the customer order code is prominently visible and easily readable, the order code is displayed in a dedicated styled confirmation card inside the sheet upon sending and also in a banner at the top of the main store view.

# Notes for order-form-amendment-4.md (pedido.html)

## Quantity Rounding Rule and Line Total Arithmetic

1. **Kg quantities**: Stored with at most 2 decimal places (`0.01 kg`). On input (`onType`), values are immediately rounded to 2 decimals using `Math.round(val * 100) / 100` (and normalized on blur).
2. **Piece quantities (`pza`)**: Always whole numbers using `Math.floor(val)`.
3. **Line pricing & totals**: Line cents are computed as `Math.round(unitCents * toHundredths(qty) / 100)` where `toHundredths(qty) = Math.round(qty * 100)`. Because all catalogue unit prices are in integer cents and kg quantities have at most 2 decimals, the line arithmetic `qty × cents` always reproduces `total_cents` exactly to the cent without rounding drift.
4. **Cart persistence & 24h expiry**: Cart items are keyed strictly by the catalogue's stable product `id` string (e.g. `manzana-roja`). Stored under `pedido_cart` with timestamp `ts`; carts older than 24 hours (or containing keys no longer in active catalogue) are dropped on load.
5. **WhatsApp hand-off & fallback**: If `window.open` returns `null` or throws, navigation falls back to `location.href`, cart is preserved until the customer confirms "Nuevo pedido", and plain fallback options (direct link + copyable message) are presented without false success claims.
6. **Scroll-spy and language toggling**: Scroll-spy observer is disconnected and re-initialized whenever the catalogue is rebuilt upon language toggle; catalogue failure state is preserved and re-rendered if language is toggled; and static text of the saved language is applied before the network fetch to prevent layout/text flashes.
