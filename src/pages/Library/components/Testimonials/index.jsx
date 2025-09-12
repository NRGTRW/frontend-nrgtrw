// Testimonials component variants
import React from 'react';
import PropTypes from 'prop-types';

export { default as TestimonialsV1 } from './TestimonialsV1.jsx';

// Create placeholder components for V2-V7
const createPlaceholderComponent = (num) => {
  const Component = ({ items, brand }) => (
    <section className="py-16 sm:py-24 bg-[var(--card-background-light)] dark:bg-[var(--card-background-dark)]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[var(--text-light)] dark:text-[var(--text-dark)] mb-4">
            What Our Clients Say
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {items.map((item, index) => (
            <div key={index} className="p-6 bg-white dark:bg-[var(--background-dark)] rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <p className="text-sm sm:text-base text-[var(--text-light)] dark:text-[var(--text-dark)] mb-4 italic leading-relaxed">
                "{item.quote}"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[var(--primary)] dark:bg-[var(--primary-dark)] rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                  {item.avatar?.kind === 'image' ? (
                    <img src={item.avatar.src} alt={item.avatar.alt} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    item.name.charAt(0)
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base text-[var(--text-light)] dark:text-[var(--text-dark)]">
                    {item.name}
                  </p>
                  {item.role && (
                    <p className="text-xs text-[var(--text-light)]/60 dark:text-[var(--text-dark)]/60">
                      {item.role}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
  Component.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      quote: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string,
      avatar: PropTypes.shape({
        kind: PropTypes.oneOf(['image', 'video', 'icon']),
        src: PropTypes.string,
        alt: PropTypes.string
      })
    })).isRequired,
    brand: PropTypes.object
  };
  return Component;
};

export const TestimonialsV2 = createPlaceholderComponent(2);
export const TestimonialsV3 = createPlaceholderComponent(3);
export const TestimonialsV4 = createPlaceholderComponent(4);
export const TestimonialsV5 = createPlaceholderComponent(5);
export const TestimonialsV6 = createPlaceholderComponent(6);
export const TestimonialsV7 = createPlaceholderComponent(7);

// Export as array for easy access
export const TestimonialsVariants = [
  TestimonialsV1,
  TestimonialsV2,
  TestimonialsV3,
  TestimonialsV4,
  TestimonialsV5,
  TestimonialsV6,
  TestimonialsV7
];
