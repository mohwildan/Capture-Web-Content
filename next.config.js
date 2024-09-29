const withTM = require('next-transpile-modules')(['rfv'])
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
  },
  webpack: (config, { isServer }) => {
    // Add CSS rule for both client and server-side rendering
    if (!isServer) {
      config.module.rules.push({
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      })
    }

    return config
  },
}

module.exports = withTM(nextConfig)
