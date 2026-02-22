/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig = withPWA({
  output: 'standalone',
  // 禁用 Turbopack，使用 webpack（next-pwa 需要）
  turbopack: false,
})

module.exports = nextConfig
