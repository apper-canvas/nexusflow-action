import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

export default function Home() {
  const [selectedTab, setSelectedTab] = useState('pipeline');
  
  // Icon components
  const ChevronRight = getIcon('ChevronRight');
  const Users = getIcon('Users');
  const BarChart = getIcon('BarChart');
  const PieChart = getIcon('PieChart');
  const Calendar = getIcon('Calendar');
  const MessageSquare = getIcon('MessageSquare');
  const Briefcase = getIcon('Briefcase');
  const Mail = getIcon('Mail');
  const LifeBuoy = getIcon('LifeBuoy');
  const Settings = getIcon('Settings');
  const Menu = getIcon('Menu');
  const X = getIcon('X');
  const Search = getIcon('Search');
  const Bell = getIcon('Bell');
  
  // Sample KPI data
  const kpiData = {
    newLeads: 32,
    activeDeals: 18,
    closedDeals: 7,
    conversion: 28
  };
  
  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart size={20} /> },
    { id: 'contacts', label: 'Contacts', icon: <Users size={20} /> },
    { id: 'pipeline', label: 'Sales Pipeline', icon: <Briefcase size={20} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { id: 'campaigns', label: 'Campaigns', icon: <Mail size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <PieChart size={20} /> },
    { id: 'support', label: 'Support', icon: <LifeBuoy size={20} /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
  ];
  
  // Handle tab click
  const handleTabClick = (tabId) => {
    setSelectedTab(tabId);
    
    // On mobile, close sidebar when tab is selected
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    
    // Show a toast notification
    toast.info(`${tabId.charAt(0).toUpperCase() + tabId.slice(1)} module activated`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-surface-900 text-surface-800 dark:text-surface-100">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed md:relative w-64 h-full z-40 md:z-auto bg-white dark:bg-surface-800 shadow-card transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-surface-200 dark:border-surface-700">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              NexusFlow
            </h1>
            
            {/* Close button for mobile */}
            <button 
              className="absolute right-4 top-4 md:hidden"
              onClick={toggleSidebar}
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`flex items-center w-full p-3 rounded-lg transition-all ${
                      selectedTab === item.id
                        ? 'bg-primary bg-opacity-10 text-primary dark:bg-opacity-20'
                        : 'hover:bg-surface-100 dark:hover:bg-surface-700'
                    }`}
                    onClick={() => handleTabClick(item.id)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                    
                    {selectedTab === item.id && (
                      <span className="ml-auto">
                        <ChevronRight size={16} />
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Profile */}
          <div className="p-4 border-t border-surface-200 dark:border-surface-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold">
                JS
              </div>
              <div className="ml-3">
                <p className="font-medium">John Smith</p>
                <p className="text-sm text-surface-500 dark:text-surface-400">Sales Manager</p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-surface-800 shadow-sm flex items-center justify-between px-4 md:px-6">
          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={toggleSidebar}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          
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
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
            </h1>
            <p className="text-surface-500 dark:text-surface-400 mt-1">
              Manage your {selectedTab} effectively with NexusFlow
            </p>
          </div>
          
          {/* KPI Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div 
              className="card flex flex-col items-center justify-center py-4"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="text-2xl md:text-3xl font-bold text-primary">{kpiData.newLeads}</span>
              <span className="text-sm text-surface-500 dark:text-surface-400">New Leads</span>
            </motion.div>
            
            <motion.div 
              className="card flex flex-col items-center justify-center py-4"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="text-2xl md:text-3xl font-bold text-secondary">{kpiData.activeDeals}</span>
              <span className="text-sm text-surface-500 dark:text-surface-400">Active Deals</span>
            </motion.div>
            
            <motion.div 
              className="card flex flex-col items-center justify-center py-4"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="text-2xl md:text-3xl font-bold text-green-500">{kpiData.closedDeals}</span>
              <span className="text-sm text-surface-500 dark:text-surface-400">Closed Deals</span>
            </motion.div>
            
            <motion.div 
              className="card flex flex-col items-center justify-center py-4"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="text-2xl md:text-3xl font-bold text-accent">{kpiData.conversion}%</span>
              <span className="text-sm text-surface-500 dark:text-surface-400">Conversion Rate</span>
            </motion.div>
          </div>
          
          {/* Main Feature */}
          <MainFeature />
        </main>
      </div>
    </div>
  );
}