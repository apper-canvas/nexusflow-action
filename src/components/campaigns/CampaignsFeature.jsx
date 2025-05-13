import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../../utils/iconUtils';

export default function CampaignsFeature() {
  // Icon components
  const Mail = getIcon('Mail');
  const Users = getIcon('Users');
  const Calendar = getIcon('Calendar');
  const BarChart = getIcon('BarChart');
  const CheckCircle = getIcon('CheckCircle');
  const Clock = getIcon('Clock');
  const Plus = getIcon('Plus');
  const ChevronRight = getIcon('ChevronRight');
  const Search = getIcon('Search');
  const X = getIcon('X');
  const CalendarIcon = getIcon('Calendar');
  const AtSign = getIcon('AtSign');
  const Target = getIcon('Target');
  const Filter = getIcon('Filter');
  
  // Sample campaigns data
  const campaigns = [
    {
      id: 1,
      name: 'Summer Promotion',
      type: 'email',
      status: 'active',
      sent: 2450,
      opened: 1203,
      clicked: 348,
      converted: 42,
      startDate: '2023-07-15',
      endDate: '2023-08-15'
    },
    {
      id: 2,
      name: 'Product Launch - Enterprise CRM',
      type: 'email',
      status: 'scheduled',
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      startDate: '2023-09-01',
      endDate: '2023-09-15'
    },
    {
      id: 3,
      name: 'Customer Feedback Survey',
      type: 'email',
      status: 'completed',
      sent: 1850,
      opened: 945,
      clicked: 523,
      converted: 105,
      startDate: '2023-06-01',
      endDate: '2023-06-15'
    },
    {
      id: 4,
      name: 'Early Bird Discount',
      type: 'email',
      status: 'draft',
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      startDate: '',
      endDate: ''
    }
  ];
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaignData, setCampaignData] = useState({
    name: '',
    type: 'email',
    status: 'draft',
    sent: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
    startDate: '',
    endDate: ''
  });
  
  // Filter campaigns
  const [filteredCampaigns, setFilteredCampaigns] = useState(campaigns);
  useEffect(() => {
    setFilteredCampaigns(campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  ));
  }, [searchTerm, campaigns]);
  
  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      case 'completed': return 'bg-surface-500';
      case 'draft': return 'bg-yellow-500';
      default: return 'bg-surface-300';
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCampaignData({
      ...campaignData,
      [name]: value
    });
  };
  
  // Form validation
  const validateForm = () => {
    if (!campaignData.name.trim()) {
      toast.error("Campaign name is required");
      return false;
    }
    if (campaignData.status === 'scheduled' || campaignData.status === 'active') {
      if (!campaignData.startDate) {
        toast.error("Start date is required for scheduled or active campaigns");
        return false;
      }
      if (!campaignData.endDate) {
        toast.error("End date is required for scheduled or active campaigns");
        return false;
      }
    }
    return true;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const newCampaign = {
      id: campaigns.length + 1,
      ...campaignData
    };
    
    // Update campaigns list
    campaigns.push(newCampaign);
    setFilteredCampaigns([...filteredCampaigns, newCampaign]);
    
    // Close modal and reset form
    setIsModalOpen(false);
    toast.success("Campaign created successfully!");
    setCampaignData({ name: '', type: 'email', status: 'draft', sent: 0, opened: 0, clicked: 0, converted: 0, startDate: '', endDate: '' });
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold">Marketing Campaigns</h2>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-8 pl-8 py-2 rounded-lg"
            />
            <Search size={16} className="absolute left-2.5 top-2.5 text-surface-400" />
          </div>
          
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary flex items-center gap-2 whitespace-nowrap">
            <Plus size={16} />
            <span className="hidden md:inline">New Campaign</span>
            <span className="md:hidden">New</span>
          </button>
        </div>
      </div>
      
      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.map(campaign => (
          <motion.div 
            key={campaign.id}
            className="card p-4 hover:shadow-soft cursor-pointer"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{campaign.name}</h3>
              <div className={`px-2 py-1 rounded-full text-xs text-white font-medium ${getStatusColor(campaign.status)}`}>{campaign.status}</div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Campaign Modal */}
      <CampaignModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        campaignData={campaignData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        X={X}
        CalendarIcon={CalendarIcon}
        Mail={Mail}
        Users={Users}
        Target={Target}
        CheckCircle={CheckCircle}
      />
    </div>
  );
}

function CampaignModal({ isOpen, onClose, campaignData, handleInputChange, handleSubmit, X, CalendarIcon, Mail, Users, Target, CheckCircle }) {
  // Ref for focus management
  const initialFocusRef = useRef(null);
  
  // Focus the first input when modal opens
  useEffect(() => {
    if (isOpen && initialFocusRef.current) {
      setTimeout(() => {
        initialFocusRef.current.focus();
      }, 100);
    }
  }, [isOpen]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-base-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Create New Campaign</h3>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-base-100/10 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Campaign Name*</label>
                    <input
                      ref={initialFocusRef}
                      type="text"
                      name="name"
                      value={campaignData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg"
                      placeholder="Enter campaign name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Campaign Type</label>
                    <div className="flex items-center gap-2 p-2 rounded-lg border border-base-200">
                      <Mail size={16} className="text-primary-500" />
                      <select
                        name="type"
                        value={campaignData.type}
                        onChange={handleInputChange}
                        className="flex-1 bg-transparent outline-none"
                      >
                        <option value="email">Email Campaign</option>
                        <option value="social">Social Media Campaign</option>
                        <option value="ads">Ads Campaign</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Start Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="startDate"
                          value={campaignData.startDate}
                          onChange={handleInputChange}
                          className="w-full p-2 rounded-lg pl-9"
                        />
                        <CalendarIcon size={16} className="absolute left-2.5 top-3 text-surface-400" />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium">End Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="endDate"
                          value={campaignData.endDate}
                          onChange={handleInputChange}
                          className="w-full p-2 rounded-lg pl-9"
                        />
                        <CalendarIcon size={16} className="absolute left-2.5 top-3 text-surface-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Status</label>
                    <select
                      name="status"
                      value={campaignData.status}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg"
                    >
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="active">Active</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn btn-subtle"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary flex items-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Create Campaign
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}