import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';
import { fetchContacts } from '../services/contactService';
import { fetchDeals } from '../services/dealService';
import { fetchCampaigns } from '../services/campaignService';
import { fetchSupportTickets } from '../services/supportTicketService';

export default function Dashboard() {
  const user = useSelector((state) => state.user.user);
  const [stats, setStats] = useState({
    contacts: 0,
    activeDeals: 0,
    campaigns: 0,
    tickets: 0,
    totalDealValue: 0,
    ticketsByPriority: {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    }
  });
  const [loading, setLoading] = useState(true);

  // Icon components
  const TrendingUp = getIcon('TrendingUp');
  const TrendingDown = getIcon('TrendingDown');
  const Users = getIcon('Users');
  const Briefcase = getIcon('Briefcase');
  const Mail = getIcon('Mail');
  const LifeBuoy = getIcon('LifeBuoy');
  const DollarSign = getIcon('DollarSign');

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch data in parallel
        const [contactsResult, dealsResult, campaignsResult, ticketsResult] = await Promise.all([
          fetchContacts(),
          fetchDeals(),
          fetchCampaigns(),
          fetchSupportTickets()
        ]);

        // Calculate stats
        const activeDeals = dealsResult.data.filter(deal => deal.stage !== 'closed').length;
        const totalDealValue = dealsResult.data.reduce((sum, deal) => sum + (Number(deal.value) || 0), 0);
        
        // Count tickets by priority
        const ticketsByPriority = {
          low: 0,
          medium: 0,
          high: 0,
          critical: 0
        };
        
        ticketsResult.data.forEach(ticket => {
          if (ticket.priority && ticketsByPriority.hasOwnProperty(ticket.priority)) {
            ticketsByPriority[ticket.priority]++;
          }
        });

        setStats({
          contacts: contactsResult.data.length,
          activeDeals,
          campaigns: campaignsResult.data.length,
          tickets: ticketsResult.data.length,
          totalDealValue,
          ticketsByPriority
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Welcome, {user?.firstName || 'User'}</h1>
          <p className="text-surface-500 dark:text-surface-400">
            Here's what's happening with your CRM today
          </p>
        </div>
        <div className="bg-surface-100 dark:bg-surface-800 p-2 rounded-lg mt-4 md:mt-0">
          <span className="text-surface-500 dark:text-surface-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-surface-500">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div 
              className="card p-6"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold">Contacts</h3>
                <div className="p-2 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-30 rounded-lg">
                  <Users className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
              </div>
              <div className="text-3xl font-bold">{stats.contacts}</div>
              <div className="mt-2 text-sm text-surface-500">Total contacts in database</div>
            </motion.div>

            <motion.div 
              className="card p-6"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold">Active Deals</h3>
                <div className="p-2 bg-green-100 dark:bg-green-900 dark:bg-opacity-30 rounded-lg">
                  <Briefcase className="text-green-600 dark:text-green-400" size={20} />
                </div>
              </div>
              <div className="text-3xl font-bold">{stats.activeDeals}</div>
              <div className="mt-2 text-sm text-surface-500">Active deals in pipeline</div>
            </motion.div>

            <motion.div 
              className="card p-6"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold">Deal Value</h3>
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-30 rounded-lg">
                  <DollarSign className="text-yellow-600 dark:text-yellow-400" size={20} />
                </div>
              </div>
              <div className="text-3xl font-bold">${stats.totalDealValue.toLocaleString()}</div>
              <div className="mt-2 text-sm text-surface-500">Total value of all deals</div>
            </motion.div>

            <motion.div 
              className="card p-6"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold">Open Tickets</h3>
                <div className="p-2 bg-red-100 dark:bg-red-900 dark:bg-opacity-30 rounded-lg">
                  <LifeBuoy className="text-red-600 dark:text-red-400" size={20} />
                </div>
              </div>
              <div className="text-3xl font-bold">{stats.tickets}</div>
              <div className="mt-2 text-sm text-surface-500">Support tickets in system</div>
            </motion.div>
          </div>

          {/* Activity Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Tickets by Priority</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Low Priority</span>
                    <span>{stats.ticketsByPriority.low} tickets</span>
                  </div>
                  <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${stats.tickets ? (stats.ticketsByPriority.low / stats.tickets) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Medium Priority</span>
                    <span>{stats.ticketsByPriority.medium} tickets</span>
                  </div>
                  <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full" 
                      style={{ width: `${stats.tickets ? (stats.ticketsByPriority.medium / stats.tickets) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>High Priority</span>
                    <span>{stats.ticketsByPriority.high} tickets</span>
                  </div>
                  <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full" 
                      style={{ width: `${stats.tickets ? (stats.ticketsByPriority.high / stats.tickets) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Critical Priority</span>
                    <span>{stats.ticketsByPriority.critical} tickets</span>
                  </div>
                  <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full" 
                      style={{ width: `${stats.tickets ? (stats.ticketsByPriority.critical / stats.tickets) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <a href="/contacts" className="flex flex-col items-center p-4 bg-surface-50 dark:bg-surface-900 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                  <Users size={24} className="mb-2 text-primary" />
                  <span>Manage Contacts</span>
                </a>
                
                <a href="/deals" className="flex flex-col items-center p-4 bg-surface-50 dark:bg-surface-900 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                  <Briefcase size={24} className="mb-2 text-primary" />
                  <span>View Deals</span>
                </a>
                
                <a href="/campaigns" className="flex flex-col items-center p-4 bg-surface-50 dark:bg-surface-900 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                  <Mail size={24} className="mb-2 text-primary" />
                  <span>Campaigns</span>
                </a>
                
                <a href="/support-tickets" className="flex flex-col items-center p-4 bg-surface-50 dark:bg-surface-900 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                  <LifeBuoy size={24} className="mb-2 text-primary" />
                  <span>Support Tickets</span>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}