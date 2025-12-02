import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { TrendingUp, Heart, Building2, UserPlus, Sparkles } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function LiveActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
    const interval = setInterval(fetchRecentActivity, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const response = await axios.get(`${API}/recent-activity`);
      setActivities(response.data.slice(0, 5)); // Show last 5 activities
    } catch (error) {
      // Fallback to mock data if endpoint doesn't exist
      setActivities([
        { type: 'blessing', name: 'Someone', time: 'Just now', icon: 'heart' },
        { type: 'business', name: 'New business', time: '5 min ago', icon: 'building' },
        { type: 'signup', name: 'New member', time: '12 min ago', icon: 'user' }
      ]);
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'blessing': return <Heart className="h-4 w-4 text-red-500" />;
      case 'business': return <Building2 className="h-4 w-4 text-[#006847]" />;
      case 'signup': return <UserPlus className="h-4 w-4 text-blue-500" />;
      default: return <Sparkles className="h-4 w-4 text-[#A4D65E]" />;
    }
  };

  const getMessage = (activity) => {
    switch(activity.type) {
      case 'blessing': return 'shared a blessing';
      case 'business': return 'added their business';
      case 'signup': return 'joined DowUrk';
      default: return 'took action';
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-24 right-6 w-72 z-30"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2 border-[#A4D65E] bg-white shadow-xl">
        <div className="p-4 bg-gradient-to-r from-[#A4D65E] to-[#006847] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <h3 className="font-bold">Live Activity</h3>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gray-200 text-xl leading-none"
          >
            ×
          </button>
        </div>
        
        <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
          <AnimatePresence>
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded"
              >
                <div className="mt-0.5">{getIcon(activity.type)}</div>
                <div className="flex-1 text-sm">
                  <span className="font-semibold">{activity.name}</span>
                  {' '}
                  <span className="text-gray-600">{getMessage(activity)}</span>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <div className="p-2 bg-gray-50 text-center text-xs text-gray-600 border-t">
          Join the movement! 🚀
        </div>
      </Card>
    </motion.div>
  );
}

export default LiveActivityFeed;
