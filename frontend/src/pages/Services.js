import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QuizPopup from '@/components/QuizPopup';
import { 
  Megaphone, Code, GraduationCap, FileText, LineChart, Video, 
  Share2, PenTool, Mic, Scale, Cpu, CloudRain, Users, 
  TrendingUp, Handshake, Building2, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

function Services() {
  const services = [
    {
      icon: <Megaphone className="h-8 w-8" />,
      title: 'Branding and Product Development',
      description: 'Create compelling brand identities and develop products that resonate with your target market.'
    },
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: 'Business Training & Consulting',
      description: 'Expert guidance and training to help you build, grow, and scale your business successfully.'
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: 'Business Certification',
      description: 'Assistance with obtaining MBE, WBE, DBE, and other nationally recognized certifications.'
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: 'Photo & Video Services',
      description: 'Professional photography and videography to showcase your business and tell your story.'
    },
    {
      icon: <Share2 className="h-8 w-8" />,
      title: 'Social Media Management',
      description: 'Build your online presence with strategic social media content and community management.'
    },
    {
      icon: <PenTool className="h-8 w-8" />,
      title: 'Content Creation/Copywriting',
      description: 'Engaging content and copy that connects with your audience and drives results.'
    },
    {
      icon: <Mic className="h-8 w-8" />,
      title: 'Podcast/Livestream Recordings',
      description: 'Professional podcast production and livestream services to amplify your message.'
    },
    {
      icon: <Scale className="h-8 w-8" />,
      title: 'Legal Compliance',
      description: 'Navigate business regulations, licensing, and compliance requirements with confidence.'
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      title: 'AI Services & Solutions',
      description: 'Leverage cutting-edge AI tools to automate, optimize, and scale your business operations.'
    },
    {
      icon: <CloudRain className="h-8 w-8" />,
      title: 'Disaster Response & Relief',
      description: 'Support and resources for businesses affected by natural disasters and emergencies.'
    },
    {
      icon: <LineChart className="h-8 w-8" />,
      title: 'Strategic Planning',
      description: 'Develop comprehensive business strategies and roadmaps for sustainable growth.'
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: 'Grant Writing',
      description: 'Professional grant writing services to help you secure funding for your business.'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Digital Marketing',
      description: 'Data-driven digital marketing strategies to reach and engage your ideal customers.'
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: 'IT Services',
      description: 'Technology consulting, web development, and IT support for modern businesses.'
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: 'Research',
      description: 'Market research, competitive analysis, and data insights to inform your decisions.'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Event Services',
      description: 'Planning, coordination, and execution of professional business events and workshops.'
    },
    {
      icon: <Megaphone className="h-8 w-8" />,
      title: 'Campaigns',
      description: 'End-to-end campaign management for marketing, fundraising, and advocacy initiatives.'
    },
    {
      icon: <Handshake className="h-8 w-8" />,
      title: 'Partnerships & Strategic Alliances',
      description: 'Connect with potential partners and build strategic alliances for mutual growth.'
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      title: 'Business Association',
      description: 'Join our network of entrepreneurs and access exclusive member benefits and resources.'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Quiz Popup - Auto-appears after 5 seconds */}
      <QuizPopup delay={5000} />
      
      {/* Hero */}
      <motion.section
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-bold">
          <span className="bg-gradient-to-r from-[#A4D65E] to-[#006847] bg-clip-text text-transparent">
            Professional Services
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive business services to help Louisiana entrepreneurs succeed at every stage
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact">
            <Button size="lg" className="bg-gradient-to-r from-[#A4D65E] to-[#006847]">
              Request Services
            </Button>
          </Link>
          <Link to="/about">
            <Button size="lg" variant="outline" className="border-[#006847] text-[#006847]">
              Learn More
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Company Info Bar */}
      <motion.div
        className="bg-gradient-to-r from-[#006847] to-[#005a3c] rounded-2xl p-8 text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">DowUrk<sup className="text-sm">®</sup> Inc.</h2>
            <p className="text-lg opacity-90">Professional Services • Est. 2016</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-sm opacity-80 mb-1">UEI</div>
              <div className="font-semibold">PNMVVH9EWSD3</div>
            </div>
            <div>
              <div className="text-sm opacity-80 mb-1">NAICS</div>
              <div className="font-semibold">813410</div>
            </div>
            <div>
              <div className="text-sm opacity-80 mb-1">CAGE Code</div>
              <div className="font-semibold">8JUP7</div>
            </div>
          </div>
          <div className="text-center mt-6 pt-6 border-t border-white/20">
            <p className="text-xl font-bold">"We Turn Systemic Gaps Into Generational Wins"</p>
          </div>
        </div>
      </motion.div>

      {/* Services Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow border-2 hover:border-[#A4D65E]">
                <CardHeader>
                  <div className="mb-3 text-[#006847]">{service.icon}</div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <motion.section
        className="bg-gray-50 rounded-2xl p-12 space-y-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-center">Our Strategy</h2>
        <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto leading-relaxed">
          At DowUrk Inc., we educate novice entrepreneurs on their obligations as business owners, 
          provide professional services, and keep them motivated and engaged by entertaining them as 
          they learn new skills. We promote <strong>self-love</strong> and <strong>unity</strong> while 
          equipping young, developing minds with the tools and resources to acquire professional knowledge.
        </p>
        <div className="flex justify-center space-x-8 pt-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#006847]">10+</div>
            <div className="text-sm text-gray-600 mt-1">Years Serving</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#006847]">19</div>
            <div className="text-sm text-gray-600 mt-1">Services Offered</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#006847]">1000+</div>
            <div className="text-sm text-gray-600 mt-1">Businesses Served</div>
          </div>
        </div>
      </motion.section>

      {/* Booking Widget Section */}
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Schedule a Consultation</h2>
          <p className="text-gray-600">
            Book your appointment online with our professional services team
          </p>
        </div>
        
        <Card className="border-2 border-[#A4D65E]">
          <CardContent className="pt-6">
            {/* Setmore Booking Widget - ACTIVE */}
            <div className="text-center space-y-6">
              <script 
                id='setmore_script' 
                type='text/javascript' 
                src='https://assets.setmore.com/integration/static/setmoreIframeLive.js'
              ></script>
              <a 
                style={{float: 'none'}} 
                id='Setmore_button_iframe' 
                href='https://dowurkinc.setmore.com'
                className="inline-block"
              >
                <img 
                  border='none' 
                  src='https://assets.setmore.com/setmore/images/2.0/Settings/book-now-black.svg' 
                  alt='Book your appointment with DowUrk Inc.' 
                  className="mx-auto hover:opacity-80 transition-opacity"
                  style={{maxWidth: '200px'}}
                />
              </a>
              
              <p className="text-sm text-gray-600 mt-4">
                Click the button above to view available appointments and book your consultation
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="text-center space-y-6 py-12">
        <h2 className="text-4xl font-bold">Ready to Grow Your Business?</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Let's discuss how our services can help you achieve your entrepreneurial goals
        </p>
        <Link to="/contact">
          <Button size="lg" className="bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90 px-12">
            Contact Us Today
          </Button>
        </Link>
      </section>
    </div>
  );
}

export default Services;