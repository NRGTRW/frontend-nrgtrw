import React from 'react';
import PropTypes from 'prop-types';

const SocialProofV7 = ({ logos, caption, brand }) => {
  return (
    <section className="py-12 bg-[var(--primary)]/5 dark:bg-[var(--primary-dark)]/5">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-2 bg-[var(--primary)]/10 dark:bg-[var(--primary-dark)]/10 rounded-full">
            <span className="text-xs font-medium text-[var(--primary)] dark:text-[var(--primary-dark)] uppercase tracking-wider">
              {caption || "Trusted Partners"}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
          {logos.map((logo, index) => (
            <div 
              key={index}
              className="group relative p-3 rounded-lg bg-white dark:bg-[var(--card-background-dark)] shadow-sm hover:shadow-md transition-all duration-300"
            >
              {logo.kind === 'image' ? (
                <img 
                  src={logo.src} 
                  alt={logo.alt || `Client logo ${index + 1}`}
                  className="h-8 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              ) : (
                <div className="text-lg group-hover:scale-110 transition-transform duration-300">{logo.src}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

SocialProofV7.propTypes = {
  logos: PropTypes.arrayOf(PropTypes.shape({
    kind: PropTypes.oneOf(['image', 'video', 'icon']).isRequired,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string
  })).isRequired,
  caption: PropTypes.string,
  brand: PropTypes.object
};

export default SocialProofV7;
