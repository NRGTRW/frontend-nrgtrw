import React from 'react';
import PropTypes from 'prop-types';
import { CTAButton } from '../components/styles.jsx';
import VideoGrid from '../components/VideoGrid.jsx';

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

const InteractiveBadge = ({ text }) => (
  <div className="absolute top-4 right-4 bg-[#c5a47f] text-white px-3 py-1 rounded-full text-xs animate-pulse">
    {text}
  </div>
);

const MetricBubble = ({ value, label }) => (
  <div className="flex flex-col items-center p-3 sm:p-4 border border-[#c5a47f]/20 rounded-full aspect-square">
    <span className="text-xl sm:text-2xl text-[#c5a47f] font-semibold">{value}</span>
    <span className="text-xs text-gray-900 mt-1 text-center leading-tight">{label}</span>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-4 sm:p-6 bg-white rounded-lg border border-[#c5a47f]/10 hover:shadow-lg transition-all duration-300">
    <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">{icon}</div>
    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, author, role }) => (
  <div className="p-4 sm:p-6 bg-white rounded-lg border border-[#c5a47f]/10">
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

// Home1 - Minimalist Cards
const PricingCard1 = ({ plan, price, features, popular = false }) => (
  <div className="relative">
    {popular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#c5a47f] text-white text-xs px-3 sm:px-4 py-1 rounded-full font-medium shadow-lg z-10">
        Most Popular
      </div>
    )}
    <div className={`p-4 sm:p-6 lg:p-8 rounded-xl border-2 transition-all duration-300 hover:shadow-xl ${
      popular 
        ? 'border-[#c5a47f] bg-gradient-to-br from-[var(--primary)]/10 to-[var(--primary)]/5 dark:from-[var(--primary-dark)]/10 dark:to-[var(--primary-dark)]/5' 
        : 'border-[var(--primary)]/30 dark:border-[var(--primary-dark)]/30 bg-white'
    }`}>
    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{plan}</h3>
    <div className="mb-4 sm:mb-6">
      <span className="text-3xl sm:text-4xl font-black text-[#c5a47f]">${price}</span>
      <span className="text-sm sm:text-base text-[var(--text-light)]/60 dark:text-[var(--text-dark)]/60 ml-2">/month</span>
    </div>
    <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-xs sm:text-sm text-gray-900">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#c5a47f] rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
            <span className="text-white text-xs">✓</span>
          </div>
          <span className="leading-relaxed">{feature}</span>
        </li>
      ))}
    </ul>
    <CTAButton 
      variant={popular ? "primary" : "secondary"} 
      className="w-full py-3 sm:py-4 text-sm sm:text-base font-semibold"
      aria-label={`Get started with ${plan} plan`}
    >
      Get Started
    </CTAButton>
    </div>
  </div>
);

