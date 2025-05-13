import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../../utils/iconUtils';

export default function ContactsFeature() {
  // Icon components
  const Search = getIcon('Search');
  const Plus = getIcon('Plus');
  const User = getIcon('User');
  const Users = getIcon('Users');
  const Mail = getIcon('Mail');
  const Phone = getIcon('Phone');
  const MapPin = getIcon('MapPin');
  const Building = getIcon('Building');
  const Star = getIcon('Star');
  const Filter = getIcon('Filter');
  const Edit = getIcon('Edit');
  const Trash2 = getIcon('Trash2');
  const ChevronDown = getIcon('ChevronDown');
  const X = getIcon('X');
  const CheckCircle = getIcon('CheckCircle');
  
  // Sample contacts data
  const initialContacts = [
    {
      id: 1,
      name: 'John Smith',
      company: 'Acme Corporation',
      email: 'john@acmecorp.com',
      phone: '(555) 123-4567',
      type: 'client',
      location: 'New York, USA',
      status: 'active',
      favorite: true
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      company: 'TechStart Inc',
      email: 'sarah@techstart.io',
      phone: '(555) 987-6543',
      type: 'lead',
      location: 'San Francisco, USA',
      status: 'active',
      favorite: false
    },
    {
      id: 3,
      name: 'Michael Chen',
      company: 'Global Solutions',
      email: 'mchen@globalsolutions.com',
      phone: '(555) 456-7890',
      type: 'vendor',
      location: 'Boston, USA',
      status: 'inactive',
      favorite: false
    },
    {
      id: 4,
      name: 'Lisa Wong',
      company: 'InnovateTech',
      email: 'lwong@innovatetech.com',
      phone: '(555) 789-0123',
      type: 'client',
      location: 'Chicago, USA',
      status: 'active',
      favorite: true
    },
    {
      id: 5,
      name: 'Robert Taylor',
      company: 'First Financial',
      email: 'rtaylor@firstfinancial.com',
      phone: '(555) 234-5678',
      type: 'lead',
      location: 'Miami, USA',
      status: 'active',
      favorite: false
    }
  ];
  
  // State
  const [contacts, setContacts] = useState(initialContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  
  const openAddContactModal = () => setIsAddContactModalOpen(true);
  const closeAddContactModal = () => setIsAddContactModalOpen(false);
  
  
  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || contact.type === selectedType;
    
    return matchesSearch && matchesType;
  });
  
  // Handle favorite toggle
  const toggleFavorite = (id) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? {...contact, favorite: !contact.favorite} : contact
    ));
    
    const contact = contacts.find(c => c.id === id);
    if (contact) {
      toast.success(`${contact.name} ${contact.favorite ? 'removed from' : 'added to'} favorites`);
    }
  };
  
  // Handle new contact submission
  const handleAddContact = (newContact) => {
    // Create a new contact with an ID
    const contactToAdd = {
      ...newContact,
      id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
      favorite: false
    };
    
    // Add to contacts list
    setContacts([...contacts, contactToAdd]);
    
    // Show success message
    toast.success(`${newContact.name} has been added to contacts`);
    
    // Close the modal
    closeAddContactModal();
  };
  
  const contactTypes = [
    { value: "client", label: "Client" },
    { value: "lead", label: "Lead" },
    { value: "vendor", label: "Vendor" },
  ];
  
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];
  
  // Animation variants for modal
  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 500 } },
    exit: { opacity: 0, y: 50 }
  };
  
  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold">Contacts</h2>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-8 pl-8 py-2 rounded-lg"
            />
            <Search size={16} className="absolute left-2.5 top-2.5 text-surface-400" />
          </div>
          
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none pl-8 pr-8 py-2 rounded-lg"
            >
              <option value="all">All Types</option>
              <option value="client">Clients</option>
              <option value="lead">Leads</option>
              <option value="vendor">Vendors</option>
            </select>
            <Filter size={16} className="absolute left-2.5 top-2.5 text-surface-400" />
            <ChevronDown size={16} className="absolute right-2.5 top-2.5 text-surface-400" />
          </div>
          
          <button onClick={openAddContactModal} className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap">
            <Plus size={16} />
            <span className="hidden md:inline">Add Contact</span>
            <span className="md:hidden">Add</span>
          </button>
        </div>
      </div>
      
      {/* Contacts List */}
      <div className="space-y-4">
        {filteredContacts.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-surface-500">No contacts found. Try adjusting your search.</p>
          </div>
        ) : (
          filteredContacts.map(contact => (
            <motion.div 
              key={contact.id}
              className="card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center text-white font-medium mr-3">
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-medium">{contact.name}</h3>
                  <div className="flex items-center text-surface-500 text-sm">
                    <Building size={12} className="mr-1" />
                    {contact.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
      
      {/* Add Contact Modal */}
      {isAddContactModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={closeAddContactModal}>
          <motion.div 
            className="bg-white dark:bg-surface-800 rounded-xl shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ContactModal onSubmit={handleAddContact} onCancel={closeAddContactModal} contactTypes={contactTypes} statusOptions={statusOptions} X={X} CheckCircle={CheckCircle} />
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Contact Modal Component
const ContactModal = ({ onSubmit, onCancel, contactTypes, statusOptions, X, CheckCircle }) => {
  const initialFormData = {
    name: '',
    company: '',
    email: '',
    phone: '',
    type: 'client',
    location: '',
    status: 'active'
  };
  
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) 
      newErrors.email = "Email format is invalid";
    if (!formData.company.trim()) newErrors.company = "Company is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      setFormData(initialFormData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Add New Contact</h3>
        <button 
          type="button" 
          onClick={onCancel}
          className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">Name*</label>
          <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} 
            className={`w-full p-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-surface-200 dark:border-surface-700'}`} />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="company" className="block mb-1 font-medium">Company*</label>
          <input id="company" name="company" type="text" value={formData.company} onChange={handleChange} 
            className={`w-full p-2 border rounded-lg ${errors.company ? 'border-red-500' : 'border-surface-200 dark:border-surface-700'}`} />
          {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">Email*</label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} 
            className={`w-full p-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-surface-200 dark:border-surface-700'}`} />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="phone" className="block mb-1 font-medium">Phone</label>
          <input id="phone" name="phone" type="text" value={formData.phone} onChange={handleChange} 
            className="w-full p-2 border border-surface-200 dark:border-surface-700 rounded-lg" />
        </div>
        
        <div>
          <label htmlFor="type" className="block mb-1 font-medium">Contact Type</label>
          <select id="type" name="type" value={formData.type} onChange={handleChange}
            className="w-full p-2 border border-surface-200 dark:border-surface-700 rounded-lg">
            {contactTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="location" className="block mb-1 font-medium">Location</label>
          <input id="location" name="location" type="text" value={formData.location} onChange={handleChange} 
            className="w-full p-2 border border-surface-200 dark:border-surface-700 rounded-lg" />
        </div>
        
        <div>
          <label htmlFor="status" className="block mb-1 font-medium">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}
            className="w-full p-2 border border-surface-200 dark:border-surface-700 rounded-lg">
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 mt-6">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <CheckCircle size={16} />
          Add Contact
        </button>
      </div>
    </form>
  );
};