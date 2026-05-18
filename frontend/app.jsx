/* PENTA · App shell — desktop + mobile variants of the AI Snippet Organizer */
/* eslint-disable react/jsx-pascal-case */
const { useState, useEffect, useRef, useMemo } = React;

// ─── helpers ──────────────────────────────────────────────────────────────
const cx = (...a) => a.filter(Boolean).join(' ');

function Avatar({ initials, color, size = 28, ring = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: color, color: '#0A1B3D',
      fontSize: size * 0.4, fontWeight: 700,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      boxShadow: ring ? '0 0 0 2px var(--surface), 0 0 0 3px ' + color : 'none',
      letterSpacing: '-0.02em',
    }}>{initials}</div>
  );
}

function AvatarStack({ people, max = 3, size = 22 }) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  const team = window.PENTA.TEAM;
  return (
    <div style={{ display: 'inline-flex' }}>
      {shown.map((inits, i) => {
        const t = team.find(x => x.initials === inits) || { initials: inits, color: '#8A99C2' };
        return (
          <div key={i} style={{ marginLeft: i ? -8 : 0, border: '2px solid var(--surface)', borderRadius: 999, lineHeight: 0 }}>
            <Avatar initials={t.initials} color={t.color} size={size} />
          </div>
        );
      })}
      {extra > 0 && (
        <div style={{ marginLeft: -8, border: '2px solid var(--surface)',
                      background: 'var(--surface-2)', color: 'var(--text-muted)',
                      width: size, height: size, borderRadius: 999, fontSize: size*0.36, fontWeight: 700,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          +{extra}
        </div>
      )}
    </div>
  );
}

function TypeBadge({ type, t }) {
  const map = {
    prompt: { icon: Icons.Prompt, bg: 'rgba(45,212,191,0.14)', fg: '#2DD4BF' },
    code:   { icon: Icons.Code,   bg: 'rgba(31,123,214,0.14)', fg: '#5BA8F2' },
    text:   { icon: Icons.Text,   bg: 'rgba(124,91,255,0.14)', fg: '#9C86FF' },
  };
  const c = map[type];
  const I = c.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px 3px 7px', borderRadius: 999,
      background: c.bg, color: c.fg, fontSize: 11, fontWeight: 700,
      letterSpacing: '0.02em',
    }}>
      <I size={11} stroke={2} />
      {t.types[type]}
    </span>
  );
}

// ─── Top Bar ──────────────────────────────────────────────────────────────
function TopBar({ ui, setUI, t, openCmd }) {
  return (
    <div style={{
      height: 60,
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '0 22px',
      background: 'color-mix(in oklab, var(--surface) 70%, transparent)',
      backdropFilter: 'blur(12px)',
      position: 'relative', zIndex: 5,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 200 }}>
        <img src="assets/penta-logo.png" alt="Penta" style={{ height: 28, width: 'auto' }} />
        <div style={{
          height: 18, width: 1, background: 'var(--border-strong)', margin: '0 2px',
        }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '-0.01em' }}>
          {t.brand_tag}
        </span>
      </div>

      {/* Search / Command palette trigger */}
      <button onClick={openCmd} style={{
        flex: 1, maxWidth: 560,
        display: 'flex', alignItems: 'center', gap: 10,
        height: 36, padding: '0 14px',
        borderRadius: 10,
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        color: 'var(--text-dim)',
        cursor: 'text',
        font: 'inherit', fontSize: 13,
        textAlign: 'left',
      }}>
        <Icons.Search size={15} />
        <span style={{ flex: 1 }}>{t.search_ph}</span>
        <span className="kbd">⌘ K</span>
      </button>

      <div style={{ flex: 1 }} />

      {/* Language */}
      <div style={{
        display: 'flex', alignItems: 'center', background: 'var(--surface-2)',
        border: '1px solid var(--border)', borderRadius: 999, padding: 2,
      }}>
        {['es', 'en'].map(l => (
          <button key={l} onClick={() => setUI(u => ({ ...u, lang: l }))} style={{
            padding: '4px 10px',
            borderRadius: 999,
            border: 'none',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
            cursor: 'pointer',
            background: ui.lang === l ? 'var(--penta-grad)' : 'transparent',
            color: ui.lang === l ? '#fff' : 'var(--text-muted)',
            textTransform: 'uppercase',
          }}>{l}</button>
        ))}
      </div>

      {/* Theme toggle */}
      <button className="btn btn-ghost" onClick={() => setUI(u => ({ ...u, theme: u.theme === 'dark' ? 'light' : 'dark' }))}
              style={{ padding: 8, borderRadius: 10 }} aria-label="Toggle theme">
        {ui.theme === 'dark' ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}
      </button>

      <button className="btn btn-ghost" style={{ padding: 8, borderRadius: 10, position: 'relative' }}>
        <Icons.Bell size={16} />
        <span style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, background: '#F59E0B', borderRadius: 999, border: '2px solid var(--surface)' }} />
      </button>

      <Avatar initials="DR" color="#2DD4BF" size={32} />
    </div>
  );
}

