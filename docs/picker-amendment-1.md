# picker-amendment-1.md — a substitute must carry its price

## Why

A `No hay` line that is replaced with a substitute currently counts **$0.00**, so the customer is not
charged for it. A substitute has to be a real, priced product chosen from the store catalogue — not
free text.

## Change ONE file: `picker.html`

Everything else in it stays exactly as it is, including every hard rule from `docs/picker-spec.md`
(one self-contained file, no external requests, ES-first with the language toggle, ≥48px targets,
styled dialogs only, no `alert`/`confirm`/`prompt`, zero console errors, dev states still working).

1. **New stub** beside the existing three, same style, empty and documented:

   ```js
   async function loadCatalog() {}   // -> [{ name, unit, price_cents, emoji, cat }]
   ```

   and a `MOCK_CATALOG` built from the real items in `products.json` (about fifteen, spread across
   frutas / verduras / lácteos / abarrotes / bebidas / botanas) so the substitute picker is
   demonstrable today. Hermes wires `loadCatalog()` to `products.json` later.

2. **The `No hay` dialog** becomes: a choice between `Reemplazar por…` and `Quitar del pedido`;
   when `Reemplazar por…` is chosen, a text field filters the catalogue live (accent-insensitive, so
   "platano" finds "Plátano") and each result row shows the product name **and its price**. Choosing a
   row selects it as the substitute and shows it back with its price. `Guardar` stays disabled until
   either a substitute is chosen or `Quitar` is selected.

3. **The line card** for a replaced line reads `✗ No hay → Espinaca $20.00` and its line value is the
   substitute's price × the requested quantity. A removed line keeps `✗ No hay · quitar` and counts
   $0.00.

4. **The total** charges the substitute price for replaced lines. The summary dialog shows the
   substitution and its price per line.

5. **`submitPicked` payload** — keep `substitution` as the substitute's NAME string, and add its price:

   ```js
   { id: 24, picked: -1, substitution: "Mango Ataulfo", substitution_price_cents: 5500, note: "" }
   ```

6. **Mock data change, for demonstrability:** in mock order **1043**, the missing line
   (`Piña`, kg, 3000, quantity 1.5, `picked:-1`) gets the substitute **`Mango Ataulfo`, kg,
   `substitution_price_cents: 5500`**.

   Expected totals, so this is checkable, not impressionistic:
   - order **1042** is untouched and must still total **$337.30** (it is the regression baseline);
   - order **1043** must total **$229.00** = 65.00 (Aguacate 1 kg) + 17.50 (Limón 0.5 kg) +
     20.00 (Cilantro 2 pza) + 82.50 (Piña 1.5 kg → Mango Ataulfo 5500 × 1.5) + 44.00 (Tortillas 2 pza).

## Definition of done

- the substitute flow is fully drivable by tap on mock order 1043, and its total reads **$229.00**
- order 1042 still reads **$337.30**
- `?state=loading|error|empty|success` and `?order=<id>` still work; zero console errors
- only `picker.html` is changed (put any judgement call in `docs/picker-notes.md`)
