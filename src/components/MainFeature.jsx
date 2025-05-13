import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardFeature from './dashboard/DashboardFeature';
import ContactsFeature from './contacts/ContactsFeature';
import PipelineFeature from './pipeline/PipelineFeature';
import CalendarFeature from './calendar/CalendarFeature';
import CampaignsFeature from './campaigns/CampaignsFeature';
import AnalyticsFeature from './analytics/AnalyticsFeature';
import SupportFeature from './support/SupportFeature';
import MessagesFeature from './messages/MessagesFeature';
import SettingsFeature from './settings/SettingsFeature';

export default function MainFeature({ selectedTab }) {
  // Loading state for component transitions
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          {selectedTab === 'dashboard' && <DashboardFeature />}
          {selectedTab === 'contacts' && <ContactsFeature />}
          {selectedTab === 'pipeline' && <PipelineFeature />}
          {selectedTab === 'calendar' && <CalendarFeature />}
          {selectedTab === 'campaigns' && <CampaignsFeature />}
          {selectedTab === 'analytics' && <AnalyticsFeature />}
          {selectedTab === 'support' && <SupportFeature />}
          {selectedTab === 'messages' && <MessagesFeature />}
          {selectedTab === 'settings' && <SettingsFeature />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}