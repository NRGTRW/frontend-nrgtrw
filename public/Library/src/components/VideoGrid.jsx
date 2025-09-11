import React from 'react';

const VideoGrid = () => {
  const videos = [
    { src: '/video-bg1.mp4', alt: 'Background video 1' },
    { src: '/video-bg2.mp4', alt: 'Background video 2' },
    { src: '/video-bg3.mp4', alt: 'Background video 3' },
    { src: '/video-bg4.mp4', alt: 'Background video 4' }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-[var(--text-light)] dark:text-[var(--text-dark)] mb-4">
            Visual Excellence
          </h2>
          <p className="text-lg text-[var(--text-light)]/70 dark:text-[var(--text-dark)]/70 max-w-2xl mx-auto">
            Experience our curated collection of premium visual content
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {videos.map((video, index) => (
            <div
              key={index}
              className="group relative aspect-video rounded-xl overflow-hidden border border-[var(--primary)]/20 dark:border-[var(--primary-dark)]/20 hover:border-[var(--primary)]/40 dark:hover:border-[var(--primary-dark)]/40 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                aria-label={video.alt}
              >
                <source src={video.src} type="video/mp4" />
              </video>
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              
              {/* Play indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoGrid;





