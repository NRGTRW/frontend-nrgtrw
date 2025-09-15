import { AIPlan, BrandInfo } from '../types/landing';
import { Mulberry32, hashString } from '../generator/prng';
import { registry } from '../generator/registry';

// Enhanced content templates with more sophisticated options
const CONTENT_TEMPLATES = {
  luxury: {
    hero: {
      headlines: [
        "Exclusive Premium Solutions",
        "Luxury Redefined",
        "Elite Performance, Unmatched Quality",
        "Where Excellence Meets Innovation",
        "Premium Solutions for Discerning Clients",
        "Unparalleled Luxury & Performance"
      ],
      subheads: [
        "Experience unparalleled excellence with our premium offerings",
        "Where sophistication meets innovation",
        "Elevate your standards with our exclusive services",
        "Discover the pinnacle of luxury and performance",
        "Indulge in the finest solutions crafted for excellence",
        "Transform your experience with our premium offerings"
      ]
    },
    features: [
      { title: "Premium Quality", body: "Uncompromising standards of excellence in every detail" },
      { title: "Exclusive Access", body: "Limited availability for discerning clients who demand the best" },
      { title: "White-Glove Service", body: "Personalized attention and dedicated support for every client" },
      { title: "Luxury Experience", body: "Immersive, sophisticated solutions that exceed expectations" },
      { title: "Elite Performance", body: "Superior results that set new industry standards" }
    ]
  },
  playful: {
    hero: {
      headlines: [
        "Fun Solutions for Creative Minds",
        "Where Innovation Meets Playfulness",
        "Making Work Feel Like Play",
        "Creative Tools That Spark Joy",
        "Turn Ideas Into Adventures",
        "Where Fun Meets Functionality"
      ],
      subheads: [
        "Discover tools that spark joy and creativity",
        "Turn challenges into adventures",
        "Work smarter, play harder",
        "Unleash your creativity with our playful approach",
        "Make every project an exciting journey",
        "Experience the joy of creation with our innovative tools"
      ]
    },
    features: [
      { title: "Creative Tools", body: "Spark your imagination with innovative features designed for creativity" },
      { title: "Easy & Fun", body: "Intuitive design that makes work enjoyable and engaging" },
      { title: "Community Driven", body: "Connect with like-minded creators and share your journey" },
      { title: "Playful Interface", body: "Beautiful, engaging design that makes every interaction delightful" },
      { title: "Innovation Hub", body: "Cutting-edge features that inspire and empower your creativity" }
    ]
  },
  minimal: {
    hero: {
      headlines: [
        "Simple. Clean. Effective.",
        "Minimalist Solutions for Modern Life",
        "Less is More",
        "Essential Tools, Beautiful Design",
        "Clarity Through Simplicity",
        "Focused. Powerful. Simple."
      ],
      subheads: [
        "Streamlined tools for focused productivity",
        "Clean design, powerful results",
        "Essential features, nothing more",
        "Experience the power of simplicity",
        "Beautiful design that gets out of your way",
        "Everything you need, nothing you don't"
      ]
    },
    features: [
      { title: "Clean Interface", body: "Distraction-free design that enhances your focus and productivity" },
      { title: "Essential Features", body: "Carefully curated tools that deliver maximum value with minimal complexity" },
      { title: "Fast Performance", body: "Lightweight, optimized solutions that work seamlessly" },
      { title: "Intuitive Design", body: "Thoughtfully crafted interface that feels natural and effortless" },
      { title: "Focused Experience", body: "Streamlined workflow that eliminates distractions and boosts efficiency" }
    ]
  },
  corporate: {
    hero: {
      headlines: [
        "Enterprise-Grade Solutions",
        "Professional Tools for Business Growth",
        "Reliable Solutions for Modern Enterprises",
        "Trusted by Industry Leaders",
        "Professional Excellence Delivered",
        "Enterprise Solutions That Scale"
      ],
      subheads: [
        "Scalable solutions for growing businesses",
        "Trusted by industry leaders worldwide",
        "Professional-grade tools for serious results",
        "Comprehensive solutions for enterprise challenges",
        "Reliable, secure, and built for scale",
        "Professional tools that drive business success"
      ]
    },
    features: [
      { title: "Enterprise Security", body: "Bank-grade security and compliance standards that protect your business" },
      { title: "Scalable Architecture", body: "Robust infrastructure that grows seamlessly with your business needs" },
      { title: "24/7 Support", body: "Round-the-clock professional assistance from our expert team" },
      { title: "Advanced Analytics", body: "Comprehensive insights and reporting for data-driven decisions" },
      { title: "Integration Ready", body: "Seamless connectivity with your existing enterprise systems" }
    ]
  },
  bold: {
    hero: {
      headlines: [
        "Revolutionary Solutions",
        "Break Through Barriers",
        "Bold Innovation for Bold Results",
        "Disrupt the Status Quo",
        "Innovation That Changes Everything",
        "Bold Vision, Bold Results"
      ],
      subheads: [
        "Challenge the status quo with cutting-edge technology",
        "Push boundaries and achieve the impossible",
        "Bold moves for bold outcomes",
        "Transform industries with revolutionary thinking",
        "Breakthrough technology that redefines possibilities",
        "Bold solutions for bold challenges"
      ]
    },
    features: [
      { title: "Cutting-Edge Tech", body: "Latest innovations and breakthrough technology for maximum impact" },
      { title: "Bold Results", body: "Dramatic improvements and transformative outcomes that exceed expectations" },
      { title: "Game Changer", body: "Revolutionary solutions that transform your industry and redefine standards" },
      { title: "Innovation Leader", body: "Pioneering technology that sets new benchmarks for excellence" },
      { title: "Breakthrough Performance", body: "Unprecedented results that revolutionize how you work and succeed" }
    ]
  }
};