// Home2 - Elegant Cards with Icons
const PricingCard2 = ({ plan, price, features, popular = false, icon }) => (
  <div className="relative">
    {popular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#c5a47f] text-white text-xs px-4 py-1 rounded-full font-medium shadow-lg z-20">
        Popular
      </div>
    )}
    <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-2xl ${
      popular 
        ? 'border-[#c5a47f] bg-gradient-to-b from-[var(--primary)]/15 to-transparent dark:from-[var(--primary-dark)]/15' 
        : 'border-[var(--primary)]/20 dark:border-[var(--primary-dark)]/20 bg-white'
    }`}>
      <div className="text-center mb-6">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan}</h3>
        <div className="mb-4">
          <span className="text-3xl font-bold text-[#c5a47f]">${price}</span>
          <span className="text-[var(--text-light)]/70 dark:text-[var(--text-dark)]/70">/month</span>
        </div>
      </div>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-gray-900">
            <span className="text-[#c5a47f] mr-2 text-lg">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <CTAButton variant={popular ? "primary" : "secondary"} className="w-full">
        Get Started
      </CTAButton>
    </div>
  </div>
);

// Home3 - Modern Cards with Accent Lines
const PricingCard3 = ({ plan, price, features, popular = false }) => (
  <div className="relative">
    {popular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#c5a47f] text-white text-xs px-4 py-1 rounded-full font-medium shadow-lg z-10">
        Popular
      </div>
    )}
    <div className={`p-6 rounded-lg border-l-4 transition-all duration-300 hover:shadow-lg ${
      popular 
        ? 'border-l-[var(--primary)] dark:border-l-[var(--primary-dark)] bg-[var(--primary)]/5 dark:bg-[var(--primary-dark)]/5 border-[var(--primary)]/20 dark:border-[var(--primary-dark)]/20' 
        : 'border-l-[var(--primary)]/40 dark:border-l-[var(--primary-dark)]/40 border-[var(--primary)]/10 dark:border-[var(--primary-dark)]/10 bg-white'
    }`}>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan}</h3>
    <div className="mb-4">
      <span className="text-3xl font-bold text-[#c5a47f]">${price}</span>
      <span className="text-[var(--text-light)]/70 dark:text-[var(--text-dark)]/70">/month</span>
    </div>
    <ul className="space-y-2 mb-6">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-sm text-gray-900">
          <span className="text-[#c5a47f] mr-2">✓</span>
          {feature}
        </li>
      ))}
    </ul>
    <CTAButton variant={popular ? "primary" : "secondary"} className="w-full">
      Get Started
    </CTAButton>
    </div>
  </div>
);

// Home4 - Geometric Cards
const PricingCard4 = ({ plan, price, features, popular = false }) => (
  <div className="relative">
    {popular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#c5a47f] text-white text-xs px-4 py-1 rounded-full font-medium shadow-lg z-10">
        Popular
      </div>
    )}
    <div className={`p-6 rounded-3xl border-2 transition-all duration-300 hover:shadow-xl ${
      popular 
        ? 'border-[#c5a47f] bg-gradient-to-br from-[var(--primary)]/10 via-[var(--primary)]/5 to-transparent dark:from-[var(--primary-dark)]/10 dark:via-[var(--primary-dark)]/5' 
        : 'border-[var(--primary)]/30 dark:border-[var(--primary-dark)]/30 bg-white'
    }`}>
    <div className="text-center mb-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold text-[#c5a47f]">${price}</span>
        <span className="text-[var(--text-light)]/70 dark:text-[var(--text-dark)]/70">/month</span>
      </div>
    </div>
    <ul className="space-y-2 mb-6">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-sm text-gray-900">
          <span className="text-[#c5a47f] mr-2">✓</span>
          {feature}
        </li>
      ))}
    </ul>
    <CTAButton variant={popular ? "primary" : "secondary"} className="w-full">
      Get Started
    </CTAButton>
    </div>
  </div>
);

// Home5 - Futuristic Cards
const PricingCard5 = ({ plan, price, features, popular = false }) => (
  <div className="relative">
    {popular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#c5a47f] text-white text-xs px-4 py-1 rounded-full font-medium shadow-lg z-10">
        Popular
      </div>
    )}
    <div className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-2xl ${
      popular 
        ? 'border-[#c5a47f] bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/5 dark:from-[var(--primary-dark)]/20 dark:to-[var(--primary-dark)]/5' 
        : 'border-[var(--primary)]/20 dark:border-[var(--primary-dark)]/20 bg-white'
    }`}>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan}</h3>
    <div className="mb-4">
      <span className="text-3xl font-bold text-[#c5a47f]">${price}</span>
      <span className="text-[var(--text-light)]/70 dark:text-[var(--text-dark)]/70">/month</span>
    </div>
    <ul className="space-y-2 mb-6">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-sm text-gray-900">
          <span className="text-[#c5a47f] mr-2">✓</span>
          {feature}
        </li>
      ))}
    </ul>
    <CTAButton variant={popular ? "primary" : "secondary"} className="w-full">
      Get Started
    </CTAButton>
    </div>
  </div>
);

