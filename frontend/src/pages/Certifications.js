import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Award, Shield, FileCheck } from 'lucide-react';

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
              Official Certifications
            </span>
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Recognized certifications and trademark information for DowUrk Inc.
        </p>
      </motion.section>

      {/* Trademark Information */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <Card className="border-2 border-[#A4D65E]">
          <CardHeader className="bg-gradient-to-r from-[#006847] to-[#005a3c] text-white">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8" />
              <CardTitle className="text-2xl">U.S. Federal Trademark</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4 text-[#006847]">Trademark Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Trademark Name:</span>
                    <span className="font-semibold">DowUrk™</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Registration Number:</span>
                    <span className="font-semibold">6,557,997</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Registration Date:</span>
                    <span className="font-semibold">November 16, 2021</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Mark Type:</span>
                    <span className="font-semibold">Service Mark</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Register:</span>
                    <span className="font-semibold">Principal Register</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-4 text-[#006847]">Application Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Application Number:</span>
                    <span className="font-semibold">90-012,647</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Filing Date:</span>
                    <span className="font-semibold">June 21, 2020</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">First Use Date:</span>
                    <span className="font-semibold">August 16, 2016</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">First Use in Commerce:</span>
                    <span className="font-semibold">August 16, 2016</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">International Class:</span>
                    <span className="font-semibold">35</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-[#006847]">Certification Authority</h3>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-2">United States Patent and Trademark Office (USPTO)</p>
                  <p className="text-sm text-gray-600">
                    This trademark registration signifies federal registration and protection of the DowUrk mark 
                    in the United States. The mark consists of standard characters without claim to any particular 
                    font style, size, or color.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#006847] text-white p-6 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="h-8 w-8 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Federal Protection</h3>
                  <p className="text-sm opacity-90">
                    As a federally registered trademark, the DowUrk™ mark enjoys nationwide protection and exclusive 
                    rights to use the mark in commerce for the services specified in the registration. This registration 
                    provides legal presumption of ownership and the exclusive right to use the mark on or in connection 
                    with the goods/services listed in the registration.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
            DowUrk supports and assists businesses in obtaining these nationally recognized certifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Minority Business Enterprise', abbr: 'MBE' },
            { name: 'Women Business Enterprise', abbr: 'WBE' },
            { name: 'Disadvantaged Business Enterprise', abbr: 'DBE' },
            { name: 'Small Business Enterprise', abbr: 'SBE' },
            { name: '8(a) Business Development Program', abbr: '8(a)' },
            { name: 'HUBZone Certified', abbr: 'HUBZone' },
            { name: 'Veteran-Owned Small Business', abbr: 'VOSB' },
            { name: 'Service-Disabled Veteran-Owned', abbr: 'SDVOSB' },
            { name: 'LGBT Business Enterprise', abbr: 'LGBTBE' },
            { name: 'Disability-Owned Business Enterprise', abbr: 'DOBE' },
            { name: 'B Corporation Certified', abbr: 'B Corp' },
            { name: 'Louisiana Hudson Initiative', abbr: 'Hudson' }
          ].map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <FileCheck className="h-6 w-6 text-[#006847] flex-shrink-0 mt-1" />
                    <div>
                      <Badge className="mb-2 bg-[#A4D65E] text-black">{cert.abbr}</Badge>
                      <p className="text-sm font-semibold">{cert.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <h3 className="text-xl font-bold mb-3">Need Help Getting Certified?</h3>
          <p className="text-gray-600 mb-4">
            DowUrk Inc. provides business certification assistance as part of our professional services.
            We can help you navigate the certification process and prepare your applications.
          </p>
          <a href="/services" className="text-[#006847] font-semibold hover:underline">
            Learn More About Our Services →
          </a>
        </div>
      </motion.section>
    </div>
  );
}

export default Certifications;