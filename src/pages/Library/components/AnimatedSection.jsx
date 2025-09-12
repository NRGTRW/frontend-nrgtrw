import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const AnimatedSection = ({ 
  children, 
  className = '', 
  animation = 'fadeInUp',
  delay = 0,
  duration = 500,
  ...props 
}) => {
  const [ref, isIntersecting, hasIntersected] = useIntersectionObserver();

  const animationClasses = {
    fadeInUp: 'translate-y-8 opacity-0',
    fadeInDown: '-translate-y-8 opacity-0',
    fadeInLeft: '-translate-x-8 opacity-0',
    fadeInRight: 'translate-x-8 opacity-0',
    scaleIn: 'scale-95 opacity-0',
    slideInUp: 'translate-y-full opacity-0'
  };

  const baseClasses = `transition-all duration-${duration} ease-out`;
  const animatedClasses = hasIntersected 
    ? 'translate-y-0 translate-x-0 opacity-100 scale-100' 
    : animationClasses[animation] || animationClasses.fadeInUp;

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${animatedClasses} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;

