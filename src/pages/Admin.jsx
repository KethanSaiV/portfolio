import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/* ─── helpers ─── */
function arr(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
  return [];
}
function arrToStr(val) { return arr(val).join(', '); }

/* ─── Modal ─── */
function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 className="modal-title">{title}</h3>
          <button onClick={onClose} style={{ color: 'var(--muted)', fontSize: '1.25rem', cursor: 'pointer', background: 'none', border: 'none' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── ABOUT PANEL ─── */
function AboutPanel() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    supabase.from('about').select('*').limit(1).single().then(({ data }) => setData(data || {}));
  }, []);

  function set(k, v) { setData(d => ({ ...d, [k]: v })); }

  async function save() {
    setSaving(true);
    const { error } = data.id
      ? await supabase.from('about').update(data).eq('id', data.id)
      : await supabase.from('about').insert(data);
    setSaving(false);
    setMsg(error ? `Error: ${error.message}` : 'Saved!');
    setTimeout(() => setMsg(''), 3000);
  }

  if (!data) return <p style={{ color: 'var(--muted)' }}>Loading…</p>;

  const fields = [
    { key: 'name', label: 'Name' },
    { key: 'tagline', label: 'Tagline' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'linkedin', label: 'LinkedIn URL' },
    { key: 'github', label: 'GitHub URL' },
    { key: 'location', label: 'Location' },
    { key: 'photo_url', label: 'Photo URL' },
    { key: 'resume_url', label: 'Resume URL' },
  ];

  return (
    <div>
      <div className="admin-panel-header">
        <h2 className="admin-panel-title">About / Profile</h2>
        <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </div>
      {msg && <p style={{ color: msg.startsWith('Error') ? '#ff6b6b' : '#4caf80', marginBottom: '1rem', fontSize: '0.85rem' }}>{msg}</p>}
      <div className="admin-form">
        <div className="form-grid-2">
          {fields.map(f => (
            <div key={f.key} className="field">
              <label>{f.label}</label>
              <input value={data[f.key] || ''} onChange={e => set(f.key, e.target.value)} />
            </div>
          ))}
        </div>
        <div className="field">
          <label>Bio</label>
          <textarea rows={5} value={data.bio || ''} onChange={e => set('bio', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

/* ─── THEME PANEL ─── */
function ThemePanel() {
  const defaults = {
    '--red': '#ff3c00',
    '--black': '#080808',
    '--surface': '#111111',
    '--surface2': '#181818',
    '--border': '#242424',
    '--text': '#f0ede8',
    '--muted': '#888880',
  };

  const PRESETS = [
    { name: 'Default Dark', vars: { '--red': '#ff3c00', '--black': '#080808', '--surface': '#111111', '--surface2': '#181818', '--border': '#242424', '--text': '#f0ede8', '--muted': '#888880' } },
    { name: 'Light Mode', vars: { '--red': '#ff3c00', '--black': '#f5f3ef', '--surface': '#ffffff', '--surface2': '#eeebe6', '--border': '#d8d4cc', '--text': '#0a0a0a', '--muted': '#666660' } },
    { name: 'Midnight Blue', vars: { '--red': '#4f8ef7', '--black': '#060812', '--surface': '#0d1120', '--surface2': '#151a2e', '--border': '#1e2540', '--text': '#e8edf8', '--muted': '#7880a0' } },
    { name: 'Forest', vars: { '--red': '#2ecc71', '--black': '#070d08', '--surface': '#0e1a10', '--surface2': '#162018', '--border': '#1e2e20', '--text': '#e8f0e8', '--muted': '#708070' } },
    { name: 'Gold', vars: { '--red': '#f0a500', '--black': '#0a0800', '--surface': '#141000', '--surface2': '#1c1800', '--border': '#2a2400', '--text': '#f5f0e0', '--muted': '#908060' } },
    { name: 'Rose', vars: { '--red': '#e91e8c', '--black': '#0a0608', '--surface': '#130a10', '--surface2': '#1c1018', '--border': '#2a1422', '--text': '#f8eef4', '--muted': '#907080' } },
  ];

  const [colors, setColors] = useState(() => {
    try {
      const saved = localStorage.getItem('theme-colors');
      return saved ? JSON.parse(saved) : defaults;
    } catch { return defaults; }
  });

  function apply(vars) {
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    setColors(vars);
    localStorage.setItem('theme-colors', JSON.stringify(vars));
  }

  function handleChange(key, val) {
    apply({ ...colors, [key]: val });
  }

  const LABELS = {
    '--red': 'Accent Color',
    '--black': 'Background',
    '--surface': 'Card Surface',
    '--surface2': 'Surface 2',
    '--border': 'Border Color',
    '--text': 'Text Color',
    '--muted': 'Muted Text',
  };

  return (
    <div>
      <div className="admin-panel-header">
        <h2 className="admin-panel-title">Theme Colors</h2>
        <button className="btn btn-outline btn-sm" onClick={() => apply(defaults)}>Reset to Default</button>
      </div>

      {/* Presets */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Presets</p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {PRESETS.map(p => (
            <button key={p.name} onClick={() => apply(p.vars)}
              style={{
                padding: '0.6rem 1.25rem',
                fontFamily: 'var(--font-display)',
                fontSize: '0.82rem',
                letterSpacing: '0.1em',
                background: p.vars['--surface'],
                color: p.vars['--text'],
                border: `2px solid ${p.vars['--red']}`,
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 4px 16px ${p.vars['--red']}44`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Color pickers */}
      <p style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Custom Colors</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {Object.entries(LABELS).map(([key, label]) => (
          <div key={key} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', padding: '1rem' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input type="color" value={colors[key] || defaults[key]} onChange={e => handleChange(key, e.target.value)}
                style={{ width: '40px', height: '40px', border: 'none', background: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }} />
              <input type="text" value={colors[key] || defaults[key]} onChange={e => handleChange(key, e.target.value)}
                style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.4rem 0.6rem', fontFamily: 'monospace', fontSize: '0.85rem', outline: 'none' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Live preview strip */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Live Preview</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ background: 'var(--red)', color: '#fff', padding: '0.5rem 1.25rem', fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.1em' }}>ACCENT BUTTON</div>
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', padding: '0.5rem 1.25rem', color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.1em' }}>OUTLINE BUTTON</div>
          <span style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.05em' }}>HEADING TEXT</span>
          <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Body text sample</span>
        </div>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.6 }}>
        Changes apply instantly and are saved to your browser. To make them permanent for all visitors, copy the hex values into the <code style={{ fontFamily: 'monospace', color: 'var(--red)' }}>:root</code> block in <code style={{ fontFamily: 'monospace', color: 'var(--red)' }}>src/index.css</code>.
      </p>
    </div>
  );
}

/* ─── GENERIC CRUD PANEL ─── */
function CrudPanel({ table, label, columns, FormComponent, defaultItem }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [msg, setMsg] = useState('');

  async function load() {
    const { data, error } = await supabase.from(table).select('*').order('order_index', { ascending: true });
    if (error) console.error(error);
    setRows(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [table]);

  function openNew() { setEditing({ ...defaultItem }); setIsNew(true); }
  function openEdit(row) { setEditing({ ...row }); setIsNew(false); }
  function closeModal() { setEditing(null); setIsNew(false); }

  async function save() {
    const payload = { ...editing };
    ['tags', 'highlights'].forEach(k => {
      if (k in payload && typeof payload[k] === 'string') {
        payload[k] = payload[k].split(',').map(s => s.trim()).filter(Boolean);
      }
    });
    const { error } = isNew
      ? await supabase.from(table).insert(payload)
      : await supabase.from(table).update(payload).eq('id', payload.id);
    if (error) { setMsg(`Error: ${error.message}`); return; }
    setMsg('Saved!'); setTimeout(() => setMsg(''), 3000);
    closeModal(); load();
  }

  async function del(id) {
    if (!confirm('Delete this item?')) return;
    await supabase.from(table).delete().eq('id', id);
    load();
  }

  return (
    <div>
      <div className="admin-panel-header">
        <h2 className="admin-panel-title">{label}</h2>
        <button className="btn btn-primary btn-sm" onClick={openNew}>+ Add</button>
      </div>
      {msg && <p style={{ color: msg.startsWith('Error') ? '#ff6b6b' : '#4caf80', marginBottom: '1rem', fontSize: '0.85rem' }}>{msg}</p>}

      {loading ? <p style={{ color: 'var(--muted)' }}>Loading…</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map(c => <th key={c.key}>{c.label}</th>)}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  {columns.map(c => (
                    <td key={c.key} style={{ maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.render ? c.render(row[c.key], row) : String(row[c.key] ?? '')}
                    </td>
                  ))}
                  <td style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1rem' }}>
                    <button className="btn-edit" onClick={() => openEdit(row)}>Edit</button>
                    <button className="btn-danger" onClick={() => del(row.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={columns.length + 1} style={{ color: 'var(--muted)', fontStyle: 'italic' }}>No items yet. Click + Add.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Modal title={isNew ? `New ${label.replace(/s$/, '')}` : `Edit ${label.replace(/s$/, '')}`} onClose={closeModal}>
          <FormComponent item={editing} onChange={setEditing} />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={save}>Save</button>
            <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── FORM COMPONENTS ─── */

function F({ label, children }) {
  return <div className="field"><label>{label}</label>{children}</div>;
}

function ProjectForm({ item, onChange }) {
  const set = k => e => onChange(p => ({ ...p, [k]: e.target.value }));
  const chk = k => e => onChange(p => ({ ...p, [k]: e.target.checked }));
  return (
    <div className="admin-form">
      <div className="form-grid-2">
        <F label="Title"><input value={item.title || ''} onChange={set('title')} /></F>
        <F label="Subtitle"><input value={item.subtitle || ''} onChange={set('subtitle')} /></F>
        <F label="Status">
          <select value={item.status || ''} onChange={set('status')}>
            {['In Progress', 'Completed', 'Research', 'Published'].map(o => <option key={o}>{o}</option>)}
          </select>
        </F>
        <F label="Order Index"><input type="number" value={item.order_index ?? ''} onChange={set('order_index')} /></F>
        <F label="GitHub URL"><input value={item.github_url || ''} onChange={set('github_url')} /></F>
        <F label="Paper URL"><input value={item.paper_url || ''} onChange={set('paper_url')} /></F>
        <F label="Image URL"><input value={item.image_url || ''} onChange={set('image_url')} /></F>
      </div>
      <F label="Description"><textarea rows={4} value={item.description || ''} onChange={set('description')} /></F>
      <F label="Tags (comma-separated)"><input value={arrToStr(item.tags)} onChange={set('tags')} /></F>
      <div className="checkbox-row">
        <input type="checkbox" id="featured" checked={!!item.featured} onChange={chk('featured')} />
        <label htmlFor="featured" style={{ textTransform: 'none', fontSize: '0.85rem', marginBottom: 0 }}>Featured</label>
      </div>
    </div>
  );
}

function PublicationForm({ item, onChange }) {
  const set = k => e => onChange(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="admin-form">
      <F label="Title"><textarea rows={2} value={item.title || ''} onChange={set('title')} /></F>
      <div className="form-grid-2">
        <F label="Authors"><input value={item.authors || ''} onChange={set('authors')} /></F>
        <F label="Journal"><input value={item.journal || ''} onChange={set('journal')} /></F>
        <F label="Year"><input type="number" value={item.year || ''} onChange={set('year')} /></F>
        <F label="Status">
          <select value={item.status || ''} onChange={set('status')}>
            {['In Preparation', 'Under Review', 'Published', 'Accepted'].map(o => <option key={o}>{o}</option>)}
          </select>
        </F>
        <F label="DOI"><input value={item.doi || ''} onChange={set('doi')} /></F>
        <F label="arXiv URL"><input value={item.arxiv_url || ''} onChange={set('arxiv_url')} /></F>
        <F label="PDF URL"><input value={item.pdf_url || ''} onChange={set('pdf_url')} /></F>
        <F label="Order Index"><input type="number" value={item.order_index ?? ''} onChange={set('order_index')} /></F>
      </div>
      <F label="Abstract"><textarea rows={4} value={item.abstract || ''} onChange={set('abstract')} /></F>
      <F label="Tags (comma-separated)"><input value={arrToStr(item.tags)} onChange={set('tags')} /></F>
    </div>
  );
}

function ExperienceForm({ item, onChange }) {
  const set = k => e => onChange(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="admin-form">
      <div className="form-grid-2">
        <F label="Role"><input value={item.role || ''} onChange={set('role')} /></F>
        <F label="Organization"><input value={item.organization || ''} onChange={set('organization')} /></F>
        <F label="Location"><input value={item.location || ''} onChange={set('location')} /></F>
        <F label="Type">
          <select value={item.type || ''} onChange={set('type')}>
            {['Internship', 'Research', 'Full-time', 'Part-time', 'Education', 'Volunteer'].map(o => <option key={o}>{o}</option>)}
          </select>
        </F>
        <F label="Start Date (YYYY-MM)"><input value={item.start_date || ''} onChange={set('start_date')} placeholder="2024-01" /></F>
        <F label="End Date (YYYY-MM or blank)"><input value={item.end_date || ''} onChange={set('end_date')} placeholder="Leave blank for Present" /></F>
        <F label="Order Index"><input type="number" value={item.order_index ?? ''} onChange={set('order_index')} /></F>
      </div>
      <F label="Description"><textarea rows={3} value={item.description || ''} onChange={set('description')} /></F>
      <F label="Highlights (one per line)">
        <textarea rows={5}
          value={arr(item.highlights).join('\n')}
          onChange={e => onChange(p => ({ ...p, highlights: e.target.value.split('\n').filter(Boolean) }))}
        />
      </F>
    </div>
  );
}

function SkillForm({ item, onChange }) {
  const set = k => e => onChange(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="admin-form">
      <div className="form-grid-2">
        <F label="Name"><input value={item.name || ''} onChange={set('name')} /></F>
        <F label="Category"><input value={item.category || ''} onChange={set('category')} placeholder="e.g. AI / Deep Learning" /></F>
        <F label="Level (0-100)"><input type="number" min="0" max="100" value={item.level ?? 70} onChange={set('level')} /></F>
        <F label="Order Index"><input type="number" value={item.order_index ?? ''} onChange={set('order_index')} /></F>
      </div>
    </div>
  );
}

function GalleryForm({ item, onChange }) {
  const set = k => e => onChange(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="admin-form">
      <div className="form-grid-2">
        <F label="Title"><input value={item.title || ''} onChange={set('title')} /></F>
        <F label="Category"><input value={item.category || ''} onChange={set('category')} /></F>
        <F label="Order Index"><input type="number" value={item.order_index ?? ''} onChange={set('order_index')} /></F>
      </div>
      <F label="Image URL"><input value={item.image_url || ''} onChange={set('image_url')} /></F>
      <F label="Caption"><textarea rows={2} value={item.caption || ''} onChange={set('caption')} /></F>
      {item.image_url && (
        <img src={item.image_url} alt="preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginTop: '0.5rem', border: '1px solid var(--border)' }} />
      )}
    </div>
  );
}

function BlogForm({ item, onChange }) {
  const set = k => e => onChange(p => ({ ...p, [k]: e.target.value }));
  const chk = k => e => onChange(p => ({ ...p, [k]: e.target.checked }));
  return (
    <div className="admin-form">
      <F label="Title"><input value={item.title || ''} onChange={set('title')} /></F>
      <div className="form-grid-2">
        <F label="Slug"><input value={item.slug || ''} onChange={set('slug')} placeholder="my-post-slug" /></F>
        <F label="Order Index"><input type="number" value={item.order_index ?? ''} onChange={set('order_index')} /></F>
        <F label="Cover URL"><input value={item.cover_url || ''} onChange={set('cover_url')} /></F>
        <F label="Published At (YYYY-MM-DD)"><input value={item.published_at || ''} onChange={set('published_at')} placeholder="2025-01-15" /></F>
      </div>
      <F label="Tags (comma-separated)"><input value={arrToStr(item.tags)} onChange={set('tags')} /></F>
      <F label="Excerpt"><textarea rows={2} value={item.excerpt || ''} onChange={set('excerpt')} /></F>
      <F label="Content (Markdown)"><textarea rows={10} value={item.content || ''} onChange={set('content')} /></F>
      <div className="checkbox-row">
        <input type="checkbox" id="pub" checked={!!item.published} onChange={chk('published')} />
        <label htmlFor="pub" style={{ textTransform: 'none', fontSize: '0.85rem', marginBottom: 0 }}>Published</label>
      </div>
    </div>
  );
}

/* ─── SECTIONS CONFIG ─── */
const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'publications', label: 'Publications' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'blog', label: 'Blog Posts' },
  { id: 'theme', label: 'Theme Colors' },
];

/* ─── MAIN ADMIN PAGE ─── */
export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authErr, setAuthErr] = useState('');
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('about');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  async function login(e) {
    e.preventDefault();
    setAuthErr('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthErr(error.message);
  }

  async function logout() { await supabase.auth.signOut(); }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
      Loading…
    </div>
  );

  /* Login screen */
  if (!session) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--black)' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ width: '2.5rem', height: '3px', background: 'var(--red)', marginBottom: '1rem' }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: '0.06em' }}>ADMIN</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Sign in to manage your portfolio.</p>
        </div>
        <form onSubmit={login} className="admin-form">
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          {authErr && <p style={{ color: '#ff6b6b', fontSize: '0.82rem', marginBottom: '0.75rem' }}>{authErr}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
            Sign In
          </button>
        </form>
        <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--border)', textAlign: 'center' }}>
          <a href="/" style={{ color: 'var(--muted)' }}>← Back to portfolio</a>
        </p>
      </div>
    </div>
  );

  /* Authenticated — CMS layout */
  function renderPanel() {
    switch (active) {
      case 'about': return <AboutPanel />;
      case 'projects': return (
        <CrudPanel table="projects" label="Projects"
          defaultItem={{ title: '', subtitle: '', description: '', tags: [], status: 'Research', order_index: 0, featured: false }}
          columns={[
            { key: 'order_index', label: '#' },
            { key: 'title', label: 'Title' },
            { key: 'status', label: 'Status' },
            { key: 'featured', label: 'Featured', render: v => v ? '✓' : '—' },
          ]}
          FormComponent={ProjectForm}
        />
      );
      case 'publications': return (
        <CrudPanel table="publications" label="Publications"
          defaultItem={{ title: '', authors: '', journal: '', year: new Date().getFullYear(), status: 'In Preparation', tags: [], order_index: 0 }}
          columns={[
            { key: 'order_index', label: '#' },
            { key: 'title', label: 'Title' },
            { key: 'journal', label: 'Journal' },
            { key: 'year', label: 'Year' },
            { key: 'status', label: 'Status' },
          ]}
          FormComponent={PublicationForm}
        />
      );
      case 'experience': return (
        <CrudPanel table="experience" label="Experience"
          defaultItem={{ role: '', organization: '', location: '', type: 'Internship', start_date: '', end_date: '', description: '', highlights: [], order_index: 0 }}
          columns={[
            { key: 'order_index', label: '#' },
            { key: 'role', label: 'Role' },
            { key: 'organization', label: 'Organization' },
            { key: 'type', label: 'Type' },
            { key: 'start_date', label: 'Start' },
          ]}
          FormComponent={ExperienceForm}
        />
      );
      case 'skills': return (
        <CrudPanel table="skills" label="Skills"
          defaultItem={{ name: '', category: '', level: 70, order_index: 0 }}
          columns={[
            { key: 'category', label: 'Category' },
            { key: 'name', label: 'Skill' },
            { key: 'level', label: 'Level', render: v => `${v}%` },
            { key: 'order_index', label: '#' },
          ]}
          FormComponent={SkillForm}
        />
      );
      case 'gallery': return (
        <CrudPanel table="gallery" label="Gallery"
          defaultItem={{ title: '', caption: '', image_url: '', category: '', order_index: 0 }}
          columns={[
            { key: 'order_index', label: '#' },
            { key: 'title', label: 'Title' },
            { key: 'category', label: 'Category' },
            { key: 'image_url', label: 'Image', render: v => v ? '🖼' : '—' },
          ]}
          FormComponent={GalleryForm}
        />
      );
      case 'blog': return (
        <CrudPanel table="blog_posts" label="Blog Posts"
          defaultItem={{ title: '', slug: '', excerpt: '', content: '', tags: [], published: false, cover_url: '', order_index: 0 }}
          columns={[
            { key: 'order_index', label: '#' },
            { key: 'title', label: 'Title' },
            { key: 'slug', label: 'Slug' },
            { key: 'published', label: 'Live', render: v => v ? '✅' : '—' },
          ]}
          FormComponent={BlogForm}
        />
      );
      case 'theme': return <ThemePanel />;
      default: return null;
    }
  }

  return (
    <div className="admin-layout" style={{ display: 'flex' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ padding: '0 1.75rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '0.75rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.2em', color: 'var(--red)', marginBottom: '0.25rem' }}>KSV</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>Portfolio CMS</div>
        </div>

        {SECTIONS.map(s => (
          <button key={s.id}
            className={`admin-nav-item ${active === s.id ? 'active' : ''}`}
            onClick={() => setActive(s.id)}
          >
            {s.id === 'theme' ? '🎨 ' : ''}{s.label.toUpperCase()}
          </button>
        ))}

        <div style={{ padding: '1.5rem 1.75rem', borderTop: '1px solid var(--border)', marginTop: '2rem' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
            {session.user?.email}
          </div>
          <button onClick={logout}
            style={{ fontFamily: 'var(--font-display)', fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--muted)', cursor: 'pointer', background: 'none', border: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#ff6b6b'}
            onMouseLeave={e => e.target.style.color = 'var(--muted)'}
          >
            SIGN OUT ↗
          </button>
          <div style={{ marginTop: '0.75rem' }}>
            <a href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--muted)' }}>
              ← VIEW SITE
            </a>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {renderPanel()}
      </main>
    </div>
  );
}