import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  TrendingUp, 
  Users, 
  Globe, 
  CheckCircle, 
  DollarSign,
  BarChart,
  ShoppingBag,
  Zap
} from 'lucide-react';

function VirtualBooths() {
  const [formData, setFormData] = useState({
    business_name: '',
    email: '',
    phone: '',
    description: '',
    products: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit to backend
    alert('Thank you for your interest! We will contact you soon.');
  };

  const plans = [
    {
      name: 'Starter Booth',
      price: '$49',
      period: '/month',
      description: 'Perfect for new businesses getting started',
      features: [
        'Up to 10 product listings',
        'Basic storefront page',
        'Payment processing',
        'Email support',
        'DowUrk badge'
      ],
      color: 'border-gray-300'
    },
    {
      name: 'Professional Booth',
      price: '$99',
      period: '/month',
      description: 'For growing businesses ready to scale',
      features: [
        'Unlimited product listings',
        'Custom storefront design',
        'Priority support',
        'Analytics dashboard',
        'Featured placement',
        'Social media integration',
        'Email marketing tools'
      ],
      popular: true,
      color: 'border-[#A4D65E]'
    },
    {
      name: 'Enterprise Booth',
      price: '$199',
      period: '/month',
      description: 'Maximum visibility and support',
      features: [
        'Everything in Professional',
        'Premium homepage placement',
        'Dedicated account manager',
        'Custom branding options',
        'API access',
        'Priority customer support',
        'Marketing consultation',
        'Monthly performance reports'
      ],
      color: 'border-[#006847]'
    }
  ];

  const benefits = [
    {
      icon: <Globe className="h-10 w-10 text-[#006847]" />,
      title: 'Reach Beyond Louisiana',
      description: 'Connect with customers across the United States and internationally'
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-[#A4D65E]" />,
      title: 'Grow Your Revenue',
      description: '24/7 online presence means sales even while you sleep'
    },
    {
      icon: <Users className="h-10 w-10 text-[#006847]" />,
      title: 'Community Support',
      description: 'Join a network of minority-owned businesses helping each other succeed'
    },
    {
      icon: <Zap className="h-10 w-10 text-[#A4D65E]" />,
      title: 'Easy Setup',
      description: 'Get your virtual booth live in minutes with our simple tools'
    }
  ];

  return (
    <div className="space-y-16" data-testid="virtual-booths-page">
      {/* Hero */}
      <section className="text-center space-y-6">
        <Badge className="bg-[#A4D65E] text-black text-base px-4 py-1">E-Commerce Hub</Badge>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          <span className="bg-gradient-to-r from-[#A4D65E] to-[#006847] bg-clip-text text-transparent">
            Virtual Booths
          </span>
          <br />Marketplace
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Create your online storefront and sell your products or services to customers worldwide. 
          Support minority businesses while growing your revenue.
        </p>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-[#006847] to-[#005a3c] rounded-2xl p-12 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold mb-2">500+</div>
            <div className="text-lg opacity-90">Active Booths</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">$500K+</div>
            <div className="text-lg opacity-90">Sales Generated</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">10K+</div>
            <div className="text-lg opacity-90">Monthly Visitors</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">95%</div>
            <div className="text-lg opacity-90">Satisfaction Rate</div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="space-y-8">
        <h2 className="text-4xl font-bold text-center">Why Open a Virtual Booth?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-3">{benefit.icon}</div>
                <CardTitle className="text-2xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">Choose Your Plan</h2>
          <p className="text-xl text-gray-600">All plans include secure payment processing and DowUrk support</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative hover:shadow-xl transition-shadow border-2 ${
                plan.popular ? 'shadow-lg scale-105' : ''
              } ${plan.color}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge className="bg-[#A4D65E] text-black px-6 py-1 text-sm">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-[#006847] mb-2">
                  {plan.price}<span className="text-xl text-gray-600">{plan.period}</span>
                </div>
                <CardDescription className="text-base">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#A4D65E] mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section className="space-y-8">
        <Card className="max-w-3xl mx-auto border-2 border-[#A4D65E]">
          <CardHeader className="bg-gradient-to-r from-[#A4D65E]/10 to-[#006847]/10">
            <div className="flex items-center space-x-3 mb-2">
              <Store className="h-8 w-8 text-[#006847]" />
              <CardTitle className="text-2xl">Apply for Your Virtual Booth</CardTitle>
            </div>
            <CardDescription className="text-base">
              Fill out the form below and our team will reach out within 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name *</Label>
                  <Input
                    id="business_name"
                    required
                    value={formData.business_name}
                    onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Tell us about your business *</Label>
                <Textarea
                  id="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="What products or services do you offer? What makes your business unique?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="products">Main Products/Services *</Label>
                <Input
                  id="products"
                  required
                  value={formData.products}
                  onChange={(e) => setFormData({...formData, products: e.target.value})}
                  placeholder="e.g., Handmade jewelry, consulting services, etc."
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90"
                size="lg"
              >
                Submit Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default VirtualBooths;
