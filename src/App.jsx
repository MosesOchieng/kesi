import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, createContext, useContext, useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Theme context for dark mode
const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}

function App() {
  const [count, setCount] = useState(0)
  const { theme, toggleTheme } = useTheme();

  return (
    <Router>
      <button
        onClick={toggleTheme}
        style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}
        aria-label="Toggle dark mode"
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

// Wrap App in ThemeProvider for export
export default function WrappedApp() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
