import React from "react";
import { Helmet } from "react-helmet-async";

const SEOHead = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  author = "NRG",
  robots = "index, follow",
}) => {
  const siteName = "NRG - Premium Fitness & Lifestyle";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription =
    "Premium fitness programs, high-quality clothing, and cutting-edge tech solutions. Transform your lifestyle with NRG.";
  const defaultImage =
    "https://nrgtrw-images.s3.eu-central-1.amazonaws.com/vision.png";
  const defaultUrl = "https://nrgtrw.com";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta
        name="keywords"
        content={
          keywords ||
          "fitness, lifestyle, clothing, tech, premium, transformation"
        }
      />
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta
        property="og:description"
        content={description || defaultDescription}
      />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={url || defaultUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta
        name="twitter:description"
        content={description || defaultDescription}
      />
      <meta name="twitter:image" content={image || defaultImage} />
      <meta name="twitter:site" content="@nrgtrw" />

      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#667eea" />
      <meta name="msapplication-TileColor" content="#667eea" />

      {/* Canonical URL */}
      <link rel="canonical" href={url || defaultUrl} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "NRG",
          url: "https://nrgtrw.com",
          logo: "https://nrgtrw-images.s3.eu-central-1.amazonaws.com/vision.png",
          description:
            "Premium fitness programs, high-quality clothing, and cutting-edge tech solutions",
          sameAs: [
            "https://twitter.com/nrgtrw",
            "https://instagram.com/nrgtrw",
          ],
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
