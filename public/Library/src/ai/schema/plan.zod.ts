import { z } from 'zod';
import { BrandTone, SectionID } from '../../types/landing';

// Brand info schema
const BrandInfoSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  tagline: z.string().optional(),
  logoUrl: z.string().url().optional(),
  primaryColor: z.string().optional(),
  industry: z.string().optional(),
  targetAudience: z.string().optional(),
  tone: z.enum(['luxury', 'playful', 'minimal', 'corporate', 'bold']).optional()
});

// Link schema with URL validation
const LinkSchema = z.object({
  label: z.string().min(1, 'Link label is required'),
  href: z.string().min(1, 'Link href is required').refine(
    (url) => {
      // Allow relative URLs, hash links, and valid HTTP/HTTPS URLs
      if (url.startsWith('/') || url.startsWith('#')) return true;
      if (url.startsWith('javascript:') || url.startsWith('data:') || url.startsWith('vbscript:')) return false;
      try {
        new URL(url);
        return url.startsWith('http://') || url.startsWith('https://');
      } catch {
        return false;
      }
    },
    { message: 'Invalid URL format' }
  ),
  external: z.boolean().optional()
});

// Media schema
const MediaSchema = z.object({
  kind: z.enum(['image', 'video', 'icon']),
  src: z.string().min(1, 'Media src is required'),
  alt: z.string().optional()
});

// Section-specific prop schemas
const NavbarPropsSchema = z.object({
  links: z.array(LinkSchema).min(1, 'At least one navigation link is required'),
  cta: LinkSchema.optional()
});

const HeroPropsSchema = z.object({
  headline: z.string().min(1, 'Hero headline is required'),
  subhead: z.string().optional(),
  primaryCta: LinkSchema,
  secondaryCta: LinkSchema.optional(),
  media: MediaSchema.optional()
});

const SocialProofPropsSchema = z.object({
  logos: z.array(MediaSchema).min(1, 'At least one logo is required'),
  caption: z.string().optional()
});

const FeaturesPropsSchema = z.object({
  items: z.array(z.object({
    icon: MediaSchema.optional(),
    title: z.string().min(1, 'Feature title is required'),
    body: z.string().min(1, 'Feature body is required')
  })).min(3, 'At least 3 features are required').max(6, 'Maximum 6 features allowed')
});

const FeatureSpotlightPropsSchema = z.object({
  blocks: z.array(z.object({
    headline: z.string().min(1, 'Block headline is required'),
    body: z.string().min(1, 'Block body is required'),
    media: MediaSchema.optional(),
    cta: LinkSchema.optional(),
    mediaSide: z.enum(['left', 'right']).optional()
  })).min(2, 'At least 2 blocks are required').max(3, 'Maximum 3 blocks allowed')
});

const TestimonialsPropsSchema = z.object({
  items: z.array(z.object({
    quote: z.string().min(1, 'Testimonial quote is required'),
    name: z.string().min(1, 'Testimonial name is required'),
    role: z.string().optional(),
    avatar: MediaSchema.optional()
  })).min(2, 'At least 2 testimonials are required').max(6, 'Maximum 6 testimonials allowed')
});

const MetricsPropsSchema = z.object({
  items: z.array(z.object({
    label: z.string().min(1, 'Metric label is required'),
    value: z.string().min(1, 'Metric value is required')
  })).min(3, 'At least 3 metrics are required').max(6, 'Maximum 6 metrics allowed')
});

const PricingPropsSchema = z.object({
  plans: z.array(z.object({
    name: z.string().min(1, 'Plan name is required'),
    price: z.string().min(1, 'Plan price is required'),
    period: z.enum(['/mo', '/yr']).optional(),
    features: z.array(z.string()).min(1, 'At least one feature is required'),
    cta: LinkSchema,
    highlight: z.boolean().optional()
  })).min(2, 'At least 2 plans are required').max(4, 'Maximum 4 plans allowed'),
  hasToggle: z.boolean().optional()
});

const FaqPropsSchema = z.object({
  items: z.array(z.object({
    q: z.string().min(1, 'FAQ question is required'),
    a: z.string().min(1, 'FAQ answer is required')
  })).min(4, 'At least 4 FAQs are required').max(8, 'Maximum 8 FAQs allowed')
});

const FinalCtaPropsSchema = z.object({
  headline: z.string().min(1, 'Final CTA headline is required'),
  subhead: z.string().optional(),
  cta: LinkSchema
});

const FooterPropsSchema = z.object({
  columns: z.array(z.object({
    title: z.string().min(1, 'Footer column title is required'),
    links: z.array(LinkSchema).min(1, 'At least one footer link is required')
  })).min(1, 'At least one footer column is required'),
  socials: z.array(LinkSchema).optional(),
  fineprint: z.string().optional()
});

// Section schema
const SectionSchema = z.object({
  id: z.enum([
    'navbar',
    'hero',
    'socialProof',
    'features',
    'featureSpotlight',
    'testimonials',
    'metrics',
    'pricing',
    'faq',
    'finalCta',
    'footer'
  ]),
  variant: z.number().int().min(1, 'Variant must be at least 1'),
  props: z.record(z.unknown()) // Will be validated per section type
});

// Main AI plan schema
export const ModelPlanSchema = z.object({
  brand: BrandInfoSchema,
  sections: z.array(SectionSchema).min(1, 'At least one section is required')
});

// Parse and validate model plan
export function parseModelPlan(json: unknown): z.infer<typeof ModelPlanSchema> {
  try {
    return ModelPlanSchema.parse(json);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      throw new Error(`Invalid model plan: ${errorMessages}`);
    }
    throw new Error(`Failed to parse model plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Type exports
export type ModelPlan = z.infer<typeof ModelPlanSchema>;
export type ValidatedBrandInfo = z.infer<typeof BrandInfoSchema>;
export type ValidatedSection = z.infer<typeof SectionSchema>;
