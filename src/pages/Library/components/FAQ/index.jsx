// FAQ component variants
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const createPlaceholderComponent = (num) => {
  const Component = ({ items, brand }) => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
      <section className="py-16 sm:py-24 bg-[var(--card-background-light)] dark:bg-[var(--card-background-dark)]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[var(--text-light)] dark:text-[var(--text-dark)] mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {items.map((item, index) => (
              <div key={index} className="border-b border-[var(--primary)]/10 dark:border-[var(--primary-dark)]/10 last:border-b-0">
                <button
                  className="w-full text-left py-6 flex items-center justify-between"
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                >
                  <h3 className="text-lg font-medium text-[var(--text-light)] dark:text-[var(--text-dark)]">
                    {item.q}
                  </h3>
                  <span className="text-[var(--primary)] dark:text-[var(--primary-dark)] text-xl">
                    {openIndex === index ? '−' : '+'}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="pb-6">
                    <p className="text-sm text-[var(--text-light)]/70 dark:text-[var(--text-dark)]/70 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  Component.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      q: PropTypes.string.isRequired,
      a: PropTypes.string.isRequired
    })).isRequired,
    brand: PropTypes.object
  };
  return Component;
};

export const FAQV1 = createPlaceholderComponent(1);
export const FAQV2 = createPlaceholderComponent(2);
export const FAQV3 = createPlaceholderComponent(3);
export const FAQV4 = createPlaceholderComponent(4);
export const FAQV5 = createPlaceholderComponent(5);
export const FAQV6 = createPlaceholderComponent(6);
export const FAQV7 = createPlaceholderComponent(7);

// Export as array for easy access
export const FAQVariants = [
  FAQV1,
  FAQV2,
  FAQV3,
  FAQV4,
  FAQV5,
  FAQV6,
  FAQV7
];
