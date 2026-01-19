import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Zap, Clock, DollarSign, ArrowRight, Play, Pause,
  FileText, Mail, Calendar, Database, MessageSquare,
  TrendingUp, Shield, Users, Sparkles, CheckCircle2,
  ExternalLink, Copy, Check, Settings, BarChart3,
  Bell, RefreshCw, Workflow, Bot, Layers
} from 'lucide-react';

// Automation templates
const AUTOMATION_TEMPLATES = [
  {
    id: 1,
    name: 'Weekly Business Report Generator',
    description: 'Automatically generate and email weekly business reports every Monday morning.',
    category: 'reporting',
    difficulty: 'beginner',
    timeSaved: '2-3 hrs/week',
    tools: ['Google Sheets', 'Make.com', 'ChatGPT API', 'Gmail'],
    triggers: ['Time-based (Weekly)'],
    status: 'popular',
    steps: [
      { step: 1, action: 'Pull data from Google Sheets', tool: 'Google Sheets' },
      { step: 2, action: 'AI analyzes trends and anomalies', tool: 'ChatGPT API' },
      { step: 3, action: 'Format into report template', tool: 'Make.com' },
      { step: 4, action: 'Email report to stakeholders', tool: 'Gmail' }
    ],
    benefits: [
      'Never miss a weekly report',
      'Consistent formatting',
      'AI-powered insights',
      'Delivered before you wake up'
    ]
  },
  {
    id: 2,
    name: 'Customer Inquiry Auto-Responder',
    description: 'Instantly respond to customer inquiries with AI-personalized responses.',
    category: 'customer-service',
    difficulty: 'intermediate',
    timeSaved: '5-10 hrs/week',
    tools: ['Email/Form', 'Zapier', 'ChatGPT API', 'CRM'],
    triggers: ['New email/form submission'],
    status: 'popular',
    steps: [
      { step: 1, action: 'Customer submits inquiry', tool: 'Email/Form' },
      { step: 2, action: 'AI categorizes: Sales/Support/General', tool: 'ChatGPT API' },
      { step: 3, action: 'Generate personalized response', tool: 'ChatGPT API' },
      { step: 4, action: 'Send response & log in CRM', tool: 'Zapier + CRM' }
    ],
    benefits: [
      'Instant response time',
      'Consistent quality',
      '24/7 availability',
      'Automatic CRM logging'
    ]
  },
  {
    id: 3,
    name: 'Social Media Content Pipeline',
    description: 'AI generates, schedules, and posts content across all platforms.',
    category: 'marketing',
    difficulty: 'intermediate',
    timeSaved: '4-6 hrs/week',
    tools: ['Notion', 'ChatGPT API', 'Canva', 'Buffer'],
    triggers: ['Weekly schedule'],
    status: 'new',
    steps: [
      { step: 1, action: 'AI generates content ideas', tool: 'ChatGPT API' },
      { step: 2, action: 'You approve/edit (15 min)', tool: 'Notion' },
      { step: 3, action: 'AI creates posts + image prompts', tool: 'ChatGPT + Canva' },
      { step: 4, action: 'Auto-schedule across platforms', tool: 'Buffer' }
    ],
    benefits: [
      'Consistent posting schedule',
      'Brand-aligned content',
      'Minimal daily effort',
      'Multi-platform reach'
    ]
  },
  {
    id: 4,
    name: 'Grant Deadline Monitor',
    description: 'Never miss a grant deadline with automated tracking and reminders.',
    category: 'grants',
    difficulty: 'beginner',
    timeSaved: 'Priceless',
    tools: ['Notion/Airtable', 'Make.com', 'ChatGPT API', 'Email/SMS'],
    triggers: ['Daily check'],
    status: 'featured',
    steps: [
      { step: 1, action: 'Grant opportunities tracked in database', tool: 'Notion/Airtable' },
      { step: 2, action: 'AI checks eligibility against your profile', tool: 'ChatGPT API' },
      { step: 3, action: 'Send 30/14/7 day reminders', tool: 'Email/SMS' },
      { step: 4, action: 'AI pre-generates application outline', tool: 'ChatGPT API' }
    ],
    benefits: [
      'Never miss deadlines',
      'Pre-screened opportunities',
      'Application head start',
      'Organized tracking'
    ]
  },
  {
    id: 5,
    name: 'Louisiana Compliance Monitor',
    description: 'Stay compliant with Louisiana business requirements automatically.',
    category: 'compliance',
    difficulty: 'beginner',
    timeSaved: 'Avoid penalties',
    tools: ['LA SOS API', 'Calendar', 'Email', 'Document Storage'],
    triggers: ['Weekly check'],
    status: 'featured',
    steps: [
      { step: 1, action: 'Check business registration status', tool: 'LA SOS API' },
      { step: 2, action: 'Monitor annual report due dates', tool: 'Calendar' },
      { step: 3, action: 'Alert 60/30/14 days before deadlines', tool: 'Email' },
      { step: 4, action: 'Provide direct filing links', tool: 'LA SOS' }
    ],
    benefits: [
      'Avoid late fees',
      'Maintain good standing',
      'Peace of mind',
      'Direct filing access'
    ]
  },
  {
    id: 6,
    name: 'Invoice & Payment Tracker',
    description: 'Automatically track invoices, send reminders, and log payments.',
    category: 'finance',
    difficulty: 'intermediate',
    timeSaved: '3-5 hrs/week',
    tools: ['QuickBooks/Stripe', 'Zapier', 'ChatGPT API', 'Email'],
    triggers: ['Invoice created', 'Payment due'],
    status: 'popular',
    steps: [
      { step: 1, action: 'Invoice created in accounting system', tool: 'QuickBooks/Stripe' },
      { step: 2, action: 'Track payment status', tool: 'Zapier' },
      { step: 3, action: 'AI drafts friendly payment reminders', tool: 'ChatGPT API' },
      { step: 4, action: 'Send reminders at 7/14/30 days', tool: 'Email' }
    ],
    benefits: [
      'Faster payments',
      'Professional reminders',
      'Reduced awkwardness',
      'Better cash flow'
    ]
  },
  {
    id: 7,
    name: 'Meeting Notes & Action Items',
    description: 'AI transcribes meetings, extracts action items, and assigns tasks.',
    category: 'productivity',
    difficulty: 'intermediate',
    timeSaved: '2-4 hrs/week',
    tools: ['Zoom/Meet', 'Otter.ai', 'ChatGPT API', 'Notion/Asana'],
    triggers: ['Meeting ends'],
    status: 'new',
    steps: [
      { step: 1, action: 'Record and transcribe meeting', tool: 'Otter.ai' },
      { step: 2, action: 'AI extracts key points & action items', tool: 'ChatGPT API' },
      { step: 3, action: 'Create tasks with deadlines', tool: 'Notion/Asana' },
      { step: 4, action: 'Email summary to attendees', tool: 'Email' }
    ],
    benefits: [
      'Never miss action items',
      'Searchable meeting history',
      'Automatic task creation',
      'Team alignment'
    ]
  },
  {
    id: 8,
    name: 'Lead Qualification Bot',
    description: 'Automatically qualify leads and route to appropriate team members.',
    category: 'sales',
    difficulty: 'advanced',
    timeSaved: '5-8 hrs/week',
    tools: ['Website Form', 'ChatGPT API', 'CRM', 'Email/Slack'],
    triggers: ['New lead submitted'],
    status: 'popular',
    steps: [
      { step: 1, action: 'Lead fills out form', tool: 'Website Form' },
      { step: 2, action: 'AI scores lead (1-100)', tool: 'ChatGPT API' },
      { step: 3, action: 'Route based on score & type', tool: 'CRM' },
      { step: 4, action: 'Notify appropriate team member', tool: 'Email/Slack' }
    ],
    benefits: [
      'Faster response to hot leads',
      'Consistent qualification',
      'Better team allocation',
      'Higher conversion rates'
    ]
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All Automations', icon: Zap },
  { id: 'reporting', name: 'Reporting', icon: BarChart3 },
  { id: 'customer-service', name: 'Customer Service', icon: MessageSquare },
  { id: 'marketing', name: 'Marketing', icon: TrendingUp },
  { id: 'grants', name: 'Grants', icon: DollarSign },
  { id: 'compliance', name: 'Compliance', icon: Shield },
  { id: 'finance', name: 'Finance', icon: DollarSign },
  { id: 'productivity', name: 'Productivity', icon: Clock },
  { id: 'sales', name: 'Sales', icon: Users }
];

const TOOLS_INFO = {
  'Google Sheets': { color: 'bg-green-100 text-green-800', url: 'https://sheets.google.com' },
  'Make.com': { color: 'bg-purple-100 text-purple-800', url: 'https://make.com' },
  'Zapier': { color: 'bg-orange-100 text-orange-800', url: 'https://zapier.com' },
  'ChatGPT API': { color: 'bg-teal-100 text-teal-800', url: 'https://platform.openai.com' },
  'Gmail': { color: 'bg-red-100 text-red-800', url: 'https://gmail.com' },
  'Notion': { color: 'bg-gray-100 text-gray-800', url: 'https://notion.so' },
  'Airtable': { color: 'bg-blue-100 text-blue-800', url: 'https://airtable.com' },
  'Buffer': { color: 'bg-blue-100 text-blue-800', url: 'https://buffer.com' },
  'Canva': { color: 'bg-cyan-100 text-cyan-800', url: 'https://canva.com' },
  'LA SOS API': { color: 'bg-green-100 text-green-800', url: '/business-verification' },
  'CRM': { color: 'bg-indigo-100 text-indigo-800', url: '#' },
  'Email': { color: 'bg-gray-100 text-gray-800', url: '#' },
  'Email/SMS': { color: 'bg-gray-100 text-gray-800', url: '#' },
  'Email/Form': { color: 'bg-gray-100 text-gray-800', url: '#' },
  'Email/Slack': { color: 'bg-gray-100 text-gray-800', url: '#' },
  'Calendar': { color: 'bg-blue-100 text-blue-800', url: '#' },
  'Document Storage': { color: 'bg-yellow-100 text-yellow-800', url: '#' },
  'QuickBooks/Stripe': { color: 'bg-green-100 text-green-800', url: '#' },
  'Zoom/Meet': { color: 'bg-blue-100 text-blue-800', url: '#' },
  'Otter.ai': { color: 'bg-purple-100 text-purple-800', url: 'https://otter.ai' },
  'Notion/Asana': { color: 'bg-gray-100 text-gray-800', url: '#' },
  'Website Form': { color: 'bg-gray-100 text-gray-800', url: '#' },
  'ChatGPT + Canva': { color: 'bg-teal-100 text-teal-800', url: '#' },
  'Zapier + CRM': { color: 'bg-orange-100 text-orange-800', url: '#' },
  'LA SOS': { color: 'bg-green-100 text-green-800', url: '/business-verification' }
};

function AutomationHub() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedAutomation, setExpandedAutomation] = useState(null);

  const filteredAutomations = selectedCategory === 'all' 
    ? AUTOMATION_TEMPLATES 
    : AUTOMATION_TEMPLATES.filter(a => a.category === selectedCategory);

  const featuredAutomations = AUTOMATION_TEMPLATES.filter(a => a.status === 'featured');

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'featured': return <Badge className="bg-[#006847]"><Sparkles className="h-3 w-3 mr-1" />Featured</Badge>;
      case 'popular': return <Badge className="bg-orange-500"><TrendingUp className="h-3 w-3 mr-1" />Popular</Badge>;
      case 'new': return <Badge className="bg-blue-500"><Zap className="h-3 w-3 mr-1" />New</Badge>;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-[#006847] to-[#A4D65E] rounded-xl">
            <Workflow className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold">Automation Hub</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Ready-to-implement automation workflows that save hours every week. 
          No coding required.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Badge className="bg-[#006847]">{AUTOMATION_TEMPLATES.length} Automations</Badge>
          <Badge variant="outline">Save 20+ hrs/week</Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="h-8 w-8 mx-auto text-[#006847] mb-2" />
            <div className="text-3xl font-bold">20+</div>
            <div className="text-gray-500">Hours Saved/Week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Zap className="h-8 w-8 mx-auto text-[#A4D65E] mb-2" />
            <div className="text-3xl font-bold">{AUTOMATION_TEMPLATES.length}</div>
            <div className="text-gray-500">Automations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Bot className="h-8 w-8 mx-auto text-orange-500 mb-2" />
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-gray-500">Always Running</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <DollarSign className="h-8 w-8 mx-auto text-blue-500 mb-2" />
            <div className="text-3xl font-bold">$0</div>
            <div className="text-gray-500">Coding Required</div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Automations */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Sparkles className="h-6 w-6 mr-2 text-[#006847]" />
          Featured for Louisiana Entrepreneurs
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {featuredAutomations.map((automation) => (
            <Card key={automation.id} className="border-2 border-[#A4D65E]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{automation.name}</CardTitle>
                  {getStatusBadge(automation.status)}
                </div>
                <CardDescription>{automation.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={getDifficultyColor(automation.difficulty)}>
                    {automation.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    Saves {automation.timeSaved}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Workflow Steps:</div>
                  {automation.steps.map((step, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <div className="h-6 w-6 rounded-full bg-[#006847] text-white flex items-center justify-center text-xs mr-2">
                        {step.step}
                      </div>
                      <span>{step.action}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-[#006847] hover:bg-[#005238]">
                  View Setup Guide
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="flex flex-wrap justify-start gap-2 h-auto bg-transparent">
          {CATEGORIES.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="data-[state=active]:bg-[#006847] data-[state=active]:text-white"
            >
              <category.icon className="h-4 w-4 mr-2" />
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">
            {selectedCategory === 'all' ? 'All Automations' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
            <Badge className="ml-2">{filteredAutomations.length}</Badge>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAutomations.map((automation) => (
              <Card key={automation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{automation.name}</CardTitle>
                    {getStatusBadge(automation.status)}
                  </div>
                  <CardDescription className="line-clamp-2">{automation.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={getDifficultyColor(automation.difficulty)}>
                      {automation.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {automation.timeSaved}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-2">Tools needed:</div>
                  <div className="flex flex-wrap gap-1">
                    {automation.tools.slice(0, 4).map((tool, idx) => (
                      <Badge 
                        key={idx} 
                        className={TOOLS_INFO[tool]?.color || 'bg-gray-100 text-gray-800'}
                        variant="secondary"
                      >
                        {tool}
                      </Badge>
                    ))}
                  </div>

                  {expandedAutomation === automation.id && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <div>
                        <div className="text-sm font-medium mb-2">Workflow Steps:</div>
                        {automation.steps.map((step, idx) => (
                          <div key={idx} className="flex items-start text-sm mb-2">
                            <div className="h-5 w-5 rounded-full bg-[#006847] text-white flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">
                              {step.step}
                            </div>
                            <div>
                              <span>{step.action}</span>
                              <Badge className="ml-2 text-xs" variant="outline">{step.tool}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Benefits:</div>
                        <ul className="text-sm space-y-1">
                          {automation.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setExpandedAutomation(
                      expandedAutomation === automation.id ? null : automation.id
                    )}
                  >
                    {expandedAutomation === automation.id ? 'Show Less' : 'View Details'}
                  </Button>
                  <Button className="flex-1 bg-[#006847] hover:bg-[#005238]">
                    Setup Guide
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </Tabs>

      {/* Tools Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Layers className="h-5 w-5 mr-2" />
            Recommended Automation Tools
          </CardTitle>
          <CardDescription>
            These no-code tools power most of our automation templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <a href="https://make.com" target="_blank" rel="noopener noreferrer" className="block">
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="pt-6 text-center">
                  <div className="h-12 w-12 mx-auto bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                    <Workflow className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold">Make.com</h3>
                  <p className="text-sm text-gray-500">Advanced automations</p>
                  <Badge className="mt-2" variant="outline">Recommended</Badge>
                </CardContent>
              </Card>
            </a>
            <a href="https://zapier.com" target="_blank" rel="noopener noreferrer" className="block">
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="pt-6 text-center">
                  <div className="h-12 w-12 mx-auto bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                    <Zap className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-bold">Zapier</h3>
                  <p className="text-sm text-gray-500">Simple automations</p>
                  <Badge className="mt-2" variant="outline">Beginner Friendly</Badge>
                </CardContent>
              </Card>
            </a>
            <a href="https://notion.so" target="_blank" rel="noopener noreferrer" className="block">
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="pt-6 text-center">
                  <div className="h-12 w-12 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                    <Database className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="font-bold">Notion</h3>
                  <p className="text-sm text-gray-500">Data & knowledge base</p>
                  <Badge className="mt-2" variant="outline">Free Tier</Badge>
                </CardContent>
              </Card>
            </a>
            <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="block">
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="pt-6 text-center">
                  <div className="h-12 w-12 mx-auto bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                    <Bot className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="font-bold">OpenAI API</h3>
                  <p className="text-sm text-gray-500">AI processing</p>
                  <Badge className="mt-2" variant="outline">Pay-as-you-go</Badge>
                </CardContent>
              </Card>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card className="bg-gradient-to-r from-[#006847] to-[#A4D65E] text-white">
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Ready to Automate?</h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              Start with one automation this week. Most entrepreneurs see ROI within 7 days.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="secondary" size="lg">
                <Play className="mr-2 h-5 w-5" />
                Start with Grant Monitor
              </Button>
              <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
                <MessageSquare className="mr-2 h-5 w-5" />
                Get Setup Help
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AutomationHub;
