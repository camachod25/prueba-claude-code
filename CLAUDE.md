# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

**PENTA · AI Snippet Organizer** — a hi-fi interactive mockup for the PENTA company (software solutions, users are developers and data analysts). The frontend is a no-build prototype; the backend (FastAPI/Python) is not yet implemented.

## Running the frontend

No build step. Serve the `frontend/` directory with any static file server:

```bash
cd frontend
python3 -m http.server 8080
# open http://localhost:8080
```

The prototype uses React 18 + Babel Standalone loaded from CDN (unpkg), so it requires a server (not `file://`) due to CORS on the script tags.

## Frontend architecture

The prototype is **not a bundled app** — scripts are loaded in explicit order via `<script>` tags in `index.html`. The load order is critical:

1. `data.js` — plain JS (no imports), populates `window.PENTA` with mock data and i18n strings
2. `icons.jsx` → exposes `window.Icons`
3. `app.jsx` → exposes `window.PentaApp`, `Avatar`, `AvatarStack`, `TypeBadge`, `cx`
4. `screens.jsx` → exposes the 5 screen components
5. `design-canvas.jsx` → exposes `DesignCanvas`, `DCSection`, `DCArtboard`
6. `tweaks-panel.jsx` → exposes `useTweaks`, `TweaksPanel` and all `Tweak*` controls
7. Inline `<script>` in `index.html` — defines and mounts `PentaCanvas`

### State flow

`PentaCanvas` (defined inline in `index.html`) is the root. It owns **shared state** (theme, lang, accent, device) via `useTweaks`. It passes `sharedUI` + `setSharedUI` down to each `PentaApp` instance.

`PentaApp` (`app.jsx`) renders one variant (desktop or mobile). It holds **local UI state**: active screen, chat open/minimized, active snippet. Theme and lang are synced bidirectionally with the parent's `sharedUI` — changes inside the app propagate up, and changes from the TweaksPanel propagate down.

All mock data lives on `window.PENTA` and is read directly by components. There is no state management library.

### CSS design tokens

Tokens live in `styles.css` as CSS custom properties on `.theme-dark` / `.theme-light` (applied to `.penta-app`). Key variables: `--bg`, `--surface`, `--surface-2`, `--surface-3`, `--text`, `--text-muted`, `--text-dim`, `--border`, `--penta-grad`, `--accent`. The accent color is overridden at runtime on `document.documentElement` by `PentaCanvas` via `style.setProperty`.

### Design canvas vs. app

`design-canvas.jsx` and `tweaks-panel.jsx` are **design-tool infrastructure**, not part of the real application. They wrap the app for prototyping: `DesignCanvas` provides pan/zoom and artboard management; `TweaksPanel` provides the live-tweaking UI. The actual app is `PentaApp` inside the artboards.

## Adding mock data

All snippets, folders, tags, team members, and AI conversation history are in `frontend/data.js` under `window.PENTA`. Snippets follow this schema:

```js
{
  id, type,           // 'prompt' | 'code' | 'text'
  title, desc, body,  // body is the raw snippet content
  lang,               // used for syntax highlight ('md' | 'ts' | 'sql' | 'py')
  folder, tags,
  author: { name, initials, color },
  shared: [initials],
  uses, fav,
  updated, updated_en,
  version, vars,      // vars: ['{{placeholder}}'] — extracted and shown in detail view
}
```

## Adding screens

Screens are defined in `screens.jsx` and registered in the `switch` inside `PentaApp.render()` (`app.jsx`). Each screen receives `{ ui, setUI, t, openSnippet, closeSnippet, variant }`. `variant` is `'desktop'` or `'mobile'`; use it to branch layout. Navigation is done by calling `setUI(u => ({ ...u, screen: 'screen-id' }))`.

## i18n

All UI strings come from `window.PENTA.I18N[ui.lang]` (passed as `t` to every component). Both `es` and `en` keys must be kept in sync in `data.js` when adding strings.

## Backend (not yet implemented)

`backend/` is empty. Planned stack: **FastAPI** (Python). When implemented:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload   # http://localhost:8000
# API docs: http://localhost:8000/docs
```
