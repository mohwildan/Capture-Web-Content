const withTM = require('next-transpile-modules')(['rfv'])
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
  },
}

module.exports = withTM(nextConfig)
