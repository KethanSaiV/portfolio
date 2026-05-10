import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const FALLBACK = [
  {
    id: 1,
    role: 'Medical Image Processing Engineer',
    organization: 'Perfint Healthcare Pvt Ltd',
    location: 'Chennai, India',
    start_date: '2024-01',
    end_date: '2026-01',
    type: 'Internship',
    logo_url: 'https://www.google.com/s2/favicons?domain=perfint.com&sz=128',
    description: 'Worked on CT-guided robotic biopsy systems, developing image processing algorithms for real-time needle tracking.',
    highlights: [
      'Built real-time spine MRI AI model with region-wise report integration',
      'Developed structured spine dataset: 515 patients, ~48K slices',
      'Implemented U-Net spine segmentation model',
      'CT–MRI multimodal registration pipeline development',
      'Collision-aware needle path planning system',
    ],
  },
];

const TYPE_COLOR = {
  'Internship': '#ff3c00',
  'Education': '#4caf80',
  'Research': '#e0a020',
  'Full-time': '#60a0ff',
  'Part-time': '#a060ff',
  'Volunteer': '#20c0c0',
};

function fmt(dateStr) {
  if (!dateStr) return 'Present';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short' });
}

function CompanyLogo({ url, name }) {
  const [err, setErr] = useState(false);
  if (!url || err) return null;
  return (
    <img
      src={url}
      alt={`${name} logo`}
      onError={() => setErr(true)}
      style={{
        width: '160px',
        height: '80px',
        objectFit: 'contain',
        background: 'transparent',
        flexShrink: 0,
        mixBlendMode: 'screen',
      }}
    />
  );
}

export default function Experience() {
  const [exps, setExps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('experience').select('*').order('order_index', { ascending: true })
      .then(({ data }) => {
        setExps(data?.length ? data : FALLBACK);
        setLoading(false);
      })
      .catch(() => { setExps(FALLBACK); setLoading(false); });
  }, []);

  return (
    <section id="experience">
      <div className="container">
        <p className="section-label">Experience</p>
        <h2 className="section-heading">Timeline</h2>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Loading…</p>
        ) : (
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute',
              left: '1.5rem', top: 0, bottom: 0,
              width: '1px', background: 'var(--border)',
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {exps.map((exp, i) => (
                <div key={exp.id} className="fade-up" style={{
                  animationDelay: `${i * 0.1}s`,
                  display: 'flex', gap: '2.5rem',
                  paddingLeft: '4rem', paddingBottom: '3rem',
                  position: 'relative',
                }}>
                  {/* Dot */}
                  <div style={{
                    position: 'absolute', left: 'calc(1.5rem - 5px)', top: '6px',
                    width: '11px', height: '11px',
                    background: TYPE_COLOR[exp.type] || 'var(--red)',
                    borderRadius: '50%',
                    boxShadow: `0 0 0 3px var(--black)`,
                  }} />

                  <div style={{ flex: 1 }}>
                    {/* Date + type */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.72rem', letterSpacing: '0.15em',
                        color: 'var(--muted)',
                      }}>
                        {fmt(exp.start_date)} — {fmt(exp.end_date)}
                      </span>
                      <span style={{
                        fontSize: '0.65rem', letterSpacing: '0.1em',
                        padding: '0.15rem 0.5rem',
                        background: `${TYPE_COLOR[exp.type] || 'var(--red)'}18`,
                        color: TYPE_COLOR[exp.type] || 'var(--red)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}>{exp.type}</span>
                    </div>

                    {/* Role */}
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
                      {exp.role}
                    </h3>

                    {/* Company name */}
                    <p style={{ fontSize: '0.88rem', color: 'var(--red)', fontWeight: 500, marginBottom: '0.25rem' }}>
                      {exp.organization}
                    </p>

                    {/* Logo top-right */}
                    {exp.logo_url && (
                      <div style={{ position: 'absolute', top: 0, right: '2rem' }}>
                        <CompanyLogo url={exp.logo_url} name={exp.organization} />
                      </div>
                    )}

                    <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.85rem' }}>
                      📍 {exp.location}
                    </p>

                    <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '1rem', maxWidth: '640px' }}>
                      {exp.description}
                    </p>

                    {/* Highlights */}
                    {exp.highlights?.length > 0 && (
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {exp.highlights.map((h, hi) => (
                          <li key={hi} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
                            <span style={{ color: 'var(--red)', flexShrink: 0, marginTop: '2px' }}>→</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}