import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

function Certifications() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <motion.section
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center space-x-3">
          <Award className="h-12 w-12 text-[#006847]" />
          <h1 className="text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#A4D65E] to-[#006847] bg-clip-text text-transparent">
              Business Certifications
            </span>
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Nationally recognized certifications that DowUrk supports and helps businesses obtain
        </p>
      </motion.section>

      {/* Supported Business Certifications */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Recognized Business Certifications</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            DowUrk assists businesses in obtaining these nationally recognized certifications to access contracts, 
            funding opportunities, and supplier diversity programs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Minority Business Enterprise', abbr: 'MBE', description: 'Certification for businesses owned by racial/ethnic minorities (51%+ ownership)' },
            { name: 'Women Business Enterprise', abbr: 'WBE', description: 'Certification for women-owned businesses (51%+ ownership)' },
            { name: 'Disadvantaged Business Enterprise', abbr: 'DBE', description: 'Federal certification for socially and economically disadvantaged businesses' },
            { name: 'Small Business Enterprise', abbr: 'SBE', description: 'Certification for small businesses meeting size standards' },
            { name: '8(a) Business Development Program', abbr: '8(a)', description: 'SBA program for socially and economically disadvantaged entrepreneurs' },
            { name: 'HUBZone Certified', abbr: 'HUBZone', description: 'Federal certification for businesses in Historically Underutilized Business Zones' },
            { name: 'Veteran-Owned Small Business', abbr: 'VOSB', description: 'Certification for businesses owned by veterans (51%+ ownership)' },
            { name: 'Service-Disabled Veteran-Owned', abbr: 'SDVOSB', description: 'Certification for businesses owned by service-disabled veterans' },
            { name: 'LGBT Business Enterprise', abbr: 'LGBTBE', description: 'Certification for LGBT-owned businesses through NGLCC' },
            { name: 'Disability-Owned Business Enterprise', abbr: 'DOBE', description: 'Certification for businesses owned by individuals with disabilities' },
            { name: 'B Corporation Certified', abbr: 'B Corp', description: 'Certification for businesses meeting high standards of social and environmental performance' },
            { name: 'Louisiana Hudson Initiative', abbr: 'Hudson', description: 'Louisiana state certification for small entrepreneurship businesses' }
          ].map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className=\"h-full hover:shadow-lg transition-shadow border-2 hover:border-[#A4D65E]\">
                <CardContent className=\"pt-6\">
                  <div className=\"flex items-start space-x-3\">
                    <FileCheck className=\"h-6 w-6 text-[#006847] flex-shrink-0 mt-1\" />
                    <div className=\"flex-1\">
                      <Badge className=\"mb-2 bg-[#A4D65E] text-black\">{cert.abbr}</Badge>
                      <h3 className=\"font-semibold mb-2\">{cert.name}</h3>
                      <p className=\"text-sm text-gray-600\">{cert.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}\n        </div>
\n        <div className=\"bg-gray-50 p-8 rounded-lg text-center\">
          <h3 className=\"text-xl font-bold mb-3\">Need Help Getting Certified?</h3>
          <p className=\"text-gray-600 mb-4\">
            DowUrk Inc. provides business certification assistance as part of our professional services.
            We can help you navigate the certification process and prepare your applications.
          </p>
          <Link to=\"/services\" className=\"text-[#006847] font-semibold hover:underline\">
            Learn More About Our Services →
          </Link>
        </div>
      </motion.section>
    </div>
  );
}

export default Certifications;