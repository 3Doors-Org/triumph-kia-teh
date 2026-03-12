/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Deploying as a GitHub project page at /triumph-kia-teh/.
  // This ensures CSS and JS load correctly under the repo path.
  basePath: "/triumph-kia-teh",
};

export default nextConfig;

