/* PENTA · Screens — Dashboard, Library, Detail, AI history, Settings */
/* eslint-disable react/jsx-pascal-case */
const { useState: useStateS, useMemo: useMemoS } = React;

// ─── Reusable snippet card ────────────────────────────────────────────────
function SnippetCard({ s, t, onOpen, compact, variant }) {
  const folder = window.PENTA.FOLDERS.find(f => f.id === s.folder);
  const updated = (t === window.PENTA.I18N.es) ? s.updated : s.updated_en;
  return (
    <div onClick={onOpen} className="card" style={{
      padding: compact ? '14px 16px' : '16px 18px',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      display: 'flex', flexDirection: 'column', gap: 10,
      position: 'relative',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.borderColor = 'var(--border-strong)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = '';
      e.currentTarget.style.borderColor = '';
    }}>
      {/* Top row: type badge + favorite */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <TypeBadge type={s.type} t={t} />
        <span style={{ fontSize: 10.5, color: 'var(--text-dim)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
          {s.version}
        </span>
        <span style={{ flex: 1 }} />
        {s.fav && <Icons.Star size={14} style={{ color: '#F59E0B', fill: '#F59E0B' }} />}
        <button onClick={e => e.stopPropagation()} style={{
          padding: 2, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-dim)',
        }}>⋯</button>
      </div>

      {/* Title */}
      <div style={{ fontSize: compact ? 14 : 15, fontWeight: 700, color: 'var(--text)',
                     lineHeight: 1.3, letterSpacing: '-0.01em',
                     textWrap: 'pretty', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {s.title}
      </div>

      {/* Description / preview */}
      {!compact && (
        <div style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.45,
                       display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {s.desc}
        </div>
      )}

      {/* Code preview line */}
      {s.type !== 'prompt' && (
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)',
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          padding: '6px 10px', borderRadius: 8,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {s.body.split('\n').find(l => l.trim()) || s.body.slice(0, 60)}
        </div>
      )}

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {s.tags.slice(0, 3).map(tag => (
          <span key={tag} className="tag">#{tag}</span>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 8,
                     borderTop: '1px solid var(--border)', fontSize: 11.5, color: 'var(--text-muted)' }}>
        {folder && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: 2, background: folder.color }} />
            {folder.name_es && (t === window.PENTA.I18N.es ? folder.name_es : folder.name_en)}
          </span>
        )}
        <span style={{ flex: 1 }} />
        <AvatarStack people={s.shared} size={18} max={3} />
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>· {updated}</span>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────
function DashboardScreen({ ui, setUI, t, openSnippet, variant }) {
  const isMobile = variant === 'mobile';
  const snippets = window.PENTA.SNIPPETS;
  const recent = snippets.slice(0, 4);
  const favs = snippets.filter(s => s.fav).slice(0, 3);
  const team = snippets.filter(s => s.author.initials !== 'DR').slice(0, 3);

  const stats = [
    { label: t.stats.total,    value: 142, delta: '+23', icon: Icons.Library, color: '#1F7BD6' },
    { label: t.stats.favs,     value: 18,  delta: '+4',  icon: Icons.Star,    color: '#F59E0B' },
    { label: t.stats.shared,   value: 47,  delta: '+12', icon: Icons.Share,   color: '#2DD4BF' },
    { label: t.stats.ai_runs,  value: 89,  delta: '+31', icon: Icons.Sparkle, color: '#7C5BFF' },
  ];

  return (
    <div style={{ maxWidth: 1100, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero greeting */}
      <div style={{
        display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16,
        alignItems: isMobile ? 'flex-start' : 'flex-end', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: isMobile ? 22 : 30, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            {t.hello.split(',')[0]}, <span className="penta-wordmark">{t.hello.split(',')[1]?.trim()}</span>
          </div>
          <div style={{ marginTop: 6, fontSize: 13.5, color: 'var(--text-muted)' }}>
            {t.hello_sub}
          </div>
        </div>
        {!isMobile && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn"><Icons.Down size={14}/> {ui.lang === 'es' ? 'Importar' : 'Import'}</button>
            <button className="btn btn-primary"><Icons.Plus size={14} stroke={2.2}/>{t.nav.new}</button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: 12,
      }}>
        {stats.map((s, i) => {
          const I = s.icon;
          return (
            <div key={i} className="card" style={{ padding: '16px 18px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: s.color + '22', color: s.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <I size={16} stroke={2} />
                </div>
                <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.2 }}>
                  {s.label}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
                  {s.value}
                </span>
                <span style={{ fontSize: 11.5, color: '#2DD4BF', fontWeight: 700 }}>{s.delta}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Suggested ribbon */}
      <div style={{
        padding: '18px 20px',
        borderRadius: 16,
        background: 'var(--penta-grad-soft)',
        border: '1px solid var(--border)',
        display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: 'var(--penta-grad)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icons.Sparkle size={20} stroke={2} />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>
            {ui.lang === 'es' ? 'Tu asistente Penta encontró 3 snippets duplicados' : 'Your Penta assistant found 3 duplicate snippets'}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {ui.lang === 'es'
              ? 'Detectamos 2 versiones casi idénticas de "Code review" y un prompt de docstrings con baja variación. ¿Quieres consolidarlos?'
              : 'We found 2 nearly identical "Code review" versions and a low-variance docstring prompt. Want to consolidate them?'}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setUI(u => ({ ...u, chat: 'open' }))}>
          {ui.lang === 'es' ? 'Revisar con IA' : 'Review with AI'}
          <Icons.Arrow size={14} stroke={2}/>
        </button>
      </div>

      {/* Recents */}
      <Section title={t.sections.recent} action={
        <button onClick={() => setUI(u => ({ ...u, screen: 'library' }))} className="btn btn-ghost btn-sm">
          {ui.lang === 'es' ? 'Ver todos' : 'See all'} <Icons.ChevR size={12}/>
        </button>
      }>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 12,
        }}>
          {recent.map(s => <SnippetCard key={s.id} s={s} t={t} onOpen={() => openSnippet(s)} variant={variant} />)}
        </div>
      </Section>

      {/* Favs + Team (two columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24 }}>
        <Section title={t.sections.favorites}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {favs.map(s => <SnippetRow key={s.id} s={s} t={t} onOpen={() => openSnippet(s)} />)}
          </div>
        </Section>
        <Section title={t.sections.team}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {team.map(s => <SnippetRow key={s.id} s={s} t={t} onOpen={() => openSnippet(s)} />)}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, action, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 10 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, letterSpacing: '-0.005em', color: 'var(--text)' }}>{title}</h3>
        <div style={{ flex: 1 }} />
        {action}
      </div>
      {children}
    </div>
  );
}

// Compact row used in dashboard lists
function SnippetRow({ s, t, onOpen }) {
  const folder = window.PENTA.FOLDERS.find(f => f.id === s.folder);
  return (
    <div onClick={onOpen} className="card" style={{
      padding: '12px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
      transition: 'all 0.15s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hov)'}
    onMouseLeave={e => e.currentTarget.style.background = ''}>
      <TypeBadge type={s.type} t={t} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap',
                       overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</div>
        <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
          {folder && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: 2, background: folder.color }} />
            {t === window.PENTA.I18N.es ? folder.name_es : folder.name_en}
          </span>}
          <span>·</span>
          <span>{t.uses(s.uses)}</span>
        </div>
      </div>
      {s.fav && <Icons.Star size={13} style={{ color: '#F59E0B', fill: '#F59E0B' }} />}
    </div>
  );
}

// ─── LIBRARY ──────────────────────────────────────────────────────────────
function LibraryScreen({ ui, setUI, t, openSnippet, variant }) {
  const isMobile = variant === 'mobile';
  const [filter, setFilter] = useStateS('all');
  const [view, setView]     = useStateS('grid');
  const [sort, setSort]     = useStateS('recent');

  let list = window.PENTA.SNIPPETS;
  if (ui.screen === 'favorites') list = list.filter(s => s.fav);
  if (ui.screen === 'shared')    list = list.filter(s => s.shared.length > 1);
  if (filter !== 'all') list = list.filter(s => s.type === filter);

  if (sort === 'used')  list = [...list].sort((a, b) => b.uses - a.uses);
  if (sort === 'alpha') list = [...list].sort((a, b) => a.title.localeCompare(b.title));

  const titleMap = {
    library: t.lib_title, favorites: t.nav.favorites, shared: t.nav.shared,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: '-0.025em' }}>
              {titleMap[ui.screen] || t.lib_title}
            </h1>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{t.lib_count(list.length)}</div>
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn btn-primary"><Icons.Plus size={14} stroke={2.2}/>{t.nav.new}</button>
        </div>
      )}

      {/* Filter bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        flexWrap: 'wrap',
        padding: isMobile ? '4px 0' : '4px 0',
      }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button className={cx('chip', filter === 'all' && 'active')} onClick={() => setFilter('all')}>{t.filter_all}</button>
          <button className={cx('chip', filter === 'prompt' && 'active')} onClick={() => setFilter('prompt')}>
            <Icons.Prompt size={11} stroke={2.2}/>{t.types.prompt}
          </button>
          <button className={cx('chip', filter === 'code' && 'active')} onClick={() => setFilter('code')}>
            <Icons.Code size={11} stroke={2.2}/>{t.types.code}
          </button>
          <button className={cx('chip', filter === 'text' && 'active')} onClick={() => setFilter('text')}>
            <Icons.Text size={11} stroke={2.2}/>{t.types.text}
          </button>
        </div>
        <div style={{ flex: 1 }} />
        {!isMobile && (
          <>
            <div style={{ display: 'flex', background: 'var(--surface-2)', border: '1px solid var(--border)',
                            borderRadius: 999, padding: 3 }}>
              {[
                ['recent', t.sort_recent],
                ['used',   t.sort_used],
                ['alpha',  t.sort_alpha],
              ].map(([k, lbl]) => (
                <button key={k} onClick={() => setSort(k)} style={{
                  padding: '5px 11px', fontSize: 12, fontWeight: 600,
                  border: 'none', borderRadius: 999,
                  background: sort === k ? 'var(--surface)' : 'transparent',
                  color: sort === k ? 'var(--text)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  boxShadow: sort === k ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
                }}>{lbl}</button>
              ))}
            </div>
            <div style={{ display: 'flex', background: 'var(--surface-2)', border: '1px solid var(--border)',
                            borderRadius: 10, padding: 3 }}>
              <button onClick={() => setView('grid')} style={{
                padding: 5, borderRadius: 7, border: 'none', cursor: 'pointer',
                background: view === 'grid' ? 'var(--surface)' : 'transparent',
                color: view === 'grid' ? 'var(--text)' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Icons.Grid size={14}/></button>
              <button onClick={() => setView('list')} style={{
                padding: 5, borderRadius: 7, border: 'none', cursor: 'pointer',
                background: view === 'list' ? 'var(--surface)' : 'transparent',
                color: view === 'list' ? 'var(--text)' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Icons.List size={14}/></button>
            </div>
          </>
        )}
      </div>

      {/* Grid */}
      {view === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 12,
        }}>
          {list.map(s => <SnippetCard key={s.id} s={s} t={t} onOpen={() => openSnippet(s)} variant={variant} />)}
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          {list.map((s, i) => (
            <div key={s.id} onClick={() => openSnippet(s)} style={{
              padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14,
              cursor: 'pointer',
              borderTop: i ? '1px solid var(--border)' : 'none',
              transition: 'background 0.12s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hov)'}
            onMouseLeave={e => e.currentTarget.style.background = ''}>
              <TypeBadge type={s.type} t={t} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {s.desc}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {s.tags.slice(0, 2).map(tag => <span key={tag} className="tag">#{tag}</span>)}
              </div>
              <AvatarStack people={s.shared} size={20} />
              <span style={{ fontSize: 11.5, color: 'var(--text-dim)', minWidth: 60, textAlign: 'right' }}>
                {t.uses(s.uses)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SNIPPET DETAIL / EDITOR ──────────────────────────────────────────────
function SnippetDetailScreen({ ui, setUI, t, closeSnippet, variant }) {
  const s = ui.activeSnippet || window.PENTA.SNIPPETS[0];
  const folder = window.PENTA.FOLDERS.find(f => f.id === s.folder);
  const isMobile = variant === 'mobile';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 980 }}>
      {/* Header */}
      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-muted)' }}>
          <button onClick={closeSnippet} className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }}>
            <Icons.ChevL size={12}/> {t.nav.library}
          </button>
          <span>/</span>
          {folder && <span>{t === window.PENTA.I18N.es ? folder.name_es : folder.name_en}</span>}
          <span>/</span>
          <span style={{ color: 'var(--text)' }}>{s.title}</span>
        </div>
      )}

      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <TypeBadge type={s.type} t={t} />
            {folder && <span className="chip" style={{ cursor: 'default' }}>
              <span style={{ width: 7, height: 7, borderRadius: 2, background: folder.color }} />
              {t === window.PENTA.I18N.es ? folder.name_es : folder.name_en}
            </span>}
            <span className="chip" style={{ cursor: 'default' }}>
              <Icons.History size={11}/> {s.version}
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: isMobile ? 20 : 26, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.2 }}>
            {s.title}
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {s.desc}
          </p>
        </div>
        {!isMobile && (
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn"><Icons.Star size={14}/> {s.fav ? '★' : '☆'}</button>
            <button className="btn"><Icons.Copy size={14}/> {t.copy}</button>
            <button className="btn"><Icons.Share size={14}/> {ui.lang === 'es' ? 'Compartir' : 'Share'}</button>
            <button className="btn btn-primary" onClick={() => setUI(u => ({ ...u, chat: 'open' }))}>
              <Icons.Sparkle size={14} stroke={2}/>{t.run_ai}
            </button>
          </div>
        )}
      </div>

      {/* Tags + meta */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        {s.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
        <span style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-muted)' }}>
          <Avatar initials={s.author.initials} color={s.author.color} size={20}/>
          <span>{s.author.name}</span>
          <span>·</span>
          <span>{t === window.PENTA.I18N.es ? s.updated : s.updated_en}</span>
          <span>·</span>
          <span>{t.uses(s.uses)}</span>
        </div>
      </div>

      {/* Editor */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {/* Editor toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px',
                      borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
          <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {s.lang}
          </span>
          <span style={{ flex: 1 }} />
          <button className="btn btn-ghost btn-sm"><Icons.History size={12}/> {t.versions}</button>
          <button className="btn btn-ghost btn-sm"><Icons.Copy size={12}/> {t.copy}</button>
        </div>
        {/* Code body */}
        <pre style={{
          margin: 0, padding: '18px 20px',
          fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.65,
          background: 'var(--code-bg)', color: '#D6E2FF',
          overflow: 'auto', maxHeight: 360,
          whiteSpace: 'pre-wrap',
        }}>
          {syntaxHighlight(s.body, s.lang)}
        </pre>
      </div>

      {/* Variables + sharing */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: 16 }}>
        {/* Variables */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Icons.Variable size={14}/>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{t.variables}</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-dim)' }}>{s.vars.length}</span>
          </div>
          {s.vars.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {s.vars.map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10,
                                       padding: '8px 10px', background: 'var(--surface-2)',
                                       borderRadius: 10, border: '1px solid var(--border)' }}>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>
                    {v}
                  </code>
                  <input placeholder={ui.lang === 'es' ? 'valor por defecto…' : 'default value…'}
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none',
                             fontSize: 12.5, color: 'var(--text)' }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>
              {ui.lang === 'es' ? 'Este snippet no tiene variables.' : 'No variables in this snippet.'}
            </div>
          )}
        </div>

        {/* History + sharing */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Icons.History size={14}/>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{t.versions}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['v4', 'v3', 'v2', 'v1'].slice(0, 3).map((v, i) => (
              <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 10,
                                    fontSize: 12, padding: '6px 0' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700,
                                color: i === 0 ? 'var(--accent)' : 'var(--text-muted)' }}>{v}</span>
                <span style={{ flex: 1, color: 'var(--text-muted)' }}>
                  {i === 0
                    ? (ui.lang === 'es' ? 'Añadir cobertura' : 'Add coverage')
                    : i === 1
                      ? (ui.lang === 'es' ? 'Refinar tono' : 'Refine tone')
                      : (ui.lang === 'es' ? 'Versión inicial' : 'Initial version')}
                </span>
                <span style={{ fontSize: 10.5, color: 'var(--text-dim)' }}>{i === 0 ? '2h' : `${(i+1)*2}d`}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Icons.Share size={14}/>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{t.shared_with}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AvatarStack people={s.shared} size={26} max={5} />
              <button className="btn btn-sm" style={{ marginLeft: 'auto' }}>
                <Icons.Plus size={11}/> {ui.lang === 'es' ? 'Invitar' : 'Invite'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile action bar */}
      {isMobile && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" style={{ flex: 1 }}><Icons.Copy size={14}/>{t.copy}</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setUI(u => ({ ...u, chat: 'open' }))}>
            <Icons.Sparkle size={14} stroke={2}/>{t.run_ai}
          </button>
        </div>
      )}
    </div>
  );
}

// Minimal syntax tint — just colorize keywords, strings, comments
function syntaxHighlight(code, lang) {
  const tokenize = (line) => {
    const parts = [];
    const re = /(\{\{[^}]+\}\})|("[^"]*"|'[^']*'|`[^`]*`)|(\/\/[^\n]*|#[^\n]*)|(\b(import|from|export|const|let|var|return|function|async|await|if|else|for|while|in|of|class|new|true|false|null|None|True|False|def|self|SELECT|FROM|WHERE|ORDER|BY|LIMIT|GROUP|HAVING|JOIN|ON|AS|INSERT|UPDATE|DELETE|VALUES|use[A-Z]\w*)\b)|(\b[A-Z][A-Za-z0-9_]*)|(\b\d+\b)/g;
    let last = 0, m;
    while ((m = re.exec(line)) !== null) {
      if (m.index > last) parts.push({ text: line.slice(last, m.index) });
      if (m[1])      parts.push({ text: m[0], color: '#2DD4BF', weight: 600 });   // template vars
      else if (m[2]) parts.push({ text: m[0], color: '#FBBF77' });               // strings
      else if (m[3]) parts.push({ text: m[0], color: '#6B7BA8', style: 'italic' });// comments
      else if (m[4]) parts.push({ text: m[0], color: '#5BA8F2', weight: 600 });  // keywords
      else if (m[6]) parts.push({ text: m[0], color: '#9C86FF' });               // numbers
      else if (m[5]) parts.push({ text: m[0], color: '#E8EEFB' });               // types
      else parts.push({ text: m[0] });
      last = re.lastIndex;
    }
    if (last < line.length) parts.push({ text: line.slice(last) });
    return parts;
  };
  return code.split('\n').map((ln, i) => (
    <div key={i} style={{ display: 'flex' }}>
      <span style={{ color: '#3A4868', userSelect: 'none', minWidth: 28, textAlign: 'right',
                     marginRight: 14, fontVariantNumeric: 'tabular-nums', fontSize: 11.5, paddingTop: 1 }}>
        {i + 1}
      </span>
      <span style={{ flex: 1, whiteSpace: 'pre-wrap' }}>
        {tokenize(ln).map((p, j) => (
          <span key={j} style={{ color: p.color, fontWeight: p.weight, fontStyle: p.style }}>{p.text}</span>
        ))}
      </span>
    </div>
  ));
}

// ─── AI ASSISTANT (full-page) ─────────────────────────────────────────────
function AIScreen({ ui, setUI, t, variant }) {
  const isMobile = variant === 'mobile';
  const sessions = [
    { id: 1, title: ui.lang === 'es' ? 'Mejorar prompt Code review' : 'Improve Code review prompt', when: '2h', active: true },
    { id: 2, title: ui.lang === 'es' ? 'Traducir snippets a inglés' : 'Translate snippets to English', when: '1d' },
    { id: 3, title: ui.lang === 'es' ? 'Tests para useDebounce hook'   : 'Tests for useDebounce hook',   when: '3d' },
    { id: 4, title: ui.lang === 'es' ? 'Consolidar prompts duplicados' : 'Consolidate duplicate prompts', when: '5d' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 920 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'var(--penta-grad)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 12px 28px -8px rgba(31,123,214,0.5)',
        }}>
          <Icons.Sparkle size={26} stroke={2}/>
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: isMobile ? 22 : 28, fontWeight: 800, letterSpacing: '-0.025em' }}>
            {t.ai_title}
          </h1>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{t.ai_sub}</div>
        </div>
      </div>

      {/* Quick action grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: 10,
      }}>
        {Object.entries(t.ai_actions).map(([k, v]) => {
          const colors = {
            improve:   ['#2DD4BF', Icons.Bolt],
            summarize: ['#1F7BD6', Icons.Text],
            translate: ['#7C5BFF', Icons.Globe],
            explain:   ['#F59E0B', Icons.Prompt],
            gen_tests: ['#EC4899', Icons.Code],
            to_prompt: ['#5BA8F2', Icons.Sparkle],
          };
          const [color, I] = colors[k];
          return (
            <button key={k} className="card" style={{
              padding: 14, textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: color + '22', color, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <I size={16} stroke={2}/>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{v}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {ui.lang === 'es' ? 'Sobre el snippet seleccionado' : 'On the selected snippet'}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Recent sessions */}
      <Section title={ui.lang === 'es' ? 'Conversaciones recientes' : 'Recent conversations'}>
        <div className="card" style={{ overflow: 'hidden' }}>
          {sessions.map((s, i) => (
            <div key={s.id} style={{
              padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
              cursor: 'pointer',
              borderTop: i ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ width: 28, height: 28, borderRadius: 9,
                              background: s.active ? 'var(--penta-grad)' : 'var(--surface-2)',
                              color: s.active ? '#fff' : 'var(--text-muted)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.Sparkle size={14}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{s.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                  {ui.lang === 'es' ? 'hace ' : ''}{s.when}{ui.lang === 'es' ? '' : ' ago'} · 12 mensajes
                </div>
              </div>
              {s.active && <span className="tag" style={{ background: 'rgba(45,212,191,0.18)' }}>Activa</span>}
              <Icons.ChevR size={14} style={{ color: 'var(--text-dim)' }}/>
            </div>
          ))}
        </div>
      </Section>

      {!isMobile && (
        <div style={{
          padding: 16, borderRadius: 14, border: '1px dashed var(--border-strong)',
          fontSize: 12.5, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Icons.Lock size={14}/>
          {ui.lang === 'es'
            ? 'Las conversaciones con Penta AI nunca salen del workspace de tu equipo. Nada se usa para entrenar modelos externos.'
            : 'Conversations with Penta AI never leave your team workspace. Nothing is used to train external models.'}
        </div>
      )}
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────
function SettingsScreen({ ui, setUI, t, variant }) {
  const isMobile = variant === 'mobile';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
      <h1 style={{ margin: 0, fontSize: isMobile ? 22 : 28, fontWeight: 800, letterSpacing: '-0.025em' }}>
        {t.settings_title}
      </h1>

      {/* Profile */}
      <div className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
        <Avatar initials="DR" color="#2DD4BF" size={56}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Daniela Restrepo</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>daniela.restrepo@penta.com.co · Frontend Lead</div>
        </div>
        <button className="btn btn-sm">{ui.lang === 'es' ? 'Editar' : 'Edit'}</button>
      </div>

      {/* Theme */}
      <Settings.Row label={t.theme} icon={Icons.Sun}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { id: 'light', label: t.theme_light, icon: Icons.Sun },
            { id: 'dark',  label: t.theme_dark,  icon: Icons.Moon },
          ].map(opt => {
            const I = opt.icon;
            const active = ui.theme === opt.id;
            return (
              <button key={opt.id} onClick={() => setUI(u => ({ ...u, theme: opt.id }))} style={{
                flex: 1, padding: '12px 14px',
                borderRadius: 12,
                border: active ? '2px solid var(--accent)' : '1px solid var(--border)',
                background: active ? 'var(--penta-grad-soft)' : 'var(--surface-2)',
                color: 'var(--text)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 13, fontWeight: 600,
              }}>
                <I size={15}/> {opt.label}
              </button>
            );
          })}
        </div>
      </Settings.Row>

      <Settings.Row label={t.language} icon={Icons.Globe}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['es', 'Español'], ['en', 'English']].map(([k, lbl]) => {
            const active = ui.lang === k;
            return (
              <button key={k} onClick={() => setUI(u => ({ ...u, lang: k }))} style={{
                flex: 1, padding: '10px 14px',
                borderRadius: 12,
                border: active ? '2px solid var(--accent)' : '1px solid var(--border)',
                background: active ? 'var(--penta-grad-soft)' : 'var(--surface-2)',
                color: 'var(--text)', cursor: 'pointer',
                fontSize: 13, fontWeight: 600,
              }}>{lbl}</button>
            );
          })}
        </div>
      </Settings.Row>

      <Settings.Row label={t.shortcuts} icon={Icons.Cmd}
        sub={ui.lang === 'es' ? 'Atajos de teclado y paleta de comandos' : 'Keyboard shortcuts & command palette'}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px 16px', fontSize: 12.5 }}>
          {[
            [t.search_ph, '⌘ K'],
            [t.nav.new,  '⌘ N'],
            [t.ai_title, '⌘ J'],
            [ui.lang === 'es' ? 'Cambiar tema' : 'Toggle theme', '⌘ ⇧ T'],
          ].map(([k, v], i) => (
            <React.Fragment key={i}>
              <span style={{ color: 'var(--text-muted)' }}>{k}</span>
              <span className="kbd">{v}</span>
            </React.Fragment>
          ))}
        </div>
      </Settings.Row>

      <Settings.Row label={t.integrations} icon={Icons.Bolt}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { name: 'GitHub',     status: 'connected', sub: 'Daniela R. · penta-co' },
            { name: 'Slack',      status: 'connected', sub: '#equipo-frontend' },
            { name: 'Notion',     status: 'off',       sub: ui.lang === 'es' ? 'No conectado' : 'Not connected' },
            { name: 'VS Code',    status: 'connected', sub: ui.lang === 'es' ? 'Extensión v1.4' : 'Extension v1.4' },
          ].map(int => (
            <div key={int.name} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 10, border: '1px solid var(--border)',
            }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--surface-3)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 700, fontSize: 12 }}>{int.name[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{int.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{int.sub}</div>
              </div>
              <span className="tag" style={{
                background: int.status === 'connected' ? 'rgba(45,212,191,0.16)' : 'var(--pill-bg)',
                color: int.status === 'connected' ? '#2DD4BF' : 'var(--text-dim)',
              }}>
                {int.status === 'connected'
                  ? (ui.lang === 'es' ? 'Conectado' : 'Connected')
                  : (ui.lang === 'es' ? 'Conectar' : 'Connect')}
              </span>
            </div>
          ))}
        </div>
      </Settings.Row>

      <button className="btn" style={{ alignSelf: 'flex-start', color: '#F87171' }}>
        <Icons.Logout size={14}/> {t.sign_out}
      </button>
    </div>
  );
}

const Settings = {
  Row({ label, icon: I, sub, children }) {
    return (
      <div className="card" style={{ padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          {I && <I size={14} />}
          <span style={{ fontSize: 13.5, fontWeight: 700 }}>{label}</span>
          {sub && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}> · {sub}</span>}
        </div>
        {children}
      </div>
    );
  },
};

Object.assign(window, {
  DashboardScreen, LibraryScreen, SnippetDetailScreen, AIScreen, SettingsScreen,
  SnippetCard, SnippetRow,
});
