import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const FALLBACK = [
  {
    id: 1, title: 'NEEDLE TRACKING FOR CT-GUIDED BIOPSY',
    subtitle: 'Real-time Robotic Guidance System',
    description: 'Developed real-time needle detection and tracking algorithms for CT-guided percutaneous biopsy using image processing pipelines integrated with robotic arm control. Deployed within PERFINT MAXIO platform.',
    tags: ['Medical Imaging', 'Robotics', 'CT', 'Python', 'ROS'],
    status: 'In Progress', github_url: null, paper_url: null,
  },
  {
    id: 2, title: 'AI TUMOUR SEGMENTATION',
    subtitle: 'Deep Learning for Liver & Lung Lesions',
    description: 'Implemented U-Net and nnU-Net based segmentation models for automatic tumour delineation in liver and lung CT volumes, targeting clinical decision support in interventional oncology.',
    tags: ['Deep Learning', 'Segmentation', 'U-Net', 'PyTorch', 'DICOM'],
    status: 'Completed', github_url: null, paper_url: null,
  },
  {
    id: 3, title: 'HAPTIC FEEDBACK IN SURGICAL ROBOTICS',
    subtitle: 'HRI & Force Sensing Integration',
    description: 'Explored haptic feedback mechanisms and force-sensing models for teleoperated surgical robots, with focus on tissue differentiation and collision detection using tactile sensor arrays.',
    tags: ['Haptics', 'HRI', 'Robotics', 'Force Sensing', 'C++'],
    status: 'Research', github_url: null, paper_url: null,
  },
  {
    id: 4, title: 'IMAGE-GUIDED RADIATION THERAPY PLANNING',
    subtitle: 'Automated Dose & Target Volume Estimation',
    description: 'Investigated AI-assisted planning workflows for IGRT, automating target volume delineation and dose distribution estimation using transformer-based models on multi-modal imaging data.',
    tags: ['IGRT', 'Radiation Oncology', 'Transformers', 'Multi-modal AI'],
    status: 'Research', github_url: null, paper_url: null,
  },
];

const STATUS_BADGE = {
  'In Progress': 'badge-yellow',
  'Completed': 'badge-green',
  'Research': 'badge-outline',
  'Published': 'badge-red',
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('projects').select('*').order('order_index', { ascending: true })
      .then(({ data }) => {
        setProjects(data?.length ? data : FALLBACK);
        setLoading(false);
      })
      .catch(() => { setProjects(FALLBACK); setLoading(false); });
  }, []);

  return (
    <section id="projects">
      <div className="container">
        <p className="section-label">Research Projects</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
          <h2 className="section-heading" style={{ marginBottom: 0 }}>Selected<br /><span style={{ color: 'var(--red)' }}>Work</span></h2>
          <p style={{ color: 'var(--muted)', maxWidth: '320px', fontSize: '0.9rem' }}>
            Applied research spanning surgical robotics, interventional imaging, and AI-assisted clinical workflows.
          </p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Loading projects…</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {projects.map((p, i) => (
              <article key={p.id} className="card fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                {/* Image */}
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title}
                    style={{ width: '100%', height: '160px', objectFit: 'cover', marginBottom: '1.25rem' }} />
                ) : (
                  <div style={{
                    width: '100%', height: '120px', background: 'var(--surface2)',
                    marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px dashed var(--border)',
                  }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'rgba(255,60,0,0.12)', letterSpacing: '0.1em' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                )}

                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--muted)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`badge ${STATUS_BADGE[p.status] || 'badge-outline'}`}>{p.status}</span>
                </div>

                {/* Title */}
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', letterSpacing: '0.04em', lineHeight: 1.1, marginBottom: '0.35rem' }}>
                  {p.title}
                </h3>
                {p.subtitle && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--red)', letterSpacing: '0.06em', marginBottom: '0.85rem', fontWeight: 500 }}>
                    {p.subtitle}
                  </p>
                )}

                <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                  {p.description}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  {(p.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
                </div>

                {/* Links */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {p.github_url && (
                    <a href={p.github_url} target="_blank" rel="noreferrer"
                      style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '0.12em', color: 'var(--muted)', borderBottom: '1px solid var(--border)', paddingBottom: '2px' }}>
                      GitHub ↗
                    </a>
                  )}
                  {p.paper_url && (
                    <a href={p.paper_url} target="_blank" rel="noreferrer"
                      style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '0.12em', color: 'var(--red)', borderBottom: '1px solid var(--red)', paddingBottom: '2px' }}>
                      Paper ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}