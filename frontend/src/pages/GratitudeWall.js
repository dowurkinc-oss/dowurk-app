import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles, User, Calendar, Globe, Send } from 'lucide-react';
import SocialShare from '@/components/SocialShare';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function GratitudeWall() {
  const [blessings, setBlessings] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    blessing: '',
    isAnonymous: false
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchBlessings();
  }, []);

  const fetchBlessings = async () => {
    try {
      const response = await axios.get(`${API}/blessings`);
      setBlessings(response.data.blessings || []);
      setTotalCount(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching blessings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.blessing.trim().length === 0) return;
    if (formData.blessing.length > 300) {
      alert('Please keep your blessing under 300 words');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API}/blessings`, {
        name: formData.isAnonymous ? 'Anonymous' : formData.name,
        blessing: formData.blessing,
        is_anonymous: formData.isAnonymous
      });
      
      setSuccess(true);
      setFormData({ name: '', blessing: '', isAnonymous: false });
      setTimeout(() => setSuccess(false), 3000);
      fetchBlessings();
    } catch (error) {
      console.error('Error submitting blessing:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const wordCount = formData.blessing.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-12">
      {/* Hero */}
      <motion.section
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center space-x-3">
          <Heart className="h-12 w-12 text-red-500" />
          <h1 className="text-5xl font-bold">
            <span className="bg-gradient-to-r from-red-400 via-[#A4D65E] to-[#006847] bg-clip-text text-transparent">
              Universal Gratitude Wall
            </span>
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A sacred space to count your blessings and share your story. Every testimony added here becomes 
          part of a global wave of gratitude and hope.
        </p>
      </motion.section>

      {/* Global Counter */}
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <Card className="border-4 border-[#A4D65E] bg-gradient-to-br from-[#006847] to-[#005a3c] text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
              {[...Array(20)].map((_, i) => (
                <Heart 
                  key={i} 
                  className="absolute animate-pulse" 
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          </div>
          <CardContent className="py-12 text-center relative z-10">
            <Globe className="h-16 w-16 mx-auto mb-4 text-[#A4D65E]" />
            <h2 className="text-6xl font-bold mb-4">
              {totalCount.toLocaleString()}
            </h2>
            <p className="text-2xl opacity-90 mb-2">Blessings Shared Worldwide</p>
            <p className="text-sm opacity-75">A testament to gratitude, resilience, and hope</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Submit Blessing Form */}
      <motion.section
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <Card className="border-2 border-[#A4D65E]">
          <CardHeader className="bg-gradient-to-r from-[#A4D65E]/10 to-[#006847]/10">
            <CardTitle className="text-2xl text-center flex items-center justify-center space-x-2">
              <Sparkles className="h-8 w-8 text-[#006847]" />
              <span>Share Your Blessing</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {success && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6 text-center">
                <Heart className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-semibold">Your blessing has been added to the wall! ✨</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Your Name (Optional)</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name or leave blank"
                  disabled={formData.isAnonymous}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAnonymous: checked, name: '' }))}
                />
                <label htmlFor="anonymous" className="text-sm cursor-pointer">
                  Share anonymously
                </label>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="blessing">Your Blessing, Testimony, or Gratitude *</Label>
                  <span className="text-sm text-gray-500">
                    {wordCount}/300 words
                  </span>
                </div>
                <Textarea
                  id="blessing"
                  value={formData.blessing}
                  onChange={(e) => setFormData(prev => ({ ...prev, blessing: e.target.value }))}
                  placeholder="Share what you're grateful for, a victory you've experienced, a testimony of growth, or a moment of hope in your journey..."
                  rows={8}
                  required
                  className={wordCount > 300 ? 'border-red-500' : ''}
                />
                <p className="text-xs text-gray-500 mt-2">
                  This is a universal space - business wins, personal growth, spiritual moments, health victories, 
                  relationships, or simply gratitude for today. All blessings are welcome.
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={submitting || wordCount > 300 || formData.blessing.trim().length === 0}
                  className="bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90"
                  size="lg"
                >
                  {submitting ? 'Submitting...' : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Add My Blessing to the Wall
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.section>

      {/* Recent Blessings */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-3">Recent Blessings</h2>
          <p className="text-gray-600">Testimonies of hope, gratitude, and growth from around the world</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading blessings...</div>
        ) : blessings.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Be the first to share a blessing!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blessings.slice(0, 12).map((blessing, index) => (
              <motion.div
                key={blessing.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-[#A4D65E]">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-[#006847]" />
                        <span className="font-semibold">
                          {blessing.is_anonymous ? 'Anonymous' : blessing.name}
                        </span>
                      </div>
                      <Badge variant="outline" className="border-[#A4D65E] text-[#006847]">
                        <Heart className="h-3 w-3 mr-1" />
                        Blessing #{totalCount - index}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(blessing.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed italic mb-4">"{blessing.blessing}"</p>
                    <div className="pt-3 border-t">
                      <SocialShare 
                        url={`https://dowurktoday.com/gratitude-wall`}
                        title={`Blessing from ${blessing.is_anonymous ? 'Anonymous' : blessing.name}`}
                        description={blessing.blessing.substring(0, 100) + '...'}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#006847] to-[#005a3c] rounded-2xl p-12 text-white text-center space-y-6">
        <Sparkles className="h-16 w-16 mx-auto mb-4" />
        <h2 className="text-3xl font-bold">Every Blessing Counts</h2>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          In moments of challenge, remembering our blessings restores our strength. 
          Your testimony might be exactly what someone else needs to hear today.
        </p>
        <Button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          variant="secondary" 
          size="lg"
          className="bg-white text-[#006847] hover:bg-gray-100"
        >
          Share Your Blessing
        </Button>
      </section>
    </div>
  );
}

export default GratitudeWall;