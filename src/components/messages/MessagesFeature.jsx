import { useState } from 'react';
import { motion } from 'framer-motion';
import getIcon from '../../utils/iconUtils';

export default function MessagesFeature() {
  // Icon components
  const Search = getIcon('Search');
  const Plus = getIcon('Plus');
  const Send = getIcon('Send');
  const Paperclip = getIcon('Paperclip');
  const Smile = getIcon('Smile');
  const MoreVertical = getIcon('MoreVertical');
  const Phone = getIcon('Phone');
  const Video = getIcon('Video');
  const User = getIcon('User');
  const Users = getIcon('Users');
  const Star = getIcon('Star');
  const Filter = getIcon('Filter');
  const ChevronDown = getIcon('ChevronDown');
  
  // Sample contacts for messaging
  const contacts = [
    { id: 1, name: 'John Smith', status: 'online', avatar: 'JS', unread: 2, lastMessage: 'Let me know when you have a chance to review the proposal.' },
    { id: 2, name: 'Sarah Johnson', status: 'online', avatar: 'SJ', unread: 0, lastMessage: 'I'll prepare the presentation for next week's meeting.' },
    { id: 3, name: 'Michael Chen', status: 'offline', avatar: 'MC', unread: 0, lastMessage: 'Thanks for your help with the client onboarding.' },
    { id: 4, name: 'Lisa Wong', status: 'away', avatar: 'LW', unread: 5, lastMessage: 'Can we schedule a call to discuss the project timeline?' },
    { id: 5, name: 'Robert Taylor', status: 'offline', avatar: 'RT', unread: 0, lastMessage: 'The contract has been signed. We can proceed with implementation.' }
  ];
  
  // Sample conversation messages
  const sampleMessages = [
    { id: 1, sender: 'John Smith', isSelf: false, text: 'Hi there! I wanted to follow up on our meeting yesterday.', time: '09:32 AM' },
    { id: 2, sender: 'You', isSelf: true, text: 'Hi John, sure thing. I've reviewed the proposal and it looks good overall.', time: '09:35 AM' },
    { id: 3, sender: 'John Smith', isSelf: false, text: 'Great! Do you have any specific feedback or changes you'd like to make?', time: '09:36 AM' },
    { id: 4, sender: 'You', isSelf: true, text: 'Just a few minor points. I think we should adjust the timeline for the implementation phase. The current schedule seems a bit aggressive.', time: '09:40 AM' },
    { id: 5, sender: 'John Smith', isSelf: false, text: 'That makes sense. How much additional time do you think we need?', time: '09:42 AM' }
  ];
  
  // State
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter contacts
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (message.trim() === '') return;
    // In a real app, we would send the message to the server here
    setMessage('');
  };
  
  return (
    <div className="card flex h-[calc(100vh-300px)] md:min-h-[600px]">
      {/* Contacts List */}
      <div className="w-full md:w-1/3 border-r border-surface-200 dark:border-surface-700 flex flex-col">
        <div className="p-3 border-b border-surface-200 dark:border-surface-700">
          <div className="relative">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg"
            />
            <Search size={16} className="absolute left-2.5 top-2.5 text-surface-400" />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {filteredContacts.map(contact => (
            <div 
              key={contact.id}
              className={`p-3 flex items-center cursor-pointer border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800 ${selectedContact?.id === contact.id ? 'bg-surface-100 dark:bg-surface-700' : ''}`}
              onClick={() => setSelectedContact(contact)}
            >
              <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center text-white font-medium mr-3">
                {contact.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <h3 className="font-medium truncate">{contact.name}</h3>
                  <span className="text-xs text-surface-500">10:30 AM</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-surface-500 truncate">{contact.lastMessage}</p>
                  {contact.unread > 0 && (
                    <span className="ml-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Message Content */}
      <div className="hidden md:flex flex-col flex-1">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-3 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center text-white font-medium mr-3">
                  {selectedContact.avatar}
                </div>
                <h3 className="font-medium">{selectedContact.name}</h3>
              </div>
            </div>
          </>
        ) : <div className="flex-1 flex items-center justify-center text-surface-400">Select a contact to start messaging</div>}
      </div>
    </div>
  );
}