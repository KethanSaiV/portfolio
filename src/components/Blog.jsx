import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const FALLBACK = [
  { id: 1, title: 'Real-Time Systems in Surgical Robotics', excerpt: 'Exploring hard real-time requirements for teleoperated surgical systems.', tags: ['Robotics', 'Real-time'], published: false, cover_url: null, content: '' },
  { id: 2, title: 'nnU-Net: Why It\'s Still the Baseline to Beat', excerpt: "A deep dive into nnU-Net's self-configuring pipeline.", tags: ['Deep Learning', 'Segmentation'], published: false, cover_url: null, content: '' },
];

const PAGE_SIZE = 4;

function fmt(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}

/* ── Markdown-to-HTML (lightweight, no deps) ── */
function renderMarkdown(md) {
  if (!md) return '';
  return md
    .replace(/^#{4} (.+)$/gm, '<h4>$1</h4>')
    .replace(/^#{3} (.+)$/gm, '<h3>$1</h3>')
    .replace(/^#{2} (.+)$/gm, '<h2>$1</h2>')
    .replace(/^#{1} (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^\> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/^\| (.+) \|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim() && !c.match(/^[-\s]+$/));
      return '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, m => `<table>${m}</table>`)
    .replace(/^→ (.+)$/gm, '<p class="arrow-point">→ $1</p>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hbulipta]|<\/|<block|<hr|<table|<tr)(.+)$/gm, '<p>$1</p>');
}

/* ── Blog Modal ── */
function BlogModal({ post, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handler);
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '2rem 1rem',
        overflowY: 'auto',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '780px',
          background: 'var(--surface, #111)',
          border: '1px solid var(--border)',
          borderTop: '3px solid var(--red)',
          padding: '2.5rem',
          position: 'relative',
          animation: 'slideUp 0.25s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            background: 'none', border: '1px solid var(--border)',
            color: 'var(--muted)', cursor: 'pointer',
            width: '32px', height: '32px', fontSize: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >✕</button>

        {/* Cover image */}
        {post.cover_url && (
          <img
            src={post.cover_url}
            alt={post.title}
            style={{ width: '100%', maxHeight: '320px', objectFit: 'cover', marginBottom: '2rem' }}
          />
        )}

        {/* Meta */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span className={`badge ${post.published ? 'badge-green' : 'badge-outline'}`}>
            {post.published ? 'Published' : 'Draft'}
          </span>
          {post.published_at && (
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{fmt(post.published_at)}</span>
          )}
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
          letterSpacing: '0.04em',
          lineHeight: 1.15,
          marginBottom: '1.5rem',
          color: 'var(--white)',
        }}>
          {post.title}
        </h2>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '2rem' }}>
          {(post.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
        </div>

        <hr style={{ borderColor: 'var(--border)', marginBottom: '2rem' }} />

        {/* Content */}
        {post.content ? (
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
            style={{
              color: 'var(--muted)',
              lineHeight: 1.8,
              fontSize: '0.95rem',
            }}
          />
        ) : (
          <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
            Full content coming soon.
          </p>
        )}

        {/* Bottom close */}
        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <button
            onClick={onClose}
            className="btn btn-outline"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.12em' }}
          >
            ← BACK TO BLOG
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Blog Component ── */
export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    supabase.from('blog_posts').select('*').order('order_index', { ascending: true })
      .then(({ data }) => {
        setPosts(data?.length ? data : FALLBACK);
        setLoading(false);
      })
      .catch(() => { setPosts(FALLBACK); setLoading(false); });
  }, []);

  const visible = showAll ? posts : posts.slice(0, PAGE_SIZE);

  return (
    <section id="blog">
      <div className="container">
        <p className="section-label">Writing</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
          <h2 className="section-heading" style={{ marginBottom: 0 }}>
            Notes &<br /><span style={{ color: 'var(--red)' }}>Thoughts</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', maxWidth: '280px' }}>
            Long-form writing on medical robotics, imaging AI, and the path to research in Germany.
          </p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Loading posts…</p>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {visible.map((post, i) => (
                <article
                  key={post.id}
                  className="card fade-up"
                  style={{ animationDelay: `${i * 0.08}s`, display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                  onClick={() => setSelected(post)}
                >
                  {/* Cover */}
                  {post.cover_url ? (
                    <img src={post.cover_url} alt={post.title} style={{ width: '100%', height: '140px', objectFit: 'cover', marginBottom: '1.25rem' }} />
                  ) : (
                    <div style={{ width: '100%', height: '80px', background: 'var(--surface2)', border: '1px dashed var(--border)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'rgba(255,60,0,0.1)' }}>✍</span>
                    </div>
                  )}

                  {/* Status + date */}
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <span className={`badge ${post.published ? 'badge-green' : 'badge-outline'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                    {post.published_at && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{fmt(post.published_at)}</span>
                    )}
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', letterSpacing: '0.04em', lineHeight: 1.2, marginBottom: '0.75rem', flex: 1 }}>
                    {post.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '1rem' }}>
                    {post.excerpt}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: 'auto' }}>
                    {(post.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
                  </div>

                  <div style={{
                    display: 'inline-block', marginTop: '1rem',
                    fontFamily: 'var(--font-display)', fontSize: '0.75rem',
                    letterSpacing: '0.12em', color: 'var(--red)',
                    borderBottom: '1px solid var(--red)', paddingBottom: '2px',
                    alignSelf: 'flex-start',
                  }}>
                    READ MORE ↗
                  </div>
                </article>
              ))}
            </div>

            {posts.length > PAGE_SIZE && (
              <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <button
                  onClick={() => setShowAll(s => !s)}
                  className="btn btn-outline"
                  style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.12em' }}
                >
                  {showAll ? 'SHOW LESS ↑' : `SHOW MORE (${posts.length - PAGE_SIZE} more) ↓`}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {selected && <BlogModal post={selected} onClose={() => setSelected(null)} />}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
        .blog-content h1, .blog-content h2, .blog-content h3 {
          font-family: var(--font-display);
          color: var(--white);
          letter-spacing: 0.04em;
          margin: 1.75rem 0 0.75rem;
        }
        .blog-content h1 { font-size: 1.6rem; }
        .blog-content h2 { font-size: 1.3rem; color: var(--white); border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
        .blog-content h3 { font-size: 1.1rem; color: var(--red); }
        .blog-content p { margin-bottom: 1rem; }
        .blog-content strong { color: var(--white); }
        .blog-content code { background: rgba(255,60,0,0.1); color: var(--red); padding: 2px 6px; font-size: 0.85em; }
        .blog-content blockquote { border-left: 3px solid var(--red); padding-left: 1rem; color: var(--white); font-style: italic; margin: 1.5rem 0; }
        .blog-content hr { border-color: var(--border); margin: 2rem 0; }
        .blog-content ul { padding-left: 1.5rem; margin-bottom: 1rem; }
        .blog-content li { margin-bottom: 0.4rem; }
        .blog-content a { color: var(--red); text-decoration: underline; }
        .blog-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.85rem; }
        .blog-content td { border: 1px solid var(--border); padding: 0.6rem 0.85rem; }
        .blog-content tr:first-child td { font-weight: bold; color: var(--white); background: rgba(255,60,0,0.08); }
        .blog-content .arrow-point { color: var(--white); padding-left: 0.5rem; }
      `}</style>
    </section>
  );
}