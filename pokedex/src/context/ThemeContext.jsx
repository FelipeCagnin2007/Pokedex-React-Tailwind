import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('poke-theme');
    if (saved) return saved;
    // Default: light mode (respeita OS como fallback apenas se não tiver preferência salva)
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('poke-theme', theme);

    // Update theme-color meta tag
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.content = theme === 'dark' ? '#0F172A' : '#F8FAFC';
    }
  }, [theme]);

  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
