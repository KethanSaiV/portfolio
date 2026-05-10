import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const PLACEHOLDER_COUNT = 8;
const PAGE_SIZE = 8;

function PlaceholderCell({ index }) {
  const labels = ['Lab Work', 'Conference', 'Project', 'Internship', 'Research', 'Campus', 'Event', 'Workshop'];
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px dashed var(--border)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      minHeight: '200px',
      padding: '1rem',
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--red)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'rgba(255,60,0,0.15)' }}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <span style={{ fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.15em', fontFamily: 'var(--font-display)' }}>
        {labels[index % labels.length].toUpperCase()}
      </span>
      <span style={{ fontSize: '0.65rem', color: 'var(--border)', letterSpacing: '0.1em' }}>No image yet</span>
    </div>
  );
}

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    supabase.from('gallery').select('*').order('order_index', { ascending: true })
      .then(({ data }) => { setImages(data || []); setLoading(false); })
      .catch(() => { setImages([]); setLoading(false); });
  }, []);

  const visible = images.length > 0
    ? (showAll ? images : images.slice(0, PAGE_SIZE))
    : Array.from({ length: PLACEHOLDER_COUNT });

  return (
    <section id="gallery">
      <div className="container">
        <p className="section-label">Gallery</p>
        <h2 className="section-heading">
          Behind The<br /><span style={{ color: 'var(--red)' }}>Work</span>
        </h2>

        {loading ? <p style={{ color: 'var(--muted)' }}>Loading…</p> : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
              {images.length > 0
                ? visible.map((img, i) => (
                    <div key={img.id} className="fade-up"
                      style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', animationDelay: `${i * 0.07}s` }}
                      onClick={() => setLightbox(img)}
                    >
                      <img src={img.image_url} alt={img.title || ''}
                        style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(8,8,8,0.85) 0%, transparent 60%)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                        padding: '1rem', opacity: 0, transition: 'opacity 0.3s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = 0}
                      >
                        {img.title && <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.06em' }}>{img.title}</p>}
                        {img.caption && <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{img.caption}</p>}
                      </div>
                    </div>
                  ))
                : visible.map((_, i) => <PlaceholderCell key={i} index={i} />)
              }
            </div>

            {/* Show more / less */}
            {images.length > PAGE_SIZE && (
              <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <button
                  onClick={() => setShowAll(s => !s)}
                  className="btn btn-outline"
                  style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.12em' }}
                >
                  {showAll ? `SHOW LESS ↑` : `SHOW MORE (${images.length - PAGE_SIZE} more) ↓`}
                </button>
              </div>
            )}
          </>
        )}

        {/* Lightbox */}
        {lightbox && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}
            onClick={() => setLightbox(null)}
          >
            <div onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '100%' }}>
              <img src={lightbox.image_url} alt={lightbox.title || ''} style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain' }} />
              {lightbox.title && <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '0.06em', marginTop: '1rem' }}>{lightbox.title}</p>}
              {lightbox.caption && <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.35rem' }}>{lightbox.caption}</p>}
            </div>
            <button onClick={() => setLightbox(null)} style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', color: 'var(--muted)', fontSize: '1.5rem', cursor: 'pointer', background: 'none', border: 'none' }}>✕</button>
          </div>
        )}
      </div>
    </section>
  );
}