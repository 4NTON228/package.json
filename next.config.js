/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // <--- ЭТА СТРОКА КРИТИЧЕСКИ ВАЖНА ДЛЯ NETLIFY
  images: {
    unoptimized: true, // <--- ОТКЛЮЧАЕТ ОПТИМИЗАЦИЮ КАРТИНОК ДЛЯ СТАТИКИ
  },
}

module.exports = nextConfig
