import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Publications from '../components/Publications';
import Experience from '../components/Experience';
import Skills from '../components/Skills';
import Gallery from '../components/Gallery';
import Blog from '../components/Blog';
import Contact from '../components/Contact';

export default function Home() {
  const [show, setShow] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') !== 'light');

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.style.setProperty('--black', '#080808');
      root.style.setProperty('--surface', '#111111');
      root.style.setProperty('--surface2', '#181818');
      root.style.setProperty('--border', '#242424');
      root.style.setProperty('--text', '#f0ede8');
      root.style.setProperty('--muted', '#888880');
      localStorage.setItem('theme', 'dark');
    } else {
      root.style.setProperty('--black', '#f5f3ef');
      root.style.setProperty('--surface', '#ffffff');
      root.style.setProperty('--surface2', '#eeebe6');
      root.style.setProperty('--border', '#d8d4cc');
      root.style.setProperty('--text', '#0a0a0a');
      root.style.setProperty('--muted', '#666660');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <main>
      <Hero />
      <Projects />
      <Publications />
      <Experience />
      <Skills />
      <Gallery />
      <Blog />
      <Contact />

      {/* Theme toggle */}
      <button
        onClick={() => setDark(d => !d)}
        title="Toggle theme"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '5.5rem',
          width: '48px',
          height: '48px',
          background: 'var(--surface)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          fontFamily: 'var(--font-display)',
          fontSize: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 999,
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--red)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        {dark ? '☀' : '☾'}
      </button>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Back to top"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '48px',
          height: '48px',
          background: 'var(--red)',
          color: '#fff',
          fontFamily: 'var(--font-display)',
          fontSize: '1.2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: 'none',
          opacity: show ? 1 : 0,
          pointerEvents: show ? 'auto' : 'none',
          transition: 'opacity 0.3s ease, transform 0.2s ease',
          transform: show ? 'translateY(0)' : 'translateY(10px)',
          zIndex: 999,
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--red-dim)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--red)'}
      >
        ↑
      </button>
    </main>
  );
}