// TikTok Service for fetching real videos from @nrgoranov account
// Note: TikTok API requires authentication and proper setup

const TIKTOK_USERNAME = "@nrgoranov";
const TIKTOK_API_BASE = "https://www.tiktok.com/api";

// Mock data structure for real TikTok videos
// In production, this would be replaced with actual TikTok API calls
export const getTikTokVideos = async () => {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Use real fitness program mp4 video data
    const realVideos = [
      {
        id: "fit1",
        videoUrl: "https://nrgtrw-images.s3.eu-central-1.amazonaws.com/ppl.mp4",
        thumbnail:
          "https://nrgtrw-images.s3.eu-central-1.amazonaws.com/ppl.jpg",
        title: "Push Day Routine",
        views: "2.1K",
        likes: "156",
        comments: "23",
        shares: "8",
        description: "Push day for strength and size! #fitness #pushday",
        duration: "00:15",
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "fit2",
        videoUrl:
          "https://nrgtrw-images.s3.eu-central-1.amazonaws.com/precisiongrowth.mp4",
        thumbnail:
          "https://nrgtrw-images.s3.eu-central-1.amazonaws.com/precisiongrowth.jpg",
        title: "Precision Growth Program",
        views: "1.8K",
        likes: "95",
        comments: "15",
        shares: "4",
        description:
          "Lean bulking with the Precision Growth program. #bulking #fitness",
        duration: "00:25",
        createdAt: "2024-01-11T16:30:00Z",
      },
      {
        id: "fit3",
        videoUrl:
          "https://nrgtrw-images.s3.eu-central-1.amazonaws.com/shred6.mp4",
        thumbnail:
          "https://nrgtrw-images.s3.eu-central-1.amazonaws.com/shred6.jpg",
        title: "Shred 6 Transformation",
        views: "3.2K",
        likes: "280",
        comments: "35",
        shares: "12",
        description: "Shred 6: Get lean, get strong. #shred6 #transformation",
        duration: "00:18",
        createdAt: "2024-01-12T09:15:00Z",
      },
    ];
    return {
      success: true,
      data: realVideos,
      total: realVideos.length,
      user: {
        username: "@nrgoranov",
        displayName: "NRG Oranov",
        followers: "1.2K",
        following: "150",
        likes: "5.6K",
        verified: false,
      },
    };
  } catch (error) {
    console.error("Error fetching TikTok videos:", error);
    return {
      success: false,
      error: "Failed to fetch videos",
      data: [],
    };
  }
};

// Get user profile information
export const getTikTokProfile = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
      data: {
        username: TIKTOK_USERNAME,
        displayName: "NRG Oranov",
        bio: "Building, growing, evolving. Fitness, tech, style, vision.",
        followers: "1.2K",
        following: "150",
        likes: "5.6K",
        verified: false,
        avatar:
          "https://nrgtrw-images.s3.eu-central-1.amazonaws.com/default-profile.webp",
        website: "https://nrgtrw.com",
      },
    };
  } catch (error) {
    console.error("Error fetching TikTok profile:", error);
    return {
      success: false,
      error: "Failed to fetch profile",
      data: null,
    };
  }
};

// Format video statistics
export const formatVideoStats = (views, likes, comments, shares) => {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return {
    views: formatNumber(views),
    likes: formatNumber(likes),
    comments: formatNumber(comments),
    shares: formatNumber(shares),
  };
};

// Get trending hashtags from user's videos
export const getTrendingHashtags = () => {
  return [
    "#fitness",
    "#progress",
    "#motivation",
    "#tech",
    "#development",
    "#coding",
    "#style",
    "#fashion",
    "#evolution",
    "#vision",
    "#goals",
    "#consistency",
  ];
};
