import React, { useState, useEffect } from 'react';
import { joinWaitlist, checkWaitlistStatus } from '../../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './WaitlistModal.css';

const WaitlistModal = ({ isOpen, onClose, program = null }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [waitlistInfo, setWaitlistInfo] = useState({ position: null, total: 0 });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    setIsSubmitting(true);
    try {
      const waitlistData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      };
      await joinWaitlist(waitlistData);
      // Fetch position and total after joining
      const status = await checkWaitlistStatus(formData.email);
      setWaitlistInfo({ position: status.position, total: status.total });
      toast.success('Successfully joined the waitlist! You will be notified for all fitness programs.');
      setFormData({ name: '', email: '', phone: '', message: '' });
      // Don't close modal immediately, show position/progress
    } catch (error) {
      if (error.message && error.message.includes('already on the waitlist')) {
        toast.warning('You are already on the waitlist for all programs!');
      } else {
        toast.error('Failed to join waitlist. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkExistingStatus = async () => {
    if (!formData.email.trim()) {
      toast.error('Please enter your email first');
      return;
    }
    setIsChecking(true);
    try {
      const result = await checkWaitlistStatus(formData.email);
      setWaitlistInfo({ position: result.position, total: result.total });
      if (result.isOnWaitlist) {
        toast.info('You are already on the waitlist for all programs!');
      } else {
        toast.info('You are not currently on the waitlist.');
      }
    } catch (error) {
      toast.error('Failed to check waitlist status');
    } finally {
      setIsChecking(false);
    }
  };

  if (!isOpen) return null;

  // Progress bar calculation
  const { position, total } = waitlistInfo;
  const progressPercent = position && total ? Math.round((position / total) * 100) : 0;

  return (
    <div className="waitlist-modal-overlay" onClick={onClose}>
      <div className="waitlist-modal" onClick={(e) => e.stopPropagation()}>
        <div className="waitlist-modal-header">
          <h2>Join the Waitlist</h2>
          <button className="waitlist-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="waitlist-modal-content">
          {program && (
            <div className="program-info">
              <h3>{program.title}</h3>
              <p>{program.description}</p>
            </div>
          )}
          <div className="waitlist-description">
            <p>
              🎯 <strong>Be the first to know!</strong> Join our exclusive waitlist and get early access 
              to this premium fitness program when it becomes available.
            </p>
            <p>
              📧 We'll notify you via email as soon as the program launches, and you'll get 
              priority access before the general public.
            </p>
          </div>

          {/* Show progress bar and position if available */}
          {position && total ? (
            <div className="waitlist-progress-section">
              <div className="waitlist-progress-label">
                <span>🎉 Your Position: <strong>{position}</strong> / {total}</span>
              </div>
              <div className="waitlist-progress-bar-bg">
                <div className="waitlist-progress-bar" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <div className="waitlist-progress-text">
                {progressPercent === 1 ? 'You are first in line!' : `You're in the top ${progressPercent}% of the waitlist!`}
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="waitlist-form">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <div className="email-input-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                />
                <button
                  type="button"
                  className="check-status-btn"
                  onClick={checkExistingStatus}
                  disabled={isChecking}
                >
                  {isChecking ? 'Checking...' : 'Check Status'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number (Optional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message (Optional)</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us about your fitness goals or any questions..."
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="join-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </button>
            </div>
          </form>

          <div className="waitlist-benefits">
            <h4>🎁 Waitlist Benefits:</h4>
            <ul>
              <li>Early access to program launch</li>
              <li>Exclusive discount codes</li>
              <li>Priority customer support</li>
              <li>Behind-the-scenes updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistModal; 