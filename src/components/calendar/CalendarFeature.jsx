import { useState } from 'react';
import { motion } from 'framer-motion';
import getIcon from '../../utils/iconUtils';

export default function CalendarFeature() {
  // Icon components
  const Calendar = getIcon('Calendar');
  const Clock = getIcon('Clock');
  const Users = getIcon('Users');
  const MapPin = getIcon('MapPin');
  const ChevronLeft = getIcon('ChevronLeft');
  const ChevronRight = getIcon('ChevronRight');
  const Plus = getIcon('Plus');
  
  // Sample days for the current month view
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  
  // Sample events
  const events = [
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
  ];
  
  // State for current month/year
  const [currentMonth, setCurrentMonth] = useState('August');
  const [currentYear, setCurrentYear] = useState(2023);
  
  // Function to get events for a specific day
  const getEventsForDay = (day) => {
    return events.filter(event => event.date === day);
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
          
          <button className="btn btn-primary flex items-center gap-2">
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
    </div>
  );
}