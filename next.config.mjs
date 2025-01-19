import ReactComponentName from "react-scan/react-component-name/webpack";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: ""
      }
    ]
  },
  webpack: (config) => {
    config.plugins.push(ReactComponentName({}));
    return config;
  }
};

export default nextConfig;
