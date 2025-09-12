import React from 'react';
import PropTypes from 'prop-types';

const FeaturesV2 = ({ items, brand }) => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[var(--background-light)] to-[var(--card-background-light)] dark:from-[var(--background-dark)] dark:to-[var(--card-background-dark)]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[var(--text-light)] dark:text-[var(--text-dark)] mb-4">
            Key Features
          </h2>
          <p className="text-lg text-[var(--text-light)]/60 dark:text-[var(--text-dark)]/60 max-w-2xl mx-auto">
            Discover what makes our solution stand out
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {items.map((item, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 p-6 bg-white dark:bg-[var(--card-background-dark)] rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-[var(--primary)]/10 dark:bg-[var(--primary-dark)]/10 rounded-lg flex items-center justify-center">
                {item.icon?.kind === 'icon' ? (
                  <span className="text-xl">{item.icon.src}</span>
                ) : item.icon?.kind === 'image' ? (
                  <img src={item.icon.src} alt={item.icon.alt} className="w-6 h-6" />
                ) : (
                  <div className="w-6 h-6 bg-[var(--primary)] dark:bg-[var(--primary-dark)] rounded"></div>
                )}
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
    </section>
  );
};

FeaturesV2.propTypes = {
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

export default FeaturesV2;
