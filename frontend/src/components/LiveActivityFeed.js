import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Heart, Building2, UserPlus } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function LiveActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchRecentActivity();
    const interval = setInterval(fetchRecentActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-hide after 10 seconds on homepage
  useEffect(() => {
    if (location.pathname === '/') {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const fetchRecentActivity = async () => {
    try {
      const response = await axios.get(`${API}/recent-activity`);
      setActivities(response.data.slice(0, 3));
    } catch (error) {
      setActivities([
        { type: 'blessing', name: 'Someone', time: 'Just now' },
        { type: 'business', name: 'A business', time: '5m ago' },
        { type: 'signup', name: 'New member', time: '12m ago' }
      ]);
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'blessing': return <Heart className="h-3 w-3 text-red-400" />;
      case 'business': return <Building2 className="h-3 w-3 text-[#006847]" />;
      case 'signup': return <UserPlus className="h-3 w-3 text-blue-400" />;
      default: return <TrendingUp className="h-3 w-3 text-[#A4D65E]" />;
    }
  };

  const getMessage = (activity) => {
    switch(activity.type) {
      case 'blessing': return 'shared blessing';
      case 'business': return 'added';
      case 'signup': return 'joined';
      default: return 'active';
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-24 right-6 w-44 z-30"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-xl shadow-lg">
        <div className="p-2 bg-gradient-to-r from-[#A4D65E]/70 to-[#006847]/70 text-white flex items-center justify-between rounded-t-xl">
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <h3 className="font-semibold text-xs">Live</h3>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gray-200 text-sm leading-none"
          >
            ×
          </button>
        </div>
        
        <div className="p-2 space-y-1">
          <AnimatePresence>
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-1 p-1 hover:bg-white/40 rounded"
              >
                {getIcon(activity.type)}
                <span className="text-[10px] text-gray-700 truncate flex-1">
                  <strong className="text-[11px]">{activity.name}</strong> {getMessage(activity)}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default LiveActivityFeed;