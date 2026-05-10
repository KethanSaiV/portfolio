import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const FALLBACK = {
  email: 'kethansai.official@gmail.com',
  phone: '+91 9581761578',
  linkedin: 'https://linkedin.com/in/kethansaiv',
  github: 'https://github.com/KethanSaiV',
  location: 'Chennai, India',
};

const CONTACTS = [
  { key: 'email', label: 'Email', icon: '✉', prefix: 'mailto:' },
  { key: 'linkedin', label: 'LinkedIn', icon: '⟁', prefix: '' },
  { key: 'github', label: 'GitHub', icon: '⊕', prefix: '' },
  { key: 'phone', label: 'Phone', icon: '◎', prefix: 'tel:' },
];

export default function Contact() {
  const [about, setAbout] = useState(FALLBACK);

  useEffect(() => {
    supabase.from('about').select('email, phone, linkedin, github, location').limit(1).single()
      .then(({ data }) => { if (data) setAbout({ ...FALLBACK, ...data }); });
  }, []);

  return (
    <section id="contact" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
          {/* Left */}
          <div>
            <p className="section-label">Contact</p>
            <h2 className="section-heading" style={{ marginBottom: '1.5rem' }}>
              Let's<br /><span style={{ color: 'var(--red)' }}>Connect</span>
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '380px', marginBottom: '2rem' }}>
              Open to research collaborations, internship opportunities, and conversations about surgical robotics,
              medical imaging, or M.Tech applications in Germany.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4caf80', boxShadow: '0 0 8px #4caf80' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)', letterSpacing: '0.05em' }}>
                Available for collaborations — based in Chennai, India
              </span>
            </div>
          </div>

          {/* Right — links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {CONTACTS.map(({ key, label, icon, prefix }) => {
              const value = about[key];
              if (!value) return null;
              const href = prefix + value;
              const display = key === 'linkedin' ? value.replace('https://', '')
                            : key === 'github' ? value.replace('https://github.com/', '@')
                            : value;
              return (
                <a key={key} href={href} target="_blank" rel="noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1.5rem',
                    padding: '1.25rem 1.5rem',
                    background: 'var(--surface)',
                    border: '1px solid transparent',
                    borderLeft: '3px solid transparent',
                    transition: 'border-color 0.2s, background 0.2s',
                    marginBottom: '1px',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.borderLeftColor = 'var(--red)';
                    e.currentTarget.style.background = 'var(--surface2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.borderLeftColor = 'transparent';
                    e.currentTarget.style.background = 'var(--surface)';
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--red)', width: '1.5rem', textAlign: 'center' }}>
                    {icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.68rem', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', fontFamily: 'var(--font-display)', marginBottom: '0.15rem' }}>
                      {label}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{display}</div>
                  </div>
                  <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>↗</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div style={{
        borderTop: '1px solid var(--border)',
        marginTop: '4rem',
        padding: '1.5rem 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        maxWidth: '1280px',
        margin: '4rem auto 0',
        paddingLeft: '2rem', paddingRight: '2rem',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--muted)' }}>
          © 2025 KETHAN SAI V.
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '0.15em', color: 'var(--border)' }}>
          CHENNAI · INDIA · TARGETING GERMANY 2026
        </span>
        <a href="/admin" style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--border)', transition: 'color 0.2s' }}
          onMouseEnter={e => e.target.style.color = 'var(--red)'}
          onMouseLeave={e => e.target.style.color = 'var(--border)'}
        >
          ADMIN ↗
        </a>
      </div>
    </section>
  );
}