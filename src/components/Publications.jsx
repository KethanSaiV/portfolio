import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const FALLBACK = [
  {
    id: 1,
    title: 'Real-Time Needle Tracking for CT-Guided Percutaneous Biopsy Using Gradient-Based Image Processing',
    authors: 'Kethan Sai V., et al.',
    journal: 'IEEE Transactions on Medical Imaging',
    year: 2025, status: 'In Preparation',
    abstract: 'We propose a real-time needle detection and trajectory prediction framework integrated with the PERFINT MAXIO robotic platform for percutaneous biopsy procedures under CT fluoroscopy guidance.',
    tags: ['Medical Imaging', 'Robotics', 'CT', 'Real-time Systems'],
  },
  {
    id: 2,
    title: 'Deep Learning-Based Liver Tumour Segmentation Using nnU-Net with Multi-Phase CT Fusion',
    authors: 'Kethan Sai V., et al.',
    journal: 'Medical Image Analysis',
    year: 2025, status: 'In Preparation',
    abstract: 'A multi-phase CT fusion strategy combined with nnU-Net architecture for robust liver lesion segmentation, targeting clinical deployment in interventional oncology workflows.',
    tags: ['Deep Learning', 'Segmentation', 'Liver', 'nnU-Net'],
  },
  {
    id: 3,
    title: 'Haptic Feedback Models for Teleoperated Minimally Invasive Surgical Robots: A Systematic Review',
    authors: 'Kethan Sai V., et al.',
    journal: 'Journal of Medical Robotics Research',
    year: 2025, status: 'In Preparation',
    abstract: 'A systematic review of force-sensing and haptic feedback integration strategies in teleoperated surgical robots, analyzing human-robot interaction implications for clinical safety.',
    tags: ['Haptics', 'Surgical Robotics', 'HRI', 'Review'],
  },
  {
    id: 4,
    title: 'Transformer-Based Automatic Target Volume Delineation for Image-Guided Radiation Therapy',
    authors: 'Kethan Sai V., et al.',
    journal: 'International Journal of Radiation Oncology',
    year: 2025, status: 'In Preparation',
    abstract: 'Leveraging vision transformers for automated gross tumour volume (GTV) and clinical target volume (CTV) delineation from multi-modal CT and MRI data in IGRT treatment planning.',
    tags: ['IGRT', 'Transformers', 'Radiation Therapy', 'Target Volume'],
  },
];

export default function Publications() {
  const [pubs, setPubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('publications').select('*').order('order_index', { ascending: true })
      .then(({ data }) => {
        setPubs(data?.length ? data : FALLBACK);
        setLoading(false);
      })
      .catch(() => { setPubs(FALLBACK); setLoading(false); });
  }, []);

  return (
    <section id="publications">
      <div className="container">
        <p className="section-label">Publications</p>
        <h2 className="section-heading">
          Research<br /><span style={{ color: 'var(--red)' }}>Output</span>
        </h2>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Loading publications…</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {pubs.map((pub, i) => (
              <article key={pub.id}
                className="fade-up"
                style={{
                  animationDelay: `${i * 0.08}s`,
                  background: 'var(--surface)',
                  borderLeft: '3px solid transparent',
                  padding: '1.75rem 2rem',
                  transition: 'border-color 0.2s, background 0.2s',
                  cursor: 'default',
                  marginBottom: '1px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderLeftColor = 'var(--red)';
                  e.currentTarget.style.background = 'var(--surface2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderLeftColor = 'transparent';
                  e.currentTarget.style.background = 'var(--surface)';
                }}
              >
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  {/* Number */}
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: '2.5rem',
                    color: 'rgba(255,60,0,0.15)', lineHeight: 1, minWidth: '2.5rem',
                    flexShrink: 0,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div style={{ flex: 1 }}>
                    {/* Title */}
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.2rem', letterSpacing: '0.03em',
                      lineHeight: 1.2, marginBottom: '0.5rem',
                    }}>
                      {pub.title}
                    </h3>

                    {/* Meta row */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.65rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{pub.authors}</span>
                      <span style={{ color: 'var(--border)' }}>·</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontStyle: 'italic' }}>{pub.journal}</span>
                      <span style={{ color: 'var(--border)' }}>·</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{pub.year}</span>
                      <span className="badge badge-yellow">{pub.status}</span>
                    </div>

                    {/* Abstract */}
                    {pub.abstract && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '0.85rem', maxWidth: '800px' }}>
                        {pub.abstract}
                      </p>
                    )}

                    {/* Tags & links */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      {(pub.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
                      {pub.doi && (
                        <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer"
                          style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--red)', marginLeft: 'auto' }}>
                          DOI ↗
                        </a>
                      )}
                      {pub.arxiv_url && (
                        <a href={pub.arxiv_url} target="_blank" rel="noreferrer"
                          style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--red)' }}>
                          arXiv ↗
                        </a>
                      )}
                      {pub.pdf_url && (
                        <a href={pub.pdf_url} target="_blank" rel="noreferrer"
                          style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--red)' }}>
                          PDF ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}