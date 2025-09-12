import React from 'react';
import PropTypes from 'prop-types';

const SocialProofV6 = ({ logos, caption, brand }) => {
  return (
    <section className="py-8 bg-[var(--background-light)] dark:bg-[var(--background-dark)]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center gap-8 sm:gap-12">
          <span className="text-sm font-medium text-[var(--text-light)]/60 dark:text-[var(--text-dark)]/60 whitespace-nowrap">
            {caption || "Proudly serving"}
          </span>
          <div className="flex items-center gap-6 sm:gap-8">
            {logos.slice(0, 5).map((logo, index) => (
              <div 
                key={index}
                className="relative group"
              >
                {logo.kind === 'image' ? (
                  <img 
                    src={logo.src} 
                    alt={logo.alt || `Client logo ${index + 1}`}
                    className="h-8 w-auto object-contain opacity-40 group-hover:opacity-100 transition-all duration-300"
                  />
                ) : (
                  <div className="text-lg opacity-40 group-hover:opacity-100 transition-all duration-300">{logo.src}</div>
                )}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[var(--primary)] group-hover:w-full transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

SocialProofV6.propTypes = {
  logos: PropTypes.arrayOf(PropTypes.shape({
    kind: PropTypes.oneOf(['image', 'video', 'icon']).isRequired,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string
  })).isRequired,
  caption: PropTypes.string,
  brand: PropTypes.object
};

export default SocialProofV6;
