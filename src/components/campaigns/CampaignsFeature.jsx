import { useState } from 'react';
import { motion } from 'framer-motion';
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
  
  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          
          <button className="btn btn-primary flex items-center gap-2 whitespace-nowrap">
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
    </div>
  );
}