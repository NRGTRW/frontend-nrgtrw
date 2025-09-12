import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "Modern Web Solutions",
  description = "Professional web development and design solutions for modern businesses",
  keywords = "web development, design, react, modern, professional",
  image = "/og-image.jpg",
  url = window.location.href,
  type = "website",
  ...props 
}) => {
  const siteName = "Modern Web Solutions";
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": siteName,
          "description": description,
          "url": url,
          "logo": "/logo.png",
          "sameAs": [
            "https://twitter.com/yourcompany",
            "https://linkedin.com/company/yourcompany"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;







