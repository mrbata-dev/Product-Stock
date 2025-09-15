import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, 
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
   
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "tailark.com",
      },
      {
        protocol: "https",
        hostname: "fozblwhcskqfpvvakgga.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  }

};

export default nextConfig;
