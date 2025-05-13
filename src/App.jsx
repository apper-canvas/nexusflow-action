import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Icons
import getIcon from './utils/iconUtils';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true' || (savedMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
    toast.info(darkMode ? "Light mode activated" : "Dark mode activated", {
      icon: darkMode ? "☀️" : "🌙",
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-full bg-surface-100 dark:bg-surface-800 shadow-card transition-all hover:shadow-soft"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <span className="text-yellow-400">☀️</span>
          ) : (
            <span className="text-blue-700">🌙</span>
          )}
        </button>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        className="md:mt-0 mt-16" // Responsive positioning
      />
    </>
  );
}