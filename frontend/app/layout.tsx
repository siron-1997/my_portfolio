import Script from 'next/script';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Footer, Header } from '@/components/layout';
import { ThemeProviderWrapper } from '@/contexts';
import { ScrollToTop } from '@/components/common';
import { APP_THEME_COLORS, COLOR_PALETTE } from '@/constants/colors';
import localFont from 'next/font/local';
import '@/styles/globals.css';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const notoSansJP = localFont({
  src: [
    { path: '../public/fonts/Noto_Sans_JP/NotoSansJP-Black.woff2', weight: '900' },
    { path: '../public/fonts/Noto_Sans_JP/NotoSansJP-Bold.woff2', weight: '700' },
    { path: '../public/fonts/Noto_Sans_JP/NotoSansJP-ExtraBold.woff2', weight: '800' },
    { path: '../public/fonts/Noto_Sans_JP/NotoSansJP-Light.woff2', weight: '300' },
    { path: '../public/fonts/Noto_Sans_JP/NotoSansJP-Medium.woff2', weight: '500' },
    { path: '../public/fonts/Noto_Sans_JP/NotoSansJP-Regular.woff2', weight: '400' },
    { path: '../public/fonts/Noto_Sans_JP/NotoSansJP-Thin.woff2', weight: '100' },
  ],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

const roboto = localFont({
  src: [
    { path: '../public/fonts/Roboto/Roboto-Black.woff2', weight: '900' },
    { path: '../public/fonts/Roboto/Roboto-Bold.woff2', weight: '700' },
    { path: '../public/fonts/Roboto/Roboto-ExtraBold.woff2', weight: '800' },
    { path: '../public/fonts/Roboto/Roboto-ExtraLight.woff2', weight: '200' },
    { path: '../public/fonts/Roboto/Roboto-Light.woff2', weight: '300' },
    { path: '../public/fonts/Roboto/Roboto-Medium.woff2', weight: '500' },
    { path: '../public/fonts/Roboto/Roboto-Regular.woff2', weight: '400' },
    { path: '../public/fonts/Roboto/Roboto-SemiBold.woff2', weight: '600' },
    { path: '../public/fonts/Roboto/Roboto-Thin.woff2', weight: '100' },
  ],
  variable: '--font-roboto',
  display: 'swap',
});

const myName = 'Junpei Oue';
const xUserName = '@Jsiron2029';
const imagePath = 'https://junpei-oue.vercel.app/og-image.jpg';

export const metadata: Metadata = {
  title: {
    default: myName,
    template: `${myName} | %s`,
  },
  keywords: 'Siron-1997,portfolio',
  openGraph: {
    title: myName,
    url: 'https://junpei-oue.vercel.app',
    siteName: myName,
    images: [
      {
        url: imagePath,
        width: 1200,
        height: 630,
        alt: 'siron',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: xUserName,
    creator: xUserName,
    title: myName,
    images: [imagePath],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

  return (
    <html suppressHydrationWarning={true} lang="ja">
      <head>
        {/** Favicon 設定 */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/images/favicons/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/images/favicons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content={COLOR_PALETTE.faviconTileColor} />
        <meta name="theme-color" content={COLOR_PALETTE.white} />
        {googleAnalyticsId && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              onLoad={() => {
                window.dataLayer = window.dataLayer || [];
                window.gtag = (...args: unknown[]) => {
                  window.dataLayer.push(args);
                };
                window.gtag('js', new Date());
                window.gtag('config', googleAnalyticsId, {
                  page_path: window.location.pathname,
                });
              }}
            />
          </>
        )}
      </head>
      <body className={`${notoSansJP.className} ${roboto.className}`}>
        <NextTopLoader
          color={APP_THEME_COLORS.navigation}
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow={`0 0 10px ${APP_THEME_COLORS.navigation},0 0 5px ${APP_THEME_COLORS.navigation}`}
          zIndex={9999}
        />
        <Header />
        <ThemeProviderWrapper notoSansJP={notoSansJP} roboto={roboto}>
          <main>{children}</main>
        </ThemeProviderWrapper>
        <ScrollToTop isViewerActive={false} />
        <Footer />
      </body>
    </html>
  );
}
