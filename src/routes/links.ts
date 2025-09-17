/**
 * Centralized route definitions for the application
 * This ensures consistency across navigation components and prevents route drift
 */

export const ROUTES = {
  // Main app routes
  home: '/',
  fitness: '/fitness',
  clothing: '/clothing',
  cart: '/cart',
  checkout: '/checkout',
  profile: '/profile',
  wishlist: '/wishlist',
  login: '/login',
  signup: '/signup',
  resetPassword: '/reset-password',
  
  // Admin routes
  admin: '/admin',
  adminDashboard: '/admin/dashboard',
  adminFitness: '/admin/fitness',
  adminAnalytics: '/admin/analytics',
  adminCreateProduct: '/admin/create-product',
  adminFitnessAnalytics: '/admin/fitness-analytics',
  
  // Tech and Library routes
  tech: '/tech',
  library: '/library',
  libraryGallery: '/library/gallery',
  libraryGenerator: '/library/generator',
  libraryPreview: '/library/preview',
  
  // Library layout routes
  libraryLayoutsHome: '/library/layouts/home',
  libraryLayoutsPricing: '/library/layouts/pricing',
  libraryLayoutsGenerate: '/library/layouts/generate',
  libraryLayoutsCustom: '/library/layouts/custom',
  libraryLayoutsDashboard: '/library/layouts/dashboard',
  libraryLayoutsHeader: '/library/layouts/header',
  libraryLayoutsFooter: '/library/layouts/footer',
  libraryPreviewLayout: '/library/preview-layout',
  
  // Content pages
  materials: '/materials',
  inspiration: '/inspiration',
  vision: '/vision',
  design: '/design',
  clothingDetails: '/clothing-details',
  programs: '/programs',
  chat: '/chat',
  terms: '/terms',
  about: '/about',
  contact: '/contact',
  faq: '/faq',
} as const;

// Type for route keys
export type RouteKey = keyof typeof ROUTES;

// Type for route values
export type RouteValue = typeof ROUTES[RouteKey];

// Helper function to get route by key
export const getRoute = (key: RouteKey): RouteValue => ROUTES[key];

// Helper function to check if a path matches a route
export const isRoute = (path: string, key: RouteKey): boolean => {
  return path === ROUTES[key];
};

// Library-specific routes for easy access
export const LIBRARY_ROUTES = {
  home: ROUTES.library,
  gallery: ROUTES.libraryGallery,
  generator: ROUTES.libraryGenerator,
  preview: ROUTES.libraryPreview,
  layouts: {
    home: ROUTES.libraryLayoutsHome,
    pricing: ROUTES.libraryLayoutsPricing,
    generate: ROUTES.libraryLayoutsGenerate,
    custom: ROUTES.libraryLayoutsCustom,
    dashboard: ROUTES.libraryLayoutsDashboard,
    header: ROUTES.libraryLayoutsHeader,
    footer: ROUTES.libraryLayoutsFooter,
  },
  previewLayout: ROUTES.libraryPreviewLayout,
} as const;




