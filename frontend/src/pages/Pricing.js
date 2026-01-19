import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Check, X, Sparkles, Zap, Crown, ArrowRight,
  MessageSquare, Users, DollarSign, BookOpen,
  Shield, Clock, Star, Rocket
} from 'lucide-react';

function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  const tiers = [
    {
      name: 'Free',
      icon: Sparkles,
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for exploring the platform',
      color: 'from-gray-400 to-gray-600',
      features: [
        { name: 'AI Business Assistant', included: true, limit: '5 queries/day' },
        { name: 'Business Directory Access', included: true, limit: 'View only' },
        { name: 'Learning Library', included: true, limit: 'Basic courses' },
        { name: 'Community Forums', included: true },
        { name: 'Grant Database', included: true, limit: 'Limited search' },
        { name: 'Business Verification', included: true, limit: '1/month' },
        { name: 'AI Business Coach', included: false },
        { name: 'Mentor Matching', included: false },
        { name: 'Grant Application Writer', included: false },
        { name: 'Priority Support', included: false }
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'Pro',
      icon: Zap,
      price: { monthly: 19.99, annual: 14.99 },
      description: 'For serious entrepreneurs ready to grow',
      color: 'from-[#A4D65E] to-[#006847]',
      features: [
        { name: 'AI Business Assistant', included: true, limit: 'Unlimited' },
        { name: 'Business Directory Access', included: true, limit: 'Full access + listing' },
        { name: 'Learning Library', included: true, limit: 'All courses' },
        { name: 'Community Forums', included: true },
        { name: 'Grant Database', included: true, limit: 'Full search + alerts' },
        { name: 'Business Verification', included: true, limit: 'Unlimited' },
        { name: 'AI Business Coach', included: true, limit: 'Weekly sessions' },
        { name: 'Mentor Matching', included: true, limit: '3 matches/month' },
        { name: 'Grant Application Writer', included: true, limit: '2/month' },
        { name: 'Priority Support', included: false }
      ],
      cta: 'Start Pro Trial',
      popular: true
    },
    {
      name: 'Elite',
      icon: Crown,
      price: { monthly: 99, annual: 79 },
      description: 'For entrepreneurs who want it all',
      color: 'from-yellow-400 to-orange-500',
      features: [
        { name: 'AI Business Assistant', included: true, limit: 'Unlimited + priority' },
        { name: 'Business Directory Access', included: true, limit: 'Featured listing' },
        { name: 'Learning Library', included: true, limit: 'All + exclusive content' },
        { name: 'Community Forums', included: true, limit: 'VIP access' },
        { name: 'Grant Database', included: true, limit: 'Full + personalized matches' },
        { name: 'Business Verification', included: true, limit: 'Unlimited + badge' },
        { name: 'AI Business Coach', included: true, limit: 'Daily sessions' },
        { name: 'Mentor Matching', included: true, limit: 'Unlimited + 1-on-1' },
        { name: 'Grant Application Writer', included: true, limit: 'Unlimited' },
        { name: 'Priority Support', included: true, limit: '24/7 dedicated' }
      ],
      cta: 'Go Elite',
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'Can I change my plan later?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, Pro and Elite plans come with a 14-day free trial. No credit card required to start.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and ACH bank transfers for annual plans.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Absolutely. You can cancel your subscription at any time with no cancellation fees.'
    },
    {
      question: 'Do you offer discounts for non-profits?',
      answer: 'Yes! Non-profit organizations receive 25% off all paid plans. Contact us to apply.'
    },
    {
      question: 'What happens to my data if I downgrade?',
      answer: 'Your data is always yours. If you downgrade, you\'ll retain access to your data but may lose access to certain features.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge className="bg-[#A4D65E] text-black">Pricing</Badge>
        <h1 className="text-4xl md:text-5xl font-bold">
          Invest in Your Business Success
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the plan that fits your entrepreneurial journey. All plans include our core AI features.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 pt-4">
          <span className={`text-sm ${!isAnnual ? 'font-bold' : 'text-gray-500'}`}>Monthly</span>
          <Switch
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
          />
          <span className={`text-sm ${isAnnual ? 'font-bold' : 'text-gray-500'}`}>
            Annual
            <Badge className="ml-2 bg-green-100 text-green-800">Save 25%</Badge>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <Card 
            key={tier.name}
            className={`relative overflow-hidden ${
              tier.popular 
                ? 'border-2 border-[#006847] shadow-xl scale-105' 
                : 'hover:shadow-lg'
            } transition-all`}
          >
            {tier.popular && (
              <div className="absolute top-0 right-0">
                <Badge className="rounded-none rounded-bl-lg bg-[#006847]">
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-2">
              <div className={`h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${tier.color} flex items-center justify-center`}>
                <tier.icon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="text-center">
              <div className="mb-6">
                <span className="text-5xl font-bold">
                  ${isAnnual ? tier.price.annual : tier.price.monthly}
                </span>
                {tier.price.monthly > 0 && (
                  <span className="text-gray-500">/month</span>
                )}
                {isAnnual && tier.price.monthly > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Billed annually (${(tier.price.annual * 12).toFixed(0)}/year)
                  </p>
                )}
              </div>

              <ul className="space-y-3 text-left">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0" />
                    )}
                    <span className={feature.included ? '' : 'text-gray-400'}>
                      {feature.name}
                      {feature.limit && feature.included && (
                        <span className="text-xs text-gray-500 ml-1">({feature.limit})</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button 
                className={`w-full ${
                  tier.popular 
                    ? 'bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90' 
                    : tier.name === 'Elite'
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-90'
                    : ''
                }`}
                variant={tier.popular || tier.name === 'Elite' ? 'default' : 'outline'}
                size="lg"
              >
                {tier.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Detailed Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4">Feature</th>
                  <th className="text-center py-4 px-4">Free</th>
                  <th className="text-center py-4 px-4 bg-[#006847]/5">Pro</th>
                  <th className="text-center py-4 px-4">Elite</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'AI Queries', free: '5/day', pro: 'Unlimited', elite: 'Unlimited + Priority' },
                  { feature: 'Business Coach Sessions', free: '-', pro: 'Weekly', elite: 'Daily' },
                  { feature: 'Grant Applications', free: '-', pro: '2/month', elite: 'Unlimited' },
                  { feature: 'Mentor Matches', free: '-', pro: '3/month', elite: 'Unlimited' },
                  { feature: 'Business Verifications', free: '1/month', pro: 'Unlimited', elite: 'Unlimited + Badge' },
                  { feature: 'Directory Listing', free: 'View Only', pro: 'Basic Listing', elite: 'Featured Listing' },
                  { feature: 'Learning Courses', free: 'Basic', pro: 'All Courses', elite: 'All + Exclusive' },
                  { feature: 'Support', free: 'Community', pro: 'Email', elite: '24/7 Dedicated' },
                  { feature: 'Analytics Dashboard', free: 'Basic', pro: 'Advanced', elite: 'Premium' },
                  { feature: 'API Access', free: '-', pro: '-', elite: 'Full Access' }
                ].map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-medium">{row.feature}</td>
                    <td className="py-3 px-4 text-center text-gray-500">{row.free}</td>
                    <td className="py-3 px-4 text-center bg-[#006847]/5 font-medium">{row.pro}</td>
                    <td className="py-3 px-4 text-center text-orange-600 font-medium">{row.elite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Social Impact */}
      <Card className="bg-gradient-to-r from-[#006847] to-[#A4D65E] text-white">
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Our Social Impact Commitment</h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              A portion of every subscription goes directly to supporting underrepresented entrepreneurs 
              through scholarships, grants, and community programs.
            </p>
            <div className="grid md:grid-cols-4 gap-6 mt-8">
              {[
                { stat: '10,000+', label: 'Entrepreneurs Supported' },
                { stat: '$50M+', label: 'Funding Secured' },
                { stat: '500+', label: 'Expert Mentors' },
                { stat: '95%', label: 'Success Rate' }
              ].map((item, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold">{item.stat}</div>
                  <div className="text-white/80">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQs */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Card className="text-center">
        <CardContent className="py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Join thousands of entrepreneurs who are using DowUrk AI to build, grow, and scale their businesses.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-[#006847] hover:bg-[#005238]">
              <Rocket className="mr-2 h-5 w-5" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              <MessageSquare className="mr-2 h-5 w-5" />
              Talk to Sales
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Pricing;
