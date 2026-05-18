# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

**PENTA · AI Snippet Organizer** — a hi-fi interactive mockup for the PENTA company (software solutions, users are developers and data analysts). The frontend is a no-build prototype; the backend is FastAPI + SQLAlchemy async, structured with clean/hexagonal architecture.

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

## Running the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload   # http://localhost:8000
# API docs: http://localhost:8000/docs
```

Run tests:

```bash
cd backend
pytest                          # all tests
pytest tests/unit               # unit only
pytest tests/unit/use_cases/test_create_snippet.py  # single file
```

## Backend architecture

The backend follows **clean architecture with hexagonal (ports & adapters)** style. The dependency rule flows inward: `infrastructure` → `application` → `domain`. The domain has zero external dependencies.

```
backend/
├── src/
│   ├── domain/          # pure business logic — no framework imports
│   ├── application/     # orchestration: ports, use_cases, dtos
│   └── infrastructure/  # adapters: FastAPI, SQLAlchemy, config
└── tests/
    ├── unit/            # mock the repository, test logic only
    └── integration/     # test against the real API
```

### Domain layer (`src/domain/`)

Contains entities, value objects, and domain exceptions. No imports from `application` or `infrastructure`.

- **`entities/snippet.py`** — `Snippet` dataclass with domain methods: `update_body()` (increments `version`), `toggle_favorite()`, `increment_use_count()`, `share_with()`. All mutations go through these methods, never direct field assignment.
- **`value_objects/snippet_type.py`** — `SnippetType` str enum: `PROMPT | CODE | TEXT`.
- **`exceptions/domain_exceptions.py`** — `SnippetNotFound`, `UnauthorizedAccess`, `FolderNotFound`. Raised by use cases, caught and mapped to HTTP status codes in the router.

### Application layer (`src/application/`)

#### Ports

- **`ports/input/snippet_service_port.py`** — `ISnippetService` ABC: the interface the driving adapter (router) talks to.
- **`ports/output/snippet_repository_port.py`** — `ISnippetRepository` ABC: the interface use cases depend on; implemented in infrastructure. To swap databases, only write a new implementation of this ABC.

#### Use cases (`use_cases/snippet/`)

One class per action, injected with `ISnippetRepository`. Each exposes a single `async execute(...)` method:

| File | Responsibility |
|---|---|
| `create_snippet.py` | Builds `Snippet` entity; auto-extracts `{{variables}}` from body via regex |
| `get_snippet.py` | Checks ownership/sharing; calls `increment_use_count()` |
| `list_snippets.py` | Delegates filtering to repository; applies `favorites_only` in-memory |
| `update_snippet.py` | Calls domain methods; re-extracts variables if body changed |
| `delete_snippet.py` | Ownership guard then hard delete |
| `toggle_favorite.py` | Calls `snippet.toggle_favorite()` and persists |

`use_cases/ai/improve_snippet.py` depends on `IAIProvider` (also an ABC defined in the same file) — plug in any LLM provider by implementing that interface.

#### DTOs (`dtos/`)

Pydantic v2 models. `CreateSnippetDTO` / `UpdateSnippetDTO` are request bodies; `SnippetResponseDTO` is the API response (used with `model_validate(entity)`). `ListSnippetsFilterDTO` carries query-param filters with built-in validation.

### Infrastructure layer (`src/infrastructure/`)

#### API (`infrastructure/api/`)

- **`routers/snippets.py`** — FastAPI router. Maps HTTP verbs to use cases. Catches domain exceptions and converts them to 404/403.
- **`dependencies.py`** — FastAPI `Depends` wiring: `get_db` → session → `SQLAlchemySnippetRepository` → use case. To add a new use case, add a `get_<name>_uc` function here and inject it into the router.

#### Persistence (`infrastructure/persistence/`)

- **`models/snippet_model.py`** — SQLAlchemy mapped class (`SnippetModel`). Lists and UUIDs are stored as JSON strings.
- **`repositories/snippet_repository.py`** — `SQLAlchemySnippetRepository` implements `ISnippetRepository`. Contains `_to_entity()` / `_to_model()` mappers that isolate ORM details from the domain.

#### Config (`infrastructure/config/settings.py`)

`pydantic-settings` reads from `.env`. Key settings: `database_url` (defaults to SQLite `penta.db`), `cors_origins`, `secret_key`.

### Adding a new use case

1. Add the method signature to `ports/input/snippet_service_port.py` (if using `ISnippetService`).
2. Create `application/use_cases/<domain>/<action>.py` with a class that takes the needed port(s) in `__init__` and exposes `async execute(...)`.
3. Add a `get_<action>_uc` factory in `infrastructure/api/dependencies.py`.
4. Wire the route in the appropriate router file.
