import { 
  ContentSeedInput, 
  PageConfig, 
  BrandInfo, 
  NavbarProps, 
  HeroProps, 
  SocialProofProps, 
  FeaturesProps, 
  FeatureSpotlightProps, 
  TestimonialsProps, 
  MetricsProps, 
  PricingProps, 
  FaqProps, 
  FinalCtaProps, 
  FooterProps,
  Link,
  Media 
} from '../types/landing';

// Content templates organized by tone and industry
const CONTENT_TEMPLATES = {
  luxury: {
    hero: {
      headlines: [
        "Elevate Your {industry} Experience",
        "Unparalleled {industry} Excellence", 
        "Redefining {industry} Standards",
        "The Ultimate {industry} Solution"
      ],
      subheads: [
        "Experience the pinnacle of {industry} innovation",
        "Where sophistication meets {industry} mastery",
        "Discover the art of exceptional {industry}",
        "Crafting extraordinary {industry} experiences"
      ]
    },
    features: [
      "Premium Quality", "Exclusive Access", "Personalized Service", 
      "Expert Craftsmanship", "Luxury Experience", "Elite Performance"
    ],
    testimonials: [
      "Absolutely exceptional service. Exceeded every expectation.",
      "The epitome of luxury and sophistication in {industry}.",
      "Outstanding quality that truly sets the standard.",
      "An unparalleled experience that redefines excellence."
    ]
  },
  corporate: {
    hero: {
      headlines: [
        "Streamline Your {industry} Operations",
        "Enterprise-Grade {industry} Solutions",
        "Optimize Your {industry} Workflow",
        "Professional {industry} Services"
      ],
      subheads: [
        "Comprehensive {industry} solutions for modern businesses",
        "Reliable, scalable {industry} infrastructure",
        "Trusted by industry leaders worldwide",
        "Professional {industry} expertise at your service"
      ]
    },
    features: [
      "Enterprise Security", "Scalable Solutions", "24/7 Support",
      "Compliance Ready", "Advanced Analytics", "Integration Ready"
    ],
    testimonials: [
      "Significantly improved our operational efficiency.",
      "Reliable, professional service that delivers results.",
      "Essential tool for our business growth.",
      "Outstanding support and implementation."
    ]
  },
  playful: {
    hero: {
      headlines: [
        "Make {industry} Fun Again",
        "Creative {industry} Solutions",
        "Innovative {industry} Adventures",
        "Bringing Joy to {industry}"
      ],
      subheads: [
        "Making {industry} engaging and enjoyable",
        "Creative solutions that spark innovation",
        "Where fun meets {industry} excellence",
        "Inspiring {industry} experiences for everyone"
      ]
    },
    features: [
      "Creative Design", "User-Friendly", "Innovative Features",
      "Engaging Experience", "Easy to Use", "Fun Interface"
    ],
    testimonials: [
      "Made our {industry} process so much more enjoyable!",
      "Creative and fun approach to {industry}.",
      "Love how engaging and user-friendly it is.",
      "Brings joy to our daily {industry} tasks."
    ]
  },
  minimal: {
    hero: {
      headlines: [
        "Simple {industry} Solutions",
        "Clean {industry} Design",
        "Essential {industry} Tools",
        "Streamlined {industry} Experience"
      ],
      subheads: [
        "Focus on what matters most in {industry}",
        "Clean, simple, effective {industry} solutions",
        "Minimalist approach to {industry} excellence",
        "Essential {industry} tools, beautifully designed"
      ]
    },
    features: [
      "Clean Design", "Simple Interface", "Essential Features",
      "Fast Performance", "Minimal Setup", "Focused Experience"
    ],
    testimonials: [
      "Clean, simple, and exactly what we needed.",
      "Perfect minimalist approach to {industry}.",
      "Beautifully simple and highly effective.",
      "Love the clean, focused design."
    ]
  },
  bold: {
    hero: {
      headlines: [
        "Revolutionary {industry} Platform",
        "Breakthrough {industry} Technology",
        "Game-Changing {industry} Solutions",
        "Next-Generation {industry} Experience"
      ],
      subheads: [
        "Transforming {industry} with cutting-edge innovation",
        "Bold new approach to {industry} challenges",
        "Revolutionary {industry} technology that changes everything",
        "Pioneering the future of {industry}"
      ]
    },
    features: [
      "Cutting-Edge Tech", "Revolutionary Features", "Bold Innovation",
      "Advanced Capabilities", "Next-Gen Performance", "Game-Changing Results"
    ],
    testimonials: [
      "Revolutionary approach that transformed our {industry}.",
      "Bold innovation that delivers exceptional results.",
      "Game-changing technology that exceeded expectations.",
      "Next-level {industry} solution that's truly revolutionary."
    ]
  }
};

