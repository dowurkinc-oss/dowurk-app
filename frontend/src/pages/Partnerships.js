import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Handshake, Video, Mail, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

function Partnerships() {
  return (
    <div className="space-y-12">
      <motion.section className="text-center space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-center space-x-3">
          <Handshake className="h-12 w-12 text-[#006847]" />
          <h1 className="text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#A4D65E] to-[#006847] bg-clip-text text-transparent">Our Partnerships</span>
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Collaborating with leading organizations to empower Louisiana entrepreneurs and preserve our cultural heritage</p>
      </motion.section>

      <motion.section className="max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
        <Card className="border-4 border-[#A4D65E] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="bg-gradient-to-br from-[#006847] to-[#005a3c] p-12 flex items-center justify-center">
              <img src="https://customer-assets.emergentagent.com/job_1dc8832b-f338-4702-aaed-8947f56a5ae3/artifacts/nv5osw3l_new-orleans-jazz-logo.webp" alt="New Orleans Jazz & Heritage Festival" className="w-full max-w-sm" />
            </div>
            <div className="p-8">
              <Badge className="mb-4 bg-[#A4D65E] text-black">Featured Partnership</Badge>
              <h2 className="text-3xl font-bold mb-4 text-[#006847]">New Orleans Jazz & Heritage Festival and Foundation, Inc.</h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">We are proud to partner with the <strong>New Orleans Jazz & Heritage Festival and Foundation</strong>, a cornerstone of Louisiana's cultural preservation and artistic excellence.</p>
                <div className="bg-[#A4D65E]/10 border-l-4 border-[#A4D65E] p-4 rounded">
                  <h3 className="font-bold text-[#006847] mb-2 flex items-center"><Award className="h-5 w-5 mr-2" />Media & Documentation Grant</h3>
                  <p className="text-sm">DowUrk Inc. has been awarded a grant to create new artistic works that reflect, interpret, document, and preserve Louisiana's indigenous culture through media and storytelling.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Grant Focus Areas:</h4>
                  <ul className="space-y-1 text-sm ml-4"><li>• Creating new artistic works</li><li>• Documenting Louisiana's cultural heritage</li><li>• Exhibiting artworks that preserve indigenous culture</li><li>• Supporting Louisiana-based non-profit organizations and artists</li></ul>
                </div>
                <div className="pt-4"><a href="https://www.jazzandheritage.org/community-partnership-grants/" target="_blank" rel="noopener noreferrer"><Button className="w-full bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90"><ExternalLink className="mr-2 h-4 w-4" />Learn More About Community Partnership Grants</Button></a></div>
              </div>
            </div>
          </div>
        </Card>
      </motion.section>

      <motion.section className="max-w-4xl mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <Card className="border-2 border-[#006847]">
          <CardHeader className="bg-gradient-to-r from-[#A4D65E]/10 to-[#006847]/10">
            <CardTitle className="flex items-center"><Video className="mr-3 h-6 w-6 text-[#006847]" />Grant Project: Documenting Louisiana's Entrepreneurial Culture</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-[#A4D65E]">
                <div className="text-center space-y-3"><Video className="h-16 w-16 text-gray-400 mx-auto" /><div><p className="font-semibold text-gray-600">Grant Project Video</p><p className="text-sm text-gray-500">Coming Soon - Currently in Production</p></div><p className="text-xs text-gray-400 max-w-md mx-auto">This space will showcase our documentary work preserving Louisiana's entrepreneurial and cultural heritage through the Jazz Fest Foundation grant.</p></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section className="bg-gradient-to-r from-[#006847] to-[#005a3c] rounded-2xl p-12 text-white text-center space-y-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <Handshake className="h-16 w-16 mx-auto mb-4" />
        <h2 className="text-4xl font-bold">Partner With DowUrk Inc.</h2>
        <p className="text-lg opacity-90 max-w-3xl mx-auto">We believe in the power of collaboration to amplify impact. If your organization shares our mission of empowering underrepresented entrepreneurs and preserving Louisiana's cultural heritage, let's create something meaningful together.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur rounded-lg p-6"><h3 className="font-bold text-xl mb-2">Community Impact</h3><p className="text-sm opacity-90">Joint programs serving Louisiana entrepreneurs</p></div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6"><h3 className="font-bold text-xl mb-2">Cultural Preservation</h3><p className="text-sm opacity-90">Documenting and celebrating Louisiana heritage</p></div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6"><h3 className="font-bold text-xl mb-2">Resource Sharing</h3><p className="text-sm opacity-90">Amplifying reach and maximizing impact</p></div>
        </div>
        <div className="pt-6 space-y-4"><p className="text-base opacity-90"><strong>Current Partners:</strong> New Orleans Jazz & Heritage Festival and Foundation, Louisiana Economic Development, Louisiana SBDC, and growing...</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><Link to="/contact"><Button size="lg" variant="secondary" className="bg-white text-[#006847] hover:bg-gray-100"><Mail className="mr-2 h-5 w-5" />Explore Partnership Opportunities</Button></Link></div></div>
      </motion.section>
    </div>
  );
}

export default Partnerships;