// Home6 - Process-Style Cards
const PricingCard6 = ({ plan, price, features, popular = false, step }) => (
  <div className="relative">
    {step && (
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#c5a47f] text-white rounded-full flex items-center justify-center text-sm font-bold">
        {step}
      </div>
    )}
    {popular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#c5a47f] text-white text-xs px-4 py-1 rounded-full font-medium shadow-lg z-10">
        Popular
      </div>
    )}
    <div className={`p-6 rounded-lg border transition-all duration-300 hover:shadow-lg ${
      popular 
        ? 'border-[#c5a47f] bg-[var(--primary)]/5 dark:bg-[var(--primary-dark)]/5' 
        : 'border-[var(--primary)]/20 dark:border-[var(--primary-dark)]/20 bg-white'
    }`}>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan}</h3>
    <div className="mb-4">
      <span className="text-3xl font-bold text-[#c5a47f]">${price}</span>
      <span className="text-[var(--text-light)]/70 dark:text-[var(--text-dark)]/70">/month</span>
    </div>
    <ul className="space-y-2 mb-6">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-sm text-gray-900">
          <span className="text-[#c5a47f] mr-2">✓</span>
          {feature}
        </li>
      ))}
    </ul>
    <CTAButton variant={popular ? "primary" : "secondary"} className="w-full">
      Get Started
    </CTAButton>
    </div>
  </div>
);