// Industry-specific content variations
const INDUSTRY_CONTENT = {
  technology: {
    features: ["AI-Powered", "Cloud-Based", "Real-Time Analytics", "API Integration", "Scalable Architecture", "Advanced Security"],
    metrics: ["99.9% Uptime", "10x Faster", "50% Cost Reduction", "24/7 Support"],
    pricing: ["Starter", "Professional", "Enterprise"]
  },
  healthcare: {
    features: ["HIPAA Compliant", "Patient-Focused", "Secure Data", "Clinical Integration", "Evidence-Based", "Quality Care"],
    metrics: ["100% Compliance", "95% Patient Satisfaction", "30% Efficiency Gain", "24/7 Monitoring"],
    pricing: ["Basic", "Advanced", "Premium"]
  },
  finance: {
    features: ["Bank-Grade Security", "Real-Time Processing", "Compliance Ready", "Risk Management", "Analytics Dashboard", "API Access"],
    metrics: ["99.99% Accuracy", "Sub-Second Processing", "SOC 2 Compliant", "Global Coverage"],
    pricing: ["Standard", "Professional", "Enterprise"]
  },
  education: {
    features: ["Interactive Learning", "Progress Tracking", "Multi-Platform", "Collaborative Tools", "Assessment Ready", "Accessibility Focused"],
    metrics: ["95% Engagement", "40% Learning Improvement", "24/7 Access", "Global Reach"],
    pricing: ["Student", "Educator", "Institution"]
  },
  ecommerce: {
    features: ["Mobile Optimized", "Payment Integration", "Inventory Management", "Analytics Dashboard", "SEO Ready", "Customer Support"],
    metrics: ["25% Conversion Rate", "99.9% Uptime", "Global Shipping", "24/7 Support"],
    pricing: ["Basic", "Professional", "Enterprise"]
  }
};

// Default content when industry is not specified
const DEFAULT_CONTENT = {
  features: ["Quality Service", "Expert Support", "Reliable Performance", "Easy Integration", "Scalable Solution", "Customer Focused"],
  metrics: ["99% Satisfaction", "24/7 Support", "Fast Delivery", "Quality Assured"],
  pricing: ["Basic", "Professional", "Premium"]
};

// Helper function to interpolate content with industry
function interpolateContent(template: string, industry: string = "business"): string {
  return template.replace(/\{industry\}/g, industry.toLowerCase());
}

// Generate random content from templates
function getRandomContent(templates: string[], industry: string = "business"): string {
  const template = templates[Math.floor(Math.random() * templates.length)];
  return interpolateContent(template, industry);
}

// Generate social proof logos (placeholder URLs)
function generateSocialProofLogos(): Media[] {
  const logoUrls = [
    "https://via.placeholder.com/120x60/cccccc/666666?text=Client+1",
    "https://via.placeholder.com/120x60/cccccc/666666?text=Client+2", 
    "https://via.placeholder.com/120x60/cccccc/666666?text=Client+3",
    "https://via.placeholder.com/120x60/cccccc/666666?text=Client+4",
    "https://via.placeholder.com/120x60/cccccc/666666?text=Client+5"
  ];
  
  return logoUrls.map((url, index) => ({
    kind: "image" as const,
    src: url,
    alt: `Client logo ${index + 1}`
  }));
}

