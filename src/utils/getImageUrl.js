const S3_BASE = "https://nrgtrw-images.s3.eu-central-1.amazonaws.com/";

export const getImageUrl = (path) => {
  if (!path) return '';
  
  return path.startsWith("http")
    ? path
    : S3_BASE + (path.startsWith("/") ? path.slice(1) : path);
};
