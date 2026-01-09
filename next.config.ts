import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.layered.app' },
      // News source images
      { protocol: 'https', hostname: 'ichef.bbci.co.uk' },
      { protocol: 'https', hostname: 'i.guim.co.uk' },
      { protocol: 'https', hostname: 'media.guim.co.uk' },
      { protocol: 'https', hostname: 'media.npr.org' },
      { protocol: 'https', hostname: 'www.sciencedaily.com' },
      { protocol: 'https', hostname: 'scx1.b-cdn.net' },
      { protocol: 'https', hostname: 'scx2.b-cdn.net' },
      { protocol: 'https', hostname: 'a.espncdn.com' },
      { protocol: 'https', hostname: 'media.espn.com' },
      // Allow any https images as fallback
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
