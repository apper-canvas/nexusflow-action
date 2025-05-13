import { useState, useEffect, createContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Authentication
import { setUser, clearUser } from './store/userSlice';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Pages
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ContactsPage from './pages/ContactsPage';
import DealsPage from './pages/DealsPage';
import CampaignsPage from './pages/CampaignsPage';
import SupportTicketsPage from './pages/SupportTicketsPage';

// Icons
import getIcon from './utils/iconUtils';

// Create auth context
export const AuthContext = createContext(null);

export default function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
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

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function(user) {
        // Store user data in Redux store
        let currentPath = window.location.pathname + window.location.search;
        if (user && user.isAuthenticated) {
          dispatch(setUser(user));
          navigate('/dashboard');
        } else if (!currentPath.includes('login')) {
          navigate(currentPath);
        } else {
          navigate('/login');
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
    
    setIsInitialized(true);
  }, [dispatch, navigate]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
    toast.info(darkMode ? "Light mode activated" : "Dark mode activated", {
      icon: darkMode ? "☀️" : "🌙",
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
  
  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="flex items-center justify-center h-screen">
      <p className="text-xl">Initializing application...</p>
    </div>;
  }

  return (
    <AuthContext.Provider value={authMethods}>
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
        {/* Public routes - accessible only when NOT authenticated */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        
        {/* Protected routes - require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/support-tickets" element={<SupportTicketsPage />} />
        </Route>
        
        {/* Catch-all route */}
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
    </AuthContext.Provider>
  );
}