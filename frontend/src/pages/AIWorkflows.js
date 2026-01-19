import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, Code, BookOpen, ArrowRight, ArrowDown,
  Sparkles, Clock, CheckCircle2, ExternalLink, Zap,
  PenTool, Search, Bot, Eye, Layers, Target,
  Lightbulb, Rocket, GraduationCap, Brain, Workflow
} from 'lucide-react';

// Workflow Pipeline Data
const WORKFLOWS = {
  content: {
    id: 'content',
    name: 'Content Production Line',
    tagline: 'From research to publish in record time',
    description: 'A systematic approach to creating high-quality content using AI at every stage.',
    savings: '60-70%',
    savingsLabel: 'on research-heavy content',
    color: 'from-blue-500 to-cyan-500',
    icon: FileText,
    bestFor: ['Blog posts', 'Grant narratives', 'Business plans', 'Reports', 'Marketing copy'],
    steps: [
      {
        step: 1,
        name: 'Research',
        tool: 'Perplexity',
        toolUrl: 'https://perplexity.ai',
        description: 'Deep research with citations and fact-checking',
        duration: '15-30 min',
        tips: [
          'Use specific, detailed queries',
          'Ask for sources and citations',
          'Cross-reference multiple searches',
          'Save key findings to a document'
        ],
        prompt: `Research [TOPIC] for a Louisiana small business context.

Include:
- Key statistics and data
- Louisiana-specific information
- Recent trends (2024-2025)
- Expert opinions
- Actionable insights

Provide sources for all claims.`
      },
      {
        step: 2,
        name: 'Draft with Style',
        tool: 'Claude',
        toolUrl: 'https://claude.ai',
        description: 'Long-form writing with your brand voice',
        duration: '20-40 min',
        tips: [
          'Provide your style guide or examples',
          'Include target audience details',
          'Specify tone and format',
          'Ask for multiple variations'
        ],
        prompt: `You are a content writer for [BUSINESS NAME], a Louisiana-based [INDUSTRY] business.

Style Guide:
- Tone: [Professional/Friendly/Authoritative]
- Audience: [Target audience]
- Voice: [Brand voice characteristics]

Using this research:
[PASTE RESEARCH FROM STEP 1]

Write a [CONTENT TYPE] that:
1. Hooks the reader immediately
2. Provides actionable value
3. Includes Louisiana-specific references
4. Ends with a clear call-to-action

Length: [WORD COUNT]`
      },
      {
        step: 3,
        name: 'Technical Refinement',
        tool: 'ChatGPT',
        toolUrl: 'https://chat.openai.com',
        description: 'Polish grammar, SEO, and technical accuracy',
        duration: '10-20 min',
        tips: [
          'Check for factual accuracy',
          'Optimize for SEO keywords',
          'Improve readability scores',
          'Add relevant links'
        ],
        prompt: `Review and improve this content:

[PASTE DRAFT FROM STEP 2]

Check for:
1. Grammar and spelling errors
2. Factual accuracy
3. SEO optimization for keywords: [KEYWORDS]
4. Readability (aim for 8th grade level)
5. Logical flow and transitions

Suggest improvements and provide the revised version.`
      },
      {
        step: 4,
        name: 'Final Polish',
        tool: 'Your Review',
        toolUrl: null,
        description: 'Human touch and brand alignment check',
        duration: '10-15 min',
        tips: [
          'Read aloud for flow',
          'Check brand voice consistency',
          'Verify all facts and links',
          'Add personal anecdotes if relevant'
        ],
        prompt: null
      }
    ]
  },
  coding: {
    id: 'coding',
    name: 'Coding Sprint Pipeline',
    tagline: 'Build faster with AI pair programming',
    description: 'Accelerate development with AI-assisted planning, coding, and review.',
    savings: '40-50%',
    savingsLabel: 'on development time',
    color: 'from-purple-500 to-pink-500',
    icon: Code,
    bestFor: ['Website updates', 'App features', 'Automations', 'Scripts', 'Integrations'],
    steps: [
      {
        step: 1,
        name: 'Plan Mode',
        tool: 'Cursor Composer',
        toolUrl: 'https://cursor.sh',
        description: 'AI-assisted project planning and architecture',
        duration: '15-30 min',
        tips: [
          'Describe the full project scope',
          'Let AI suggest file structure',
          'Review and refine the plan',
          'Break into manageable tasks'
        ],
        prompt: `I need to build [PROJECT DESCRIPTION].

Requirements:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Tech stack: [Your tech stack]

Please:
1. Suggest the optimal file structure
2. Break this into development phases
3. Identify potential challenges
4. Recommend best practices

Start with a detailed plan before any code.`
      },
      {
        step: 2,
        name: 'Parallel Features',
        tool: 'Multi-Agents',
        toolUrl: 'https://cursor.sh',
        description: 'Build multiple features simultaneously',
        duration: '1-4 hours',
        tips: [
          'Work on independent features in parallel',
          'Use consistent naming conventions',
          'Keep components modular',
          'Document as you build'
        ],
        prompt: `Implement [FEATURE NAME] based on this plan:

[PASTE PLAN FROM STEP 1]

Requirements for this feature:
- [Specific requirement 1]
- [Specific requirement 2]

Follow these conventions:
- [Coding convention 1]
- [Coding convention 2]

Include:
- Error handling
- Input validation
- Comments for complex logic`
      },
      {
        step: 3,
        name: 'Testing',
        tool: 'Browser Tool',
        toolUrl: null,
        description: 'Automated and manual testing',
        duration: '30-60 min',
        tips: [
          'Test all user flows',
          'Check edge cases',
          'Test on multiple devices',
          'Verify error handling'
        ],
        prompt: `Generate test cases for [FEATURE]:

Test scenarios needed:
1. Happy path - normal usage
2. Edge cases - boundary conditions
3. Error cases - invalid inputs
4. Integration - with other features

For each test case, provide:
- Test name
- Steps to reproduce
- Expected result
- Priority (High/Medium/Low)`
      },
      {
        step: 4,
        name: 'Code Review',
        tool: 'GitHub Copilot',
        toolUrl: 'https://github.com/features/copilot',
        description: 'AI-assisted code review and optimization',
        duration: '15-30 min',
        tips: [
          'Check for security issues',
          'Look for performance optimizations',
          'Ensure code readability',
          'Verify best practices'
        ],
        prompt: `Review this code for:

[PASTE CODE]

Check for:
1. Security vulnerabilities
2. Performance issues
3. Code readability
4. Best practices
5. Potential bugs

Suggest specific improvements with code examples.`
      }
    ]
  },
  learning: {
    id: 'learning',
    name: 'Learning Accelerator',
    tagline: 'Master any skill faster with AI',
    description: 'Transform documents and courses into personalized learning systems.',
    savings: '50-60%',
    savingsLabel: 'on onboarding time',
    color: 'from-green-500 to-emerald-500',
    icon: BookOpen,
    bestFor: ['Employee training', 'Skill development', 'Process documentation', 'Knowledge bases', 'Onboarding'],
    steps: [
      {
        step: 1,
        name: 'Process Documents',
        tool: 'NotebookLM',
        toolUrl: 'https://notebooklm.google.com',
        description: 'Upload and analyze learning materials',
        duration: '15-30 min',
        tips: [
          'Upload all relevant documents',
          'Include videos, PDFs, websites',
          'Let AI identify key concepts',
          'Generate initial summaries'
        ],
        prompt: `Analyze these documents and identify:

1. Key concepts and definitions
2. Main topics covered
3. Prerequisites needed
4. Learning objectives
5. Practical applications

Create a structured outline of the material.`
      },
      {
        step: 2,
        name: 'Create Custom GPT',
        tool: 'ChatGPT',
        toolUrl: 'https://chat.openai.com/gpts',
        description: 'Build a personalized AI tutor',
        duration: '30-60 min',
        tips: [
          'Define the GPT\'s expertise area',
          'Upload knowledge base documents',
          'Set teaching style and tone',
          'Include example Q&As'
        ],
        prompt: `Create a Custom GPT for teaching [TOPIC].

Instructions for the GPT:
- You are an expert tutor in [TOPIC]
- Teaching style: [Socratic/Direct/Example-based]
- Audience level: [Beginner/Intermediate/Advanced]
- Always provide practical examples
- Quiz the learner periodically
- Relate concepts to [INDUSTRY/CONTEXT]

Knowledge base includes:
[LIST KEY DOCUMENTS/CONCEPTS]`
      },
      {
        step: 3,
        name: 'Build Knowledge Base',
        tool: 'Perplexity Spaces',
        toolUrl: 'https://perplexity.ai',
        description: 'Create searchable knowledge repository',
        duration: '30-60 min',
        tips: [
          'Organize by topic/category',
          'Include FAQs',
          'Add real-world examples',
          'Keep it updated'
        ],
        prompt: `Organize this knowledge into a searchable structure:

[PASTE PROCESSED CONTENT]

Create:
1. Category hierarchy
2. Key terms glossary
3. FAQ section
4. Quick reference guides
5. Practical exercises

Format for easy searching and retrieval.`
      },
      {
        step: 4,
        name: 'Apply & Practice',
        tool: 'Your Practice',
        toolUrl: null,
        description: 'Hands-on application of learned skills',
        duration: 'Ongoing',
        tips: [
          'Start with small projects',
          'Apply to real business problems',
          'Track progress and gaps',
          'Iterate and improve'
        ],
        prompt: null
      }
    ]
  }
};

