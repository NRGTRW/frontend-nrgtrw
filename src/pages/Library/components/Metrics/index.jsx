// Metrics component variants
import React from 'react';
import PropTypes from 'prop-types';

const createPlaceholderComponent = (num) => {
  const Component = ({ items, brand }) => (
    <section className="py-16 sm:py-24 bg-[var(--background-light)] dark:bg-[var(--background-dark)]">
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
  Component.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })).isRequired,
    brand: PropTypes.object
  };
  return Component;
};

export const MetricsV1 = createPlaceholderComponent(1);
export const MetricsV2 = createPlaceholderComponent(2);
export const MetricsV3 = createPlaceholderComponent(3);
export const MetricsV4 = createPlaceholderComponent(4);
export const MetricsV5 = createPlaceholderComponent(5);
export const MetricsV6 = createPlaceholderComponent(6);
export const MetricsV7 = createPlaceholderComponent(7);

// Export as array for easy access
export const MetricsVariants = [
  MetricsV1,
  MetricsV2,
  MetricsV3,
  MetricsV4,
  MetricsV5,
  MetricsV6,
  MetricsV7
];
