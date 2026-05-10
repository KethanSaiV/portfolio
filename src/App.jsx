import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { supabase } from './lib/supabase';

// Load theme from Supabase and apply to CSS variables on every page load
const CSS_MAP = {
  accent: '--red',
  background: '--black',
  card: '--surface',
  surface2: '--surface2',
  border: '--border',
  text: '--text',
  muted: '--muted',
};

supabase.from('theme').select('*').limit(1).single().then(({ data }) => {
  if (data) {
    const root = document.documentElement;
    Object.entries(CSS_MAP).forEach(([k, v]) => {
      if (data[k]) root.style.setProperty(v, data[k]);
    });
  }
});

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}