import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

export default function NotFound() {
  // Icon components
  const Home = getIcon('Home');
  const AlertCircle = getIcon('AlertCircle');
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-surface-50 dark:bg-surface-900">
      <motion.div 
        className="max-w-lg w-full mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex justify-center">
          <motion.div
            initial={{ scale: 0.8, rotate: 0 }}
            animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
            transition={{ 
              duration: 0.8,
              times: [0, 0.2, 0.4, 0.6, 0.8],
              ease: "easeInOut" 
            }}
            className="w-24 h-24 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center"
          >
            <AlertCircle size={48} className="text-accent" />
          </motion.div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          404
        </h1>
        
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-surface-800 dark:text-surface-100">
          Page Not Found
        </h2>
        
        <p className="text-surface-600 dark:text-surface-300 mb-8 text-lg">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Home size={18} />
            <span>Return to Dashboard</span>
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}