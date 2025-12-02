import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
            <h2 className="text-3xl font-bold mb-2">DowUrk Inc.</h2>
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
            Book your appointment online and get started with our professional services
          </p>
        </div>
        
        <Card className="border-2 border-[#A4D65E]">
          <CardContent className="pt-6">
            {/* Setmore Booking Widget Placeholder */}
            <div className="text-center space-y-4 py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#A4D65E] to-[#006847] rounded-full mb-4">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Online Booking Coming Soon</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We're setting up our Setmore booking system. Meanwhile, please contact us directly to schedule your consultation.
              </p>
              <div className="pt-4">
                <Link to="/contact">
                  <Button className="bg-gradient-to-r from-[#A4D65E] to-[#006847]">
                    Contact Us to Schedule
                  </Button>
                </Link>
              </div>
              
              {/* Instructions for adding Setmore widget */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg text-left">
                <h4 className="font-semibold mb-3 text-[#006847]">To Activate Setmore Booking:</h4>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li>1. Create account at <a href="https://www.setmore.com" target="_blank" rel="noopener noreferrer" className="text-[#006847] underline">www.setmore.com</a></li>
                  <li>2. Go to Integrations → Website Booking → Booking Widget</li>
                  <li>3. Click "Get Instructions" and select "I'll embed the code myself"</li>
                  <li>4. Copy your booking page URL or embed code</li>
                  <li>5. Replace the placeholder below with: 
                    <code className="block mt-2 p-2 bg-white rounded text-xs">
                      {'<iframe src="YOUR_SETMORE_BOOKING_URL" width="100%" height="800px" frameBorder="0"></iframe>'}
                    </code>
                  </li>
                </ol>
              </div>
              
              {/* Placeholder iframe - Replace with actual Setmore URL */}
              {/* 
              <iframe 
                src="YOUR_SETMORE_BOOKING_PAGE_URL_HERE"
                width="100%" 
                height="800px" 
                frameBorder="0"
                allow="web-share; payment"
                className="rounded-lg"
              ></iframe>
              */}
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