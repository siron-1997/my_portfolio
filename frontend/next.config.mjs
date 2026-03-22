/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sszpjlziqoogvouruaee.supabase.co',
        port: '',
        pathname: '/storage/v1/object/**',
      },
    ],
  },
  // three.js / R3F 系パッケージをサーバーバンドルから除外し、
  // Next.js 15 SSG 中の react-reconciler 起因のエラーを防ぐ
  serverExternalPackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/postprocessing',
  ],
};

export default nextConfig;
