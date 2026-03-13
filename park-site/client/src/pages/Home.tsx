/* =============================================================
 * DowUrk & Hammond Jr. Tors Community Sports Campus — Home Page
 * Design: Southern Athletic Heritage — Official Brand Refresh
 * DowUrk Brand: Light Green (#6DBE45) + Dark Green (#1A5C2A)
 * Hammond Jr. Tors Brand: Purple + Black + Grey
 * SLU Tribute: Green + Gold accent (location section only)
 * Gaming Station: Unchanged (dark esports aesthetic)
 * Typography: Oswald (display) + Source Sans 3 (body)
 * Layout: Asymmetric editorial, full-bleed imagery, 13-zone campus structure
 * Site: 58 Acres, Riverside Lane, Tickfaw, LA — on the Tangipahoa River
 */

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const LOGOS = {
  hummingbird: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/hummingbird_logo_4b760130.png",
  // Full-color transparent version — use on light/hero backgrounds
  dowurkTransparent: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/dowurk_shield_transparent_49ffcce6.png",
  // All-white version — use on dark green navbar/footer backgrounds
  dowurkWhite: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/dowurk_shield_white_4aee80c7.png",
  hammondJrTors: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/hammond_jr_tors_logo_9a2175d7.jpg",
};

const IMAGES = {
  campusAerial: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/campus_aerial_ae8345e3.png",
  expandedMasterPlan: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/master_plan_v4_final_c25ba149.png",
  // Zone-specific renderings (all 17 zones)
  zone01: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone01_baseball_02113934.png",
  zone02: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone02_football_90c7af17.png",
  zone03: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone03_education_5934331d.png",
  zone04: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone04_agriculture_4eab0318.png",
  zone05: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone05_training_ffcfd7c7.png",
  zone06: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone06_plaza_6fe35dfb.png",
  zone07: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone07_riverfront_a46549be.png",
  zone08: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone08_expansion_9c16bd45.png",
  zone09: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone09_museum_50422765.png",
  zone10: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone10_basketball_covered-dni7qEimkAcGabeVWYjZpS.png",
  zone11: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone11_music_0b9497b7.png",
  zone12: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone12_gaming_123411fd.png",
  zone13: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone13_aquatic_bab4bfe6.png",
  zone14: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone14_maintenance_5a3c9a7f.png",
  zone15: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone15_playground_v4-XtmwQdXQP6V44EJAMzF8Qu.png",
  zone16: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone16_cafe_v3-H5G2JGKidYJvwnKBUcjXKz.png",
  zone17: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone17_early_childhood_v1-jxpbtyXbHr4rAUQCZxXpp2.png",
  zone18: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone17_daycare_v3-kvRSU5WUVcAFyXTaUBL8YN.png",
  // Legacy aliases for sections that reference old names
  stadium: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone01_baseball_02113934.png",
  educationCenter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone03_education_5934331d.png",
  trainingCenter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone05_training_ffcfd7c7.png",
  communityPlaza: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone06_plaza_6fe35dfb.png",
  footballFields: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone02_football_90c7af17.png",
  communityCenter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone03_education_5934331d.png",
  agHub: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone04_agriculture_4eab0318.png",
  riverfront: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone07_riverfront_a46549be.png",
  museumExterior: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone09_museum_50422765.png",
  museumInterior: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone09_museum_50422765.png",
  basketballCourts: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone10_basketball_covered-dni7qEimkAcGabeVWYjZpS.png",
  musicalArts: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone11_music_0b9497b7.png",
  gamingStation: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone12_gaming_123411fd.png",
  aquaticCenter: "https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/zone13_aquatic_bab4bfe6.png",
};

