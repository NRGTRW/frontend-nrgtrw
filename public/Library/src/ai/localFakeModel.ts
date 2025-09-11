import { AIPlan, BrandInfo } from '../types/landing';
import { Mulberry32, hashString } from '../generator/prng';
import { registry } from '../generator/registry';

// Content templates organized by tone and industry
const CONTENT_TEMPLATES = {
  luxury: {
    hero: {
      headlines: [
        "Exclusive Premium Solutions",
        "Luxury Redefined",
        "Elite Performance, Unmatched Quality"
      ],
      subheads: [
        "Experience unparalleled excellence with our premium offerings",
        "Where sophistication meets innovation",
        "Elevate your standards with our exclusive services"
      ]
    },
    features: [
      { title: "Premium Quality", body: "Uncompromising standards of excellence" },
      { title: "Exclusive Access", body: "Limited availability for discerning clients" },
      { title: "White-Glove Service", body: "Personalized attention to every detail" }
    ]
  },
  playful: {
    hero: {
      headlines: [
        "Fun Solutions for Creative Minds",
        "Where Innovation Meets Playfulness",
        "Making Work Feel Like Play"
      ],
      subheads: [
        "Discover tools that spark joy and creativity",
        "Turn challenges into adventures",
        "Work smarter, play harder"
      ]
    },
    features: [
      { title: "Creative Tools", body: "Spark your imagination with innovative features" },
      { title: "Easy & Fun", body: "Intuitive design that makes work enjoyable" },
      { title: "Community Driven", body: "Connect with like-minded creators" }
    ]
  },
  minimal: {
    hero: {
      headlines: [
        "Simple. Clean. Effective.",
        "Minimalist Solutions for Modern Life",
        "Less is More"
      ],
      subheads: [
        "Streamlined tools for focused productivity",
        "Clean design, powerful results",
        "Essential features, nothing more"
      ]
    },
    features: [
      { title: "Clean Interface", body: "Distraction-free design for better focus" },
      { title: "Essential Features", body: "Only what you need, nothing you don't" },
      { title: "Fast Performance", body: "Lightweight and optimized for speed" }
    ]
  },
  corporate: {
    hero: {
      headlines: [
        "Enterprise-Grade Solutions",
        "Professional Tools for Business Growth",
        "Reliable Solutions for Modern Enterprises"
      ],
      subheads: [
        "Scalable solutions for growing businesses",
        "Trusted by industry leaders worldwide",
        "Professional-grade tools for serious results"
      ]
    },
    features: [
      { title: "Enterprise Security", body: "Bank-grade security and compliance" },
      { title: "Scalable Architecture", body: "Grows with your business needs" },
      { title: "24/7 Support", body: "Round-the-clock professional assistance" }
    ]
  },
  bold: {
    hero: {
      headlines: [
        "Revolutionary Solutions",
        "Break Through Barriers",
        "Bold Innovation for Bold Results"
      ],
      subheads: [
        "Challenge the status quo with cutting-edge technology",
        "Push boundaries and achieve the impossible",
        "Bold moves for bold outcomes"
      ]
    },
    features: [
      { title: "Cutting-Edge Tech", body: "Latest innovations for maximum impact" },
      { title: "Bold Results", body: "Dramatic improvements in performance" },
      { title: "Game Changer", body: "Transform your industry with breakthrough solutions" }
    ]
  }
};

