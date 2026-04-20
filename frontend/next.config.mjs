/** @type {import('next').NextConfig} */
const nextConfig = {
  // R3F v9 + @react-three/postprocessing は React Strict Mode の二重 invoke と
  // forceContextLoss() の組み合わせで WebGL コンテキストが破壊されるため無効化する。
  // (development 専用の問題。production では Strict Mode は非適用のためエラーは発生しない)
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sszpjlziqoogvouruaee.supabase.co',
        port: '',
        pathname: '/storage/v1/object/**',
      },
    ],
    /** Next.js 16 以降で必須となる quality 設定。使用している全 quality 値を列挙する */
    qualities: [1, 75, 100],
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