function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return { count, ref };
}

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function HummingbirdMark({ size = 40 }: { size?: number; color?: string }) {
  return (
    <img src={LOGOS.hummingbird} alt="DowUrk Hummingbird" width={size} height={size} style={{ objectFit: 'contain' }} />
  );
}

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(value);
  return (
    <div className="text-center">
      <div className="font-display text-5xl font-bold text-white leading-none">
        <span ref={ref}>{count}</span><span className="text-gold">{suffix}</span>
      </div>
      <div className="font-body text-sm text-white/70 mt-2 uppercase tracking-widest">{label}</div>
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = [
    { label: "Overview", href: "#overview" },
    { label: "Master Plan", href: "#master-plan" },
    { label: "Jr. Tors", href: "#jr-tors" },
    { label: "Museum & HQ", href: "#museum" },
    { label: "Facilities", href: "#facilities" },
    { label: "USDA Fit", href: "#usda" },
    { label: "Amenities", href: "#amenities" },
    { label: "Impact", href: "#impact" },
    { label: "Timeline", href: "#timeline" },
    { label: "Sponsorship", href: "#sponsorship" },
    { label: "Contact", href: "#contact" },
  ];
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-dowurk-green-dark shadow-lg" : "bg-transparent"}`}>
      <div className="container flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-3">
          <img src={LOGOS.dowurkWhite} alt="DowUrk" height={44} style={{ height: 44, width: 'auto', objectFit: 'contain' }} />
          <div className="hidden sm:block">
            <div className="font-body text-white/50 text-xs leading-none uppercase tracking-widest">Community Sports Campus</div>
          </div>
        </a>
        <div className="hidden lg:flex items-center gap-5">
          {links.map(l => (
            <a key={l.href} href={l.href} className="font-display text-xs font-medium text-white/80 hover:text-gold transition-colors uppercase tracking-wider">{l.label}</a>
          ))}
        </div>
        <button className="lg:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <div className="w-6 h-0.5 bg-white mb-1.5" /><div className="w-6 h-0.5 bg-white mb-1.5" /><div className="w-6 h-0.5 bg-white" />
        </button>
      </div>
      {menuOpen && (
        <div className="lg:hidden bg-dowurk-green-dark border-t border-white/10">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="block px-6 py-3 font-display text-sm font-medium text-white/80 hover:text-gold hover:bg-white/5 transition-colors uppercase tracking-wider">{l.label}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

// Contact Form component
function ContactForm() {
  const [formData, setFormData] = useState({ name: '', org: '', email: '', phone: '', interest: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submission (no backend in static site)
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <div className="p-10 text-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(109,190,69,0.3)' }}>
        <div className="text-5xl mb-4">✓</div>
        <div className="font-display text-2xl font-bold text-white uppercase tracking-wide mb-3">Message Received</div>
        <p className="font-body text-white/60 text-sm">Thank you for reaching out. Robert Jerrod Brown and the DowUrk Inc. team will be in touch shortly.</p>
      </div>
    );
  }

  const inputClass = "w-full bg-white/5 border border-white/10 text-white placeholder-white/30 font-body text-sm px-4 py-3 focus:outline-none focus:border-dowurk-green transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-display text-xs tracking-widest text-white/50 uppercase block mb-1.5">Full Name *</label>
          <input name="name" required value={formData.name} onChange={handleChange} placeholder="Your full name" className={inputClass} />
        </div>
        <div>
          <label className="font-display text-xs tracking-widest text-white/50 uppercase block mb-1.5">Organization</label>
          <input name="org" value={formData.org} onChange={handleChange} placeholder="Company / Agency" className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-display text-xs tracking-widest text-white/50 uppercase block mb-1.5">Email *</label>
          <input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="your@email.com" className={inputClass} />
        </div>
        <div>
          <label className="font-display text-xs tracking-widest text-white/50 uppercase block mb-1.5">Phone</label>
          <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="(555) 000-0000" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="font-display text-xs tracking-widest text-white/50 uppercase block mb-1.5">Area of Interest *</label>
        <select name="interest" required value={formData.interest} onChange={handleChange} className={inputClass + " cursor-pointer"}>
          <option value="" disabled>Select an option...</option>
          <option value="grant">Grant Funding / USDA Application</option>
          <option value="sponsor">Corporate Sponsorship / Naming Rights</option>
          <option value="government">Government Partnership (City / State / Federal)</option>
          <option value="nonprofit">Nonprofit / Community Organization</option>
          <option value="investor">Private Investor</option>
          <option value="media">Media / Press Inquiry</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label className="font-display text-xs tracking-widest text-white/50 uppercase block mb-1.5">Message *</label>
        <textarea name="message" required rows={5} value={formData.message} onChange={handleChange}
          placeholder="Tell us about your interest in the DowUrk & Hammond Jr. Tors Community Sports Campus..."
          className={inputClass + " resize-none"} />
      </div>
      <button type="submit" disabled={submitting}
        className="w-full py-4 font-display font-bold uppercase tracking-widest text-sm transition-all"
        style={{ background: submitting ? 'rgba(109,190,69,0.5)' : '#6DBE45', color: '#0D2B14' }}>
        {submitting ? 'Sending...' : 'Submit Inquiry'}
      </button>
      <p className="font-body text-white/30 text-xs text-center">
        DowUrk Inc. · info@dowurktoday.org · www.dowurktoday.org · 501(c)(3) Nonprofit
      </p>
    </form>
  );
}

// Zone badge component
function ZoneBadge({ number, label, color }: { number: string; label: string; color: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border" style={{ borderColor: color }}>
      <span className="font-display text-xs font-bold" style={{ color }}>{number}</span>
      <span className="font-body text-xs text-foreground/70 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function Home() {

  // All 18 campus zones
  const zones = [
    {
      number: "01",
      title: "DowUrk Baseball Sports Complex",
      subtitle: "Home of the DowUrk Hummingbirds",
      image: IMAGES.stadium,
      color: "oklch(0.32 0.1 152)",
      colorLabel: "Athletic",
      usda: "Community Center / Educational Services",
      features: ["DowUrk Hummingbirds Stadium (500–800 seats)", "Practice Field A — Youth Training", "Practice Field B — League Games", "Softball Field — Diamond League"],
      desc: "The centerpiece of the campus — a professional-style baseball stadium designed to feel like a small collegiate or minor-league field, giving youth athletes a memorable game-day experience.",
    },
    {
      number: "02",
      title: "Hammond Jr. Tors Football Zone",
      subtitle: "Home of the Hammond Jr. Tors Youth Football Organization",
      image: IMAGES.footballFields,
      color: "oklch(0.45 0.2 300)",
      colorLabel: "Football",
      usda: "Community Center / Educational Services",
      features: ["Two full-size youth football fields", "End zones branded 'Hammond Jr. Tors'", "Goal posts, sideline benches, bleachers", "Stadium lighting for evening games", "Scoreboard & facility building"],
      desc: "Dedicated field space for the Hammond Jr. Tors Youth Football Organization — a non-profit serving youth athletes in Tangipahoa Parish with two full-size fields, bleachers, and evening lighting.",
    },
    {
      number: "03",
      title: "Education & Community Campus",
      subtitle: "Leadership, Arts, Technology & Distance Learning",
      image: IMAGES.communityCenter,
      color: "oklch(0.42 0.14 240)",
      colorLabel: "Education",
      usda: "Educational Facility / Distance Learning / Tele-Education",
      features: ["Community Center Building (12,000–15,000 sq ft)", "Leadership & Education Center", "Arts & Creative Intelligence (BEAM) Classrooms", "Computer Lab & Distance Learning Center", "Covered walkways connecting all buildings"],
      desc: "The educational heart of the campus — a connected cluster of buildings supporting leadership development, arts programming, digital access, and distance learning for youth and families.",
    },
    {
      number: "04",
      title: "Food & Agriculture Hub",
      subtitle: "Community Kitchen, Greenhouses & Ag Education",
      image: IMAGES.agHub,
      color: "oklch(0.48 0.14 140)",
      colorLabel: "Agriculture",
      usda: "Local Food Systems / Greenhouses / Food Hubs",
      features: ["Community Kitchen & Food Hub building", "Four commercial greenhouse structures", "Agriculture education plots (raised beds)", "Outdoor food production area", "Nutrition education signage & compost stations"],
      desc: "A farm-to-table education zone aligned with USDA priorities — combining a commercial community kitchen, production greenhouses, and hands-on agriculture education plots for youth and community members.",
    },
    {
      number: "05",
      title: "Indoor Training & Performance Center",
      subtitle: "Year-Round Athletic Training Facility",
      image: IMAGES.trainingCenter,
      color: "oklch(0.32 0.1 152)",
      colorLabel: "Athletic",
      usda: "Community Center / Educational Services",
      features: ["Batting cages & pitching tunnels", "Strength & conditioning area", "Sports medicine room", "Training classrooms", "Equipment storage"],
      desc: "An 8,000–12,000 sq ft indoor facility allowing athletes to train year-round regardless of Louisiana weather, supporting all DowUrk and Hammond Jr. Tors programs.",
    },
    {
      number: "06",
      title: "Community Plaza & Arrival Zone",
      subtitle: "Campus Gateway & Central Gathering Space",
      image: IMAGES.communityPlaza,
      color: "oklch(0.6 0.14 60)",
      colorLabel: "Community",
      usda: "Community Center / Public Gathering",
      features: ["Monument entrance sign", "Landscaped entrance drive", "200+ vehicle parking with ADA spaces", "Food truck & concession zones", "Event staging platform", "Sponsor recognition signage"],
      desc: "The welcoming front door of the campus — a vibrant community plaza connecting all zones, designed for tournaments, festivals, leadership workshops, and everyday community life.",
    },
    {
      number: "07",
      title: "Tangipahoa Riverfront Recreation",
      subtitle: "Nature Trail, Amphitheater & River Access",
      image: IMAGES.riverfront,
      color: "oklch(0.45 0.12 210)",
      colorLabel: "Recreation",
      usda: "Community Center / Recreational / Educational",
      features: ["River walking trail through hardwood forest", "Wooden river overlook platforms", "Outdoor amphitheater (hillside seating)", "Nature education interpretive stations", "Picnic areas under live oaks & cypress"],
      desc: "The campus's most distinctive natural asset — 58 wooded acres on the Tangipahoa River provide a stunning riverfront recreation zone with trails, overlooks, and an outdoor amphitheater under ancient hardwoods.",
    },
    {
      number: "08",
      title: "Future Expansion Zone",
      subtitle: "Reserved for Campus Growth",
      image: IMAGES.campusAerial,
      color: "oklch(0.55 0.04 260)",
      colorLabel: "Expansion",
      usda: "Future Community Facilities",
      features: ["Additional athletic fields", "Soccer & multi-sport fields", "Youth innovation center", "Expanded training facilities", "Additional parking & infrastructure"],
      desc: "The 58-acre site provides ample room for future expansion — ensuring the campus can grow alongside the community it serves for decades to come.",
    },
    {
      number: "09",
      title: "Museum of 21st-Century Black Excellence",
      subtitle: "DowUrk Inc. Headquarters & Cultural Institution",
      image: IMAGES.museumExterior,
      color: "oklch(0.18 0.04 60)",
      colorLabel: "Museum & HQ",
      usda: "Museum / Educational Facility / Cultural Institution",
      features: ["Flagship museum building (Afrofuturist design)", "DowUrk Inc. corporate headquarters wing", "8 permanent exhibit galleries", "Digital archive & VR/AR experience center", "Artist residency & co-working space", "Youth Creators Council studio"],
      desc: "The crown jewel of the campus — a dual-purpose flagship building housing both the Museum of 21st-Century Black Excellence and DowUrk Inc. headquarters, documenting and celebrating Black brilliance, innovation, and culture for generations to come.",
    },
    {
      number: "10",
      title: "Basketball Court Complex",
      subtitle: "Covered Courts — Rain or Shine, Year-Round",
      image: IMAGES.basketballCourts,
      color: "oklch(0.52 0.18 40)",
      colorLabel: "Courts",
      usda: "Community Center / Recreational Services",
      features: ["Two full-size regulation courts under a large open-sided steel canopy", "Premium sport court surface in DowUrk green & gold", "DowUrk Hummingbirds center court logo on both courts", "Open-air sides for natural ventilation — fully rain-protected", "LED lighting under the canopy for evening play", "Spectator bleachers on all sides, ADA-accessible"],
      desc: "Two regulation basketball courts sheltered by a bold open-sided steel canopy roof — fully protected from Louisiana rain and sun while remaining open-air. Designed for year-round youth leagues, tournaments, pickup games, and community events regardless of the weather.",
    },
    {
      number: "11",
      title: "Musical Arts Center & Drumline Hall",
      subtitle: "Honoring the Drum Captain Legacy",
      image: IMAGES.musicalArts,
      color: "oklch(0.38 0.1 300)",
      colorLabel: "Music",
      usda: "Educational Facility / Arts & Cultural Programming",
      features: ["Dedicated drumline rehearsal hall", "Full music instruction classrooms", "Covered outdoor performance pavilion", "Professional acoustic wall treatment", "Recording studio & production suite", "Instrument storage & uniform room"],
      desc: "A purpose-built musical arts facility honoring the drum captain tradition — providing youth with professional-grade rehearsal space, performance opportunities, and music education from drumline to full band.",
    },
    {
      number: "12",
      title: "DowUrk Gaming Station",
      subtitle: "Esports, Technology & Digital Community",
      image: IMAGES.gamingStation,
      color: "oklch(0.55 0.2 145)",
      colorLabel: "Gaming",
      usda: "Distance Learning / Technology Access / Educational Services",
      features: ["High-performance gaming PC stations", "Esports tournament arena & streaming setup", "Large exterior LED display screen", "Console gaming & VR experience zone", "Youth coding & game development classes", "Twitch/YouTube live streaming capability"],
      desc: "A state-of-the-art esports and gaming facility — where competitive gaming meets digital literacy, connecting youth to careers in technology, game development, streaming, and the growing esports industry.",
    },
    {
      number: "13",
      title: "DowUrk Aquatic Center",
      subtitle: "Indoor Pool, Splash Pad & Community Water Recreation",
      image: IMAGES.aquaticCenter,
      color: "oklch(0.48 0.15 220)",
      colorLabel: "Aquatic",
      usda: "Community Center / Recreational / Health Services",
      features: ["Indoor competition-grade lap pool", "Outdoor zero-entry community pool", "Splash pad with water play features", "Water slide & recreational water features", "Sauna suite & relaxation lounge", "Swim lessons & water safety programs"],
      desc: "A full aquatic complex serving the entire Tangipahoa Parish community — from competitive swim teams and water safety education to family recreation, splash pad play, sauna recovery, and community health programming.",
    },
    {
      number: "14",
      title: "Maintenance, Storage & Groundskeeping",
      subtitle: "Campus Operations & Facilities Management",
      image: IMAGES.zone14,
      color: "oklch(0.38 0.06 200)",
      colorLabel: "Operations",
      usda: "Essential Campus Infrastructure",
      features: ["Maintenance & repair workshop", "Groundskeeping equipment storage", "Landscaping supplies & tool storage", "Utility & mechanical room", "Staff locker rooms & break room", "Campus vehicle & equipment parking"],
      desc: "A campus of this magnitude requires a dedicated operations facility — housing all groundskeeping equipment, maintenance workshops, utility infrastructure, and facilities management staff to keep every zone running at peak condition year-round.",
    },
    {
      number: "15",
      title: "Children's Park & Playground",
      subtitle: "Safe Play Space for Kids of All Ages",
      image: IMAGES.zone15,
      color: "oklch(0.58 0.18 140)",
      colorLabel: "Play",
      usda: "Community Center / Recreational / Educational",
      features: ["Age-appropriate play structures (ages 2–5 and 6–12)", "Rubber safety surfacing throughout", "Shaded pavilion with benches for parents", "Sensory play area for children with disabilities", "Water play feature (seasonal)", "Fenced perimeter with secure entry gates"],
      desc: "A dedicated children's park and playground giving the youngest campus visitors their own safe, age-appropriate space to play, explore, and develop — fully fenced, ADA-accessible, and shaded for Louisiana's climate.",
    },
    {
      number: "16",
      title: "DowUrk Café & Juice Bar",
      subtitle: "Courtyard Café · Healthy Food & Community Gathering",
      image: IMAGES.zone16,
      color: "oklch(0.52 0.14 60)",
      colorLabel: "Café",
      usda: "Community Support Services / Food Hub",
      features: ["Fresh juice bar & smoothie station", "Light café menu: wraps, salads, acai bowls", "Indoor seating (40 seats) + courtyard patio", "Local produce sourced from campus greenhouse", "Coffee, tea & specialty beverages", "Private event & meeting room rental"],
      desc: "A community café and juice bar positioned near the central courtyard — serving fresh, healthy food sourced directly from the campus greenhouse, providing a social hub for athletes, families, and visitors throughout the day.",
    },
    {
      number: "17",
      title: "DowUrk Early Childhood Learning Center",
      subtitle: "Daycare & Pre-K Education · Ages 6 Weeks – 5 Years",
      image: IMAGES.zone17,
      color: "oklch(0.48 0.16 270)",
      colorLabel: "Early Childhood",
      usda: "Educational Facility / Community Support Services / Child Care",
      features: ["Licensed daycare: Ages 6 weeks – 3 years", "Pre-K program: Ages 3–5", "Outdoor play yard (fenced & shaded)", "Nutritious meals from campus kitchen", "STEM & arts enrichment curriculum", "Sliding-scale tuition for low-income families"],
      desc: "An on-campus early childhood learning center providing licensed daycare and Pre-K education — a critical community service that allows parents to participate in campus programs while their youngest children are safe, learning, and thriving nearby. USDA-eligible as an educational and community support facility.",
    },
  ];

  const usdaRows = [
    { component: "Multi-sports fields & youth athletics", usda: "Community center / educational services" },
    { component: "Hammond Jr. Tors Football Fields", usda: "Community center / recreational services" },
    { component: "Arts & Creative Intelligence labs (BEAM)", usda: "Museum, educational facility" },
    { component: "Technology & digital access (Computer Lab)", usda: "Distance learning / tele-education" },
    { component: "Agriculture & food systems (Greenhouses)", usda: "Local food systems, greenhouses, food hubs" },
    { component: "Community Kitchen & Food Hub", usda: "Local food systems / community support" },
    { component: "Workforce + youth development programs", usda: "Community support services" },
    { component: "Tangipahoa Riverfront Recreation", usda: "Community center / recreational / educational" },
    { component: "Museum of 21st-Century Black Excellence", usda: "Museum / Educational Facility / Cultural Institution" },
    { component: "DowUrk Inc. Headquarters", usda: "Community support services / economic development" },
    { component: "Basketball Court Complex", usda: "Community center / recreational services" },
    { component: "Musical Arts Center & Drumline Hall", usda: "Educational facility / arts & cultural programming" },
    { component: "Gaming Station (Esports & Digital Literacy)", usda: "Distance learning / technology access / educational" },
    { component: "Aquatic Center (Pool, Splash Pad, Sauna, Swim Programs)", usda: "Community center / recreational / health services" },
    { component: "Maintenance, Storage & Groundskeeping Facility", usda: "Essential campus infrastructure / operational facility" },
    { component: "Outdoor Track & Field (400m Competition Track)", usda: "Community center / educational services / recreational" },
    { component: "Children's Park & Playground", usda: "Community center / recreational / educational" },
    { component: "DowUrk Café & Juice Bar", usda: "Community support services / local food systems" },
    { component: "Early Childhood Learning Center (Daycare & Pre-K)", usda: "Educational facility / community support services / child care" },
    { component: "Restroom & Hydration Stations (Campus-Wide)", usda: "Essential public infrastructure / community support" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${IMAGES.campusAerial})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.12_0.06_152)] via-[oklch(0.12_0.06_152/0.65)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.12_0.06_152/0.75)] to-transparent" />
        <div className="relative container pb-20 pt-32">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex items-center gap-4 mb-6">
              <img src={LOGOS.hummingbird} alt="DowUrk Hummingbird" style={{ height: 64, width: 'auto', objectFit: 'contain' }} />
              <div className="h-px flex-1 max-w-xs bg-white/20" />
              <span className="font-body text-white/60 text-sm uppercase tracking-widest">Tickfaw · Tangipahoa Parish, Louisiana</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-none uppercase tracking-tight mb-2">
              DowUrk &amp;<br />
              <span className="text-gold">Hammond Jr. Tors</span>
            </h1>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-white/80 uppercase tracking-wide mb-6">
              Community Sports Campus
            </h2>
            <p className="font-body text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              A <strong className="text-white">58-acre</strong> youth development campus on the{" "}
              <strong className="text-gold">Tangipahoa River</strong> — uniting the DowUrk Hummingbirds, the Hammond Jr. Tors
              Youth Football Organization, and a full community education, food, and recreation campus into one transformative
              facility for Tangipahoa Parish.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <span className="stat-badge">58 Acres</span>
              <span className="stat-badge">Tangipahoa River</span>
              <span className="stat-badge">17 Campus Zones</span>
              <span className="stat-badge">USDA Eligible</span>
              <span className="stat-badge">2 Youth Orgs</span>
            </div>
            <div className="flex flex-wrap gap-4 mt-10">
              <a href="#master-plan" className="inline-flex items-center gap-2 bg-dowurk-gold text-dowurk-charcoal font-display font-bold text-sm uppercase tracking-wider px-6 py-3 hover:bg-white transition-colors">
                View Master Plan
              </a>
              <a href="#jr-tors" className="inline-flex items-center gap-2 border border-white/40 text-white font-display font-bold text-sm uppercase tracking-wider px-6 py-3 hover:border-white hover:bg-white/10 transition-colors">
                Hammond Jr. Tors
              </a>
              <a href="#museum" className="inline-flex items-center gap-2 border border-white/40 text-white font-display font-bold text-sm uppercase tracking-wider px-6 py-3 hover:border-white hover:bg-white/10 transition-colors">
                Museum &amp; HQ
              </a>
              <a href="#usda" className="inline-flex items-center gap-2 border border-gold/60 text-gold font-display font-bold text-sm uppercase tracking-wider px-6 py-3 hover:border-gold hover:bg-gold/10 transition-colors">
                USDA Eligibility
              </a>
            </div>
          </motion.div>
        </div>
        <motion.div className="absolute bottom-8 right-8 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <div className="w-px h-12 bg-white/30" />
        </motion.div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section style={{ background: "oklch(0.26 0.1 152)" }} className="py-12" id="overview">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <StatCounter value={58} suffix=" Acres" label="Total Campus Size" />
            <StatCounter value={17} suffix=" Zones" label="Campus Zones" />
            <StatCounter value={500} suffix="+" label="Youth Served Annually" />
            <StatCounter value={2} suffix="" label="Youth Organizations" />
            <StatCounter value={6000} suffix=" Seats" label="Stadium Capacity" />
          </div>
        </div>
      </section>

      {/* ===== SLU TRIBUTE BANNER (subtle green + gold nod to Southeastern Louisiana University) ===== */}
      <div style={{ background: "oklch(0.28 0.09 152)", borderBottom: "3px solid oklch(0.72 0.14 75)" }} className="py-3">
        <div className="container flex flex-wrap items-center justify-center gap-3 text-center">
          <span className="font-body text-white/60 text-xs uppercase tracking-widest">Located in the heart of</span>
          <span className="font-display text-sm font-bold uppercase tracking-wide" style={{ color: "oklch(0.72 0.14 75)" }}>Southeastern Louisiana University Country</span>
          <span className="font-body text-white/40 text-xs">·</span>
          <span className="font-body text-white/60 text-xs uppercase tracking-widest">Hammond &amp; Tickfaw, Tangipahoa Parish, LA</span>
        </div>
      </div>

      {/* ===== OVERVIEW ===== */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <div>
                <div className="section-divider" />
                <h2 className="font-display text-4xl md:text-5xl font-bold text-dowurk-green uppercase tracking-tight mb-6">
                  Two Organizations.<br />
                  <span className="text-gold">One Unified Campus.</span>
                </h2>
                <p className="font-body text-base text-foreground/80 leading-relaxed mb-4">
                  The DowUrk &amp; Hammond Jr. Tors Community Sports Campus merges two powerful youth-serving organizations
                  onto a single 58-acre site on the Tangipahoa River in Tickfaw, Louisiana — creating one of the most
                  comprehensive youth development campuses in the region.
                </p>
                <p className="font-body text-base text-foreground/80 leading-relaxed mb-6">
                  The campus goes far beyond athletics. It integrates <strong>arts and creative intelligence labs</strong>,
                  a <strong>computer lab and distance learning center</strong>, a <strong>community kitchen and food hub</strong>,
                  and <strong>greenhouse agriculture education</strong> — all mapped directly to USDA Community Facilities
                  eligible use categories.
                </p>
                <div className="space-y-3">
                  {[
                    { org: "DowUrk Sports & Leadership Academy", color: "oklch(0.32 0.1 152)" },
                    { org: "DowUrk Diamond League — Youth Baseball & Softball", color: "oklch(0.32 0.1 152)" },
                    { org: "Hammond Jr. Tors Youth Football Organization", color: "oklch(0.65 0.22 300)" },
                    { org: "DowUrk Community Center & Education Campus", color: "oklch(0.42 0.14 240)" },
                    { org: "Community Kitchen, Food Hub & Ag Education", color: "oklch(0.48 0.14 140)" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 pl-5 relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: item.color }} />
                      <span className="font-body text-sm font-semibold text-foreground">{item.org}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="relative">
                <img src={IMAGES.communityCenter} alt="DowUrk Community Center" className="w-full rounded-sm shadow-2xl" />
                <div className="absolute -bottom-4 -left-4 bg-dowurk-green p-4 shadow-xl">
                  <div className="font-display text-white text-xs uppercase tracking-wider">Tickfaw, Louisiana</div>
                  <div className="font-display text-gold text-lg font-bold">On the Tangipahoa River</div>
                  <div className="font-body text-white/60 text-xs mt-0.5">58 Acres · Undeveloped Wooded Land</div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ===== MASTER PLAN ===== */}
      <section className="py-24 bg-muted" id="master-plan">
        <div className="container">
          <FadeUp>
            <div className="text-center mb-16">
              <div className="section-divider mx-auto" />
              <h2 className="font-display text-4xl md:text-5xl font-bold text-dowurk-green uppercase tracking-tight">
                Expanded Campus Master Plan
              </h2>
              <p className="font-body text-base text-muted-foreground mt-4 max-w-2xl mx-auto">
                58 acres on the Tangipahoa River — organized into 17 distinct campus zones connecting athletics,
                education, food systems, and riverfront recreation.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="relative rounded-sm overflow-hidden shadow-2xl border border-border">
              <img src={IMAGES.expandedMasterPlan} alt="DowUrk & Hammond Jr. Tors Community Sports Campus Master Site Plan" className="w-full" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dowurk-green-dark/90 to-transparent p-6">
                <div className="font-display text-white text-sm uppercase tracking-widest">
                  DowUrk &amp; Hammond Jr. Tors Community Sports Campus — Master Site Plan — 58 Acres — Tangipahoa Parish, Louisiana
                </div>
              </div>
            </div>
          </FadeUp>
          {/* Zone legend */}
          <FadeUp delay={0.25}>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { color: "bg-dowurk-green", label: "Zone 1 & 5", desc: "Baseball Complex & Indoor Training" },
                { color: "bg-orange-600", label: "Zone 2", desc: "Hammond Jr. Tors Football" },
                { color: "bg-blue-600", label: "Zone 3", desc: "Education & Community Campus" },
                { color: "bg-green-700", label: "Zone 4", desc: "Food & Agriculture Hub" },
                { color: "bg-amber-600", label: "Zone 6", desc: "Community Plaza & Arrival" },
                { color: "bg-cyan-700", label: "Zone 7", desc: "Tangipahoa Riverfront" },
                { color: "bg-gray-500", label: "Zone 8", desc: "Future Expansion" },
                { color: "bg-blue-400", label: "River", desc: "Tangipahoa River Corridor" },
              ].map((z, i) => (
                <div key={i} className="flex items-start gap-3 bg-white p-3 rounded-sm shadow-sm">
                  <div className={`w-4 h-4 rounded-sm mt-0.5 flex-shrink-0 ${z.color}`} />
                  <div>
                    <div className="font-display text-xs font-bold text-foreground uppercase tracking-wide">{z.label}</div>
                    <div className="font-body text-xs text-muted-foreground mt-0.5">{z.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== HAMMOND JR. TORS FEATURE SECTION ===== */}
      {/* Jr. Tors Brand: Purple #6B21A8 + Black + Grey — per Ralph Jerome Haynes' organization colors */}
      <section className="py-0 overflow-hidden" id="jr-tors" style={{ background: "oklch(0.12 0.04 300)" }}>
        <div className="grid md:grid-cols-2">
          <div className="relative h-80 md:h-auto">
            <img src={IMAGES.footballFields} alt="Hammond Jr. Tors Football Fields" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[oklch(0.14_0.06_40/0.85)]" />
          </div>
          <FadeUp className="flex items-center">
            <div className="p-10 md:p-16">
              <div className="flex items-center gap-4 mb-6">
                <img src={LOGOS.hammondJrTors} alt="Hammond Jr. Tors" style={{ height: 72, width: 72, objectFit: 'contain', borderRadius: '50%', background: 'oklch(0.22 0.02 300)' }} />
                <span className="font-body text-white/50 text-xs uppercase tracking-widest">Zone 02 — Football</span>
              </div>
              <div className="section-divider" style={{ background: "oklch(0.65 0.22 300)" }} />
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white uppercase tracking-tight mb-4">
                Hammond Jr. Tors<br />
                <span style={{ color: "oklch(0.65 0.22 300)" }}>Youth Football</span>
              </h2>
              <p className="font-body text-base text-white/80 leading-relaxed mb-8">
                The <strong className="text-white">Hammond Jr. Tors Youth Football Organization</strong> is a non-profit
                dedicated to youth athletic development in Tangipahoa Parish. The expanded campus dedicates a full football
                zone with two professional-quality fields, stadium lighting, bleachers, and a dedicated facility building —
                giving the Jr. Tors a permanent, professional home.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { stat: "2", label: "Full-Size Football Fields" },
                  { stat: "200+", label: "Spectator Bleacher Capacity" },
                  { stat: "4", label: "Stadium Light Poles per Field" },
                  { stat: "1", label: "Dedicated Facility Building" },
                ].map((item, i) => (
                  <div key={i} className="border p-4" style={{ borderColor: "oklch(0.65 0.22 300 / 0.4)", background: "oklch(0.16 0.05 300)" }}>
                    <div className="font-display text-2xl font-bold" style={{ color: "oklch(0.65 0.22 300)" }}>{item.stat}</div>
                    <div className="font-body text-xs text-white/60 mt-1 uppercase tracking-wider">{item.label}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {["End zones branded in purple & white — Hammond Jr. Tors", "Goal posts, sideline benches, and bleachers", "Evening game lighting for night games", "Scoreboard and facility building", "Shared access to campus training facilities"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 font-body text-sm text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "oklch(0.65 0.22 300)" }} />{f}
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== ALL 13 ZONES GRID ===== */}
      <section className="py-24 bg-background" id="facilities">
        <div className="container">
          <FadeUp>
            <div className="mb-16">
              <div className="section-divider" />
              <h2 className="font-display text-4xl md:text-5xl font-bold text-dowurk-green uppercase tracking-tight">
                All 17 Campus Zones
              </h2>
              <p className="font-body text-base text-muted-foreground mt-4 max-w-2xl">
                Every zone is purpose-built to serve youth, families, and the broader Tangipahoa Parish community — from
                elite athletics and esports to food education, aquatics, and riverfront recreation.
              </p>
            </div>
          </FadeUp>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {zones.map((zone, i) => (
              <FadeUp key={i} delay={i * 0.06}>
                <div className="facility-card group h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    <img src={zone.image} alt={zone.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="overlay">
                      <h3 className="font-display text-base font-bold text-white mb-2">{zone.title}</h3>
                      <ul className="space-y-1">
                        {zone.features.slice(0, 4).map((f, j) => (
                          <li key={j} className="font-body text-xs text-white/90 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-yellow-400 flex-shrink-0" />{f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="absolute top-3 left-3 text-xs font-display font-bold uppercase tracking-wider px-2 py-1 rounded-sm text-white" style={{ background: zone.number === "02" ? "oklch(0.45 0.2 300)" : zone.color }}>
                      Zone {zone.number}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display text-sm font-bold text-dowurk-green uppercase tracking-wide mb-1">{zone.title}</h3>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed flex-1">{zone.subtitle}</p>
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="font-body text-xs text-muted-foreground/70 uppercase tracking-wider mb-1">USDA Category</div>
                      <div className="font-body text-xs font-semibold text-foreground/80">{zone.usda}</div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RIVERFRONT FEATURE ===== */}
      <section className="py-0 overflow-hidden bg-dowurk-green-dark">
        <div className="grid md:grid-cols-2">
          <FadeUp className="flex items-center order-2 md:order-1">
            <div className="p-10 md:p-16">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-body text-white/40 text-xs uppercase tracking-widest">Zone 07 — Riverfront Recreation</span>
              </div>
              <div className="section-divider" />
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white uppercase tracking-tight mb-6">
                Tangipahoa River<br />
                <span className="text-gold">Riverfront Zone</span>
              </h2>
              <p className="font-body text-base text-white/80 leading-relaxed mb-6">
                The property's most extraordinary asset — 58.6 wooded acres of large hardwoods directly on the
                Tangipahoa River. The riverfront zone transforms this natural landscape into a community recreation and
                nature education destination unlike anything else in Tangipahoa Parish.
              </p>
              <div className="space-y-3">
                {[
                  { icon: "🌊", label: "River walking trail through ancient hardwood forest" },
                  { icon: "🪵", label: "Wooden river overlook platforms with safety railings" },
                  { icon: "🎭", label: "Outdoor amphitheater carved into natural hillside" },
                  { icon: "🌿", label: "Nature education interpretive stations" },
                  { icon: "🌳", label: "Picnic areas under live oaks, cypress, and magnolia" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-body text-sm text-white/80">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
          <div className="relative h-80 md:h-auto order-1 md:order-2">
            <img src={IMAGES.riverfront} alt="Tangipahoa River Riverfront Recreation" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[oklch(0.22_0.08_152/0.5)]" />
          </div>
        </div>
      </section>

      {/* ===== FOOD & AG FEATURE ===== */}
      <section className="py-0 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative h-80 md:h-auto">
            <img src={IMAGES.agHub} alt="Community Kitchen & Food Hub" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[oklch(0.18_0.08_140/0.85)]" />
          </div>
          <FadeUp className="flex items-center" >
            <div className="p-10 md:p-16" style={{ background: "oklch(0.18 0.08 140)" }}>
              <span className="font-body text-white/40 text-xs uppercase tracking-widest block mb-4">Zone 04 — Food &amp; Agriculture Hub</span>
              <div className="section-divider" style={{ background: "oklch(0.72 0.14 75)" }} />
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white uppercase tracking-tight mb-6">
                Community Kitchen<br />
                <span style={{ color: "oklch(0.72 0.14 75)" }}>&amp; Food Hub</span>
              </h2>
              <p className="font-body text-base text-white/80 leading-relaxed mb-6">
                A farm-to-table education ecosystem — connecting commercial greenhouse production, hands-on agriculture
                education plots, and a community kitchen into a single hub that feeds the campus and teaches youth about
                food systems, nutrition, and sustainable agriculture.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🏗️", label: "Community Kitchen & Food Hub Building" },
                  { icon: "🌱", label: "4 Commercial Greenhouse Structures" },
                  { icon: "🥬", label: "Agriculture Education Plots (Raised Beds)" },
                  { icon: "🍽️", label: "Outdoor Food Production Area" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 border border-white/20 p-3 rounded-sm">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-body text-xs text-white/80 leading-snug">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== MUSEUM & HQ FEATURE ===== */}
      <section className="py-0 overflow-hidden" id="museum" style={{ background: "oklch(0.10 0.04 60)" }}>
        {/* Full-bleed exterior hero */}
        <div className="relative h-[60vh] min-h-[420px] overflow-hidden">
          <img src={IMAGES.museumExterior} alt="Museum of 21st-Century Black Excellence" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.04_60)] via-[oklch(0.10_0.04_60/0.4)] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-body text-white/40 text-xs uppercase tracking-widest">Zone 09 — Museum &amp; Headquarters</span>
                <div className="h-px flex-1 max-w-xs bg-white/20" />
              </div>
              <h2 className="font-display text-4xl md:text-6xl font-bold text-white uppercase tracking-tight leading-none">
                Museum of<br />
                <span style={{ color: "oklch(0.72 0.14 75)" }}>21st-Century</span><br />
                Black Excellence
              </h2>
              <p className="font-display text-lg md:text-xl font-medium mt-2" style={{ color: "oklch(0.72 0.14 75)" }}>DowUrk Inc. Headquarters</p>
            </motion.div>
          </div>
        </div>

        {/* Mission + exhibits grid */}
        <div className="container py-16">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <FadeUp>
              <div>
                <div className="section-divider" style={{ background: "oklch(0.72 0.14 75)" }} />
                <h3 className="font-display text-2xl font-bold text-white uppercase tracking-wide mb-4">Mission</h3>
                <p className="font-body text-base leading-relaxed mb-6" style={{ color: "oklch(0.85 0.02 60)" }}>
                  To document, elevate, and amplify the brilliance, innovation, resilience, and creativity of Black people
                  in the 21st century and beyond — through immersive storytelling, world-class exhibits, and
                  community-powered cultural education.
                </p>
                <p className="font-body text-base leading-relaxed" style={{ color: "oklch(0.85 0.02 60)" }}>
                  As the <strong className="text-white">DowUrk Inc. corporate headquarters</strong>, this building also
                  serves as the administrative and operational hub for all DowUrk programs, partnerships, and enterprises
                  across the campus and beyond.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    { val: "Phase 1", label: "Gallery inside DowUrk HQ" },
                    { val: "Phase 2", label: "Quarterly exhibits & residencies" },
                    { val: "Phase 3", label: "VR/AR immersive experiences" },
                    { val: "2028+", label: "National landmark institution" },
                  ].map((item, i) => (
                    <div key={i} className="border p-4" style={{ borderColor: "oklch(0.72 0.14 75 / 0.3)" }}>
                      <div className="font-display text-xl font-bold" style={{ color: "oklch(0.72 0.14 75)" }}>{item.val}</div>
                      <div className="font-body text-xs mt-1" style={{ color: "oklch(0.7 0.02 60)" }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div className="relative rounded-sm overflow-hidden shadow-2xl">
                <img src={IMAGES.museumInterior} alt="Museum Interior Gallery" className="w-full" />
                <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: "oklch(0.10 0.04 60 / 0.85)" }}>
                  <p className="font-body text-xs" style={{ color: "oklch(0.72 0.14 75)" }}>Main gallery atrium — 8 permanent exhibit wings</p>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* 8 Exhibit Themes */}
          <FadeUp delay={0.1}>
            <h3 className="font-display text-2xl font-bold text-white uppercase tracking-wide mb-6">Year One Exhibit Themes</h3>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { icon: "🎨", title: "Black Creativity Unleashed", desc: "Visual arts, photography, filmmaking, digital design, fashion, spoken word" },
              { icon: "📸", title: "The New Renaissance", desc: "Photography & film — spotlighting peers, predecessors, and the next generation" },
              { icon: "💡", title: "Black Tech Innovators", desc: "AI, cybersecurity, engineering, startups, and space science from 2000–present" },
              { icon: "💼", title: "The Black Entrepreneurial Boom", desc: "From small businesses to billion-dollar founders" },
              { icon: "🔥", title: "Activism & Social Leadership", desc: "Movements, community organizers, and thought leaders in the digital age" },
              { icon: "🎶", title: "The Sound of the Culture", desc: "Music evolution from 2000s hip-hop to Afrofuturism" },
              { icon: "🌍", title: "Diaspora Futures", desc: "How Black cultures around the world innovate, connect, and blend" },
              { icon: "👑", title: "Everyday Royalty", desc: "Firefighters, teachers, nurses, inventors, barbers, pastors — people who make the culture better" },
            ].map((exhibit, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <div className="p-5 border h-full" style={{ borderColor: "oklch(0.72 0.14 75 / 0.2)", background: "oklch(0.14 0.04 60)" }}>
                  <div className="text-2xl mb-3">{exhibit.icon}</div>
                  <div className="font-display text-sm font-bold text-white uppercase tracking-wide mb-2">{exhibit.title}</div>
                  <p className="font-body text-xs leading-relaxed" style={{ color: "oklch(0.65 0.02 60)" }}>{exhibit.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Core Values */}
          <FadeUp delay={0.1}>
            <div className="border-t pt-12" style={{ borderColor: "oklch(0.72 0.14 75 / 0.2)" }}>
              <h3 className="font-display text-2xl font-bold text-white uppercase tracking-wide mb-6">Core Values</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { value: "Excellence", desc: "Showcase the highest levels of achievement in every field" },
                  { value: "Innovation", desc: "Embrace technology, multimedia, and futuristic design" },
                  { value: "Representation", desc: "Center voices often overlooked or erased" },
                  { value: "Community", desc: "Build a creative hub where the culture lives and grows" },
                  { value: "Liberation", desc: "Use truth and storytelling as tools for empowerment" },
                  { value: "Future-Forward", desc: "Document the present to shape the future" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1 h-full min-h-[3rem] flex-shrink-0 mt-1" style={{ background: "oklch(0.72 0.14 75)" }} />
                    <div>
                      <div className="font-display text-sm font-bold text-white uppercase tracking-wide">{item.value}</div>
                      <div className="font-body text-xs mt-1" style={{ color: "oklch(0.65 0.02 60)" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Hybrid model callout */}
          <FadeUp delay={0.15}>
            <div className="mt-12 p-8 rounded-sm" style={{ background: "oklch(0.14 0.04 60)", border: "1px solid oklch(0.72 0.14 75 / 0.3)" }}>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="font-display text-lg font-bold text-white uppercase tracking-wide mb-3">Physical Museum</div>
                  <div className="space-y-2">
                    {["Modular gallery wing inside DowUrk HQ (Phase 1)", "Pop-up traveling exhibits across Louisiana", "Flagship standalone museum building (Phase 3)", "Artist residency & co-working studios", "Youth Creators Council — students shaping exhibits"].map((f, i) => (
                      <div key={i} className="flex items-center gap-2 font-body text-sm" style={{ color: "oklch(0.75 0.02 60)" }}>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "oklch(0.72 0.14 75)" }} />{f}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-display text-lg font-bold text-white uppercase tracking-wide mb-3">Digital Museum (Immediately Launchable)</div>
                  <div className="space-y-2">
                    {["Interactive online museum & virtual tours", "Video exhibits & documentary series", "User-submitted excellence stories", "Artist and entrepreneur profiles", "AI-powered archive search", "VR/AR experiences (Phase 3)"].map((f, i) => (
                      <div key={i} className="flex items-center gap-2 font-body text-sm" style={{ color: "oklch(0.75 0.02 60)" }}>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "oklch(0.72 0.14 75)" }} />{f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== NEW ZONES: BASKETBALL, MUSIC, GAMING, AQUATIC ===== */}
      <section className="py-20 bg-background" id="new-zones">        <div id="amenities" />
        <div className="container">
          <FadeUp>
            <div className="mb-14">
              <div className="section-divider" />
              <h2 className="font-display text-4xl md:text-5xl font-bold text-dowurk-green uppercase tracking-tight">
                New Campus Zones<br />
                <span className="text-gold">Zones 10 – 18</span>
              </h2>
              <p className="font-body text-base text-muted-foreground mt-4 max-w-2xl">
                Nine additional facilities expanding the campus into basketball, musical arts, esports, aquatics, a children's park, café, daycare, and dedicated maintenance — all fitting comfortably within the 58-acre site.
              </p>
            </div>
          </FadeUp>

          {/* Zone 10 + 11 side by side */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Basketball */}
            <FadeUp>
              <div className="facility-card overflow-hidden rounded-sm">
                <div className="relative h-64">
                  <img src={IMAGES.basketballCourts} alt="Basketball Court Complex" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display text-xs font-bold px-2 py-0.5 rounded-sm" style={{ background: "oklch(0.52 0.18 40)", color: "white" }}>ZONE 10</span>
                      <span className="font-body text-xs text-white/60 uppercase tracking-wider">Courts</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-white uppercase tracking-tight">Basketball Court Complex</h3>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <p className="font-body text-sm text-muted-foreground mb-4">Two regulation outdoor courts in DowUrk green &amp; gold with LED lighting, bleachers, and a covered pavilion for evening games and youth leagues.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {["2 Full-size courts", "Green & gold surface", "LED evening lighting", "Bleachers & pavilion"].map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 font-body text-xs text-foreground/70">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-dowurk-gold" />{f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Musical Arts */}
            <FadeUp delay={0.1}>
              <div className="facility-card overflow-hidden rounded-sm">
                <div className="relative h-64">
                  <img src={IMAGES.musicalArts} alt="Musical Arts Center & Drumline Hall" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display text-xs font-bold px-2 py-0.5 rounded-sm" style={{ background: "oklch(0.38 0.1 300)", color: "white" }}>ZONE 11</span>
                      <span className="font-body text-xs text-white/60 uppercase tracking-wider">Music</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-white uppercase tracking-tight">Musical Arts Center & Drumline Hall</h3>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <p className="font-body text-sm text-muted-foreground mb-4">A tribute to the drum captain legacy — featuring a dedicated drumline rehearsal hall, music classrooms, a recording studio, and a covered outdoor performance pavilion.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {["Drumline rehearsal hall", "Recording studio", "Outdoor pavilion", "Instrument storage"].map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 font-body text-xs text-foreground/70">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-dowurk-gold" />{f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Zone 12 + 13 side by side */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Gaming */}
            <FadeUp delay={0.05}>
              <div className="facility-card overflow-hidden rounded-sm">
                <div className="relative h-64">
                  <img src={IMAGES.gamingStation} alt="DowUrk Gaming Station" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display text-xs font-bold px-2 py-0.5 rounded-sm" style={{ background: "oklch(0.55 0.2 145)", color: "white" }}>ZONE 12</span>
                      <span className="font-body text-xs text-white/60 uppercase tracking-wider">Gaming</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-white uppercase tracking-tight">DowUrk Gaming Station</h3>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <p className="font-body text-sm text-muted-foreground mb-4">A next-gen esports and digital literacy facility — high-performance gaming PCs, a tournament arena, streaming setup, VR zone, and youth coding &amp; game development classes.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {["Esports arena", "PC & console gaming", "Live streaming setup", "Coding classes"].map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 font-body text-xs text-foreground/70">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-dowurk-gold" />{f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Aquatic */}
            <FadeUp delay={0.15}>
              <div className="facility-card overflow-hidden rounded-sm">
                <div className="relative h-64">
                  <img src={IMAGES.aquaticCenter} alt="DowUrk Aquatic Center" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display text-xs font-bold px-2 py-0.5 rounded-sm" style={{ background: "oklch(0.48 0.15 220)", color: "white" }}>ZONE 13</span>
                      <span className="font-body text-xs text-white/60 uppercase tracking-wider">Aquatic</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-white uppercase tracking-tight">DowUrk Aquatic Center</h3>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <p className="font-body text-sm text-muted-foreground mb-4">A full aquatic complex with an indoor competition lap pool, outdoor community pool, splash pad, water slides, and swim lesson programs for all ages.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {["Indoor lap pool", "Outdoor community pool", "Splash pad & slides", "Swim lessons"].map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 font-body text-xs text-foreground/70">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-dowurk-gold" />{f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Zones 14–18 grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              { num: "14", label: "Operations", color: "oklch(0.38 0.06 200)", icon: "🔧", title: "Maintenance, Storage & Groundskeeping", desc: "Dedicated operations facility housing all groundskeeping equipment, maintenance workshops, utility infrastructure, and facilities management staff.", features: ["Maintenance workshop", "Equipment storage", "Utility & mechanical", "Staff break room"] },
              { num: "15", label: "Play", color: "oklch(0.58 0.18 140)", icon: "🛝", title: "Children's Park & Playground", desc: "Fully fenced, ADA-accessible playground with age-appropriate structures, sensory play area, shaded pavilion, and seasonal water play.", features: ["Ages 2–12 structures", "Rubber safety surface", "Sensory play area", "Shaded pavilion"] },
              { num: "16", label: "Café", color: "oklch(0.52 0.14 60)", icon: "🥤", title: "DowUrk Café & Juice Bar", desc: "Courtyard café serving fresh juice, smoothies, and healthy food sourced from the campus greenhouse — a social hub for athletes, families, and visitors.", features: ["Juice bar & smoothies", "Greenhouse-sourced menu", "Courtyard patio seating", "Event room rental"] },
              { num: "17", label: "Early Childhood", color: "oklch(0.48 0.16 270)", icon: "🧒", title: "Early Childhood Learning Center", desc: "Licensed daycare and Pre-K education for ages 6 weeks–5 years, with STEM enrichment, nutritious campus kitchen meals, and sliding-scale tuition.", features: ["Daycare: 6 wks–3 yrs", "Pre-K: Ages 3–5", "Campus kitchen meals", "Sliding-scale tuition"] },
              { num: "★", label: "Campus-Wide", color: "oklch(0.32 0.08 152)", icon: "🚻", title: "Restroom & Hydration Stations", desc: "2–4 freestanding restroom facilities with ADA-accessible stalls and water fountains/hydration stations placed throughout the park at locations not adjacent to buildings.", features: ["2–4 standalone facilities", "ADA-accessible stalls", "Water fountains", "Hydration fill stations"] },
            ].map((z, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <div className="h-full flex flex-col border border-border rounded-sm overflow-hidden bg-white">
                  <div className="h-1" style={{ background: z.color }} />
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl">{z.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display text-xs font-bold px-1.5 py-0.5 text-white rounded-sm" style={{ background: z.color }}>ZONE {z.num}</span>
                          <span className="font-body text-xs text-muted-foreground uppercase tracking-wider">{z.label}</span>
                        </div>
                        <div className="font-display text-sm font-bold uppercase tracking-tight text-foreground mt-1">{z.title}</div>
                      </div>
                    </div>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed mb-3 flex-1">{z.desc}</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {z.features.map((f, j) => (
                        <div key={j} className="flex items-center gap-1.5 font-body text-xs text-foreground/70">
                          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: z.color }} />{f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Parking callout */}
          <FadeUp delay={0.1}>
            <div className="p-8 rounded-sm border border-border bg-muted/50">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-display text-xs font-bold px-2 py-0.5 rounded-sm bg-dowurk-green text-white uppercase tracking-wider">Expanded Parking</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-dowurk-green uppercase tracking-tight mb-3">400+ Vehicle Campus Parking</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    The 58.6-acre site accommodates a large multi-section parking lot on the western edge of campus,
                    with dedicated ADA spaces, clear lane markings, landscaped buffer strips, overflow event parking,
                    and separate drop-off zones for school buses and youth program transportation.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { val: "400+", label: "Vehicle capacity" },
                    { val: "ADA", label: "Accessible spaces" },
                    { val: "Bus", label: "Drop-off zones" },
                    { val: "EV", label: "Charging stations" },
                  ].map((s, i) => (
                    <div key={i} className="text-center p-4 bg-white rounded-sm border border-border">
                      <div className="font-display text-2xl font-bold text-dowurk-green">{s.val}</div>
                      <div className="font-body text-xs text-muted-foreground mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== USDA ELIGIBILITY TABLE ===== */}
      <section className="py-24 bg-muted" id="usda">
        <div className="container">
          <FadeUp>
            <div className="text-center mb-16">
              <div className="section-divider mx-auto" />
              <h2 className="font-display text-4xl md:text-5xl font-bold text-dowurk-green uppercase tracking-tight">
                USDA Eligibility<br />
                <span className="text-gold">Sweet Spot</span>
              </h2>
              <p className="font-body text-base text-muted-foreground mt-4 max-w-2xl mx-auto">
                The merged campus concept cleanly maps to explicitly listed eligible uses under the{" "}
                <strong>USDA Community Facilities Direct Loan &amp; Grant Program</strong> — positioning this project as
                an exceptionally strong candidate for federal funding.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-border">
              <div className="bg-dowurk-green px-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-display text-sm font-bold text-white uppercase tracking-wider">Campus Vision Component</div>
                  <div className="font-display text-sm font-bold text-gold uppercase tracking-wider">USDA-Eligible Category</div>
                </div>
              </div>
              {usdaRows.map((row, i) => (
                <div key={i} className={`px-6 py-4 border-b border-border last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-muted/50"}`}>
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-dowurk-gold flex-shrink-0" />
                      <span className="font-body text-sm text-foreground">{row.component}</span>
                    </div>
                    <div className="font-body text-sm font-semibold text-dowurk-green">{row.usda}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="mt-8 bg-dowurk-green rounded-sm p-8 text-center">
              <div className="font-display text-2xl font-bold text-white uppercase tracking-wide mb-3">
                Strategic Funding Alignment
              </div>
              <p className="font-body text-base text-white/80 max-w-3xl mx-auto leading-relaxed">
                This campus positions itself for both <strong className="text-gold">federal funding</strong> (USDA Community
                Facilities Direct Loan &amp; Grant Program) and <strong className="text-gold">philanthropic funding</strong> by
                serving youth development, recreation infrastructure, community education, workforce training, and public
                gathering spaces — all in a single unified campus on a shovel-ready 58.6-acre site.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {["Youth Development", "Recreation Infrastructure", "Community Education", "Workforce Training", "Public Gathering Spaces", "Local Food Systems", "Distance Learning", "Community Support Services"].map((tag, i) => (
                  <span key={i} className="stat-badge">{tag}</span>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== IMPACT ===== */}
      <section className="py-24 bg-background" id="impact">
        <div className="container">
          <FadeUp>
            <div className="text-center mb-16">
              <div className="section-divider mx-auto" />
              <h2 className="font-display text-4xl md:text-5xl font-bold text-dowurk-green uppercase tracking-tight">
                Community <span className="text-gold">Impact</span>
              </h2>
              <p className="font-body text-base text-muted-foreground mt-4 max-w-2xl mx-auto">
                The DowUrk &amp; Hammond Jr. Tors Community Sports Campus will serve as a youth sports complex, a leadership
                training campus, a food education hub, and a community gathering place for all of Tangipahoa Parish.
              </p>
            </div>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { title: "Youth Athletics", stat: "500+", statLabel: "Youth Annually", desc: "Serving youth baseball, softball, football, and multi-sport athletes through DowUrk Diamond League and Hammond Jr. Tors programs." },
              { title: "Education & Technology", stat: "BEAM", statLabel: "Arts & Tech Labs", desc: "Arts & Creative Intelligence labs, computer lab, distance learning center, and leadership academy programming for youth and families." },
              { title: "Food & Agriculture", stat: "4", statLabel: "Greenhouses", desc: "Community kitchen, commercial greenhouses, and agriculture education plots producing food and teaching nutrition to Tangipahoa Parish youth." },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="text-center p-8 border border-border rounded-sm">
                  <div className="font-display text-4xl font-bold text-gold mb-1">{item.stat}</div>
                  <div className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-4">{item.statLabel}</div>
                  <h3 className="font-display text-xl font-bold text-dowurk-green uppercase tracking-wide mb-3">{item.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Property callout */}
          <FadeUp delay={0.2}>
            <div className="bg-muted rounded-sm p-8 border-l-4 border-dowurk-gold">
              <div className="grid md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2">
                  <div className="font-display text-lg font-bold text-dowurk-green uppercase tracking-wide mb-2">
                    The Property — Riverside Lane, Tickfaw, LA 70466
                  </div>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    58.60 acres of wooded land with large hardwoods on the Tangipahoa River in Tickfaw, Tangipahoa Parish.
                    Currently undeveloped — a blank canvas for the most transformative youth development campus in the region.
                    Listed at $380,900 (MLS# 2500895).
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Acreage", val: "58.6 Acres" },
                    { label: "Location", val: "Tickfaw, LA" },
                    { label: "River", val: "Tangipahoa" },
                    { label: "Status", val: "For Sale" },
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-3 rounded-sm text-center shadow-sm">
                      <div className="font-display text-sm font-bold text-dowurk-green">{item.val}</div>
                      <div className="font-body text-xs text-muted-foreground mt-0.5">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== PHASED DEVELOPMENT TIMELINE ===== */}
      <section id="timeline" className="py-24" style={{ background: 'oklch(0.13 0.04 145)' }}>
        <div className="container">
          <FadeUp>
            <div className="text-center mb-16">
              <div className="section-divider mx-auto" style={{ background: '#6DBE45' }} />
              <div className="font-display text-xs tracking-widest text-gold uppercase mb-3">2026 — 2031</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white uppercase tracking-tight">
                Phased <span className="text-gold">Development</span> Timeline
              </h2>
              <p className="font-body text-base text-white/60 mt-4 max-w-2xl mx-auto">
                A three-phase construction roadmap delivering the full 58-acre campus over five years — from land acquisition and core infrastructure through the flagship museum and final amenity zones.
              </p>
            </div>
          </FadeUp>

          {/* Timeline connector line (desktop) */}
          <div className="relative">
            {/* Horizontal connector */}
            <div className="hidden lg:block absolute top-[72px] left-[16.67%] right-[16.67%] h-0.5 bg-dowurk-gold/30" style={{ zIndex: 0 }} />

            <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
              {[
                {
                  phase: "Phase 1",
                  years: "2026 – 2027",
                  budget: "$10.5M",
                  color: "#6DBE45",
                  label: "Foundation & Core Sports",
                  funding: "USDA CF Grant + Loan",
                  zones: [
                    "Land Acquisition & Site Prep",
                    "Zone 01 — Baseball Stadium (6,000 seats)",
                    "Zone 02 — Jr. Tors Football Stadium",
                    "Zone 03 & 04 — Practice Fields A & B",
                    "Zone 05 — Indoor Training & Performance Center",
                    "Zone 14 — Maintenance & Operations",
                    "Parking, Roads & Utilities Infrastructure",
                  ],
                },
                {
                  phase: "Phase 2",
                  years: "2028 – 2029",
                  budget: "$12.25M",
                  color: "#D4AF37",
                  label: "Education, Culture & Community",
                  funding: "Federal Grants + Private Investment",
                  zones: [
                    "Zone 06 — Museum & Headquarters",
                    "Zone 07 — Leadership & Education Center",
                    "Zone 08 — Community Center",
                    "Zone 09 — Softball Field",
                    "Zone 10 — Covered Basketball Courts",
                    "Zone 11 — Musical Arts Center",
                    "Zone 12 — Gaming & Esports Station",
                  ],
                },
                {
                  phase: "Phase 3",
                  years: "2030 – 2031",
                  budget: "$6.0M",
                  color: "#4A90D9",
                  label: "Amenities & Final Zones",
                  funding: "Naming Rights + Sponsorships",
                  zones: [
                    "Zone 13 — Agriculture & Aquaponics",
                    "Zone 15 — Children's Park & Playground",
                    "Zone 16 — DowUrk Café & Juice Bar",
                    "Zone 17 — Early Childhood Learning Center",
                    "Riverfront Trail & Coastal Restoration",
                    "Campus-Wide Signage & Landscaping",
                    "Grand Opening & Ribbon Cutting",
                  ],
                },
              ].map((phase, i) => (
                <FadeUp key={i} delay={i * 0.15}>
                  <div className="relative flex flex-col h-full">
                    {/* Phase dot on desktop connector line */}
                    <div className="hidden lg:flex justify-center mb-0" style={{ zIndex: 1 }}>
                      <div className="w-8 h-8 rounded-full border-4 border-background flex items-center justify-center"
                        style={{ background: phase.color }}>
                        <span className="font-display text-xs font-bold text-white">{i + 1}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex-1 rounded-sm border p-6 flex flex-col"
                      style={{ borderColor: phase.color + '40', background: 'oklch(0.17 0.04 145)' }}>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="font-display text-xs uppercase tracking-widest mb-1" style={{ color: phase.color }}>
                            {phase.phase}
                          </div>
                          <div className="font-display text-xl font-bold text-white uppercase tracking-tight leading-tight">
                            {phase.label}
                          </div>
                          <div className="font-body text-xs text-white/50 mt-1">{phase.years}</div>
                        </div>
                        <div className="text-right ml-4 shrink-0">
                          <div className="font-display text-2xl font-bold" style={{ color: phase.color }}>
                            {phase.budget}
                          </div>
                          <div className="font-body text-xs text-white/40">Budget</div>
                        </div>
                      </div>

                      {/* Funding badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm mb-5 w-fit"
                        style={{ background: phase.color + '20', border: `1px solid ${phase.color}40` }}>
                        <span className="font-body text-xs" style={{ color: phase.color }}>💰 {phase.funding}</span>
                      </div>

                      {/* Zone list */}
                      <ul className="space-y-2 flex-1">
                        {phase.zones.map((zone, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: phase.color }} />
                            <span className="font-body text-sm text-white/70 leading-snug">{zone}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>

            {/* Total budget bar */}
            <FadeUp delay={0.4}>
              <div className="mt-12 rounded-sm border border-dowurk-gold/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6"
                style={{ background: 'oklch(0.17 0.04 145)' }}>
                <div>
                  <div className="font-display text-xs uppercase tracking-widest text-gold mb-1">Total Project Investment</div>
                  <div className="font-display text-4xl font-bold text-white">$28.75<span className="text-gold">M</span></div>
                  <div className="font-body text-sm text-white/50 mt-1">Across all three phases · 2026–2031</div>
                </div>
                <div className="flex-1 max-w-md">
                  <div className="space-y-2">
                    {[
                      { label: "Phase 1 — Foundation", pct: 36, color: "#6DBE45", val: "$10.5M" },
                      { label: "Phase 2 — Education & Culture", pct: 43, color: "#D4AF37", val: "$12.25M" },
                      { label: "Phase 3 — Amenities", pct: 21, color: "#4A90D9", val: "$6.0M" },
                    ].map((bar, i) => (
                      <div key={i}>
                        <div className="flex justify-between font-body text-xs text-white/60 mb-1">
                          <span>{bar.label}</span>
                          <span style={{ color: bar.color }}>{bar.val}</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <div className="h-2 rounded-full" style={{ width: `${bar.pct}%`, background: bar.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <a href="#contact"
                  className="font-display text-sm font-bold uppercase tracking-wider px-6 py-3 rounded-sm shrink-0"
                  style={{ background: '#6DBE45', color: '#fff' }}>
                  Become a Funding Partner
                </a>
              </div>
            </FadeUp>

            {/* ── FUNDING PARTNER EXPANDED CTA ── */}
            <FadeUp delay={0.5}>
              <div className="mt-10 rounded-sm border border-white/10 overflow-hidden" style={{ background: 'oklch(0.10 0.04 145)' }}>
                {/* Header banner */}
                <div className="px-8 py-6 border-b border-white/10" style={{ background: 'oklch(0.15 0.05 145)' }}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="font-display text-xs uppercase tracking-widest text-gold mb-1">Become a Funding Partner</div>
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-white uppercase tracking-tight">
                        Secure Your Legacy on the <span className="text-gold">DowUrk Campus</span>
                      </h3>
                      <p className="font-body text-sm text-white/50 mt-2 max-w-xl">
                        Four investment tiers — from community-level sponsorships to full campus naming rights. Every dollar builds a facility that will serve Tangipahoa Parish youth for generations.
                      </p>
                    </div>
                    <a href="#contact"
                      className="font-display text-sm font-bold uppercase tracking-wider px-7 py-3 rounded-sm shrink-0 text-center"
                      style={{ background: '#D4AF37', color: '#0a1a0a' }}>
                      Inquire Now →
                    </a>
                  </div>
                </div>

                {/* Tier grid */}
                <div className="grid md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
                  {[
                    {
                      tier: "Platinum",
                      icon: "🏛️",
                      range: "$2M – $5M+",
                      color: "#D4AF37",
                      highlight: true,
                      tagline: "Full Campus Legacy",
                      benefits: [
                        "Full campus naming rights",
                        "Museum of Excellence naming",
                        "Bronze monument at entrance",
                        "30-year naming agreement",
                        "Annual gala presenting sponsor",
                        "Board advisory seat",
                        "Press release & media campaign",
                        "Permanent digital tribute wall",
                      ],
                    },
                    {
                      tier: "Gold",
                      icon: "🏟️",
                      range: "$500K – $2M",
                      color: "#6DBE45",
                      highlight: false,
                      tagline: "Facility Naming",
                      benefits: [
                        "Single facility naming rights",
                        "Branded signage throughout facility",
                        "20-year naming agreement",
                        "Youth scholarship in your name",
                        "Founding sponsor wall plaque",
                        "Annual event recognition",
                        "Social media spotlight series",
                      ],
                    },
                    {
                      tier: "Silver",
                      range: "$100K – $500K",
                      icon: "🏅",
                      color: "#A8C5DA",
                      highlight: false,
                      tagline: "Zone Naming",
                      benefits: [
                        "Zone or feature naming rights",
                        "Branded signage at named zone",
                        "10-year naming agreement",
                        "Campus publications recognition",
                        "Annual event co-sponsorship",
                        "Social media recognition package",
                      ],
                    },
                    {
                      tier: "Community",
                      range: "$10K – $100K",
                      icon: "🤝",
                      color: "#8B8B8B",
                      highlight: false,
                      tagline: "Program Sponsorship",
                      benefits: [
                        "Program or event sponsorship",
                        "Logo on event materials",
                        "5-year recognition agreement",
                        "Website & program listing",
                        "Invitation to campus events",
                        "Certificate of community impact",
                      ],
                    },
                  ].map((t, i) => (
                    <div key={i} className="p-6 flex flex-col" style={t.highlight ? { background: 'oklch(0.18 0.06 80)' } : {}}>
                      <div className="text-2xl mb-2">{t.icon}</div>
                      <div className="font-display text-xs uppercase tracking-widest mb-0.5" style={{ color: t.color }}>{t.tier}</div>
                      <div className="font-display text-lg font-bold text-white mb-0.5">{t.range}</div>
                      <div className="font-body text-xs text-white/40 uppercase tracking-wider mb-4">{t.tagline}</div>
                      <ul className="space-y-1.5 flex-1">
                        {t.benefits.map((b, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ background: t.color }} />
                            <span className="font-body text-xs text-white/65 leading-snug">{b}</span>
                          </li>
                        ))}
                      </ul>
                      <a href="#contact"
                        className="mt-5 font-display text-xs font-bold uppercase tracking-wider px-4 py-2 text-center rounded-sm block"
                        style={{ border: `1px solid ${t.color}60`, color: t.color }}>
                        Learn More
                      </a>
                    </div>
                  ))}
                </div>

                {/* Benefits comparison row */}
                <div className="border-t border-white/10 px-8 py-5" style={{ background: 'oklch(0.15 0.04 145)' }}>
                  <div className="font-display text-xs uppercase tracking-widest text-white/40 mb-4">All Partners Receive</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { icon: "📋", label: "Tax Deduction", sub: "501(c)(3) nonprofit" },
                      { icon: "📸", label: "Media Coverage", sub: "Press & social media" },
                      { icon: "🎟️", label: "Event Access", sub: "VIP campus events" },
                      { icon: "📊", label: "Impact Reports", sub: "Annual outcomes data" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <div className="font-display text-xs font-bold text-white uppercase tracking-wide">{item.label}</div>
                          <div className="font-body text-xs text-white/40">{item.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ===== MEET THE LEADERSHIP ===== */}
      <section id="leadership" className="py-20 bg-white">
        <div className="container">
          <FadeUp>
            <div className="text-center mb-14">
              <div className="font-display text-xs tracking-widest text-dowurk-green uppercase mb-3">The People Behind the Vision</div>
              <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-dowurk-green-dark">
                Meet the <span className="text-dowurk-green">Leadership</span>
              </h2>
              <div className="w-16 h-1 bg-dowurk-green mx-auto mt-4" />
            </div>
          </FadeUp>
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Robert Jerrod Brown */}
            <FadeUp>
              <div className="bg-dowurk-green-dark text-white">
                <div className="h-2 bg-dowurk-green" />
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <img src={LOGOS.dowurkTransparent} alt="DowUrk" style={{ height: 64, width: 'auto', objectFit: 'contain', background: 'white', padding: '6px', borderRadius: '2px' }} />
                    <div>
                      <div className="font-display text-2xl font-bold uppercase tracking-wide text-white">Robert Jerrod Brown</div>
                      <div className="font-body text-dowurk-green text-sm uppercase tracking-widest mt-1">CEO &amp; Founder · DowUrk Inc.</div>
                      <div className="font-body text-white/50 text-xs mt-0.5">Hammond, Louisiana</div>
                    </div>
                  </div>
                  <p className="font-body text-white/80 text-sm leading-relaxed mb-5">
                    Robert Jerrod Brown is the founder and chief architect of the DowUrk vision — a lifelong Hammond, Louisiana native who grew up playing baseball, marching as drum captain for his high school drumline, and building community through sports and creativity. His dream has always been to create a space where young people from Tangipahoa Parish and beyond could discover their potential, regardless of their background.
                  </p>
                  <p className="font-body text-white/80 text-sm leading-relaxed mb-6">
                    As CEO of DowUrk Inc., Robert leads the strategic vision for the 58.6-acre Community Sports Campus — a project that integrates athletics, culture, education, technology, agriculture, and environmental stewardship into one transformative destination. He is the connector between federal agencies, state government, local municipalities, academic institutions, and corporate partners, channeling every available resource into a legacy that will serve generations.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Role", val: "CEO & Founder" },
                      { label: "Organization", val: "DowUrk Inc." },
                      { label: "Location", val: "Hammond, LA" },
                    ].map((item, i) => (
                      <div key={i} className="bg-white/10 p-3 text-center">
                        <div className="font-display text-xs font-bold text-dowurk-green uppercase tracking-wide">{item.val}</div>
                        <div className="font-body text-white/40 text-xs mt-0.5">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>
            {/* Ralph Jerome Haynes */}
            <FadeUp>
              <div style={{ background: '#2D1B4E' }} className="text-white">
                <div className="h-2" style={{ background: '#7B2FBE' }} />
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <img src={LOGOS.hammondJrTors} alt="Hammond Jr. Tors" style={{ height: 64, width: 64, objectFit: 'cover', borderRadius: '2px' }} />
                    <div>
                      <div className="font-display text-2xl font-bold uppercase tracking-wide text-white">Ralph Jerome Haynes</div>
                      <div className="font-body text-sm uppercase tracking-widest mt-1" style={{ color: '#B87FE8' }}>Founder · Hammond Jr. Tors</div>
                      <div className="font-body text-white/50 text-xs mt-0.5">Hammond, Louisiana</div>
                    </div>
                  </div>
                  <p className="font-body text-white/80 text-sm leading-relaxed mb-5">
                    Ralph Jerome Haynes is the founder of the Hammond Jr. Tors Youth Football Organization — a registered nonprofit dedicated to providing structured, competitive youth football programming for children in Hammond, Louisiana and the surrounding Tangipahoa Parish community. His organization has been a cornerstone of youth athletic development in the region, giving young athletes a team, a discipline, and a sense of belonging.
                  </p>
                  <p className="font-body text-white/80 text-sm leading-relaxed mb-6">
                    With the development of the DowUrk Community Sports Campus, Ralph's vision for the Hammond Jr. Tors gains a permanent home — two full-size football fields, stadium lighting, bleacher seating, and a dedicated team facility bearing the organization's iconic purple and white colors. The Hammond Jr. Tors Football Complex will be the largest dedicated youth football facility in Tangipahoa Parish.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Role", val: "Founder" },
                      { label: "Organization", val: "Hammond Jr. Tors" },
                      { label: "Location", val: "Hammond, LA" },
                    ].map((item, i) => (
                      <div key={i} className="p-3 text-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="font-display text-xs font-bold uppercase tracking-wide" style={{ color: '#B87FE8' }}>{item.val}</div>
                        <div className="font-body text-white/40 text-xs mt-0.5">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
          {/* Mission statement */}
          <FadeUp>
            <div className="mt-12 max-w-4xl mx-auto bg-dowurk-green text-white p-8 text-center">
              <div className="font-display text-xs tracking-widest uppercase mb-3 text-white/60">Shared Mission</div>
              <blockquote className="font-display text-xl font-bold uppercase tracking-wide leading-snug">
                "DowUrk Inc. is the connector — bridging federal agencies, state government, local municipalities, academic institutions, and corporate partners to build something Tangipahoa Parish has never seen before."
              </blockquote>
              <div className="font-body text-white/60 text-sm mt-4">— Robert Jerrod Brown, CEO &amp; Founder, DowUrk Inc.</div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== PROGRAMS & OPERATIONS ===== */}
      <section id="programs" className="py-20 bg-gray-50">
        <div className="container">
          <FadeUp>
            <div className="text-center mb-14">
              <div className="font-display text-xs tracking-widest text-dowurk-green uppercase mb-3">What Happens Here Every Day</div>
              <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-dowurk-green-dark">
                Programs &amp; <span className="text-dowurk-green">Operations</span>
              </h2>
              <div className="w-16 h-1 bg-dowurk-green mx-auto mt-4" />
              <p className="font-body text-muted-foreground mt-4 max-w-2xl mx-auto text-sm">
                The DowUrk Community Sports Campus operates year-round across 13 zones, serving thousands of youth, families, and community members from Tangipahoa Parish and across Louisiana.
              </p>
            </div>
          </FadeUp>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                color: "#1A5C2A",
                accent: "#6DBE45",
                icon: "⚾",
                title: "DowUrk Diamond League",
                subtitle: "Baseball & Softball · Spring/Summer Season",
                items: [
                  "Youth leagues: Ages 5–18, co-ed and gender-specific divisions",
                  "Spring season: March – June | Summer tournaments: July – August",
                  "DowUrk Hummingbirds home games at the 6,000-seat stadium",
                  "Regional showcase events and college recruitment clinics",
                  "Winter training program: November – February (indoor facility)",
                ],
              },
              {
                color: "#2D1B4E",
                accent: "#7B2FBE",
                icon: "🏈",
                title: "Hammond Jr. Tors Football",
                subtitle: "Youth Football · Fall Season",
                items: [
                  "Youth leagues: Ages 6–14, weight-based divisions",
                  "Fall season: August – November | Playoffs: November – December",
                  "Home games at the Hammond Jr. Tors Football Complex",
                  "Cheerleading and dance team programs",
                  "Spring flag football and skills camps: March – May",
                ],
              },
              {
                color: "#1A3A5C",
                accent: "#4A9EBE",
                icon: "🏀",
                title: "Basketball & Aquatics",
                subtitle: "Year-Round Recreation Programs",
                items: [
                  "Youth basketball leagues: Fall and spring seasons",
                  "3-on-3 summer tournament series",
                  "Learn-to-swim: Year-round sessions for ages 3–adult",
                  "Competitive swim team: Fall and spring seasons",
                  "Water safety certification and lifeguard training",
                ],
              },
              {
                color: "#3D2200",
                accent: "#C9A84C",
                icon: "🎵",
                title: "Musical Arts & Drumline",
                subtitle: "Year-Round Arts Education",
                items: [
                  "Youth drumline program: Ages 8–18, beginner through advanced",
                  "Music technology and production lab: After-school and weekend sessions",
                  "Recording studio access for youth artists",
                  "Annual spring showcase performance at the 300-seat performance hall",
                  "Summer music intensive: June – July",
                ],
              },
              {
                color: "#1A1A2E",
                accent: "#6DBE45",
                icon: "🎮",
                title: "DowUrk Gaming Station",
                subtitle: "Esports & Digital Education",
                items: [
                  "Open gaming sessions: Daily, ages 10+",
                  "Youth esports league: Seasonal tournaments",
                  "Coding bootcamp: 8-week sessions, ages 10–18",
                  "Game design and development lab: After-school program",
                  "Regional esports tournament hosting (quarterly)",
                ],
              },
              {
                color: "#1A4A2A",
                accent: "#6DBE45",
                icon: "🌱",
                title: "Agriculture & Food Hub",
                subtitle: "Community Kitchen & Greenhouse Education",
                items: [
                  "Greenhouse education program: Year-round, school field trips and after-school",
                  "Community kitchen: Open to local food entrepreneurs and nonprofits",
                  "Fresh produce distribution: Weekly community market",
                  "Culinary arts program: Youth cooking classes (ages 10–18)",
                  "LSU AgCenter partnership: Soil science and sustainable farming curriculum",
                ],
              },
            ].map((prog, i) => (
              <FadeUp key={i}>
                <div className="h-full flex flex-col" style={{ background: prog.color }}>
                  <div className="h-1" style={{ background: prog.accent }} />
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-2xl">{prog.icon}</div>
                      <div>
                        <div className="font-display text-base font-bold uppercase tracking-wide text-white">{prog.title}</div>
                        <div className="font-body text-xs mt-0.5" style={{ color: prog.accent }}>{prog.subtitle}</div>
                      </div>
                    </div>
                    <ul className="space-y-2 flex-1">
                      {prog.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: prog.accent }} />
                          <span className="font-body text-white/70 text-xs leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
          {/* Museum hours */}
          <FadeUp>
            <div className="mt-10 bg-dowurk-green-dark text-white p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="font-display text-xs tracking-widest text-dowurk-green uppercase mb-2">Cultural Institution</div>
                  <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-white mb-3">Museum of 21st-Century Black Excellence</h3>
                  <p className="font-body text-white/70 text-sm leading-relaxed">
                    The museum operates as a hybrid physical and digital institution, open to the public year-round. Admission is free for Tangipahoa Parish residents on the first Sunday of every month.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Tue – Fri", val: "10am – 6pm" },
                    { label: "Saturday", val: "10am – 8pm" },
                    { label: "Sunday", val: "12pm – 5pm" },
                    { label: "Monday", val: "Closed" },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/10 p-3 text-center">
                      <div className="font-display text-sm font-bold text-dowurk-green">{item.val}</div>
                      <div className="font-body text-white/40 text-xs mt-0.5">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== NAMING RIGHTS & SPONSORSHIP ===== */}
      <section id="sponsorship" className="py-20 bg-white">
        <div className="container">
          <FadeUp>
            <div className="mb-3">
              <span className="font-display text-xs tracking-widest text-dowurk-green uppercase">Partnership Opportunities</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-black text-dowurk-green-dark uppercase tracking-tight mb-4">
              Naming Rights &amp; Sponsorship
            </h2>
            <p className="font-body text-gray-600 max-w-2xl mb-6 text-lg">
              Every zone, facility, and feature of the DowUrk &amp; Hammond Jr. Tors Community Sports Campus represents a legacy naming opportunity. Secure your organization's name on a landmark that will serve Tangipahoa Parish for generations.
            </p>
            <a
              href="https://d2xsxph8kpxj0f.cloudfront.net/310519663227671536/8VoQ6XMD6F7JKAajGRTLSM/DowUrk_Sponsorship_Prospectus_7b19908a.pdf"
              download="DowUrk_Sponsorship_Prospectus.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider px-6 py-3 mb-12 rounded-sm"
              style={{ background: '#1A5C2A', color: '#fff' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Sponsorship Prospectus (PDF)
            </a>
          </FadeUp>

          {/* Tier Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {[
              {
                tier: "Platinum",
                range: "$2M – $5M+",
                color: "#1A5C2A",
                accent: "#D4A017",
                textColor: "white",
                perks: [
                  "Campus naming rights (full campus name)",
                  "Museum of 21st-Century Black Excellence naming",
                  "Permanent bronze monument at main entrance",
                  "30-year naming agreement",
                  "Annual gala presenting sponsor",
                  "Board advisory seat",
                ],
              },
              {
                tier: "Gold",
                range: "$500K – $2M",
                color: "#D4A017",
                accent: "#1A5C2A",
                textColor: "#1A1A1A",
                perks: [
                  "Single facility naming (stadium, aquatic center, etc.)",
                  "Branded signage throughout named facility",
                  "20-year naming agreement",
                  "Annual recognition at campus events",
                  "Founding sponsor wall plaque",
                  "Youth scholarship fund in your name",
                ],
              },
              {
                tier: "Silver",
                range: "$100K – $500K",
                color: "#F5F5F5",
                accent: "#6DBE45",
                textColor: "#1A1A1A",
                perks: [
                  "Zone or feature naming (track, courts, plaza, etc.)",
                  "Branded signage at named zone",
                  "10-year naming agreement",
                  "Recognition in all campus publications",
                  "Annual event co-sponsorship opportunity",
                  "Social media recognition package",
                ],
              },
            ].map((t, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="h-full flex flex-col" style={{ background: t.color }}>
                  <div className="h-1.5" style={{ background: t.accent }} />
                  <div className="p-8 flex flex-col flex-1">
                    <div className="font-display text-xs tracking-widest mb-1" style={{ color: t.accent }}>{t.tier} Tier</div>
                    <div className="font-display text-3xl font-black mb-6" style={{ color: t.textColor }}>{t.range}</div>
                    <ul className="space-y-2 flex-1">
                      {t.perks.map((p, j) => (
                        <li key={j} className="font-body text-sm flex items-start gap-2" style={{ color: t.textColor === 'white' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)' }}>
                          <span style={{ color: t.accent }} className="mt-0.5 flex-shrink-0">▸</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Zone Naming Table */}
          <FadeUp>
            <div className="border border-gray-200">
              <div className="bg-dowurk-green-dark px-6 py-4">
                <h3 className="font-display text-white font-bold uppercase tracking-wide text-lg">Available Zone Naming Opportunities</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { zone: "01", name: "Hummingbirds Baseball Complex", est: "$1.5M – $3M", tier: "Platinum" },
                  { zone: "02", name: "Hammond Jr. Tors Football Fields", est: "$750K – $1.5M", tier: "Gold" },
                  { zone: "03", name: "Leadership & Education Campus", est: "$1M – $2M", tier: "Platinum" },
                  { zone: "04", name: "Food & Agriculture Hub", est: "$300K – $600K", tier: "Silver" },
                  { zone: "05", name: "Indoor Training & Performance Center", est: "$500K – $1M", tier: "Gold" },
                  { zone: "06", name: "Community Plaza & Courtyard", est: "$250K – $500K", tier: "Silver" },
                  { zone: "07", name: "Riverfront Recreation Trail", est: "$200K – $400K", tier: "Silver" },
                  { zone: "09", name: "Museum of 21st-Century Black Excellence / HQ", est: "$2M – $5M", tier: "Platinum" },
                  { zone: "10", name: "Covered Basketball Court Complex", est: "$400K – $800K", tier: "Gold" },
                  { zone: "11", name: "Musical Arts Center & Drumline Hall", est: "$500K – $1M", tier: "Gold" },
                  { zone: "12", name: "Gaming Station & Esports Arena", est: "$300K – $600K", tier: "Silver" },
                  { zone: "13", name: "Aquatic Center & Wellness Spa", est: "$750K – $1.5M", tier: "Gold" },
                  { zone: "14", name: "Maintenance & Groundskeeping", est: "$200K – $400K", tier: "Silver" },
                  { zone: "15", name: "Children's Park & Playground", est: "$150K – $300K", tier: "Silver" },
                  { zone: "16", name: "Café & Juice Bar", est: "$100K – $200K", tier: "Silver" },
                  { zone: "17", name: "Early Childhood Learning Center", est: "$500K – $1M", tier: "Gold" },
                ].map((row, i) => (
                  <div key={i} className={`grid grid-cols-12 px-6 py-3 items-center ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <div className="col-span-1 font-display text-xs font-bold text-dowurk-green">{row.zone}</div>
                    <div className="col-span-6 font-body text-sm text-gray-800">{row.name}</div>
                    <div className="col-span-3 font-body text-sm text-gray-600">{row.est}</div>
                    <div className="col-span-2 text-right">
                      <span className={`font-display text-xs px-2 py-0.5 uppercase tracking-wide ${
                        row.tier === 'Platinum' ? 'bg-dowurk-green-dark text-white' :
                        row.tier === 'Gold' ? 'bg-gold text-black' :
                        'bg-dowurk-green text-white'
                      }`}>{row.tier}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== CONTACT & FUNDING INQUIRY ===== */}
      <section id="contact" className="py-20" style={{ background: 'oklch(0.13 0.04 145)' }}>
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left: Info */}
            <FadeUp>
              <div className="mb-3">
                <span className="font-display text-xs tracking-widest uppercase" style={{ color: '#6DBE45' }}>Get Involved</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight mb-6 text-white">
                Contact &amp; Funding Inquiry
              </h2>
              <p className="font-body text-white/70 text-lg leading-relaxed mb-8">
                Whether you're a grant funder, corporate sponsor, government partner, or community organization — we want to hear from you. DowUrk Inc. is the connector for Tangipahoa Parish and beyond.
              </p>
              <div className="space-y-5">
                {[
                  { label: "Applicant Organization", val: "DowUrk Inc. (501(c)(3) Nonprofit)", link: null },
                  { label: "Executive Director", val: "Robert Jerrod Brown", link: null },
                  { label: "Phone", val: "(985) 400-0000", link: "tel:+19854000000" },
                  { label: "Email", val: "info@dowurktoday.org", link: "mailto:info@dowurktoday.org" },
                  { label: "Website", val: "www.dowurktoday.org", link: "https://www.dowurktoday.org" },
                  { label: "Mailing Address", val: "45398 Shadowood Dr., Hammond, LA 70401", link: null },
                  { label: "Campus Location", val: "Riverside Lane, Tickfaw, LA 70466", link: null },
                  { label: "Co-Organization", val: "Hammond Jr. Tors Youth Football Org. — Ralph Jerome Haynes, Founder", link: null },
                ].map((item, i) => (
                  <div key={i} className="border-l-2 pl-4" style={{ borderColor: '#6DBE45' }}>
                    <div className="font-display text-xs tracking-widest uppercase mb-0.5" style={{ color: '#6DBE45' }}>{item.label}</div>
                    {item.link ? (
                      <a href={item.link} target={item.link.startsWith('http') ? '_blank' : undefined} rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="font-body text-white/80 text-sm hover:text-dowurk-green transition-colors">{item.val}</a>
                    ) : (
                      <div className="font-body text-white/80 text-sm">{item.val}</div>
                    )}
                  </div>
                ))}
              </div>
            </FadeUp>

            {/* Right: Form */}
            <FadeUp delay={0.15}>
              <ContactForm />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-dowurk-green-dark py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="flex items-start gap-4">
              <img src={LOGOS.dowurkWhite} alt="DowUrk" style={{ height: 56, width: 'auto', objectFit: 'contain' }} />
              <div>
                <div className="font-display text-white font-bold text-lg uppercase tracking-wide">DowUrk Inc.</div>
                <div className="font-body text-white/50 text-sm">Sports &amp; Leadership Park</div>
                <div className="font-body text-white/40 text-xs mt-1">Home of the DowUrk Hummingbirds</div>
                <a href="mailto:info@dowurktoday.org" className="font-body text-dowurk-green text-xs mt-1 block hover:text-gold transition-colors">info@dowurktoday.org</a>
                <a href="https://www.dowurktoday.org" target="_blank" rel="noopener noreferrer" className="font-body text-dowurk-green text-xs mt-0.5 block hover:text-gold transition-colors">www.dowurktoday.org</a>
              </div>
            </div>
            <div>
              <div className="font-display text-white/50 text-xs uppercase tracking-widest mb-3">Organizations</div>
              <div className="space-y-1.5">
                {["DowUrk Sports & Leadership Academy", "DowUrk Diamond League", "Hammond Jr. Tors Youth Football Org."].map((o, i) => (
                  <div key={i} className="font-body text-white/70 text-sm">{o}</div>
                ))}
              </div>
            </div>
            <div>
              <div className="font-display text-white/50 text-xs uppercase tracking-widest mb-3">Campus Location</div>
              <div className="font-body text-white/70 text-sm leading-relaxed">
                Riverside Lane<br />Tickfaw, LA 70466<br />Tangipahoa Parish, Louisiana<br />
                <span className="text-gold">On the Tangipahoa River</span>
              </div>
            </div>
            <div>
              <div className="font-display text-white/50 text-xs uppercase tracking-widest mb-3">Connect With Us</div>
              <div className="space-y-2">
                <a href="https://www.facebook.com/dowurk" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 font-body text-white/70 text-sm hover:text-dowurk-green transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  Facebook
                </a>
                <a href="https://www.instagram.com/dowurk" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 font-body text-white/70 text-sm hover:text-dowurk-green transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  Instagram
                </a>
                <a href="https://www.youtube.com/@dowurk" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 font-body text-white/70 text-sm hover:text-dowurk-green transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
                  YouTube
                </a>
                <a href="https://x.com/dowurk" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 font-body text-white/70 text-sm hover:text-dowurk-green transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  X (Twitter)
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center">
            <p className="font-body text-white/30 text-xs">
              © 2025 DowUrk Sports &amp; Leadership Park &amp; Hammond Jr. Tors Youth Football Organization. Campus layout and facility descriptions are conceptual and subject to final design, engineering, and regulatory review. Property listing information sourced from Land.com MLS# 2500895.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