// Industry-specific content
const INDUSTRY_CONTENT = {
  technology: {
    testimonials: [
      { quote: "This platform transformed our development workflow.", name: "Sarah Chen", role: "CTO, TechCorp" },
      { quote: "The best investment we've made in our tech stack.", name: "Mike Rodriguez", role: "Lead Developer, InnovateLab" }
    ],
    metrics: [
      { label: "99.9% Uptime", value: "99.9%" },
      { label: "10x Faster", value: "10x" },
      { label: "50% Less Code", value: "50%" }
    ]
  },
  healthcare: {
    testimonials: [
      { quote: "Improved patient outcomes significantly.", name: "Dr. Emily Watson", role: "Chief Medical Officer" },
      { quote: "Streamlined our entire practice management.", name: "Dr. James Park", role: "Practice Director" }
    ],
    metrics: [
      { label: "HIPAA Compliant", value: "100%" },
      { label: "Patient Satisfaction", value: "98%" },
      { label: "Time Saved", value: "40%" }
    ]
  },
  finance: {
    testimonials: [
      { quote: "Enhanced our compliance and security measures.", name: "Lisa Thompson", role: "CFO, FinanceCorp" },
      { quote: "Reduced processing time by 60%.", name: "David Kim", role: "Operations Director" }
    ],
    metrics: [
      { label: "SOC 2 Compliant", value: "100%" },
      { label: "Processing Speed", value: "3x Faster" },
      { label: "Error Reduction", value: "95%" }
    ]
  },
  education: {
    testimonials: [
      { quote: "Transformed how our students learn.", name: "Prof. Maria Garcia", role: "Dean of Education" },
      { quote: "Increased engagement by 80%.", name: "Dr. Robert Lee", role: "Academic Director" }
    ],
    metrics: [
      { label: "Student Engagement", value: "85%" },
      { label: "Learning Outcomes", value: "40% Better" },
      { label: "Teacher Satisfaction", value: "92%" }
    ]
  },
  ecommerce: {
    testimonials: [
      { quote: "Boosted our conversion rates dramatically.", name: "Alex Johnson", role: "E-commerce Manager" },
      { quote: "Streamlined our entire sales process.", name: "Rachel Green", role: "Sales Director" }
    ],
    metrics: [
      { label: "Conversion Rate", value: "25% Higher" },
      { label: "Cart Abandonment", value: "30% Lower" },
      { label: "Customer Satisfaction", value: "96%" }
    ]
  }
};

// Generate deterministic AI plan from brand description
export function generateFakePlan(brandDescription: string): AIPlan {
  // Create deterministic seed from brand description
  const seed = hashString(brandDescription);
  const rng = new Mulberry32(seed);
  
  // Extract brand info from description
  const brandInfo = extractBrandInfo(brandDescription, rng);
  
  // Generate sections
  const sections = generateSections(brandInfo, rng);
  
  return {
    brand: brandInfo,
    sections
  };
}

// Extract brand information from description
function extractBrandInfo(description: string, rng: Mulberry32): BrandInfo {
  const words = description.toLowerCase().split(/\s+/);
  
  // Determine industry from keywords (check finance first to avoid platform conflict)
  let industry = 'business';
  if (words.some(w => ['finance', 'bank', 'money', 'investment', 'financial'].includes(w))) {
    industry = 'finance';
  } else if (words.some(w => ['health', 'medical', 'patient', 'doctor', 'clinic', 'healthcare'].includes(w))) {
    industry = 'healthcare';
  } else if (words.some(w => ['education', 'school', 'student', 'learn', 'teach', 'learning', 'online'].includes(w))) {
    industry = 'education';
  } else if (words.some(w => ['shop', 'store', 'sell', 'commerce', 'retail', 'ecommerce'].includes(w))) {
    industry = 'ecommerce';
  } else if (words.some(w => ['tech', 'software', 'app', 'digital', 'ai', 'data', 'platform', 'developers', 'startup'].includes(w))) {
    industry = 'technology';
  }
  
  // Determine tone from keywords
  let tone: BrandInfo['tone'] = 'corporate';
  if (words.some(w => ['luxury', 'premium', 'exclusive', 'elite'].includes(w))) {
    tone = 'luxury';
  } else if (words.some(w => ['fun', 'creative', 'playful', 'colorful'].includes(w))) {
    tone = 'playful';
  } else if (words.some(w => ['simple', 'clean', 'minimal', 'essential'].includes(w))) {
    tone = 'minimal';
  } else if (words.some(w => ['bold', 'revolutionary', 'breakthrough', 'innovative'].includes(w))) {
    tone = 'bold';
  }
  
  // Extract company name (first few words)
  const nameWords = description.split(/\s+/).slice(0, 3);
  const name = nameWords.join(' ').replace(/[^\w\s]/g, '');
  
  // Generate tagline
  const tagline = generateTagline(industry, tone, rng);
  
  return {
    name: name || 'Your Company',
    tagline,
    industry,
    targetAudience: getTargetAudience(industry),
    tone
  };
}

