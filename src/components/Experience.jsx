import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const FALLBACK = [
  {
    id: 1,
    role: 'Medical Image Processing Engineer (Intern)',
    organization: 'Perfint Healthcare Pvt Ltd',
    location: 'Chennai, India',
    start_date: '2024-01',
    end_date: null,
    type: 'Internship',
    description: 'Working on CT-guided robotic biopsy systems, developing image processing algorithms for real-time needle tracking integrated with the MAXIO platform.',
    highlights: [
      'Developed real-time needle segmentation pipeline for CT fluoroscopy',
      'Integrated tracking algorithms with PERFINT MAXIO robotic guidance system',
      'Collaborated on deep learning models for anatomy segmentation',
      'Contributed to clinical validation workflows and testing protocols',
    ],
  },
  {
    id: 2,
    role: 'AI & Medical Engineering Student',
    organization: 'SRIHIER (Sri Ramachandra Institute of Higher Education and Research)',
    location: 'Chennai, India',
    start_date: '2022-08',
    end_date: null,
    type: 'Education',
    description: 'Pursuing B.Tech in AI & Medical Engineering with Data Analytics specialization. Coursework spanning medical imaging, robotics, deep learning, and clinical informatics.',
    highlights: [
      'Specialization: Data Analytics & AI for Healthcare',
      'Active member of Biomedical Engineering & Robotics clubs',
      'Projects in medical image segmentation, surgical robotics, IGRT',
      'Targeting M.Tech / Research in Germany (2026)',
    ],
  },
  {
    id: 3,
    role: 'Research Intern',
    organization: 'Computer Vision & Robotics Lab',
    location: 'Chennai, India',
    start_date: '2023-06',
    end_date: '2023-12',
    type: 'Research',
    description: 'Conducted research in deep learning-based image segmentation for medical applications, focusing on tumour detection and automated clinical decision support tools.',
    highlights: [
      'Implemented and benchmarked U-Net, nnU-Net for liver/lung CT segmentation',
      'Explored domain adaptation techniques for multi-centre imaging data',
      'Presented findings at departmental research symposium',
    ],
  },
  {
    id: 4,
    role: 'Data Analytics Intern',
    organization: 'Healthcare Analytics Project',
    location: 'Remote',
    start_date: '2023-01',
    end_date: '2023-05',
    type: 'Internship',
    description: 'Built data pipelines and analytical dashboards for clinical outcome prediction using structured EMR data. Applied statistical and ML models for patient risk stratification.',
    highlights: [
      'Developed ML models for patient readmission risk prediction',
      'Built interactive dashboards using Python + Plotly for clinical insights',
      'Cleaned and processed 50k+ patient records for cohort analysis',
    ],
  },
];

const TYPE_COLOR = {
  'Internship': '#ff3c00',
  'Education': '#4caf80',
  'Research': '#e0a020',
  'Full-time': '#60a0ff',
};

function fmt(dateStr) {
  if (!dateStr) return 'Present';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short' });
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
        <h2 className="section-heading">
          Timeline
        </h2>

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
                <div key={exp.id} className="fade-up" style={{ animationDelay: `${i * 0.1}s`, display: 'flex', gap: '2.5rem', paddingLeft: '4rem', paddingBottom: '3rem', position: 'relative' }}>
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
                    <p style={{ fontSize: '0.88rem', color: 'var(--red)', marginBottom: '0.25rem', fontWeight: 500 }}>
                      {exp.organization}
                    </p>
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