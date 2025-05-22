/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['via.placeholder.com', 'calisa.com.ar', 'arcordiezb2c.vteximg.com.br', 'congeladosartico.com.ar'],
    // También puedes usar remotePatterns si quieres, pero no es obligatorio si tienes domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
}

module.exports = nextConfig
