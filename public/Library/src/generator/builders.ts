import { 
  PageConfig, 
  BrandInfo, 
  SectionID, 
  REQUIRED_SECTIONS 
} from '../types/landing';
import { registry, getVariantsByStyle } from './registry';
import { Mulberry32, generateSeed } from './prng';
import { StyleSlug } from '../styles/styleGroups';

// Default content templates
const DEFAULT_CONTENT = {
  navbar: {
    links: [
      { label: "Home", href: "/" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "About", href: "#about" }
    ],
    cta: { label: "Get Started", href: "#cta" }
  },
  
  hero: {
    headline: "Transform Your Business",
    subhead: "Powerful solutions for modern challenges",
    primaryCta: { label: "Start Free Trial", href: "#signup" },
    secondaryCta: { label: "Learn More", href: "#features" },
    media: {
      kind: "image" as const,
      src: "https://via.placeholder.com/600x400/cccccc/666666?text=Hero+Image",
      alt: "Hero image"
    }
  },
  
  socialProof: {
    logos: [
      { kind: "image" as const, src: "https://via.placeholder.com/120x60/cccccc/666666?text=Client+1", alt: "Client 1" },
      { kind: "image" as const, src: "https://via.placeholder.com/120x60/cccccc/666666?text=Client+2", alt: "Client 2" },
      { kind: "image" as const, src: "https://via.placeholder.com/120x60/cccccc/666666?text=Client+3", alt: "Client 3" },
      { kind: "image" as const, src: "https://via.placeholder.com/120x60/cccccc/666666?text=Client+4", alt: "Client 4" },
      { kind: "image" as const, src: "https://via.placeholder.com/120x60/cccccc/666666?text=Client+5", alt: "Client 5" }
    ],
    caption: "Trusted by industry leaders"
  },
  
  features: {
    items: [
      {
        icon: { kind: "icon" as const, src: "⚡", alt: "Fast" },
        title: "Lightning Fast",
        body: "Optimized for speed and performance"
      },
      {
        icon: { kind: "icon" as const, src: "🔒", alt: "Secure" },
        title: "Enterprise Security",
        body: "Bank-grade security and compliance"
      },
      {
        icon: { kind: "icon" as const, src: "📊", alt: "Analytics" },
        title: "Advanced Analytics",
        body: "Deep insights and reporting"
      },
      {
        icon: { kind: "icon" as const, src: "🔧", alt: "Customizable" },
        title: "Fully Customizable",
        body: "Tailor to your specific needs"
      },
      {
        icon: { kind: "icon" as const, src: "🌐", alt: "Global" },
        title: "Global Scale",
        body: "Worldwide infrastructure and support"
      },
      {
        icon: { kind: "icon" as const, src: "💡", alt: "Innovation" },
        title: "Cutting Edge",
        body: "Latest technology and innovation"
      }
    ]
  },
  
  featureSpotlight: {
    blocks: [
      {
        headline: "Advanced Analytics Dashboard",
        body: "Get deep insights into your business performance with our comprehensive analytics dashboard. Track key metrics, identify trends, and make data-driven decisions.",
        media: {
          kind: "image" as const,
          src: "https://via.placeholder.com/500x300/cccccc/666666?text=Analytics",
          alt: "Analytics dashboard"
        },
        cta: { label: "View Demo", href: "#demo" },
        mediaSide: "right" as const
      },
      {
        headline: "Seamless Integration",
        body: "Connect with your existing tools and workflows. Our platform integrates seamlessly with popular services to streamline your operations.",
        media: {
          kind: "image" as const,
          src: "https://via.placeholder.com/500x300/cccccc/666666?text=Integration",
          alt: "Integration diagram"
        },
        cta: { label: "See Integrations", href: "#integrations" },
        mediaSide: "left" as const
      }
    ]
  },
  
  testimonials: {
    items: [
      {
        quote: "This platform transformed our entire workflow. The results were immediate and impressive.",
        name: "Sarah Johnson",
        role: "CTO, TechCorp",
        avatar: {
          kind: "image" as const,
          src: "https://via.placeholder.com/60x60/cccccc/666666?text=SJ",
          alt: "Sarah Johnson"
        }
      },
      {
        quote: "Exceeded all our expectations. Highly recommended for any growing business.",
        name: "Michael Chen",
        role: "CEO, InnovateLab",
        avatar: {
          kind: "image" as const,
          src: "https://via.placeholder.com/60x60/cccccc/666666?text=MC",
          alt: "Michael Chen"
        }
      },
      {
        quote: "The best investment we've made for our company. ROI was evident within weeks.",
        name: "Emily Rodriguez",
        role: "Director, GrowthCo",
        avatar: {
          kind: "image" as const,
          src: "https://via.placeholder.com/60x60/cccccc/666666?text=ER",
          alt: "Emily Rodriguez"
        }
      }
    ]
  },
  
  metrics: {
    items: [
      { label: "99.9% Uptime", value: "99.9%" },
      { label: "10x Faster", value: "10x" },
      { label: "50% Cost Reduction", value: "50%" },
      { label: "24/7 Support", value: "24/7" },
      { label: "Global Coverage", value: "150+" },
      { label: "Happy Customers", value: "10K+" }
    ]
  },
  
  pricing: {
    plans: [
      {
        name: "Starter",
        price: "29",
        period: "/mo" as const,
        features: [
          "Basic features",
          "Email support",
          "5GB storage",
          "Up to 5 users"
        ],
        cta: { label: "Choose Plan", href: "#pricing" },
        highlight: false
      },
      {
        name: "Professional",
        price: "99",
        period: "/mo" as const,
        features: [
          "All starter features",
          "Priority support",
          "50GB storage",
          "Up to 25 users",
          "Advanced analytics"
        ],
        cta: { label: "Choose Plan", href: "#pricing" },
        highlight: true
      },
      {
        name: "Enterprise",
        price: "299",
        period: "/mo" as const,
        features: [
          "All professional features",
          "24/7 support",
          "Unlimited storage",
          "Unlimited users",
          "Custom integrations",
          "Dedicated account manager"
        ],
        cta: { label: "Contact Sales", href: "#contact" },
        highlight: false
      }
    ],
    hasToggle: true
  },
  
  faq: {
    items: [
      {
        q: "What makes your solution different?",
        a: "Our platform combines cutting-edge technology with user-friendly design to deliver exceptional results for businesses of all sizes."
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
        a: "Absolutely. Our platform offers seamless integration with popular business tools and services."
      },
      {
        q: "Is there a free trial available?",
        a: "Yes, we offer a free trial so you can experience the full power of our solution before committing."
      },
      {
        q: "What security measures do you have?",
        a: "We implement enterprise-grade security including encryption, secure authentication, and regular security audits."
      }
    ]
  },
  
  finalCta: {
    headline: "Ready to Get Started?",
    subhead: "Join thousands of businesses that trust our platform",
    cta: { label: "Start Free Trial", href: "#signup" }
  },
  
  footer: {
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
    fineprint: `© ${new Date().getFullYear()} Your Company. All rights reserved.`
  }
};

