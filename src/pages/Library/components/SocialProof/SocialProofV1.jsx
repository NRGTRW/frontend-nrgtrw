import React from 'react';
import PropTypes from 'prop-types';

const SocialProofV1 = ({ logos, caption, brand }) => {
  return (
    <section className="py-12 bg-[var(--background-light)] dark:bg-[var(--background-dark)]">
      <div className="container mx-auto px-4 sm:px-6">
        {caption && (
          <p className="text-center text-sm text-[var(--text-light)]/60 dark:text-[var(--text-dark)]/60 mb-8 uppercase tracking-wider">
            {caption}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-60">
          {logos.map((logo, index) => (
            <div 
              key={index}
              className="flex items-center justify-center h-12 sm:h-16 grayscale hover:grayscale-0 transition-all duration-300"
            >
              {logo.kind === 'image' ? (
                <img 
                  src={logo.src} 
                  alt={logo.alt || `Client logo ${index + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-2xl sm:text-3xl">{logo.src}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

SocialProofV1.propTypes = {
  logos: PropTypes.arrayOf(PropTypes.shape({
    kind: PropTypes.oneOf(['image', 'video', 'icon']).isRequired,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string
  })).isRequired,
  caption: PropTypes.string,
  brand: PropTypes.object
};

export default SocialProofV1;
