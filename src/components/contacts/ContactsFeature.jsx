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
          
          <button className="btn btn-primary flex items-center gap-2 whitespace-nowrap">
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
    </div>
  );
}