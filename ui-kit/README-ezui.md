# EZUI — Ezventure UI standard (reusable for other games)

Files: `ezui.css` (tokens + modal kit, auto-extracted from the game by `build.py`), `ezui.js` (show/hide, `data-for`, `--vh`), `demo.html` (kitchen sink — open in a browser, try portrait/landscape).

## Modal anatomy
```
.ov.dlg > .panel(.sm|.md|.lg) > .phead  (h2 + .acts[.xbtn])
                              > .pbody  (the ONLY scrolling area)
                              > .pfoot  (always visible)
```
- **Footer rule:** secondary = LEFT (Back / Cancel / Close-with-extras), primary = RIGHT (Continue / Save / Close). Never put action buttons inside `.pbody`. Extra actions go in `.pfoot .fg` (left group).
- **X** top-right in `.acts`; use `data-for="closeBtnId"` to reuse one close handler.
- **Placement:** centered dialog on landscape/desktop; bottom sheet on portrait ≤640px; `.ov.side` = left editor panel (2 columns in phone landscape via `.cols`).
- Rule: header + footer always on screen; the player never scrolls to find "Next".

## Tokens
`--mg` margin, `--st/--sb/--sl/--sr` safe areas, `--tap` min touch target (48px, 42px on short screens), `--r-panel`, colors `--ink --paper --berry --sun --leaf --sea --dusk`, fonts `--f-display --f-body`.

## HUD zones
Top-left status stack (badge+bars, quest chip, contextual button) · top-right (coins, menu icons, minimap) · bottom-left joystick · bottom-right action buttons · bottom-center contextual "use". Keep ≥12px from edges plus safe areas; every tappable ≥48px (≥42px short screens).

## Checklist for a new modal
1. Use header/body/footer. 2. Primary on right. 3. Test 780×360, 390×780, 320×568, 1280×720. 4. Only `.pbody` scrolls.

Exception: read-only full-bleed viewers (e.g. the map) may drop the footer to maximise content; the header X stays top-right/left column and nothing scrolls.
