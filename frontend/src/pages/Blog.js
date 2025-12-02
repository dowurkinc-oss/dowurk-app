import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Video, BookOpen, ArrowRight, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';

function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'AI & Technology', 'Entrepreneurship', 'Success Stories', 'Resources'];

  const blogPosts = [
    {
      id: 1,
      title: 'The Power of AI in Modern Entrepreneurship',
      slug: 'power-of-ai-entrepreneurship',
      excerpt: 'Discover how artificial intelligence is revolutionizing the way entrepreneurs start, grow, and scale their businesses in 2025.',
      content: `
# The Power of AI in Modern Entrepreneurship

Artificial Intelligence is no longer a futuristic concept—it's here, and it's transforming entrepreneurship in profound ways. At DowUrk Inc., we're witnessing firsthand how AI empowers underrepresented entrepreneurs to compete on a global scale.

## Breaking Down Barriers

Traditionally, small business owners faced significant barriers:
- **Limited access to expert advice** ($200+/hour consultants)
- **Time-consuming market research** (hundreds of hours)
- **Complex financial planning** (requiring specialized skills)
- **Marketing expertise gaps** (expensive agencies)

AI has democratized access to these critical business functions.

## How AI Levels the Playing Field

### 1. 24/7 Business Consulting
Our AI assistant provides instant guidance on:
- Business plan development
- Market analysis
- Financial projections
- Legal compliance
- Marketing strategies

### 2. Data-Driven Decision Making
AI analyzes market trends, customer behavior, and competitive landscapes in seconds—work that would take human analysts weeks.

### 3. Automated Operations
- **Customer Service**: AI chatbots handle inquiries 24/7
- **Bookkeeping**: Automated expense tracking and categorization
- **Marketing**: AI generates content, designs, and ad campaigns
- **Sales**: Predictive analytics identify best prospects

### 4. Cost Savings
A small business can now access enterprise-level tools for $50-100/month instead of $10,000+/month for human equivalents.

## Real Louisiana Examples

**Case Study: Creole Kitchen Delights**
Using AI tools, owner Marie reduced her marketing costs by 70% while tripling her social media engagement. AI helped her:
- Generate weekly social media content
- Optimize her menu pricing
- Predict seasonal demand
- Automate customer reviews responses

**Result**: Revenue increased 45% in 6 months.

## The DowUrk AI Advantage

Our platform specifically serves Louisiana entrepreneurs with:
- **Louisiana-specific business guidance** (state regulations, local resources)
- **Grant matching algorithms** (connect to $2M+ in funding)
- **Culturally-aware content generation** (authentic to your community)
- **Multilingual support** (English, Spanish, Vietnamese, French)

## Getting Started with AI

1. **Start Small**: Use our free AI assistant for basic questions
2. **Automate One Task**: Pick your most time-consuming task
3. **Measure Results**: Track time saved and revenue impact
4. **Scale Gradually**: Add more AI tools as you see ROI

## The Future is Now

By 2026, **80% of successful small businesses** will use AI tools. The question isn't whether to adopt AI—it's how quickly you can leverage it to stay competitive.

## Take Action Today

✅ Try our AI Business Assistant (free)
✅ Join our AI for Entrepreneurs workshop
✅ Download our AI Tools Guide

The power of AI isn't reserved for tech giants. It's available to every Louisiana entrepreneur willing to embrace it.

**Ready to transform your business? Start with our AI assistant today.**
      `,
      author: 'Robert Jerrod Brown',
      date: '2025-01-15',
      category: 'AI & Technology',
      image: 'https://customer-assets.emergentagent.com/job_equity-focus/artifacts/875dlk3n_dowurk_color_shield.png',
      videoUrl: null,
      featured: true
    },
    {
      id: 2,
      title: 'How DowUrk Plans to Harness AI for Community Empowerment',
      slug: 'dowurk-ai-strategy',
      excerpt: 'Our comprehensive strategy for using artificial intelligence to empower Louisiana\'s underrepresented entrepreneurs and build stronger communities.',
      content: `
# How DowUrk Plans to Harness AI for Community Empowerment

At DowUrk Inc., we're not just using AI—we're building an AI-powered ecosystem designed specifically for underrepresented Louisiana entrepreneurs. Here's our vision and roadmap.

## The Challenge

Underrepresented entrepreneurs face systemic barriers:
- **Capital Access**: Only 1% of venture capital goes to Black founders
- **Network Gaps**: Limited access to mentors and advisors
- **Information Asymmetry**: Unequal access to business knowledge
- **Time Poverty**: Juggling multiple jobs while building businesses
- **Digital Divide**: Limited tech literacy and tools

## Our AI-Powered Solution

### 1. The DowUrk AI Assistant

**What It Does:**
- Provides 24/7 business consulting in plain language
- Specializes in Louisiana's business ecosystem
- Understands cultural context and community needs
- Offers guidance in multiple languages

**Impact Goal**: Serve 10,000 entrepreneurs by 2026

### 2. AI Grant Navigator

**The Problem**: Louisiana has $100M+ in grants, but most entrepreneurs don't know they exist or how to apply.

**Our Solution**:
- AI scans 200+ funding sources daily
- Matches businesses with eligible grants (90% accuracy)
- Pre-fills applications with business data
- Provides application tips and success predictions

**Target**: Connect entrepreneurs to $10M+ in funding by 2026

### 3. AI Business Plan Generator

**Traditional Cost**: $2,000-5,000 for professional business plan
**DowUrk Cost**: Free

**Features**:
- Industry-specific templates
- Louisiana market data integration
- Financial projections with local benchmarks
- Competitive analysis
- Investor-ready formatting

### 4. AI Marketing Engine

**Generates**:
- Social media content (posts, captions, hashtags)
- Email campaigns
- Ad copy
- Blog posts
- Video scripts
- Brand messaging

**Value**: $3,000/month marketing agency → $0 with DowUrk

### 5. AI Legal & Compliance Assistant

**Navigates**:
- Business formation (LLC, Corporation, etc.)
- Licensing requirements by industry and parish
- Tax obligations
- Employment law
- Contract review

**Saves**: $5,000+ in legal consultation fees

### 6. AI-Powered Business Directory

**Smart Features**:
- Automatic business categorization
- SEO optimization for each listing
- Customer matching (connects buyers to sellers)
- Reputation monitoring
- Trend analysis (what customers are searching for)

### 7. AI Community Moderator

**Ensures**:
- Safe, supportive community discussions
- Relevant connections between members
- Highlights valuable content
- Identifies collaboration opportunities

## Implementation Roadmap

### Phase 1 (Q1 2025) ✅ COMPLETE
- Launch AI Assistant
- Basic business planning tools
- Grant database integration

### Phase 2 (Q2 2025)
- Advanced AI features
- Marketing content generator
- Business directory AI enhancements

### Phase 3 (Q3 2025)
- Mobile app launch
- Voice AI assistant
- AI mentorship matching

### Phase 4 (Q4 2025)
- Predictive analytics (business success forecasting)
- AI-powered networking events
- Integration with state economic systems

### Phase 5 (2026)
- AI-driven investment matching
- Automated bookkeeping
- Enterprise features for growing businesses

## Ethical AI Principles

We're committed to:

1. **Transparency**: You always know when you're interacting with AI
2. **Privacy**: Your data stays yours—never sold or shared
3. **Fairness**: AI trained to eliminate bias, not perpetuate it
4. **Human Touch**: AI augments, never replaces, human support
5. **Accessibility**: Free tier always available

## Measuring Impact

**Key Metrics**:
- Businesses served
- Capital accessed
- Time saved
- Jobs created
- Revenue growth
- Digital literacy improvement

**Annual Goal**: Help create 1,000 new businesses and 5,000 jobs in Louisiana

## The Partnership Model

We're collaborating with:
- **Louisiana Economic Development** (LED)
- **Small Business Development Centers** (SBDCs)
- **HBCUs** (Grambling, Southern, Xavier, Dillard)
- **Tech Partners** (OpenAI, Google, Anthropic)
- **Local Chambers** (Black Chamber, LA Chamber)

## Investment Needed

**Budget**: $500K annually

**Allocation**:
- 40% AI development & maintenance
- 30% Community outreach & training
- 20% Staffing
- 10% Operations

**ROI**: Every $1 invested generates $15 in entrepreneur revenue

## Join the Movement

This isn't just technology—it's economic justice.

AI can either widen the wealth gap or close it. We're choosing the latter.

### How You Can Help:

**Entrepreneurs**: Sign up and start using our tools
**Partners**: Collaborate with us
**Donors**: Fund the mission
**Volunteers**: Share your expertise
**Advocates**: Spread the word

## Conclusion

AI is the most powerful business tool in human history. DowUrk exists to ensure Louisiana's underrepresented entrepreneurs have equal access to that power.

Together, we're not just building businesses—we're building generational wealth and community prosperity.

**The future is now. The future is equitable. The future is DowUrk.**

---

*Ready to experience the power of AI? Try our assistant now or join our next workshop.*
      `,
      author: 'Robert Jerrod Brown',
      date: '2025-01-10',
      category: 'AI & Technology',
      image: 'https://customer-assets.emergentagent.com/job_equity-focus/artifacts/875dlk3n_dowurk_color_shield.png',
      videoUrl: null,
      featured: true
    },
    {
      id: 3,
      title: 'The DowUrk Mobile Podcast',
      slug: 'dowurk-podcast',
      excerpt: 'This inspiring podcast focuses on entrepreneurial experiences while learning about yourself so that you can have a fulfilling and purposeful life completing your soul\'s mission here on Earth.',
      content: '',
      author: 'DowUrk Team',
      date: '2025-01-05',
      category: 'Resources',
      image: 'https://customer-assets.emergentagent.com/job_1dc8832b-f338-4702-aaed-8947f56a5ae3/artifacts/ljipdvz5_DowUrk%20Podcast.png',
      videoUrl: null,
      podcastUrl: 'https://podcasts.apple.com/us/podcast/the-dowurk-mobile-podcast/id1630233933',
      featured: true
    },
    {
      id: 4,
      title: 'DowUrk on YouTube',
      slug: 'youtube-channel',
      excerpt: 'Watch our latest videos, workshops, and success stories on the official DowUrk YouTube channel.',
      content: '',
      author: 'DowUrk Team',
      date: '2025-01-03',
      category: 'Resources',
      image: null,
      videoUrl: 'https://www.youtube.com/embed/videoseries?list=UUDFERb6RQLbxlErcPrUA94w',
      featured: false
    },
    {
      id: 5,
      title: 'From Camera to Community: The Robert Jerrod Brown Story',
      slug: 'rj-brown-success-story',
      excerpt: 'How a stolen camera and a mother\'s battle with cancer led to the creation of DowUrk Inc. - a movement empowering thousands of Louisiana entrepreneurs.',
      content: `
# From Camera to Community: The Robert Jerrod Brown Story

## Every Story Has a Spark

Mine began in the summer of 2007, when I was a high school upperclassman at Hammond High. My dad went half with me on my first DSLR camera—a decision that would unknowingly plant the seeds of a lifelong journey. Alongside my friend Triston Manuel, I co-founded **Manuel & Brown Photography**, capturing moments for my father's Hammond Jr. Tors Youth Football League.

That camera became my passport to creativity, connection, and a sense of purpose.

## The Early Years: Finding My Voice

By 2009, I was taking senior portraits for my classmates, winning Beta Club awards for photography, and expanding my worldview through the **Upward Bound Math & Science Program**—a program that would later come full circle in my career.

When I attended the **University of Louisiana at Monroe**, I became Photo Editor for The Hawkeye newspaper, joined **Alpha Phi Alpha Fraternity, Inc.**, and began shaping my identity as a Black creative and leader. I developed **Culturati Noire**, a photo series that explores African heritage and self-identity—my first significant act of cultural storytelling.

## The Trials That Defined Me

But my path wasn't without obstacles.

Between 2012 and 2014, I experienced **two devastating instances of equipment theft**, both while pursuing my dream. At the same time, my mother was battling breast cancer, and I lost my teaching job under unfair circumstances.

Those moments tested my resilience—but they also defined me.

I realized photography wasn't just my passion; it was my calling. **I decided to build a business that couldn't be stolen from me again**—a foundation that would outlive the setbacks.

## DowUrk Inc. is Born

That's when **DowUrk Inc.** was born.

Inspired by my experiences with the **Professional Photographers of America** and the lack of accessible business resources for creatives like me, I envisioned an organization that would **bridge the gap between creative passion and sustainable entrepreneurship**—especially for underrepresented voices.

I wanted to create for others what I didn't have: **a guide, a community, and a blueprint for success.**

## Building the Vision Through Education

Over the years, DowUrk evolved through lived experience and education:

- **2016**: Founded DowUrk Inc.
- **2021**: Completed Louisiana Economic Development SEBD Roundtable
- **2022**: Nexus Louisiana Ignition Program
- **2023**: 501(c)(3) Public Charity Status Achieved
- **2024**: Earned Master's in Strategic Communication from Southeastern Louisiana University (DowUrk was my capstone project)
- **2025**: Certified as Disadvantaged Business Enterprise (DBE)
- Joined National Minority Supplier Development Council

## The Mission Becomes Clear

Through it all, I've learned that **DowUrk isn't just a brand—it's a movement.**

It's proof that you can:
- Turn adversity into strategy
- Transform vision into structure
- Convert purpose into progress

DowUrk exists for:
- Every dreamer who needs guidance
- Every entrepreneur who's been counted out
- Every creative ready to transform their gifts into generational impact

## The Seven F's Framework

What started as a photography business evolved into a comprehensive life philosophy—**The Seven F's**:

1. **Faith** - Spiritual foundation
2. **Fitness** - Physical and mental wellness
3. **Foundation** - Business fundamentals
4. **Fashion** - Professional branding
5. **Film** - Content creation and storytelling
6. **Food** - Nutrition and culinary arts
7. **Finances** - Wealth building and money management

This framework guides everything we do at DowUrk—from our podcast topics to our training programs.

## Impact by the Numbers (2016-2025)

- **10,000+** entrepreneurs served
- **$2.1M+** in capital accessed
- **1,247** businesses supported
- **345** jobs created
- **89** workshops delivered

## Why They Call Me Mr. DowUrk

As we enter 2026, my mission is clear: **to make it all make sense**—why they call me Mr. DowUrk.

It's because DowUrk represents more than business support. It represents:

- **Resilience** in the face of adversity
- **Innovation** born from necessity  
- **Community** built from isolation
- **Opportunity** created from obstacles
- **Legacy** forged from loss

## The Message to You

If you're reading this and you've faced setbacks, lost equipment, lost jobs, or watched loved ones battle illness while pursuing your dreams—**you're not alone.**

Your struggles aren't signs to quit. They're signals to **build something bigger than yourself.**

Photography taught me to see. Loss taught me to build. DowUrk taught me that **my story could become a roadmap for others.**

## Join the Movement

This isn't just my story—it's **our** story. 

Every Louisiana entrepreneur who's been overlooked, underfunded, and underestimated—DowUrk was built for you.

**Ready to write your own success story?**

- [Join our community](/register)
- [Access our resources](/resources)
- [Listen to the podcast](https://podcasts.apple.com/us/podcast/the-dowurk-mobile-podcast/id1630233933)
- [Get AI-powered guidance](/ai-assistant)

---

*Robert Jerrod Brown is the CEO, Founder, and Executive Director of DowUrk Inc., a Louisiana-based 501(c)(3) nonprofit empowering underrepresented entrepreneurs since 2016.*
      `,
      author: 'Robert Jerrod Brown',
      date: '2025-01-20',
      category: 'Success Stories',
      image: 'https://customer-assets.emergentagent.com/job_1dc8832b-f338-4702-aaed-8947f56a5ae3/artifacts/yfqh5qwc_IMG_7907.jpg',
      videoUrl: null,
      featured: true
    },
    {
      id: 6,
      title: '5 Steps to Start Your Louisiana Business in 2025',
      slug: 'start-louisiana-business-2025',
      excerpt: 'A practical guide to launching your business in Louisiana, from business formation to opening day.',
      content: '',
      author: 'DowUrk Team',
      date: '2025-01-18',
      category: 'Entrepreneurship',
      image: 'https://customer-assets.emergentagent.com/job_equity-focus/artifacts/875dlk3n_dowurk_color_shield.png',
      videoUrl: null,
      featured: false
    },
    {
      id: 7,
      title: 'How to Access Small Business Grants in Louisiana',
      slug: 'louisiana-small-business-grants',
      excerpt: 'Navigate the grant application process and discover funding opportunities for your Louisiana business.',
      content: '',
      author: 'DowUrk Team',
      date: '2025-01-16',
      category: 'Entrepreneurship',
      image: 'https://customer-assets.emergentagent.com/job_equity-focus/artifacts/875dlk3n_dowurk_color_shield.png',
      videoUrl: null,
      featured: false
    },
    {
      id: 8,
      title: 'Building Your Brand on a Bootstrap Budget',
      slug: 'bootstrap-branding-guide',
      excerpt: 'Create a professional brand identity without breaking the bank. Free tools and strategies for new entrepreneurs.',
      content: '',
      author: 'DowUrk Team',
      date: '2025-01-12',
      category: 'Entrepreneurship',
      image: 'https://customer-assets.emergentagent.com/job_equity-focus/artifacts/875dlk3n_dowurk_color_shield.png',
      videoUrl: null,
      featured: false
    },
    {
      id: 9,
      title: 'The Minority Business Certification Guide',
      slug: 'minority-business-certification-guide',
      excerpt: 'Everything you need to know about MBE, WBE, DBE, and other certifications that can transform your business opportunities.',
      content: '',
      author: 'DowUrk Team',
      date: '2025-01-08',
      category: 'Entrepreneurship',
      image: 'https://customer-assets.emergentagent.com/job_equity-focus/artifacts/875dlk3n_dowurk_color_shield.png',
      videoUrl: null,
      featured: false
    },
    {
      id: 10,
      title: 'Social Media Marketing for Local Businesses',
      slug: 'social-media-marketing-local',
      excerpt: 'Master social media marketing to attract local customers and build a loyal community around your Louisiana business.',
      content: '',
      author: 'DowUrk Team',
      date: '2025-01-06',
      category: 'Entrepreneurship',
      image: 'https://customer-assets.emergentagent.com/job_equity-focus/artifacts/875dlk3n_dowurk_color_shield.png',
      videoUrl: null,
      featured: false
    }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="space-y-12" data-testid="blog-page">
      {/* Hero */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center space-x-3">
          <BookOpen className="h-12 w-12 text-[#006847]" />
          <h1 className="text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#A4D65E] to-[#006847] bg-clip-text text-transparent">
              DowUrk Blog
            </span>
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Insights, strategies, and stories to empower your entrepreneurial journey
        </p>
      </section>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#A4D65E] to-[#006847] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat === 'all' ? 'All Posts' : cat}
          </button>
        ))}
      </div>

      {/* Featured Posts */}
      <section className="space-y-6">
        {filteredPosts.filter(post => post.featured).map((post) => (
          <Card key={post.id} className="border-2 border-[#A4D65E] hover:shadow-xl transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {post.videoUrl ? (
                <div className="md:col-span-2 aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={post.videoUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
              ) : (
                <div className="md:col-span-1">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                  />
                </div>
              )}
              
              <div className={post.videoUrl ? 'md:col-span-1' : 'md:col-span-2'}>
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className="bg-[#A4D65E] text-black">{post.category}</Badge>
                    {post.videoUrl && <Video className="h-5 w-5 text-[#006847]" />}
                    {post.podcastUrl && <Mic className="h-5 w-5 text-[#006847]" />}
                  </div>
                  <CardTitle className="text-3xl mb-4">{post.title}</CardTitle>
                  <CardDescription className="text-base">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  {post.podcastUrl ? (
                    <a href={post.podcastUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90 w-full">
                        <Mic className="mr-2 h-4 w-4" />
                        Listen on Apple Podcasts
                      </Button>
                    </a>
                  ) : !post.videoUrl && (
                    <Link to={`/blog/${post.slug}`}>
                      <Button className="bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90">
                        Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </section>

      {/* All Posts Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.filter(post => !post.featured).map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            {post.image && (
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <CardHeader>
              <Badge className="w-fit mb-2 bg-[#A4D65E] text-black">{post.category}</Badge>
              <CardTitle className="text-xl">{post.title}</CardTitle>
              <CardDescription>{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(post.date).toLocaleDateString()}
                </div>
              </div>
              <Link to={`/blog/${post.slug}`}>
                <Button variant="outline" className="w-full">
                  Read More
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#006847] to-[#005a3c] rounded-2xl p-12 text-white text-center space-y-6">
        <h2 className="text-3xl font-bold">Stay Updated</h2>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Subscribe to our newsletter for the latest insights, resources, and opportunities for Louisiana entrepreneurs.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-lg w-full sm:w-64 text-gray-900"
          />
          <Button size="lg" variant="secondary" className="bg-[#A4D65E] text-black hover:bg-[#8bc44a] w-full sm:w-auto">
            Subscribe
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Blog;
