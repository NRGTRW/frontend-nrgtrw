import React from 'react';
import PropTypes from 'prop-types';

const SocialProofV3 = ({ logos, caption, brand }) => {
  return (
    <section className="py-8 border-t border-b border-[var(--primary)]/10 dark:border-[var(--primary-dark)]/10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-sm font-medium text-[var(--primary)] dark:text-[var(--primary-dark)]">
              {caption || "Trusted by"}
            </span>
          </div>
          <div className="flex items-center gap-6 sm:gap-8">
            {logos.slice(0, 4).map((logo, index) => (
              <div key={index} className="opacity-50 hover:opacity-100 transition-opacity duration-300">
                {logo.kind === 'image' ? (
                  <img 
                    src={logo.src} 
                    alt={logo.alt || `Client logo ${index + 1}`}
                    className="h-8 w-auto object-contain"
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

SocialProofV3.propTypes = {
  logos: PropTypes.arrayOf(PropTypes.shape({
    kind: PropTypes.oneOf(['image', 'video', 'icon']).isRequired,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string
  })).isRequired,
  caption: PropTypes.string,
  brand: PropTypes.object
};

export default SocialProofV3;
