import { z } from 'zod';
import { 
  SectionID, 
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
  FooterProps 
} from '../types/landing';
import { StyleSlug } from '../styles/styleGroups';

// Variant metadata type
export type VariantMeta = { 
  idx: number; 
  style: StyleSlug; 
  importPath: string; 
  exportName: string; 
};

// Zod schemas for validation
const LinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  external: z.boolean().optional()
});

const MediaSchema = z.object({
  kind: z.enum(['image', 'video', 'icon']),
  src: z.string().min(1),
  alt: z.string().optional()
});

const NavbarPropsSchema = z.object({
  links: z.array(LinkSchema).min(1),
  cta: LinkSchema.optional()
});

const HeroPropsSchema = z.object({
  headline: z.string().min(1),
  subhead: z.string().optional(),
  primaryCta: LinkSchema,
  secondaryCta: LinkSchema.optional(),
  media: MediaSchema.optional()
});

const SocialProofPropsSchema = z.object({
  logos: z.array(MediaSchema).min(1),
  caption: z.string().optional()
});

const FeaturesPropsSchema = z.object({
  items: z.array(z.object({
    icon: MediaSchema.optional(),
    title: z.string().min(1),
    body: z.string().min(1)
  })).min(3).max(6)
});

const FeatureSpotlightPropsSchema = z.object({
  blocks: z.array(z.object({
    headline: z.string().min(1),
    body: z.string().min(1),
    media: MediaSchema.optional(),
    cta: LinkSchema.optional(),
    mediaSide: z.enum(['left', 'right']).optional()
  })).min(2).max(3)
});

const TestimonialsPropsSchema = z.object({
  items: z.array(z.object({
    quote: z.string().min(1),
    name: z.string().min(1),
    role: z.string().optional(),
    avatar: MediaSchema.optional()
  })).min(2).max(4)
});

const MetricsPropsSchema = z.object({
  items: z.array(z.object({
    label: z.string().min(1),
    value: z.string().min(1)
  })).min(3).max(6)
});

const PricingPropsSchema = z.object({
  plans: z.array(z.object({
    name: z.string().min(1),
    price: z.string().min(1),
    period: z.enum(['/mo', '/yr']).optional(),
    features: z.array(z.string()).min(1),
    cta: LinkSchema,
    highlight: z.boolean().optional()
  })).min(2).max(4),
  hasToggle: z.boolean().optional()
});

const FaqPropsSchema = z.object({
  items: z.array(z.object({
    q: z.string().min(1),
    a: z.string().min(1)
  })).min(4).max(8)
});

const FinalCtaPropsSchema = z.object({
  headline: z.string().min(1),
  subhead: z.string().optional(),
  cta: LinkSchema
});

const FooterPropsSchema = z.object({
  columns: z.array(z.object({
    title: z.string().min(1),
    links: z.array(LinkSchema).min(1)
  })).min(1),
  socials: z.array(LinkSchema).optional(),
  fineprint: z.string().optional()
});

// Validation functions
export const validateNavbarProps = (props: unknown): NavbarProps => {
  return NavbarPropsSchema.parse(props);
};

export const validateHeroProps = (props: unknown): HeroProps => {
  return HeroPropsSchema.parse(props);
};

export const validateSocialProofProps = (props: unknown): SocialProofProps => {
  return SocialProofPropsSchema.parse(props);
};

export const validateFeaturesProps = (props: unknown): FeaturesProps => {
  return FeaturesPropsSchema.parse(props);
};

export const validateFeatureSpotlightProps = (props: unknown): FeatureSpotlightProps => {
  return FeatureSpotlightPropsSchema.parse(props);
};

export const validateTestimonialsProps = (props: unknown): TestimonialsProps => {
  return TestimonialsPropsSchema.parse(props);
};

export const validateMetricsProps = (props: unknown): MetricsProps => {
  return MetricsPropsSchema.parse(props);
};

export const validatePricingProps = (props: unknown): PricingProps => {
  return PricingPropsSchema.parse(props);
};

export const validateFaqProps = (props: unknown): FaqProps => {
  return FaqPropsSchema.parse(props);
};

export const validateFinalCtaProps = (props: unknown): FinalCtaProps => {
  return FinalCtaPropsSchema.parse(props);
};

export const validateFooterProps = (props: unknown): FooterProps => {
  return FooterPropsSchema.parse(props);
};

