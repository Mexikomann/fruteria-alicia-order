# GEMINI.md — brief for Antigravity (agy) in this repository

You are working on a real storefront whose pages reach real customers. Simple and working beats
clever, every time. Read `CLAUDE.md` (the project brief) plus the spec for the file you are asked to
change:

| Task | Read first | May write |
|---|---|---|
| Store-owner admin panel | `docs/admin-panel-spec.md` | `admin.html` only |
| Employee picker screen | `docs/picker-spec.md`, amended by `docs/picker-amendment-1.md` | `picker.html` only |
| Not named above | ask before changing anything | nothing |

## House rules, every file

1. **One self-contained HTML file.** Inline CSS and JS. No CDN, no fetched fonts, no libraries, no
   external request of any kind.
2. **Spanish first**, English toggle, both drawn from a `T = {es:{…}, en:{…}}` dictionary.
3. **Touch targets ≥48px**, primary actions ≥56px.
4. **Styled dialogs only** — `alert()`, `confirm()` and `prompt()` are banned.
5. **Money is integer cents.** Never do float arithmetic on pesos.
6. **Backend calls stay as named empty stubs**, and every UI state (loading / error / empty /
   success) stays reachable on mock data.
7. **Touch no file a task did not name.** If you believe another file must change, write your
   reasoning to `docs/agy-notes.md` and still deliver the named file.
8. **Publishing is not yours.** Never commit, push or deploy. Hermes verifies; Cannon decides.

## What "done" means here

Hermes renders your file in a real headless browser and drives it — clicks every control, reads the
computed totals, measures every button against 48px, and watches the console. So: zero console
errors, working states, and arithmetic that survives being checked by hand.
