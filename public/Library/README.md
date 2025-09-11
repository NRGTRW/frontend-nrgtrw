# Landing Page Generator

A comprehensive React + TypeScript + Tailwind landing page generator with dynamic component variants, content seeding, and AI integration capabilities.

## Features

- **Dynamic Component System**: 7 variants for each component category with strict type safety
- **Content Seeding**: Rule-based content generation for different industries and tones
- **AI Integration Ready**: Complete schema and validation for LLM-generated content
- **Preview System**: Real-time preview with variant switching and JSON editing
- **Type-Safe**: Full TypeScript support with Zod validation
- **Production Ready**: Complete landing pages with all required sections
- **Component Parity**: Automated variant generation and registry management
- **Security**: No eval, sanitized HTML, strict validation throughout

## Quick Start

```bash
npm install
npm run start
```

Visit `http://localhost:5174/preview` to see the preview system in action.

## Available Scripts

- `npm run start` - Start development server
- `npm run gen:default` - Generate default PageConfig.json
- `npm run gen:random` - Generate randomized PageConfig.json with seed
- `npm run gen:preview` - Start preview server
- `npm run gen:validate` - Validate PageConfig.json
- `npm run test:generator` - Test generator functionality
- `npm run variant:add <section>` - Add new variant to a section
- `npm run test` - Run test suite
- `npm run test:watch` - Run tests in watch mode

## Component Categories

Each category has exactly 7 variants to maintain parity:

- **Navbar** - Navigation headers with logos and CTAs
- **Hero** - Main landing sections with headlines and CTAs
- **SocialProof** - Client logos and trust badges
- **Features** - Feature lists with icons and descriptions
- **FeatureSpotlight** - Detailed feature showcases
- **Testimonials** - Customer testimonials and reviews
- **Metrics** - Key performance indicators and statistics
- **Pricing** - Pricing plans and tiers
- **FAQ** - Frequently asked questions
- **FinalCTA** - Final call-to-action sections
- **Footer** - Site footers with links and information

## System Architecture

### Core Components

- **`types/landing.ts`** - Complete TypeScript definitions for all landing page types
- **`generator/registry.ts`** - Component registry with validation and variant counts
- **`generator/composePage.ts`** - Page composition engine with validation
- **`generator/builders.ts`** - Configuration builders for default and randomized pages
- **`preview/PreviewPage.tsx`** - Interactive preview system with state management
- **`preview/state.ts`** - Zustand store for preview state management
- **`ai/planSchema.ts`** - AI plan validation schemas
- **`ai/applyPlan.ts`** - AI plan application and merging logic
- **`scripts/codegen/newVariant.ts`** - Automated variant generation script

### Security Features

- **No eval()** - All code is statically analyzed and type-safe
- **No dynamic imports** - Components are registered at build time
- **Sanitized HTML** - All user content is validated and sanitized
- **Strict TypeScript** - No `any` types, comprehensive type coverage
- **Runtime Validation** - Zod schemas validate all data at runtime

### AI Integration

The system is designed for seamless AI integration:

```typescript
// AI-generated plan structure
const aiPlan = {
  brand: { name: "AI Company", tone: "corporate" },
  sections: [
    { id: "hero", variant: 3, props: { headline: "AI Generated" } }
  ]
};

// Apply AI plan with validation and defaults
const config = applyAIPlan(aiPlan);
const page = composePage(config);
```

## Adding a Variant Safely

To add a new variant while preserving parity:

1. **Create the component file** in the appropriate category directory:
   ```jsx
   // src/components/Features/FeaturesV8.jsx
   import React from 'react';
   import PropTypes from 'prop-types';

   const FeaturesV8 = ({ items, brand }) => {
     return (
       <section className="py-16 sm:py-24 bg-[var(--background-light)] dark:bg-[var(--background-dark)]">
         {/* Your component implementation */}
       </section>
     );
   };

   FeaturesV8.propTypes = {
     items: PropTypes.arrayOf(PropTypes.shape({
       icon: PropTypes.shape({
         kind: PropTypes.oneOf(['image', 'video', 'icon']),
         src: PropTypes.string,
         alt: PropTypes.string
       }),
       title: PropTypes.string.isRequired,
       body: PropTypes.string.isRequired
     })).isRequired,
     brand: PropTypes.object
   };

   export default FeaturesV8;
   ```

2. **Update the index file** to export the new variant:
   ```javascript
   // src/components/Features/index.js
   export { default as FeaturesV8 } from './FeaturesV8';
   
   export const FeaturesVariants = [
     FeaturesV1,
     FeaturesV2,
     // ... existing variants
     FeaturesV8
   ];
   ```

3. **Update all other categories** to have the same number of variants (8 in this case)

4. **Update the component registry** to include the new variant count

5. **Run tests** to ensure everything works:
   ```bash
   npm run test:generator
   ```

## Content Seeding

Generate content programmatically:

```javascript
import { generateContentSeed } from './src/generator/contentSeed';

const content = generateContentSeed({
  brandDescription: 'AI-powered analytics platform',
  industry: 'technology',
  targetAudience: 'data scientists',
  tone: 'corporate'
});
```

## AI Integration

The system is ready for AI integration with structured schemas:

```javascript
import { applyAIPlan } from './src/ai/applyPlan';

const aiPlan = {
  brand: { name: 'AI Generated Brand', tone: 'corporate' },
  sections: [
    { id: 'hero', variant: 3, props: { /* AI generated props */ } }
  ]
};

const config = applyAIPlan(aiPlan);
```

## Architecture

- **Types**: `src/types/landing.ts` - TypeScript definitions
- **Validation**: `src/utils/validation.ts` - Prop validation
- **Generation**: `src/generator/` - Page composition and content seeding
- **AI**: `src/ai/` - AI integration schemas and application
- **Components**: `src/components/` - All component variants
- **Tests**: `src/tests/` - Unit tests

## Contributing

1. Maintain component parity (same number of variants per category)
2. Follow existing prop interfaces
3. Add tests for new functionality
4. Update documentation for new features
