import { useState } from 'react';
import { motion } from 'framer-motion';
import getIcon from '../../utils/iconUtils';

export default function SupportFeature() {
  // Icon components
  const Search = getIcon('Search');
  const Plus = getIcon('Plus');
  const Filter = getIcon('Filter');
  const Clock = getIcon('Clock');
  const User = getIcon('User');
  const AlertTriangle = getIcon('AlertTriangle');
  const CheckCircle = getIcon('CheckCircle');
  const MessageSquare = getIcon('MessageSquare');
  const ChevronDown = getIcon('ChevronDown');
  
  // Sample support tickets
  const tickets = [
    {
      id: 'TKT-1001',
      subject: 'Issue with payment processing',
      customer: 'John Smith',
      company: 'Acme Corporation',
      status: 'open',
      priority: 'high',
      createdAt: '2023-08-10T09:24:00',
      lastUpdated: '2023-08-10T14:30:00',
      assignedTo: 'Sarah Johnson'
    },
    {
      id: 'TKT-1002',
      subject: 'Need assistance with account setup',
      customer: 'Lisa Wong',
      company: 'InnovateTech',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '2023-08-09T15:12:00',
      lastUpdated: '2023-08-10T11:45:00',
      assignedTo: 'Michael Chen'
    },
    {
      id: 'TKT-1003',
      subject: 'Data import failed',
      customer: 'Robert Taylor',
      company: 'First Financial',
      status: 'open',
      priority: 'critical',
      createdAt: '2023-08-10T08:05:00',
      lastUpdated: '2023-08-10T08:05:00',
      assignedTo: 'Unassigned'
    },
    {
      id: 'TKT-1004',
      subject: 'Feature request: Add export to CSV',
      customer: 'Emily Davis',
      company: 'Global Solutions',
      status: 'resolved',
      priority: 'low',
      createdAt: '2023-08-05T10:30:00',
      lastUpdated: '2023-08-08T16:20:00',
      assignedTo: 'Sarah Johnson'
    }
  ];
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Priority and status styling
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200';
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-500 text-white';
      case 'in-progress': return 'bg-yellow-500 text-white';
      case 'resolved': return 'bg-green-500 text-white';
      case 'closed': return 'bg-surface-500 text-white';
      default: return 'bg-surface-200 text-surface-800';
    }
  };
  
  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Format date relative to now
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60)); // Difference in hours
    
    if (diff < 24) {
      return `${diff} hours ago`;
    } else {
      return `${Math.floor(diff / 24)} days ago`;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold">Support Tickets</h2>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-8 pl-8 py-2 rounded-lg"
            />
            <Search size={16} className="absolute left-2.5 top-2.5 text-surface-400" />
          </div>
          
          <button className="btn btn-primary flex items-center gap-2 whitespace-nowrap">
            <Plus size={16} />
            <span className="hidden md:inline">New Ticket</span>
            <span className="md:hidden">New</span>
          </button>
        </div>
      </div>
    </div>
  );
}