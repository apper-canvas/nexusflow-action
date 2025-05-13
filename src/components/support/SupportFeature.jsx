import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from '../../utils/iconUtils';
import { toast } from 'react-toastify';

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
  const X = getIcon('X');
  
  // State for modal
  const [showModal, setShowModal] = useState(false);
  
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
  const [ticketsList, setTicketsList] = useState(tickets);
  
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
  const filteredTickets = ticketsList.filter(ticket => {
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
  
  // Add new ticket function
  const addNewTicket = (ticketData) => {
    const newTicket = {
      id: `TKT-${1000 + ticketsList.length + 1}`,
      subject: ticketData.subject,
      customer: ticketData.customer,
      company: ticketData.company,
      status: 'open',
      priority: ticketData.priority,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      assignedTo: 'Unassigned'
    };
    
    setTicketsList(prev => [newTicket, ...prev]);
    setShowModal(false);
    toast.success('New support ticket created successfully!');
  };
  
  // Ticket Modal Component
  const TicketModal = () => {
    const [formData, setFormData] = useState({
      subject: '',
      customer: '',
      company: '',
      priority: 'medium',
      description: ''
    });
    const [errors, setErrors] = useState({});
    const modalRef = useRef(null);
    const subjectInputRef = useRef(null);
    
    useEffect(() => {
      // Focus on the subject input when modal opens
      if (showModal && subjectInputRef.current) {
        setTimeout(() => subjectInputRef.current.focus(), 100);
      }
      
      // Handle click outside to close
      const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
          setShowModal(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showModal]);
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error when field is changed
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
      }
    };
    
    const validateForm = () => {
      const newErrors = {};
      if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
      if (!formData.customer.trim()) newErrors.customer = 'Customer name is required';
      if (!formData.company.trim()) newErrors.company = 'Company name is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      if (validateForm()) {
        addNewTicket(formData);
      }
    };
    
    return (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={modalRef}
          className="bg-white dark:bg-surface-800 rounded-xl w-full max-w-lg shadow-xl"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          <div className="flex justify-between items-center p-6 border-b border-surface-200 dark:border-surface-700">
            <h3 className="text-xl font-semibold">Create New Support Ticket</h3>
            <button 
              onClick={() => setShowModal(false)}
              className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Subject</label>
              <input
                type="text"
                name="subject"
                ref={subjectInputRef}
                value={formData.subject}
                onChange={handleChange}
                className={`w-full ${errors.subject ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="What is the issue about?"
              />
              {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Customer Name</label>
                <input
                  type="text"
                  name="customer"
                  value={formData.customer}
                  onChange={handleChange}
                  className={`w-full ${errors.customer ? 'border-red-500 dark:border-red-500' : ''}`}
                  placeholder="Customer name"
                />
                {errors.customer && <p className="text-red-500 text-sm">{errors.customer}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={`w-full ${errors.company ? 'border-red-500 dark:border-red-500' : ''}`}
                  placeholder="Company name"
                />
                {errors.company && <p className="text-red-500 text-sm">{errors.company}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`w-full ${errors.description ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="Describe the issue in detail..."
              ></textarea>
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex items-center gap-2"
              >
                <CheckCircle size={16} />
                Create Ticket
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
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
          
          <div className="relative">
            <button 
              className="btn btn-outline flex items-center gap-2"
              onClick={() => setStatusFilter(prev => prev === 'all' ? 'open' : 'all')}
            >
              <Filter size={16} />
              <span>{statusFilter === 'all' ? 'All Tickets' : statusFilter === 'open' ? 'Open' : statusFilter === 'in-progress' ? 'In Progress' : 'Resolved'}</span>
              <ChevronDown size={16} />
            </button>
            
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-lg shadow-lg z-10 border border-surface-200 dark:border-surface-700 overflow-hidden">
              <div className="py-1">
                <button 
                  onClick={() => setStatusFilter('all')} 
                  className={`block px-4 py-2 text-sm w-full text-left hover:bg-surface-100 dark:hover:bg-surface-700 ${statusFilter === 'all' ? 'bg-surface-100 dark:bg-surface-700' : ''}`}
                >
                  All Tickets
                </button>
                <button 
                  onClick={() => setStatusFilter('open')} 
                  className={`block px-4 py-2 text-sm w-full text-left hover:bg-surface-100 dark:hover:bg-surface-700 ${statusFilter === 'open' ? 'bg-surface-100 dark:bg-surface-700' : ''}`}
                >
                  Open
                </button>
                <button 
                  onClick={() => setStatusFilter('in-progress')} 
                  className={`block px-4 py-2 text-sm w-full text-left hover:bg-surface-100 dark:hover:bg-surface-700 ${statusFilter === 'in-progress' ? 'bg-surface-100 dark:bg-surface-700' : ''}`}
                >
                  In Progress
                </button>
                <button 
                  onClick={() => setStatusFilter('resolved')} 
                  className={`block px-4 py-2 text-sm w-full text-left hover:bg-surface-100 dark:hover:bg-surface-700 ${statusFilter === 'resolved' ? 'bg-surface-100 dark:bg-surface-700' : ''}`}
                >
                  Resolved
                </button>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setShowModal(true)}
            className="btn btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={16} />
            <span className="hidden md:inline">New Ticket</span>
            <span className="md:hidden">New</span>
          </button>
        </div>
      </div>
      
      {/* Tickets list */}
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
            <thead className="bg-surface-50 dark:bg-surface-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Ticket</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Priority</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Last Updated</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
              {filteredTickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-surface-50 dark:hover:bg-surface-700 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium">{ticket.subject}</div>
                      <div className="text-xs text-surface-500">{ticket.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{ticket.customer} <span className="text-surface-500">• {ticket.company}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(ticket.status)}`}>{ticket.status.replace('-', ' ')}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadge(ticket.priority)}`}>{ticket.priority}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500">{formatDate(ticket.lastUpdated)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* New Ticket Modal */}
      <AnimatePresence>
        {showModal && <TicketModal />}
      </AnimatePresence>
    </div>
  );
}