// ─── Sidebar (Desktop) ────────────────────────────────────────────────────
function Sidebar({ ui, setUI, t }) {
  const nav = [
    { id: 'dashboard', label: t.nav.dashboard, icon: Icons.Home,    badge: null },
    { id: 'library',   label: t.nav.library,   icon: Icons.Library, badge: '142' },
    { id: 'favorites', label: t.nav.favorites, icon: Icons.Star,    badge: '18' },
    { id: 'shared',    label: t.nav.shared,    icon: Icons.Share,   badge: null },
    { id: 'ai',        label: t.nav.ai,        icon: Icons.Sparkle, badge: null, ai: true },
  ];
  const folders = window.PENTA.FOLDERS;
  const lang = ui.lang;

  return (
    <aside style={{
      width: 244, flexShrink: 0,
      borderRight: '1px solid var(--border)',
      padding: '20px 14px 14px',
      display: 'flex', flexDirection: 'column', gap: 4,
      background: 'color-mix(in oklab, var(--surface) 40%, transparent)',
      overflow: 'auto',
    }}>
      <button className="btn btn-primary" style={{
        justifyContent: 'flex-start', padding: '10px 14px', marginBottom: 10, borderRadius: 12,
      }}>
        <Icons.Plus size={16} stroke={2.2} /> {t.nav.new}
        <span style={{ flex: 1 }} />
        <span style={{ background: 'rgba(255,255,255,0.18)', padding: '2px 7px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>
          ⌘ N
        </span>
      </button>

      {nav.map(n => {
        const I = n.icon;
        const active = ui.screen === n.id;
        return (
          <button key={n.id} onClick={() => setUI(u => ({ ...u, screen: n.id }))} style={{
            display: 'flex', alignItems: 'center', gap: 11,
            padding: '9px 12px',
            borderRadius: 10,
            border: 'none',
            background: active ? 'var(--surface-hov)' : 'transparent',
            color: active ? 'var(--text)' : 'var(--text-muted)',
            fontSize: 13.5, fontWeight: active ? 600 : 500,
            cursor: 'pointer',
            position: 'relative',
            textAlign: 'left',
          }}>
            {active && <div style={{
              position: 'absolute', left: -14, top: 8, bottom: 8, width: 3,
              background: 'var(--penta-grad)', borderRadius: '0 3px 3px 0',
            }} />}
            <I size={16} />
            <span style={{ flex: 1 }}>{n.label}</span>
            {n.ai && (
              <span className="ai-glow" style={{
                fontSize: 9, fontWeight: 800, color: '#fff',
                padding: '2px 6px', borderRadius: 999, letterSpacing: '0.06em',
              }}>AI</span>
            )}
            {n.badge && <span style={{ fontSize: 11, color: 'var(--text-dim)', fontVariantNumeric: 'tabular-nums' }}>{n.badge}</span>}
          </button>
        );
      })}

      {/* Folders */}
      <div style={{ marginTop: 18, padding: '0 12px', fontSize: 11, fontWeight: 700,
                     color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase',
                     display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{ flex: 1 }}>{t.folders_title}</span>
        <button className="btn btn-ghost" style={{ padding: 2, borderRadius: 6 }}>
          <Icons.Plus size={12} />
        </button>
      </div>

      {folders.map(f => (
        <button key={f.id} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '7px 12px', borderRadius: 9,
          border: 'none', background: 'transparent',
          color: 'var(--text-muted)', fontSize: 13,
          cursor: 'pointer', textAlign: 'left',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: f.color }} />
          <span style={{ flex: 1 }}>{lang === 'es' ? f.name_es : f.name_en}</span>
          <span style={{ fontSize: 11, color: 'var(--text-dim)', fontVariantNumeric: 'tabular-nums' }}>{f.count}</span>
        </button>
      ))}

      {/* Tags */}
      <div style={{ marginTop: 18, padding: '0 12px 6px', fontSize: 11, fontWeight: 700,
                     color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {t.tags_title}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, padding: '0 10px' }}>
        {window.PENTA.TAGS.slice(0, 10).map(tag => (
          <span key={tag} className="tag" style={{ cursor: 'pointer' }}>#{tag}</span>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Settings link */}
      <button onClick={() => setUI(u => ({ ...u, screen: 'settings' }))} style={{
        display: 'flex', alignItems: 'center', gap: 11,
        padding: '9px 12px', borderRadius: 10,
        border: 'none', background: ui.screen === 'settings' ? 'var(--surface-hov)' : 'transparent',
        color: ui.screen === 'settings' ? 'var(--text)' : 'var(--text-muted)',
        fontSize: 13.5, fontWeight: 500, cursor: 'pointer', textAlign: 'left',
      }}>
        <Icons.Settings size={16} />
        {t.nav.settings}
      </button>
    </aside>
  );
}

// ─── AI Chat Bubble (always-on right panel) ───────────────────────────────
function AIChatPanel({ ui, setUI, t, variant }) {
  const isMobile = variant === 'mobile';
  const [history, setHistory] = useState(window.PENTA.AI_HISTORY_DEFAULT);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, thinking]);

  const send = () => {
    if (!input.trim()) return;
    const u = input.trim();
    setInput('');
    setHistory(h => [...h, { role: 'user', text: u }]);
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setHistory(h => [...h, {
        role: 'assistant',
        text: ui.lang === 'es'
          ? 'Listo. Generé una variante con tu instrucción aplicada. ¿La guardo como nueva versión del snippet activo?'
          : 'Done. I generated a variant with your instruction applied. Shall I save it as a new version of the active snippet?',
        actions: ui.lang === 'es' ? ['Guardar versión', 'Ver diff', 'Descartar'] : ['Save version', 'View diff', 'Discard'],
      }]);
    }, 1200);
  };

  // Floating bubble (collapsed)
  if (ui.chat === 'min') {
    return (
      <button onClick={() => setUI(u => ({ ...u, chat: 'open' }))} style={{
        position: 'absolute',
        right: isMobile ? 16 : 22,
        bottom: isMobile ? 84 : 22,
        width: 56, height: 56, borderRadius: 999,
        background: 'var(--penta-grad)',
        border: 'none', cursor: 'pointer',
        boxShadow: '0 16px 40px -8px rgba(31,123,214,0.55), 0 4px 12px rgba(0,0,0,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', zIndex: 30,
      }}>
        <Icons.Sparkle size={22} stroke={2} />
        <span style={{
          position: 'absolute', top: -4, right: -4,
          background: '#F59E0B', color: '#fff', fontSize: 9, fontWeight: 800,
          padding: '2px 5px', borderRadius: 999, border: '2px solid var(--bg)',
        }}>2</span>
      </button>
    );
  }

  // On mobile: bottom sheet style
  const panelStyle = isMobile ? {
    position: 'absolute', left: 8, right: 8, bottom: 76,
    top: 56,
    borderRadius: 18,
  } : {
    position: 'absolute', right: 14, top: 74, bottom: 14,
    width: 340, borderRadius: 18,
  };

  return (
    <div style={{
      ...panelStyle,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-pop)',
      display: 'flex', flexDirection: 'column',
      zIndex: 30,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 12,
        background: 'var(--penta-grad-soft)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          background: 'var(--penta-grad)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
        }}>
          <Icons.Sparkle size={18} stroke={2} />
        </div>
        <div style={{ flex: 1, lineHeight: 1.25 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>{t.ai_title}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, background: '#2DD4BF', borderRadius: 999, boxShadow: '0 0 0 3px rgba(45,212,191,0.18)' }} />
            {t.ai_sub}
          </div>
        </div>
        <button onClick={() => setUI(u => ({ ...u, chat: 'min' }))} className="btn btn-ghost" style={{ padding: 5, borderRadius: 8 }}>
          <Icons.Min size={16} />
        </button>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 6, padding: '10px 12px', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        {Object.entries(t.ai_actions).map(([k, v]) => (
          <button key={k} className="chip" style={{ flexShrink: 0 }}>
            <Icons.Bolt size={11} stroke={2.2} />{v}
          </button>
        ))}
      </div>

      {/* Conversation */}
      <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {history.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6,
                                 alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.role === 'assistant' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                <span className="ai-glow" style={{ width: 12, height: 12, borderRadius: 4 }} />
                Penta AI
              </div>
            )}
            <div style={{
              maxWidth: '88%',
              padding: '10px 12px',
              borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '4px 14px 14px 14px',
              background: m.role === 'user' ? 'var(--penta-grad)' : 'var(--surface-2)',
              color: m.role === 'user' ? '#fff' : 'var(--text)',
              fontSize: 13, lineHeight: 1.5,
              border: m.role === 'user' ? 'none' : '1px solid var(--border)',
            }}>
              {m.text}
            </div>
            {m.actions && (
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {m.actions.map((a, j) => (
                  <button key={j} className="btn btn-sm" style={{ fontSize: 11 }}>{a}</button>
                ))}
              </div>
            )}
          </div>
        ))}
        {thinking && (
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '6px 12px',
                        background: 'var(--surface-2)', borderRadius: '4px 14px 14px 14px',
                        width: 'fit-content', border: '1px solid var(--border)' }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                width: 6, height: 6, borderRadius: 999, background: 'var(--text-dim)',
                animation: `pentaShimmer 1.2s ${i*0.15}s infinite`,
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 8,
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 14, padding: '8px 8px 8px 12px',
        }}>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={t.ai_input_ph} rows={1}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              resize: 'none', fontSize: 13, color: 'var(--text)', lineHeight: 1.4,
              maxHeight: 100,
            }} />
          <button onClick={send} style={{
            width: 32, height: 32, borderRadius: 10,
            background: input.trim() ? 'var(--penta-grad)' : 'var(--surface-3)',
            color: input.trim() ? '#fff' : 'var(--text-dim)',
            border: 'none', cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}>
            <Icons.Send size={15} stroke={2} />
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, fontSize: 10.5, color: 'var(--text-dim)' }}>
          <Icons.Lock size={10} /> Solo tu equipo de PENTA puede ver esta conversación
        </div>
      </div>
    </div>
  );
}

