# Variant System Documentation

## Overview

The variant system provides a comprehensive way to generate and manage 100+ variants per section with style-based grouping. This system ensures design consistency while providing extensive customization options.

## Style Taxonomy

The system uses 10 distinct style groups, each with 10 variants:

### Style Groups

1. **Minimal** (`minimal`) - Clean, simple designs with minimal decoration
2. **Luxury** (`luxury`) - Premium, sophisticated designs with elegant touches
3. **Playful** (`playful`) - Fun, colorful designs with rounded corners and vibrant accents
4. **Corporate** (`corporate`) - Professional, business-focused designs
5. **Brutalist** (`brutalist`) - Bold, stark designs with strong typography
6. **Glass** (`glass`) - Modern designs with backdrop blur and transparency effects
7. **Gradient** (`gradient`) - Colorful designs with gradient backgrounds
8. **Monochrome** (`mono`) - Black and white designs with subtle variations
9. **Editorial** (`editorial`) - Typography-focused designs with italic accents
10. **Neumorphic** (`neumorphic`) - Soft, tactile designs with inset shadows

## File Naming Convention

All generated variants follow a strict naming pattern:

```
<Section>.<StyleName>.VXX.tsx
```

Examples:
- `Hero.Minimal.V01.tsx`
- `Hero.Luxury.V01.tsx`
- `Navbar.Corporate.V05.tsx`
- `Footer.Neumorphic.V10.tsx`

## Component Structure

### Props Interface

All variants of a section share the same props interface:

```typescript
interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  image?: string;
  features?: Array<{title: string; description: string}>;
  // ... other props
}
```

### Style Application

Components use the `getStyleClasses` function to apply consistent styling:

```typescript
import { getStyleClasses } from '../../../styles/styleMaps';

const styles = getStyleClasses('minimal');
// Returns: { card: "bg-white/2 border-white/10", accent: "text-white", ... }
```

## Variation Knobs

Each variant includes deterministic variation knobs to ensure uniqueness:

### Layout Options
- `center` - Centered content layout
- `split` - Two-column split layout
- `left` - Content on left, media on right
- `right` - Content on right, media on left
- `top` - Content above media

### Density Options
- `compact` - Tight spacing (`py-8 px-4`)
- `regular` - Standard spacing (`py-12 px-6`)
- `roomy` - Generous spacing (`py-16 px-8`)

### Ornament Options
- `minimal` - No decorative elements
- `moderate` - Subtle decorative elements
- `rich` - Prominent decorative elements

### CTA Style Options
- `solid` - Filled button style
- `outline` - Outlined button style
- `ghost` - Transparent button style

### Typography Options
- `small` - Smaller heading size (`text-2xl`)
- `medium` - Standard heading size (`text-3xl`)
- `large` - Larger heading size (`text-4xl`)

### Motion Options
- `none` - No animations
- `fade` - Fade-in animation
- `slide` - Slide-up animation

## Code Generation

### Bulk Generation Script

Generate variants for a specific section:

```bash
pnpm variants:bulk <sectionId> --per-style 10
```

Examples:
```bash
pnpm variants:bulk hero --per-style 10
pnpm variants:bulk navbar --per-style 10
```

### Generate All Sections

```bash
pnpm variants:all
```

This will output commands to generate variants for all sections.

### Individual Section Scripts

```bash
pnpm variants:hero
pnpm variants:navbar
pnpm variants:socialProof
# ... etc for all sections
```

## Registry Integration

### Variant Metadata

Each variant is registered with metadata:

```typescript
type VariantMeta = {
  idx: number;           // Sequential index
  style: StyleSlug;      // Style group
  importPath: string;    // Import path
  exportName: string;    // Component name
};
```

### Style Filtering

Filter variants by style:

```typescript
import { getVariantsByStyle } from '../generator/registry';

const minimalHeroVariants = getVariantsByStyle('hero', 'minimal');
// Returns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### Available Styles

Get all available styles for a section:

```typescript
import { getAvailableStyles } from '../generator/registry';

const heroStyles = getAvailableStyles('hero');
// Returns: ['minimal', 'luxury', 'playful', ...]
```

## Preview Integration

### Style Filter Component

The `StyleFilter` component provides UI for filtering variants by style:

```tsx
import { StyleFilter } from '../preview/controls/StyleFilter';

<StyleFilter
  sectionId="hero"
  currentVariant={currentVariant}
  onVariantChange={setCurrentVariant}
/>
```

### Style-Aware Randomization

Generate configurations with style constraints:

```typescript
import { buildConfigWithStyle } from '../generator/builders';

const luxuryConfig = buildConfigWithStyle(brandInfo, 'luxury');
```

## Design Guidelines

### Do's

✅ **Use design tokens only** - All colors and spacing should use existing tokens
✅ **Maintain prop parity** - All variants must accept the same props
✅ **Follow naming conventions** - Use the exact naming pattern specified
✅ **Include variation knobs** - Ensure each variant is visually distinct
✅ **Test accessibility** - Maintain focus rings and ARIA labels
✅ **Optimize performance** - Use only opacity and transform animations

### Don'ts

❌ **No hard-coded colors** - Don't use colors outside the design system
❌ **No breaking changes** - Don't modify existing prop interfaces
❌ **No external dependencies** - Don't add new dependencies to variants
❌ **No layout shifts** - Don't cause content to jump during loading
❌ **No complex animations** - Keep animations simple and performant

## Testing

### Running Tests

```bash
pnpm test variants.bulk
```

### Test Coverage

The test suite covers:
- Registry structure validation
- Style distribution verification
- Variant metadata validation
- Helper function correctness
- Performance and accessibility checks

## Performance Considerations

### Bundle Size

- Each variant is a separate component file
- Tree-shaking ensures only used variants are bundled
- Lazy loading can be implemented for large variant sets

### Runtime Performance

- Variants use only CSS classes (no inline styles)
- Animations are CSS-based (no JavaScript)
- No external network calls in components

### Memory Usage

- Components are stateless (no internal state)
- Props are passed down from parent components
- No memory leaks from event listeners

## Accessibility

### Focus Management

- All interactive elements maintain focus rings
- Keyboard navigation is preserved
- Screen reader compatibility is maintained

### Motion Preferences

- Animations respect `prefers-reduced-motion`
- Fallbacks are provided for motion-sensitive users
- No essential content is hidden behind animations

### Color Contrast

- All style variants maintain WCAG AA compliance
- High contrast alternatives are available
- Color is not the only way to convey information

## Troubleshooting

### Common Issues

**Variant not generating:**
- Check section ID spelling
- Ensure template file exists
- Verify registry configuration

**Style not applying:**
- Check style slug spelling
- Verify style classes are defined
- Ensure component imports style maps

**Build errors:**
- Check TypeScript compilation
- Verify all imports are correct
- Ensure props interfaces match

### Debug Commands

```bash
# Check registry status
pnpm test:generator

# Validate configuration
pnpm gen:validate

# Test specific section
pnpm test variants.bulk --grep "hero"
```

## Future Enhancements

### Planned Features

- **Dynamic variant loading** - Load variants on demand
- **Custom style groups** - Allow user-defined style categories
- **Variant previews** - Thumbnail generation for variants
- **A/B testing** - Built-in variant testing framework
- **Analytics integration** - Track variant performance

### Extension Points

- **Custom variation knobs** - Add new variation types
- **Style inheritance** - Create style hierarchies
- **Theme variants** - Support multiple color themes
- **Responsive variants** - Different layouts per breakpoint
