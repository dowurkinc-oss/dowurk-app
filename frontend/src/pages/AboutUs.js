import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Heart, Users, Sparkles, Award, TrendingUp } from 'lucide-react';

function AboutUs() {
  const sevenFs = [
    { title: 'Faith', icon: '✝️', description: 'Believe in something. Learn to love others above yourself. Develop spirituality.' },
    { title: 'Fitness', icon: '💪', description: 'Get your inward and outward body together through physical wellness and mental health.' },
    { title: 'Foundation', icon: '📚', description: 'Build your mind through education, respect, morals, ethics, self-love, and mental health support.' },
    { title: 'Fashion', icon: '👔', description: 'Revamp your image. Present yourself with confidence and cultural pride.' },
    { title: 'Film', icon: '🎬', description: 'Tell your story. Use media and creative content to shape your personality and brand.' },
    { title: 'Food', icon: '🍽️', description: 'Nurture your health through nutrition, agriculture, and sustainable food practices.' },
    { title: 'Finance', icon: '💰', description: 'Build stability. Learn to save, maintain, and grow your resources.' }
  ];

  const stats = [
    { value: '2016', label: 'Founded' },
    { value: '10,000+', label: 'Entrepreneurs Served' },
    { value: '$2M+', label: 'Capital Accessed' },
    { value: '64', label: 'Louisiana Parishes' }
  ];

  const team = [
    { name: 'Robert Jerrod Brown', role: 'CEO, Founder & Executive Director', description: 'Visionary leader dedicated to empowering Louisiana\'s underrepresented entrepreneurs.' },
  ];

  return (
    <div className="space-y-20" data-testid="about-page">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <Badge className="bg-[#A4D65E] text-black text-base px-4 py-1">About DowUrk Inc.</Badge>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          <span className="bg-gradient-to-r from-[#A4D65E] to-[#006847] bg-clip-text text-transparent">
            Cultivating Originality
          </span>
          <br />Since 2016
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          DowUrk Inc. is a Louisiana-based nonprofit organization dedicated to empowering underrepresented businesses 
          by providing comprehensive training, resources, and access to capital. We promote self-affirmation and solidarity 
          among entrepreneurs while advocating for regional social and economic growth.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-2 border-[#A4D65E]">
          <CardHeader>
            <div className="flex items-center space-x-3 mb-2">
              <Target className="h-8 w-8 text-[#006847]" />
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-gray-700 leading-relaxed">
            <p>
              To emphasize thought, planning, action, and creativity while promoting and enhancing the social and 
              economic well-being of every community, particularly the African American community. We serve and assist 
              those who aspire to promote positive development within their communities through training programs, 
              software application development, and business consulting services.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#006847]">
          <CardHeader>
            <div className="flex items-center space-x-3 mb-2">
              <Sparkles className="h-8 w-8 text-[#A4D65E]" />
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-gray-700 leading-relaxed">
            <p>
              To build a valuable worldwide enterprise for creatives to network and build commerce with a diverse 
              clientele. We aim to develop an outreach program for urban communities and expand on foreign trade and 
              export opportunities, creating a thriving ecosystem for entrepreneurship and innovation.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-[#006847] to-[#005a3c] rounded-2xl p-12 text-white">
        <h2 className="text-3xl font-bold text-center mb-12">Our Impact By The Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-lg opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The Seven F's */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">The Seven F's Framework</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Creating F.U.N. Persons: Friendly, Understanding, Noble People
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sevenFs.map((f, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-4xl mb-3">{f.icon}</div>
                <CardTitle className="text-xl">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Our Aims */}
      <section className="bg-gray-50 rounded-2xl p-12 space-y-8">
        <h2 className="text-3xl font-bold text-center">Our Aims</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-[#006847] mb-3" />
              <CardTitle>Job Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Microenterprise development</li>
                <li>• Technical assistance & training</li>
                <li>• Access to capital</li>
                <li>• Meet SBA criteria</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-[#A4D65E] mb-3" />
              <CardTitle>Individual Development</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Job training & apprenticeship</li>
                <li>• Financial literacy</li>
                <li>• Self-awareness & mental health</li>
                <li>• Life skills training</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="h-10 w-10 text-[#006847] mb-3" />
              <CardTitle>Community Unity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Unity and love for all</li>
                <li>• Youth intervention programs</li>
                <li>• Cultural preservation</li>
                <li>• Social economic growth</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Leadership */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">Leadership</h2>
          <p className="text-xl text-gray-600">Meet the team behind DowUrk Inc.</p>
        </div>
        <div className="max-w-2xl mx-auto">
          {team.map((member, index) => (
            <Card key={index} className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">{member.name}</CardTitle>
                <Badge className="bg-[#A4D65E] text-black w-fit">{member.role}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-gradient-to-r from-[#A4D65E] to-[#006847] rounded-2xl p-12 text-white text-center space-y-6">
        <Award className="h-16 w-16 mx-auto" />
        <h2 className="text-3xl font-bold">Official Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
          <div className="bg-white/10 rounded-lg p-6">
            <h3 className="font-bold text-xl mb-2">501(c)(3) Public Charity</h3>
            <p className="text-sm opacity-90">Established: August 9, 2023</p>
            <p className="text-sm opacity-90">TIN: 81-3555399</p>
          </div>
          <div className="bg-white/10 rounded-lg p-6">
            <h3 className="font-bold text-xl mb-2">Hudson Initiative Certified</h3>
            <p className="text-sm opacity-90">Small Entrepreneurship (SE)</p>
            <p className="text-sm opacity-90">SEBD Certification Active</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
