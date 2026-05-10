import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const FALLBACK = {
  name: 'Kethan Sai V.',
  tagline: 'Medical Image Processing Engineer · AI & Medical Engineering · Targeting M.Tech in Germany',
  bio: 'Building intelligent systems at the intersection of surgical robotics, medical imaging, and AI. Currently interning at Perfint Healthcare, Chennai.',
  email: 'kethansai.official@gmail.com',
  phone: '+91 9581761578',
  linkedin: 'https://linkedin.com/in/kethansaiv',
  github: 'https://github.com/KethanSaiV',
  resume_url: '#',
};

export default function Hero() {
  const [about, setAbout] = useState(FALLBACK);

  useEffect(() => {
    supabase.from('about').select('*').limit(1).single()
      .then(({ data }) => { if (data) setAbout(data); });
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0',
        borderTop: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        opacity: 0.3,
        pointerEvents: 'none',
      }} />

      {/* Red accent bar top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '3px', background: 'var(--red)',
      }} />

      {/* Top nav bar */}
      <nav style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.5rem 2.5rem',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(8,8,8,0.7)',
        backdropFilter: 'blur(10px)',
        zIndex: 10,
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.15em', color: 'var(--red)' }}>
          KSV
        </span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Projects', 'Publications', 'Experience', 'Skills', 'Contact'].map(s => (
            <a key={s} href={`#${s.toLowerCase()}`} style={{
              fontFamily: 'var(--font-display)', fontSize: '0.78rem',
              letterSpacing: '0.12em', color: 'var(--muted)',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = 'var(--text)'}
              onMouseLeave={e => e.target.style.color = 'var(--muted)'}
            >{s}</a>
          ))}
          <a href="/admin" style={{
            fontFamily: 'var(--font-display)', fontSize: '0.78rem',
            letterSpacing: '0.12em', color: 'var(--muted)',
            transition: 'color 0.2s',
          }}>Admin</a>
        </div>
      </nav>

      {/* Main hero content */}
      <div className="container" style={{ paddingBottom: '5rem', paddingTop: '10rem', position: 'relative', zIndex: 2 }}>

        {/* Overline */}
        <div className="fade-up" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <span style={{ width: '2.5rem', height: '2px', background: 'var(--red)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '0.25em', color: 'var(--red)' }}>
            MEDICAL IMAGE PROCESSING ENGINEER 
          </span>
        </div>

        {/* Name + Photo row */}
        <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
        <h1
            className="display"
            style={{ fontSize: 'clamp(4rem, 12vw, 11rem)', color: 'var(--text)', maxWidth: '900px', lineHeight: 0.9 }}
        >
            {about.name || FALLBACK.name}
        </h1>
        {about.photo_url && (
            <img
            src={about.photo_url}
            alt={about.name}
            style={{
                width: '220px',
                height: '220px',
                objectFit: 'cover',
                objectPosition: 'top',
                border: '3px solid var(--red)',
                flexShrink: 0,
                filter: 'grayscale(20%)',
                borderRadius: '50%',
            }}
            />
        )}
        </div>

        {/* Tagline */}
        <p className="fade-up delay-2" style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
          color: 'var(--muted)',
          maxWidth: '560px',
          marginTop: '1.5rem',
          lineHeight: 1.6,
          fontWeight: 300,
        }}>
          {about.tagline || FALLBACK.tagline}
        </p>

        {/* CTAs */}
        <div className="fade-up delay-3" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2.5rem' }}>
          <a href="#projects" className="btn btn-primary">View Research ↓</a>
          {about.resume_url && about.resume_url !== '#' && (
            <a href={about.resume_url} target="_blank" rel="noreferrer" className="btn btn-outline">Download CV</a>
          )}
          <a href="#contact" className="btn btn-outline">Get in Touch</a>
        </div>

        {/* Social row */}
        <div className="fade-up delay-4" style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem', flexWrap: 'wrap' }}>
          {[
            { label: 'GitHub', url: about.github || FALLBACK.github },
            { label: 'LinkedIn', url: about.linkedin || FALLBACK.linkedin },
            { label: 'Email', url: `mailto:${about.email || FALLBACK.email}` },
          ].map(({ label, url }) => (
            <a key={label} href={url} target="_blank" rel="noreferrer" style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.78rem',
              letterSpacing: '0.15em',
              color: 'var(--muted)',
              borderBottom: '1px solid transparent',
              paddingBottom: '2px',
              transition: 'color 0.2s, border-color 0.2s',
            }}
              onMouseEnter={e => { e.target.style.color = 'var(--red)'; e.target.style.borderBottomColor = 'var(--red)'; }}
              onMouseLeave={e => { e.target.style.color = 'var(--muted)'; e.target.style.borderBottomColor = 'transparent'; }}
            >{label}</a>
          ))}
        </div>

        

        {/* Location badge */}
        <div style={{ marginTop: '2rem' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            color: 'var(--muted)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: '0.3rem 0.8rem',
          }}>
            📍 CHENNAI, INDIA · B.TECH AI & MEDICAL ENGINEERING · SRIHIER
          </span>
        </div>
      </div>

      {/* Decorative large red letter */}
      <div style={{
        position: 'absolute', right: '-0.02em', top: '50%',
        transform: 'translateY(-50%)',
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(12rem, 22vw, 26rem)',
        lineHeight: 1,
        color: 'transparent',
        WebkitTextStroke: '1px rgba(255,60,0,0.08)',
        pointerEvents: 'none',
        userSelect: 'none',
        letterSpacing: '-0.05em',
      }}>KSV</div>
    </section>
  );
}