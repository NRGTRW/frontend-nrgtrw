import React, { useState, useEffect } from 'react';
import { joinClothingVote, checkClothingVoteStatus } from '../../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './ClothingVoteModal.css';

const ClothingVoteModal = ({ isOpen, onClose, category = null }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    priceRange: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [voteInfo, setVoteInfo] = useState({ position: null, total: 0 });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    } else {
      // Clear form data for non-logged-in users
      setFormData(prev => ({
        ...prev,
        name: '',
        email: ''
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
    if (!category) {
      toast.error('Category is required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const voteData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        categoryId: category.id,
        priceRange: formData.priceRange
      };
      await joinClothingVote(voteData);
      // Fetch position and total after voting
      const status = await checkClothingVoteStatus(formData.email, category.id);
      setVoteInfo({ position: status.position, total: status.totalVotes });
      toast.success(`Successfully voted for ${category.name} collection!`);
      setFormData({ name: '', email: '', phone: '', message: '', priceRange: '' });
      // Don't close modal immediately, show position/progress
    } catch (error) {
      if (error.message && error.message.includes('already voted')) {
        toast.warning('You have already voted for this collection!');
      } else {
        toast.error('Failed to submit vote. Please try again.');
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
    if (!category) {
      toast.error('Category is required');
      return;
    }
    setIsChecking(true);
    try {
      const result = await checkClothingVoteStatus(formData.email, category.id);
      setVoteInfo({ position: result.position, total: result.totalVotes });
      if (result.hasVoted) {
        toast.info('You have already voted for this collection!');
      } else {
        toast.info('You have not voted for this collection yet.');
      }
    } catch (error) {
      toast.error('Failed to check vote status');
    } finally {
      setIsChecking(false);
    }
  };

  if (!isOpen) return null;

  // Progress bar calculation
  const { position, total } = voteInfo;
  const progressPercent = position && total ? Math.round((position / total) * 100) : 0;

  const categoryNames = {
    1: "Elegance",
    2: "Pump Covers",
    3: "Confidence"
  };

  return (
    <div className="clothing-vote-modal-overlay" onClick={onClose}>
      <div className="clothing-vote-modal" onClick={(e) => e.stopPropagation()}>
        <div className="clothing-vote-modal-header">
          <h2>Vote for Collection</h2>
          <button className="clothing-vote-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="clothing-vote-modal-content">
          {category && (
            <div className="category-info">
              <h3>{categoryNames[category.id] || category.name}</h3>
              <p>Show your interest in this collection. If enough people vote, we'll make it happen!</p>
            </div>
          )}
          <div className="vote-description">
            <p>
              🎯 <strong>Make it happen!</strong> Vote for this collection and help us decide which pieces to produce next.
            </p>
            <p>
              📧 We'll notify you via email when we have enough interest to start production, and you'll get 
              early access before anyone else.
            </p>
            {!user && (
              <p style={{ color: 'var(--accent-primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                💡 <strong>Tip:</strong> Log in for accurate vote tracking and better experience!
              </p>
            )}
          </div>

          {/* Show progress bar and position if available */}
          {position && total ? (
            <div className="vote-progress-section">
              <div className="vote-progress-label">
                <span>🎉 Your Position: <strong>{position}</strong> / {total}</span>
              </div>
              <div className="vote-progress-bar-bg">
                <div className="vote-progress-bar" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <div className="vote-progress-text">
                {progressPercent === 1 ? 'You were the first to vote!' : `You're in the top ${progressPercent}% of voters!`}
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="vote-form">
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
              <label htmlFor="priceRange">Preferred Price Range (Optional)</label>
              <select
                id="priceRange"
                name="priceRange"
                value={formData.priceRange}
                onChange={handleInputChange}
              >
                <option value="">Select price range</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-150">$100 - $150</option>
                <option value="150-200">$150 - $200</option>
                <option value="200+">$200+</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message (Optional)</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us about your style preferences or any specific pieces you'd like to see..."
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
                className="vote-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Vote'}
              </button>
            </div>
          </form>

          <div className="vote-benefits">
            <h4>🎁 Voting Benefits:</h4>
            <ul>
              <li>Early access to collection launch</li>
              <li>Exclusive discount codes</li>
              <li>Priority customer support</li>
              <li>Behind-the-scenes updates</li>
              <li>Influence on future designs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClothingVoteModal; 