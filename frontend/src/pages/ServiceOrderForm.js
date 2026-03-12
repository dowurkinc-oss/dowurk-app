import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Megaphone, Code, GraduationCap, FileText, LineChart, Video,
  Share2, PenTool, Mic, Scale, Cpu, CloudRain, Users,
  TrendingUp, Handshake, Building2, Search, Calendar, Flag,
  CheckCircle2, DollarSign, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Service Catalogue ───────────────────────────────────────────────────────
const SERVICES = [
  {
    id: 'branding',
    icon: <Megaphone className="h-5 w-5" />,
    title: 'Branding & Product Development',
    description: 'Create compelling brand identities and develop products that resonate with your target market.',
    category: 'Creative',
    pricing: [
      { tier: 'Starter', price: 750, label: 'Logo + color palette + brand guide' },
      { tier: 'Growth', price: 2500, label: 'Full brand identity + product mockups' },
      { tier: 'Premium', price: 5000, label: 'Complete brand system + launch strategy' },
    ],
  },
  {
    id: 'consulting',
    icon: <GraduationCap className="h-5 w-5" />,
    title: 'Business Training & Consulting',
    description: 'Expert guidance and training to help you build, grow, and scale your business successfully.',
    category: 'Consulting',
    pricing: [
      { tier: 'Session', price: 150, label: '1-hour strategy session' },
      { tier: 'Package', price: 500, label: '4-session coaching package' },
      { tier: 'Retainer', price: 1200, label: 'Monthly consulting retainer' },
    ],
  },
  {
    id: 'certification',
    icon: <FileText className="h-5 w-5" />,
    title: 'Business Certification',
    description: 'Assistance with obtaining MBE, WBE, DBE, and other nationally recognized certifications.',
    category: 'Compliance',
    pricing: [
      { tier: 'Basic', price: 500, label: 'Application review + checklist' },
      { tier: 'Standard', price: 1200, label: 'Full application prep + submission' },
      { tier: 'Complete', price: 2000, label: 'End-to-end certification management' },
    ],
  },
  {
    id: 'photo-video',
    icon: <Video className="h-5 w-5" />,
    title: 'Photo & Video Services',
    description: 'Professional photography and videography to showcase your business and tell your story.',
    category: 'Creative',
    pricing: [
      { tier: 'Headshots', price: 250, label: 'Professional headshot session (up to 10 edited photos)' },
      { tier: 'Business', price: 750, label: 'Half-day business shoot (photos + 1 promo video)' },
      { tier: 'Full Production', price: 2000, label: 'Full-day shoot + editing + brand video package' },
    ],
  },
  {
    id: 'social-media',
    icon: <Share2 className="h-5 w-5" />,
    title: 'Social Media Management',
    description: 'Build your online presence with strategic social media content and community management.',
    category: 'Marketing',
    pricing: [
      { tier: 'Starter', price: 500, label: '8 posts/month across 2 platforms' },
      { tier: 'Growth', price: 1200, label: '16 posts/month + engagement management' },
      { tier: 'Pro', price: 2500, label: '30 posts/month + ads + analytics reporting' },
    ],
  },
  {
    id: 'content',
    icon: <PenTool className="h-5 w-5" />,
    title: 'Content Creation / Copywriting',
    description: 'Engaging content and copy that connects with your audience and drives results.',
    category: 'Creative',
    pricing: [
      { tier: 'Blog Pack', price: 300, label: '2 blog posts (800–1,200 words each)' },
      { tier: 'Web Copy', price: 750, label: 'Website copy (up to 5 pages)' },
      { tier: 'Monthly', price: 1500, label: 'Monthly content retainer (4 blogs + social copy)' },
    ],
  },
  {
    id: 'podcast',
    icon: <Mic className="h-5 w-5" />,
    title: 'Podcast / Livestream Recordings',
    description: 'Professional podcast production and livestream services to amplify your message.',
    category: 'Creative',
    pricing: [
      { tier: 'Single Episode', price: 200, label: 'Recording + basic editing (up to 60 min)' },
      { tier: 'Monthly Pack', price: 600, label: '4 episodes/month + show notes' },
      { tier: 'Full Launch', price: 1500, label: 'Podcast launch kit + 4 episodes + artwork' },
    ],
  },
  {
    id: 'legal',
    icon: <Scale className="h-5 w-5" />,
    title: 'Legal Compliance',
    description: 'Navigate business regulations, licensing, and compliance requirements with confidence.',
    category: 'Compliance',
    pricing: [
      { tier: 'Review', price: 350, label: 'Compliance audit + recommendations report' },
      { tier: 'Setup', price: 900, label: 'Business structure + licensing setup guidance' },
      { tier: 'Ongoing', price: 1500, label: 'Quarterly compliance monitoring + updates' },
    ],
  },
  {
    id: 'ai',
    icon: <Cpu className="h-5 w-5" />,
    title: 'AI Services & Solutions',
    description: 'Leverage cutting-edge AI tools to automate, optimize, and scale your business operations.',
    category: 'Technology',
    pricing: [
      { tier: 'Consultation', price: 300, label: 'AI readiness assessment + tool recommendations' },
      { tier: 'Integration', price: 1500, label: 'AI workflow setup + automation (up to 3 workflows)' },
      { tier: 'Custom Build', price: 4000, label: 'Custom AI solution design + implementation' },
    ],
  },
  {
    id: 'disaster',
    icon: <CloudRain className="h-5 w-5" />,
    title: 'Disaster Response & Relief',
    description: 'Support and resources for businesses affected by natural disasters and emergencies.',
    category: 'Support',
    pricing: [
      { tier: 'Assessment', price: 0, label: 'Free initial impact assessment' },
      { tier: 'Recovery Plan', price: 500, label: 'Business continuity + recovery roadmap' },
      { tier: 'Full Support', price: 1500, label: 'Hands-on recovery coordination + grant navigation' },
    ],
  },
  {
    id: 'strategic',
    icon: <LineChart className="h-5 w-5" />,
    title: 'Strategic Planning',
    description: 'Develop comprehensive business strategies and roadmaps for sustainable growth.',
    category: 'Consulting',
    pricing: [
      { tier: 'Roadmap', price: 750, label: '90-day strategic roadmap session' },
      { tier: 'Annual Plan', price: 2500, label: 'Full annual business plan + KPI framework' },
      { tier: 'Executive', price: 5000, label: 'Multi-year strategic plan + quarterly reviews' },
    ],
  },
  {
    id: 'grants',
    icon: <FileText className="h-5 w-5" />,
    title: 'Grant Writing',
    description: 'Professional grant writing services to help you secure funding for your business.',
    category: 'Funding',
    pricing: [
      { tier: 'Research', price: 300, label: 'Grant opportunity research + match report' },
      { tier: 'Application', price: 1200, label: 'Single grant application (foundation/local)' },
      { tier: 'Federal', price: 3500, label: 'Federal/state grant application + compliance docs' },
    ],
  },
  {
    id: 'digital-marketing',
    icon: <TrendingUp className="h-5 w-5" />,
    title: 'Digital Marketing',
    description: 'Data-driven digital marketing strategies to reach and engage your ideal customers.',
    category: 'Marketing',
    pricing: [
      { tier: 'Starter', price: 750, label: 'SEO audit + Google Business setup + 1 ad campaign' },
      { tier: 'Growth', price: 2000, label: 'Multi-channel strategy + monthly reporting' },
      { tier: 'Full Service', price: 4500, label: 'Comprehensive digital marketing management' },
    ],
  },
  {
    id: 'it',
    icon: <Code className="h-5 w-5" />,
    title: 'IT Services',
    description: 'Technology consulting, web development, and IT support for modern businesses.',
    category: 'Technology',
    pricing: [
      { tier: 'Website', price: 1500, label: 'Professional 5-page business website' },
      { tier: 'Tech Support', price: 200, label: 'Monthly IT support (up to 5 hrs)' },
      { tier: 'Custom Dev', price: 5000, label: 'Custom web/app development (scoped project)' },
    ],
  },
  {
    id: 'research',
    icon: <Search className="h-5 w-5" />,
    title: 'Research',
    description: 'Market research, competitive analysis, and data insights to inform your decisions.',
    category: 'Consulting',
    pricing: [
      { tier: 'Competitive', price: 500, label: 'Competitor analysis report (5 competitors)' },
      { tier: 'Market Study', price: 1500, label: 'Full market research + opportunity report' },
      { tier: 'Custom', price: 3000, label: 'Custom research project + data visualization' },
    ],
  },
  {
    id: 'events',
    icon: <Calendar className="h-5 w-5" />,
    title: 'Event Services',
    description: 'Planning, coordination, and execution of professional business events and workshops.',
    category: 'Operations',
    pricing: [
      { tier: 'Workshop', price: 500, label: 'Virtual or in-person workshop coordination' },
      { tier: 'Corporate', price: 2000, label: 'Half-day corporate event (up to 50 attendees)' },
      { tier: 'Full Event', price: 5000, label: 'Full-day event production + marketing' },
    ],
  },
  {
    id: 'campaigns',
    icon: <Flag className="h-5 w-5" />,
    title: 'Campaigns',
    description: 'End-to-end campaign management for marketing, fundraising, and advocacy initiatives.',
    category: 'Marketing',
    pricing: [
      { tier: 'Launch', price: 1000, label: 'Single campaign strategy + execution (30 days)' },
      { tier: 'Quarterly', price: 3000, label: '3-month multi-channel campaign' },
      { tier: 'Annual', price: 8000, label: 'Full-year campaign calendar + management' },
    ],
  },
  {
    id: 'partnerships',
    icon: <Handshake className="h-5 w-5" />,
    title: 'Partnerships & Strategic Alliances',
    description: 'Connect with potential partners and build strategic alliances for mutual growth.',
    category: 'Consulting',
    pricing: [
      { tier: 'Intro', price: 300, label: 'Partnership readiness assessment' },
      { tier: 'Matchmaking', price: 1000, label: 'Partner identification + outreach strategy' },
      { tier: 'Full Alliance', price: 2500, label: 'End-to-end partnership development + MOU drafting' },
    ],
  },
  {
    id: 'association',
    icon: <Building2 className="h-5 w-5" />,
    title: 'Business Association',
    description: 'Join our network of entrepreneurs and access exclusive member benefits and resources.',
    category: 'Membership',
    pricing: [
      { tier: 'Basic', price: 99, label: 'Annual membership — directory listing + events' },
      { tier: 'Professional', price: 249, label: 'Annual membership — all Basic benefits + consulting credits' },
      { tier: 'Premium', price: 499, label: 'Annual membership — all benefits + priority services' },
    ],
  },
];

