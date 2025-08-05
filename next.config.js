/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['via.placeholder.com', 'calisa.com.ar', 'arcordiezb2c.vteximg.com.br', 'congeladosartico.com.ar'],
    remotePatterns: [
      { protocol: 'https', hostname: 'via.placeholder.com' }
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,    // <--- ignora ESLint en build
  },
  typescript: {
    ignoreBuildErrors: true,     // <--- ignora errores de TypeScript en build
  },
};

module.exports = nextConfig;