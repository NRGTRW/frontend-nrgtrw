import React from 'react';
import { Link } from 'react-router-dom';
import { LIBRARY_ROUTES } from '../../../routes/links';

export const SimpleHomePage: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      {/* Optimized background effects - reduced for better performance */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Minimal sparkles for better performance */}
        {[...Array(1)].map((_, i) => (
          <div
            key={`home-sparkle-${i}`}
            className="absolute w-1 h-1 bg-white/20 dark:bg-white/15 rounded-full animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 1}s`
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
            <Link
              to={LIBRARY_ROUTES.generator}
              className="ultra-button ultra-button-primary text-lg px-8 py-4"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '1rem 2rem',
                borderRadius: '1rem',
                fontWeight: '600',
                fontSize: '1.125rem',
                background: 'linear-gradient(135deg, #0284c7 0%, #9333ea 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                border: 'none',
                minHeight: '48px',
                minWidth: '140px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.25s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px) scale(1.02)';
                e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)';
              }}
            >
              Start Creating
            </Link>
            <Link
              to={LIBRARY_ROUTES.gallery}
              className="ultra-button ultra-button-secondary text-lg px-8 py-4"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '1rem 2rem',
                borderRadius: '1rem',
                fontWeight: '600',
                fontSize: '1.125rem',
                background: '#ffffff',
                color: '#374151',
                textDecoration: 'none',
                border: '1px solid #d1d5db',
                minHeight: '48px',
                minWidth: '140px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.25s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f9fafb';
                e.target.style.borderColor = '#9ca3af';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#ffffff';
                e.target.style.borderColor = '#d1d5db';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)';
              }}
            >
              Browse Components
            </Link>
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
        <div 
          className="cta-section animate-fade-in-up"
          style={{
            background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
            borderRadius: '2rem',
            padding: '4rem',
            margin: '3rem 0',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div 
            className="ultra-card text-center"
            style={{
              background: '#ffffff',
              border: '2px solid #e5e7eb',
              borderRadius: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              padding: '3rem',
              position: 'relative',
              zIndex: 1
            }}
          >
            <h2 
              className="text-heading mb-6"
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #9333ea 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '2.5rem',
                fontWeight: '700',
                marginBottom: '1.5rem'
              }}
            >
              Ready to Create Your Landing Page?
            </h2>
            <p 
              className="text-body mb-10 max-w-2xl mx-auto"
              style={{
                color: '#6b7280',
                fontSize: '1.125rem',
                lineHeight: '1.7',
                marginBottom: '2.5rem',
                maxWidth: '42rem',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              Join thousands of businesses who have created professional landing pages with our AI. 
              Start building your perfect landing page in minutes, not hours.
            </p>
            <div 
              className="flex-center space-x-4"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem'
              }}
            >
              <Link
                to={LIBRARY_ROUTES.generator}
                className="ultra-button ultra-button-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '1.25rem 2.5rem',
                  borderRadius: '1rem',
                  fontWeight: '600',
                  fontSize: '1.125rem',
                  background: 'linear-gradient(135deg, #0284c7 0%, #9333ea 100%)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  border: 'none',
                  minHeight: '56px',
                  minWidth: '180px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
                }}
              >
                Get Started Now
              </Link>
              <Link
                to={LIBRARY_ROUTES.gallery}
                className="ultra-button ultra-button-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '1.25rem 2.5rem',
                  borderRadius: '1rem',
                  fontWeight: '600',
                  fontSize: '1.125rem',
                  background: '#ffffff',
                  color: '#374151',
                  textDecoration: 'none',
                  border: '1px solid #d1d5db',
                  minHeight: '56px',
                  minWidth: '180px',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f9fafb';
                  e.target.style.borderColor = '#9ca3af';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)';
                }}
              >
                View Examples
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom spacer */}
      <div className="py-16"></div>
    </div>
  );
};
