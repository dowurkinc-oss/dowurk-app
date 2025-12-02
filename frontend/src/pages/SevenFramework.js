import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Mic } from 'lucide-react';

// Custom Seven F logos
const SEVEN_F_LOGOS = {
  Faith: 'https://customer-assets.emergentagent.com/job_1dc8832b-f338-4702-aaed-8947f56a5ae3/artifacts/rq6ixhgf_dowurk_color_one.png',
  Fitness: 'https://customer-assets.emergentagent.com/job_1dc8832b-f338-4702-aaed-8947f56a5ae3/artifacts/ek40p062_dowurk_color_two.png',
  Foundation: 'https://customer-assets.emergentagent.com/job_1dc8832b-f338-4702-aaed-8947f56a5ae3/artifacts/40ce9go5_dowurk_color_three.png',
  Fashion: 'https://customer-assets.emergentagent.com/job_1dc8832b-f338-4702-aaed-8947f56a5ae3/artifacts/4yokg0vz_dowurk_color_four.png',
  Film: 'https://customer-assets.emergentagent.com/job_1dc8832b-f338-4702-aaed-8947f56a5ae3/artifacts/kixkggre_dowurk_color_five.png',
  Food: 'https://customer-assets.emergentagent.com/job_1dc8832b-f338-4702-aaed-8947f56a5ae3/artifacts/klmifrfr_dowurk_color_six.png',
  Finances: 'https://customer-assets.emergentagent.com/job_1dc8832b-f338-4702-aaed-8947f56a5ae3/artifacts/0oviqt83_dowurk_color_seven.png'
};

function SevenFramework() {
  const frameworks = [
    {
      name: 'Faith',
      description: 'Spiritual foundation and personal beliefs that guide your entrepreneurial journey. Connect with your purpose and values.',
      path: '/framework/faith'
    },
    {
      name: 'Fitness',
      description: 'Physical and mental wellness. Maintain the health and energy needed to build and sustain your business.',
      path: '/framework/fitness'
    },
    {
      name: 'Foundation',
      description: 'Business fundamentals, legal structures, and operational systems. Build your business on solid ground.',
      path: '/framework/foundation'
    },
    {
      name: 'Fashion',
      description: 'Personal and professional branding, image, and style. Present yourself and your business authentically.',
      path: '/framework/fashion'
    },
    {
      name: 'Film',
      description: 'Content creation, storytelling, and visual media. Share your message and connect with your audience.',
      path: '/framework/film'
    },
    {
      name: 'Food',
      description: 'Nutrition, culinary arts, and the food industry. Nourish yourself and explore food-based opportunities.',
      path: '/framework/food'
    },
    {
      name: 'Finances',
      description: 'Financial literacy, wealth building, and money management. Master the numbers that drive your success.',
      path: '/framework/finances'
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
            The Seven F's FramewUrk
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A holistic approach to entrepreneurship and personal development. Master these seven pillars 
          to create a fulfilling and purposeful life while completing your soul's mission.
        </p>
      </motion.section>

      {/* Podcast Highlight */}
      <motion.div
        className="bg-gradient-to-r from-[#006847] to-[#005a3c] rounded-2xl p-8 text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <img 
                src="https://customer-assets.emergentagent.com/job_1dc8832b-f338-4702-aaed-8947f56a5ae3/artifacts/ljipdvz5_DowUrk%20Podcast.png"
                alt="The DowUrk Mobile Podcast"
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">The DowUrk Mobile Podcast</h2>
              <p className="text-lg opacity-90">
                This inspiring podcast focuses on entrepreneurial experiences while learning about yourself 
                so that you can have a fulfilling and purposeful life completing your soul's mission here on Earth.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="https://podcasts.apple.com/us/podcast/the-dowurk-mobile-podcast/id1630233933"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button size="lg" variant="secondary" className="bg-white text-[#006847] hover:bg-gray-100 w-full">
                    <Mic className="mr-2 h-5 w-5" />
                    Listen on Apple Podcasts
                  </Button>
                </a>
                <Link to="/blog" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full">
                    View All Episodes
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* The Seven F's Grid */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Explore the Seven F's</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Each pillar contains resources, events, and community support to help you grow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {frameworks.map((framework, index) => (
            <motion.div
              key={framework.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <Link to={framework.path}>
                <Card className="h-full hover:shadow-2xl transition-all cursor-pointer border-2 hover:border-[#A4D65E] group">
                  <CardHeader className="text-center">
                    <div className="mb-4 flex justify-center">
                      <img 
                        src={SEVEN_F_LOGOS[framework.name]} 
                        alt={`${framework.name} Logo`}
                        className="w-24 h-24 object-contain group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <CardTitle className="text-2xl font-bold">{framework.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center mb-4">{framework.description}</p>
                    <div className="flex justify-center">
                      <Button 
                        variant="ghost" 
                        className="text-[#006847] group-hover:text-[#A4D65E] transition-colors"
                      >
                        Explore {framework.name} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-6 py-12">
        <h2 className="text-4xl font-bold">Ready to Transform Your Life?</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start your journey with The DowUrk FramewUrk today
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button size="lg" className="bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90 px-12">
              Join the Community
            </Button>
          </Link>
          <a href="https://podcasts.apple.com/us/podcast/the-dowurk-mobile-podcast/id1630233933" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="border-[#006847] text-[#006847] px-12">
              <Mic className="mr-2 h-5 w-5" />
              Subscribe to Podcast
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}

export default SevenFramework;
