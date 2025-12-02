import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import AIBackgroundAnimation from '@/components/AIBackgroundAnimation';
import InspirationalParticles from '@/components/InspirationalParticles';
import { 
  Building2, 
  Bot, 
  Calendar, 
  BookOpen, 
  DollarSign, 
  Users, 
  ArrowRight,
  Sparkles,
  Target,
  Heart
} from 'lucide-react';

function HomePage() {
  const features = [
    {
      icon: <Building2 className="h-8 w-8 text-[#006847]" />,
      title: "Business Directory",
      description: "Discover and connect with Louisiana's diverse network of Black-owned and underrepresented businesses.",
      link: "/businesses"
    },
    {
      icon: <Bot className="h-8 w-8 text-[#006847]" />,
      title: "AI Business Assistant",
      description: "Get personalized guidance on business planning, grants, legal requirements, and marketing strategies.",
      link: "/ai-assistant"
    },
    {
      icon: <Calendar className="h-8 w-8 text-[#006847]" />,
      title: "Events & Training",
      description: "Join workshops, networking events, and training programs designed for Louisiana entrepreneurs.",
      link: "/events"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-[#006847]" />,
      title: "Learning Library",
      description: "Access courses, templates, guides, and resources to build and grow your business.",
      link: "/resources"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-[#006847]" />,
      title: "Grants & Funding",
      description: "Find and apply for grants, loans, and funding opportunities specifically for Louisiana businesses.",
      link: "/grants"
    },
    {
      icon: <Users className="h-8 w-8 text-[#006847]" />,
      title: "Community Feed",
      description: "Connect with fellow entrepreneurs, share success stories, and collaborate on opportunities.",
      link: "/community"
    }
  ];

  const stats = [
    { label: "Louisiana Businesses", value: "1,000+" },
    { label: "Community Members", value: "5,000+" },
    { label: "Success Stories", value: "500+" },
    { label: "Funding Accessed", value: "$2M+" }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section with AI Background */}
      <motion.section 
        className="text-center space-y-8 py-12 relative overflow-hidden" 
        data-testid="hero-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* AI Neural Network Background Animation */}
        <AIBackgroundAnimation />
        
        <motion.div 
          className="inline-block float-animation relative z-10"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img 
            src="https://customer-assets.emergentagent.com/job_equity-focus/artifacts/uvi8zp1o_Dowurk%20CUSTOM%20COMBO%20PLAQUE%209X12.png" 
            alt="DowUrk Custom Logo" 
            className="w-full max-w-md mx-auto mb-6 h-auto relative z-10"
            style={{ aspectRatio: '9/12', objectFit: 'contain' }}
          />
        </motion.div>
        <motion.h1 
          className="text-5xl md:text-6xl font-bold leading-tight relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Welcome to <br />
          <span className="bg-gradient-to-r from-[#A4D65E] to-[#006847] bg-clip-text text-transparent">
            The DowUrk FramewUrk
          </span>
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 max-w-3xl mx-auto relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Heaven Upper-Echelon Bound. Your AI-powered platform connecting Louisiana's underrepresented 
          entrepreneurs with resources, community, and opportunity.
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90 text-white px-8"
              data-testid="get-started-btn"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/businesses">
            <Button size="lg" variant="outline" className="border-[#006847] text-[#006847] px-8">
              Explore Businesses
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="bg-gradient-to-r from-[#006847] to-[#005a3c] rounded-2xl p-12 text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm opacity-90">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="space-y-8" data-testid="features-section">
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold">Everything You Need to Succeed</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools and resources designed specifically for Louisiana entrepreneurs
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link key={index} to={feature.link}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[#A4D65E]" data-testid={`feature-card-${index}`}>
                  <CardHeader>
                    <div className="mb-3">{feature.icon}</div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <motion.section 
        className="bg-gray-50 rounded-2xl p-12 space-y-6 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Inspirational Particles Animation */}
        <InspirationalParticles theme="light" />
        
        <motion.div 
          className="flex items-center justify-center space-x-3 mb-6 relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Heart className="h-8 w-8 text-[#006847]" />
          <h2 className="text-3xl font-bold">Our Mission</h2>
        </motion.div>
        <motion.p 
          className="text-lg text-gray-700 max-w-4xl mx-auto text-center leading-relaxed relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          DowUrk Inc. is dedicated to empowering underrepresented businesses across Louisiana by providing 
          comprehensive training, resources, and access to the capital they need to succeed. We promote 
          self-affirmation and solidarity among entrepreneurs while advocating for regional social and economic growth.
        </motion.p>
        <motion.div 
          className="flex items-center justify-center space-x-8 pt-6 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.1 }}
          >
            <Target className="h-10 w-10 text-[#006847] mx-auto mb-2" />
            <p className="font-semibold">Cultivating Originality</p>
          </motion.div>
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.1 }}
          >
            <Sparkles className="h-10 w-10 text-[#A4D65E] mx-auto mb-2" />
            <p className="font-semibold">Building Community</p>
          </motion.div>
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.1 }}
          >
            <Users className="h-10 w-10 text-[#006847] mx-auto mb-2" />
            <p className="font-semibold">Creating Opportunity</p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="text-center space-y-6 py-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold">Ready to Transform Your Business?</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join thousands of Louisiana entrepreneurs building their dreams with The DowUrk FramewUrk
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90 text-white px-12"
            >
              Create Your Free Account
            </Button>
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}

export default HomePage;
