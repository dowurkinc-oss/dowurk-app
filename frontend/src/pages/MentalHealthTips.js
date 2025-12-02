import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Heart, Flower2, Wind, Sun, Moon, Coffee, 
  Sparkles, Timer, Play, Pause, RotateCcw, Leaf, Waves
} from 'lucide-react';

function MentalHealthTips() {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [meditationTimer, setMeditationTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Breathing exercise cycle
  useEffect(() => {
    if (!breathingActive) return;

    const phases = [
      { name: 'inhale', duration: 4000, text: 'Breathe In' },
      { name: 'hold', duration: 4000, text: 'Hold' },
      { name: 'exhale', duration: 4000, text: 'Breathe Out' },
      { name: 'rest', duration: 2000, text: 'Rest' }
    ];

    let currentPhase = 0;
    const cyclePhase = () => {
      setBreathingPhase(phases[currentPhase].name);
      currentPhase = (currentPhase + 1) % phases.length;
      setTimeout(cyclePhase, phases[currentPhase].duration);
    };

    const timeout = setTimeout(cyclePhase, phases[0].duration);
    return () => clearTimeout(timeout);
  }, [breathingActive, breathingPhase]);

  // Meditation timer
  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setMeditationTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const quickTips = [
    {
      icon: <Wind className="h-6 w-6" />,
      title: '4-4-4 Breathing',
      description: 'Inhale for 4 seconds, hold for 4, exhale for 4. Repeat 3 times.',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: <Coffee className="h-6 w-6" />,
      title: 'Mindful Break',
      description: 'Step away from your screen every hour. Stretch, walk, or simply close your eyes.',
      color: 'from-amber-400 to-amber-600'
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      title: 'Nature Connection',
      description: 'Listen to the hummingbird sounds on this site. Nature reduces stress by 60%.',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: <Sun className="h-6 w-6" />,
      title: 'Gratitude Practice',
      description: 'List 3 things you\'re grateful for in your business journey today.',
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      icon: <Waves className="h-6 w-6" />,
      title: 'Progressive Relaxation',
      description: 'Tense and release each muscle group from toes to head.',
      color: 'from-cyan-400 to-cyan-600'
    },
    {
      icon: <Moon className="h-6 w-6" />,
      title: 'Evening Wind-Down',
      description: 'Set boundaries. Business can wait. Your mental health cannot.',
      color: 'from-purple-400 to-purple-600'
    }
  ];

  const resources = [
    {
      title: 'National Suicide Prevention Lifeline',
      phone: '988',
      description: '24/7 crisis support for you or your loved ones',
      url: 'https://988lifeline.org/'
    },
    {
      title: 'SAMHSA National Helpline',
      phone: '1-800-662-4357',
      description: 'Free, confidential, 24/7 treatment referral and information service',
      url: 'https://www.samhsa.gov/find-help/national-helpline'
    },
    {
      title: 'Anxiety and Depression Association',
      phone: null,
      description: 'Resources, support groups, and treatment information',
      url: 'https://adaa.org/'
    },
    {
      title: 'Mental Health America',
      phone: null,
      description: 'Screening tools, resources, and community support',
      url: 'https://www.mhanational.org/'
    },
    {
      title: 'Louisiana Department of Health - Mental Health',
      phone: '1-800-256-2522',
      description: 'Louisiana-specific mental health services and resources',
      url: 'https://ldh.la.gov/subhome/10'
    }
  ];

  const entrepreneurTips = [
    {
      title: 'Recognize the Signs',
      tips: [
        'Constant worry about business finances',
        'Difficulty sleeping or concentrating',
        'Feeling overwhelmed or isolated',
        'Loss of motivation or passion',
        'Physical symptoms (headaches, fatigue)',
        'Avoiding social connections'
      ]
    },
    {
      title: 'Daily Practices',
      tips: [
        'Start each day with 5 minutes of quiet reflection',
        'Set realistic goals - celebrate small wins',
        'Schedule "worry time" - limit it to 15 minutes',
        'Move your body - even a 10-minute walk helps',
        'Connect with other entrepreneurs (you\'re not alone)',
        'Use our AI assistant for business stress - delegate tasks'
      ]
    },
    {
      title: 'Holistic Wellness',
      tips: [
        'Faith: Connect with your spiritual practice',
        'Fitness: Maintain physical and mental health',
        'Food: Nourish your body with whole foods',
        'Finances: Address money stress with planning',
        'Foundation: Build systems to reduce chaos',
        'Fashion: Present yourself confidently',
        'Film: Tell your story - processing is healing'
      ]
    },
    {
      title: 'When to Seek Help',
      tips: [
        'Persistent feelings of hopelessness',
        'Thoughts of self-harm',
        'Unable to function in daily activities',
        'Substance use to cope with stress',
        'Relationship problems due to business stress',
        'Don\'t wait - early intervention is key'
      ]
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero */}
      <motion.section
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center space-x-3">
          <Brain className="h-12 w-12 text-[#006847]" />
          <h1 className="text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#A4D65E] to-[#006847] bg-clip-text text-transparent">
              Mental Health for Entrepreneurs
            </span>
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A holistic approach to mental wellness along your entrepreneurial journey. 
          You're building a business, not sacrificing your peace.
        </p>
      </motion.section>

      {/* Interactive Breathing Exercise */}
      <motion.section
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <Card className="border-2 border-[#A4D65E] bg-gradient-to-br from-blue-50 to-green-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center space-x-2">
              <Wind className="h-8 w-8 text-[#006847]" />
              <span>Mindful Breathing Exercise</span>
            </CardTitle>
            <CardDescription>Take a moment right now to center yourself</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <motion.div
                className="w-48 h-48 rounded-full flex items-center justify-center text-white text-xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #A4D65E, #006847)'
                }}
                animate={{
                  scale: breathingActive ? (
                    breathingPhase === 'inhale' ? [1, 1.3] :
                    breathingPhase === 'hold' ? 1.3 :
                    breathingPhase === 'exhale' ? [1.3, 1] :
                    1
                  ) : 1
                }}
                transition={{
                  duration: breathingPhase === 'rest' ? 0 : 4,
                  ease: 'easeInOut'
                }}
              >
                {breathingActive ? (
                  <div className="text-center">
                    <div className="text-3xl mb-2">
                      {breathingPhase === 'inhale' && '↑'}
                      {breathingPhase === 'hold' && '⊙'}
                      {breathingPhase === 'exhale' && '↓'}
                      {breathingPhase === 'rest' && '○'}
                    </div>
                    <div className="text-sm">
                      {breathingPhase === 'inhale' && 'Breathe In'}
                      {breathingPhase === 'hold' && 'Hold'}
                      {breathingPhase === 'exhale' && 'Breathe Out'}
                      {breathingPhase === 'rest' && 'Rest'}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Wind className="h-12 w-12 mx-auto mb-2" />
                    <div className="text-sm">Click Start</div>
                  </div>
                )}
              </motion.div>
            </div>
            
            <div className="flex justify-center">
              <Button
                onClick={() => setBreathingActive(!breathingActive)}
                className="bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90"
                size="lg"
              >
                {breathingActive ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" />
                    Stop Exercise
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Start Breathing
                  </>
                )}
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600">
              Follow the circle: Inhale as it grows, hold at peak, exhale as it shrinks
            </p>
          </CardContent>
        </Card>
      </motion.section>

      {/* Meditation Timer */}
      <motion.section
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center space-x-2">
              <Timer className="h-8 w-8 text-purple-600" />
              <span>Mindful Meditation Timer</span>
            </CardTitle>
            <CardDescription>Even 2 minutes can reset your nervous system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-6xl font-bold text-purple-600 mb-4">
                {formatTime(meditationTimer)}
              </div>
              <div className="flex justify-center space-x-3">
                <Button
                  onClick={() => setTimerActive(!timerActive)}
                  variant={timerActive ? "outline" : "default"}
                  className={!timerActive ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  {timerActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {timerActive ? 'Pause' : 'Start'}
                </Button>
                <Button
                  onClick={() => {
                    setMeditationTimer(0);
                    setTimerActive(false);
                  }}
                  variant="outline"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
            <div className="text-center text-sm text-gray-600 space-y-2 pt-4 border-t">
              <p>Close your eyes. Focus on your breath. Let thoughts pass like clouds.</p>
              <p className="text-xs">Tip: Start with 2 minutes and gradually increase</p>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Quick Tips Grid */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-3">Quick Mindfulness Practices</h2>
          <p className="text-gray-600">Use these anywhere, anytime you need to reset</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickTips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="h-full hover:shadow-xl transition-all">
                <CardHeader>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${tip.color} text-white mb-3`}>
                    {tip.icon}
                  </div>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{tip.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Entrepreneur-Specific Tips */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-3">For Entrepreneurs</h2>
          <p className="text-gray-600">Understanding and managing entrepreneurial stress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {entrepreneurTips.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-2 hover:border-[#A4D65E] transition-colors">
                <CardHeader className="bg-gradient-to-r from-[#A4D65E]/10 to-[#006847]/10">
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-6 w-6 text-[#006847]" />
                    <span>{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {section.tips.map((tip, i) => (
                      <li key={i} className="flex items-start space-x-2 text-sm">
                        <span className="text-[#A4D65E] mt-1">•</span>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Crisis Resources */}
      <section className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8 border-2 border-red-200">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-red-900 mb-3">Crisis Support Resources</h2>
            <p className="text-red-800">If you're in crisis, help is available 24/7</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource, index) => (
              <Card key={index} className="border-2 border-red-300 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  {resource.phone && (
                    <a href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`} className="text-2xl font-bold text-[#006847] hover:text-[#A4D65E]">
                      {resource.phone}
                    </a>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-[#006847] font-semibold hover:underline"
                  >
                    Visit Website →
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Holistic Approach */}
      <motion.section
        className="bg-gradient-to-r from-[#006847] to-[#005a3c] rounded-2xl p-12 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Sparkles className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-4xl font-bold">The DowUrk Holistic Approach</h2>
          <p className="text-lg opacity-90">
            Mental health isn't separate from business success - it's the foundation of it. 
            Our Seven F's framework addresses the whole person, not just the entrepreneur.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="space-y-2">
              <Flower2 className="h-10 w-10 mx-auto" />
              <h3 className="font-bold text-xl">Mind</h3>
              <p className="text-sm opacity-90">Meditation, mindfulness, and mental clarity practices</p>
            </div>
            <div className="space-y-2">
              <Heart className="h-10 w-10 mx-auto" />
              <h3 className="font-bold text-xl">Body</h3>
              <p className="text-sm opacity-90">Fitness, nutrition, and physical wellness support</p>
            </div>
            <div className="space-y-2">
              <Sparkles className="h-10 w-10 mx-auto" />
              <h3 className="font-bold text-xl">Spirit</h3>
              <p className="text-sm opacity-90">Faith, purpose, and connection to something greater</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Peaceful State Reminder */}
      <section className="text-center space-y-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-2 bg-green-50 px-6 py-3 rounded-full border-2 border-green-200">
            <Leaf className="h-5 w-5 text-green-600" />
            <p className="text-green-800 font-semibold">
              Remember: This website has peaceful hummingbird sounds - toggle the music player (bottom-left) for instant calm
            </p>
          </div>
        </motion.div>
        
        <h2 className="text-4xl font-bold">Your Mental Health Matters</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Building a business is a marathon, not a sprint. Take care of yourself so you can take care of your dreams.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:988">
            <Button size="lg" variant="destructive" className="bg-red-600 hover:bg-red-700">
              🆘 Crisis Support: Call 988
            </Button>
          </a>
          <a href="/contact">
            <Button size="lg" variant="outline" className="border-[#006847] text-[#006847]">
              Contact DowUrk for Support
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}

export default MentalHealthTips;
