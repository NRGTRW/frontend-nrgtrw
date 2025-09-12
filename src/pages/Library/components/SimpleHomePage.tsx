import React from 'react';
import { Link } from 'react-router-dom';
import { LIBRARY_ROUTES } from '../../../routes/links';
import LibButton from './LibButton';

export const SimpleHomePage: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      {/* Additional glimmer effects for home page */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Floating sparkles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`home-sparkle-${i}`}
            className="absolute w-1 h-1 bg-white/40 dark:bg-white/30 rounded-full animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 1}s`
            }}
          />
        ))}
        
        {/* Gentle light rays */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`ray-${i}`}
            className="absolute w-px h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent dark:via-white/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      {/* Hero Section */}
      <div className="ultra-container py-20 relative z-30">
        <div className="text-center animate-fade-in-up">
          <h1 className="text-display mb-6 relative z-50 pb-4">
            Create Landing Pages with AI
          </h1>
          <p className="text-subheading mb-8 max-w-3xl mx-auto text-gray-600 dark:text-gray-300 relative z-40">
            Describe your business in plain English and get a complete, professional landing page in minutes. 
            No design skills required.
          </p>
          <div className="flex-center space-x-4 relative z-40">
            <LibButton
              to={LIBRARY_ROUTES.generator}
              variant="primary"
              size="lg"
              aria-label="Start creating a landing page"
            >
              Start Creating
            </LibButton>
            <LibButton
              to={LIBRARY_ROUTES.gallery}
              variant="secondary"
              size="lg"
              aria-label="Browse component gallery"
            >
              Browse Components
            </LibButton>
            {/* <Link
              to="/preview"
              className="ultra-button ultra-button-ghost text-lg px-8 py-4"
            >
              Advanced Editor
            </Link> */}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="ultra-container py-16 relative z-20">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-heading mb-4">How It Works</h2>
          <p className="text-body text-gray-600 dark:text-gray-300">Three simple steps to your landing page</p>
        </div>

        <div className="grid-3 gap-8">
          <div className="text-center ultra-card p-8 animate-fade-in-scale">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-center mx-auto mb-4 text-white text-2xl">
              💬
            </div>
            <h3 className="text-subheading mb-2">1. Describe Your Business</h3>
            <p className="text-body text-gray-600 dark:text-gray-300">
              Tell our AI about your business, target audience, and what you want to achieve. 
              Be as specific or general as you like.
            </p>
          </div>

          <div className="text-center ultra-card p-8 animate-fade-in-scale" style={{ animationDelay: '100ms' }}>
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex-center mx-auto mb-4 text-white text-2xl">
              🤖
            </div>
            <h3 className="text-subheading mb-2">2. AI Creates Your Page</h3>
            <p className="text-body text-gray-600 dark:text-gray-300">
              Our AI analyzes your description and creates a complete landing page with 
              all the sections you need: hero, features, testimonials, pricing, and more.
            </p>
          </div>

          <div className="text-center ultra-card p-8 animate-fade-in-scale" style={{ animationDelay: '200ms' }}>
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex-center mx-auto mb-4 text-white text-2xl">
              ✨
            </div>
            <h3 className="text-subheading mb-2">3. Customize & Export</h3>
            <p className="text-body text-gray-600 dark:text-gray-300">
              Preview your page, make adjustments, and export it as code or use it directly. 
              Perfect for any business or project.
            </p>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="py-8"></div>

      {/* Examples */}
      <div className="ultra-container py-20 relative z-20">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-heading mb-4">What You Can Create</h2>
          <p className="text-body text-gray-600 dark:text-gray-300">Examples of landing pages you can build</p>
        </div>

        <div className="grid-auto gap-6">
          <div className="ultra-card p-6 animate-fade-in-scale">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex-center mb-4 text-white text-xl">
              💻
            </div>
            <h3 className="text-subheading mb-2">SaaS Products</h3>
            <p className="text-body text-gray-600 dark:text-gray-300">
              Perfect for software companies, apps, and digital products with pricing tiers and feature comparisons.
            </p>
          </div>

          <div className="ultra-card p-6 animate-fade-in-scale" style={{ animationDelay: '100ms' }}>
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex-center mb-4 text-white text-xl">
              🛒
            </div>
            <h3 className="text-subheading mb-2">E-commerce</h3>
            <p className="text-body text-gray-600 dark:text-gray-300">
              Great for online stores, product launches, and retail businesses with product showcases and testimonials.
            </p>
          </div>

          <div className="ultra-card p-6 animate-fade-in-scale" style={{ animationDelay: '200ms' }}>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex-center mb-4 text-white text-xl">
              🏢
            </div>
            <h3 className="text-subheading mb-2">Services</h3>
            <p className="text-body text-gray-600 dark:text-gray-300">
              Ideal for consultants, agencies, freelancers, and service providers with case studies and contact forms.
            </p>
          </div>

          <div className="ultra-card p-6 animate-fade-in-scale" style={{ animationDelay: '300ms' }}>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex-center mb-4 text-white text-xl">
              🎓
            </div>
            <h3 className="text-subheading mb-2">Education</h3>
            <p className="text-body text-gray-600 dark:text-gray-300">
              Perfect for courses, training programs, and educational content with curriculum previews and student testimonials.
            </p>
          </div>

          <div className="ultra-card p-6 animate-fade-in-scale" style={{ animationDelay: '400ms' }}>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex-center mb-4 text-white text-xl">
              🏥
            </div>
            <h3 className="text-subheading mb-2">Healthcare</h3>
            <p className="text-body text-gray-600 dark:text-gray-300">
              Great for medical practices, wellness services, and health products with trust signals and patient stories.
            </p>
          </div>

          <div className="ultra-card p-6 animate-fade-in-scale" style={{ animationDelay: '500ms' }}>
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex-center mb-4 text-white text-xl">
              🚀
            </div>
            <h3 className="text-subheading mb-2">Startups</h3>
            <p className="text-body text-gray-600 dark:text-gray-300">
              Perfect for new businesses, product launches, and fundraising with investor-focused content and metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="py-12"></div>

      {/* CTA Section */}
      <div className="ultra-container py-24 relative z-20">
        <div className="ultra-card p-12 text-center animate-fade-in-up">
          <h2 className="text-heading mb-4">Ready to Create Your Landing Page?</h2>
          <p className="text-body text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of businesses who have created professional landing pages with our AI.
          </p>
          <LibButton
            to={LIBRARY_ROUTES.generator}
            variant="primary"
            size="lg"
            aria-label="Get started creating your landing page"
          >
            Get Started Now
          </LibButton>
        </div>
      </div>
      
      {/* Bottom spacer */}
      <div className="py-16"></div>
    </div>
  );
};
