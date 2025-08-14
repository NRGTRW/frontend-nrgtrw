// Performance utilities for the NRG application

// Debounce function for search inputs and scroll events
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll and resize events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Image preloader for critical images
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Preload multiple images
export const preloadImages = async (imageUrls) => {
  const promises = imageUrls.map(url => preloadImage(url));
  try {
    await Promise.all(promises);
    console.log('All images preloaded successfully');
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};

// Local storage cache with expiration
export const cache = {
  set: (key, value, ttl = 3600000) => { // Default 1 hour
    const item = {
      value,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
  },
  
  get: (key) => {
    try {
      const item = JSON.parse(localStorage.getItem(key));
      if (!item) return null;
      
      const now = Date.now();
      if (now - item.timestamp > item.ttl) {
        localStorage.removeItem(key);
        return null;
      }
      
      return item.value;
    } catch (error) {
      console.warn('Cache get error:', error);
      return null;
    }
  },
  
  remove: (key) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    localStorage.clear();
  }
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Performance monitoring utility
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = {};
    this.init();
  }

  init() {
    // Track page load performance
    this.trackPageLoad();
    
    // Track user interactions
    this.trackUserInteractions();
    
    // Track resource loading
    this.trackResourceLoading();
    
    // Track memory usage (if supported)
    this.trackMemoryUsage();
  }

  trackPageLoad() {
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        this.metrics.pageLoad = {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
          timestamp: Date.now()
        };

        this.logMetric('pageLoad', this.metrics.pageLoad);
      });
    }
  }

  trackUserInteractions() {
    // Track button clicks
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        this.trackInteraction('button_click', {
          element: e.target.textContent || e.target.closest('button')?.textContent,
          path: window.location.pathname,
          timestamp: Date.now()
        });
      }
    });

    // Track navigation
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' || e.target.closest('a')) {
        this.trackInteraction('navigation', {
          href: e.target.href || e.target.closest('a')?.href,
          path: window.location.pathname,
          timestamp: Date.now()
        });
      }
    });
  }

  trackResourceLoading() {
    if (typeof window !== 'undefined' && window.performance) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.trackResource(entry);
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
    }
  }

  trackMemoryUsage() {
    if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
      setInterval(() => {
        const memory = performance.memory;
        this.metrics.memory = {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
          timestamp: Date.now()
        };
      }, 30000); // Check every 30 seconds
    }
  }

  trackInteraction(type, data) {
    if (!this.metrics.interactions) {
      this.metrics.interactions = [];
    }
    
    this.metrics.interactions.push({
      type,
      data,
      timestamp: Date.now()
    });

    this.logMetric('interaction', { type, data });
  }

  trackResource(entry) {
    if (!this.metrics.resources) {
      this.metrics.resources = [];
    }

    this.metrics.resources.push({
      name: entry.name,
      duration: entry.duration,
      size: entry.transferSize,
      type: entry.initiatorType,
      timestamp: Date.now()
    });
  }

  logMetric(type, data) {
    // In production, you'd send this to your analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${type}:`, data);
    }
    
    // You can also send to your backend
    // this.sendToAnalytics(type, data);
  }

  getMetrics() {
    return this.metrics;
  }

  // Track custom events
  trackEvent(eventName, data = {}) {
    this.trackInteraction('custom_event', {
      event: eventName,
      data,
      path: window.location.pathname
    });
  }

  // Track API calls
  trackApiCall(endpoint, duration, status) {
    this.trackInteraction('api_call', {
      endpoint,
      duration,
      status,
      path: window.location.pathname
    });
  }

  // Track errors
  trackError(error, context = {}) {
    this.trackInteraction('error', {
      message: error.message,
      stack: error.stack,
      context,
      path: window.location.pathname
    });
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;

// Memory usage monitoring
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    return {
      used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
    };
  }
  return null;
};

// Network status monitoring
export const networkMonitor = {
  isOnline: () => navigator.onLine,
  
  getConnectionInfo: () => {
    if ('connection' in navigator) {
      return {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      };
    }
    return null;
  },
  
  addListener: (callback) => {
    window.addEventListener('online', () => callback(true));
    window.addEventListener('offline', () => callback(false));
  }
};

// Bundle size optimization helper
export const dynamicImport = (importFn, fallback = null) => {
  return importFn().catch(() => fallback);
};

// Critical CSS inlining helper
export const inlineCriticalCSS = (css) => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};

// Service Worker registration helper
export const registerServiceWorker = async (swPath = '/sw.js') => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(swPath);
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Resource hints for performance
export const addResourceHints = () => {
  const hints = [
    { rel: 'preconnect', href: 'https://nrgtrw-images.s3.eu-central-1.amazonaws.com' },
    { rel: 'dns-prefetch', href: 'https://api.nrgtrw.com' },
    { rel: 'preload', href: '/default-profile.webp', as: 'image' }
  ];
  
  hints.forEach(hint => {
    const link = document.createElement('link');
    Object.assign(link, hint);
    document.head.appendChild(link);
  });
}; 