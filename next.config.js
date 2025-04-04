/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // 启用独立输出模式，优化Docker部署
}

module.exports = nextConfig 