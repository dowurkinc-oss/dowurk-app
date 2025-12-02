import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, BookOpen, Users, ArrowRight } from 'lucide-react';

function SevenFPage({ fName }) {
  // Normalize fName to handle "Finances" route
  const normalizedName = fName === 'Finances' ? 'Finance' : fName;
  
  const fInfo = {
    'Faith': {
      icon: '✝️',
      description: 'Believe in something. Learn to love others above yourself. Develop spirituality.',
      fullDescription: 'Everyone has to believe in something, have a spirituality about themselves. Learn to love others above yourself and develop your soul.',
      color: 'from-purple-500 to-indigo-600',
      benefits: ['Spiritual growth', 'Community connection', 'Inner peace', 'Purpose-driven life']
    },
    'Fitness': {
      icon: '💪',
      description: 'Get your inward and outward body together through physical wellness and mental health.',
      fullDescription: 'In conjunction with faith and foundation, getting your inward and outward body together through physical wellness programs.',
      color: 'from-green-500 to-teal-600',
      benefits: ['Physical health', 'Mental wellness', 'Stress relief', 'Energy boost'],
      programs: ['Baseball Team', 'Tactical Training', 'Crossfit', 'Dance/Pole Aerobics', 'Yoga', 'Meditation', 'Sports Management']
    },
    'Foundation': {
      icon: '📚',
      description: 'Build your mind through education, respect, morals, ethics, self-love, and mental health support.',
      fullDescription: 'Build your mental foundation through education, respect, morals, ethics, self-love, and comprehensive mental health support.',
      color: 'from-blue-500 to-cyan-600',
      benefits: ['Education', 'Mental health', 'Self-awareness', 'Life skills'],
      programs: ['Book Club', 'Library Access', '24/7 School', 'Charity/Community Service', 'Scholarships', 'Daycare', 'Etiquette Classes', 'Mental Health/Therapy']
    },
    'Fashion': {
      icon: '👔',
      description: 'Revamp your image. Present yourself with confidence and cultural pride.',
      fullDescription: 'Revamping the image of minorities within the US and promoting youth to expand their horizons by attaining consciousness of their own self-captivity.',
      color: 'from-pink-500 to-rose-600',
      benefits: ['Self-expression', 'Confidence', 'Cultural pride', 'Professional image'],
      programs: ['Culturati Noire Fashion Show', 'Fashion Blog', 'Fashion Shows', 'Clothing & Accessories Market', 'Model Agency', 'Magazine', 'Hair/Makeup']
    },
    'Film': {
      icon: '🎬',
      description: 'Tell your story. Use media and creative content to shape your personality and brand.',
      fullDescription: 'Develop your personality through storytelling, media production, and creative content creation.',
      color: 'from-red-500 to-orange-600',
      benefits: ['Storytelling', 'Brand building', 'Creative expression', 'Media skills'],
      programs: ['YouTube Channel/Podcast', 'TV/Radio Broadcast', 'Film/Video Production Studio', 'Content Creation']
    },
    'Food': {
      icon: '🍽️',
      description: 'Nurture your health through nutrition, agriculture, and sustainable food practices.',
      fullDescription: 'Focus on health and wellness through nutrition education, agriculture, and sustainable food systems.',
      color: 'from-yellow-500 to-amber-600',
      benefits: ['Nutrition', 'Healthy eating', 'Agriculture', 'Food security'],
      programs: ['Agriculture/Farming', 'Nutritional Education', 'Home Economics', 'Senior Care', 'Baby Care', 'Manufacturing', 'Cafe']
    },
    'Finance': {
      icon: '💰',
      description: 'Build stability. Learn to save, maintain, and grow your resources.',
      fullDescription: 'Achieve financial stability through education on saving, maintaining, and growing your economic resources.',
      color: 'from-emerald-500 to-green-600',
      benefits: ['Financial literacy', 'Wealth building', 'Investment knowledge', 'Economic stability'],
      programs: ['Workshops', 'Conferences', 'Webinars', 'Small Business Development', 'Entrepreneurial Training']
    }
  };

  const currentF = fInfo[normalizedName];
  
  if (!currentF) {
    return <div className="text-center py-12">Framework section not found</div>;
  }

  return (
    <div className="space-y-12" data-testid={`seven-f-${fName.toLowerCase()}`}>
      {/* Hero */}
      <section className="text-center space-y-6">
        <div className="text-8xl mb-4">{currentF.icon}</div>
        <Badge className="bg-[#A4D65E] text-black text-lg px-6 py-2">The Seven F's FramewUrk</Badge>
        <h1 className="text-6xl font-bold">
          <span className={`bg-gradient-to-r ${currentF.color} bg-clip-text text-transparent`}>
            {fName}
          </span>
        </h1>
        <p className="text-2xl text-gray-700 max-w-3xl mx-auto font-medium">
          {currentF.description}
        </p>
      </section>

      {/* Custom Logo Placeholder */}
      <section className="flex justify-center">
        <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-[#A4D65E]">
          <div className="text-center">
            <div className="text-6xl mb-4">{currentF.icon}</div>
            <p className="text-2xl font-bold text-[#006847]">{fName}</p>
            <p className="text-sm text-gray-600 mt-2">Custom DowUrk Logo<br />Coming Soon</p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <Card className="border-2 border-[#A4D65E]">
        <CardHeader>
          <CardTitle className="text-3xl">About {fName}</CardTitle>
        </CardHeader>
        <CardContent className="text-lg text-gray-700 leading-relaxed">
          {currentF.fullDescription}
        </CardContent>
      </Card>

      {/* Benefits */}
      <section className="space-y-6">
        <h2 className="text-4xl font-bold text-center">Key Benefits</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentF.benefits.map((benefit, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 pb-6">
                <p className="font-semibold text-lg">{benefit}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Programs */}
      {currentF.programs && (
        <section className="space-y-6">
          <h2 className="text-4xl font-bold text-center">{fName} Programs & Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentF.programs.map((program, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <span className="mr-2">✓</span>
                    {program}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Resources Coming Soon */}
      <Card className="bg-gradient-to-r from-[#A4D65E]/10 to-[#006847]/10">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <BookOpen className="mr-3 h-8 w-8 text-[#006847]" />
            {fName} Resources & Events
          </CardTitle>
          <CardDescription className="text-base">
            Coming Soon: Curated resources, events, and opportunities specific to {fName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <Calendar className="h-8 w-8 text-[#006847] mb-2" />
              <h3 className="font-semibold mb-1">Upcoming Events</h3>
              <p className="text-sm text-gray-600">Workshops, trainings, and community gatherings</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <BookOpen className="h-8 w-8 text-[#006847] mb-2" />
              <h3 className="font-semibold mb-1">Learning Resources</h3>
              <p className="text-sm text-gray-600">Guides, videos, and educational materials</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <Users className="h-8 w-8 text-[#006847] mb-2" />
              <h3 className="font-semibold mb-1">Community</h3>
              <p className="text-sm text-gray-600">Connect with others on the same journey</p>
            </div>
          </div>
          <div className="text-center pt-4">
            <Button className="bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90">
              Get Notified When Available
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#006847] to-[#005a3c] rounded-2xl p-12 text-white text-center space-y-6">
        <h2 className="text-3xl font-bold">Explore All Seven F's</h2>
        <p className="text-lg opacity-90">
          Discover how each pillar of The DowUrk FramewUrk can transform your life and business
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {Object.keys(fInfo).map((f) => {
            const linkName = f === 'Finance' ? 'finances' : f.toLowerCase();
            const displayName = f === 'Finance' ? 'Finances' : f;
            return (
              <a key={f} href={`/framework/${linkName}`}>
                <Button 
                  variant="secondary"
                  className={normalizedName === f ? 'bg-[#A4D65E] text-black' : 'bg-white text-gray-900'}
                >
                  {fInfo[f].icon} {displayName}
                </Button>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default SevenFPage;
