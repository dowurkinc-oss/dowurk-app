import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, Copy, Check, Sparkles, Target, DollarSign, 
  Users, TrendingUp, MessageSquare, FileText, Briefcase,
  Megaphone, Calculator, Handshake, BookOpen, Zap,
  Star, Clock, ArrowRight, Filter, Heart
} from 'lucide-react';

// Prompt data organized by category
const PROMPT_CATEGORIES = [
  { id: 'all', name: 'All Prompts', icon: Sparkles },
  { id: 'business', name: 'Business Planning', icon: Briefcase },
  { id: 'grants', name: 'Grants & Funding', icon: DollarSign },
  { id: 'marketing', name: 'Marketing', icon: Megaphone },
  { id: 'finance', name: 'Finance', icon: Calculator },
  { id: 'networking', name: 'Networking', icon: Handshake },
  { id: 'operations', name: 'Operations', icon: Target },
  { id: 'learning', name: 'Learning', icon: BookOpen }
];

const PROMPTS = [
  {
    id: 1,
    title: 'AI Business Operating System',
    category: 'business',
    description: 'Transform AI into your daily business operating system that manages tasks, priorities, and workflows.',
    difficulty: 'intermediate',
    timeSaved: '5-10 hrs/week',
    tags: ['productivity', 'systems', 'planning'],
    isFeatured: true,
    prompt: `You are my AI Business Operating System.

Context:
- My business: [Your business name and type]
- My industry: [Your industry]
- My location: Louisiana
- My current challenges: [List 2-3 challenges]
- My goals for this quarter: [List 2-3 goals]

Your responsibilities:
1. Break down my business tasks into:
   - Automatable (AI can do fully)
   - AI-assisted (AI helps, I decide)
   - Human-only (requires my personal touch)
2. Create a weekly execution plan
3. Identify workflows that can be systemized
4. Suggest specific AI tools for each task
5. Track progress toward quarterly goals

Rules:
- Think in systems, not tasks
- Reduce my time on repetitive work
- Prioritize revenue-generating activities
- Consider Louisiana business regulations

Output format:
- Task classification table
- Suggested AI workflow for each
- Expected time saved per week
- Priority ranking (1-5)`
  },
  {
    id: 2,
    title: 'Louisiana Market Research Analyst',
    category: 'business',
    description: 'Get comprehensive market research specific to Louisiana markets and your industry.',
    difficulty: 'beginner',
    timeSaved: '3-5 hrs/project',
    tags: ['research', 'market analysis', 'louisiana'],
    isFeatured: true,
    prompt: `You are an AI market research analyst for Louisiana small businesses.

Research the following for my business:
- Business type: [Your business type]
- Target market: [Your target customers]
- Location: [Your Louisiana parish/city]

Output in MARKDOWN with these sections:

## Market Overview
- Market size in Louisiana
- Growth trends
- Key statistics

## Customer Analysis
- Demographics
- Pain points
- Buying behavior

## Competitor Landscape
- Top 5 local competitors
- Their strengths/weaknesses
- Gaps I can fill

## Opportunities
- Underserved segments
- Emerging trends
- Partnership possibilities

## Action Items
- 3 immediate actions
- 3 medium-term strategies
- Resources needed

Rules:
- Be specific to Louisiana market
- Include data where possible
- Focus on actionable insights`
  },
  {
    id: 3,
    title: 'Grant Application Writer',
    category: 'grants',
    description: 'Generate compelling grant applications tailored to Louisiana small business grants.',
    difficulty: 'advanced',
    timeSaved: '8-15 hrs/application',
    tags: ['grants', 'funding', 'writing'],
    isFeatured: true,
    prompt: `You are an expert grant writer specializing in Louisiana small business grants.

I need help with:
- Grant name: [Grant name]
- My business: [Business description]
- Grant requirements: [Paste requirements]

Create a compelling grant application that:

1. **Executive Summary** (250 words)
   - Clear problem statement
   - Our unique solution
   - Expected impact
   - Funding request

2. **Business Description** (500 words)
   - Company background
   - Products/services
   - Market position
   - Team qualifications

3. **Project Narrative** (750 words)
   - Specific goals
   - Implementation plan
   - Timeline with milestones
   - Success metrics

4. **Budget Justification** (300 words)
   - Line item explanations
   - Cost reasonableness
   - Matching funds (if applicable)

5. **Community Impact** (400 words)
   - Jobs created
   - Economic impact
   - Community benefit
   - Louisiana-specific impact

Rules:
- Use active voice
- Include specific numbers
- Align with grant criteria
- Highlight Louisiana connection
- Be compelling but honest`
  },
  {
    id: 4,
    title: 'Social Media Content Generator',
    category: 'marketing',
    description: 'Create a full week of social media content tailored to your Louisiana business.',
    difficulty: 'beginner',
    timeSaved: '4-6 hrs/week',
    tags: ['social media', 'content', 'marketing'],
    isFeatured: false,
    prompt: `You are a social media strategist for Louisiana small businesses.

Create a week of content for:
- Business: [Your business]
- Platforms: [Instagram, Facebook, LinkedIn, etc.]
- Brand voice: [Professional/Casual/Friendly/etc.]
- Target audience: [Your customers]

Generate for each day:

## Monday - Educational
- Post text (150 words max)
- Hashtags (10 relevant)
- Best posting time
- Image suggestion

## Tuesday - Behind the Scenes
- Post text
- Story ideas (3)
- Engagement prompt

## Wednesday - Customer Spotlight
- Template for featuring customers
- Questions to ask them
- How to repurpose testimonials

## Thursday - Industry News/Tips
- 3 topic ideas
- Post templates
- Link suggestions

## Friday - Promotional
- Soft sell approach
- Call-to-action options
- Special offer ideas

## Weekend - Community
- Louisiana local content ideas
- Community engagement posts
- Event tie-ins

Include:
- Louisiana-specific hashtags
- Local event tie-ins
- Seasonal relevance`
  },
  {
    id: 5,
    title: 'Financial Health Analyzer',
    category: 'finance',
    description: 'Get a comprehensive analysis of your business finances with actionable recommendations.',
    difficulty: 'intermediate',
    timeSaved: '2-4 hrs/month',
    tags: ['finance', 'analysis', 'planning'],
    isFeatured: false,
    prompt: `You are a financial analyst for small businesses.

Analyze my business finances:
- Monthly revenue: $[amount]
- Monthly expenses: $[amount]
- Top expense categories: [List them]
- Current cash reserves: $[amount]
- Outstanding receivables: $[amount]

Provide:

## Financial Health Score
- Score out of 100
- Key factors affecting score
- Comparison to industry benchmarks

## Cash Flow Analysis
- Current runway (months)
- Projected cash flow (3 months)
- Warning signs to watch

## Cost Optimization
- Top 3 areas to reduce costs
- Estimated savings
- Implementation difficulty

## Revenue Opportunities
- Pricing optimization suggestions
- New revenue stream ideas
- Upsell/cross-sell opportunities

## Action Plan
- Immediate actions (this week)
- Short-term (this month)
- Medium-term (this quarter)

## Louisiana-Specific
- Tax considerations
- Available incentives
- Compliance requirements

Format as clear tables and bullet points.`
  },
  {
    id: 6,
    title: 'Networking Strategy Builder',
    category: 'networking',
    description: 'Build a strategic networking plan with templates for outreach and follow-up.',
    difficulty: 'beginner',
    timeSaved: '3-5 hrs/month',
    tags: ['networking', 'connections', 'outreach'],
    isFeatured: false,
    prompt: `You are a networking strategist for Louisiana entrepreneurs.

My profile:
- Business: [Your business]
- Industry: [Your industry]
- Goals: [What you want from networking]
- Location: [Your Louisiana city/parish]
- Time available: [Hours per week for networking]

Create a networking strategy:

## Ideal Connection Profile
- Who should I connect with?
- What value can I offer them?
- What value can they offer me?

## Local Opportunities
- Louisiana business organizations to join
- Events to attend (monthly)
- Online communities

## Outreach Templates
- LinkedIn connection request
- Email introduction
- Follow-up message
- Collaboration proposal

## Conversation Starters
- 5 questions to ask
- 5 ways to offer value
- How to ask for referrals

## Weekly Networking Plan
- Monday: [Activity]
- Tuesday: [Activity]
- Wednesday: [Activity]
- Thursday: [Activity]
- Friday: [Activity]

## Success Metrics
- Connections per week target
- Meetings per month target
- Referrals per quarter target`
  },
  {
    id: 7,
    title: 'Grant Eligibility Checker',
    category: 'grants',
    description: 'Analyze your eligibility for specific grants and get recommendations to strengthen your application.',
    difficulty: 'intermediate',
    timeSaved: '2-3 hrs/grant',
    tags: ['grants', 'eligibility', 'analysis'],
    isFeatured: false,
    prompt: `You are a grant eligibility specialist for Louisiana businesses.

Analyze my eligibility for this grant:
- Grant name: [Grant name]
- Grant criteria: [Paste eligibility requirements]
- My business details:
  - Business type: [LLC, Corporation, etc.]
  - Years in operation: [Number]
  - Annual revenue: [Range]
  - Number of employees: [Number]
  - Industry: [Your industry]
  - Location: [Louisiana parish]
  - Certifications: [Any certifications]

Provide:

## Eligibility Score
- Overall score: X/100
- Confidence level: High/Medium/Low

## Criteria Match Analysis
| Requirement | Your Status | Match |
|-------------|-------------|-------|
| [Criterion] | [Your status] | ✅/❌ |

## Strengths
- What makes you a strong candidate
- Unique advantages to highlight

## Gaps to Address
- Missing requirements
- How to address each gap
- Timeline to become eligible

## Application Strategy
- Key points to emphasize
- Supporting documents needed
- Common mistakes to avoid

## Alternative Grants
- Similar grants you may qualify for
- Louisiana-specific alternatives`
  },
  {
    id: 8,
    title: 'Business Plan Generator',
    category: 'business',
    description: 'Generate a comprehensive business plan outline with Louisiana-specific considerations.',
    difficulty: 'advanced',
    timeSaved: '10-20 hrs/plan',
    tags: ['business plan', 'planning', 'strategy'],
    isFeatured: false,
    prompt: `You are a business planning consultant specializing in Louisiana businesses.

Create a business plan for:
- Business idea: [Your business idea]
- Industry: [Your industry]
- Target market: [Your target customers]
- Location: [Louisiana city/parish]
- Initial investment: [Budget range]

Generate a comprehensive business plan:

## 1. Executive Summary
- Business concept
- Mission statement
- Key success factors
- Financial highlights
- Funding request

## 2. Company Description
- Business structure
- Location advantages
- Louisiana business benefits
- Short and long-term objectives

## 3. Market Analysis
- Industry overview
- Louisiana market specifics
- Target market demographics
- Competitor analysis
- Market trends

## 4. Organization & Management
- Organizational structure
- Management team
- Advisory board suggestions
- Hiring plan

## 5. Products/Services
- Description
- Pricing strategy
- Competitive advantages
- Future development

## 6. Marketing Strategy
- Brand positioning
- Marketing channels
- Customer acquisition
- Retention strategies

## 7. Financial Projections
- Startup costs
- Revenue projections (3 years)
- Break-even analysis
- Cash flow projections

## 8. Funding Requirements
- Amount needed
- Use of funds
- Potential sources
- Louisiana-specific funding

## 9. Appendix Checklist
- Documents to prepare
- Licenses needed
- Louisiana requirements`
  },
  {
    id: 9,
    title: 'Email Marketing Campaign Creator',
    category: 'marketing',
    description: 'Create a complete email marketing campaign with subject lines, content, and sequences.',
    difficulty: 'intermediate',
    timeSaved: '3-5 hrs/campaign',
    tags: ['email', 'marketing', 'campaigns'],
    isFeatured: false,
    prompt: `You are an email marketing specialist for small businesses.

Create an email campaign for:
- Business: [Your business]
- Campaign goal: [Sales/Engagement/Announcement/etc.]
- Target audience: [Describe your subscribers]
- Campaign length: [Number of emails]
- Tone: [Professional/Friendly/Urgent/etc.]

Generate:

## Campaign Overview
- Campaign name
- Goal and KPIs
- Target segment
- Timeline

## Email 1: [Purpose]
**Subject Line Options (3):**
1. 
2. 
3. 

**Preview Text:**

**Email Body:**
[Full email content]

**CTA Button:**

**Send Time:**

## Email 2: [Purpose]
[Same format]

## Email 3: [Purpose]
[Same format]

## A/B Testing Suggestions
- Elements to test
- How to measure success

## Automation Triggers
- When to send each email
- Behavioral triggers
- Follow-up sequences

## Performance Metrics to Track
- Open rate targets
- Click rate targets
- Conversion goals`
  },
  {
    id: 10,
    title: 'Customer Persona Builder',
    category: 'marketing',
    description: 'Create detailed customer personas to guide your marketing and product decisions.',
    difficulty: 'beginner',
    timeSaved: '2-3 hrs/persona',
    tags: ['customers', 'personas', 'research'],
    isFeatured: false,
    prompt: `You are a customer research specialist.

Create detailed customer personas for:
- Business: [Your business]
- Products/Services: [What you offer]
- Current customers: [Describe who buys from you]
- Location focus: Louisiana

Generate 3 customer personas:

## Persona 1: [Name]

### Demographics
- Age range:
- Gender:
- Location (Louisiana specific):
- Income level:
- Education:
- Occupation:
- Family status:

### Psychographics
- Values:
- Interests:
- Lifestyle:
- Personality traits:

### Behavior
- Where they spend time online:
- How they make purchasing decisions:
- Preferred communication channels:
- Shopping habits:

### Pain Points
- Top 3 challenges:
- Frustrations with current solutions:
- Unmet needs:

### Goals
- What they want to achieve:
- How your product helps:
- Success looks like:

### Buying Journey
- Awareness stage triggers:
- Consideration factors:
- Decision criteria:
- Post-purchase expectations:

### Marketing Approach
- Best channels to reach them:
- Messaging that resonates:
- Content they engage with:
- Offers that convert:

[Repeat for Personas 2 and 3]

## Persona Comparison Table
| Factor | Persona 1 | Persona 2 | Persona 3 |
|--------|-----------|-----------|-----------|`
  },
  {
    id: 11,
    title: 'Operations SOP Generator',
    category: 'operations',
    description: 'Create standard operating procedures for any business process.',
    difficulty: 'intermediate',
    timeSaved: '4-6 hrs/SOP',
    tags: ['operations', 'procedures', 'documentation'],
    isFeatured: false,
    prompt: `You are an operations consultant specializing in small business efficiency.

Create an SOP for:
- Process name: [Name of the process]
- Business: [Your business]
- Who performs this: [Role/position]
- Frequency: [How often this is done]
- Current pain points: [What's not working]

Generate a comprehensive SOP:

## SOP: [Process Name]

### Overview
- Purpose:
- Scope:
- Owner:
- Last updated:

### Prerequisites
- Required access/permissions:
- Tools needed:
- Knowledge required:
- Time estimate:

### Step-by-Step Procedure

#### Step 1: [Action]
- **What**: [Detailed description]
- **How**: [Specific instructions]
- **Tools**: [Software/equipment needed]
- **Time**: [Estimated duration]
- **Tips**: [Best practices]
- **Common errors**: [What to avoid]

[Continue for all steps]

### Quality Checklist
- [ ] [Checkpoint 1]
- [ ] [Checkpoint 2]
- [ ] [Checkpoint 3]

### Troubleshooting
| Issue | Cause | Solution |
|-------|-------|----------|

### Metrics & KPIs
- Success criteria:
- How to measure:
- Target benchmarks:

### Training Notes
- Key points for new team members:
- Common questions:
- Practice scenarios:

### Version History
| Date | Changes | Author |
|------|---------|--------|`
  },
  {
    id: 12,
    title: 'Competitor Analysis Framework',
    category: 'business',
    description: 'Conduct a thorough competitive analysis with actionable insights.',
    difficulty: 'intermediate',
    timeSaved: '4-8 hrs/analysis',
    tags: ['competitors', 'analysis', 'strategy'],
    isFeatured: false,
    prompt: `You are a competitive intelligence analyst.

Analyze competitors for:
- My business: [Your business]
- My industry: [Your industry]
- My location: [Louisiana city/parish]
- My competitors: [List 3-5 competitors]

Provide comprehensive analysis:

## Industry Overview
- Market size
- Growth rate
- Key trends
- Louisiana-specific factors

## Competitor Profiles

### Competitor 1: [Name]
**Basic Info:**
- Website:
- Location:
- Years in business:
- Size estimate:

**Products/Services:**
- What they offer:
- Pricing:
- Unique features:

**Strengths:**
- 

**Weaknesses:**
- 

**Marketing:**
- Channels used:
- Messaging:
- Content strategy:

**Customer Reviews:**
- Common praise:
- Common complaints:

[Repeat for each competitor]

## Competitive Matrix
| Factor | You | Comp 1 | Comp 2 | Comp 3 |
|--------|-----|--------|--------|--------|
| Price | | | | |
| Quality | | | | |
| Service | | | | |
| Location | | | | |
| Online Presence | | | | |

## Gap Analysis
- Underserved customer needs:
- Missing product features:
- Service gaps:
- Geographic opportunities:

## Strategic Recommendations
1. Quick wins:
2. Medium-term strategies:
3. Long-term positioning:

## Monitoring Plan
- What to track:
- How often:
- Tools to use:`
  },
  {
    id: 13,
    title: 'Learning Path Creator',
    category: 'learning',
    description: 'Create a personalized learning path for any skill or topic.',
    difficulty: 'beginner',
    timeSaved: '2-4 hrs/path',
    tags: ['learning', 'skills', 'development'],
    isFeatured: false,
    prompt: `You are a learning and development specialist.

Create a learning path for:
- Skill to learn: [What you want to learn]
- Current level: [Beginner/Intermediate/Advanced]
- Time available: [Hours per week]
- Learning style: [Visual/Reading/Hands-on/etc.]
- Goal: [What you want to achieve]
- Timeline: [Weeks/months to complete]

Generate a comprehensive learning path:

## Learning Path: [Skill Name]

### Overview
- Total duration:
- Weekly commitment:
- Prerequisites:
- End goal:

### Phase 1: Foundation (Weeks 1-X)

**Learning Objectives:**
- 

**Resources:**
| Type | Resource | Time | Cost |
|------|----------|------|------|
| Course | | | |
| Book | | | |
| Video | | | |

**Practice Projects:**
1. 

**Milestones:**
- [ ] 

### Phase 2: Application (Weeks X-Y)
[Same format]

### Phase 3: Mastery (Weeks Y-Z)
[Same format]

### Weekly Schedule Template
| Day | Activity | Time |
|-----|----------|------|
| Mon | | |
| Tue | | |
| Wed | | |
| Thu | | |
| Fri | | |
| Weekend | | |

### Assessment Checkpoints
- Week X: [What you should know]
- Week Y: [Skills to demonstrate]
- Week Z: [Final assessment]

### Community & Support
- Online communities:
- Local Louisiana resources:
- Mentorship opportunities:

### Application to Your Business
- How to apply this skill:
- Expected impact:
- ROI timeline:`
  },
  {
    id: 14,
    title: 'Pitch Deck Outline Generator',
    category: 'business',
    description: 'Create a compelling pitch deck outline for investors or partners.',
    difficulty: 'advanced',
    timeSaved: '5-10 hrs/deck',
    tags: ['pitch', 'investors', 'presentation'],
    isFeatured: false,
    prompt: `You are a pitch deck consultant who has helped startups raise millions.

Create a pitch deck outline for:
- Business: [Your business]
- Stage: [Idea/Seed/Growth]
- Asking for: [Investment amount or partnership]
- Audience: [Investors/Partners/Grants]
- Unique angle: [What makes you different]

Generate a 12-slide pitch deck:

## Slide 1: Title
- Company name
- Tagline (one sentence)
- Your name and title
- Contact info

## Slide 2: Problem
- The pain point (be specific)
- Who experiences it
- Current solutions and why they fail
- Cost of the problem

## Slide 3: Solution
- Your solution (simple explanation)
- How it works
- Key benefits
- "Aha" moment

## Slide 4: Market Opportunity
- TAM, SAM, SOM
- Louisiana market specifics
- Growth trends
- Why now

## Slide 5: Product/Service
- Features and benefits
- Screenshots/visuals
- Competitive advantages
- Roadmap

## Slide 6: Business Model
- How you make money
- Pricing strategy
- Unit economics
- Revenue streams

## Slide 7: Traction
- Key metrics
- Growth rate
- Customer testimonials
- Milestones achieved

## Slide 8: Competition
- Competitive landscape
- Your positioning
- Sustainable advantages
- Barriers to entry

## Slide 9: Team
- Founders and key team
- Relevant experience
- Advisors
- Hiring plans

## Slide 10: Financials
- Revenue projections (3 years)
- Key assumptions
- Path to profitability
- Use of funds

## Slide 11: The Ask
- Amount raising
- Terms (if applicable)
- Use of funds breakdown
- Timeline

## Slide 12: Vision
- Where you're headed
- Impact you'll make
- Call to action
- Contact info

## Speaker Notes
[Key talking points for each slide]

## Appendix Slides
- Detailed financials
- Technical details
- Additional traction data`
  },
  {
    id: 15,
    title: 'Customer Service Script Generator',
    category: 'operations',
    description: 'Create professional customer service scripts for common scenarios.',
    difficulty: 'beginner',
    timeSaved: '2-3 hrs/script set',
    tags: ['customer service', 'scripts', 'communication'],
    isFeatured: false,
    prompt: `You are a customer service training specialist.

Create customer service scripts for:
- Business: [Your business]
- Industry: [Your industry]
- Brand voice: [Professional/Friendly/Casual]
- Common issues: [List typical customer concerns]

Generate scripts for these scenarios:

## 1. Greeting/Welcome
**Phone:**

**Email:**

**Chat:**

## 2. Product/Service Inquiry
**Script:**

**Key points to cover:**

**Upsell opportunity:**

## 3. Complaint Handling
**Initial response:**

**Investigation:**

**Resolution options:**

**Follow-up:**

## 4. Refund/Return Request
**Qualifying questions:**

**Approval script:**

**Denial script (with alternatives):**

## 5. Technical Support
**Troubleshooting flow:**

**Escalation criteria:**

**Documentation template:**

## 6. Billing Question
**Verification process:**

**Common explanations:**

**Payment arrangement script:**

## 7. Closing/Thank You
**Satisfaction check:**

**Additional help offer:**

**Closing statement:**

## Response Templates

### Email Templates
**Acknowledgment:**

**Resolution:**

**Follow-up:**

### Chat Quick Responses
[10 common quick responses]

## Escalation Guidelines
- When to escalate:
- How to escalate:
- What to document:

## Quality Checklist
- [ ] Greeted warmly
- [ ] Listened actively
- [ ] Resolved issue
- [ ] Offered additional help
- [ ] Closed professionally`
  }
];

function PromptLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [savedPrompts, setSavedPrompts] = useState([]);

  const filteredPrompts = PROMPTS.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPrompts = PROMPTS.filter(p => p.isFeatured);

  const copyToClipboard = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSavePrompt = (promptId) => {
    setSavedPrompts(prev => 
      prev.includes(promptId) 
        ? prev.filter(id => id !== promptId)
        : [...prev, promptId]
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (categoryId) => {
    const category = PROMPT_CATEGORIES.find(c => c.id === categoryId);
    return category ? category.icon : Sparkles;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-[#006847] to-[#A4D65E] rounded-xl">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold">AI Prompt Library</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Ready-to-use prompts designed specifically for Louisiana entrepreneurs. 
          Copy, customize, and accelerate your business.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Badge className="bg-[#006847]">{PROMPTS.length} Prompts</Badge>
          <Badge variant="outline">{PROMPT_CATEGORIES.length - 1} Categories</Badge>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search prompts by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="flex flex-wrap justify-start gap-2 h-auto bg-transparent">
          {PROMPT_CATEGORIES.map((category) => (
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

        {/* Featured Section (only on All tab) */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Star className="h-6 w-6 mr-2 text-yellow-500" />
              Featured Prompts
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {featuredPrompts.map((prompt) => {
                const CategoryIcon = getCategoryIcon(prompt.category);
                return (
                  <Card key={prompt.id} className="border-2 border-[#A4D65E] hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="p-2 bg-[#006847]/10 rounded-lg">
                          <CategoryIcon className="h-5 w-5 text-[#006847]" />
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mt-2">{prompt.title}</CardTitle>
                      <CardDescription>{prompt.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getDifficultyColor(prompt.difficulty)}>
                          {prompt.difficulty}
                        </Badge>
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Saves {prompt.timeSaved}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="flex-1 bg-[#006847] hover:bg-[#005238]"
                            onClick={() => setSelectedPrompt(prompt)}
                          >
                            View Prompt
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <CategoryIcon className="h-5 w-5 mr-2 text-[#006847]" />
                              {prompt.title}
                            </DialogTitle>
                            <DialogDescription>{prompt.description}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              <Badge className={getDifficultyColor(prompt.difficulty)}>
                                {prompt.difficulty}
                              </Badge>
                              <Badge variant="outline">
                                <Clock className="h-3 w-3 mr-1" />
                                Saves {prompt.timeSaved}
                              </Badge>
                              {prompt.tags.map(tag => (
                                <Badge key={tag} variant="outline">{tag}</Badge>
                              ))}
                            </div>
                            <div className="relative">
                              <Label>Prompt Template</Label>
                              <Textarea
                                value={prompt.prompt}
                                readOnly
                                className="mt-2 min-h-[300px] font-mono text-sm"
                              />
                              <Button
                                size="sm"
                                className="absolute top-8 right-2"
                                onClick={() => copyToClipboard(prompt.prompt, prompt.id)}
                              >
                                {copiedId === prompt.id ? (
                                  <><Check className="h-4 w-4 mr-1" /> Copied!</>
                                ) : (
                                  <><Copy className="h-4 w-4 mr-1" /> Copy</>
                                )}
                              </Button>
                            </div>
                            <Alert>
                              <Zap className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Pro tip:</strong> Replace the bracketed [placeholders] with your specific information for best results.
                              </AlertDescription>
                            </Alert>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleSavePrompt(prompt.id)}
                      >
                        <Heart className={`h-4 w-4 ${savedPrompts.includes(prompt.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* All Prompts Grid */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            {selectedCategory === 'all' ? 'All Prompts' : PROMPT_CATEGORIES.find(c => c.id === selectedCategory)?.name}
            <Badge className="ml-2">{filteredPrompts.length}</Badge>
          </h2>
          
          {filteredPrompts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No prompts found matching your search.</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrompts.map((prompt) => {
                const CategoryIcon = getCategoryIcon(prompt.category);
                return (
                  <Card key={prompt.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="p-2 bg-[#006847]/10 rounded-lg">
                          <CategoryIcon className="h-5 w-5 text-[#006847]" />
                        </div>
                        {prompt.isFeatured && (
                          <Star className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <CardTitle className="text-lg mt-2">{prompt.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{prompt.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getDifficultyColor(prompt.difficulty)}>
                          {prompt.difficulty}
                        </Badge>
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {prompt.timeSaved}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {prompt.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline"
                            className="flex-1"
                            onClick={() => setSelectedPrompt(prompt)}
                          >
                            View & Copy
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <CategoryIcon className="h-5 w-5 mr-2 text-[#006847]" />
                              {prompt.title}
                            </DialogTitle>
                            <DialogDescription>{prompt.description}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              <Badge className={getDifficultyColor(prompt.difficulty)}>
                                {prompt.difficulty}
                              </Badge>
                              <Badge variant="outline">
                                <Clock className="h-3 w-3 mr-1" />
                                Saves {prompt.timeSaved}
                              </Badge>
                              {prompt.tags.map(tag => (
                                <Badge key={tag} variant="outline">{tag}</Badge>
                              ))}
                            </div>
                            <div className="relative">
                              <Label>Prompt Template</Label>
                              <Textarea
                                value={prompt.prompt}
                                readOnly
                                className="mt-2 min-h-[300px] font-mono text-sm"
                              />
                              <Button
                                size="sm"
                                className="absolute top-8 right-2"
                                onClick={() => copyToClipboard(prompt.prompt, prompt.id)}
                              >
                                {copiedId === prompt.id ? (
                                  <><Check className="h-4 w-4 mr-1" /> Copied!</>
                                ) : (
                                  <><Copy className="h-4 w-4 mr-1" /> Copy</>
                                )}
                              </Button>
                            </div>
                            <Alert>
                              <Zap className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Pro tip:</strong> Replace the bracketed [placeholders] with your specific information for best results.
                              </AlertDescription>
                            </Alert>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleSavePrompt(prompt.id)}
                      >
                        <Heart className={`h-4 w-4 ${savedPrompts.includes(prompt.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </Tabs>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-[#006847] to-[#A4D65E] text-white">
        <CardContent className="py-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Want More Prompts?</h2>
          <p className="text-white/90 mb-4">
            Upgrade to Pro for access to 100+ advanced prompts and custom prompt builder.
          </p>
          <Button variant="secondary" size="lg">
            Upgrade to Pro
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default PromptLibrary;
