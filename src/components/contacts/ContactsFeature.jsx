import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../../utils/iconUtils';
import { fetchContacts, createContact, updateContact, deleteContact } from '../../services/contactService';

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
  
  // State
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  
  const openAddContactModal = () => setIsAddContactModalOpen(true);
  const closeAddContactModal = () => setIsAddContactModalOpen(false);
  
  // Load contacts
  useEffect(() => {
    loadContacts();
  }, [selectedType, currentPage]);
  
  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      loadContacts();
    }, 500);
    
    return () => clearTimeout(handler);
  }, [searchTerm]);
  
  const loadContacts = async () => {
    setLoading(true);
    try {
      const filters = {
        searchTerm,
        type: selectedType
      };
      
      const { data, total } = await fetchContacts(filters, currentPage);
      setContacts(data);
      setTotalContacts(total);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle favorite toggle
  const toggleFavorite = async (id) => {
    const contact = contacts.find(c => c.Id === id);
    if (!contact) return;
    
    try {
      const updatedContact = { ...contact, favorite: !contact.favorite };
      const result = await updateContact(id, updatedContact);
      
      if (result) {
        setContacts(contacts.map(c => 
          c.Id === id ? { ...c, favorite: !c.favorite } : c
        ));
        
        toast.success(`${contact.Name} ${contact.favorite ? 'removed from' : 'added to'} favorites`);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };
  
  // Handle delete contact
  const handleDeleteContact = async (id) => {
    const contact = contacts.find(c => c.Id === id);
    if (!contact) return;
    
    if (confirm(`Are you sure you want to delete ${contact.Name}?`)) {
      try {
        const result = await deleteContact(id);
        
        if (result) {
          setContacts(contacts.filter(c => c.Id !== id));
        }
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };
  
  // Handle new contact submission
  const handleAddContact = async (newContact) => {
    try {
      const result = await createContact(newContact);
      
      if (result) {
        // Reload contacts to get the newly created one
        loadContacts();
        closeAddContactModal();
      }
    } catch (error) {
      console.error('Error adding contact:', error);
    }
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
        {loading ? (
          <div className="flex justify-center p-8">
            <p className="text-surface-500">Loading contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-surface-500">No contacts found. Try adjusting your search.</p>
          </div>
        ) : (
          contacts.map(contact => (
            <motion.div 
              key={contact.Id}
              className="card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center text-white font-medium mr-3">
                  {contact.Name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-medium">{contact.Name}</h3>
                  <div className="flex items-center text-surface-500 text-sm">
                    <Building size={12} className="mr-1" />
                    {contact.company}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap md:flex-nowrap items-center gap-3 text-sm">
                <a 
                  href={`mailto:${contact.email}`} 
                  className="flex items-center text-surface-600 hover:text-primary"
                >
                  <Mail size={16} className="mr-1" />
                  <span className="hidden md:inline">{contact.email}</span>
                </a>
                
                {contact.phone && (
                  <a 
                    href={`tel:${contact.phone}`} 
                    className="flex items-center text-surface-600 hover:text-primary"
                  >
                    <Phone size={16} className="mr-1" />
                    <span className="hidden md:inline">{contact.phone}</span>
                  </a>
                )}
                
                <div className="flex items-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    contact.type === 'client' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-300' 
                      : contact.type === 'lead'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-300'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:bg-opacity-30 dark:text-purple-300'
                  }`}>
                    {contact.type}
                  </span>
                </div>
                
                <div className="flex items-center ml-auto">
                  <button 
                    onClick={() => toggleFavorite(contact.Id)}
                    className={`p-1 rounded-full ${
                      contact.favorite 
                        ? 'text-yellow-500 hover:text-yellow-600' 
                        : 'text-surface-400 hover:text-yellow-500'
                    }`}
                    aria-label={contact.favorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star size={16} fill={contact.favorite ? 'currentColor' : 'none'} />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteContact(contact.Id)}
                    className="p-1 text-surface-400 hover:text-red-500 ml-2"
                    aria-label="Delete contact"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
      
      {/* Pagination */}
      {totalContacts > 20 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-surface-100 dark:bg-surface-800 disabled:opacity-50"
            >
              Previous
            </button>
            
            <span className="px-3 py-1">
              Page {currentPage} of {Math.ceil(totalContacts / 20)}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage >= Math.ceil(totalContacts / 20)}
              className="px-3 py-1 rounded-md bg-surface-100 dark:bg-surface-800 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
      
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
    Name: '',
    company: '',
    email: '',
    phone: '',
    type: 'client',
    location: '',
    status: 'active',
    favorite: false
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
    
    if (!formData.Name.trim()) newErrors.Name = "Name is required";
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
          <input id="name" name="Name" type="text" value={formData.Name} onChange={handleChange} 
            className={`w-full p-2 border rounded-lg ${errors.Name ? 'border-red-500' : 'border-surface-200 dark:border-surface-700'}`} />
          {errors.Name && <p className="text-red-500 text-sm mt-1">{errors.Name}</p>}
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