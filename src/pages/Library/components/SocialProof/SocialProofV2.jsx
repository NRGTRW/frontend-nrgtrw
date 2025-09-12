import React from 'react';
import PropTypes from 'prop-types';

const SocialProofV2 = ({ logos, caption, brand }) => {
  return (
    <section className="py-16 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--primary-dark)]/5">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h3 className="text-lg font-semibold text-[var(--text-light)] dark:text-[var(--text-dark)] mb-2">
            Trusted by Industry Leaders
          </h3>
          {caption && (
            <p className="text-sm text-[var(--text-light)]/70 dark:text-[var(--text-dark)]/70">
              {caption}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
          {logos.map((logo, index) => (
            <div 
              key={index}
              className="flex items-center justify-center p-4 bg-white dark:bg-[var(--card-background-dark)] rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              {logo.kind === 'image' ? (
                <img 
                  src={logo.src} 
                  alt={logo.alt || `Client logo ${index + 1}`}
                  className="max-h-12 max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
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

SocialProofV2.propTypes = {
  logos: PropTypes.arrayOf(PropTypes.shape({
    kind: PropTypes.oneOf(['image', 'video', 'icon']).isRequired,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string
  })).isRequired,
  caption: PropTypes.string,
  brand: PropTypes.object
};

export default SocialProofV2;
