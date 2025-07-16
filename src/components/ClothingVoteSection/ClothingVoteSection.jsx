import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { fetchClothingVoteStats, checkClothingVoteStatus } from '../../services/api';
import ClothingVoteModal from '../ClothingVoteModal/ClothingVoteModal';
import './ClothingVoteSection.css';

const ClothingVoteSection = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [voteStats, setVoteStats] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 1, name: 'Elegance', key: 'elegance' },
    { id: 2, name: 'Pump Covers', key: 'pumpCovers' },
    { id: 3, name: 'Confidence', key: 'confidence' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData] = await Promise.all([
          fetchClothingVoteStats()
        ]);
        
        setVoteStats(statsData);
        
        // Check user's voting status for each category
        if (user?.email) {
          const userVoteStatus = {};
          await Promise.all(
            categories.map(async (category) => {
              try {
                const status = await checkClothingVoteStatus(user.email, category.id);
                userVoteStatus[category.id] = status.hasVoted;
              } catch (error) {
                console.error(`Error checking vote status for ${category.name}:`, error);
                userVoteStatus[category.id] = false;
              }
            })
          );
          setUserVotes(userVoteStatus);
        }
      } catch (error) {
        console.error('Error fetching clothing vote data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleVoteClick = (category) => {
    if (!user) {
      // Show login prompt but still allow voting
      toast.info('Please log in for accurate vote tracking, but you can still vote!');
    }
    
    setSelectedCategory(category);
    setShowVoteModal(true);
  };

  const handleCloseVoteModal = () => {
    setShowVoteModal(false);
    setSelectedCategory(null);
    // Refresh vote stats after voting
    fetchClothingVoteStats().then(setVoteStats);
  };

  if (loading) {
    return (
      <div className="clothing-vote-section">
        <div className="vote-section-header">
          <h2>{t('clothingPage.voteSection.title')}</h2>
          <p>{t('clothingPage.voteSection.subtitle')}</p>
        </div>
        <div className="vote-cards-container">
          <div className="loading-message">Loading voting data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="clothing-vote-section">
      <div className="vote-section-header">
        <h2>{t('clothingPage.voteSection.title')}</h2>
        <p>{t('clothingPage.voteSection.subtitle')}</p>
        <p className="vote-description">{t('clothingPage.voteSection.description')}</p>
      </div>
      
      <div className="vote-cards-container">
        {categories.map((category) => {
          const voteCount = voteStats[category.key] || 0;
          const hasVoted = userVotes[category.id] || false;
          
          return (
            <div key={category.id} className="vote-card">
              <div className="vote-card-header">
                <h3>{t(`clothingPage.sectionTitles.${category.key}`)}</h3>
                <div className="vote-count">
                  <span className="vote-number">{voteCount}</span>
                  <span className="vote-label">{t('clothingPage.voteSection.voteCount')}</span>
                </div>
              </div>
              
              <div className="vote-card-content">
                <p>Help us decide if this collection should be produced. Your vote matters!</p>
                
                {hasVoted ? (
                  <div className="voted-status">
                    <span className="voted-icon">✓</span>
                    <span>{t('clothingPage.voteSection.alreadyVoted')}</span>
                  </div>
                ) : (
                  <button
                    className="vote-button"
                    onClick={() => handleVoteClick(category)}
                  >
                    {t('clothingPage.voteSection.voteButton')}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ClothingVoteModal
        isOpen={showVoteModal}
        onClose={handleCloseVoteModal}
        category={selectedCategory}
      />
    </div>
  );
};

export default ClothingVoteSection; 