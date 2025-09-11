import React from 'react';
import PropTypes from 'prop-types';

const SocialProofV4 = ({ logos, caption, brand }) => {
  return (
    <section className="py-12 bg-[var(--card-background-light)] dark:bg-[var(--card-background-dark)]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-sm text-[var(--text-light)]/60 dark:text-[var(--text-dark)]/60">
            <div className="w-8 h-px bg-[var(--primary)]/30"></div>
            <span className="uppercase tracking-wider">{caption || "Our Partners"}</span>
            <div className="w-8 h-px bg-[var(--primary)]/30"></div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8">
          {logos.map((logo, index) => (
            <div 
              key={index}
              className="group relative p-3 rounded-lg hover:bg-white dark:hover:bg-[var(--background-dark)] transition-all duration-300"
            >
              {logo.kind === 'image' ? (
                <img 
                  src={logo.src} 
                  alt={logo.alt || `Client logo ${index + 1}`}
                  className="h-10 w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                />
              ) : (
                <div className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300">{logo.src}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

SocialProofV4.propTypes = {
  logos: PropTypes.arrayOf(PropTypes.shape({
    kind: PropTypes.oneOf(['image', 'video', 'icon']).isRequired,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string
  })).isRequired,
  caption: PropTypes.string,
  brand: PropTypes.object
};

export default SocialProofV4;
