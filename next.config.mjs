/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Custom domain deployment (triumphkiateh.com) serves from site root.
  // Keep basePath empty so routes and assets resolve correctly.
  basePath: "",
};

export default nextConfig;

