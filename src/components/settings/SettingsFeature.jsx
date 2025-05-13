import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../../utils/iconUtils';

export default function SettingsFeature() {
  // Icon components
  const User = getIcon('User');
  const Users = getIcon('Users');
  const Lock = getIcon('Lock');
  const Bell = getIcon('Bell');
  const MessageSquare = getIcon('MessageSquare');
  const Database = getIcon('Database');
  const HelpCircle = getIcon('HelpCircle');
  const Save = getIcon('Save');
  const ChevronRight = getIcon('ChevronRight');
  
  // Settings categories
  const categories = [
    { id: 'profile', label: 'Profile Settings', icon: <User size={20} /> },
    { id: 'team', label: 'Team Management', icon: <Users size={20} /> },
    { id: 'security', label: 'Security', icon: <Lock size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'integrations', label: 'Integrations', icon: <Database size={20} /> },
    { id: 'billing', label: 'Billing & Subscription', icon: <Database size={20} /> },
    { id: 'help', label: 'Help & Support', icon: <HelpCircle size={20} /> }
  ];
  
  // State
  const [activeCategory, setActiveCategory] = useState('profile');
  
  // Profile settings form
  const [profileForm, setProfileForm] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@example.com',
    jobTitle: 'Sales Manager',
    phone: '(555) 123-4567',
    timezone: 'America/New_York'
  });
  
  // Handle form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({ ...profileForm, [name]: value });
  };
  
  // Handle form submit
  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success('Profile settings saved successfully!');
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Settings Sidebar */}
      <div className="md:col-span-1">
        <div className="card overflow-hidden">
          <ul className="divide-y divide-surface-200 dark:divide-surface-700">
            {categories.map(category => (
              <li key={category.id}>
                <button
                  className={`w-full p-3 flex items-center justify-between ${
                    activeCategory === category.id 
                      ? 'bg-primary bg-opacity-10 text-primary' 
                      : 'hover:bg-surface-50 dark:hover:bg-surface-800'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <div className="flex items-center">
                    <span className="mr-3">{category.icon}</span>
                    <span>{category.label}</span>
                  </div>
                  {activeCategory === category.id && <ChevronRight size={16} />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Settings Content */}
      <div className="md:col-span-3">
        <div className="card p-6">
          {activeCategory === 'profile' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
              
              <form onSubmit={handleSaveProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={handleProfileChange}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileForm.lastName}
                      onChange={handleProfileChange}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Job Title</label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={profileForm.jobTitle}
                      onChange={handleProfileChange}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <button type="submit" className="btn btn-primary flex items-center gap-2">
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}