/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [`${process.env.NEXT_CONFIG_IMAGES_DOMAINS}`],
  },
};

module.exports = nextConfig;