// Component registry with variant counts, validators, and metadata
export const registry = {
  navbar: { 
    variants: 107, // 7 original + 100 new variants
    validate: validateNavbarProps,
    meta: [
    {
        "idx": 0,
        "style": "minimal",
        "importPath": "./Navbar/Minimal/Navbar.Minimal.V01",
        "exportName": "NavbarMinimalV01"
    },
    {
        "idx": 1,
        "style": "minimal",
        "importPath": "./Navbar/Minimal/Navbar.Minimal.V02",
        "exportName": "NavbarMinimalV02"
    },
    {
        "idx": 2,
        "style": "minimal",
        "importPath": "./Navbar/Minimal/Navbar.Minimal.V03",
        "exportName": "NavbarMinimalV03"
    },
    {
        "idx": 3,
        "style": "minimal",
        "importPath": "./Navbar/Minimal/Navbar.Minimal.V04",
        "exportName": "NavbarMinimalV04"
    },
    {
        "idx": 4,
        "style": "minimal",
        "importPath": "./Navbar/Minimal/Navbar.Minimal.V05",
        "exportName": "NavbarMinimalV05"
    },
    {
        "idx": 5,
        "style": "minimal",
        "importPath": "./Navbar/Minimal/Navbar.Minimal.V06",
        "exportName": "NavbarMinimalV06"
    },
    {
        "idx": 6,
        "style": "minimal",
        "importPath": "./Navbar/Minimal/Navbar.Minimal.V07",
        "exportName": "NavbarMinimalV07"
    },
    {
        "idx": 7,
        "style": "minimal",
        "importPath": "./Navbar/Minimal/Navbar.Minimal.V08",
        "exportName": "NavbarMinimalV08"
    },
    {
        "idx": 8,
        "style": "minimal",
        "importPath": "./Navbar/Minimal/Navbar.Minimal.V09",
        "exportName": "NavbarMinimalV09"
    },
    {
        "idx": 9,
        "style": "minimal",
        "importPath": "./Navbar/Minimal/Navbar.Minimal.V10",
        "exportName": "NavbarMinimalV10"
    },
    {
        "idx": 10,
        "style": "luxury",
        "importPath": "./Navbar/Luxury/Navbar.Luxury.V01",
        "exportName": "NavbarLuxuryV01"
    },
    {
        "idx": 11,
        "style": "luxury",
        "importPath": "./Navbar/Luxury/Navbar.Luxury.V02",
        "exportName": "NavbarLuxuryV02"
    },
    {
        "idx": 12,
        "style": "luxury",
        "importPath": "./Navbar/Luxury/Navbar.Luxury.V03",
        "exportName": "NavbarLuxuryV03"
    },
    {
        "idx": 13,
        "style": "luxury",
        "importPath": "./Navbar/Luxury/Navbar.Luxury.V04",
        "exportName": "NavbarLuxuryV04"
    },
    {
        "idx": 14,
        "style": "luxury",
        "importPath": "./Navbar/Luxury/Navbar.Luxury.V05",
        "exportName": "NavbarLuxuryV05"
    },
    {
        "idx": 15,
        "style": "luxury",
        "importPath": "./Navbar/Luxury/Navbar.Luxury.V06",
        "exportName": "NavbarLuxuryV06"
    },
    {
        "idx": 16,
        "style": "luxury",
        "importPath": "./Navbar/Luxury/Navbar.Luxury.V07",
        "exportName": "NavbarLuxuryV07"
    },
    {
        "idx": 17,
        "style": "luxury",
        "importPath": "./Navbar/Luxury/Navbar.Luxury.V08",
        "exportName": "NavbarLuxuryV08"
    },
    {
        "idx": 18,
        "style": "luxury",
        "importPath": "./Navbar/Luxury/Navbar.Luxury.V09",
        "exportName": "NavbarLuxuryV09"
    },
    {
        "idx": 19,
        "style": "luxury",
        "importPath": "./Navbar/Luxury/Navbar.Luxury.V10",
        "exportName": "NavbarLuxuryV10"
    },
    {
        "idx": 20,
        "style": "playful",
        "importPath": "./Navbar/Playful/Navbar.Playful.V01",
        "exportName": "NavbarPlayfulV01"
    },
    {
        "idx": 21,
        "style": "playful",
        "importPath": "./Navbar/Playful/Navbar.Playful.V02",
        "exportName": "NavbarPlayfulV02"
    },
    {
        "idx": 22,
        "style": "playful",
        "importPath": "./Navbar/Playful/Navbar.Playful.V03",
        "exportName": "NavbarPlayfulV03"
    },
    {
        "idx": 23,
        "style": "playful",
        "importPath": "./Navbar/Playful/Navbar.Playful.V04",
        "exportName": "NavbarPlayfulV04"
    },
    {
        "idx": 24,
        "style": "playful",
        "importPath": "./Navbar/Playful/Navbar.Playful.V05",
        "exportName": "NavbarPlayfulV05"
    },
    {
        "idx": 25,
        "style": "playful",
        "importPath": "./Navbar/Playful/Navbar.Playful.V06",
        "exportName": "NavbarPlayfulV06"
    },
    {
        "idx": 26,
        "style": "playful",
        "importPath": "./Navbar/Playful/Navbar.Playful.V07",
        "exportName": "NavbarPlayfulV07"
    },
    {
        "idx": 27,
        "style": "playful",
        "importPath": "./Navbar/Playful/Navbar.Playful.V08",
        "exportName": "NavbarPlayfulV08"
    },
    {
        "idx": 28,
        "style": "playful",
        "importPath": "./Navbar/Playful/Navbar.Playful.V09",
        "exportName": "NavbarPlayfulV09"
    },
    {
        "idx": 29,
        "style": "playful",
        "importPath": "./Navbar/Playful/Navbar.Playful.V10",
        "exportName": "NavbarPlayfulV10"
    },
    {
        "idx": 30,
        "style": "corporate",
        "importPath": "./Navbar/Corporate/Navbar.Corporate.V01",
        "exportName": "NavbarCorporateV01"
    },
    {
        "idx": 31,
        "style": "corporate",
        "importPath": "./Navbar/Corporate/Navbar.Corporate.V02",
        "exportName": "NavbarCorporateV02"
    },
    {
        "idx": 32,
        "style": "corporate",
        "importPath": "./Navbar/Corporate/Navbar.Corporate.V03",
        "exportName": "NavbarCorporateV03"
    },
    {
        "idx": 33,
        "style": "corporate",
        "importPath": "./Navbar/Corporate/Navbar.Corporate.V04",
        "exportName": "NavbarCorporateV04"
    },
    {
        "idx": 34,
        "style": "corporate",
        "importPath": "./Navbar/Corporate/Navbar.Corporate.V05",
        "exportName": "NavbarCorporateV05"
    },
    {
        "idx": 35,
        "style": "corporate",
        "importPath": "./Navbar/Corporate/Navbar.Corporate.V06",
        "exportName": "NavbarCorporateV06"
    },
    {
        "idx": 36,
        "style": "corporate",
        "importPath": "./Navbar/Corporate/Navbar.Corporate.V07",
        "exportName": "NavbarCorporateV07"
    },
    {
        "idx": 37,
        "style": "corporate",
        "importPath": "./Navbar/Corporate/Navbar.Corporate.V08",
        "exportName": "NavbarCorporateV08"
    },
    {
        "idx": 38,
        "style": "corporate",
        "importPath": "./Navbar/Corporate/Navbar.Corporate.V09",
        "exportName": "NavbarCorporateV09"
    },
    {
        "idx": 39,
        "style": "corporate",
        "importPath": "./Navbar/Corporate/Navbar.Corporate.V10",
        "exportName": "NavbarCorporateV10"
    },
    {
        "idx": 40,
        "style": "brutalist",
        "importPath": "./Navbar/Brutalist/Navbar.Brutalist.V01",
        "exportName": "NavbarBrutalistV01"
    },
    {
        "idx": 41,
        "style": "brutalist",
        "importPath": "./Navbar/Brutalist/Navbar.Brutalist.V02",
        "exportName": "NavbarBrutalistV02"
    },
    {
        "idx": 42,
        "style": "brutalist",
        "importPath": "./Navbar/Brutalist/Navbar.Brutalist.V03",
        "exportName": "NavbarBrutalistV03"
    },
    {
        "idx": 43,
        "style": "brutalist",
        "importPath": "./Navbar/Brutalist/Navbar.Brutalist.V04",
        "exportName": "NavbarBrutalistV04"
    },
    {
        "idx": 44,
        "style": "brutalist",
        "importPath": "./Navbar/Brutalist/Navbar.Brutalist.V05",
        "exportName": "NavbarBrutalistV05"
    },
    {
        "idx": 45,
        "style": "brutalist",
        "importPath": "./Navbar/Brutalist/Navbar.Brutalist.V06",
        "exportName": "NavbarBrutalistV06"
    },
    {
        "idx": 46,
        "style": "brutalist",
        "importPath": "./Navbar/Brutalist/Navbar.Brutalist.V07",
        "exportName": "NavbarBrutalistV07"
    },
    {
        "idx": 47,
        "style": "brutalist",
        "importPath": "./Navbar/Brutalist/Navbar.Brutalist.V08",
        "exportName": "NavbarBrutalistV08"
    },
    {
        "idx": 48,
        "style": "brutalist",
        "importPath": "./Navbar/Brutalist/Navbar.Brutalist.V09",
        "exportName": "NavbarBrutalistV09"
    },
    {
        "idx": 49,
        "style": "brutalist",
        "importPath": "./Navbar/Brutalist/Navbar.Brutalist.V10",
        "exportName": "NavbarBrutalistV10"
    },
    {
        "idx": 50,
        "style": "glass",
        "importPath": "./Navbar/Glass/Navbar.Glass.V01",
        "exportName": "NavbarGlassV01"
    },
    {
        "idx": 51,
        "style": "glass",
        "importPath": "./Navbar/Glass/Navbar.Glass.V02",
        "exportName": "NavbarGlassV02"
    },
    {
        "idx": 52,
        "style": "glass",
        "importPath": "./Navbar/Glass/Navbar.Glass.V03",
        "exportName": "NavbarGlassV03"
    },
    {
        "idx": 53,
        "style": "glass",
        "importPath": "./Navbar/Glass/Navbar.Glass.V04",
        "exportName": "NavbarGlassV04"
    },
    {
        "idx": 54,
        "style": "glass",
        "importPath": "./Navbar/Glass/Navbar.Glass.V05",
        "exportName": "NavbarGlassV05"
    },
    {
        "idx": 55,
        "style": "glass",
        "importPath": "./Navbar/Glass/Navbar.Glass.V06",
        "exportName": "NavbarGlassV06"
    },
    {
        "idx": 56,
        "style": "glass",
        "importPath": "./Navbar/Glass/Navbar.Glass.V07",
        "exportName": "NavbarGlassV07"
    },
    {
        "idx": 57,
        "style": "glass",
        "importPath": "./Navbar/Glass/Navbar.Glass.V08",
        "exportName": "NavbarGlassV08"
    },
    {
        "idx": 58,
        "style": "glass",
        "importPath": "./Navbar/Glass/Navbar.Glass.V09",
        "exportName": "NavbarGlassV09"
    },
    {
        "idx": 59,
        "style": "glass",
        "importPath": "./Navbar/Glass/Navbar.Glass.V10",
        "exportName": "NavbarGlassV10"
    },
    {
        "idx": 60,
        "style": "gradient",
        "importPath": "./Navbar/Gradient/Navbar.Gradient.V01",
        "exportName": "NavbarGradientV01"
    },
    {
        "idx": 61,
        "style": "gradient",
        "importPath": "./Navbar/Gradient/Navbar.Gradient.V02",
        "exportName": "NavbarGradientV02"
    },
    {
        "idx": 62,
        "style": "gradient",
        "importPath": "./Navbar/Gradient/Navbar.Gradient.V03",
        "exportName": "NavbarGradientV03"
    },
    {
        "idx": 63,
        "style": "gradient",
        "importPath": "./Navbar/Gradient/Navbar.Gradient.V04",
        "exportName": "NavbarGradientV04"
    },
    {
        "idx": 64,
        "style": "gradient",
        "importPath": "./Navbar/Gradient/Navbar.Gradient.V05",
        "exportName": "NavbarGradientV05"
    },
    {
        "idx": 65,
        "style": "gradient",
        "importPath": "./Navbar/Gradient/Navbar.Gradient.V06",
        "exportName": "NavbarGradientV06"
    },
    {
        "idx": 66,
        "style": "gradient",
        "importPath": "./Navbar/Gradient/Navbar.Gradient.V07",
        "exportName": "NavbarGradientV07"
    },
    {
        "idx": 67,
        "style": "gradient",
        "importPath": "./Navbar/Gradient/Navbar.Gradient.V08",
        "exportName": "NavbarGradientV08"
    },
    {
        "idx": 68,
        "style": "gradient",
        "importPath": "./Navbar/Gradient/Navbar.Gradient.V09",
        "exportName": "NavbarGradientV09"
    },
    {
        "idx": 69,
        "style": "gradient",
        "importPath": "./Navbar/Gradient/Navbar.Gradient.V10",
        "exportName": "NavbarGradientV10"
    },
    {
        "idx": 70,
        "style": "mono",
        "importPath": "./Navbar/Monochrome/Navbar.Monochrome.V01",
        "exportName": "NavbarMonochromeV01"
    },
    {
        "idx": 71,
        "style": "mono",
        "importPath": "./Navbar/Monochrome/Navbar.Monochrome.V02",
        "exportName": "NavbarMonochromeV02"
    },
    {
        "idx": 72,
        "style": "mono",
        "importPath": "./Navbar/Monochrome/Navbar.Monochrome.V03",
        "exportName": "NavbarMonochromeV03"
    },
    {
        "idx": 73,
        "style": "mono",
        "importPath": "./Navbar/Monochrome/Navbar.Monochrome.V04",
        "exportName": "NavbarMonochromeV04"
    },
    {
        "idx": 74,
        "style": "mono",
        "importPath": "./Navbar/Monochrome/Navbar.Monochrome.V05",
        "exportName": "NavbarMonochromeV05"
    },
    {
        "idx": 75,
        "style": "mono",
        "importPath": "./Navbar/Monochrome/Navbar.Monochrome.V06",
        "exportName": "NavbarMonochromeV06"
    },
    {
        "idx": 76,
        "style": "mono",
        "importPath": "./Navbar/Monochrome/Navbar.Monochrome.V07",
        "exportName": "NavbarMonochromeV07"
    },
    {
        "idx": 77,
        "style": "mono",
        "importPath": "./Navbar/Monochrome/Navbar.Monochrome.V08",
        "exportName": "NavbarMonochromeV08"
    },
    {
        "idx": 78,
        "style": "mono",
        "importPath": "./Navbar/Monochrome/Navbar.Monochrome.V09",
        "exportName": "NavbarMonochromeV09"
    },
    {
        "idx": 79,
        "style": "mono",
        "importPath": "./Navbar/Monochrome/Navbar.Monochrome.V10",
        "exportName": "NavbarMonochromeV10"
    },
    {
        "idx": 80,
        "style": "editorial",
        "importPath": "./Navbar/Editorial/Navbar.Editorial.V01",
        "exportName": "NavbarEditorialV01"
    },
    {
        "idx": 81,
        "style": "editorial",
        "importPath": "./Navbar/Editorial/Navbar.Editorial.V02",
        "exportName": "NavbarEditorialV02"
    },
    {
        "idx": 82,
        "style": "editorial",
        "importPath": "./Navbar/Editorial/Navbar.Editorial.V03",
        "exportName": "NavbarEditorialV03"
    },
    {
        "idx": 83,
        "style": "editorial",
        "importPath": "./Navbar/Editorial/Navbar.Editorial.V04",
        "exportName": "NavbarEditorialV04"
    },
    {
        "idx": 84,
        "style": "editorial",
        "importPath": "./Navbar/Editorial/Navbar.Editorial.V05",
        "exportName": "NavbarEditorialV05"
    },
    {
        "idx": 85,
        "style": "editorial",
        "importPath": "./Navbar/Editorial/Navbar.Editorial.V06",
        "exportName": "NavbarEditorialV06"
    },
    {
        "idx": 86,
        "style": "editorial",
        "importPath": "./Navbar/Editorial/Navbar.Editorial.V07",
        "exportName": "NavbarEditorialV07"
    },
    {
        "idx": 87,
        "style": "editorial",
        "importPath": "./Navbar/Editorial/Navbar.Editorial.V08",
        "exportName": "NavbarEditorialV08"
    },
    {
        "idx": 88,
        "style": "editorial",
        "importPath": "./Navbar/Editorial/Navbar.Editorial.V09",
        "exportName": "NavbarEditorialV09"
    },
    {
        "idx": 89,
        "style": "editorial",
        "importPath": "./Navbar/Editorial/Navbar.Editorial.V10",
        "exportName": "NavbarEditorialV10"
    },
    {
        "idx": 90,
        "style": "neumorphic",
        "importPath": "./Navbar/Neumorphic/Navbar.Neumorphic.V01",
        "exportName": "NavbarNeumorphicV01"
    },
    {
        "idx": 91,
        "style": "neumorphic",
        "importPath": "./Navbar/Neumorphic/Navbar.Neumorphic.V02",
        "exportName": "NavbarNeumorphicV02"
    },
    {
        "idx": 92,
        "style": "neumorphic",
        "importPath": "./Navbar/Neumorphic/Navbar.Neumorphic.V03",
        "exportName": "NavbarNeumorphicV03"
    },
    {
        "idx": 93,
        "style": "neumorphic",
        "importPath": "./Navbar/Neumorphic/Navbar.Neumorphic.V04",
        "exportName": "NavbarNeumorphicV04"
    },
    {
        "idx": 94,
        "style": "neumorphic",
        "importPath": "./Navbar/Neumorphic/Navbar.Neumorphic.V05",
        "exportName": "NavbarNeumorphicV05"
    },
    {
        "idx": 95,
        "style": "neumorphic",
        "importPath": "./Navbar/Neumorphic/Navbar.Neumorphic.V06",
        "exportName": "NavbarNeumorphicV06"
    },
    {
        "idx": 96,
        "style": "neumorphic",
        "importPath": "./Navbar/Neumorphic/Navbar.Neumorphic.V07",
        "exportName": "NavbarNeumorphicV07"
    },
    {
        "idx": 97,
        "style": "neumorphic",
        "importPath": "./Navbar/Neumorphic/Navbar.Neumorphic.V08",
        "exportName": "NavbarNeumorphicV08"
    },
    {
        "idx": 98,
        "style": "neumorphic",
        "importPath": "./Navbar/Neumorphic/Navbar.Neumorphic.V09",
        "exportName": "NavbarNeumorphicV09"
    },
    {
        "idx": 99,
        "style": "neumorphic",
        "importPath": "./Navbar/Neumorphic/Navbar.Neumorphic.V10",
        "exportName": "NavbarNeumorphicV10"
    }
] as VariantMeta[]
  },
  hero: { 
    variants: 107, // 7 original + 100 new variants
    validate: validateHeroProps,
    meta: [
    {
        "idx": 0,
        "style": "minimal",
        "importPath": "./Hero/Minimal/Hero.Minimal.V01",
        "exportName": "HeroMinimalV01"
    },
    {
        "idx": 1,
        "style": "minimal",
        "importPath": "./Hero/Minimal/Hero.Minimal.V02",
        "exportName": "HeroMinimalV02"
    },
    {
        "idx": 2,
        "style": "minimal",
        "importPath": "./Hero/Minimal/Hero.Minimal.V03",
        "exportName": "HeroMinimalV03"
    },
    {
        "idx": 3,
        "style": "minimal",
        "importPath": "./Hero/Minimal/Hero.Minimal.V04",
        "exportName": "HeroMinimalV04"
    },
    {
        "idx": 4,
        "style": "minimal",
        "importPath": "./Hero/Minimal/Hero.Minimal.V05",
        "exportName": "HeroMinimalV05"
    },
    {
        "idx": 5,
        "style": "minimal",
        "importPath": "./Hero/Minimal/Hero.Minimal.V06",
        "exportName": "HeroMinimalV06"
    },
    {
        "idx": 6,
        "style": "minimal",
        "importPath": "./Hero/Minimal/Hero.Minimal.V07",
        "exportName": "HeroMinimalV07"
    },
    {
        "idx": 7,
        "style": "minimal",
        "importPath": "./Hero/Minimal/Hero.Minimal.V08",
        "exportName": "HeroMinimalV08"
    },
    {
        "idx": 8,
        "style": "minimal",
        "importPath": "./Hero/Minimal/Hero.Minimal.V09",
        "exportName": "HeroMinimalV09"
    },
    {
        "idx": 9,
        "style": "minimal",
        "importPath": "./Hero/Minimal/Hero.Minimal.V10",
        "exportName": "HeroMinimalV10"
    },
    {
        "idx": 10,
        "style": "luxury",
        "importPath": "./Hero/Luxury/Hero.Luxury.V01",
        "exportName": "HeroLuxuryV01"
    },
    {
        "idx": 11,
        "style": "luxury",
        "importPath": "./Hero/Luxury/Hero.Luxury.V02",
        "exportName": "HeroLuxuryV02"
    },
    {
        "idx": 12,
        "style": "luxury",
        "importPath": "./Hero/Luxury/Hero.Luxury.V03",
        "exportName": "HeroLuxuryV03"
    },
    {
        "idx": 13,
        "style": "luxury",
        "importPath": "./Hero/Luxury/Hero.Luxury.V04",
        "exportName": "HeroLuxuryV04"
    },
    {
        "idx": 14,
        "style": "luxury",
        "importPath": "./Hero/Luxury/Hero.Luxury.V05",
        "exportName": "HeroLuxuryV05"
    },
    {
        "idx": 15,
        "style": "luxury",
        "importPath": "./Hero/Luxury/Hero.Luxury.V06",
        "exportName": "HeroLuxuryV06"
    },
    {
        "idx": 16,
        "style": "luxury",
        "importPath": "./Hero/Luxury/Hero.Luxury.V07",
        "exportName": "HeroLuxuryV07"
    },
    {
        "idx": 17,
        "style": "luxury",
        "importPath": "./Hero/Luxury/Hero.Luxury.V08",
        "exportName": "HeroLuxuryV08"
    },
    {
        "idx": 18,
        "style": "luxury",
        "importPath": "./Hero/Luxury/Hero.Luxury.V09",
        "exportName": "HeroLuxuryV09"
    },
    {
        "idx": 19,
        "style": "luxury",
        "importPath": "./Hero/Luxury/Hero.Luxury.V10",
        "exportName": "HeroLuxuryV10"
    },
    {
        "idx": 20,
        "style": "playful",
        "importPath": "./Hero/Playful/Hero.Playful.V01",
        "exportName": "HeroPlayfulV01"
    },
    {
        "idx": 21,
        "style": "playful",
        "importPath": "./Hero/Playful/Hero.Playful.V02",
        "exportName": "HeroPlayfulV02"
    },
    {
        "idx": 22,
        "style": "playful",
        "importPath": "./Hero/Playful/Hero.Playful.V03",
        "exportName": "HeroPlayfulV03"
    },
    {
        "idx": 23,
        "style": "playful",
        "importPath": "./Hero/Playful/Hero.Playful.V04",
        "exportName": "HeroPlayfulV04"
    },
    {
        "idx": 24,
        "style": "playful",
        "importPath": "./Hero/Playful/Hero.Playful.V05",
        "exportName": "HeroPlayfulV05"
    },
    {
        "idx": 25,
        "style": "playful",
        "importPath": "./Hero/Playful/Hero.Playful.V06",
        "exportName": "HeroPlayfulV06"
    },
    {
        "idx": 26,
        "style": "playful",
        "importPath": "./Hero/Playful/Hero.Playful.V07",
        "exportName": "HeroPlayfulV07"
    },
    {
        "idx": 27,
        "style": "playful",
        "importPath": "./Hero/Playful/Hero.Playful.V08",
        "exportName": "HeroPlayfulV08"
    },
    {
        "idx": 28,
        "style": "playful",
        "importPath": "./Hero/Playful/Hero.Playful.V09",
        "exportName": "HeroPlayfulV09"
    },
    {
        "idx": 29,
        "style": "playful",
        "importPath": "./Hero/Playful/Hero.Playful.V10",
        "exportName": "HeroPlayfulV10"
    },
    {
        "idx": 30,
        "style": "corporate",
        "importPath": "./Hero/Corporate/Hero.Corporate.V01",
        "exportName": "HeroCorporateV01"
    },
    {
        "idx": 31,
        "style": "corporate",
        "importPath": "./Hero/Corporate/Hero.Corporate.V02",
        "exportName": "HeroCorporateV02"
    },
    {
        "idx": 32,
        "style": "corporate",
        "importPath": "./Hero/Corporate/Hero.Corporate.V03",
        "exportName": "HeroCorporateV03"
    },
    {
        "idx": 33,
        "style": "corporate",
        "importPath": "./Hero/Corporate/Hero.Corporate.V04",
        "exportName": "HeroCorporateV04"
    },
    {
        "idx": 34,
        "style": "corporate",
        "importPath": "./Hero/Corporate/Hero.Corporate.V05",
        "exportName": "HeroCorporateV05"
    },
    {
        "idx": 35,
        "style": "corporate",
        "importPath": "./Hero/Corporate/Hero.Corporate.V06",
        "exportName": "HeroCorporateV06"
    },
    {
        "idx": 36,
        "style": "corporate",
        "importPath": "./Hero/Corporate/Hero.Corporate.V07",
        "exportName": "HeroCorporateV07"
    },
    {
        "idx": 37,
        "style": "corporate",
        "importPath": "./Hero/Corporate/Hero.Corporate.V08",
        "exportName": "HeroCorporateV08"
    },
    {
        "idx": 38,
        "style": "corporate",
        "importPath": "./Hero/Corporate/Hero.Corporate.V09",
        "exportName": "HeroCorporateV09"
    },
    {
        "idx": 39,
        "style": "corporate",
        "importPath": "./Hero/Corporate/Hero.Corporate.V10",
        "exportName": "HeroCorporateV10"
    },
    {
        "idx": 40,
        "style": "brutalist",
        "importPath": "./Hero/Brutalist/Hero.Brutalist.V01",
        "exportName": "HeroBrutalistV01"
    },
    {
        "idx": 41,
        "style": "brutalist",
        "importPath": "./Hero/Brutalist/Hero.Brutalist.V02",
        "exportName": "HeroBrutalistV02"
    },
    {
        "idx": 42,
        "style": "brutalist",
        "importPath": "./Hero/Brutalist/Hero.Brutalist.V03",
        "exportName": "HeroBrutalistV03"
    },
    {
        "idx": 43,
        "style": "brutalist",
        "importPath": "./Hero/Brutalist/Hero.Brutalist.V04",
        "exportName": "HeroBrutalistV04"
    },
    {
        "idx": 44,
        "style": "brutalist",
        "importPath": "./Hero/Brutalist/Hero.Brutalist.V05",
        "exportName": "HeroBrutalistV05"
    },
    {
        "idx": 45,
        "style": "brutalist",
        "importPath": "./Hero/Brutalist/Hero.Brutalist.V06",
        "exportName": "HeroBrutalistV06"
    },
    {
        "idx": 46,
        "style": "brutalist",
        "importPath": "./Hero/Brutalist/Hero.Brutalist.V07",
        "exportName": "HeroBrutalistV07"
    },
    {
        "idx": 47,
        "style": "brutalist",
        "importPath": "./Hero/Brutalist/Hero.Brutalist.V08",
        "exportName": "HeroBrutalistV08"
    },
    {
        "idx": 48,
        "style": "brutalist",
        "importPath": "./Hero/Brutalist/Hero.Brutalist.V09",
        "exportName": "HeroBrutalistV09"
    },
    {
        "idx": 49,
        "style": "brutalist",
        "importPath": "./Hero/Brutalist/Hero.Brutalist.V10",
        "exportName": "HeroBrutalistV10"
    },
    {
        "idx": 50,
        "style": "glass",
        "importPath": "./Hero/Glass/Hero.Glass.V01",
        "exportName": "HeroGlassV01"
    },
    {
        "idx": 51,
        "style": "glass",
        "importPath": "./Hero/Glass/Hero.Glass.V02",
        "exportName": "HeroGlassV02"
    },
    {
        "idx": 52,
        "style": "glass",
        "importPath": "./Hero/Glass/Hero.Glass.V03",
        "exportName": "HeroGlassV03"
    },
    {
        "idx": 53,
        "style": "glass",
        "importPath": "./Hero/Glass/Hero.Glass.V04",
        "exportName": "HeroGlassV04"
    },
    {
        "idx": 54,
        "style": "glass",
        "importPath": "./Hero/Glass/Hero.Glass.V05",
        "exportName": "HeroGlassV05"
    },
    {
        "idx": 55,
        "style": "glass",
        "importPath": "./Hero/Glass/Hero.Glass.V06",
        "exportName": "HeroGlassV06"
    },
    {
        "idx": 56,
        "style": "glass",
        "importPath": "./Hero/Glass/Hero.Glass.V07",
        "exportName": "HeroGlassV07"
    },
    {
        "idx": 57,
        "style": "glass",
        "importPath": "./Hero/Glass/Hero.Glass.V08",
        "exportName": "HeroGlassV08"
    },
    {
        "idx": 58,
        "style": "glass",
        "importPath": "./Hero/Glass/Hero.Glass.V09",
        "exportName": "HeroGlassV09"
    },
    {
        "idx": 59,
        "style": "glass",
        "importPath": "./Hero/Glass/Hero.Glass.V10",
        "exportName": "HeroGlassV10"
    },
    {
        "idx": 60,
        "style": "gradient",
        "importPath": "./Hero/Gradient/Hero.Gradient.V01",
        "exportName": "HeroGradientV01"
    },
    {
        "idx": 61,
        "style": "gradient",
        "importPath": "./Hero/Gradient/Hero.Gradient.V02",
        "exportName": "HeroGradientV02"
    },
    {
        "idx": 62,
        "style": "gradient",
        "importPath": "./Hero/Gradient/Hero.Gradient.V03",
        "exportName": "HeroGradientV03"
    },
    {
        "idx": 63,
        "style": "gradient",
        "importPath": "./Hero/Gradient/Hero.Gradient.V04",
        "exportName": "HeroGradientV04"
    },
    {
        "idx": 64,
        "style": "gradient",
        "importPath": "./Hero/Gradient/Hero.Gradient.V05",
        "exportName": "HeroGradientV05"
    },
    {
        "idx": 65,
        "style": "gradient",
        "importPath": "./Hero/Gradient/Hero.Gradient.V06",
        "exportName": "HeroGradientV06"
    },
    {
        "idx": 66,
        "style": "gradient",
        "importPath": "./Hero/Gradient/Hero.Gradient.V07",
        "exportName": "HeroGradientV07"
    },
    {
        "idx": 67,
        "style": "gradient",
        "importPath": "./Hero/Gradient/Hero.Gradient.V08",
        "exportName": "HeroGradientV08"
    },
    {
        "idx": 68,
        "style": "gradient",
        "importPath": "./Hero/Gradient/Hero.Gradient.V09",
        "exportName": "HeroGradientV09"
    },
    {
        "idx": 69,
        "style": "gradient",
        "importPath": "./Hero/Gradient/Hero.Gradient.V10",
        "exportName": "HeroGradientV10"
    },
    {
        "idx": 70,
        "style": "mono",
        "importPath": "./Hero/Monochrome/Hero.Monochrome.V01",
        "exportName": "HeroMonochromeV01"
    },
    {
        "idx": 71,
        "style": "mono",
        "importPath": "./Hero/Monochrome/Hero.Monochrome.V02",
        "exportName": "HeroMonochromeV02"
    },
    {
        "idx": 72,
        "style": "mono",
        "importPath": "./Hero/Monochrome/Hero.Monochrome.V03",
        "exportName": "HeroMonochromeV03"
    },
    {
        "idx": 73,
        "style": "mono",
        "importPath": "./Hero/Monochrome/Hero.Monochrome.V04",
        "exportName": "HeroMonochromeV04"
    },
    {
        "idx": 74,
        "style": "mono",
        "importPath": "./Hero/Monochrome/Hero.Monochrome.V05",
        "exportName": "HeroMonochromeV05"
    },
    {
        "idx": 75,
        "style": "mono",
        "importPath": "./Hero/Monochrome/Hero.Monochrome.V06",
        "exportName": "HeroMonochromeV06"
    },
    {
        "idx": 76,
        "style": "mono",
        "importPath": "./Hero/Monochrome/Hero.Monochrome.V07",
        "exportName": "HeroMonochromeV07"
    },
    {
        "idx": 77,
        "style": "mono",
        "importPath": "./Hero/Monochrome/Hero.Monochrome.V08",
        "exportName": "HeroMonochromeV08"
    },
    {
        "idx": 78,
        "style": "mono",
        "importPath": "./Hero/Monochrome/Hero.Monochrome.V09",
        "exportName": "HeroMonochromeV09"
    },
    {
        "idx": 79,
        "style": "mono",
        "importPath": "./Hero/Monochrome/Hero.Monochrome.V10",
        "exportName": "HeroMonochromeV10"
    },
    {
        "idx": 80,
        "style": "editorial",
        "importPath": "./Hero/Editorial/Hero.Editorial.V01",
        "exportName": "HeroEditorialV01"
    },
    {
        "idx": 81,
        "style": "editorial",
        "importPath": "./Hero/Editorial/Hero.Editorial.V02",
        "exportName": "HeroEditorialV02"
    },
    {
        "idx": 82,
        "style": "editorial",
        "importPath": "./Hero/Editorial/Hero.Editorial.V03",
        "exportName": "HeroEditorialV03"
    },
    {
        "idx": 83,
        "style": "editorial",
        "importPath": "./Hero/Editorial/Hero.Editorial.V04",
        "exportName": "HeroEditorialV04"
    },
    {
        "idx": 84,
        "style": "editorial",
        "importPath": "./Hero/Editorial/Hero.Editorial.V05",
        "exportName": "HeroEditorialV05"
    },
    {
        "idx": 85,
        "style": "editorial",
        "importPath": "./Hero/Editorial/Hero.Editorial.V06",
        "exportName": "HeroEditorialV06"
    },
    {
        "idx": 86,
        "style": "editorial",
        "importPath": "./Hero/Editorial/Hero.Editorial.V07",
        "exportName": "HeroEditorialV07"
    },
    {
        "idx": 87,
        "style": "editorial",
        "importPath": "./Hero/Editorial/Hero.Editorial.V08",
        "exportName": "HeroEditorialV08"
    },
    {
        "idx": 88,
        "style": "editorial",
        "importPath": "./Hero/Editorial/Hero.Editorial.V09",
        "exportName": "HeroEditorialV09"
    },
    {
        "idx": 89,
        "style": "editorial",
        "importPath": "./Hero/Editorial/Hero.Editorial.V10",
        "exportName": "HeroEditorialV10"
    },
    {
        "idx": 90,
        "style": "neumorphic",
        "importPath": "./Hero/Neumorphic/Hero.Neumorphic.V01",
        "exportName": "HeroNeumorphicV01"
    },
    {
        "idx": 91,
        "style": "neumorphic",
        "importPath": "./Hero/Neumorphic/Hero.Neumorphic.V02",
        "exportName": "HeroNeumorphicV02"
    },
    {
        "idx": 92,
        "style": "neumorphic",
        "importPath": "./Hero/Neumorphic/Hero.Neumorphic.V03",
        "exportName": "HeroNeumorphicV03"
    },
    {
        "idx": 93,
        "style": "neumorphic",
        "importPath": "./Hero/Neumorphic/Hero.Neumorphic.V04",
        "exportName": "HeroNeumorphicV04"
    },
    {
        "idx": 94,
        "style": "neumorphic",
        "importPath": "./Hero/Neumorphic/Hero.Neumorphic.V05",
        "exportName": "HeroNeumorphicV05"
    },
    {
        "idx": 95,
        "style": "neumorphic",
        "importPath": "./Hero/Neumorphic/Hero.Neumorphic.V06",
        "exportName": "HeroNeumorphicV06"
    },
    {
        "idx": 96,
        "style": "neumorphic",
        "importPath": "./Hero/Neumorphic/Hero.Neumorphic.V07",
        "exportName": "HeroNeumorphicV07"
    },
    {
        "idx": 97,
        "style": "neumorphic",
        "importPath": "./Hero/Neumorphic/Hero.Neumorphic.V08",
        "exportName": "HeroNeumorphicV08"
    },
    {
        "idx": 98,
        "style": "neumorphic",
        "importPath": "./Hero/Neumorphic/Hero.Neumorphic.V09",
        "exportName": "HeroNeumorphicV09"
    },
    {
        "idx": 99,
        "style": "neumorphic",
        "importPath": "./Hero/Neumorphic/Hero.Neumorphic.V10",
        "exportName": "HeroNeumorphicV10"
    }
] as VariantMeta[]
  },
  socialProof: { 
    variants: 7, 
    validate: validateSocialProofProps,
    meta: [] as VariantMeta[]
  },
  features: { 
    variants: 107, // 7 original + 100 new variants
    validate: validateFeaturesProps,
    meta: [
    {
        "idx": 0,
        "style": "minimal",
        "importPath": "./Features/Minimal/Features.Minimal.V01",
        "exportName": "FeaturesMinimalV01"
    },
    {
        "idx": 1,
        "style": "minimal",
        "importPath": "./Features/Minimal/Features.Minimal.V02",
        "exportName": "FeaturesMinimalV02"
    },
    {
        "idx": 2,
        "style": "minimal",
        "importPath": "./Features/Minimal/Features.Minimal.V03",
        "exportName": "FeaturesMinimalV03"
    },
    {
        "idx": 3,
        "style": "minimal",
        "importPath": "./Features/Minimal/Features.Minimal.V04",
        "exportName": "FeaturesMinimalV04"
    },
    {
        "idx": 4,
        "style": "minimal",
        "importPath": "./Features/Minimal/Features.Minimal.V05",
        "exportName": "FeaturesMinimalV05"
    },
    {
        "idx": 5,
        "style": "minimal",
        "importPath": "./Features/Minimal/Features.Minimal.V06",
        "exportName": "FeaturesMinimalV06"
    },
    {
        "idx": 6,
        "style": "minimal",
        "importPath": "./Features/Minimal/Features.Minimal.V07",
        "exportName": "FeaturesMinimalV07"
    },
    {
        "idx": 7,
        "style": "minimal",
        "importPath": "./Features/Minimal/Features.Minimal.V08",
        "exportName": "FeaturesMinimalV08"
    },
    {
        "idx": 8,
        "style": "minimal",
        "importPath": "./Features/Minimal/Features.Minimal.V09",
        "exportName": "FeaturesMinimalV09"
    },
    {
        "idx": 9,
        "style": "minimal",
        "importPath": "./Features/Minimal/Features.Minimal.V10",
        "exportName": "FeaturesMinimalV10"
    },
    {
        "idx": 10,
        "style": "luxury",
        "importPath": "./Features/Luxury/Features.Luxury.V01",
        "exportName": "FeaturesLuxuryV01"
    },
    {
        "idx": 11,
        "style": "luxury",
        "importPath": "./Features/Luxury/Features.Luxury.V02",
        "exportName": "FeaturesLuxuryV02"
    },
    {
        "idx": 12,
        "style": "luxury",
        "importPath": "./Features/Luxury/Features.Luxury.V03",
        "exportName": "FeaturesLuxuryV03"
    },
    {
        "idx": 13,
        "style": "luxury",
        "importPath": "./Features/Luxury/Features.Luxury.V04",
        "exportName": "FeaturesLuxuryV04"
    },
    {
        "idx": 14,
        "style": "luxury",
        "importPath": "./Features/Luxury/Features.Luxury.V05",
        "exportName": "FeaturesLuxuryV05"
    },
    {
        "idx": 15,
        "style": "luxury",
        "importPath": "./Features/Luxury/Features.Luxury.V06",
        "exportName": "FeaturesLuxuryV06"
    },
    {
        "idx": 16,
        "style": "luxury",
        "importPath": "./Features/Luxury/Features.Luxury.V07",
        "exportName": "FeaturesLuxuryV07"
    },
    {
        "idx": 17,
        "style": "luxury",
        "importPath": "./Features/Luxury/Features.Luxury.V08",
        "exportName": "FeaturesLuxuryV08"
    },
    {
        "idx": 18,
        "style": "luxury",
        "importPath": "./Features/Luxury/Features.Luxury.V09",
        "exportName": "FeaturesLuxuryV09"
    },
    {
        "idx": 19,
        "style": "luxury",
        "importPath": "./Features/Luxury/Features.Luxury.V10",
        "exportName": "FeaturesLuxuryV10"
    },
    {
        "idx": 20,
        "style": "playful",
        "importPath": "./Features/Playful/Features.Playful.V01",
        "exportName": "FeaturesPlayfulV01"
    },
    {
        "idx": 21,
        "style": "playful",
        "importPath": "./Features/Playful/Features.Playful.V02",
        "exportName": "FeaturesPlayfulV02"
    },
    {
        "idx": 22,
        "style": "playful",
        "importPath": "./Features/Playful/Features.Playful.V03",
        "exportName": "FeaturesPlayfulV03"
    },
    {
        "idx": 23,
        "style": "playful",
        "importPath": "./Features/Playful/Features.Playful.V04",
        "exportName": "FeaturesPlayfulV04"
    },
    {
        "idx": 24,
        "style": "playful",
        "importPath": "./Features/Playful/Features.Playful.V05",
        "exportName": "FeaturesPlayfulV05"
    },
    {
        "idx": 25,
        "style": "playful",
        "importPath": "./Features/Playful/Features.Playful.V06",
        "exportName": "FeaturesPlayfulV06"
    },
    {
        "idx": 26,
        "style": "playful",
        "importPath": "./Features/Playful/Features.Playful.V07",
        "exportName": "FeaturesPlayfulV07"
    },
    {
        "idx": 27,
        "style": "playful",
        "importPath": "./Features/Playful/Features.Playful.V08",
        "exportName": "FeaturesPlayfulV08"
    },
    {
        "idx": 28,
        "style": "playful",
        "importPath": "./Features/Playful/Features.Playful.V09",
        "exportName": "FeaturesPlayfulV09"
    },
    {
        "idx": 29,
        "style": "playful",
        "importPath": "./Features/Playful/Features.Playful.V10",
        "exportName": "FeaturesPlayfulV10"
    },
    {
        "idx": 30,
        "style": "corporate",
        "importPath": "./Features/Corporate/Features.Corporate.V01",
        "exportName": "FeaturesCorporateV01"
    },
    {
        "idx": 31,
        "style": "corporate",
        "importPath": "./Features/Corporate/Features.Corporate.V02",
        "exportName": "FeaturesCorporateV02"
    },
    {
        "idx": 32,
        "style": "corporate",
        "importPath": "./Features/Corporate/Features.Corporate.V03",
        "exportName": "FeaturesCorporateV03"
    },
    {
        "idx": 33,
        "style": "corporate",
        "importPath": "./Features/Corporate/Features.Corporate.V04",
        "exportName": "FeaturesCorporateV04"
    },
    {
        "idx": 34,
        "style": "corporate",
        "importPath": "./Features/Corporate/Features.Corporate.V05",
        "exportName": "FeaturesCorporateV05"
    },
    {
        "idx": 35,
        "style": "corporate",
        "importPath": "./Features/Corporate/Features.Corporate.V06",
        "exportName": "FeaturesCorporateV06"
    },
    {
        "idx": 36,
        "style": "corporate",
        "importPath": "./Features/Corporate/Features.Corporate.V07",
        "exportName": "FeaturesCorporateV07"
    },
    {
        "idx": 37,
        "style": "corporate",
        "importPath": "./Features/Corporate/Features.Corporate.V08",
        "exportName": "FeaturesCorporateV08"
    },
    {
        "idx": 38,
        "style": "corporate",
        "importPath": "./Features/Corporate/Features.Corporate.V09",
        "exportName": "FeaturesCorporateV09"
    },
    {
        "idx": 39,
        "style": "corporate",
        "importPath": "./Features/Corporate/Features.Corporate.V10",
        "exportName": "FeaturesCorporateV10"
    },
    {
        "idx": 40,
        "style": "brutalist",
        "importPath": "./Features/Brutalist/Features.Brutalist.V01",
        "exportName": "FeaturesBrutalistV01"
    },
    {
        "idx": 41,
        "style": "brutalist",
        "importPath": "./Features/Brutalist/Features.Brutalist.V02",
        "exportName": "FeaturesBrutalistV02"
    },
    {
        "idx": 42,
        "style": "brutalist",
        "importPath": "./Features/Brutalist/Features.Brutalist.V03",
        "exportName": "FeaturesBrutalistV03"
    },
    {
        "idx": 43,
        "style": "brutalist",
        "importPath": "./Features/Brutalist/Features.Brutalist.V04",
        "exportName": "FeaturesBrutalistV04"
    },
    {
        "idx": 44,
        "style": "brutalist",
        "importPath": "./Features/Brutalist/Features.Brutalist.V05",
        "exportName": "FeaturesBrutalistV05"
    },
    {
        "idx": 45,
        "style": "brutalist",
        "importPath": "./Features/Brutalist/Features.Brutalist.V06",
        "exportName": "FeaturesBrutalistV06"
    },
    {
        "idx": 46,
        "style": "brutalist",
        "importPath": "./Features/Brutalist/Features.Brutalist.V07",
        "exportName": "FeaturesBrutalistV07"
    },
    {
        "idx": 47,
        "style": "brutalist",
        "importPath": "./Features/Brutalist/Features.Brutalist.V08",
        "exportName": "FeaturesBrutalistV08"
    },
    {
        "idx": 48,
        "style": "brutalist",
        "importPath": "./Features/Brutalist/Features.Brutalist.V09",
        "exportName": "FeaturesBrutalistV09"
    },
    {
        "idx": 49,
        "style": "brutalist",
        "importPath": "./Features/Brutalist/Features.Brutalist.V10",
        "exportName": "FeaturesBrutalistV10"
    },
    {
        "idx": 50,
        "style": "glass",
        "importPath": "./Features/Glass/Features.Glass.V01",
        "exportName": "FeaturesGlassV01"
    },
    {
        "idx": 51,
        "style": "glass",
        "importPath": "./Features/Glass/Features.Glass.V02",
        "exportName": "FeaturesGlassV02"
    },
    {
        "idx": 52,
        "style": "glass",
        "importPath": "./Features/Glass/Features.Glass.V03",
        "exportName": "FeaturesGlassV03"
    },
    {
        "idx": 53,
        "style": "glass",
        "importPath": "./Features/Glass/Features.Glass.V04",
        "exportName": "FeaturesGlassV04"
    },
    {
        "idx": 54,
        "style": "glass",
        "importPath": "./Features/Glass/Features.Glass.V05",
        "exportName": "FeaturesGlassV05"
    },
    {
        "idx": 55,
        "style": "glass",
        "importPath": "./Features/Glass/Features.Glass.V06",
        "exportName": "FeaturesGlassV06"
    },
    {
        "idx": 56,
        "style": "glass",
        "importPath": "./Features/Glass/Features.Glass.V07",
        "exportName": "FeaturesGlassV07"
    },
    {
        "idx": 57,
        "style": "glass",
        "importPath": "./Features/Glass/Features.Glass.V08",
        "exportName": "FeaturesGlassV08"
    },
    {
        "idx": 58,
        "style": "glass",
        "importPath": "./Features/Glass/Features.Glass.V09",
        "exportName": "FeaturesGlassV09"
    },
    {
        "idx": 59,
        "style": "glass",
        "importPath": "./Features/Glass/Features.Glass.V10",
        "exportName": "FeaturesGlassV10"
    },
    {
        "idx": 60,
        "style": "gradient",
        "importPath": "./Features/Gradient/Features.Gradient.V01",
        "exportName": "FeaturesGradientV01"
    },
    {
        "idx": 61,
        "style": "gradient",
        "importPath": "./Features/Gradient/Features.Gradient.V02",
        "exportName": "FeaturesGradientV02"
    },
    {
        "idx": 62,
        "style": "gradient",
        "importPath": "./Features/Gradient/Features.Gradient.V03",
        "exportName": "FeaturesGradientV03"
    },
    {
        "idx": 63,
        "style": "gradient",
        "importPath": "./Features/Gradient/Features.Gradient.V04",
        "exportName": "FeaturesGradientV04"
    },
    {
        "idx": 64,
        "style": "gradient",
        "importPath": "./Features/Gradient/Features.Gradient.V05",
        "exportName": "FeaturesGradientV05"
    },
    {
        "idx": 65,
        "style": "gradient",
        "importPath": "./Features/Gradient/Features.Gradient.V06",
        "exportName": "FeaturesGradientV06"
    },
    {
        "idx": 66,
        "style": "gradient",
        "importPath": "./Features/Gradient/Features.Gradient.V07",
        "exportName": "FeaturesGradientV07"
    },
    {
        "idx": 67,
        "style": "gradient",
        "importPath": "./Features/Gradient/Features.Gradient.V08",
        "exportName": "FeaturesGradientV08"
    },
    {
        "idx": 68,
        "style": "gradient",
        "importPath": "./Features/Gradient/Features.Gradient.V09",
        "exportName": "FeaturesGradientV09"
    },
    {
        "idx": 69,
        "style": "gradient",
        "importPath": "./Features/Gradient/Features.Gradient.V10",
        "exportName": "FeaturesGradientV10"
    },
    {
        "idx": 70,
        "style": "mono",
        "importPath": "./Features/Monochrome/Features.Monochrome.V01",
        "exportName": "FeaturesMonochromeV01"
    },
    {
        "idx": 71,
        "style": "mono",
        "importPath": "./Features/Monochrome/Features.Monochrome.V02",
        "exportName": "FeaturesMonochromeV02"
    },
    {
        "idx": 72,
        "style": "mono",
        "importPath": "./Features/Monochrome/Features.Monochrome.V03",
        "exportName": "FeaturesMonochromeV03"
    },
    {
        "idx": 73,
        "style": "mono",
        "importPath": "./Features/Monochrome/Features.Monochrome.V04",
        "exportName": "FeaturesMonochromeV04"
    },
    {
        "idx": 74,
        "style": "mono",
        "importPath": "./Features/Monochrome/Features.Monochrome.V05",
        "exportName": "FeaturesMonochromeV05"
    },
    {
        "idx": 75,
        "style": "mono",
        "importPath": "./Features/Monochrome/Features.Monochrome.V06",
        "exportName": "FeaturesMonochromeV06"
    },
    {
        "idx": 76,
        "style": "mono",
        "importPath": "./Features/Monochrome/Features.Monochrome.V07",
        "exportName": "FeaturesMonochromeV07"
    },
    {
        "idx": 77,
        "style": "mono",
        "importPath": "./Features/Monochrome/Features.Monochrome.V08",
        "exportName": "FeaturesMonochromeV08"
    },
    {
        "idx": 78,
        "style": "mono",
        "importPath": "./Features/Monochrome/Features.Monochrome.V09",
        "exportName": "FeaturesMonochromeV09"
    },
    {
        "idx": 79,
        "style": "mono",
        "importPath": "./Features/Monochrome/Features.Monochrome.V10",
        "exportName": "FeaturesMonochromeV10"
    },
    {
        "idx": 80,
        "style": "editorial",
        "importPath": "./Features/Editorial/Features.Editorial.V01",
        "exportName": "FeaturesEditorialV01"
    },
    {
        "idx": 81,
        "style": "editorial",
        "importPath": "./Features/Editorial/Features.Editorial.V02",
        "exportName": "FeaturesEditorialV02"
    },
    {
        "idx": 82,
        "style": "editorial",
        "importPath": "./Features/Editorial/Features.Editorial.V03",
        "exportName": "FeaturesEditorialV03"
    },
    {
        "idx": 83,
        "style": "editorial",
        "importPath": "./Features/Editorial/Features.Editorial.V04",
        "exportName": "FeaturesEditorialV04"
    },
    {
        "idx": 84,
        "style": "editorial",
        "importPath": "./Features/Editorial/Features.Editorial.V05",
        "exportName": "FeaturesEditorialV05"
    },
    {
        "idx": 85,
        "style": "editorial",
        "importPath": "./Features/Editorial/Features.Editorial.V06",
        "exportName": "FeaturesEditorialV06"
    },
    {
        "idx": 86,
        "style": "editorial",
        "importPath": "./Features/Editorial/Features.Editorial.V07",
        "exportName": "FeaturesEditorialV07"
    },
    {
        "idx": 87,
        "style": "editorial",
        "importPath": "./Features/Editorial/Features.Editorial.V08",
        "exportName": "FeaturesEditorialV08"
    },
    {
        "idx": 88,
        "style": "editorial",
        "importPath": "./Features/Editorial/Features.Editorial.V09",
        "exportName": "FeaturesEditorialV09"
    },
    {
        "idx": 89,
        "style": "editorial",
        "importPath": "./Features/Editorial/Features.Editorial.V10",
        "exportName": "FeaturesEditorialV10"
    },
    {
        "idx": 90,
        "style": "neumorphic",
        "importPath": "./Features/Neumorphic/Features.Neumorphic.V01",
        "exportName": "FeaturesNeumorphicV01"
    },
    {
        "idx": 91,
        "style": "neumorphic",
        "importPath": "./Features/Neumorphic/Features.Neumorphic.V02",
        "exportName": "FeaturesNeumorphicV02"
    },
    {
        "idx": 92,
        "style": "neumorphic",
        "importPath": "./Features/Neumorphic/Features.Neumorphic.V03",
        "exportName": "FeaturesNeumorphicV03"
    },
    {
        "idx": 93,
        "style": "neumorphic",
        "importPath": "./Features/Neumorphic/Features.Neumorphic.V04",
        "exportName": "FeaturesNeumorphicV04"
    },
    {
        "idx": 94,
        "style": "neumorphic",
        "importPath": "./Features/Neumorphic/Features.Neumorphic.V05",
        "exportName": "FeaturesNeumorphicV05"
    },
    {
        "idx": 95,
        "style": "neumorphic",
        "importPath": "./Features/Neumorphic/Features.Neumorphic.V06",
        "exportName": "FeaturesNeumorphicV06"
    },
    {
        "idx": 96,
        "style": "neumorphic",
        "importPath": "./Features/Neumorphic/Features.Neumorphic.V07",
        "exportName": "FeaturesNeumorphicV07"
    },
    {
        "idx": 97,
        "style": "neumorphic",
        "importPath": "./Features/Neumorphic/Features.Neumorphic.V08",
        "exportName": "FeaturesNeumorphicV08"
    },
    {
        "idx": 98,
        "style": "neumorphic",
        "importPath": "./Features/Neumorphic/Features.Neumorphic.V09",
        "exportName": "FeaturesNeumorphicV09"
    },
    {
        "idx": 99,
        "style": "neumorphic",
        "importPath": "./Features/Neumorphic/Features.Neumorphic.V10",
        "exportName": "FeaturesNeumorphicV10"
    }
] as VariantMeta[]
  },
  featureSpotlight: { 
    variants: 7, 
    validate: validateFeatureSpotlightProps,
    meta: [] as VariantMeta[]
  },
  testimonials: { 
    variants: 7, 
    validate: validateTestimonialsProps,
    meta: [] as VariantMeta[]
  },
  metrics: { 
    variants: 7, 
    validate: validateMetricsProps,
    meta: [] as VariantMeta[]
  },
  pricing: { 
    variants: 7, 
    validate: validatePricingProps,
    meta: [] as VariantMeta[]
  },
  faq: { 
    variants: 7, 
    validate: validateFaqProps,
    meta: [] as VariantMeta[]
  },
  finalCta: { 
    variants: 7, 
    validate: validateFinalCtaProps,
    meta: [] as VariantMeta[]
  },
  footer: { 
    variants: 7, 
    validate: validateFooterProps,
    meta: [] as VariantMeta[]
  }
} as const;

