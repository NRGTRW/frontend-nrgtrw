import React from 'react';
import PropTypes from 'prop-types';

const FeaturesV6 = ({ items, brand }) => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--primary-dark)]/5">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[var(--text-light)] dark:text-[var(--text-dark)] mb-4">
            Feature Highlights
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {items.map((item, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 p-6 bg-white dark:bg-[var(--card-background-dark)] rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-[var(--primary)] dark:bg-[var(--primary-dark)] rounded-lg flex items-center justify-center">
                {item.icon?.kind === 'icon' ? (
                  <span className="text-white text-lg">{item.icon.src}</span>
                ) : item.icon?.kind === 'image' ? (
                  <img src={item.icon.src} alt={item.icon.alt} className="w-5 h-5" />
                ) : (
                  <div className="w-5 h-5 bg-white rounded"></div>
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

FeaturesV6.propTypes = {
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

export default FeaturesV6;
