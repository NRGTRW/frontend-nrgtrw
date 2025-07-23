/**
 * Responsive Fitness Video Feed using mp4 files for inline playback.
 */
import React, { useState, useEffect } from 'react';
import { getTikTokVideos, getTikTokProfile } from '../../services/tikTokService';
import './TikTokFeed.css';

const TikTokFeed = () => {
  const [videos, setVideos] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoFailed, setVideoFailed] = useState({});

  useEffect(() => {
    const fetchTikTokData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [videosResponse, profileResponse] = await Promise.all([
          getTikTokVideos(),
          getTikTokProfile()
        ]);
        if (videosResponse.success) {
          setVideos(videosResponse.data);
        } else {
          setError(videosResponse.error);
        }
        if (profileResponse.success) {
          setProfile(profileResponse.data);
        }
      } catch (err) {
        setError('Failed to load fitness videos');
        console.error('Error fetching fitness videos:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTikTokData();
  }, []);

  if (isLoading) {
    return (
      <section className="tiktok-feed-section nrg-tiktok-feed">
        <div className="tiktok-feed-container">
          <h2 className="tiktok-feed-title">Latest Content</h2>
          <div className="tiktok-feed-loading">
            <div className="loading-spinner"></div>
            <p>Loading latest fitness videos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="tiktok-feed-section nrg-tiktok-feed">
        <div className="tiktok-feed-container">
          <div className="tiktok-feed-error">
            <h2 className="tiktok-feed-title">Content Unavailable</h2>
            <p>Unable to load fitness videos at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="tiktok-feed-section nrg-tiktok-feed">
      <div className="tiktok-feed-container">
        <div className="tiktok-feed-header">
          <h2 className="tiktok-feed-title">Latest Fitness Videos</h2>
          <p className="tiktok-feed-subtitle">Watch real program previews</p>
          {profile && (
            <div className="tiktok-profile-info">
              <span className="profile-avatar">
                <i className="fa-solid fa-user-circle"></i>
              </span>
              <div className="profile-details">
                <h3>{profile.displayName}</h3>
                <p>{profile.bio}</p>
                <div className="profile-stats">
                  <span><i className="fa-solid fa-user-group" style={{marginRight: '0.4em'}}></i>{profile.followers} followers</span>
                  <span><i className="fa-solid fa-heart" style={{marginRight: '0.4em', color: '#e63946'}}></i>{profile.likes} likes</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="tiktok-feed-grid">
          {videos.slice(0, 3).map((video) => (
            <div key={video.id} className="tiktok-video-card aspect-9-16">
              {!videoFailed[video.id] ? (
                <video
                  src={video.videoUrl}
                  poster={video.thumbnail}
                  controls
                  playsInline
                  className="fitness-inline-video"
                  style={{ width: '100%', height: '100%', borderRadius: '12px', background: '#000' }}
                  onError={() => setVideoFailed((prev) => ({ ...prev, [video.id]: true }))}
                />
              ) : (
                <div className="tiktok-fallback-thumbnail">
                  <img src={video.thumbnail} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                  <span className="tiktok-fallback-play">▶</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="tiktok-feed-cta" style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a
            href="https://www.tiktok.com/@nrgoranov"
            target="_blank"
            rel="noopener noreferrer"
            className="tiktok-follow-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #f5c518 0%, #e6b800 100%)',
              color: '#18140a',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: 600,
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(245,197,24,0.3)'
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
            Follow on TikTok
          </a>
        </div>
      </div>
    </section>
  );
};

export default TikTokFeed; 