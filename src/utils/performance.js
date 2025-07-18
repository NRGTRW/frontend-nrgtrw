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

// Performance monitoring
export const performanceMonitor = {
  marks: new Map(),
  
  start: (name) => {
    performance.mark(`${name}-start`);
    performanceMonitor.marks.set(name, Date.now());
  },
  
  end: (name) => {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const startTime = performanceMonitor.marks.get(name);
    if (startTime) {
      const duration = Date.now() - startTime;
      console.log(`${name} took ${duration}ms`);
      performanceMonitor.marks.delete(name);
    }
  }
};

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