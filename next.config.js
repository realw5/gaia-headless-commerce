module.exports = {
    async rewrites() {
      return {
        // After checking all Next.js pages (including dynamic routes)
        // and static files we proxy any other requests
        fallback: [
          {
            source: '/:path*',
            destination: `https://www.gaiadesign.com.mx/:path*`,
          },
        ],
      }
    },
    images: {
        domains: ['www.gaiadesign.com.mx'],
      },
  }