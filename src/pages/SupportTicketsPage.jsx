import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { AuthContext } from '../App';
import { Link } from 'react-router-dom';
import SupportFeature from '../components/support/SupportFeature';
import getIcon from '../utils/iconUtils';

export default function SupportTicketsPage() {
  const { logout } = useContext(AuthContext);
  const user = useSelector((state) => state.user.user);
  
  // Icon components
  const Users = getIcon('Users');
  const BarChart = getIcon('BarChart');
  const PieChart = getIcon('PieChart');
  const Calendar = getIcon('Calendar');
  const MessageSquare = getIcon('MessageSquare');
  const Briefcase = getIcon('Briefcase');
  const Mail = getIcon('Mail');
  const LifeBuoy = getIcon('LifeBuoy');
  const Settings = getIcon('Settings');
  const LogOut = getIcon('LogOut');
  const Bell = getIcon('Bell');
  const Search = getIcon('Search');
  
  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-surface-900 text-surface-800 dark:text-surface-100">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-surface-800 shadow-card">
        {/* Logo */}
        <div className="h-16 border-b border-surface-200 dark:border-surface-700 flex items-center justify-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            NexusFlow
          </h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            <li>
              <Link to="/dashboard" className="flex items-center w-full p-3 rounded-lg transition-all hover:bg-surface-100 dark:hover:bg-surface-700">
                <span className="mr-3"><BarChart size={20} /></span>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/contacts" className="flex items-center w-full p-3 rounded-lg transition-all hover:bg-surface-100 dark:hover:bg-surface-700">
                <span className="mr-3"><Users size={20} /></span>
                <span>Contacts</span>
              </Link>
            </li>
            <li>
              <Link to="/deals" className="flex items-center w-full p-3 rounded-lg transition-all hover:bg-surface-100 dark:hover:bg-surface-700">
                <span className="mr-3"><Briefcase size={20} /></span>
                <span>Sales Pipeline</span>
              </Link>
            </li>
            <li>
              <Link to="/campaigns" className="flex items-center w-full p-3 rounded-lg transition-all hover:bg-surface-100 dark:hover:bg-surface-700">
                <span className="mr-3"><Mail size={20} /></span>
                <span>Campaigns</span>
              </Link>
            </li>
            <li>
              <Link to="/support-tickets" className="flex items-center w-full p-3 rounded-lg transition-all bg-primary bg-opacity-10 text-primary dark:bg-opacity-20">
                <span className="mr-3"><LifeBuoy size={20} /></span>
                <span>Support</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Profile */}
        <div className="p-4 border-t border-surface-200 dark:border-surface-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="ml-3">
              <p className="font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-surface-500 dark:text-surface-400">{user?.emailAddress}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-4 w-full flex items-center justify-center gap-2 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-surface-800 shadow-sm flex items-center justify-between px-4 md:px-6">
          <div className="text-xl font-bold">Support Tickets</div>
          
          {/* Search bar */}
          <div className="hidden md:flex items-center relative flex-1 max-w-md mx-4">
            <Search size={18} className="absolute left-3 text-surface-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 w-full rounded-xl"
            />
          </div>
          
          {/* Notifications */}
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full"></span>
            </button>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <SupportFeature />
        </main>
      </div>
    </div>
  );
}