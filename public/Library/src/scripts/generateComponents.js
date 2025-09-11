// Script to generate remaining component variants
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Component templates
const componentTemplates = {
  FeatureSpotlight: {
    base: `import React from 'react';
import PropTypes from 'prop-types';

const FeatureSpotlightV{num} = ({ blocks, brand }) => {
  return (
    <section className="py-16 sm:py-24 bg-[var(--background-light)] dark:bg-[var(--background-dark)]">
      <div className="container mx-auto px-4 sm:px-6">
        {blocks.map((block, index) => (
          <div key={index} className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 mb-16 sm:mb-24 last:mb-0">
            <div className="flex-1">
              <h3 className="text-2xl sm:text-3xl font-light text-[var(--text-light)] dark:text-[var(--text-dark)] mb-4">
                {block.headline}
              </h3>
              <p className="text-base sm:text-lg text-[var(--text-light)]/70 dark:text-[var(--text-dark)]/70 leading-relaxed mb-6">
                {block.body}
              </p>
              {block.cta && (
                <a href={block.cta.href} className="inline-flex items-center px-6 py-3 bg-[var(--primary)] dark:bg-[var(--primary-dark)] text-white rounded-lg hover:bg-[var(--primary)]/90 dark:hover:bg-[var(--primary-dark)]/90 transition-colors duration-300">
                  {block.cta.label}
                </a>
              )}
            </div>
            <div className="flex-1">
              {block.media?.kind === 'image' ? (
                <img src={block.media.src} alt={block.media.alt || block.headline} className="w-full h-auto rounded-lg shadow-lg" />
              ) : block.media?.kind === 'video' ? (
                <video src={block.media.src} className="w-full h-auto rounded-lg shadow-lg" autoPlay loop muted playsInline />
              ) : (
                <div className="w-full h-64 bg-[var(--card-background-light)] dark:bg-[var(--card-background-dark)] rounded-lg shadow-lg flex items-center justify-center">
                  <span className="text-4xl">{block.media?.src || '📊'}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

FeatureSpotlightV{num}.propTypes = {
  blocks: PropTypes.arrayOf(PropTypes.shape({
    headline: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    media: PropTypes.shape({
      kind: PropTypes.oneOf(['image', 'video', 'icon']),
      src: PropTypes.string,
      alt: PropTypes.string
    }),
    cta: PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired
    }),
    mediaSide: PropTypes.oneOf(['left', 'right'])
  })).isRequired,
  brand: PropTypes.object
};

export default FeatureSpotlightV{num};`,
    variants: [
      { className: "bg-gradient-to-r from-[var(--primary)]/5 to-[var(--primary-dark)]/5" },
      { className: "bg-[var(--card-background-light)] dark:bg-[var(--card-background-dark)]" },
      { className: "bg-gradient-to-b from-transparent to-[var(--primary)]/5" },
      { className: "bg-[var(--background-light)] dark:bg-[var(--background-dark)]" },
      { className: "bg-gradient-to-r from-[var(--primary)]/10 to-transparent" },
      { className: "bg-[var(--card-background-light)] dark:bg-[var(--card-background-dark)]" }
    ]
  },
  
  Testimonials: {
    base: `import React from 'react';
import PropTypes from 'prop-types';

const TestimonialsV{num} = ({ items, brand }) => {
  return (
    <section className="py-16 sm:py-24 {className}">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[var(--text-light)] dark:text-[var(--text-dark)] mb-4">
            What Our Clients Say
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {items.map((item, index) => (
            <div key={index} className="p-6 bg-white dark:bg-[var(--background-dark)] rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <p className="text-sm sm:text-base text-[var(--text-light)] dark:text-[var(--text-dark)] mb-4 italic leading-relaxed">
                "{item.quote}"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[var(--primary)] dark:bg-[var(--primary-dark)] rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                  {item.avatar?.kind === 'image' ? (
                    <img src={item.avatar.src} alt={item.avatar.alt} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    item.name.charAt(0)
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base text-[var(--text-light)] dark:text-[var(--text-dark)]">
                    {item.name}
                  </p>
                  {item.role && (
                    <p className="text-xs text-[var(--text-light)]/60 dark:text-[var(--text-dark)]/60">
                      {item.role}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

TestimonialsV{num}.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    quote: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string,
    avatar: PropTypes.shape({
      kind: PropTypes.oneOf(['image', 'video', 'icon']),
      src: PropTypes.string,
      alt: PropTypes.string
    })
  })).isRequired,
  brand: PropTypes.object
};

export default TestimonialsV{num};`,
    variants: [
      { className: "bg-[var(--card-background-light)] dark:bg-[var(--card-background-dark)]" },
      { className: "bg-gradient-to-r from-[var(--primary)]/5 to-[var(--primary-dark)]/5" },
      { className: "bg-[var(--background-light)] dark:bg-[var(--background-dark)]" },
      { className: "bg-gradient-to-b from-transparent to-[var(--primary)]/5" },
      { className: "bg-[var(--card-background-light)] dark:bg-[var(--card-background-dark)]" },
      { className: "bg-gradient-to-r from-[var(--primary)]/10 to-transparent" }
    ]
  },

  Metrics: {
    base: `import React from 'react';
import PropTypes from 'prop-types';

const MetricsV{num} = ({ items, brand }) => {
  return (
    <section className="py-16 sm:py-24 {className}">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[var(--text-light)] dark:text-[var(--text-dark)] mb-4">
            Our Impact
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
          {items.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[var(--primary)] dark:text-[var(--primary-dark)] mb-2">
                {item.value}
              </div>
              <div className="text-sm text-[var(--text-light)]/70 dark:text-[var(--text-dark)]/70">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

MetricsV{num}.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })).isRequired,
  brand: PropTypes.object
};

export default MetricsV{num};`,
    variants: [
      { className: "bg-[var(--background-light)] dark:bg-[var(--background-dark)]" },
      { className: "bg-gradient-to-r from-[var(--primary)]/5 to-[var(--primary-dark)]/5" },
      { className: "bg-[var(--card-background-light)] dark:bg-[var(--card-background-dark)]" },
      { className: "bg-gradient-to-b from-transparent to-[var(--primary)]/5" },
      { className: "bg-[var(--background-light)] dark:bg-[var(--background-dark)]" },
      { className: "bg-gradient-to-r from-[var(--primary)]/10 to-transparent" }
    ]
  },

  FAQ: {
    base: `import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FAQV{num} = ({ items, brand }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-16 sm:py-24 {className}">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[var(--text-light)] dark:text-[var(--text-dark)] mb-4">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="max-w-3xl mx-auto">
          {items.map((item, index) => (
            <div key={index} className="border-b border-[var(--primary)]/10 dark:border-[var(--primary-dark)]/10 last:border-b-0">
              <button
                className="w-full text-left py-6 flex items-center justify-between"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <h3 className="text-lg font-medium text-[var(--text-light)] dark:text-[var(--text-dark)]">
                  {item.q}
                </h3>
                <span className="text-[var(--primary)] dark:text-[var(--primary-dark)] text-xl">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="pb-6">
                  <p className="text-sm text-[var(--text-light)]/70 dark:text-[var(--text-dark)]/70 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

FAQV{num}.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    q: PropTypes.string.isRequired,
    a: PropTypes.string.isRequired
  })).isRequired,
  brand: PropTypes.object
};

export default FAQV{num};`,
    variants: [
      { className: "bg-[var(--card-background-light)] dark:bg-[var(--card-background-dark)]" },
      { className: "bg-gradient-to-r from-[var(--primary)]/5 to-[var(--primary-dark)]/5" },
      { className: "bg-[var(--background-light)] dark:bg-[var(--background-dark)]" },
      { className: "bg-gradient-to-b from-transparent to-[var(--primary)]/5" },
      { className: "bg-[var(--card-background-light)] dark:bg-[var(--card-background-dark)]" },
      { className: "bg-gradient-to-r from-[var(--primary)]/10 to-transparent" }
    ]
  },

  FinalCTA: {
    base: `import React from 'react';
import PropTypes from 'prop-types';

const FinalCTAV{num} = ({ headline, subhead, cta, brand }) => {
  return (
    <section className="py-16 sm:py-24 {className}">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[var(--text-light)] dark:text-[var(--text-dark)] mb-4">
            {headline}
          </h2>
          {subhead && (
            <p className="text-lg text-[var(--text-light)]/70 dark:text-[var(--text-dark)]/70 mb-8">
              {subhead}
            </p>
          )}
          <a
            href={cta.href}
            className="inline-flex items-center px-8 py-4 bg-[var(--primary)] dark:bg-[var(--primary-dark)] text-white rounded-lg hover:bg-[var(--primary)]/90 dark:hover:bg-[var(--primary-dark)]/90 transition-colors duration-300 text-lg font-medium"
          >
            {cta.label}
          </a>
        </div>
      </div>
    </section>
  );
};

FinalCTAV{num}.propTypes = {
  headline: PropTypes.string.isRequired,
  subhead: PropTypes.string,
  cta: PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired
  }).isRequired,
  brand: PropTypes.object
};

export default FinalCTAV{num};`,
    variants: [
      { className: "bg-[var(--primary)] dark:bg-[var(--primary-dark)] text-white" },
      { className: "bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white" },
      { className: "bg-[var(--background-light)] dark:bg-[var(--background-dark)]" },
      { className: "bg-gradient-to-b from-[var(--primary)]/10 to-[var(--primary-dark)]/10" },
      { className: "bg-[var(--card-background-light)] dark:bg-[var(--card-background-dark)]" },
      { className: "bg-gradient-to-r from-[var(--primary)]/5 to-[var(--primary-dark)]/5" }
    ]
  }
};

