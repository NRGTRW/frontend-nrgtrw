import React from 'react';
import PropTypes from 'prop-types';

const FeatureSpotlightV1 = ({ blocks, brand }) => {
  return (
    <section className="py-16 sm:py-24 bg-[var(--background-light)] dark:bg-[var(--background-dark)]">
      <div className="container mx-auto px-4 sm:px-6">
        {blocks.map((block, index) => (
          <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 sm:gap-12 mb-16 sm:mb-24 last:mb-0`}>
            <div className="flex-1">
              <h3 className="text-2xl sm:text-3xl font-light text-[var(--text-light)] dark:text-[var(--text-dark)] mb-4">
                {block.headline}
              </h3>
              <p className="text-base sm:text-lg text-[var(--text-light)]/70 dark:text-[var(--text-dark)]/70 leading-relaxed mb-6">
                {block.body}
              </p>
              {block.cta && (
                <a 
                  href={block.cta.href}
                  className="inline-flex items-center px-6 py-3 bg-[var(--primary)] dark:bg-[var(--primary-dark)] text-white rounded-lg hover:bg-[var(--primary)]/90 dark:hover:bg-[var(--primary-dark)]/90 transition-colors duration-300"
                >
                  {block.cta.label}
                </a>
              )}
            </div>
            <div className="flex-1">
              {block.media?.kind === 'image' ? (
                <img 
                  src={block.media.src} 
                  alt={block.media.alt || block.headline}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              ) : block.media?.kind === 'video' ? (
                <video 
                  src={block.media.src}
                  className="w-full h-auto rounded-lg shadow-lg"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
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

FeatureSpotlightV1.propTypes = {
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

export default FeatureSpotlightV1;
