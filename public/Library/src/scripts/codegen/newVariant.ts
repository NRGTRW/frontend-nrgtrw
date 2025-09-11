import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Component templates
const COMPONENT_TEMPLATES = {
  navbar: `import React from 'react';
import PropTypes from 'prop-types';

const NavbarV{num} = ({ links, cta, brand }) => {
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {brand?.name || 'Brand'}
            </span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          {cta && (
            <div className="ml-4">
              <a
                href={cta.href}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                {cta.label}
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

NavbarV{num}.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    external: PropTypes.bool
  })).isRequired,
  cta: PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    external: PropTypes.bool
  }),
  brand: PropTypes.object
};

export default NavbarV{num};`,

  hero: `import React from 'react';
import PropTypes from 'prop-types';

const HeroV{num} = ({ headline, subhead, primaryCta, secondaryCta, media, brand }) => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {headline}
          </h1>
          {subhead && (
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              {subhead}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {primaryCta && (
              <a
                href={primaryCta.href}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
          {media && (
            <div className="mt-12">
              {media.kind === 'image' ? (
                <img
                  src={media.src}
                  alt={media.alt || headline}
                  className="mx-auto rounded-lg shadow-2xl max-w-4xl w-full"
                />
              ) : media.kind === 'video' ? (
                <video
                  src={media.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="mx-auto rounded-lg shadow-2xl max-w-4xl w-full"
                />
              ) : (
                <div className="text-6xl">{media.src}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

HeroV{num}.propTypes = {
  headline: PropTypes.string.isRequired,
  subhead: PropTypes.string,
  primaryCta: PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    external: PropTypes.bool
  }).isRequired,
  secondaryCta: PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    external: PropTypes.bool
  }),
  media: PropTypes.shape({
    kind: PropTypes.oneOf(['image', 'video', 'icon']).isRequired,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string
  }),
  brand: PropTypes.object
};

export default HeroV{num};`,

  socialProof: `import React from 'react';
import PropTypes from 'prop-types';

const SocialProofV{num} = ({ logos, caption, brand }) => {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {caption && (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8 uppercase tracking-wider">
            {caption}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          {logos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center h-12">
              {logo.kind === 'image' ? (
                <img
                  src={logo.src}
                  alt={logo.alt || \`Client logo \${index + 1}\`}
                  className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              ) : (
                <div className="text-2xl">{logo.src}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

SocialProofV{num}.propTypes = {
  logos: PropTypes.arrayOf(PropTypes.shape({
    kind: PropTypes.oneOf(['image', 'video', 'icon']).isRequired,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string
  })).isRequired,
  caption: PropTypes.string,
  brand: PropTypes.object
};

export default SocialProofV{num};`
};

// Generate a new variant
export function generateNewVariant(sectionId: string): void {
  const sectionIdLower = sectionId.toLowerCase();
  const sectionIdPascal = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
  
  // Check if section is supported
  if (!COMPONENT_TEMPLATES[sectionIdLower as keyof typeof COMPONENT_TEMPLATES]) {
    throw new Error(`Unsupported section: ${sectionId}. Supported sections: ${Object.keys(COMPONENT_TEMPLATES).join(', ')}`);
  }
  
  const componentsDir = path.join(__dirname, '../../components', sectionIdPascal);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }
  
  // Find the next variant number
  const existingFiles = fs.readdirSync(componentsDir)
    .filter(file => file.startsWith(`${sectionIdPascal}V`) && file.endsWith('.tsx'))
    .map(file => {
      const match = file.match(new RegExp(`${sectionIdPascal}V(\\d+)\\.tsx`));
      return match ? parseInt(match[1]) : 0;
    })
    .filter(num => num > 0);
  
  const nextVariant = existingFiles.length > 0 ? Math.max(...existingFiles) + 1 : 1;
  
  // Generate component file
  const template = COMPONENT_TEMPLATES[sectionIdLower as keyof typeof COMPONENT_TEMPLATES];
  const componentContent = template.replace(/{num}/g, nextVariant.toString());
  
  const componentFile = path.join(componentsDir, `${sectionIdPascal}V${nextVariant}.tsx`);
  fs.writeFileSync(componentFile, componentContent);
  
  // Update index file
  const indexFile = path.join(componentsDir, 'index.ts');
  let indexContent = '';
  
  if (fs.existsSync(indexFile)) {
    indexContent = fs.readFileSync(indexFile, 'utf8');
  } else {
    indexContent = `// ${sectionIdPascal} component variants\n`;
  }
  
  // Add export for new variant
  const exportLine = `export { default as ${sectionIdPascal}V${nextVariant} } from './${sectionIdPascal}V${nextVariant}';\n`;
  
  if (!indexContent.includes(exportLine)) {
    indexContent += exportLine;
  }
  
  // Update variants array
  const variantsArrayRegex = new RegExp(`export const ${sectionIdPascal}Variants = \\[(.*?)\\]`, 's');
  const match = indexContent.match(variantsArrayRegex);
  
  if (match) {
    const existingVariants = match[1].split(',').map(v => v.trim()).filter(v => v);
    existingVariants.push(`${sectionIdPascal}V${nextVariant}`);
    const newVariantsArray = `export const ${sectionIdPascal}Variants = [\n  ${existingVariants.join(',\n  ')}\n];`;
    indexContent = indexContent.replace(variantsArrayRegex, newVariantsArray);
  } else {
    // Create variants array if it doesn't exist
    const variantsArray = `export const ${sectionIdPascal}Variants = [\n  ${sectionIdPascal}V${nextVariant}\n];`;
    indexContent += `\n${variantsArray}\n`;
  }
  
  fs.writeFileSync(indexFile, indexContent);
  
  // Update registry
  const registryFile = path.join(__dirname, '../generator/registry.ts');
  if (fs.existsSync(registryFile)) {
    let registryContent = fs.readFileSync(registryFile, 'utf8');
    
    // Update variant count
    const variantCountRegex = new RegExp(`(\\s+${sectionIdLower}:\\s*{\\s*variants:\\s*)(\\d+)(,.*?})`, 's');
    const variantMatch = registryContent.match(variantCountRegex);
    
    if (variantMatch) {
      const newCount = parseInt(variantMatch[2]) + 1;
      registryContent = registryContent.replace(variantCountRegex, `$1${newCount}$3`);
      fs.writeFileSync(registryFile, registryContent);
    }
  }
  
  console.log(`✅ Created ${sectionIdPascal}V${nextVariant}.tsx`);
  console.log(`✅ Updated ${sectionIdPascal}/index.ts`);
  console.log(`✅ Updated registry.ts`);
  console.log(`\n🎉 New variant ${sectionIdPascal}V${nextVariant} created successfully!`);
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const sectionId = process.argv[2];
  
  if (!sectionId) {
    console.error('Usage: pnpm variant:add <sectionId>');
    console.error('Supported sections:', Object.keys(COMPONENT_TEMPLATES).join(', '));
    process.exit(1);
  }
  
  try {
    generateNewVariant(sectionId);
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}
