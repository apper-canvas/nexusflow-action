import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from '../../utils/iconUtils';
import { ToastContainer, toast } from 'react-toastify';

export default function CalendarFeature() {
  // Icon components
  const Calendar = getIcon('Calendar');
  const Clock = getIcon('Clock');
  const Users = getIcon('Users');
  const MapPin = getIcon('MapPin');
  const ChevronLeft = getIcon('ChevronLeft');
  const ChevronRight = getIcon('ChevronRight');
  const Plus = getIcon('Plus');
  const X = getIcon('X');
  const CheckCircle = getIcon('CheckCircle');
  
  // Sample days for the current month view
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  
  // Sample events
  const [events, setEvents] = useState([
    { 
      id: 1, 
      title: 'Client Meeting', 
      date: 10, 
      startTime: '09:00 AM', 
      endTime: '10:30 AM',
      attendees: ['John Smith', 'Sarah Johnson'],
      location: 'Conference Room A',
      type: 'meeting',
      color: 'bg-blue-500'
    },
    { 
      id: 2, 
      title: 'Product Demo', 
      date: 15, 
      startTime: '02:00 PM', 
      endTime: '03:00 PM',
      attendees: ['Michael Chen', 'Lisa Wong'],
      location: 'Virtual',
      type: 'demo',
      color: 'bg-purple-500'
    },
    { 
      id: 3, 
      title: 'Sales Call', 
      date: 18, 
      startTime: '11:30 AM', 
      endTime: '12:30 PM',
      attendees: ['Robert Taylor'],
      location: 'Phone',
      type: 'call',
      color: 'bg-green-500'
    },
    { 
      id: 4, 
      title: 'Team Sync', 
      date: 22, 
      startTime: '04:00 PM', 
      endTime: '05:00 PM',
      attendees: ['Team'],
      location: 'Conference Room B',
      type: 'internal',
      color: 'bg-yellow-500'
    }
  ]);
  
  // State for current month/year
  const [currentMonth, setCurrentMonth] = useState('August');
  
  // State for event modal
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  
  // Current year
  const [currentYear, setCurrentYear] = useState(2023);
  
  // Function to get events for a specific day
  const getEventsForDay = (day) => {
    return events.filter(event => event.date === day);
  };
  
  // Function to add a new event
  const handleAddEvent = (newEvent) => {
    const id = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
    setEvents([...events, { ...newEvent, id }]);
    setIsEventModalOpen(false);
    toast.success('Event created successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Calendar</h2>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700">
              <ChevronLeft size={20} />
            </button>
            <span className="font-medium">{currentMonth} {currentYear}</span>
            <button className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700">
              <ChevronRight size={20} />
            </button>
          </div>
          
          <button className="btn btn-primary flex items-center gap-2" onClick={() => setIsEventModalOpen(true)}>
            <Plus size={16} />
            <span>New Event</span>
          </button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="card overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 text-center font-medium bg-surface-100 dark:bg-surface-800 py-2">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {days.map(day => (
            <div key={day} className="min-h-[120px] border-b border-r border-surface-200 dark:border-surface-700 p-2">
              <div className="font-medium text-sm mb-1">{day}</div>
              
              {getEventsForDay(day).map(event => (
                <div key={event.id} className={`${event.color} text-white text-xs p-1 rounded mb-1 truncate cursor-pointer`}>
                  {event.startTime} - {event.title}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Event Creation Modal */}
      <AnimatePresence>
        {isEventModalOpen && (
          <EventModal 
            onClose={() => setIsEventModalOpen(false)} 
            onSubmit={handleAddEvent} 
          />
        )}
      </AnimatePresence>
      
      <ToastContainer position="bottom-right" />
    </div>
  );
}

// Event Modal Component
function EventModal({ onClose, onSubmit }) {
  const initialEventData = {
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    attendees: '',
    location: '',
    type: 'meeting',
    color: 'bg-blue-500'
  };
  
  const [eventData, setEventData] = useState(initialEventData);
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);
  
  // Focus on title input when modal opens
  useState(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!eventData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!eventData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!eventData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (!eventData.endTime) {
      newErrors.endTime = 'End time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert date to day number (just for demo)
      const dateNum = parseInt(eventData.date);
      
      // Split attendees string into array
      const attendeesArray = eventData.attendees
        ? eventData.attendees.split(',').map(a => a.trim())
        : [];
      
      // Submit the new event
      onSubmit({
        ...eventData,
        date: dateNum,
        attendees: attendeesArray
      });
    }
  };
  
  // Color options for events
  const colorOptions = [
    { value: 'bg-blue-500', label: 'Blue' },
    { value: 'bg-green-500', label: 'Green' },
    { value: 'bg-purple-500', label: 'Purple' },
    { value: 'bg-yellow-500', label: 'Yellow' },
    { value: 'bg-red-500', label: 'Red' },
    { value: 'bg-pink-500', label: 'Pink' }
  ];
  
  // Event type options
  const typeOptions = [
    { value: 'meeting', label: 'Meeting' },
    { value: 'call', label: 'Call' },
    { value: 'demo', label: 'Demo' },
    { value: 'internal', label: 'Internal' },
    { value: 'external', label: 'External' }
  ];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-surface-800 rounded-xl shadow-lg w-full max-w-md"
      >
        <div className="flex items-center justify-between border-b border-surface-200 dark:border-surface-700 p-4">
          <h3 className="text-lg font-semibold">Create New Event</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title*</label>
            <input
              ref={titleRef}
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              className={`w-full ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Event title"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date*</label>
              <input
                type="number"
                name="date"
                min="1"
                max="31"
                value={eventData.date}
                onChange={handleChange}
                className={`w-full ${errors.date ? 'border-red-500' : ''}`}
                placeholder="Day (1-31)"
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select 
                name="type"
                value={eventData.type}
                onChange={handleChange}
                className="w-full"
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Time*</label>
              <input
                type="text"
                name="startTime"
                value={eventData.startTime}
                onChange={handleChange}
                className={`w-full ${errors.startTime ? 'border-red-500' : ''}`}
                placeholder="e.g. 09:00 AM"
              />
              {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">End Time*</label>
              <input
                type="text"
                name="endTime"
                value={eventData.endTime}
                onChange={handleChange}
                className={`w-full ${errors.endTime ? 'border-red-500' : ''}`}
                placeholder="e.g. 10:00 AM"
              />
              {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              className="w-full"
              placeholder="Event location"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Attendees</label>
            <input
              type="text"
              name="attendees"
              value={eventData.attendees}
              onChange={handleChange}
              className="w-full"
              placeholder="Separate names with commas"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <select 
              name="color"
              value={eventData.color}
              onChange={handleChange}
              className="w-full"
            >
              {colorOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex items-center gap-2">
              <CheckCircle size={16} />
              Create Event
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}