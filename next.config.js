/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { 
    unoptimized: true 
  },
  // 使用空字符串作为assetPrefix以解决静态导出问题
  assetPrefix: '',
  // 禁用严格模式以确保与Capacitor兼容
  reactStrictMode: false,
  // 处理路径问题
  trailingSlash: true,
  // 禁用字体优化以避免静态导出问题
  optimizeFonts: false,
}

module.exports = nextConfig 