/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig = withPWA({
  // 保持 standalone 模式（支持 API 路由）
  output: 'standalone',
  // 空 turbopack 配置（禁用 turbopack，使用 webpack）
  turbopack: {},
})

module.exports = nextConfig
