import React, { useState, useEffect } from 'react';
import './EnhancedTestimonials.css';

const EnhancedTestimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: 'Personal Journey',
      role: 'Fitness Transformation',
      avatar: 'https://nrgtrw-images.s3.eu-central-1.amazonaws.com/default-profile.webp',
      content: 'My own fitness journey has been transformative. Through consistent training and proper nutrition, I\'ve achieved results that seemed impossible. This isn\'t just about physical change - it\'s about mental strength and discipline.',
      rating: 5,
      beforeAfter: {
        before: 'Starting Point',
        after: 'Current Progress',
        timeframe: 'Ongoing Journey'
      }
    },
    {
      id: 2,
      name: 'Tech Development',
      role: 'Project Success',
      avatar: 'https://nrgtrw-images.s3.eu-central-1.amazonaws.com/default-profile.webp',
      content: 'Building this platform has been a learning experience. Every project teaches something new about development, user experience, and problem-solving. The journey of continuous improvement never ends.',
      rating: 5,
      metrics: {
        users: 'Growing',
        performance: 'Improving',
        timeframe: 'Continuous Development'
      }
    },
    {
      id: 3,
      name: 'Style Evolution',
      role: 'Personal Brand',
      avatar: 'https://nrgtrw-images.s3.eu-central-1.amazonaws.com/default-profile.webp',
      content: 'Developing my personal style has been about more than just clothing. It\'s about confidence, authenticity, and expressing who I am. The transformation goes beyond appearance.',
      rating: 5,
      socialGrowth: {
        followers: 'Building',
        engagement: 'Growing',
        timeframe: 'Ongoing Process'
      }
    },
    {
      id: 4,
      name: 'Vision to Reality',
      role: 'Goal Achievement',
      avatar: 'https://nrgtrw-images.s3.eu-central-1.amazonaws.com/default-profile.webp',
      content: 'Turning vision into reality requires patience, persistence, and adaptability. Every goal achieved is a stepping stone to the next challenge. The journey is the destination.',
      rating: 5,
      achievement: {
        goal: 'Continuous',
        timeframe: 'Lifetime Journey',
        status: 'In Progress'
      }
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`star ${i < rating ? 'filled' : ''}`}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ));
  };

  const currentTestimonialData = testimonials[currentTestimonial];

  return (
    <section className="enhanced-testimonials nrg-enhanced-testimonials">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2 className="testimonials-title">My Journey</h2>
          <p className="testimonials-subtitle">
            Real experiences, real growth, real progress
          </p>
        </div>

        <div className="testimonial-carousel">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="testimonial-quote">
                <svg className="quote-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p>{currentTestimonialData.content}</p>
              </div>

              <div className="testimonial-author">
                <div className="author-info">
                  {/* <img 
                    src={currentTestimonialData.avatar} 
                    alt={currentTestimonialData.name}
                    className="author-avatar"
                  /> */}
                  <span className="author-avatar" style={{fontSize: '2.2rem', color: '#bbb', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
                    <i className="fa-solid fa-user-circle"></i>
                  </span>
                  <div className="author-details">
                    <h4 className="author-name">{currentTestimonialData.name}</h4>
                    <p className="author-role">{currentTestimonialData.role}</p>
                    <div className="rating">
                      {renderStars(currentTestimonialData.rating)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="testimonial-metrics">
                {currentTestimonialData.beforeAfter && (
                  <div className="metric-card">
                    <h5><i className="fa-solid fa-dumbbell" style={{marginRight: '0.4em'}}></i>Progress</h5>
                    <div className="metric-values">
                      <span className="before">{currentTestimonialData.beforeAfter.before}</span>
                      <span className="arrow">→</span>
                      <span className="after">{currentTestimonialData.beforeAfter.after}</span>
                    </div>
                    <p className="timeframe">{currentTestimonialData.beforeAfter.timeframe}</p>
                  </div>
                )}
                
                {currentTestimonialData.metrics && (
                  <div className="metric-card">
                    <h5><i className="fa-solid fa-laptop-code" style={{marginRight: '0.4em'}}></i>Development</h5>
                    <div className="metric-values">
                      <span className="metric">{currentTestimonialData.metrics.users} user base</span>
                      <span className="metric">{currentTestimonialData.metrics.performance} performance</span>
                    </div>
                    <p className="timeframe">{currentTestimonialData.metrics.timeframe}</p>
                  </div>
                )}

                {currentTestimonialData.socialGrowth && (
                  <div className="metric-card">
                    <h5><i className="fa-solid fa-users" style={{marginRight: '0.4em'}}></i>Growth</h5>
                    <div className="metric-values">
                      <span className="metric">{currentTestimonialData.socialGrowth.followers} community</span>
                      <span className="metric">{currentTestimonialData.socialGrowth.engagement} engagement</span>
                    </div>
                    <p className="timeframe">{currentTestimonialData.socialGrowth.timeframe}</p>
                  </div>
                )}

                {currentTestimonialData.achievement && (
                  <div className="metric-card">
                    <h5><i className="fa-solid fa-trophy" style={{marginRight: '0.4em', color: '#f5c518'}}></i>Achievement</h5>
                    <div className="metric-values">
                      <span className="metric">{currentTestimonialData.achievement.goal} improvement</span>
                    </div>
                    <p className="timeframe">{currentTestimonialData.achievement.timeframe}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="carousel-controls">
            <button 
              className="control-btn prev" 
              onClick={prevTestimonial}
              onMouseEnter={() => setIsAutoPlaying(false)}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="carousel-indicators">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentTestimonial(index);
                    setIsAutoPlaying(false);
                  }}
                />
              ))}
            </div>
            
            <button 
              className="control-btn next" 
              onClick={nextTestimonial}
              onMouseEnter={() => setIsAutoPlaying(false)}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Remove the CTA at the bottom to avoid duplication */}
      </div>
    </section>
  );
};

export default EnhancedTestimonials; 