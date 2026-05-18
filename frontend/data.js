/* PENTA Snippet Organizer — mock data + i18n */
(function () {
  const I18N = {
    es: {
      app_name: "Snippets",
      brand_tag: "AI Snippet Organizer",
      search_ph: "Buscar snippets, prompts, código…",
      cmd_hint: "para comandos",
      nav: {
        dashboard: "Inicio",
        library: "Biblioteca",
        favorites: "Favoritos",
        shared: "Compartido",
        ai: "Asistente IA",
        settings: "Ajustes",
        new: "Nuevo snippet",
      },
      types: {
        prompt: "Prompt",
        code: "Código",
        text: "Plantilla",
      },
      folders_title: "Carpetas",
      tags_title: "Etiquetas",
      types_title: "Tipo",
      hello: "Hola, Daniela",
      hello_sub: "Tu biblioteca tiene 142 snippets · 23 nuevos esta semana",
      stats: {
        total: "Snippets totales",
        favs: "Favoritos",
        shared: "Compartidos con tu equipo",
        ai_runs: "Generados con IA",
      },
      sections: {
        recent: "Recientes",
        favorites: "Tus favoritos",
        team: "De tu equipo",
        suggested: "Sugerido por la IA",
      },
      quick: "Acciones rápidas",
      quick_new_prompt: "Nuevo prompt",
      quick_new_code: "Nuevo código",
      quick_new_tpl: "Plantilla",
      quick_import: "Importar",
      lib_title: "Biblioteca",
      lib_count: (n) => `${n} snippets`,
      filter_all: "Todos",
      sort_recent: "Recientes",
      sort_used: "Más usados",
      sort_alpha: "A–Z",
      view_list: "Lista",
      view_grid: "Cuadrícula",
      versions: "Historial",
      variables: "Variables",
      shared_with: "Compartido con",
      open_in_editor: "Abrir en editor",
      copy: "Copiar",
      run_ai: "Ejecutar con IA",
      ai_title: "Asistente Penta",
      ai_sub: "Mejora, resume o genera snippets",
      ai_input_ph: "Escribe una instrucción o pega un snippet…",
      ai_actions: {
        improve: "Mejorar",
        summarize: "Resumir",
        translate: "Traducir",
        explain: "Explicar",
        gen_tests: "Generar tests",
        to_prompt: "Convertir en prompt",
      },
      ai_greeting: "¡Hola! Soy tu asistente Penta. ¿Qué quieres hacer con tus snippets hoy?",
      shortcut: "Atajos",
      settings_title: "Ajustes",
      theme: "Tema",
      theme_dark: "Oscuro",
      theme_light: "Claro",
      language: "Idioma",
      profile: "Perfil",
      notif: "Notificaciones",
      shortcuts: "Atajos de teclado",
      sharing: "Compartir y permisos",
      integrations: "Integraciones",
      sign_out: "Cerrar sesión",
      uses: (n) => `${n} usos`,
      ago: {
        m: (n) => `hace ${n} min`,
        h: (n) => `hace ${n} h`,
        d: (n) => `hace ${n} d`,
      },
    },
    en: {
      app_name: "Snippets",
      brand_tag: "AI Snippet Organizer",
      search_ph: "Search snippets, prompts, code…",
      cmd_hint: "for commands",
      nav: {
        dashboard: "Home",
        library: "Library",
        favorites: "Favorites",
        shared: "Shared",
        ai: "AI Assistant",
        settings: "Settings",
        new: "New snippet",
      },
      types: { prompt: "Prompt", code: "Code", text: "Template" },
      folders_title: "Folders",
      tags_title: "Tags",
      types_title: "Type",
      hello: "Hi, Daniela",
      hello_sub: "Your library has 142 snippets · 23 new this week",
      stats: {
        total: "Total snippets",
        favs: "Favorites",
        shared: "Shared with team",
        ai_runs: "AI generated",
      },
      sections: {
        recent: "Recent",
        favorites: "Your favorites",
        team: "From your team",
        suggested: "AI suggested",
      },
      quick: "Quick actions",
      quick_new_prompt: "New prompt",
      quick_new_code: "New code",
      quick_new_tpl: "New template",
      quick_import: "Import",
      lib_title: "Library",
      lib_count: (n) => `${n} snippets`,
      filter_all: "All",
      sort_recent: "Recent",
      sort_used: "Most used",
      sort_alpha: "A–Z",
      view_list: "List",
      view_grid: "Grid",
      versions: "History",
      variables: "Variables",
      shared_with: "Shared with",
      open_in_editor: "Open in editor",
      copy: "Copy",
      run_ai: "Run with AI",
      ai_title: "Penta Assistant",
      ai_sub: "Improve, summarize or generate snippets",
      ai_input_ph: "Type an instruction or paste a snippet…",
      ai_actions: {
        improve: "Improve",
        summarize: "Summarize",
        translate: "Translate",
        explain: "Explain",
        gen_tests: "Generate tests",
        to_prompt: "Make prompt",
      },
      ai_greeting: "Hi! I'm your Penta assistant. What do you want to do with your snippets today?",
      shortcut: "Shortcuts",
      settings_title: "Settings",
      theme: "Theme",
      theme_dark: "Dark",
      theme_light: "Light",
      language: "Language",
      profile: "Profile",
      notif: "Notifications",
      shortcuts: "Keyboard shortcuts",
      sharing: "Sharing & permissions",
      integrations: "Integrations",
      sign_out: "Sign out",
      uses: (n) => `${n} uses`,
      ago: {
        m: (n) => `${n}m ago`,
        h: (n) => `${n}h ago`,
        d: (n) => `${n}d ago`,
      },
    },
  };

  const FOLDERS = [
    { id: 'personal',  name_es: 'Personal',        name_en: 'Personal',       count: 28, color: '#2DD4BF' },
    { id: 'frontend',  name_es: 'Equipo Frontend', name_en: 'Frontend Team',  count: 34, color: '#1F7BD6' },
    { id: 'backend',   name_es: 'Equipo Backend',  name_en: 'Backend Team',   count: 41, color: '#7C5BFF' },
    { id: 'data',      name_es: 'Análisis Datos',  name_en: 'Data Analysis',  count: 23, color: '#F59E0B' },
    { id: 'ia',        name_es: 'IA Interna',      name_en: 'Internal AI',    count: 16, color: '#EC4899' },
  ];

  const TAGS = [
    'react', 'typescript', 'python', 'sql', 'postgres', 'fastapi',
    'pandas', 'pytorch', 'gpt', 'review', 'docs', 'slack', 'devops',
    'k8s', 'aws', 'tailwind', 'next.js'
  ];

  const SNIPPETS = [
    {
      id: 's1',
      type: 'prompt',
      title: 'Code review estructurado en español',
      desc: 'Genera un review consistente: legibilidad, seguridad, performance, sugerencias accionables.',
      folder: 'frontend',
      tags: ['gpt', 'review', 'docs'],
      author: { name: 'Daniela Restrepo', initials: 'DR', color: '#2DD4BF' },
      shared: ['DR', 'JM', 'AC'],
      uses: 87,
      fav: true,
      updated: 'hace 2 h',
      updated_en: '2h ago',
      version: 'v4',
      vars: ['{{lenguaje}}', '{{diff}}', '{{contexto}}'],
      lang: 'md',
      body: `Actúa como un revisor senior de código en {{lenguaje}}.
Analiza el siguiente diff y produce un review estructurado:

1. **Resumen** (2-3 líneas)
2. **Bloqueantes** — bugs, fugas de memoria, race conditions
3. **Mejoras de legibilidad** — naming, complejidad ciclomática
4. **Seguridad y performance**
5. **Sugerencias accionables** con ejemplos de código

Contexto adicional: {{contexto}}

\`\`\`diff
{{diff}}
\`\`\``
    },
    {
      id: 's2',
      type: 'code',
      title: 'useDebounce hook (React + TS)',
      desc: 'Hook con cleanup y tipado genérico. Compatible con SSR.',
      folder: 'frontend',
      tags: ['react', 'typescript'],
      author: { name: 'Julián Mejía', initials: 'JM', color: '#1F7BD6' },
      shared: ['DR', 'JM'],
      uses: 142,
      fav: true,
      updated: 'hace 1 d',
      updated_en: '1d ago',
      version: 'v2',
      vars: [],
      lang: 'ts',
      body: `import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}`
    },
    {
      id: 's3',
      type: 'code',
      title: 'Paginación cursor-based en Postgres',
      desc: 'Query y tipos para paginación estable por created_at + id.',
      folder: 'backend',
      tags: ['sql', 'postgres'],
      author: { name: 'Andrés Castro', initials: 'AC', color: '#7C5BFF' },
      shared: ['AC', 'JM', 'LP', 'DR'],
      uses: 64,
      fav: false,
      updated: 'hace 3 d',
      updated_en: '3d ago',
      version: 'v1',
      vars: ['{{table}}', '{{cursor}}', '{{limit}}'],
      lang: 'sql',
      body: `SELECT *
FROM {{table}}
WHERE (created_at, id) < (
  SELECT created_at, id FROM {{table}} WHERE id = {{cursor}}
)
ORDER BY created_at DESC, id DESC
LIMIT {{limit}};`
    },
    {
      id: 's4',
      type: 'prompt',
      title: 'Explicar consulta SQL paso a paso',
      desc: 'Para sesiones de pair-debug con analistas junior.',
      folder: 'data',
      tags: ['sql', 'docs', 'gpt'],
      author: { name: 'Laura Peña', initials: 'LP', color: '#F59E0B' },
      shared: ['LP', 'DR'],
      uses: 39,
      fav: false,
      updated: 'hace 5 d',
      updated_en: '5d ago',
      version: 'v1',
      vars: ['{{query}}', '{{schema}}'],
      lang: 'md',
      body: `Explica esta consulta SQL paso a paso, en español claro, para un analista junior.

Esquema relevante:
{{schema}}

Consulta:
\`\`\`sql
{{query}}
\`\`\`

Indica: qué tablas une, qué filtra, qué agrega, posibles cuellos de botella y cómo probarla en local.`
    },
    {
      id: 's5',
      type: 'text',
      title: 'Descripción de Pull Request',
      desc: 'Plantilla con secciones de contexto, cambios, tests y screenshots.',
      folder: 'frontend',
      tags: ['docs', 'review'],
      author: { name: 'Daniela Restrepo', initials: 'DR', color: '#2DD4BF' },
      shared: ['DR'],
      uses: 211,
      fav: true,
      updated: 'hace 6 h',
      updated_en: '6h ago',
      version: 'v3',
      vars: ['{{ticket}}'],
      lang: 'md',
      body: `## Contexto
Resolves {{ticket}}

## Cambios
- 

## Cómo probar
1. 

## Tests
- [ ] Unitarios
- [ ] Integración
- [ ] Manual

## Screenshots / Loom
`,
    },
    {
      id: 's6',
      type: 'code',
      title: 'Pandas: group + pivot + ratio',
      desc: 'Receta para reportes mensuales de conversión.',
      folder: 'data',
      tags: ['python', 'pandas'],
      author: { name: 'Laura Peña', initials: 'LP', color: '#F59E0B' },
      shared: ['LP', 'AC'],
      uses: 52,
      fav: false,
      updated: 'hace 1 d',
      updated_en: '1d ago',
      version: 'v2',
      vars: ['{{df}}'],
      lang: 'py',
      body: `import pandas as pd

monthly = (
    {{df}}
    .assign(month=lambda d: d['ts'].dt.to_period('M'))
    .groupby(['month', 'channel'])
    .agg(users=('user_id', 'nunique'),
         orders=('order_id', 'nunique'))
    .reset_index()
)

pivot = monthly.pivot(index='month', columns='channel', values='orders').fillna(0)
pivot['cvr'] = pivot.sum(axis=1) / monthly.groupby('month')['users'].sum()
pivot`
    },
    {
      id: 's7',
      type: 'prompt',
      title: 'Generar docstrings estilo Google',
      desc: 'Convierte funciones Python a docstrings detallados.',
      folder: 'ia',
      tags: ['python', 'docs', 'gpt'],
      author: { name: 'Sistema IA', initials: 'AI', color: '#1F7BD6' },
      shared: ['DR', 'JM', 'AC', 'LP'],
      uses: 98,
      fav: false,
      updated: 'hace 4 d',
      updated_en: '4d ago',
      version: 'v5',
      vars: ['{{code}}'],
      lang: 'md',
      body: `Reescribe la siguiente función Python añadiendo docstrings estilo Google (Args, Returns, Raises, Example).
No cambies la lógica. Mantén el estilo PEP8.

\`\`\`python
{{code}}
\`\`\``
    },
    {
      id: 's8',
      type: 'code',
      title: 'FastAPI · auth con JWT y refresh',
      desc: 'Endpoints, dependencias y schema de tokens.',
      folder: 'backend',
      tags: ['python', 'fastapi'],
      author: { name: 'Andrés Castro', initials: 'AC', color: '#7C5BFF' },
      shared: ['AC', 'DR'],
      uses: 31,
      fav: true,
      updated: 'hace 1 sem',
      updated_en: '1w ago',
      version: 'v1',
      vars: [],
      lang: 'py',
      body: `from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta
import jwt

router = APIRouter(prefix="/auth")

SECRET = settings.JWT_SECRET
ACCESS_TTL  = timedelta(minutes=15)
REFRESH_TTL = timedelta(days=14)

def _sign(payload: dict, ttl):
    return jwt.encode({**payload, "exp": datetime.utcnow() + ttl}, SECRET, "HS256")

@router.post("/login")
async def login(body: LoginIn):
    user = await users.verify(body.email, body.password)
    if not user:
        raise HTTPException(401, "bad_credentials")
    return {
        "access":  _sign({"sub": user.id}, ACCESS_TTL),
        "refresh": _sign({"sub": user.id, "k": "r"}, REFRESH_TTL),
    }`
    },
  ];

  const TEAM = [
    { initials: 'DR', name: 'Daniela R.', color: '#2DD4BF' },
    { initials: 'JM', name: 'Julián M.',  color: '#1F7BD6' },
    { initials: 'AC', name: 'Andrés C.',  color: '#7C5BFF' },
    { initials: 'LP', name: 'Laura P.',   color: '#F59E0B' },
    { initials: 'SO', name: 'Santiago O.',color: '#EC4899' },
  ];

  const AI_HISTORY_DEFAULT = [
    { role: 'assistant', text: '¡Hola Daniela! Soy tu asistente Penta. Puedo mejorar prompts, generar tests, traducir snippets o explicar código. ¿Por dónde empezamos?' },
    { role: 'user',      text: 'Mejora el prompt "Code review estructurado" para que pida también medir cobertura.' },
    { role: 'assistant', text: 'Listo — añadí una sección "Cobertura" entre Seguridad y Sugerencias, con métricas mínimas (líneas, branches) y plantilla para reportar gaps. ¿Lo guardo como v5?', actions: ['Guardar como v5', 'Ver diff', 'Descartar'] },
  ];

  window.PENTA = {
    I18N,
    FOLDERS,
    TAGS,
    SNIPPETS,
    TEAM,
    AI_HISTORY_DEFAULT,
  };
})();
