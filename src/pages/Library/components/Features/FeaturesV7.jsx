import React from 'react';
import PropTypes from 'prop-types';

const FeaturesV7 = ({ items, brand }) => {
  return (
    <section className="py-16 sm:py-24 bg-[var(--background-light)] dark:bg-[var(--background-dark)]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[var(--text-light)] dark:text-[var(--text-dark)] mb-4">
            What Sets Us Apart
          </h2>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <div 
                key={index}
                className="group relative p-6 bg-[var(--card-background-light)] dark:bg-[var(--card-background-dark)] rounded-xl border border-[var(--primary)]/10 dark:border-[var(--primary-dark)]/10 hover:border-[var(--primary)]/30 dark:hover:border-[var(--primary-dark)]/30 transition-all duration-300"
              >
                <div className="absolute top-4 right-4 w-3 h-3 bg-[var(--primary)] dark:bg-[var(--primary-dark)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="text-3xl mb-4">
                  {item.icon?.kind === 'icon' ? (
                    <span>{item.icon.src}</span>
                  ) : item.icon?.kind === 'image' ? (
                    <img src={item.icon.src} alt={item.icon.alt} className="w-8 h-8" />
                  ) : (
                    <div className="w-8 h-8 bg-[var(--primary)] dark:bg-[var(--primary-dark)] rounded-lg"></div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-light)] dark:text-[var(--text-dark)] mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--text-light)]/70 dark:text-[var(--text-dark)]/70 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

FeaturesV7.propTypes = {
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

export default FeaturesV7;