// Build default page configuration
export function buildDefaultConfig(brand: BrandInfo): PageConfig {
  const defaultBrand: BrandInfo = {
    name: "Modern Web Solutions",
    tagline: "Professional web development and design solutions",
    industry: "technology",
    targetAudience: "businesses",
    tone: "corporate",
    ...brand
  };
  
  const sections = REQUIRED_SECTIONS.map(sectionId => ({
    id: sectionId,
    variant: 1,
    props: DEFAULT_CONTENT[sectionId as keyof typeof DEFAULT_CONTENT]
  }));
  
  return {
    brand: defaultBrand,
    sections
  };
}

// Build randomized page configuration
export function buildRandomizedConfig(
  brand: BrandInfo, 
  seed?: number, 
  options?: { style?: StyleSlug }
): PageConfig {
  const defaultConfig = buildDefaultConfig(brand);
  const actualSeed = seed || generateSeed();
  const random = new Mulberry32(actualSeed);
  
  // Randomize variants
  const randomizedSections = defaultConfig.sections.map(section => {
    let variant: number;
    
    if (options?.style) {
      // Choose from variants in the specified style
      const styleVariants = getVariantsByStyle(section.id, options.style);
      if (styleVariants.length > 0) {
        variant = styleVariants[random.nextInt(styleVariants.length)];
      } else {
        // Fallback to any variant if style not available
        variant = random.nextInt(registry[section.id].variants) + 1;
      }
    } else {
      // Choose from all variants
      variant = random.nextInt(registry[section.id].variants) + 1;
    }
    
    return {
      ...section,
      variant
    };
  });
  
  return {
    ...defaultConfig,
    sections: randomizedSections
  };
}

// Build configuration with specific variant selections
export function buildConfigWithVariants(
  brand: BrandInfo, 
  variantMap: Partial<Record<SectionID, number>>
): PageConfig {
  const defaultConfig = buildDefaultConfig(brand);
  
  const sections = defaultConfig.sections.map(section => ({
    ...section,
    variant: variantMap[section.id] || section.variant
  }));
  
  return {
    ...defaultConfig,
    sections
  };
}

// Build configuration with style constraints
export function buildConfigWithStyle(
  brand: BrandInfo,
  style: StyleSlug,
  seed?: number
): PageConfig {
  return buildRandomizedConfig(brand, seed, { style });
}

// Clone configuration with modifications
export function cloneConfigWithModifications(
  baseConfig: PageConfig,
  modifications: {
    brand?: Partial<BrandInfo>;
    sectionVariants?: Partial<Record<SectionID, number>>;
    sectionProps?: Partial<Record<SectionID, any>>;
  }
): PageConfig {
  const clonedConfig: PageConfig = {
    brand: {
      ...baseConfig.brand,
      ...modifications.brand
    },
    sections: baseConfig.sections.map(section => ({
      ...section,
      variant: modifications.sectionVariants?.[section.id] ?? section.variant,
      props: {
        ...section.props,
        ...modifications.sectionProps?.[section.id]
      }
    }))
  };
  
  return clonedConfig;
}
