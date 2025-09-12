import React from 'react';
import PropTypes from 'prop-types';

const SocialProofV5 = ({ logos, caption, brand }) => {
  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-[var(--primary)]/5">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-light text-[var(--text-light)] dark:text-[var(--text-dark)] mb-4">
            {caption || "Trusted by companies worldwide"}
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-8 items-center">
            {logos.map((logo, index) => (
              <div 
                key={index}
                className="flex items-center justify-center p-4 rounded-xl bg-white/50 dark:bg-[var(--card-background-dark)]/50 backdrop-blur-sm hover:bg-white dark:hover:bg-[var(--card-background-dark)] transition-all duration-300"
              >
                {logo.kind === 'image' ? (
                  <img 
                    src={logo.src} 
                    alt={logo.alt || `Client logo ${index + 1}`}
                    className="max-h-10 max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <div className="text-xl">{logo.src}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

SocialProofV5.propTypes = {
  logos: PropTypes.arrayOf(PropTypes.shape({
    kind: PropTypes.oneOf(['image', 'video', 'icon']).isRequired,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string
  })).isRequired,
  caption: PropTypes.string,
  brand: PropTypes.object
};

export default SocialProofV5;
