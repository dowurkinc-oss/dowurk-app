import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, X } from 'lucide-react';
import { Link } from 'react-router-dom';

function QuizPopup({ delay = 5000 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user already dismissed it this session
    const dismissed = sessionStorage.getItem('quizPopupDismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Show popup after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('quizPopupDismissed', 'true');
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="fixed bottom-32 right-6 w-80 z-50"
        >
          <Card className="border-2 border-[#A4D65E] bg-white shadow-2xl">
            <CardContent className="p-0">
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-[#A4D65E] to-[#006847] p-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="h-6 w-6" />
                  <h3 className="font-bold text-lg">Test Your Knowledge</h3>
                </div>
                <p className="text-sm opacity-90">
                  How well do you know entrepreneurship?
                </p>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                <p className="text-sm text-gray-700">
                  Take our 8-question quiz to assess your business knowledge in planning, 
                  finance, marketing, legal, and more!
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>✓ 8 Questions</span>
                    <span>✓ Instant Feedback</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>✓ Learn as You Go</span>
                    <span>✓ Share Your Score</span>
                  </div>
                </div>

                <Link to="/test-your-knowledge" onClick={handleDismiss}>
                  <Button className="w-full bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90">
                    <Brain className="mr-2 h-4 w-4" />
                    Start Quiz Now
                  </Button>
                </Link>

                <button
                  onClick={handleDismiss}
                  className="w-full text-xs text-gray-500 hover:text-gray-700 transition"
                >
                  Maybe later
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default QuizPopup;
