import React from 'react';
import PropTypes from 'prop-types';

const FeaturesV4 = ({ items, brand }) => {
  return (
    <section className="py-16 sm:py-24 bg-[var(--card-background-light)] dark:bg-[var(--card-background-dark)]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[var(--text-light)] dark:text-[var(--text-dark)] mb-4">
            Core Capabilities
          </h2>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items.map((item, index) => (
              <div 
                key={index}
                className="flex gap-4 p-6 bg-white dark:bg-[var(--background-dark)] rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-lg flex items-center justify-center">
                    {item.icon?.kind === 'icon' ? (
                      <span className="text-white text-xl">{item.icon.src}</span>
                    ) : item.icon?.kind === 'image' ? (
                      <img src={item.icon.src} alt={item.icon.alt} className="w-6 h-6" />
                    ) : (
                      <div className="w-6 h-6 bg-white rounded"></div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[var(--text-light)] dark:text-[var(--text-dark)] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--text-light)]/70 dark:text-[var(--text-dark)]/70 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

FeaturesV4.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.shape({
      kind: PropTypes.oneOf(['image', 'video', 'icon']),
      src: PropTypes.string,
      alt: PropTypes.string
    }),
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired
  })).isRequired,
  brand: PropTypes.object
};

export default FeaturesV4;