// Generate tagline based on industry and tone
function generateTagline(industry: string, tone: BrandInfo['tone'], rng: Mulberry32): string {
  const taglines = {
    technology: {
      luxury: "Premium technology solutions for discerning clients",
      playful: "Innovative tech that makes work fun",
      minimal: "Essential technology, beautifully simple",
      corporate: "Enterprise-grade technology solutions",
      bold: "Revolutionary technology for bold results"
    },
    healthcare: {
      luxury: "Premium healthcare solutions with personalized care",
      playful: "Making healthcare accessible and engaging",
      minimal: "Simple, effective healthcare solutions",
      corporate: "Professional healthcare management tools",
      bold: "Transforming healthcare with breakthrough technology"
    },
    finance: {
      luxury: "Exclusive financial services for high-net-worth clients",
      playful: "Making finance fun and accessible",
      minimal: "Essential financial tools, beautifully simple",
      corporate: "Professional financial management solutions",
      bold: "Revolutionary financial technology"
    },
    education: {
      luxury: "Premium educational experiences for exceptional learning",
      playful: "Making learning fun and engaging",
      minimal: "Essential learning tools, beautifully simple",
      corporate: "Professional educational management solutions",
      bold: "Transforming education with innovative technology"
    },
    ecommerce: {
      luxury: "Premium e-commerce solutions for luxury brands",
      playful: "Making online shopping fun and engaging",
      minimal: "Essential e-commerce tools, beautifully simple",
      corporate: "Professional e-commerce management solutions",
      bold: "Revolutionary e-commerce technology"
    }
  };
  
  const industryTaglines = taglines[industry as keyof typeof taglines] || taglines.technology;
  const toneTaglines = industryTaglines[tone] || industryTaglines.corporate;
  
  return toneTaglines;
}

// Get target audience based on industry
function getTargetAudience(industry: string): string {
  const audiences = {
    technology: 'developers and tech teams',
    healthcare: 'healthcare professionals',
    finance: 'financial professionals',
    education: 'educators and students',
    ecommerce: 'online retailers'
  };
  
  return audiences[industry as keyof typeof audiences] || 'businesses';
}

