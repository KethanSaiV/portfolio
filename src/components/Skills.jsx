import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const FALLBACK = [
  { id: 1, category: 'AI / Deep Learning', name: 'PyTorch', level: 90 },
  { id: 2, category: 'AI / Deep Learning', name: 'TensorFlow / Keras', level: 80 },
  { id: 3, category: 'AI / Deep Learning', name: 'U-Net / nnU-Net', level: 85 },
  { id: 4, category: 'AI / Deep Learning', name: 'Vision Transformers', level: 75 },
  { id: 5, category: 'AI / Deep Learning', name: 'MONAI', level: 70 },

  { id: 6, category: 'Medical Imaging', name: 'DICOM Processing', level: 85 },
  { id: 7, category: 'Medical Imaging', name: 'CT / MRI Analysis', level: 80 },
  { id: 8, category: 'Medical Imaging', name: 'ITK / SimpleITK', level: 75 },
  { id: 9, category: 'Medical Imaging', name: '3D Slicer', level: 70 },
  { id: 10, category: 'Medical Imaging', name: 'VTK / VTK.js', level: 60 },

  { id: 11, category: 'Programming & Frameworks', name: 'Python', level: 95 },
  { id: 12, category: 'Programming & Frameworks', name: 'C++', level: 70 },
  { id: 13, category: 'Programming & Frameworks', name: 'ROS / ROS2', level: 65 },
  { id: 14, category: 'Programming & Frameworks', name: 'OpenCV', level: 85 },
  { id: 15, category: 'Programming & Frameworks', name: 'NumPy / SciPy', level: 90 },

  { id: 16, category: 'Tools & Platforms', name: 'Git / GitHub', level: 85 },
  { id: 17, category: 'Tools & Platforms', name: 'Docker', level: 65 },
  { id: 18, category: 'Tools & Platforms', name: 'Linux / Ubuntu', level: 80 },
  { id: 19, category: 'Tools & Platforms', name: 'MATLAB', level: 70 },
  { id: 20, category: 'Tools & Platforms', name: 'Supabase / PostgreSQL', level: 60 },
];

const CATEGORY_ICONS = {
  'AI / Deep Learning': '⬡',
  'Medical Imaging': '◈',
  'Programming & Frameworks': '◻',
  'Tools & Platforms': '◆',
};

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key] || 'Other';
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});
}

function LevelBar({ level }) {
  return (
    <div style={{ flex: 1, height: '2px', background: 'var(--border)', position: 'relative' }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: `${level * 20}%`,
        background: level * 20 >= 80 ? 'var(--red)' : level * 20 >= 65 ? '#e0a020' : 'var(--muted)',
        transition: 'width 0.8s ease',
      }} />
    </div>
  );
}

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('skills').select('*').order('category').order('order_index', { ascending: true })
      .then(({ data }) => {
        setSkills(data?.length ? data : FALLBACK);
        setLoading(false);
      })
      .catch(() => { setSkills(FALLBACK); setLoading(false); });
  }, []);

  const grouped = groupBy(skills, 'category');

  return (
    <section id="skills">
      <div className="container">
        <p className="section-label">Competencies</p>
        <h2 className="section-heading">
          Technical<br /><span style={{ color: 'var(--red)' }}>Stack</span>
        </h2>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Loading…</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {Object.entries(grouped).map(([category, items], ci) => (
              <div key={category} className="card fade-up" style={{ animationDelay: `${ci * 0.1}s` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '1.4rem', color: 'var(--red)', fontFamily: 'var(--font-display)' }}>
                    {CATEGORY_ICONS[category] || '◆'}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.1em' }}>
                    {category.toUpperCase()}
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {items.map(skill => (
                    <div key={skill.id}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
                        <span style={{ fontSize: '0.85rem', flex: 1, color: 'var(--text)' }}>{skill.name}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--muted)', fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>
                          {skill.level * 20}%
                        </span>
                      </div>
                      <LevelBar level={skill.level} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}