// Home7 - 3D-Style Cards
const PricingCard7 = ({ plan, price, features, popular = false }) => (
  <div className="relative">
    {popular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#c5a47f] text-white text-xs px-4 py-1 rounded-full font-medium shadow-lg z-10">
        Popular
      </div>
    )}
    <div className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
      popular 
        ? 'border-[#c5a47f] bg-gradient-to-br from-[var(--primary)]/15 to-[var(--primary)]/5 dark:from-[var(--primary-dark)]/15 dark:to-[var(--primary-dark)]/5 shadow-lg' 
        : 'border-[var(--primary)]/20 dark:border-[var(--primary-dark)]/20 bg-white'
    }`}>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan}</h3>
    <div className="mb-4">
      <span className="text-3xl font-bold text-[#c5a47f]">${price}</span>
      <span className="text-[var(--text-light)]/70 dark:text-[var(--text-dark)]/70">/month</span>
    </div>
    <ul className="space-y-2 mb-6">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-sm text-gray-900">
          <span className="text-[#c5a47f] mr-2">✓</span>
          {feature}
        </li>
      ))}
    </ul>
    <CTAButton variant={popular ? "primary" : "secondary"} className="w-full">
      Get Started
    </CTAButton>
    </div>
  </div>
);

const componentPropTypes = {
  colors: PropTypes.object,
  testimonials: PropTypes.array,
  metrics: PropTypes.array,
  interactiveElements: PropTypes.bool,
  enable3D: PropTypes.bool
};

export const Home1 = ({ colors, testimonials, interactiveElements }) => {
  const vars = { ...defaultColors, ...colors };
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--gradient-from)] to-[var(--gradient-to)] dark:from-[var(--gradient-from-dark)] dark:to-[var(--gradient-to-dark)]">
      {/* Hero */}
      <div className="container mx-auto flex flex-col md:flex-row items-center px-6 py-24">
        <div className="w-full md:w-1/2 md:pr-16 relative">
          {interactiveElements && <InteractiveBadge text="Featured" />}
          <div className="border-l-4 border-[#c5a47f] pl-6 mb-8">
            <span className="text-sm tracking-widest text-[#c5a47f]">AI-POWERED</span>
            <h1 className="mt-4 text-4xl md:text-5xl font-light text-gray-900">
              Digital Craftsmanship
              <span className="block mt-2 text-[#c5a47f]">Perfected</span>
            </h1>
          </div>
          <p className="text-lg text-gray-900 mb-8">
            Where precision meets creativity in perfect harmony.
          </p>
                     <div className="flex gap-4">
             <CTAButton variant="primary">
               Get Started
             </CTAButton>
             <CTAButton variant="secondary">Learn More</CTAButton>
           </div>
        </div>
        <div className="w-full md:w-1/2 mt-16 md:mt-0">
          <div className="relative aspect-video rounded-xl overflow-hidden border border-[var(--primary)]/20 dark:border-[var(--primary-dark)]/20">
            <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
              <source src="/video-bg3.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Why Choose Us?
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<svg className="w-8 h-8 text-[#c5a47f]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>}
            title="Fast Performance" 
            description="Lightning-fast loading and optimized performance"
          />
          <FeatureCard 
            icon={<svg className="w-8 h-8 text-[#c5a47f]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>}
            title="Secure" 
            description="Enterprise-grade security and protection"
          />
          <FeatureCard 
            icon={<svg className="w-8 h-8 text-[#c5a47f]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>}
            title="Precise" 
            description="AI-driven insights and analytics"
          />
        </div>
      </div>

      {/* Video Grid */}
      <VideoGrid />

             {/* Testimonials */}
       {testimonials && (
         <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
           <div className="text-center mb-12 sm:mb-16">
             <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-4">
               What Clients Say
             </h2>
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
             <TestimonialCard 
               quote={testimonials[0] || "Transformed our entire workflow. Results were immediate."}
               author="Sarah Johnson"
               role="CTO, TechCorp"
             />
             <TestimonialCard 
               quote="Exceeded all expectations. Highly recommended!"
               author="Michael Chen"
               role="CEO, InnovateLab"
             />
           </div>
         </div>
       )}

       {/* Pricing */}
       <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
         <div className="text-center mb-12 sm:mb-16">
           <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-4">
             Choose Your Plan
           </h2>
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
           <PricingCard1 
             plan="Starter"
             price="29"
             features={['Basic features', 'Email support', '5GB storage']}
           />
           <PricingCard1 
             plan="Professional"
             price="99"
             features={['All starter features', 'Priority support', '50GB storage']}
             popular={true}
           />
           <PricingCard1 
             plan="Enterprise"
             price="299"
             features={['All professional features', '24/7 support', 'Unlimited storage']}
           />
         </div>
       </div>
    </div>
  );
};
Home1.propTypes = componentPropTypes;

export const Home2 = ({ colors, metrics }) => {
  const vars = { ...defaultColors, ...colors };
  return (
    <div className="min-h-screen bg-[var(--background-light)] dark:bg-[var(--background-dark)]">
      {/* Hero */}
      <section aria-labelledby="hero-heading" className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 sm:mb-12 inline-block border-b border-[#c5a47f] pb-2">
            <span className="text-xs sm:text-sm tracking-widest text-[#c5a47f]">ARCHITECTURAL VISION</span>
          </div>
          <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-6 sm:mb-8 text-gray-900 leading-tight">
            Structural
            <span className="block mt-2 sm:mt-4 text-[#c5a47f]">Integrity</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-[var(--text-light)]/70 dark:text-[var(--text-dark)]/70 mb-8 sm:mb-12 leading-relaxed">
            Building foundations that stand the test of time
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-12 sm:mb-16" role="group" aria-label="Call to action buttons">
            <CTAButton variant="primary" className="w-full sm:w-auto" aria-label="Start building your project">
              Start Building
            </CTAButton>
            <CTAButton variant="secondary" className="w-full sm:w-auto" aria-label="View example projects">
              View Examples
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Video */}
      <div className="container mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <div className="relative aspect-video rounded-xl overflow-hidden mx-2 sm:mx-8 border border-[var(--primary)]/20 dark:border-[var(--primary-dark)]/20">
          <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
            <source src="/video-bg2.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Features */}
      <section aria-labelledby="features-heading" className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <h2 id="features-heading" className="sr-only">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-left">
          {[
            { title: 'Precision', desc: 'Optimized digital foundations' },
            { title: 'Clarity', desc: 'Clear architecture and documentation' },
            { title: 'Elegance', desc: 'Beautiful, maintainable code' }
          ].map((item) => (
            <div key={item.title} className="border-t border-[var(--primary)]/20 dark:border-[var(--primary-dark)]/20 pt-4">
              <h3 className="text-lg text-[#c5a47f]">{item.title}</h3>
              <p className="text-sm text-gray-900 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Metrics */}
      {metrics && (
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-4">
              Our Impact
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {metrics.map((metric, i) => (
              <MetricBubble key={i} value={metric.value} label={metric.label} />
            ))}
          </div>
        </div>
      )}

             {/* Pricing */}
       <div className="container mx-auto px-6 py-24">
         <div className="text-center mb-16">
           <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
             Choose Your Plan
           </h2>
         </div>
         <div className="grid md:grid-cols-3 gap-8">
           <PricingCard2 
             plan="Starter"
             price="29"
             features={['Basic features', 'Email support', '5GB storage']}
             icon={<svg className="w-12 h-12 text-[#c5a47f]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>}
           />
           <PricingCard2 
             plan="Professional"
             price="99"
             features={['All starter features', 'Priority support', '50GB storage']}
             popular={true}
             icon={<svg className="w-12 h-12 text-[#c5a47f]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
           />
           <PricingCard2 
             plan="Enterprise"
             price="299"
             features={['All professional features', '24/7 support', 'Unlimited storage']}
             icon={<svg className="w-12 h-12 text-[#c5a47f]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z"/></svg>}
           />
         </div>
       </div>

       {/* CTA */}
       <div className="container mx-auto px-6 py-24 text-center">
         <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-8">
           Ready to Build?
         </h2>
         <CTAButton variant="primary" className="px-8 py-4 text-lg">
           Get Started
         </CTAButton>
       </div>
    </div>
  );
};
Home2.propTypes = {
  ...componentPropTypes,
  metrics: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string.isRequired }))
};

export const Home3 = ({ colors, timelineData }) => {
  const vars = { ...defaultColors, ...colors };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] dark:from-[var(--gradient-from-dark)] dark:to-[var(--gradient-to-dark)]">
      {/* Hero */}
      <div className="container mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2">
            <div className="border-l-4 border-[#c5a47f] pl-6">
              <h2 className="text-sm text-[#c5a47f] mb-2">HOLISTIC APPROACH</h2>
              <h1 className="text-4xl font-light text-gray-900">
                Integrated
                <span className="block mt-2 text-[#c5a47f]">Solutions</span>
              </h1>
            </div>
            <p className="mt-8 text-lg text-gray-900 leading-relaxed">
              Unified systems combining technical excellence with aesthetic mastery.
            </p>
            <div className="mt-8 grid gap-4">
              {['AI Architecture', 'Dynamic Systems', 'Responsive Design'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#c5a47f] rounded-full" />
                  <p className="text-gray-900">{item}</p>
                </div>
              ))}
            </div>
                         <div className="mt-8">
               <CTAButton variant="primary">
                 Explore Solutions
               </CTAButton>
             </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="relative aspect-square rounded-full overflow-hidden border border-[var(--primary)]/20 dark:border-[var(--primary-dark)]/20">
              <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                <source src="/video-bg4.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Our Services
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<svg className="w-8 h-8 text-[#c5a47f]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>}
            title="UI/UX Design" 
            description="Beautiful, intuitive interfaces"
          />
          <FeatureCard 
            icon={<svg className="w-8 h-8 text-[#c5a47f]" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>}
            title="Backend Development" 
            description="Robust, scalable solutions"
          />
          <FeatureCard 
            icon="📱" 
            title="Mobile Apps" 
            description="Native and cross-platform apps"
          />
        </div>
      </div>

             {/* Timeline */}
       {timelineData && (
         <div className="container mx-auto px-6 py-24">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
               Our Journey
             </h2>
           </div>
           <div className="border-l-2 border-[#c5a47f] ml-4">
             {timelineData.map((item, i) => (
               <div key={i} className="relative pl-8 mb-12">
                 <div className="absolute w-4 h-4 bg-[#c5a47f] rounded-full -left-2 top-2" />
                 <h3 className="text-lg text-[var(--primary)]">{item.year}</h3>
                 <p className="text-gray-900">{item.text}</p>
               </div>
             ))}
           </div>
         </div>
       )}

       {/* Pricing */}
       <div className="container mx-auto px-6 py-24">
         <div className="text-center mb-16">
           <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
             Choose Your Plan
           </h2>
         </div>
         <div className="grid md:grid-cols-3 gap-8">
           <PricingCard3 
             plan="Starter"
             price="29"
             features={['Basic features', 'Email support', '5GB storage']}
           />
           <PricingCard3 
             plan="Professional"
             price="99"
             features={['All starter features', 'Priority support', '50GB storage']}
             popular={true}
           />
           <PricingCard3 
             plan="Enterprise"
             price="299"
             features={['All professional features', '24/7 support', 'Unlimited storage']}
           />
         </div>
       </div>
    </div>
  );
};
Home3.propTypes = {
  ...componentPropTypes,
  timelineData: PropTypes.arrayOf(PropTypes.shape({ year: PropTypes.string.isRequired, text: PropTypes.string.isRequired }))
};

export const Home4 = ({ colors }) => {
  const vars = { ...defaultColors, ...colors };
  return (
    <div className="min-h-screen bg-[var(--background-light)] dark:bg-[var(--background-dark)]">
      {/* Hero */}
      <div className="container mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="border-l-4 border-[#c5a47f] pl-6">
              <h2 className="text-sm text-[#c5a47f] mb-2">PRECISION ENGINEERING</h2>
              <h1 className="text-4xl font-light text-gray-900">
                Technical
                <span className="block mt-2 text-[#c5a47f]">Mastery</span>
              </h1>
            </div>
            <p className="text-lg text-gray-900 leading-relaxed">
              Every line of code crafted with precision. Every pixel placed with purpose.
            </p>
                         <div className="flex gap-4">
               <CTAButton variant="primary">
                 View Portfolio
               </CTAButton>
               <CTAButton variant="secondary">Learn More</CTAButton>
             </div>
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden border border-[var(--primary)]/20 dark:border-[var(--primary-dark)]/20">
            <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
              <source src="/video-bg5.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      {/* Portfolio */}
      <div className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Featured Work
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-white rounded-lg p-4">
              <div className="w-full h-full rounded-lg overflow-hidden border border-[var(--primary)]/10 dark:border-[var(--primary-dark)]/10">
                <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                  <source src="/video-bg1.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Choose Your Plan
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <PricingCard4 
            plan="Starter"
            price="29"
            features={['Basic features', 'Email support', '5GB storage']}
          />
          <PricingCard4 
            plan="Professional"
            price="99"
            features={['All starter features', 'Priority support', '50GB storage']}
            popular={true}
          />
          <PricingCard4 
            plan="Enterprise"
            price="299"
            features={['All professional features', '24/7 support', 'Unlimited storage']}
          />
        </div>
      </div>
    </div>
  );
};
Home4.propTypes = componentPropTypes;

export const Home5 = ({ colors }) => {
  const vars = { ...defaultColors, ...colors };
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--gradient-from)] to-[var(--gradient-to)] dark:from-[var(--gradient-from-dark)] dark:to-[var(--gradient-to-dark)]">
      {/* Hero */}
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block border-b border-[#c5a47f] pb-2 mb-12">
            <span className="text-sm tracking-widest text-[#c5a47f]">DIGITAL EXCELLENCE</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-light mb-8 text-gray-900">
            Pioneering
            <span className="block mt-4 text-[#c5a47f]">Innovation</span>
          </h1>
          <p className="text-xl text-[var(--text-light)]/70 dark:text-[var(--text-dark)]/70 mb-12 max-w-2xl mx-auto">
            Pushing the boundaries of digital technology.
          </p>
                     <div className="flex justify-center gap-4 mb-16">
             <CTAButton variant="primary">
               Start Creating
             </CTAButton>
             <CTAButton variant="secondary">View Portfolio</CTAButton>
           </div>
        </div>
      </div>

      {/* Video */}
      <div className="container mx-auto px-6 mb-24">
        <div className="relative aspect-video rounded-xl overflow-hidden mx-8 border border-[var(--primary)]/20 dark:border-[var(--primary-dark)]/20">
          <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
            <source src="/video-bg3.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-light)]/80 dark:from-[var(--background-dark)]/80 flex items-end p-6">
            <div className="w-full flex justify-between items-center">
              <p className="text-sm text-gray-900">Next-generation framework</p>
              <CTAButton variant="primary">Explore</CTAButton>
            </div>
          </div>
        </div>
      </div>

             {/* Features */}
       <div className="container mx-auto px-6 py-24">
         <div className="text-center mb-16">
           <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
             Cutting-Edge Technology
           </h2>
         </div>
         <div className="grid md:grid-cols-3 gap-8">
           <FeatureCard 
             icon={<svg className="w-8 h-8 text-[#c5a47f]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>}
             title="AI-Powered" 
             description="Intelligent automation and analytics"
           />
           <FeatureCard 
             icon={<svg className="w-8 h-8 text-[#c5a47f]" fill="currentColor" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>}
             title="Cloud Native" 
             description="Built for scale and reliability"
           />
           <FeatureCard 
             icon={<svg className="w-8 h-8 text-[#c5a47f]" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/></svg>}
             title="Security First" 
             description="Enterprise-grade security"
           />
         </div>
       </div>

               {/* Pricing */}
        <div className="container mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              Choose Your Plan
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard5 
              plan="Starter"
              price="29"
              features={['Basic features', 'Email support', '5GB storage']}
            />
            <PricingCard5 
              plan="Professional"
              price="99"
              features={['All starter features', 'Priority support', '50GB storage']}
              popular={true}
            />
            <PricingCard5 
              plan="Enterprise"
              price="299"
              features={['All professional features', '24/7 support', 'Unlimited storage']}
            />
          </div>
        </div>
      </div>
    );
  };
  Home5.propTypes = componentPropTypes;

export const Home6 = ({ colors }) => {
  const vars = { ...defaultColors, ...colors };
  return (
    <div className="min-h-screen bg-[var(--background-light)] dark:bg-[var(--background-dark)]">
      {/* Hero */}
      <div className="container mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="border-l-4 border-[#c5a47f] pl-6">
              <h2 className="text-sm text-[#c5a47f] mb-2">STRATEGIC VISION</h2>
              <h1 className="text-4xl font-light text-gray-900">
                Intelligent
                <span className="block mt-2 text-[#c5a47f]">Systems</span>
              </h1>
            </div>
            <p className="text-lg text-gray-900 leading-relaxed">
              Smart, scalable, and future-proof solutions.
            </p>
                         <div className="flex gap-4">
               <CTAButton variant="primary">
                 Start Project
               </CTAButton>
               <CTAButton variant="secondary">Learn More</CTAButton>
             </div>
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden border border-[var(--primary)]/20 dark:border-[var(--primary-dark)]/20">
            <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
              <source src="/video-bg4.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Our Process
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: '01', title: 'Discovery', desc: 'Understanding your needs' },
            { step: '02', title: 'Strategy', desc: 'Creating a roadmap' },
            { step: '03', title: 'Development', desc: 'Building with care' },
            { step: '04', title: 'Launch', desc: 'Deploying for success' }
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 bg-[#c5a47f] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--text-light)]/70 dark:text-[var(--text-dark)]/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

             {/* Portfolio */}
       <div className="container mx-auto px-6 py-24">
         <div className="space-y-8">
           <div className="grid grid-cols-2 gap-4">
             {[1, 2, 3, 4].map((i) => (
               <div key={i} className="aspect-square bg-white rounded-lg p-4">
                 <div className="w-full h-full rounded-lg overflow-hidden">
                   <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                     <source src="/video-bg5.mp4" type="video/mp4" />
                   </video>
                 </div>
               </div>
             ))}
           </div>
           <div className="border-t border-[var(--primary)]/20 dark:border-[var(--primary-dark)]/20 pt-6 text-center">
             <p className="text-sm text-gray-900">Modular components for scalable growth</p>
           </div>
         </div>
       </div>

               {/* Pricing */}
        <div className="container mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              Choose Your Plan
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard6 
              plan="Starter"
              price="29"
              features={['Basic features', 'Email support', '5GB storage']}
              step="1"
            />
            <PricingCard6 
              plan="Professional"
              price="99"
              features={['All starter features', 'Priority support', '50GB storage']}
              popular={true}
              step="2"
            />
            <PricingCard6 
              plan="Enterprise"
              price="299"
              features={['All professional features', '24/7 support', 'Unlimited storage']}
              step="3"
            />
          </div>
        </div>
      </div>
    );
  };
  Home6.propTypes = componentPropTypes;

export const Home7 = ({ colors, enable3D }) => {
  const vars = { ...defaultColors, ...colors };
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--gradient-from)] to-[var(--gradient-to)] dark:from-[var(--gradient-from-dark)] dark:to-[var(--gradient-to-dark)]">
      {enable3D && <div className="absolute inset-0 pointer-events-none"><div className="threejs-container" /></div>}
      
      {/* Hero */}
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block border-b border-[#c5a47f] pb-2">
              <span className="text-sm tracking-widest text-[#c5a47f]">FUTURE VISION</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-light mt-8 text-gray-900">
              Architectural
              <span className="block mt-4 text-[#c5a47f]">Innovation</span>
            </h1>
            <p className="text-xl text-[var(--text-light)]/70 dark:text-[var(--text-dark)]/70 mt-8 max-w-2xl mx-auto">
              Shaping the future of digital architecture.
            </p>
          </div>
        </div>
      </div>

      {/* Video */}
      <div className="container mx-auto px-6 mb-24">
        <div className="relative aspect-video rounded-xl overflow-hidden border border-[var(--primary)]/20 dark:border-[var(--primary-dark)]/20">
          <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
            <source src="/video-bg1.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-light)]/80 dark:from-[var(--background-dark)]/80 flex items-end p-6">
            <div className="w-full flex justify-between items-center">
              <p className="text-sm text-gray-900">Next-generation framework</p>
              <CTAButton variant="primary">Explore</CTAButton>
            </div>
          </div>
        </div>
      </div>

             {/* Features */}
       <div className="container mx-auto px-6 py-24">
         <div className="text-center mb-16">
           <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
             Tomorrow's Technology
           </h2>
         </div>
         <div className="grid md:grid-cols-3 gap-8">
           <FeatureCard 
             icon={<svg className="w-8 h-8 text-[#c5a47f]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>}
             title="Neural Networks" 
             description="AI systems that learn and adapt"
           />
           <FeatureCard 
             icon={<svg className="w-8 h-8 text-[#c5a47f]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>}
             title="Predictive Analytics" 
             description="Anticipating trends early"
           />
           <FeatureCard 
             icon={<svg className="w-8 h-8 text-[#c5a47f]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>}
             title="Web3 Integration" 
             description="Next-gen decentralized apps"
           />
         </div>
       </div>

               {/* Pricing */}
        <div className="container mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              Choose Your Plan
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard7 
              plan="Starter"
              price="29"
              features={['Basic features', 'Email support', '5GB storage']}
            />
            <PricingCard7 
              plan="Professional"
              price="99"
              features={['All starter features', 'Priority support', '50GB storage']}
              popular={true}
            />
            <PricingCard7 
              plan="Enterprise"
              price="299"
              features={['All professional features', '24/7 support', 'Unlimited storage']}
            />
          </div>
        </div>

        {/* CTA */}
       <div className="container mx-auto px-6 py-24 text-center">
         <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-8">
           Be Part of the Future
         </h2>
         <CTAButton variant="primary" className="px-8 py-4 text-lg">
           Start Your Journey
         </CTAButton>
       </div>
    </div>
  );
};
Home7.propTypes = { ...componentPropTypes, enable3D: PropTypes.bool };

export const withScrollAnimation = (Component) => {
  return function ScrollAnimatedComponent(props) {
    return (
      <div className="scroll-animate opacity-0 translate-y-8" data-animate>
        <Component {...props} />
      </div>
    );
  };
};