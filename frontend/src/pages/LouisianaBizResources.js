import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Building2, DollarSign, GraduationCap, FileText, Bot, TrendingUp, Users, Landmark } from 'lucide-react';

function LouisianaBizResources() {
  const stateResources = [
    {
      name: 'Louisiana Economic Development (LED)',
      description: 'State agency providing business incentives, financing programs, and economic development resources.',
      url: 'https://www.opportunitylouisiana.com/',
      category: 'State Agency'
    },
    {
      name: 'Louisiana Small Business Development Center (LSBDC)',
      description: 'Free consulting and low-cost training for Louisiana small businesses.',
      url: 'https://www.lsbdc.org/',
      category: 'Business Support'
    },
    {
      name: 'Louisiana Secretary of State - Business Services',
      description: 'Business registration, filings, and commercial search services.',
      url: 'https://www.sos.la.gov/BusinessServices',
      category: 'Registration'
    },
    {
      name: 'Louisiana Workforce Commission',
      description: 'Employment services, workforce training, and unemployment resources.',
      url: 'https://www.laworks.net/',
      category: 'Workforce'
    },
    {
      name: 'Louisiana Department of Revenue',
      description: 'Tax registration, filing, and compliance information for Louisiana businesses.',
      url: 'https://revenue.louisiana.gov/',
      category: 'Tax & Compliance'
    },
    {
      name: 'Louisiana Procurement Technical Assistance Center (PTAC)',
      description: 'Help businesses compete for government contracts.',
      url: 'https://www.laptac.org/',
      category: 'Government Contracting'
    },
    {
      name: 'Greater New Orleans, Inc.',
      description: 'Regional economic development alliance for the 10-parish New Orleans metro area.',
      url: 'https://gnoinc.org/',
      category: 'Regional Development'
    },
    {
      name: 'Louisiana Certified Development Company (LCDC)',
      description: 'SBA 504 loan programs for Louisiana small businesses.',
      url: 'https://www.lcdcloans.com/',
      category: 'Financing'
    },
    {
      name: 'Louisiana Business & Technology Center',
      description: 'Incubator supporting technology and innovation-based startups.',
      url: 'https://www.lbtc.org/',
      category: 'Incubator'
    },
    {
      name: 'Louisiana Department of Insurance',
      description: 'Business insurance licensing and compliance resources.',
      url: 'https://www.ldi.la.gov/',
      category: 'Insurance & Licensing'
    }
  ];

  const federalResources = [
    {
      name: 'U.S. Small Business Administration (SBA)',
      description: 'Federal agency providing loans, counseling, contracting, and disaster assistance.',
      url: 'https://www.sba.gov/',
      category: 'Federal Agency'
    },
    {
      name: 'SBA - Louisiana District Office',
      description: 'Local SBA office serving Louisiana businesses.',
      url: 'https://www.sba.gov/offices/district/la/new-orleans',
      category: 'Federal Agency'
    },
    {
      name: 'SCORE Louisiana',
      description: 'Free business mentoring and workshops from experienced entrepreneurs.',
      url: 'https://www.score.org/louisiana',
      category: 'Mentoring'
    },
    {
      name: 'Minority Business Development Agency (MBDA)',
      description: 'Federal agency promoting growth of minority-owned businesses.',
      url: 'https://www.mbda.gov/',
      category: 'Minority Business'
    },
    {
      name: 'U.S. Department of Commerce',
      description: 'Trade assistance, economic data, and business development programs.',
      url: 'https://www.commerce.gov/',
      category: 'Federal Agency'
    },
    {
      name: 'IRS Small Business and Self-Employed',
      description: 'Tax information, forms, and resources for small businesses.',
      url: 'https://www.irs.gov/businesses/small-businesses-self-employed',
      category: 'Tax Resources'
    },
    {
      name: 'USA.gov Business',
      description: 'Central portal for all federal government business resources.',
      url: 'https://www.usa.gov/business',
      category: 'Federal Portal'
    },
    {
      name: 'Export-Import Bank of the United States',
      description: 'Export financing and credit insurance for U.S. businesses.',
      url: 'https://www.exim.gov/',
      category: 'Export Finance'
    },
    {
      name: 'U.S. Patent and Trademark Office',
      description: 'Trademark and patent registration and protection.',
      url: 'https://www.uspto.gov/',
      category: 'Intellectual Property'
    },
    {
      name: 'SAM.gov',
      description: 'Official U.S. government system for federal contracting opportunities.',
      url: 'https://www.sam.gov/',
      category: 'Government Contracting'
    }
  ];

  const aiEvolutionResources = [
    {
      name: 'OpenAI',
      description: 'ChatGPT, GPT-4, and AI tools for business automation and content creation.',
      url: 'https://openai.com/',
      category: 'AI Platform'
    },
    {
      name: 'Google AI',
      description: 'Gemini, Bard, and AI solutions for business intelligence and productivity.',
      url: 'https://ai.google/',
      category: 'AI Platform'
    },
    {
      name: 'Anthropic Claude',
      description: 'Advanced AI assistant for business tasks, research, and analysis.',
      url: 'https://www.anthropic.com/',
      category: 'AI Platform'
    },
    {
      name: 'Microsoft Copilot',
      description: 'AI-powered assistant integrated across Microsoft 365 for business.',
      url: 'https://copilot.microsoft.com/',
      category: 'Business AI'
    },
    {
      name: 'Canva AI',
      description: 'AI-powered design tools for marketing materials and branding.',
      url: 'https://www.canva.com/ai-image-generator/',
      category: 'Design AI'
    },
    {
      name: 'Jasper AI',
      description: 'AI content creation platform for marketing copy and blog posts.',
      url: 'https://www.jasper.ai/',
      category: 'Content AI'
    },
    {
      name: 'Notion AI',
      description: 'AI-enhanced workspace for business documentation and collaboration.',
      url: 'https://www.notion.so/product/ai',
      category: 'Productivity AI'
    },
    {
      name: 'Zapier AI',
      description: 'Automate business workflows and connect apps with AI assistance.',
      url: 'https://zapier.com/ai',
      category: 'Automation AI'
    },
    {
      name: 'Salesforce Einstein',
      description: 'AI-powered CRM for customer insights and sales automation.',
      url: 'https://www.salesforce.com/artificial-intelligence/',
      category: 'CRM AI'
    },
    {
      name: 'HubSpot AI',
      description: 'Marketing, sales, and service automation with AI capabilities.',
      url: 'https://www.hubspot.com/artificial-intelligence',
      category: 'Marketing AI'
    }
  ];

  const categoryIcon = {
    'State Agency': <Landmark className="h-5 w-5" />,
    'Business Support': <Users className="h-5 w-5" />,
    'Federal Agency': <Building2 className="h-5 w-5" />,
    'Financing': <DollarSign className="h-5 w-5" />,
    'AI Platform': <Bot className="h-5 w-5" />,
    'Mentoring': <GraduationCap className="h-5 w-5" />,
    'Registration': <FileText className="h-5 w-5" />
  };

  return (
    <div className="space-y-12">
      {/* Hero */}
      <motion.section
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-bold">
          <span className="bg-gradient-to-r from-[#A4D65E] to-[#006847] bg-clip-text text-transparent">
            Louisiana Business Resources
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive directory of state, federal, and AI resources to help Louisiana entrepreneurs succeed
        </p>
      </motion.section>

      {/* Louisiana State Resources */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3">
          <Landmark className="h-8 w-8 text-[#006847]" />
          <h2 className="text-3xl font-bold">Louisiana State Resources</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stateResources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge className="mb-2 bg-[#A4D65E] text-black">{resource.category}</Badge>
                      <CardTitle className="text-lg">{resource.name}</CardTitle>
                    </div>
                    {categoryIcon[resource.category] && (
                      <div className="text-[#006847]">{categoryIcon[resource.category]}</div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#006847] hover:text-[#A4D65E] font-semibold text-sm"
                  >
                    Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Federal Resources */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-[#006847]" />
          <h2 className="text-3xl font-bold">Federal Government Resources</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {federalResources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge className="mb-2 bg-blue-500 text-white">{resource.category}</Badge>
                      <CardTitle className="text-lg">{resource.name}</CardTitle>
                    </div>
                    {categoryIcon[resource.category] && (
                      <div className="text-[#006847]">{categoryIcon[resource.category]}</div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#006847] hover:text-[#A4D65E] font-semibold text-sm"
                  >
                    Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Evolution */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3">
          <Bot className="h-8 w-8 text-[#006847]" />
          <h2 className="text-3xl font-bold">AI Evolution for Business</h2>
        </div>
        <p className="text-gray-600 max-w-3xl">
          Artificial Intelligence is transforming how businesses operate. These platforms can help you automate tasks, 
          create content, analyze data, and scale your operations efficiently.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiEvolutionResources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-purple-400">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge className="mb-2 bg-purple-500 text-white">{resource.category}</Badge>
                      <CardTitle className="text-lg">{resource.name}</CardTitle>
                    </div>
                    <Bot className="h-5 w-5 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold text-sm"
                  >
                    Explore AI Tool <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#006847] to-[#005a3c] rounded-2xl p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Need Help Navigating These Resources?</h2>
        <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
          DowUrk Inc. provides guidance and support to help you access and utilize these valuable business resources.
        </p>
        <a href="/contact" className="inline-block bg-white text-[#006847] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
          Contact Us for Assistance
        </a>
      </section>
    </div>
  );
}

export default LouisianaBizResources;