// Generate all sections
function generateSections(brand: BrandInfo, rng: Mulberry32): AIPlan['sections'] {
  const sections: AIPlan['sections'] = [];
  const templates = CONTENT_TEMPLATES[brand.tone || 'corporate'];
  const industryContent = INDUSTRY_CONTENT[brand.industry as keyof typeof INDUSTRY_CONTENT] || INDUSTRY_CONTENT.technology;
  
  // Navbar
  sections.push({
    id: 'navbar',
    variant: rng.nextInt(registry.navbar.variants) + 1,
    props: {
      links: [
        { label: "Home", href: "/" },
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "About", href: "/about" }
      ],
      cta: { label: "Get Started", href: "/signup" }
    }
  });
  
  // Hero
  const heroHeadlines = templates.hero.headlines;
  const heroSubheads = templates.hero.subheads;
  sections.push({
    id: 'hero',
    variant: rng.nextInt(registry.hero.variants) + 1,
    props: {
      headline: rng.nextChoice(heroHeadlines),
      subhead: rng.nextChoice(heroSubheads),
      primaryCta: { label: "Start Free Trial", href: "/signup" },
      secondaryCta: { label: "Learn More", href: "/features" }
    }
  });
  
  // Social Proof
  sections.push({
    id: 'socialProof',
    variant: rng.nextInt(registry.socialProof.variants) + 1,
    props: {
      logos: Array.from({ length: 5 }, (_, i) => ({
        kind: "image" as const,
        src: `https://via.placeholder.com/120x60/cccccc/666666?text=Client+${i + 1}`,
        alt: `Client ${i + 1}`
      })),
      caption: "Trusted by industry leaders"
    }
  });
  
  // Features
  const features = templates.features;
  sections.push({
    id: 'features',
    variant: rng.nextInt(registry.features.variants) + 1,
    props: {
      items: features.slice(0, rng.nextInt(3) + 3) // 3-6 features
    }
  });
  
  // Feature Spotlight
  sections.push({
    id: 'featureSpotlight',
    variant: rng.nextInt(registry.featureSpotlight.variants) + 1,
    props: {
      blocks: [
        {
          headline: "Advanced Analytics Dashboard",
          body: "Get deep insights into your business performance with our comprehensive analytics dashboard.",
          mediaSide: rng.nextChoice(['left', 'right'])
        },
        {
          headline: "Seamless Integration",
          body: "Connect with your existing tools and workflows effortlessly.",
          mediaSide: rng.nextChoice(['left', 'right'])
        }
      ]
    }
  });
  
  // Testimonials
  const testimonials = industryContent.testimonials;
  sections.push({
    id: 'testimonials',
    variant: rng.nextInt(registry.testimonials.variants) + 1,
    props: {
      items: testimonials.slice(0, rng.nextInt(2) + 2) // 2-4 testimonials
    }
  });
  
  // Metrics
  const metrics = industryContent.metrics;
  sections.push({
    id: 'metrics',
    variant: rng.nextInt(registry.metrics.variants) + 1,
    props: {
      items: metrics
    }
  });
  
  // Pricing
  sections.push({
    id: 'pricing',
    variant: rng.nextInt(registry.pricing.variants) + 1,
    props: {
      plans: [
        {
          name: "Starter",
          price: "29",
          period: "/mo",
          features: ["Basic features", "Email support", "5GB storage"],
          cta: { label: "Choose Plan", href: "/pricing" }
        },
        {
          name: "Professional",
          price: "99",
          period: "/mo",
          features: ["All starter features", "Priority support", "50GB storage", "Advanced analytics"],
          cta: { label: "Choose Plan", href: "/pricing" },
          highlight: true
        },
        {
          name: "Enterprise",
          price: "299",
          period: "/mo",
          features: ["All professional features", "24/7 support", "Unlimited storage", "Custom integrations"],
          cta: { label: "Contact Sales", href: "/contact" }
        }
      ],
      hasToggle: true
    }
  });
  
  // FAQ
  sections.push({
    id: 'faq',
    variant: rng.nextInt(registry.faq.variants) + 1,
    props: {
      items: [
        { q: "What makes your solution different?", a: "Our platform combines cutting-edge technology with user-friendly design to deliver exceptional results." },
        { q: "How quickly can I get started?", a: "You can be up and running in minutes with our simple setup process." },
        { q: "Do you offer customer support?", a: "Yes, we provide comprehensive support including documentation, tutorials, and direct assistance." },
        { q: "Can I integrate with my existing tools?", a: "Absolutely. Our platform offers seamless integration with popular business tools and services." },
        { q: "Is there a free trial available?", a: "Yes, we offer a free trial so you can experience the full power of our solution." }
      ]
    }
  });
  
  // Final CTA
  sections.push({
    id: 'finalCta',
    variant: rng.nextInt(registry.finalCta.variants) + 1,
    props: {
      headline: "Ready to Get Started?",
      subhead: "Join thousands of satisfied customers",
      cta: { label: "Start Free Trial", href: "/signup" }
    }
  });
  
  // Footer
  sections.push({
    id: 'footer',
    variant: rng.nextInt(registry.footer.variants) + 1,
    props: {
      columns: [
        {
          title: "Product",
          links: [
            { label: "Features", href: "/features" },
            { label: "Pricing", href: "/pricing" },
            { label: "Integrations", href: "/integrations" }
          ]
        },
        {
          title: "Company",
          links: [
            { label: "About", href: "/about" },
            { label: "Blog", href: "/blog" },
            { label: "Careers", href: "/careers" }
          ]
        },
        {
          title: "Support",
          links: [
            { label: "Help Center", href: "/help" },
            { label: "Documentation", href: "/docs" },
            { label: "Contact", href: "/contact" }
          ]
        }
      ],
      socials: [
        { label: "Twitter", href: "#twitter", external: true },
        { label: "LinkedIn", href: "#linkedin", external: true },
        { label: "GitHub", href: "#github", external: true }
      ],
      fineprint: `© ${new Date().getFullYear()} ${brand.name}. All rights reserved.`
    }
  });
  
  return sections;
}
