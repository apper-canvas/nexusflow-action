import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import getIcon from '../../utils/iconUtils';
import { fetchDeals, createDeal, updateDeal, deleteDeal } from '../../services/dealService';

// This component implements a Sales Pipeline feature with drag and drop deal management
export default function PipelineFeature() {
  // Icon components
  const Plus = getIcon('Plus');
  const Edit = getIcon('Edit');
  const Trash2 = getIcon('Trash2');
  const DollarSign = getIcon('DollarSign');
  const Calendar = getIcon('Calendar');
  const User = getIcon('User');
  const Building = getIcon('Building');
  const ChevronDown = getIcon('ChevronDown');
  const Phone = getIcon('Phone');
  const Mail = getIcon('Mail');
  const AlertCircle = getIcon('AlertCircle');
  const Info = getIcon('Info');
  const CheckCircle2 = getIcon('CheckCircle2');
  const X = getIcon('X');
  const Search = getIcon('Search');
  
  // Pipeline stages
  const stages = [
    { id: 'lead', name: 'Lead', color: 'bg-blue-500' },
    { id: 'qualified', name: 'Qualified', color: 'bg-indigo-500' },
    { id: 'proposal', name: 'Proposal', color: 'bg-purple-500' },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-pink-500' },
    { id: 'closed', name: 'Closed Won', color: 'bg-green-500' }
  ];
  
  // State management
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDeal, setNewDeal] = useState({
    title: '',
    customer: '',
    value: '',
    stage: 'lead',
    probability: 20,
    expectedCloseDate: format(new Date(), 'yyyy-MM-dd'),
    type: 'company',
    contact: '',
    email: '',
    phone: ''
  });
  const [draggedDealId, setDraggedDealId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load deals when component mounts
  useEffect(() => {
    loadDeals();
  }, []);
  
  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      loadDeals();
    }, 500);
    
    return () => clearTimeout(handler);
  }, [searchTerm]);
  
  // Load deals from API
  const loadDeals = async () => {
    setLoading(true);
    try {
      const filters = {
        searchTerm
      };
      
      const { data } = await fetchDeals(filters);
      
      // Map API data structure to component structure
      const mappedDeals = data.map(deal => ({
        id: deal.Id.toString(),
        title: deal.title || deal.Name,
        customer: deal.customer,
        value: deal.value,
        stage: deal.stage,
        probability: deal.probability,
        expectedCloseDate: deal.expectedCloseDate,
        type: deal.type,
        contact: deal.contact,
        email: deal.email,
        phone: deal.phone
      }));
      
      setDeals(mappedDeals);
    } catch (error) {
      console.error('Error loading deals:', error);
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };
  
  // Filter deals based on search term
  const filteredDeals = deals.filter(deal => {
    const searchLower = searchTerm.toLowerCase();
    return (
      deal.title.toLowerCase().includes(searchLower) ||
      deal.customer.toLowerCase().includes(searchLower) ||
      deal.contact.toLowerCase().includes(searchLower)
    );
  });
  
  // Group deals by stage
  const getDealsByStage = (stageId) => {
    return filteredDeals.filter(deal => deal.stage === stageId);
  };
  
  // Handle drag operations
  const handleDragStart = (dealId) => {
    setDraggedDealId(dealId);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = async (stageId) => {
    if (draggedDealId) {
      const deal = deals.find(d => d.id === draggedDealId);
      if (!deal) return;
      
      // Update probability based on stage
      let probability;
      switch (stageId) {
        case 'lead': probability = 20; break;
        case 'qualified': probability = 40; break;
        case 'proposal': probability = 60; break;
        case 'negotiation': probability = 80; break;
        case 'closed': probability = 100; break;
        default: probability = deal.probability;
      }
      
      try {
        // Update in backend
        const updatedDealData = {
          ...deal,
          stage: stageId,
          probability
        };
        
        const result = await updateDeal(parseInt(draggedDealId), updatedDealData);
        
        if (result) {
          // Update local state
          setDeals(deals.map(d => d.id === draggedDealId ? {...d, stage: stageId, probability} : d));
          
          // Get the stage name for the toast
          const stage = stages.find(s => s.id === stageId);
          if (stage) {
            toast.success(`Moved ${deal.title} to ${stage.name} stage`);
          }
        }
      } catch (error) {
        console.error('Error updating deal stage:', error);
        toast.error('Failed to update deal stage');
      }
      
      setDraggedDealId(null);
    }
  };
  
  // Form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDeal({ ...newDeal, [name]: value });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!newDeal.title.trim()) errors.title = 'Deal title is required';
    if (!newDeal.customer.trim()) errors.customer = 'Customer name is required';
    if (!newDeal.value) errors.value = 'Deal value is required';
    if (newDeal.value && isNaN(newDeal.value)) errors.value = 'Deal value must be a number';
    if (!newDeal.contact.trim()) errors.contact = 'Contact name is required';
    if (!newDeal.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newDeal.email)) {
      errors.email = 'Email is invalid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleAddDeal = async () => {
    if (!validateForm()) return;
    
    try {
      // Prepare data for API
      const dealData = {
        Name: newDeal.title,
        title: newDeal.title,
        customer: newDeal.customer,
        value: parseFloat(newDeal.value),
        stage: newDeal.stage,
        probability: parseInt(newDeal.probability),
        expectedCloseDate: newDeal.expectedCloseDate,
        type: newDeal.type,
        contact: newDeal.contact,
        email: newDeal.email,
        phone: newDeal.phone
      };
      
      const result = await createDeal(dealData);
      
      if (result) {
        // Add to local state with the returned ID
        const newDealWithId = {
          ...newDeal,
          id: result.Id.toString()
        };
        
        setDeals([...deals, newDealWithId]);
        
        // Reset form and close modal
        setNewDeal({
          title: '',
          customer: '',
          value: '',
          stage: 'lead',
          probability: 20,
          expectedCloseDate: format(new Date(), 'yyyy-MM-dd'),
          type: 'company',
          contact: '',
          email: '',
          phone: ''
        });
        
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding deal:', error);
    }
  };
  
  const handleDeleteDeal = async (id) => {
    const dealToDelete = deals.find(deal => deal.id === id);
    
    if (confirm(`Are you sure you want to delete the deal "${dealToDelete.title}"?`)) {
      try {
        const result = await deleteDeal(parseInt(id));
        
        if (result) {
          setDeals(deals.filter(deal => deal.id !== id));
          
          toast.info('Deal deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting deal:', error);
      }
    }
  };
  
  // Calculate pipeline value
  const calculatePipelineValue = (stageId) => {
    return deals
      .filter(deal => deal.stage === stageId)
      .reduce((total, deal) => total + Number(deal.value), 0);
  };
  
  const totalPipelineValue = deals.reduce((total, deal) => total + Number(deal.value), 0);
  const weightedPipelineValue = deals.reduce(
    (total, deal) => total + (Number(deal.value) * Number(deal.probability) / 100), 0
  );
  
  // Deal detail view
  const handleViewDeal = (deal) => {
    setSelectedDeal(deal);
  };
  
  const closeDetailView = () => {
    setSelectedDeal(null);
  };
  
  // Search functionality
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Pipeline Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold">Sales Pipeline</h2>
          <div className="flex items-center text-surface-500 dark:text-surface-400 text-sm mt-1">
            <span className="mr-4">Total Value: ${totalPipelineValue.toLocaleString()}</span>
            <span>Weighted: ${Math.round(weightedPipelineValue).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pr-8 pl-3 py-2 rounded-lg"
            />
          </div>
          
          <button
            className="btn btn-primary flex items-center gap-2 whitespace-nowrap"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} />
            <span className="hidden md:inline">Add Deal</span>
            <span className="md:hidden">Add</span>
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <p className="text-surface-500 dark:text-surface-400">Loading deals...</p>
        </div>
      ) : (
        /* Pipeline Board */
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-cols-1 md:grid-flow-col md:auto-cols-fr gap-4 min-w-[800px]">
            {stages.map(stage => (
              <div
                key={stage.id}
                className="flex flex-col h-full"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage.id)}
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between p-3 bg-white dark:bg-surface-800 rounded-t-lg shadow-sm border-b-2 border-b-surface-200 dark:border-b-surface-700">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${stage.color} mr-2`}></div>
                    <h3 className="font-semibold">{stage.name}</h3>
                  </div>
                  <div className="text-sm text-surface-500 dark:text-surface-400">
                    ${calculatePipelineValue(stage.id).toLocaleString()}
                  </div>
                </div>
                
                {/* Stage Body */}
                <div
                  className="flex-1 bg-surface-100/50 dark:bg-surface-800/50 rounded-b-lg p-2 min-h-[300px]"
                >
                  {getDealsByStage(stage.id).length === 0 ? (
                    <div className="text-center p-4 text-surface-400 dark:text-surface-500 text-sm italic">
                      No deals in this stage
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {getDealsByStage(stage.id).map(deal => (
                        <motion.div
                          key={deal.id}
                          layoutId={`deal-${deal.id}`}
                          draggable
                          onDragStart={() => handleDragStart(deal.id)}
                          onClick={() => handleViewDeal(deal)}
                          className="card p-3 cursor-grab active:cursor-grabbing hover:shadow-soft group"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <div className="mb-2 flex items-start justify-between">
                            <h4 className="font-medium text-sm md:text-base line-clamp-2">{deal.title}</h4>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteDeal(deal.id);
                                }}
                                className="p-1 text-surface-500 hover:text-accent transition-colors"
                                aria-label="Delete deal"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs text-surface-500 dark:text-surface-400 mb-2">
                            {deal.type === 'company' ? (
                              <Building size={12} />
                            ) : (
                              <User size={12} />
                            )}
                            <span className="line-clamp-1">{deal.customer}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded text-xs font-medium">
                              <DollarSign size={12} className="mr-1" />
                              {Number(deal.value).toLocaleString()}
                            </div>
                            
                            <div className="text-xs">
                              {deal.probability}% 
                              <span className="ml-1 text-surface-400">likely</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Add Deal Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-5 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Add New Deal</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Deal Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newDeal.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Enterprise Software License"
                    className={`w-full ${formErrors.title ? 'border-red-500' : ''}`}
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Customer</label>
                    <input
                      type="text"
                      name="customer"
                      value={newDeal.customer}
                      onChange={handleInputChange}
                      placeholder="Company or individual name"
                      className={`w-full ${formErrors.customer ? 'border-red-500' : ''}`}
                    />
                    {formErrors.customer && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.customer}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      name="type"
                      value={newDeal.type}
                      onChange={handleInputChange}
                      className="w-full"
                    >
                      <option value="company">Company</option>
                      <option value="individual">Individual</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Deal Value ($)</label>
                    <input
                      type="number"
                      name="value"
                      value={newDeal.value}
                      onChange={handleInputChange}
                      placeholder="0"
                      className={`w-full ${formErrors.value ? 'border-red-500' : ''}`}
                    />
                    {formErrors.value && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.value}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Expected Close Date</label>
                    <input
                      type="date"
                      name="expectedCloseDate"
                      value={newDeal.expectedCloseDate}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Pipeline Stage</label>
                  <select
                    name="stage"
                    value={newDeal.stage}
                    onChange={handleInputChange}
                    className="w-full"
                  >
                    {stages.map(stage => (
                      <option key={stage.id} value={stage.id}>
                        {stage.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Person</label>
                  <input
                    type="text"
                    name="contact"
                    value={newDeal.contact}
                    onChange={handleInputChange}
                    placeholder="Contact name"
                    className={`w-full ${formErrors.contact ? 'border-red-500' : ''}`}
                  />
                  {formErrors.contact && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.contact}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newDeal.email}
                    onChange={handleInputChange}
                    placeholder="contact@example.com"
                    className={`w-full ${formErrors.email ? 'border-red-500' : ''}`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Phone (Optional)</label>
                  <input
                    type="text"
                    name="phone"
                    value={newDeal.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                    className="w-full"
                  />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddDeal}
                    className="btn btn-primary"
                  >
                    Add Deal
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Deal Detail Modal */}
      <AnimatePresence>
        {selectedDeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative">
                <div className={`h-20 ${stages.find(s => s.id === selectedDeal.stage)?.color || 'bg-primary'} rounded-t-xl`}></div>
                
                <button
                  onClick={closeDetailView}
                  className="absolute top-4 right-4 bg-black bg-opacity-20 hover:bg-opacity-40 transition-colors text-white rounded-full p-1"
                >
                  <X size={20} />
                </button>
                
                <div className="px-6 pt-4 pb-6 -mt-10">
                  <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-4 mb-4">
                    <h3 className="text-lg font-semibold">{selectedDeal.title}</h3>
                    <div className="mt-1 text-sm text-surface-500 dark:text-surface-400 flex items-center">
                      {selectedDeal.type === 'company' ? (
                        <Building size={14} className="mr-1" />
                      ) : (
                        <User size={14} className="mr-1" />
                      )}
                      {selectedDeal.customer}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-surface-50 dark:bg-surface-900/50 rounded-lg p-3 flex flex-col items-center">
                      <DollarSign className="text-primary mb-1" size={20} />
                      <div className="text-lg font-semibold">${Number(selectedDeal.value).toLocaleString()}</div>
                      <div className="text-xs text-surface-500">Deal Value</div>
                    </div>
                    
                    <div className="bg-surface-50 dark:bg-surface-900/50 rounded-lg p-3 flex flex-col items-center">
                      <div className="mb-1 text-yellow-500">
                        {selectedDeal.probability}%
                      </div>
                      <div className="h-2 w-full bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-500 rounded-full"
                          style={{ width: `${selectedDeal.probability}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-surface-500 mt-1">Probability</div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium mb-2 text-sm">Deal Information</h4>
                    <div className="bg-surface-50 dark:bg-surface-900/50 rounded-lg divide-y divide-surface-200 dark:divide-surface-700">
                      <div className="px-4 py-3 flex justify-between">
                        <span className="text-sm text-surface-500">Stage</span>
                        <span className="text-sm font-medium">{stages.find(s => s.id === selectedDeal.stage)?.name}</span>
                      </div>
                      
                      <div className="px-4 py-3 flex justify-between">
                        <span className="text-sm text-surface-500">Expected Close</span>
                        <span className="text-sm font-medium">{format(new Date(selectedDeal.expectedCloseDate), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Contact Information</h4>
                    <div className="bg-surface-50 dark:bg-surface-900/50 rounded-lg">
                      <div className="p-4 border-b border-surface-200 dark:border-surface-700">
                        <div className="font-medium">{selectedDeal.contact}</div>
                        <div className="text-sm text-surface-500">{selectedDeal.customer}</div>
                      </div>
                      
                      <div className="p-4 space-y-3">
                        <a href={`mailto:${selectedDeal.email}`} className="flex items-center text-sm">
                          <Mail size={16} className="mr-2 text-surface-400" />
                          {selectedDeal.email}
                        </a>
                        
                        {selectedDeal.phone && (
                          <a href={`tel:${selectedDeal.phone}`} className="flex items-center text-sm">
                            <Phone size={16} className="mr-2 text-surface-400" />
                            {selectedDeal.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}