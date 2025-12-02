import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, DollarSign, Users, Target, CheckCircle, Gift, TrendingUp } from 'lucide-react';

function Donate() {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');

  const donationAmounts = [25, 50, 100, 250, 500, 1000];

  const impactAreas = [
    {
      icon: <Users className="h-10 w-10 text-[#006847]" />,
      title: 'Entrepreneur Support',
      description: '$50 provides one entrepreneur with business planning resources and mentorship'
    },
    {
      icon: <Target className="h-10 w-10 text-[#A4D65E]" />,
      title: 'Training Programs',
      description: '$100 sponsors a workshop on financial literacy or marketing for small businesses'
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-[#006847]" />,
      title: 'Grant Access',
      description: '$250 helps connect 10 businesses with grant opportunities and application support'
    },
    {
      icon: <Gift className="h-10 w-10 text-[#A4D65E]" />,
      title: 'Youth Programs',
      description: '$500 funds entrepreneurship programs for 25 young people in underserved communities'
    }
  ];

  const benefits = [
    'Support underrepresented entrepreneurs across Louisiana',
    'Help create jobs in underserved communities',
    'Promote economic growth and self-sufficiency',
    'Provide access to capital and resources',
    'Build a stronger, more inclusive economy',
    'Tax-deductible 501(c)(3) donation'
  ];

  const handleDonate = () => {
    const amount = selectedAmount || customAmount;
    if (!amount) {
      alert('Please select or enter a donation amount');
      return;
    }
    // Redirect to Stripe donation page
    window.location.href = 'https://donate.stripe.com/test_4gM00j5skfTjg7Y3BN38400';
  };

  return (
    <div className="space-y-16" data-testid="donate-page">
      {/* Hero */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center space-x-3">
          <Heart className="h-12 w-12 text-red-500" />
          <h1 className="text-5xl font-bold">
            <span className="bg-gradient-to-r from-red-500 to-[#006847] bg-clip-text text-transparent">
              Support Our Mission
            </span>
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your donation empowers Louisiana's underrepresented entrepreneurs and helps build 
          stronger, more inclusive communities. Every contribution makes a difference.
        </p>
        <Badge className="bg-[#A4D65E] text-black text-base px-4 py-1">
          501(c)(3) Tax-Deductible • EIN: 81-3555399
        </Badge>
      </section>

      {/* Impact Stats */}
      <section className="bg-gradient-to-r from-[#006847] to-[#005a3c] rounded-2xl p-12 text-white">
        <h2 className="text-3xl font-bold text-center mb-12">2024 Impact Report</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold mb-2">1,247</div>
            <div className="text-lg opacity-90">Entrepreneurs Supported</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">$2.1M</div>
            <div className="text-lg opacity-90">Capital Accessed</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">89</div>
            <div className="text-lg opacity-90">Workshops Held</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">345</div>
            <div className="text-lg opacity-90">Jobs Created</div>
          </div>
        </div>
      </section>

      {/* Donation Amount Selection */}
      <section className="max-w-4xl mx-auto space-y-8">
        <Card className="border-2 border-[#A4D65E]">
          <CardHeader className="bg-gradient-to-r from-[#A4D65E]/10 to-[#006847]/10">
            <CardTitle className="text-3xl text-center">Make Your Donation</CardTitle>
            <CardDescription className="text-center text-base">
              Choose an amount or enter a custom donation
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            {/* Preset Amounts */}
            <div>
              <label className="text-sm font-semibold mb-3 block">Select Amount:</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {donationAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                    }}
                    className={`p-4 rounded-lg border-2 font-semibold transition ${
                      selectedAmount === amount
                        ? 'border-[#006847] bg-[#006847] text-white'
                        : 'border-gray-300 hover:border-[#A4D65E]'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label className="text-sm font-semibold mb-3 block">Or Enter Custom Amount:</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  className="w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A4D65E]"
                />
              </div>
            </div>

            {/* Donate Button */}
            <Button
              onClick={handleDonate}
              size="lg"
              className="w-full bg-gradient-to-r from-red-500 to-[#006847] hover:opacity-90 text-lg"
            >
              <Heart className="mr-2 h-5 w-5" />
              Donate {selectedAmount ? `$${selectedAmount}` : customAmount ? `$${customAmount}` : ''} Now
            </Button>

            {/* Payment Methods */}
            <div className="text-center text-sm text-gray-600">
              <p>Secure payment powered by Stripe</p>
              <p className="mt-2">We accept all major credit cards, debit cards, and digital wallets</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Your Impact */}
      <section className="space-y-8">
        <h2 className="text-4xl font-bold text-center">Where Your Donation Goes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {impactAreas.map((area, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-3">{area.icon}</div>
                <CardTitle className="text-xl">{area.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{area.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Donate */}
      <section className="bg-gray-50 rounded-2xl p-12 space-y-8">
        <h2 className="text-3xl font-bold text-center">Why Donate to DowUrk?</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-[#A4D65E] flex-shrink-0 mt-0.5" />
              <p className="text-lg text-gray-700">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Other Ways to Give */}
      <section className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Other Ways to Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border-2 rounded-lg hover:border-[#A4D65E] transition">
                <h3 className="font-bold text-lg mb-2">Corporate Sponsorship</h3>
                <p className="text-sm text-gray-600 mb-4">Partner with us for events and programs</p>
                <Button variant="outline" size="sm" className="w-full">
                  Learn More
                </Button>
              </div>
              <div className="text-center p-6 border-2 rounded-lg hover:border-[#A4D65E] transition">
                <h3 className="font-bold text-lg mb-2">Volunteer</h3>
                <p className="text-sm text-gray-600 mb-4">Share your time and expertise</p>
                <Button variant="outline" size="sm" className="w-full">
                  Get Involved
                </Button>
              </div>
              <div className="text-center p-6 border-2 rounded-lg hover:border-[#A4D65E] transition">
                <h3 className="font-bold text-lg mb-2">Shop Our Store</h3>
                <p className="text-sm text-gray-600 mb-4">Buy DowUrk merchandise</p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = '/shop'}>
                  Visit Shop
                </Button>
              </div>
            </div>

            <div className="text-center pt-6 border-t">
              <p className="text-sm text-gray-600">
                Questions about donating? <a href="/contact" className="text-[#006847] font-semibold hover:underline">Contact us</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default Donate;
