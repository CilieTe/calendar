/** @type {import('next').NextConfig} */
const path = require('path')

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
  
  // 静态资源重定向：/assets/* -> shared/assets/*
  async rewrites() {
    return [
      {
        source: '/assets/:path*',
        destination: '/api/assets/:path*',
      },
    ]
  },
})

module.exports = nextConfig
