# order-form-amendment-4.md — the independent review's findings

Claude reviewed `pedido.html` against `docs/order-form-spec.md` and against its real users. I verified
every claim below against the code. Fix them in **`pedido.html` only** — `index.html` is live and stays
untouched, and `products.json` is mine (it now carries stable `id` values; see item 1).

## MUST FIX

1. **A saved cart can restore the wrong products.** `p._id` is the *array index* into the filtered
   catalogue (line ~886: `p._id = p.id !== undefined ? p.id : i`). That index is what `pedido_cart`
   stores, so the moment Cannon adds, removes, deactivates or reorders a product, every later index
   shifts and a returning customer's saved quantities attach to **different products** — silently, into
   the WhatsApp message and the `--PEDIDO--` JSON.
   **Fix:** `products.json` now carries a stable `"id"` string per product (`"manzana-roja"`), and the
   existing code already prefers it. Make sure the cart key is that id (never the index), keep the
   guard that drops keys that no longer exist, and store a timestamp with the cart — ignore a saved
   cart older than 24 hours.

2. **The machine-readable total can disagree with the lines.** `onType` (line ~567) stores a typed kg
   quantity exactly as typed, so `1.234` is saved while the line is priced from it rounded to cents:
   the JSON then carries `qty:1.234` and a `total_cents` that a consumer computing `qty × cents`
   cannot reproduce. The spec requires them to agree to the cent.
   **Fix:** one rule, applied on input — kg quantities are rounded to **2 decimals** (0.01 kg) as soon
   as they are typed, exactly as the blur handler already does; pieces stay whole numbers. Record the
   rule in `docs/agy-notes.md`.

3. **The order is destroyed when WhatsApp does not open.** Lines ~812-815 call
   `window.open(url,"_blank")` and then `clearCart()` without looking at the return value. In an
   in-app browser, or with popups blocked, `window.open` returns `null`: the customer's whole order is
   deleted and the page congratulates them.
   **Fix:**
   - if `window.open(...)` returns `null`/nothing, fall back to `location.href = url`, and if that is
     also not possible show a visible tappable link with the message text ready to copy;
   - **do not clear the cart in that path** — keep it until the customer confirms with "Nuevo pedido";
   - never report success when the hand-off failed.

4. **The success wording overstates what happened.** Lines ~273 and ~336 say *"¡Pedido enviado con
   éxito!"* when the only thing that has happened is that WhatsApp was opened. The customer must still
   press Send, and a customer who doesn't now believes the shop has the order.
   **Fix:** say what is true — *"Abrimos WhatsApp. Toca **Enviar** para terminar tu pedido"* (EN:
   *"WhatsApp is open — tap **Send** to finish your order"*), with the order code beside it.

## WORTH FIXING (same file, while you are in there)

5. **Scroll-spy dies after the first language toggle.** `initSpy()` runs once; the language change
   rebuilds the catalogue and replaces the observed elements, so the observer watches removed nodes.
   Re-observe after a rebuild.
6. **A catalogue load failure is destroyed by the language toggle.** Switching language in the failure
   state wipes the error block and the Retry button, leaving empty headings — on the weak signal that
   caused the failure. Keep a failure flag and re-render the error block; also apply the static text of
   the saved language **before** the fetch, so a returning English customer does not see Spanish first.
7. **No loading state.** Until the catalogue arrives the page shows empty tabs and `$0.00`. Show a
   "Cargando…" / "Loading…" placeholder in the catalogue area.
8. **The confirmation banner is never hidden again,** so a stale code sits above a new order, and it is
   off-screen for anyone who has scrolled. Hide it when a new order starts, or drop it — the code is
   already shown in the confirmation area.
9. **Placeholders** are a literal `"..."` (lines ~302, 312, 316). Use real Spanish examples such as
   *"Calle y número, colonia"*, with English variants in the dictionary.
10. **Accessibility, cheap wins:** the − / + buttons have no `aria-label`; the product cards are
    clickable `div`s with no `role="button"`/`tabindex`; `.pay input{display:none}` (line ~208) removes
    the payment radios from keyboard focus (visually hide them instead); the `Total` label (line ~665)
    bypasses the `T` dictionary; and `92vh` (line ~181) ignores a collapsing mobile toolbar — use
    `92dvh` with a `vh` fallback.

## Definition of done

- the cart survives a reload and is keyed by the catalogue's stable `id`, with a 24-hour expiry
- a typed kg quantity is stored with at most 2 decimals, and `total_cents` always equals the sum of
  `qty × cents` to the cent (state the rounding rule in `docs/agy-notes.md`)
- with `window.open` returning `null`, the cart is **not** cleared and the customer is told plainly
- no success claim until the customer has actually pressed Send in WhatsApp
- the eleven checks in `verify-form.py` still pass, plus the two new ones
  (**do not run any test or verification script yourself** — Hermes runs them)
- one self-contained file; `index.html`, `picker.html`, `products.json` untouched
