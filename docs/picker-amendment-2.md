# picker-amendment-2.md — defect fixes from an independent review

An independent review of the LIVE page, plus my own re-measurements, found two must-fix defects and
several smaller ones. This file is the complete work order. **Change only `picker.html`.** A separate
change to `products.json` is mine, not yours. `docs/picker-spec.md` and `docs/picker-amendment-1.md`
still govern everything else, and every hard rule still applies (one self-contained file, no external
request of any kind, ES-first with the EN toggle, ≥48px targets, styled dialogs only, money in
integer cents, all states reachable on mock data, zero console errors).

## MUST FIX

1. **The hardware/gesture Back button must not throw away the pick.** The `popstate` listener
   (around line 1083) calls `routeFromLocation()` immediately, so it never consults `view.dirty` —
   while the in-app ← button does exactly that (around line 1091). One back-swipe therefore silently
   discards every line the picker has marked. Make the Back gesture respect the same guard: if
   `view && view.dirty`, open the leave dialog (`openLeave()`) and hold a history entry so the
   dialog's answer decides the exit — never navigate away over unsaved marking.

2. **The header must pass contrast.** I measured white text on your own palette: on the gradient's
   light end it is **2.36:1** and on the yellow end **1.97:1**; worse, `.hbtn`'s translucent white pill
   (`rgba(255,255,255,.22)`) puts the ← button and the phone button at **1.93:1** and **1.71:1** —
   below even the 3:1 large-text floor. The address line and those two buttons are the least legible
   things on the page in daylight glare. Fix so every white glyph in the header sits on **at least
   4.5:1**: end the gradient on the dark green instead of the light/yellow end, and/or give `.hbtn`,
   `.addr` and `.hmeta` a solid dark backing rather than translucent white. Keep it looking like the
   same page — same palette family, same shape.

## WORTH FIXING

3. **Progress cue is the smallest type on the page.** `#totalWrap .hint` (around line 205) renders
   "Faltan N artículos por marcar" at 13px; raise it to 15px. Its colour contrast is already fine.
4. **Missing accent:** `replacePh` (around line 355) → `"Buscar producto (ej. plátano)"`. The
   accent-insensitive matcher still finds it either way.
5. **Progress must survive a reload or an app-switch.** Today the marking lives only in the `view`
   object, so a reload loses everything with no recovery path. Snapshot the working state (order id,
   per-line states, quantities, notes, substitutions) to `sessionStorage` on every change and restore
   it in `init()`. Storage only — no network call, so the no-external-requests rule holds.
6. **`viewport-fit=cover`** in the viewport meta (line 5) so the `env(safe-area-inset-bottom)` padding
   already used at `#bottomBar` and `.sheet` actually applies on notched iPhones.
7. **Completed lines fall below the contrast floor.** `.item.st-listo { opacity:.55 }` (around line 185)
   takes that card's text to roughly 2–3:1. De-emphasise without opacity — a solid ≥4.5:1 text colour
   and/or a strikethrough on the quantity — keeping the green tick unmistakable.
8. **One word, two meanings.** `requested:"Pedido"` (around line 340) labels each line the same way the
   screen is titled ("Pedido #1042"). Change the per-line label to `"Solicitado"` (EN: `"Requested"`).
9. **"peso" reads as money before weight.** `errKg` (around line 352) says "Escribe un peso válido…".
   Rewrite around kilos only: `"Escribe la cantidad en kilos (pasos de 0.05, por ejemplo 1.35)."`
10. **Emoji in the mock data.** `Papaya` must not be 🫐 (a blueberry) — use 🍈. `Tortillas de Harina`
    🫓 → 🌮. Both replacements are old, universally supported glyphs. Also give the icon slot a fixed
    size so a missing glyph degrades to a blank tile instead of distorting the row (this page is used
    on handsets whose emoji font may predate 2019).

11. **Substitute search and the keyboard.** When the substitute search opens, its results list sits
    directly under the focused box, so the on-screen keyboard may cover the very results being
    searched. Make the results reachable: cap the list height and scroll the chosen result into view,
    or focus in a way that leaves the list visible. Keep the flow otherwise identical.

## Definition of done

- `python3 ~/hermes-brain/02_PROJECTS/PROJECT-Business-FruteriaAlicia/verify-picker.py` still passes
  every gate, with the totals **unchanged**: order 1042 = **$337.30**, order 1043 = **$229.00**, the
  tap-replace flow = **$219.00**, empty and error states render, no console errors. These fixes must
  not move a single peso.
- every white glyph in the header is at ≥4.5:1
- Back never discards marked lines without asking; a reload restores in-progress marking
- still one self-contained file, no external request, all states reachable
- only `picker.html` changed; put any judgement call in `docs/agy-notes.md`
