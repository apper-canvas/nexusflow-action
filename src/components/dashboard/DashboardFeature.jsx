import { useState } from 'react';
import { motion } from 'framer-motion';
import getIcon from '../../utils/iconUtils';

export default function DashboardFeature() {
  // Icon components
  const TrendingUp = getIcon('TrendingUp');
  const TrendingDown = getIcon('TrendingDown');
  const Users = getIcon('Users');
  const Phone = getIcon('Phone');
  const Mail = getIcon('Mail');
  const Calendar = getIcon('Calendar');
  const DollarSign = getIcon('DollarSign');
  const Target = getIcon('Target');
  const BarChart = getIcon('BarChart');
  const PieChart = getIcon('PieChart');
  const Filter = getIcon('Filter');
  
  // Sample data for metrics
  const metrics = [
    { id: 1, title: 'New Leads', value: 48, change: 12, trend: 'up' },
    { id: 2, title: 'Qualified Leads', value: 32, change: 8, trend: 'up' },
    { id: 3, title: 'Revenue', value: '$45,678', change: 5, trend: 'up' },
    { id: 4, title: 'Active Deals', value: 29, change: 3, trend: 'down' }
  ];
  
  // Sample data for upcoming activities
  const upcomingActivities = [
    { id: 1, title: 'Call with Acme Inc.', type: 'call', time: '09:30 AM', contact: 'John Smith' },
    { id: 2, title: 'Demo for TechStart', type: 'meeting', time: '11:00 AM', contact: 'Sarah Johnson' },
    { id: 3, title: 'Follow-up email', type: 'email', time: '02:00 PM', contact: 'Michael Chen' },
    { id: 4, title: 'Proposal Review', type: 'meeting', time: '04:30 PM', contact: 'Lisa Wong' }
  ];
  
  // Sample data for sales forecast
  const salesForecast = [
    { month: 'Jan', revenue: 28000 },
    { month: 'Feb', revenue: 32000 },
    { month: 'Mar', revenue: 36000 },
    { month: 'Apr', revenue: 30000 },
    { month: 'May', revenue: 40000 },
    { month: 'Jun', revenue: 45000 }
  ];
  
  // Filter options
  const [timeFilter, setTimeFilter] = useState('week');
  
  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-surface-500" />
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-sm px-2 py-1"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(metric => (
          <motion.div 
            key={metric.id}
            className="card p-4"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-surface-500 dark:text-surface-400 text-sm">{metric.title}</p>
                <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
              </div>
              <div className={`flex items-center ${
                metric.trend === 'up' 
                  ? 'text-green-500' 
                  : 'text-red-500'
              }`}>
                {metric.trend === 'up' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                <span className="ml-1 text-sm font-medium">{metric.change}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Forecast Chart */}
        <div className="card p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Sales Forecast</h3>
            <div className="flex items-center text-sm text-surface-500">
              <DollarSign size={14} className="mr-1" />
              <span>Revenue</span>
            </div>
          </div>
          
          <div className="h-64 flex items-end space-x-2">
            {salesForecast.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-primary-light rounded-t-sm"
                  style={{ height: `${(item.revenue / 45000) * 100}%` }}
                ></div>
                <div className="text-xs mt-2 text-surface-500">{item.month}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Sales By Channel */}
        <div className="card p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Lead Sources</h3>
            <div className="flex items-center text-sm text-surface-500">
              <Target size={14} className="mr-1" />
              <span>Acquisition</span>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-1 pr-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Website</span>
                    <span className="font-medium">42%</span>
                  </div>
                  <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Referrals</span>
                    <span className="font-medium">28%</span>
                  </div>
                  <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Social Media</span>
                    <span className="font-medium">18%</span>
                  </div>
                  <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}