function AIWorkflows() {
  const [selectedWorkflow, setSelectedWorkflow] = useState('content');
  const [expandedStep, setExpandedStep] = useState(null);

  const workflow = WORKFLOWS[selectedWorkflow];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-[#006847] to-[#A4D65E] rounded-xl">
            <Workflow className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold">AI Workflow Pipelines</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Proven multi-tool workflows that combine the best AI tools for maximum efficiency.
          Follow the pipeline, get consistent results.
        </p>
      </div>

      {/* Workflow Selector */}
      <div className="grid md:grid-cols-3 gap-4">
        {Object.values(WORKFLOWS).map((wf) => (
          <Card 
            key={wf.id}
            className={`cursor-pointer transition-all ${
              selectedWorkflow === wf.id 
                ? 'ring-2 ring-[#006847] shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedWorkflow(wf.id)}
          >
            <CardContent className="pt-6">
              <div className={`h-14 w-14 rounded-xl bg-gradient-to-r ${wf.color} flex items-center justify-center mb-4`}>
                <wf.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold">{wf.name}</h3>
              <p className="text-gray-500 text-sm mb-3">{wf.tagline}</p>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800">
                  Saves {wf.savings}
                </Badge>
                <span className="text-xs text-gray-500">{wf.savingsLabel}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Workflow Details */}
      <Card className="overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${workflow.color}`} />
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <workflow.icon className="h-6 w-6 mr-2" />
                {workflow.name}
              </CardTitle>
              <CardDescription className="text-lg mt-1">
                {workflow.description}
              </CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              Saves {workflow.savings}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Best For */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2 flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Best For:
            </h4>
            <div className="flex flex-wrap gap-2">
              {workflow.bestFor.map((item, idx) => (
                <Badge key={idx} variant="outline">{item}</Badge>
              ))}
            </div>
          </div>

          {/* Pipeline Steps */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center">
              <Layers className="h-5 w-5 mr-2" />
              Pipeline Steps
            </h4>
            
            <div className="relative">
              {workflow.steps.map((step, idx) => (
                <div key={step.step} className="relative">
                  {/* Connector Line */}
                  {idx < workflow.steps.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-200" />
                  )}
                  
                  <Card 
                    className={`mb-4 cursor-pointer transition-all ${
                      expandedStep === step.step ? 'ring-2 ring-[#006847]' : 'hover:shadow-md'
                    }`}
                    onClick={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start space-x-4">
                        {/* Step Number */}
                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-r ${workflow.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                          {step.step}
                        </div>
                        
                        {/* Step Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-bold text-lg">{step.name}</h5>
                              <p className="text-gray-500">{step.description}</p>
                            </div>
                            <div className="text-right">
                              {step.toolUrl ? (
                                <a 
                                  href={step.toolUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-[#006847] hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {step.tool}
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              ) : (
                                <span className="text-gray-600">{step.tool}</span>
                              )}
                              <div className="text-sm text-gray-400 flex items-center justify-end mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {step.duration}
                              </div>
                            </div>
                          </div>

                          {/* Expanded Content */}
                          {expandedStep === step.step && (
                            <div className="mt-4 pt-4 border-t space-y-4">
                              {/* Tips */}
                              <div>
                                <h6 className="font-semibold mb-2 flex items-center">
                                  <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                                  Pro Tips:
                                </h6>
                                <ul className="space-y-1">
                                  {step.tips.map((tip, tipIdx) => (
                                    <li key={tipIdx} className="flex items-start text-sm">
                                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Prompt Template */}
                              {step.prompt && (
                                <div>
                                  <h6 className="font-semibold mb-2 flex items-center">
                                    <Bot className="h-4 w-4 mr-2 text-[#006847]" />
                                    Prompt Template:
                                  </h6>
                                  <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
                                    {step.prompt}
                                  </div>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="mt-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigator.clipboard.writeText(step.prompt);
                                    }}
                                  >
                                    Copy Prompt
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Arrow Down */}
                  {idx < workflow.steps.length - 1 && (
                    <div className="flex justify-center -mt-2 mb-2">
                      <ArrowDown className="h-5 w-5 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Start Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Rocket className="h-5 w-5 mr-2" />
            Quick Start: Your First Pipeline Run
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-16 w-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-bold mb-2">Choose Your Project</h4>
              <p className="text-sm text-gray-500">
                Pick something small - a blog post, a simple feature, or a training document.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h4 className="font-bold mb-2">Follow the Pipeline</h4>
              <p className="text-sm text-gray-500">
                Use each tool in sequence. Copy the prompts and customize for your project.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h4 className="font-bold mb-2">Track Your Time</h4>
              <p className="text-sm text-gray-500">
                Note how long it takes. Compare to your old process. Celebrate the savings!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tool Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            Recommended AI Tools
          </CardTitle>
          <CardDescription>
            The tools that power these pipelines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="https://perplexity.ai" target="_blank" rel="noopener noreferrer">
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="pt-6 text-center">
                  <Search className="h-10 w-10 mx-auto text-blue-500 mb-3" />
                  <h4 className="font-bold">Perplexity</h4>
                  <p className="text-sm text-gray-500">AI-powered research</p>
                  <Badge className="mt-2" variant="outline">Free tier</Badge>
                </CardContent>
              </Card>
            </a>
            <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="pt-6 text-center">
                  <PenTool className="h-10 w-10 mx-auto text-orange-500 mb-3" />
                  <h4 className="font-bold">Claude</h4>
                  <p className="text-sm text-gray-500">Long-form writing</p>
                  <Badge className="mt-2" variant="outline">Free tier</Badge>
                </CardContent>
              </Card>
            </a>
            <a href="https://cursor.sh" target="_blank" rel="noopener noreferrer">
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="pt-6 text-center">
                  <Code className="h-10 w-10 mx-auto text-purple-500 mb-3" />
                  <h4 className="font-bold">Cursor</h4>
                  <p className="text-sm text-gray-500">AI code editor</p>
                  <Badge className="mt-2" variant="outline">Free tier</Badge>
                </CardContent>
              </Card>
            </a>
            <a href="https://notebooklm.google.com" target="_blank" rel="noopener noreferrer">
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="pt-6 text-center">
                  <GraduationCap className="h-10 w-10 mx-auto text-green-500 mb-3" />
                  <h4 className="font-bold">NotebookLM</h4>
                  <p className="text-sm text-gray-500">Document learning</p>
                  <Badge className="mt-2" variant="outline">Free</Badge>
                </CardContent>
              </Card>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-[#006847] to-[#A4D65E] text-white">
        <CardContent className="py-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Master These Pipelines</h2>
          <p className="text-white/90 mb-4 max-w-xl mx-auto">
            The DowUrk AI Hackbook includes detailed guides, more prompts, and real examples for each pipeline.
          </p>
          <Button variant="secondary" size="lg">
            <BookOpen className="mr-2 h-5 w-5" />
            Read the AI Hackbook
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default AIWorkflows;