// Type guard for section IDs
export const isValidSectionID = (id: string): id is SectionID => {
  return Object.keys(registry).includes(id);
};

// Get variant count for a section
export const getVariantCount = (sectionId: SectionID): number => {
  return registry[sectionId].variants;
};

// Validate variant number
export const isValidVariant = (sectionId: SectionID, variant: number): boolean => {
  return variant >= 1 && variant <= getVariantCount(sectionId);
};

// Validate section props
export const validateSectionProps = (sectionId: SectionID, props: unknown): SectionProps => {
  const validator = registry[sectionId].validate;
  return validator(props);
};

// Get variants by style for a section
export const getVariantsByStyle = (section: SectionID, style: StyleSlug): number[] => {
  return registry[section].meta
    .filter((variant: VariantMeta) => variant.style === style)
    .map((variant: VariantMeta) => variant.idx);
};

// Get all available styles for a section
export const getAvailableStyles = (section: SectionID): StyleSlug[] => {
  const styles = new Set<StyleSlug>();
  registry[section].meta.forEach((variant: VariantMeta) => {
    styles.add(variant.style);
  });
  return Array.from(styles);
};

// Get variant metadata by index
export const getVariantMeta = (section: SectionID, variantIndex: number): VariantMeta | undefined => {
  return registry[section].meta.find((variant: VariantMeta) => variant.idx === variantIndex);
};