// Generate feature icons (using emoji for simplicity)
function generateFeatureIcons(count: number): Media[] {
  const icons = ["⚡", "🎯", "✨", "🚀", "💡", "🔒", "📊", "🌟"];
  return icons.slice(0, count).map((icon, index) => ({
    kind: "icon" as const,
    src: icon,
    alt: `Feature icon ${index + 1}`
  }));
}

// Main content seeding function
export function generateContentSeed(input: ContentSeedInput): Partial<PageConfig> {
  const { brandDescription, industry = "business", targetAudience = "customers", tone = "corporate" } = input;
  
  // Get content templates based on tone
  const templates = CONTENT_TEMPLATES[tone] || CONTENT_TEMPLATES.corporate;
  const industryContent = INDUSTRY_CONTENT[industry as keyof typeof INDUSTRY_CONTENT] || DEFAULT_CONTENT;
  
  // Generate brand info
  const brand: BrandInfo = {
    name: input.brandDescription.split(' ')[0] + " Solutions", // Simple name extraction
    tagline: `Leading ${industry} solutions for ${targetAudience}`,
    industry,
    targetAudience,
    tone
  };
  
  // Generate section props
  const navbarProps: NavbarProps = {
    links: [
      { label: "Home", href: "/" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "About", href: "#about" }
    ],
    cta: { label: "Get Started", href: "#cta" }
  };
  
  const heroProps: HeroProps = {
    headline: getRandomContent(templates.hero.headlines, industry),
    subhead: getRandomContent(templates.hero.subheads, industry),
    primaryCta: { label: "Start Free Trial", href: "#signup" },
    secondaryCta: { label: "Learn More", href: "#features" },
    media: {
      kind: "image",
      src: "https://via.placeholder.com/600x400/cccccc/666666?text=Hero+Image",
      alt: "Hero image"
    }
  };
  
  const socialProofProps: SocialProofProps = {
    logos: generateSocialProofLogos(),
    caption: `Trusted by leading ${industry} companies worldwide`
  };
  
  const featuresProps: FeaturesProps = {
    items: industryContent.features.slice(0, 6).map((title, index) => ({
      icon: generateFeatureIcons(6)[index],
      title,
      body: `Comprehensive ${title.toLowerCase()} solutions designed for ${targetAudience}`
    }))
  };
  
  const featureSpotlightProps: FeatureSpotlightProps = {
    blocks: [
      {
        headline: `Advanced ${industry} Analytics`,
        body: `Get deep insights into your ${industry} performance with our comprehensive analytics dashboard. Track key metrics, identify trends, and make data-driven decisions.`,
        media: {
          kind: "image",
          src: "https://via.placeholder.com/500x300/cccccc/666666?text=Analytics",
          alt: "Analytics dashboard"
        },
        cta: { label: "View Demo", href: "#demo" },
        mediaSide: "right"
      },
      {
        headline: `Seamless ${industry} Integration`,
        body: `Connect with your existing ${industry} tools and workflows. Our platform integrates seamlessly with popular services to streamline your operations.`,
        media: {
          kind: "image", 
          src: "https://via.placeholder.com/500x300/cccccc/666666?text=Integration",
          alt: "Integration diagram"
        },
        cta: { label: "See Integrations", href: "#integrations" },
        mediaSide: "left"
      }
    ]
  };
  
  const testimonialsProps: TestimonialsProps = {
    items: [
      {
        quote: getRandomContent(templates.testimonials, industry),
        name: "Sarah Johnson",
        role: `CTO, ${industry} Corp`,
        avatar: {
          kind: "image",
          src: "https://via.placeholder.com/60x60/cccccc/666666?text=SJ",
          alt: "Sarah Johnson"
        }
      },
      {
        quote: getRandomContent(templates.testimonials, industry),
        name: "Michael Chen", 
        role: `CEO, ${industry} Solutions`,
        avatar: {
          kind: "image",
          src: "https://via.placeholder.com/60x60/cccccc/666666?text=MC",
          alt: "Michael Chen"
        }
      },
      {
        quote: getRandomContent(templates.testimonials, industry),
        name: "Emily Rodriguez",
        role: `Director, ${industry} Innovations`,
        avatar: {
          kind: "image",
          src: "https://via.placeholder.com/60x60/cccccc/666666?text=ER",
          alt: "Emily Rodriguez"
        }
      }
    ]
  };
  
  const metricsProps: MetricsProps = {
    items: industryContent.metrics.map(metric => ({
      label: metric,
      value: metric.includes("%") ? metric : "500+"
    }))
  };
  
  const pricingProps: PricingProps = {
    plans: industryContent.pricing.map((name, index) => ({
      name,
      price: ["29", "99", "299"][index] || "99",
      period: "/mo" as const,
      features: [
        `${name} features`,
        "Email support",
        `${index === 0 ? "5GB" : index === 1 ? "50GB" : "Unlimited"} storage`,
        index > 0 ? "Priority support" : undefined,
        index > 1 ? "24/7 support" : undefined
      ].filter(Boolean) as string[],
      cta: { label: "Choose Plan", href: "#pricing" },
      highlight: index === 1
    })),
    hasToggle: true
  };
  
  const faqProps: FaqProps = {
    items: [
      {
        q: `What makes your ${industry} solution different?`,
        a: `Our ${industry} platform combines cutting-edge technology with user-friendly design to deliver exceptional results for ${targetAudience}.`
      },
      {
        q: "How quickly can I get started?",
        a: "You can be up and running in minutes with our simple setup process. No technical expertise required."
      },
      {
        q: "Do you offer customer support?",
        a: "Yes, we provide comprehensive support including documentation, tutorials, and direct assistance from our expert team."
      },
      {
        q: "Can I integrate with my existing tools?",
        a: "Absolutely. Our platform offers seamless integration with popular ${industry} tools and services."
      },
      {
        q: "Is there a free trial available?",
        a: "Yes, we offer a free trial so you can experience the full power of our ${industry} solution."
      },
      {
        q: "What security measures do you have?",
        a: "We implement enterprise-grade security including encryption, secure authentication, and regular security audits."
      }
    ]
  };
  
  const finalCtaProps: FinalCtaProps = {
    headline: `Ready to Transform Your ${industry}?`,
    subhead: `Join thousands of ${targetAudience} who trust our platform`,
    cta: { label: "Get Started Today", href: "#signup" }
  };
  
  const footerProps: FooterProps = {
    columns: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "Integrations", href: "#integrations" },
          { label: "API", href: "#api" }
        ]
      },
      {
        title: "Company", 
        links: [
          { label: "About", href: "#about" },
          { label: "Blog", href: "#blog" },
          { label: "Careers", href: "#careers" },
          { label: "Contact", href: "#contact" }
        ]
      },
      {
        title: "Support",
        links: [
          { label: "Help Center", href: "#help" },
          { label: "Documentation", href: "#docs" },
          { label: "Community", href: "#community" },
          { label: "Status", href: "#status" }
        ]
      }
    ],
    socials: [
      { label: "Twitter", href: "#twitter", external: true },
      { label: "LinkedIn", href: "#linkedin", external: true },
      { label: "GitHub", href: "#github", external: true }
    ],
    fineprint: `© ${new Date().getFullYear()} ${brand.name}. All rights reserved.`
  };
  
  return {
    brand,
    sections: [
      { id: "navbar", variant: 1, props: navbarProps },
      { id: "hero", variant: 1, props: heroProps },
      { id: "socialProof", variant: 1, props: socialProofProps },
      { id: "features", variant: 1, props: featuresProps },
      { id: "featureSpotlight", variant: 1, props: featureSpotlightProps },
      { id: "testimonials", variant: 1, props: testimonialsProps },
      { id: "metrics", variant: 1, props: metricsProps },
      { id: "pricing", variant: 1, props: pricingProps },
      { id: "faq", variant: 1, props: faqProps },
      { id: "finalCta", variant: 1, props: finalCtaProps },
      { id: "footer", variant: 1, props: footerProps }
    ]
  };
}