const CATEGORY_COLORS = {
  Creative: 'bg-purple-100 text-purple-800',
  Consulting: 'bg-blue-100 text-blue-800',
  Compliance: 'bg-yellow-100 text-yellow-800',
  Marketing: 'bg-orange-100 text-orange-800',
  Technology: 'bg-cyan-100 text-cyan-800',
  Support: 'bg-red-100 text-red-800',
  Funding: 'bg-emerald-100 text-emerald-800',
  Operations: 'bg-indigo-100 text-indigo-800',
  Membership: 'bg-green-100 text-green-800',
};

// ─── Zod Schema ──────────────────────────────────────────────────────────────
const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Phone number required'),
  businessName: z.string().min(1, 'Business name is required'),
  businessType: z.string().min(1, 'Business type is required'),
  parish: z.string().optional(),
  website: z.string().optional(),
  howHeard: z.string().optional(),
  projectDescription: z.string().min(10, 'Please describe your project (at least 10 characters)'),
  timeline: z.string().min(1, 'Please select a timeline'),
  budget: z.string().optional(),
  agreeTerms: z.boolean().refine(v => v === true, 'You must agree to the terms'),
});

// ─── Component ───────────────────────────────────────────────────────────────
function ServiceOrderForm() {
  const [selectedServices, setSelectedServices] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { agreeTerms: false },
  });

  const agreeTerms = watch('agreeTerms');

  const categories = ['All', ...Array.from(new Set(SERVICES.map(s => s.category)))];

  const filteredServices = activeCategory === 'All'
    ? SERVICES
    : SERVICES.filter(s => s.category === activeCategory);

  const toggleService = (serviceId, tier, price) => {
    setSelectedServices(prev => {
      const current = prev[serviceId];
      if (current && current.tier === tier) {
        const next = { ...prev };
        delete next[serviceId];
        return next;
      }
      return { ...prev, [serviceId]: { tier, price } };
    });
  };

  const totalEstimate = Object.values(selectedServices).reduce((sum, s) => sum + s.price, 0);
  const selectedCount = Object.keys(selectedServices).length;

  const onSubmit = (data) => {
    console.log('Form submitted:', { ...data, selectedServices });
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg"
        >
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="h-20 w-20 text-[#006847]" />
          </div>
          <h1 className="text-4xl font-bold text-[#006847] mb-4">Order Received!</h1>
          <p className="text-lg text-gray-600 mb-2">
            Thank you for submitting your service order to <strong>DowUrk Inc.</strong>
          </p>
          <p className="text-gray-500 mb-8">
            A member of our team will review your request and contact you within <strong>1–2 business days</strong> to discuss next steps and finalize your service agreement.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => { setSubmitted(false); setSelectedServices({}); }}
              variant="outline"
              className="border-[#006847] text-[#006847]"
            >
              Submit Another Order
            </Button>
            <Link to="/services">
              <Button className="bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90">
                Back to Services
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 bg-[#006847]/10 text-[#006847] px-4 py-1.5 rounded-full text-sm font-medium">
          <DollarSign className="h-4 w-4" />
          Service Order Form
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">
          Request <span className="text-[#006847]">DowUrk</span> Services
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select one or more services below, choose your preferred tier, and complete the form. Our team will follow up within 1–2 business days.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-[#A4D65E]" /> Free Initial Consultation</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-[#A4D65E]" /> No Hidden Fees</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-[#A4D65E]" /> Louisiana-Based Team</span>
        </div>
      </motion.div>

      {/* ── Company Info Banner ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-[#006847] text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <img
            src="https://customer-assets.emergentagent.com/job_equity-focus/artifacts/875dlk3n_dowurk_color_shield.png"
            alt="DowUrk Logo"
            className="h-14 w-auto"
          />
          <div>
            <p className="text-xl font-bold">DowUrk® Inc.</p>
            <p className="text-white/80 text-sm">Professional Services • Est. 2016 • Hammond, LA</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 text-center text-sm">
          <div><div className="text-2xl font-bold text-[#A4D65E]">19</div><div className="text-white/70">Services</div></div>
          <div><div className="text-2xl font-bold text-[#A4D65E]">1,000+</div><div className="text-white/70">Businesses Served</div></div>
          <div><div className="text-2xl font-bold text-[#A4D65E]">10+</div><div className="text-white/70">Years</div></div>
        </div>
        <div className="text-center md:text-right text-sm text-white/80">
          <p>UEI: PNMVVH9EWSD3</p>
          <p>NAICS: 813410</p>
          <p>CAGE: 8JUP7</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

        {/* ── Step 1: Select Services ── */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#006847] text-white font-bold text-sm">1</div>
            <h2 className="text-2xl font-bold">Select Services</h2>
            {selectedCount > 0 && (
              <Badge className="bg-[#A4D65E] text-[#006847] font-semibold">
                {selectedCount} selected · Est. ${totalEstimate.toLocaleString()}
              </Badge>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-[#006847] text-white shadow'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Pricing Note */}
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Prices shown are <strong>suggested starting rates</strong>. Final pricing is confirmed during your free consultation and may vary based on project scope. Custom quotes available for all services.</span>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredServices.map((service, i) => {
              const selected = selectedServices[service.id];
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className={`h-full transition-all border-2 ${selected ? 'border-[#006847] shadow-md' : 'border-gray-200 hover:border-[#A4D65E]'}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-[#006847]">{service.icon}</div>
                          <CardTitle className="text-base leading-tight">{service.title}</CardTitle>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${CATEGORY_COLORS[service.category]}`}>
                          {service.category}
                        </span>
                      </div>
                      <CardDescription className="text-xs mt-1">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-0">
                      {service.pricing.map(p => (
                        <button
                          key={p.tier}
                          type="button"
                          onClick={() => toggleService(service.id, p.tier, p.price)}
                          className={`w-full text-left rounded-lg border px-3 py-2 text-sm transition-all ${
                            selected?.tier === p.tier
                              ? 'border-[#006847] bg-[#006847]/5 ring-1 ring-[#006847]'
                              : 'border-gray-200 hover:border-[#A4D65E] hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#006847]">{p.tier}</span>
                            <span className="font-bold text-gray-800">
                              {p.price === 0 ? 'FREE' : `$${p.price.toLocaleString()}`}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{p.label}</p>
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Estimate Summary ── */}
        {selectedCount > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#006847]/5 border border-[#A4D65E] rounded-2xl p-6 space-y-3"
          >
            <h3 className="font-bold text-lg text-[#006847]">Order Summary</h3>
            <div className="space-y-2">
              {Object.entries(selectedServices).map(([id, val]) => {
                const svc = SERVICES.find(s => s.id === id);
                return (
                  <div key={id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{svc?.title} — <span className="text-gray-500">{val.tier}</span></span>
                    <span className="font-semibold">{val.price === 0 ? 'FREE' : `$${val.price.toLocaleString()}`}</span>
                  </div>
                );
              })}
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Estimated Total</span>
              <span className="text-[#006847]">${totalEstimate.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500">* Estimates are not final invoices. Final pricing confirmed after consultation.</p>
          </motion.section>
        )}

        {/* ── Step 2: Your Information ── */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#006847] text-white font-bold text-sm">2</div>
            <h2 className="text-2xl font-bold">Your Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* First Name */}
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
              <Input id="firstName" placeholder="e.g. Marie" {...register('firstName')} />
              {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
            </div>
            {/* Last Name */}
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
              <Input id="lastName" placeholder="e.g. Johnson" {...register('lastName')} />
              {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
            </div>
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
              <Input id="phone" type="tel" placeholder="(504) 555-0100" {...register('phone')} />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
            </div>
            {/* Business Name */}
            <div className="space-y-1.5">
              <Label htmlFor="businessName">Business Name <span className="text-red-500">*</span></Label>
              <Input id="businessName" placeholder="e.g. Creole Kitchen Delights" {...register('businessName')} />
              {errors.businessName && <p className="text-xs text-red-500">{errors.businessName.message}</p>}
            </div>
            {/* Business Type */}
            <div className="space-y-1.5">
              <Label htmlFor="businessType">Business Type <span className="text-red-500">*</span></Label>
              <Select onValueChange={v => setValue('businessType', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sole-proprietor">Sole Proprietor</SelectItem>
                  <SelectItem value="llc">LLC</SelectItem>
                  <SelectItem value="corporation">Corporation</SelectItem>
                  <SelectItem value="nonprofit">Nonprofit / 501(c)(3)</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="startup">Startup / Pre-Launch</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.businessType && <p className="text-xs text-red-500">{errors.businessType.message}</p>}
            </div>
            {/* Parish */}
            <div className="space-y-1.5">
              <Label htmlFor="parish">Louisiana Parish</Label>
              <Select onValueChange={v => setValue('parish', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your parish" />
                </SelectTrigger>
                <SelectContent>
                  {['East Baton Rouge','Orleans','Jefferson','St. Tammany','Caddo','Calcasieu','Tangipahoa','Lafayette','Ouachita','St. Landry','Other / Out of State'].map(p => (
                    <SelectItem key={p} value={p.toLowerCase().replace(/\s+/g, '-')}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Website */}
            <div className="space-y-1.5">
              <Label htmlFor="website">Website (optional)</Label>
              <Input id="website" placeholder="https://yourbusiness.com" {...register('website')} />
            </div>
          </div>

          {/* How Did You Hear */}
          <div className="space-y-1.5">
            <Label htmlFor="howHeard">How did you hear about us?</Label>
            <Select onValueChange={v => setValue('howHeard', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="social-media">Social Media</SelectItem>
                <SelectItem value="google">Google Search</SelectItem>
                <SelectItem value="referral">Referral / Word of Mouth</SelectItem>
                <SelectItem value="event">DowUrk Event or Workshop</SelectItem>
                <SelectItem value="partner">Partner Organization (SBA, SCORE, LSBDC)</SelectItem>
                <SelectItem value="website">DowUrk Website</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* ── Step 3: Project Details ── */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#006847] text-white font-bold text-sm">3</div>
            <h2 className="text-2xl font-bold">Project Details</h2>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="projectDescription">
              Describe Your Project / Goals <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="projectDescription"
              rows={5}
              placeholder="Tell us about your business, what you're trying to achieve, any specific challenges, and what success looks like for you..."
              {...register('projectDescription')}
            />
            {errors.projectDescription && <p className="text-xs text-red-500">{errors.projectDescription.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Timeline */}
            <div className="space-y-1.5">
              <Label>Desired Timeline <span className="text-red-500">*</span></Label>
              <Select onValueChange={v => setValue('timeline', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">ASAP (within 2 weeks)</SelectItem>
                  <SelectItem value="1-month">Within 1 month</SelectItem>
                  <SelectItem value="1-3-months">1–3 months</SelectItem>
                  <SelectItem value="3-6-months">3–6 months</SelectItem>
                  <SelectItem value="flexible">Flexible / No rush</SelectItem>
                </SelectContent>
              </Select>
              {errors.timeline && <p className="text-xs text-red-500">{errors.timeline.message}</p>}
            </div>
            {/* Budget */}
            <div className="space-y-1.5">
              <Label>Overall Budget Range</Label>
              <Select onValueChange={v => setValue('budget', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-500">Under $500</SelectItem>
                  <SelectItem value="500-1500">$500 – $1,500</SelectItem>
                  <SelectItem value="1500-5000">$1,500 – $5,000</SelectItem>
                  <SelectItem value="5000-10000">$5,000 – $10,000</SelectItem>
                  <SelectItem value="over-10000">Over $10,000</SelectItem>
                  <SelectItem value="grant-funded">Grant / Externally Funded</SelectItem>
                  <SelectItem value="tbd">To Be Determined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* ── Step 4: Agreement & Submit ── */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#006847] text-white font-bold text-sm">4</div>
            <h2 className="text-2xl font-bold">Agreement & Submit</h2>
          </div>

          <Card className="border-[#A4D65E]">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="agreeTerms"
                  checked={agreeTerms}
                  onCheckedChange={v => setValue('agreeTerms', v)}
                  className="mt-0.5 data-[state=checked]:bg-[#006847] data-[state=checked]:border-[#006847]"
                />
                <Label htmlFor="agreeTerms" className="text-sm leading-relaxed cursor-pointer">
                  I acknowledge that the prices shown are <strong>suggested starting rates</strong> and that final pricing will be confirmed after a consultation with the DowUrk Inc. team. I agree to be contacted by DowUrk Inc. regarding this service request, and I consent to DowUrk's{' '}
                  <Link to="/privacy-policy" className="text-[#006847] underline">Privacy Policy</Link>.
                  <span className="text-red-500 ml-1">*</span>
                </Label>
              </div>
              {errors.agreeTerms && <p className="text-xs text-red-500 ml-7">{errors.agreeTerms.message}</p>}
            </CardContent>
          </Card>

          {selectedCount === 0 && (
            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm">
              <Info className="h-4 w-4 flex-shrink-0" />
              Please select at least one service before submitting.
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button
              type="submit"
              disabled={selectedCount === 0}
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90 text-white font-bold px-12 py-6 text-lg disabled:opacity-50"
            >
              Submit Service Order
            </Button>
            <div className="text-sm text-gray-500 text-center sm:text-left">
              {selectedCount > 0
                ? <>Submitting <strong>{selectedCount} service{selectedCount > 1 ? 's' : ''}</strong> · Est. <strong>${totalEstimate.toLocaleString()}</strong></>
                : 'No services selected yet'}
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center">
            DowUrk® Inc. · UEI: PNMVVH9EWSD3 · NAICS: 813410 · CAGE: 8JUP7 · TIN: 81-3555399 · 501(c)(3) Public Charity
          </p>
        </section>
      </form>
    </div>
  );
}

export default ServiceOrderForm;