// ─── Mobile bottom nav ────────────────────────────────────────────────────
function MobileBottomNav({ ui, setUI, t }) {
  const items = [
    { id: 'dashboard', label: t.nav.dashboard, icon: Icons.Home },
    { id: 'library',   label: t.nav.library,   icon: Icons.Library },
    { id: 'new',       label: '',              icon: Icons.Plus, primary: true },
    { id: 'favorites', label: t.nav.favorites, icon: Icons.Star },
    { id: 'settings',  label: t.nav.settings,  icon: Icons.Settings },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      height: 68, paddingBottom: 8,
      background: 'color-mix(in oklab, var(--surface) 92%, transparent)',
      backdropFilter: 'blur(14px)',
      borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      zIndex: 20,
    }}>
      {items.map(it => {
        const I = it.icon;
        const active = ui.screen === it.id;
        if (it.primary) {
          return (
            <button key={it.id} style={{
              width: 48, height: 48, borderRadius: 16,
              background: 'var(--penta-grad)', color: '#fff', border: 'none',
              boxShadow: '0 10px 24px -6px rgba(31,123,214,0.55)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: -16,
            }}>
              <I size={22} stroke={2.2} />
            </button>
          );
        }
        return (
          <button key={it.id} onClick={() => setUI(u => ({ ...u, screen: it.id }))} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            border: 'none', background: 'transparent',
            color: active ? 'var(--text)' : 'var(--text-dim)',
            fontSize: 10, fontWeight: 600, cursor: 'pointer',
            padding: '6px 14px',
          }}>
            <I size={20} stroke={active ? 2.2 : 1.7} />
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Mobile top bar ───────────────────────────────────────────────────────
function MobileTopBar({ ui, setUI, t, title, back, openCmd }) {
  return (
    <div style={{
      height: 56, flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '0 14px',
      borderBottom: '1px solid var(--border)',
      background: 'color-mix(in oklab, var(--surface) 78%, transparent)',
      backdropFilter: 'blur(14px)',
      position: 'relative', zIndex: 5,
    }}>
      {back ? (
        <button onClick={back} className="btn btn-ghost" style={{ padding: 6, borderRadius: 10 }}>
          <Icons.ChevL size={20} />
        </button>
      ) : (
        <img src="assets/penta-logo.png" alt="Penta" style={{ height: 22, width: 'auto' }} />
      )}
      <div style={{ flex: 1, fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', textAlign: back ? 'center' : 'left' }}>
        {title}
      </div>
      <button onClick={openCmd} className="btn btn-ghost" style={{ padding: 6, borderRadius: 10 }}>
        <Icons.Search size={18} />
      </button>
      <button onClick={() => setUI(u => ({ ...u, theme: u.theme === 'dark' ? 'light' : 'dark' }))} className="btn btn-ghost" style={{ padding: 6, borderRadius: 10 }}>
        {ui.theme === 'dark' ? <Icons.Sun size={18} /> : <Icons.Moon size={18} />}
      </button>
    </div>
  );
}

// ─── Command Palette ──────────────────────────────────────────────────────
function CommandPalette({ open, onClose, t, setUI }) {
  const [q, setQ] = useState('');
  if (!open) return null;
  const items = [
    { icon: Icons.Plus,     label: t.nav.new,        kbd: '⌘ N' },
    { icon: Icons.Sparkle,  label: t.ai_title,       kbd: '⌘ J', go: 'ai' },
    { icon: Icons.Library,  label: t.nav.library,    kbd: '⌘ L', go: 'library' },
    { icon: Icons.Home,     label: t.nav.dashboard,  kbd: '⌘ H', go: 'dashboard' },
    { icon: Icons.Star,     label: t.nav.favorites,  kbd: '⌘ F', go: 'favorites' },
    { icon: Icons.Settings, label: t.nav.settings,   kbd: '⌘ ,', go: 'settings' },
  ];
  const filtered = items.filter(i => i.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(5,14,34,0.5)',
      backdropFilter: 'blur(4px)', zIndex: 50,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      paddingTop: '12vh',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 'min(540px, calc(100% - 32px))',
        background: 'var(--surface)', border: '1px solid var(--border-strong)',
        borderRadius: 16, boxShadow: 'var(--shadow-pop)', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
          <Icons.Search size={16} />
          <input autoFocus value={q} onChange={e => setQ(e.target.value)}
            placeholder={t.search_ph}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14 }} />
          <span className="kbd">esc</span>
        </div>
        <div style={{ maxHeight: 320, overflow: 'auto', padding: 6 }}>
          {filtered.map((it, i) => {
            const I = it.icon;
            return (
              <button key={i} onClick={() => { if (it.go) setUI(u => ({ ...u, screen: it.go })); onClose(); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 10,
                border: 'none', background: i === 0 ? 'var(--surface-hov)' : 'transparent',
                color: 'var(--text)', fontSize: 13.5, cursor: 'pointer', textAlign: 'left',
              }}>
                <I size={16} />
                <span style={{ flex: 1 }}>{it.label}</span>
                <span className="kbd">{it.kbd}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Root App (variant: desktop | mobile) ─────────────────────────────────
function PentaApp({ variant, sharedUI, setSharedUI }) {
  const [localUI, setLocalUI] = useState({
    screen: 'dashboard',
    chat: variant === 'mobile' ? 'min' : 'open',
    cmd: false,
    activeSnippet: null,
  });

  // Sync theme + lang from shared state
  const ui = { ...localUI, theme: sharedUI.theme, lang: sharedUI.lang };
  const setUI = (fn) => {
    setLocalUI(prev => {
      const next = typeof fn === 'function' ? fn({ ...prev, theme: sharedUI.theme, lang: sharedUI.lang }) : fn;
      // Propagate theme/lang to shared
      if (next.theme !== sharedUI.theme || next.lang !== sharedUI.lang) {
        setSharedUI(s => ({ ...s, theme: next.theme ?? s.theme, lang: next.lang ?? s.lang }));
      }
      const { theme, lang, ...rest } = next;
      return rest;
    });
  };

  const t = window.PENTA.I18N[ui.lang];
  const isMobile = variant === 'mobile';

  // Open snippet
  const openSnippet = (s) => setUI(u => ({ ...u, activeSnippet: s, screen: 'detail' }));
  const closeSnippet = () => setUI(u => ({ ...u, activeSnippet: null, screen: 'library' }));

  // Render screen
  const screenProps = { ui, setUI, t, openSnippet, closeSnippet, variant };
  let screen;
  switch (ui.screen) {
    case 'dashboard': screen = <DashboardScreen {...screenProps} />; break;
    case 'library':
    case 'favorites':
    case 'shared':    screen = <LibraryScreen {...screenProps} />; break;
    case 'detail':    screen = <SnippetDetailScreen {...screenProps} />; break;
    case 'ai':        screen = <AIScreen {...screenProps} />; break;
    case 'settings':  screen = <SettingsScreen {...screenProps} />; break;
    default:          screen = <DashboardScreen {...screenProps} />;
  }

  const titleMap = {
    dashboard: t.nav.dashboard, library: t.nav.library, favorites: t.nav.favorites,
    shared: t.nav.shared, ai: t.ai_title, settings: t.nav.settings,
    detail: ui.activeSnippet?.title || t.nav.library,
  };

  return (
    <div className={cx('penta-app', `theme-${ui.theme}`, isMobile && 'is-mobile')}>
      {!isMobile && <TopBar ui={ui} setUI={setUI} t={t} openCmd={() => setUI(u => ({ ...u, cmd: true }))} />}
      {isMobile && <MobileTopBar ui={ui} setUI={setUI} t={t} title={titleMap[ui.screen]}
                     back={ui.screen === 'detail' ? closeSnippet : null}
                     openCmd={() => setUI(u => ({ ...u, cmd: true }))} />}

      <div style={{ display: 'flex', flex: 1, minHeight: 0, position: 'relative', height: isMobile ? 'calc(100% - 56px)' : 'calc(100% - 60px)' }}>
        {!isMobile && <Sidebar ui={ui} setUI={setUI} t={t} />}
        <main style={{
          flex: 1, overflow: 'auto', position: 'relative',
          padding: isMobile ? '14px 14px 84px' : '24px 28px 24px',
          paddingRight: isMobile ? 14 : (ui.chat === 'open' ? 374 : 28),
          transition: 'padding-right 0.25s ease',
        }}>
          <div key={ui.screen + (ui.activeSnippet?.id || '')} className="page-fade">
            {screen}
          </div>
        </main>

        <AIChatPanel ui={ui} setUI={setUI} t={t} variant={variant} />
      </div>

      {isMobile && <MobileBottomNav ui={ui} setUI={setUI} t={t} />}

      <CommandPalette open={ui.cmd} onClose={() => setUI(u => ({ ...u, cmd: false }))} t={t} setUI={setUI} />
    </div>
  );
}

Object.assign(window, { PentaApp, Avatar, AvatarStack, TypeBadge, cx });
