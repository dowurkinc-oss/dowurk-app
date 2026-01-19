import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, Target, DollarSign, Users, BookOpen, Sparkles, 
  ArrowRight, Crown, Zap, TrendingUp, Calendar, Award,
  MessageSquare, Rocket, Heart, Star, FileText, Workflow,
  Shield, Copy
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/ai-hub`;

function AIHub() {
  const [dashboard, setDashboard] = useState(null);
  const [subscriptionTiers, setSubscriptionTiers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, tiersRes] = await Promise.all([
        axios.get(`${API}/dashboard`),
        axios.get(`${API}/subscription/tiers`)
      ]);
      setDashboard(dashboardRes.data);
      setSubscriptionTiers(tiersRes.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const coreFeatures = [
    {
      title: 'AI Business Coach',
      description: 'Personalized coaching with stage-based guidance, weekly check-ins, and milestone tracking',
      icon: Target,
      color: 'from-green-500 to-emerald-600',
      link: '/ai-coach',
      badge: 'Popular'
    },
    {
      title: 'Grant Matching',
      description: 'Smart grant discovery, eligibility analysis, and AI-powered application assistance',
      icon: DollarSign,
      color: 'from-yellow-500 to-orange-500',
      link: '/ai-grants',
      badge: 'New'
    },
    {
      title: 'Community Intelligence',
      description: 'AI-powered mentor matching, networking suggestions, and peer accountability groups',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      link: '/ai-community',
      badge: null
    },
    {
      title: 'Business Verification',
      description: 'Verify Louisiana businesses, check name availability, and validate compliance status',
      icon: Shield,
      color: 'from-teal-500 to-cyan-600',
      link: '/business-verification',
      badge: 'LA SOS'
    }
  ];

  const hackbookFeatures = [
    {
      title: 'AI Prompt Library',
      description: '15+ ready-to-use prompts for business planning, grants, marketing, and more',
      icon: Copy,
      color: 'from-purple-500 to-pink-500',
      link: '/prompts',
      badge: 'New',
      stats: '15+ Prompts'
    },
    {
      title: 'Automation Hub',
      description: 'No-code automation templates that save 20+ hours per week',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      link: '/automations',
      badge: 'New',
      stats: '8 Templates'
    },
    {
      title: 'AI Workflow Pipelines',
      description: 'Multi-tool workflows for content, coding, and learning acceleration',
      icon: Workflow,
      color: 'from-cyan-500 to-blue-500',
      link: '/workflows',
      badge: 'New',
      stats: '3 Pipelines'
    }
  ];

  const quickStats = [
    { label: 'Entrepreneurs Served', value: '10,000+', icon: Users },
    { label: 'Capital Accessed', value: '$2M+', icon: DollarSign },
    { label: 'Success Stories', value: '500+', icon: Star },
    { label: 'Active Mentors', value: '100+', icon: Heart }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006847]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#006847] to-[#A4D65E] p-8 md:p-12">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <Badge className="bg-white/20 text-white border-white/30">
              AI-Powered Platform
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            DowUrk AI Hub
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mb-6">
            Your comprehensive AI-powered entrepreneurial ecosystem. Get personalized coaching, 
            find grants, connect with mentors, and grow your business with ready-to-use AI tools.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/ai-coach">
              <Button size="lg" className="bg-white text-[#006847] hover:bg-white/90">
                <Rocket className="mr-2 h-5 w-5" />
                Start AI Coaching
              </Button>
            </Link>
            <Link to="/prompts">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                <Copy className="mr-2 h-5 w-5" />
                Browse Prompts
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/10 rounded-full translate-y-1/2"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <stat.icon className="h-8 w-8 mx-auto mb-2 text-[#006847]" />
              <div className="text-2xl font-bold text-[#006847]">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Hackbook Features - NEW SECTION */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <BookOpen className="mr-2 h-6 w-6 text-[#006847]" />
              AI Hackbook Tools
            </h2>
            <p className="text-gray-600">Ready-to-use AI resources from the DowUrk AI Hackbook</p>
          </div>
          <Badge className="bg-[#A4D65E] text-black">2026 Edition</Badge>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {hackbookFeatures.map((feature, index) => (
            <Link key={index} to={feature.link}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-2 border-dashed border-[#A4D65E]/50 hover:border-[#006847]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color}`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      {feature.badge && (
                        <Badge className="bg-[#A4D65E] text-black mb-1">{feature.badge}</Badge>
                      )}
                      <div className="text-xs text-gray-500">{feature.stats}</div>
                    </div>
                  </div>
                  <CardTitle className="mt-4 group-hover:text-[#006847] transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-[#006847] font-medium">
                    Explore <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Core Features Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Sparkles className="mr-2 h-6 w-6 text-[#006847]" />
          Core AI Features
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {coreFeatures.map((feature, index) => (
            <Link key={index} to={feature.link}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color}`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    {feature.badge && (
                      <Badge className="bg-[#A4D65E] text-black">{feature.badge}</Badge>
                    )}
                  </div>
                  <CardTitle className="mt-4 group-hover:text-[#006847] transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-[#006847] font-medium">
                    Explore <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Subscription Tiers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Crown className="mr-2 h-5 w-5 text-yellow-500" />
                Subscription Plans
              </CardTitle>
              <CardDescription>Choose the plan that fits your entrepreneurial journey</CardDescription>
            </div>
            <Link to="/pricing">
              <Badge variant="outline" className="text-[#006847] border-[#006847] cursor-pointer hover:bg-[#006847] hover:text-white">
                View Full Details
              </Badge>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Tier */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <div className="text-3xl font-bold">$0<span className="text-sm font-normal text-gray-500">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-[#A4D65E]" /> 20 AI chats/month</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-[#A4D65E]" /> Basic community access</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-[#A4D65E]" /> 3 grant matches</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-[#A4D65E]" /> All prompt templates</li>
                </ul>
                <Button variant="outline" className="w-full">Current Plan</Button>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="border-2 border-[#006847] relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-[#006847]">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <div className="text-3xl font-bold">$19.99<span className="text-sm font-normal text-gray-500">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-[#A4D65E]" /> Unlimited AI chats</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-[#A4D65E]" /> Full AI Business Coach</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-[#A4D65E]" /> Unlimited grant matching</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-[#A4D65E]" /> Automation setup guides</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-[#A4D65E]" /> Priority support</li>
                </ul>
                <Link to="/pricing">
                  <Button className="w-full bg-[#006847] hover:bg-[#005238]">
                    Upgrade to Pro
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Elite Tier */}
            <Card className="border-2 border-yellow-400 bg-gradient-to-b from-yellow-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  Elite <Crown className="ml-2 h-4 w-4 text-yellow-500" />
                </CardTitle>
                <div className="text-3xl font-bold">$99<span className="text-sm font-normal text-gray-500">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-yellow-500" /> Everything in Pro</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-yellow-500" /> 1:1 AI coaching sessions</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-yellow-500" /> Custom automations built</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-yellow-500" /> Investor introductions</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-yellow-500" /> Dedicated success manager</li>
                </ul>
                <Link to="/pricing">
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                    Go Elite
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* AI Assistant Preview */}
      <Card className="bg-gradient-to-r from-gray-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="mr-2 h-5 w-5 text-[#006847]" />
            AI Business Assistant
          </CardTitle>
          <CardDescription>
            Get instant answers to your business questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-lg border p-4 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#A4D65E] to-[#006847] flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                <p className="text-sm">
                  Hello! I'm your DowUrk AI Assistant. I can help you with business planning, 
                  grant applications, legal requirements, and marketing strategies. What would you like to explore today?
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">How do I register a business in Louisiana?</Button>
              <Button variant="outline" size="sm">Find grants for my business</Button>
              <Button variant="outline" size="sm">Create a marketing plan</Button>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Link to="/ai-assistant">
              <Button className="bg-[#006847] hover:bg-[#005238]">
                <MessageSquare className="mr-2 h-4 w-4" />
                Open Full AI Assistant
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Success Stories Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5 text-[#A4D65E]" />
            Success Stories
          </CardTitle>
          <CardDescription>
            Louisiana entrepreneurs who've grown with DowUrk AI Hub
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                name: "Marie Johnson",
                business: "Creole Kitchen Delights",
                result: "45% Revenue Growth",
                quote: "The AI coach helped me identify exactly where to focus my efforts."
              },
              {
                name: "James Washington",
                business: "Delta Tech Solutions",
                result: "Launched in 3 Weeks",
                quote: "Grant matching found me $25,000 in funding I didn't know existed."
              },
              {
                name: "Latoya Brown",
                business: "Bayou Threads Boutique",
                result: "3x Customer Growth",
                quote: "My mentor match was perfect - she understood my exact challenges."
              }
            ].map((story, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#A4D65E] to-[#006847] flex items-center justify-center text-white font-bold">
                      {story.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{story.name}</div>
                      <div className="text-xs text-gray-500">{story.business}</div>
                    </div>
                  </div>
                  <Badge className="bg-[#A4D65E] text-black mb-2">{story.result}</Badge>
                  <p className="text-sm text-gray-600 italic">"{story.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-[#006847] to-[#A4D65E] text-white">
        <CardContent className="py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            Join thousands of Louisiana entrepreneurs building their dreams with the DowUrk AI Hub
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/ai-coach">
              <Button size="lg" className="bg-white text-[#006847] hover:bg-white/90">
                Start Free Coaching
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                Create Free Account
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AIHub;
