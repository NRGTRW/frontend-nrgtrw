// FinalCTA component variants
import React from 'react';
import PropTypes from 'prop-types';

const createPlaceholderComponent = (num) => {
  const Component = ({ headline, subhead, cta, brand }) => (
    <section className="py-16 sm:py-24 bg-[var(--primary)] dark:bg-[var(--primary-dark)] text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-4">
            {headline}
          </h2>
          {subhead && (
            <p className="text-lg opacity-90 mb-8">
              {subhead}
            </p>
          )}
          <a
            href={cta.href}
            className="inline-flex items-center px-8 py-4 bg-white text-[var(--primary)] dark:text-[var(--primary-dark)] rounded-lg hover:bg-gray-100 transition-colors duration-300 text-lg font-medium"
          >
            {cta.label}
          </a>
        </div>
      </div>
    </section>
  );
  Component.propTypes = {
    headline: PropTypes.string.isRequired,
    subhead: PropTypes.string,
    cta: PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired
    }).isRequired,
    brand: PropTypes.object
  };
  return Component;
};

export const FinalCTAV1 = createPlaceholderComponent(1);
export const FinalCTAV2 = createPlaceholderComponent(2);
export const FinalCTAV3 = createPlaceholderComponent(3);
export const FinalCTAV4 = createPlaceholderComponent(4);
export const FinalCTAV5 = createPlaceholderComponent(5);
export const FinalCTAV6 = createPlaceholderComponent(6);
export const FinalCTAV7 = createPlaceholderComponent(7);

// Export as array for easy access
export const FinalCTAVariants = [
  FinalCTAV1,
  FinalCTAV2,
  FinalCTAV3,
  FinalCTAV4,
  FinalCTAV5,
  FinalCTAV6,
  FinalCTAV7
];