// Enhanced industry-specific content with more sophisticated options
const INDUSTRY_CONTENT = {
  technology: {
    testimonials: [
      { quote: "This platform transformed our development workflow and increased our team's productivity by 300%.", name: "Sarah Chen", role: "CTO, TechCorp" },
      { quote: "The best investment we've made in our tech stack. It's revolutionized how we build and deploy applications.", name: "Mike Rodriguez", role: "Lead Developer, InnovateLab" },
      { quote: "Game-changing technology that has streamlined our entire development process.", name: "Alex Kim", role: "Engineering Director, StartupXYZ" },
      { quote: "Finally, a solution that scales with our growth and adapts to our needs.", name: "Emma Thompson", role: "VP of Engineering, CloudTech" }
    ],
    metrics: [
      { label: "99.9% Uptime", value: "99.9%" },
      { label: "10x Faster Development", value: "10x" },
      { label: "50% Less Code", value: "50%" },
      { label: "300% Productivity Boost", value: "300%" },
      { label: "Zero Downtime", value: "0s" }
    ]
  },
  healthcare: {
    testimonials: [
      { quote: "This solution has improved patient outcomes significantly while reducing administrative burden by 60%.", name: "Dr. Emily Watson", role: "Chief Medical Officer, MedCenter" },
      { quote: "Streamlined our entire practice management and enhanced patient care quality across all departments.", name: "Dr. James Park", role: "Practice Director, HealthFirst Clinic" },
      { quote: "Revolutionary technology that has transformed how we deliver healthcare services to our community.", name: "Dr. Maria Santos", role: "Medical Director, Community Health" },
      { quote: "The integration was seamless and the results have exceeded our expectations in every way.", name: "Dr. Robert Chen", role: "Chief of Staff, Regional Hospital" }
    ],
    metrics: [
      { label: "HIPAA Compliant", value: "100%" },
      { label: "Patient Satisfaction", value: "98%" },
      { label: "Time Saved", value: "40%" },
      { label: "Error Reduction", value: "85%" },
      { label: "Care Quality Improvement", value: "75%" }
    ]
  },
  finance: {
    testimonials: [
      { quote: "Enhanced our compliance and security measures while reducing operational costs by 45%.", name: "Lisa Thompson", role: "CFO, FinanceCorp" },
      { quote: "Reduced processing time by 60% and improved accuracy across all financial operations.", name: "David Kim", role: "Operations Director, CapitalBank" },
      { quote: "Game-changing solution that has revolutionized our financial workflows and risk management.", name: "Jennifer Martinez", role: "VP of Finance, InvestCorp" },
      { quote: "The security and compliance features give us complete confidence in our financial operations.", name: "Michael Johnson", role: "Chief Risk Officer, SecureFinance" }
    ],
    metrics: [
      { label: "SOC 2 Compliant", value: "100%" },
      { label: "Processing Speed", value: "3x Faster" },
      { label: "Error Reduction", value: "95%" },
      { label: "Cost Savings", value: "45%" },
      { label: "Security Score", value: "A+" }
    ]
  },
  education: {
    testimonials: [
      { quote: "Transformed how our students learn and increased academic performance across all grade levels.", name: "Prof. Maria Garcia", role: "Dean of Education, University of Excellence" },
      { quote: "Increased student engagement by 80% and created a more interactive learning environment.", name: "Dr. Robert Lee", role: "Academic Director, TechAcademy" },
      { quote: "Revolutionary platform that has made education more accessible and effective for all students.", name: "Dr. Sarah Williams", role: "Principal, Innovation High School" },
      { quote: "The best educational technology investment we've ever made. Results speak for themselves.", name: "Prof. James Anderson", role: "Department Head, State University" }
    ],
    metrics: [
      { label: "Student Engagement", value: "85%" },
      { label: "Learning Outcomes", value: "40% Better" },
      { label: "Teacher Satisfaction", value: "92%" },
      { label: "Academic Performance", value: "65% Improvement" },
      { label: "Accessibility Score", value: "98%" }
    ]
  },
  ecommerce: {
    testimonials: [
      { quote: "Boosted our conversion rates dramatically and increased revenue by 150% in just six months.", name: "Alex Johnson", role: "E-commerce Manager, ShopSmart" },
      { quote: "Streamlined our entire sales process and improved customer experience across all touchpoints.", name: "Rachel Green", role: "Sales Director, RetailPro" },
      { quote: "Game-changing solution that has transformed our online business and customer engagement.", name: "Mark Thompson", role: "CEO, DigitalStore" },
      { quote: "The best e-commerce platform we've used. It's revolutionized how we sell online.", name: "Lisa Chen", role: "VP of Sales, OnlineMart" }
    ],
    metrics: [
      { label: "Conversion Rate", value: "25% Higher" },
      { label: "Cart Abandonment", value: "30% Lower" },
      { label: "Customer Satisfaction", value: "96%" },
      { label: "Revenue Growth", value: "150%" },
      { label: "Page Load Speed", value: "2x Faster" }
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

// Enhanced brand information extraction with more sophisticated logic
function extractBrandInfo(description: string, rng: Mulberry32): BrandInfo {
  const words = description.toLowerCase().split(/\s+/);
  const fullText = description.toLowerCase();
  
  // Enhanced industry detection with more keywords and context
  let industry = 'business';
  const industryKeywords = {
    finance: ['finance', 'bank', 'money', 'investment', 'financial', 'banking', 'credit', 'loan', 'trading', 'wealth', 'capital', 'funding'],
    healthcare: ['health', 'medical', 'patient', 'doctor', 'clinic', 'healthcare', 'hospital', 'medicine', 'therapy', 'wellness', 'treatment', 'care'],
    education: ['education', 'school', 'student', 'learn', 'teach', 'learning', 'online', 'university', 'college', 'academy', 'training', 'course'],
    ecommerce: ['shop', 'store', 'sell', 'commerce', 'retail', 'ecommerce', 'marketplace', 'shopping', 'buy', 'product', 'inventory', 'sales'],
    technology: ['tech', 'software', 'app', 'digital', 'ai', 'data', 'platform', 'developers', 'startup', 'coding', 'programming', 'innovation', 'saas']
  };
  
  // Find industry with highest keyword match
  let maxMatches = 0;
  for (const [ind, keywords] of Object.entries(industryKeywords)) {
    const matches = keywords.filter(keyword => 
      words.includes(keyword) || fullText.includes(keyword)
    ).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      industry = ind;
    }
  }
  
  // Enhanced tone detection with more nuanced keywords
  let tone: BrandInfo['tone'] = 'corporate';
  const toneKeywords = {
    luxury: ['luxury', 'premium', 'exclusive', 'elite', 'high-end', 'sophisticated', 'refined', 'upscale', 'boutique'],
    playful: ['fun', 'creative', 'playful', 'colorful', 'vibrant', 'energetic', 'dynamic', 'exciting', 'engaging', 'interactive'],
    minimal: ['simple', 'clean', 'minimal', 'essential', 'streamlined', 'focused', 'elegant', 'uncluttered', 'pure'],
    bold: ['bold', 'revolutionary', 'breakthrough', 'innovative', 'cutting-edge', 'disruptive', 'game-changing', 'transformative', 'pioneering']
  };
  
  // Find tone with highest keyword match
  let maxToneMatches = 0;
  for (const [toneKey, keywords] of Object.entries(toneKeywords)) {
    const matches = keywords.filter(keyword => 
      words.includes(keyword) || fullText.includes(keyword)
    ).length;
    if (matches > maxToneMatches) {
      maxToneMatches = matches;
      tone = toneKey as BrandInfo['tone'];
    }
  }
  
  // Enhanced company name extraction
  const sentences = description.split(/[.!?]+/);
  const firstSentence = sentences[0] || description;
  const nameWords = firstSentence.split(/\s+/).slice(0, 4);
  const name = nameWords.join(' ').replace(/[^\w\s]/g, '').trim();
  
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
