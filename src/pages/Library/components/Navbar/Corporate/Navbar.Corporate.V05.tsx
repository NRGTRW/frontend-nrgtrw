import React from 'react';
import { NavbarProps } from '../../../types/landing';
import { getStyleClasses } from '../../../styles/styleMaps';

const defaultColors = {
  gradientFrom: '#fafafa',
  gradientTo: 'rgba(250, 250, 250, 0.1)',
  primary: '#c5a47f',
  textLight: '#2a2a2a',
  backgroundLight: '#ffffff',
  cardBackgroundLight: '#f8f8f8',
  gradientFromDark: '#121212',
  gradientToDark: 'rgba(18, 18, 18, 0.1)',
  primaryDark: '#d4af37',
  textDark: '#e5e5e5',
  backgroundDark: '#121212',
  cardBackgroundDark: '#1a1a1a'
};

const InteractiveBadge = ({ text, variant = 'default' }) => {
  const variants = {
    default: 'bg-[#c5a47f] text-white',
    luxury: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black',
    playful: 'bg-gradient-to-r from-pink-400 to-purple-500 text-white',
    corporate: 'bg-blue-600 text-white',
    brutalist: 'bg-black text-white border-2 border-white',
    glass: 'bg-white/20 backdrop-blur-md text-white border border-white/30',
    gradient: 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white',
    mono: 'bg-gray-800 text-white',
    editorial: 'bg-red-600 text-white',
    neumorphic: 'bg-gray-200 text-gray-800 shadow-[inset_0_1px_2px_rgba(255,255,255,.8),0_8px_24px_rgba(0,0,0,.15)]'
  };
  
  return (
    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium animate-pulse ${variants[variant]}`}>
      {text}
    </div>
  );
};

const MetricBubble = ({ value, label, variant = 'default' }) => {
  const variants = {
    default: 'border-[#c5a47f]/20 text-[#c5a47f]',
    luxury: 'border-yellow-400/30 text-yellow-600',
    playful: 'border-pink-400/30 text-pink-600',
    corporate: 'border-blue-400/30 text-blue-600',
    brutalist: 'border-black text-black border-2',
    glass: 'border-white/30 text-white bg-white/10 backdrop-blur-sm',
    gradient: 'border-violet-400/30 text-violet-600',
    mono: 'border-gray-400/30 text-gray-800',
    editorial: 'border-red-400/30 text-red-600',
    neumorphic: 'border-gray-300/50 text-gray-700 bg-gray-100 shadow-[inset_0_1px_2px_rgba(255,255,255,.8),0_4px_12px_rgba(0,0,0,.1)]'
  };
  
  return (
    <div className={`flex flex-col items-center p-3 sm:p-4 border rounded-full aspect-square ${variants[variant]}`}>
      <span className="text-xl sm:text-2xl font-semibold">{value}</span>
      <span className="text-xs text-gray-900 mt-1 text-center leading-tight">{label}</span>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, variant = 'default' }) => {
  const variants = {
    default: 'bg-white border-[#c5a47f]/10',
    luxury: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200/30',
    playful: 'bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200/30',
    corporate: 'bg-blue-50 border-blue-200/30',
    brutalist: 'bg-black border-white/20 text-white',
    glass: 'bg-white/10 backdrop-blur-md border-white/20 text-white',
    gradient: 'bg-gradient-to-br from-violet-50 to-cyan-50 border-violet-200/30',
    mono: 'bg-gray-50 border-gray-200/30',
    editorial: 'bg-red-50 border-red-200/30',
    neumorphic: 'bg-gray-100 border-gray-300/50 shadow-[inset_0_1px_2px_rgba(255,255,255,.8),0_8px_24px_rgba(0,0,0,.15)]'
  };
  
  return (
    <div className={`p-4 sm:p-6 rounded-lg border hover:shadow-lg transition-all duration-300 ${variants[variant]}`}>
      <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">{icon}</div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

const TestimonialCard = ({ quote, author, role, variant = 'default' }) => {
  const variants = {
    default: 'bg-white border-[#c5a47f]/10',
    luxury: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200/30',
    playful: 'bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200/30',
    corporate: 'bg-blue-50 border-blue-200/30',
    brutalist: 'bg-black border-white/20 text-white',
    glass: 'bg-white/10 backdrop-blur-md border-white/20 text-white',
    gradient: 'bg-gradient-to-br from-violet-50 to-cyan-50 border-violet-200/30',
    mono: 'bg-gray-50 border-gray-200/30',
    editorial: 'bg-red-50 border-red-200/30',
    neumorphic: 'bg-gray-100 border-gray-300/50 shadow-[inset_0_1px_2px_rgba(255,255,255,.8),0_8px_24px_rgba(0,0,0,.15)]'
  };
  
  return (
    <div className={`p-4 sm:p-6 rounded-lg border ${variants[variant]}`}>
      <p className="text-sm sm:text-base text-gray-900 mb-4 italic leading-relaxed">"{quote}"</p>
      <div className="flex items-center">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#c5a47f] rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
          {author.charAt(0)}
        </div>
        <div className="ml-3">
          <p className="font-semibold text-sm sm:text-base text-gray-900">{author}</p>
          <p className="text-xs sm:text-sm text-gray-600">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default function NavbarCorporateV05({ 
  title = "Brand Name",
  subtitle = "",
  description = "",
  ctaText = "Get Started",
  ctaHref = "#",
  image = "/placeholder.jpg",
  features = [],
  testimonials = [],
  metrics = [],
  ...props 
}: NavbarProps) {
  const styles = getStyleClasses('corporate');
  const vars = { ...defaultColors, ...props.colors };
  
  // Variation knobs for this variant
  const layout = 'center'; // hero, split, grid, showcase
  const density = 'roomy'; // compact, regular, roomy
  const ornament = 'rich'; // minimal, moderate, rich
  const ctaStyle = 'ghost'; // solid, outline, ghost
  const typography = 'large'; // small, medium, large
  const motion = 'slide'; // none, fade, slide

  const densityClasses = {
    compact: 'py-8 px-4',
    regular: 'py-12 px-6', 
    roomy: 'py-16 px-8'
  };

  const typographyClasses = {
    small: 'text-2xl sm:text-3xl',
    medium: 'text-3xl sm:text-4xl md:text-5xl',
    large: 'text-4xl sm:text-5xl md:text-6xl'
  };

  const motionClasses = motion === 'fade' ? 'animate-fade-in' : 
                       motion === 'slide' ? 'animate-slide-in-up' : '';

  const renderContent = () => {
    if (layout === 'hero') {
      return (
        <div className="relative">
          <InteractiveBadge text="New" variant="corporate" />
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block border-b border-[#c5a47f] pb-2 mb-8">
              <span className="text-sm tracking-widest text-[#c5a47f] uppercase">Premium Experience</span>
            </div>
            <h1 className={`${typographyClasses[typography]} font-light mb-6 text-gray-900`}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
            {description && (
              <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto">
                {description}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold transition-all duration-300 cursor-pointer border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[48px] bg-[#c5a47f] text-white border-[#c5a47f] hover:bg-[#b8946a] hover:border-[#b8946a] hover:shadow-lg hover:backdrop-blur-sm focus:ring-[#c5a47f]/50">
                {ctaText}
              </button>
              <button className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold transition-all duration-300 cursor-pointer border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[48px] bg-transparent text-[#c5a47f] border-[#c5a47f] hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-md focus:ring-[#c5a47f]/50">
                Learn More
              </button>
            </div>
            {metrics && metrics.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {metrics.map((metric, index) => (
                  <MetricBubble key={index} value={metric.value} label={metric.label} variant="corporate" />
                ))}
              </div>
            )}
          </div>
        </div>
      );
    } else if (layout === 'split') {
      return (
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <InteractiveBadge text="Featured" variant="corporate" />
            <h2 className={`${typographyClasses[typography]} font-light text-gray-900`}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-xl text-gray-600 leading-relaxed">
                {subtitle}
              </p>
            )}
            {description && (
              <p className="text-lg text-gray-500 leading-relaxed">
                {description}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold transition-all duration-300 cursor-pointer border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[48px] bg-[#c5a47f] text-white border-[#c5a47f] hover:bg-[#b8946a] hover:border-[#b8946a] hover:shadow-lg hover:backdrop-blur-sm focus:ring-[#c5a47f]/50">
                {ctaText}
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-xl overflow-hidden border border-[#c5a47f]/20">
              <img 
                src={image} 
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            {metrics && metrics.length > 0 && (
              <div className="absolute -bottom-6 -right-6 grid grid-cols-2 gap-2">
                {metrics.slice(0, 4).map((metric, index) => (
                  <MetricBubble key={index} value={metric.value} label={metric.label} variant="corporate" />
                ))}
              </div>
            )}
          </div>
        </div>
      );
    } else if (layout === 'grid') {
      return (
        <div className="space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <InteractiveBadge text="Solutions" variant="corporate" />
            <h2 className={`${typographyClasses[typography]} font-light text-gray-900 mb-6`}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          
          {features && features.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <FeatureCard 
                  key={index} 
                  icon={feature.icon} 
                  title={feature.title} 
                  description={feature.description}
                  variant="corporate"
                />
              ))}
            </div>
          )}
          
          {ctaText && (
            <div className="text-center">
              <button className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold transition-all duration-300 cursor-pointer border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[48px] bg-[#c5a47f] text-white border-[#c5a47f] hover:bg-[#b8946a] hover:border-[#b8946a] hover:shadow-lg hover:backdrop-blur-sm focus:ring-[#c5a47f]/50">
                {ctaText}
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="space-y-12">
          <div className="text-center max-w-4xl mx-auto">
            <InteractiveBadge text="Showcase" variant="corporate" />
            <h2 className={`${typographyClasses[typography]} font-light text-gray-900 mb-6`}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {subtitle}
              </p>
            )}
            {description && (
              <p className="text-lg text-gray-500 mb-12 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          
          {testimonials && testimonials.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard 
                  key={index} 
                  quote={testimonial.quote} 
                  author={testimonial.author} 
                  role={testimonial.role}
                  variant="corporate"
                />
              ))}
            </div>
          )}
          
          {ctaText && (
            <div className="text-center">
              <button className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold transition-all duration-300 cursor-pointer border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[48px] bg-[#c5a47f] text-white border-[#c5a47f] hover:bg-[#b8946a] hover:border-[#b8946a] hover:shadow-lg hover:backdrop-blur-sm focus:ring-[#c5a47f]/50">
                {ctaText}
              </button>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <section 
      className={`${densityClasses[density]} ${motionClasses} bg-gradient-to-b from-[var(--gradient-from)] to-[var(--gradient-to)] dark:from-[var(--gradient-from-dark)] dark:to-[var(--gradient-to-dark)]`} 
      style={{
        "--gradient-from": vars.gradientFrom,
        "--gradient-to": vars.gradientTo,
        "--gradient-from-dark": vars.gradientFromDark,
        "--gradient-to-dark": vars.gradientToDark,
        "--primary": vars.primary,
        "--primary-dark": vars.primaryDark,
        "--text-light": vars.textLight,
        "--text-dark": vars.textDark,
        "--background-light": vars.backgroundLight,
        "--background-dark": vars.backgroundDark,
        "--card-background-light": vars.cardBackgroundLight,
        "--card-background-dark": vars.cardBackgroundDark,
      }}
      {...props}
    >
      <div className="container mx-auto px-6">
        {renderContent()}
      </div>
    </section>
  );
}