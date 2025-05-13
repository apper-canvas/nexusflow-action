import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../../utils/iconUtils';
import { fetchCampaigns, createCampaign, updateCampaign, deleteCampaign } from '../../services/campaignService';

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
  
  // State management
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaignData, setCampaignData] = useState({
    Name: '',
    type: 'email',
    status: 'draft',
    sent: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
    startDate: '',
    endDate: ''
  });
  
  // Load campaigns
  useEffect(() => {
    loadCampaigns();
  }, []);
  
  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      loadCampaigns();
    }, 500);
    
    return () => clearTimeout(handler);
  }, [searchTerm]);
  
  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const filters = {
        searchTerm
      };
      
      const { data } = await fetchCampaigns(filters);
      setCampaigns(data);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
    if (!campaignData.Name.trim()) {
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const result = await createCampaign(campaignData);
      
      if (result) {
        // Refresh campaigns list
        await loadCampaigns();
        
        // Close modal and reset form
        setIsModalOpen(false);
        setCampaignData({
          Name: '',
          type: 'email',
          status: 'draft',
          sent: 0,
          opened: 0,
          clicked: 0,
          converted: 0,
          startDate: '',
          endDate: ''
        });
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };
  
  // Handle delete campaign
  const handleDeleteCampaign = async (id) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      try {
        const result = await deleteCampaign(id);
        
        if (result) {
          // Remove from local state
          setCampaigns(campaigns.filter(c => c.Id !== id));
        }
      } catch (error) {
        console.error('Error deleting campaign:', error);
      }
    }
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
        {loading ? (
          <div className="flex justify-center p-8">
            <p className="text-surface-500">Loading campaigns...</p>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-surface-500">No campaigns found. Try adjusting your search or create a new campaign.</p>
          </div>
        ) : (
          filteredCampaigns.map(campaign => (
            <motion.div 
              key={campaign.Id}
              className="card p-4 hover:shadow-soft cursor-pointer"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{campaign.Name}</h3>
                <div className={`px-2 py-1 rounded-full text-xs text-white font-medium ${getStatusColor(campaign.status)}`}>{campaign.status}</div>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-surface-500">
                <div className="flex items-center">
                  <Mail size={14} className="mr-1" />
                  {campaign.type}
                </div>
                
                {campaign.startDate && (
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {new Date(campaign.startDate).toLocaleDateString()}
                  </div>
                )}
                
                <div className="flex items-center">
                  <Target size={14} className="mr-1" />
                  {campaign.sent} sent, {campaign.converted} converted
                </div>
              </div>
              
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => handleDeleteCampaign(campaign.Id)}
                  className="text-surface-400 hover:text-red-500 p-1"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
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
            <div className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Create New Campaign</h3>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
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
                      name="Name"
                      value={campaignData.Name}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg"
                      placeholder="Enter campaign name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Campaign Type</label>
                    <div className="flex items-center gap-2 p-2 rounded-lg border border-surface-200 dark:border-surface-700">
                      <Mail size={16} className="text-primary" />
                      <select
                        name="type"
                        value={campaignData.type}
                        onChange={handleInputChange}
                        className="flex-1 bg-transparent outline-none border-none"
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
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
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