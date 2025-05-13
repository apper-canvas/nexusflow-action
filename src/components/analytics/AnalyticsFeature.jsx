import { useState } from 'react';
import { motion } from 'framer-motion';
import getIcon from '../../utils/iconUtils';

export default function AnalyticsFeature() {
  // Icon components
  const BarChart = getIcon('BarChart');
  const PieChart = getIcon('PieChart');
  const LineChart = getIcon('LineChart');
  const TrendingUp = getIcon('TrendingUp');
  const Download = getIcon('Download');
  const Filter = getIcon('Filter');
  const Calendar = getIcon('Calendar');
  
  // Sample metrics
  const metrics = [
    { id: 1, name: 'Total Revenue', value: '$258,456', change: 12.4, trend: 'up' },
    { id: 2, name: 'New Customers', value: '584', change: 8.2, trend: 'up' },
    { id: 3, name: 'Conversion Rate', value: '8.2%', change: 1.5, trend: 'up' },
    { id: 4, name: 'Average Deal Size', value: '$12,350', change: -2.3, trend: 'down' }
  ];
  
  // Sample time periods
  const [timeFrame, setTimeFrame] = useState('month');
  
  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold">Analytics & Reporting</h2>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              className="appearance-none pl-8 pr-8 py-2 rounded-lg"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <Calendar size={16} className="absolute left-2.5 top-2.5 text-surface-400" />
          </div>
          
          <button className="btn btn-outline flex items-center gap-2">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      {/* Metrics Summary */}
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
                <p className="text-surface-500 dark:text-surface-400 text-sm">{metric.name}</p>
                <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
              </div>
              <div className={`flex items-center ${
                metric.trend === 'up' 
                  ? 'text-green-500' 
                  : 'text-red-500'
              }`}>
                {metric.trend === 'up' ? <TrendingUp size={18} /> : <TrendingUp size={18} className="transform rotate-180" />}
                <span className="ml-1 text-sm font-medium">{Math.abs(metric.change)}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Sales Performance</h3>
            <div className="flex items-center text-sm text-surface-500">
              <LineChart size={14} className="mr-1" />
              <span>Trend</span>
            </div>
          </div>
          
          <div className="bg-surface-50 dark:bg-surface-800 rounded-lg p-4 h-64 flex items-end space-x-1">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-primary rounded-t-sm"
                  style={{ height: `${Math.floor(Math.random() * 80) + 20}%` }}
                ></div>
                <div className="text-xs mt-2 text-surface-500">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}