// Generate components
function generateComponents() {
  const baseDir = path.join(__dirname, '..', 'components');
  
  Object.entries(componentTemplates).forEach(([componentName, template]) => {
    const componentDir = path.join(baseDir, componentName);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true });
    }
    
    // Generate variants 2-7
    for (let i = 2; i <= 7; i++) {
      const variant = template.variants[i - 2] || template.variants[0];
      const content = template.base
        .replace(/{num}/g, i)
        .replace(/{className}/g, variant.className);
      
      const filePath = path.join(componentDir, `${componentName}V${i}.jsx`);
      fs.writeFileSync(filePath, content);
    }
    
    // Create index file
    const indexContent = `// ${componentName} component variants
export { default as ${componentName}V1 } from './${componentName}V1';
${Array.from({ length: 6 }, (_, i) => i + 2).map(i => 
  `export { default as ${componentName}V${i} } from './${componentName}V${i}';`
).join('\n')}

// Export as array for easy access
export const ${componentName}Variants = [
  ${componentName}V1,
  ${Array.from({ length: 6 }, (_, i) => i + 2).map(i => `${componentName}V${i}`).join(',\n  ')}
];`;
    
    fs.writeFileSync(path.join(componentDir, 'index.js'), indexContent);
  });
  
  console.log('Generated all component variants!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateComponents();
}

export { generateComponents };
