This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## ディレクトリ構成

ディレクトリ構成

frontend/
├── .next/ (Next.jsによって自動生成されるキャッシュやビルド出力)
│
├── animations/
│    ├── about.ts
│    ├── contact.ts
│    ├── works.ts
│    ├── work.ts
│    ├── workWorld.ts
│    ├── homeWorld.ts
│
├── app/
│   ├── api/
│   │   └── sendGrid/
│   │       └── route.ts
│   │
│   └── (pages)/
│       ├── about/
│       │   └── page.tsx
│       │
│       ├── contact/
│       │   └── page.tsx
│       │
│       └── works/
│           ├── [slug]/
│           │   └── page.tsx
│           │
│           └── page.tsx
│
├── components/
│   ├── about/
│   │   ├── index.ts
│   │   ├── Introduction.tsx
│   │   ├── ProfileImage.tsx
│   │   └── SkillList.tsx
│   │
│   ├── contact/
│   │   ├── ContactForm.tsx
│   │   ├── index.ts
│   │   ├── InputFields.tsx
│   │   └── ProgressStatus.tsx
│   │
│   ├── common/
│   │   ├── button/
│   │   │   ├── Button.tsx
│   │   │   ├── Close.tsx
│   │   │   ├── Hamburger.tsx
│   │   │   ├── index.ts
│   │   │   ├── ScrollToTop.tsx
│   │   │   └── Toggle.tsx
│   │   │
│   │   ├── loading/
│   │   │   ├── index.ts
│   │   │   ├── ModelViewerLoading.tsx
│   │   │   └── PageLoading.tsx
│   │   │
│   │   ├── Card.tsx
│   │   ├── Chip.tsx
│   │   ├── Container.tsx
│   │   ├── index.ts
│   │   ├── FilgerPress.tsx
│   │   ├── NextProgressBar.tsx
│   │   ├── NumberedCircled.tsx 
│   │   └── PageHeader.tsx
│   │
│   ├── world/
│   │   ├── home/
│   │   │   ├── modules/
│   │   │   │   ├── Cloud.tsx
│   │   │   │   ├── Door.tsx
│   │   │   │   ├── Fog.tsx
│   │   │   │   ├── Lightning.tsx
│   │   │   │   ├── Model.tsx
│   │   │   │   ├── Ocean.tsx
│   │   │   │   ├── Rain.tsx
│   │   │   │   ├── RigCamera.tsx
│   │   │   │   ├── Star.tsx
│   │   │   │   ├── SunLight.tsx
│   │   │   │   └── WeatherEnvironment.tsx
│   │   │   │
│   │   │   ├── HomeWorld.tsx
│   │   │   ├── Experience.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── works/
│   │        ├── modules/
│   │        │   ├── index.ts
│   │        │   ├── CustomCamera.tsx
│   │        │   ├── CustomOrbitControls.tsx
│   │        │   └── CustomModel.tsx
│   │        │
│   │        ├── Experience.tsx
│   │        ├── index.ts
│   │        └── WorkWorld.tsx
│   │
│   ├── layout/
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── index.ts
│   │   ├── Meta.tsx
│   │   └── Navigation.tsx
│   │
│   └── works/
│       ├── CategoryFilter.tsx
│       ├── Contents.tsx
│       ├── index.ts
│       └── Portal.tsx
│
├── configs/
│   └── theme.ts
│
├── context/
│   ├── ContactFormContext.tsx
│   ├── index.ts
│   ├── ModelViewerContext.tsx
│   ├── PageHeaderContext.tsx
│   ├── ThemeProviderWrapper.tsx
│   └── WorkContext.tsx
│
├── constants/
│   ├── about.ts
│   ├── animation-configs.ts
│   ├── break-points-camera.ts
│   ├── break-points.ts
│   ├── colors.ts
│   ├── contact.ts
│   ├── environment-colors.ts
│   ├── mountain-materials.ts
│   ├── site-map.ts
│   ├── sns-list.ts
│   ├── works-world.ts
│   └── works.ts
│
├── types/
│   ├── about.ts
│   ├── animationConfigs.ts
│   ├── breakPointsCamera.ts
│   ├── breakPoints.ts
│   ├── colors.ts
│   ├── contact.ts
│   ├── environmentColor.ts
│   ├── mountainMaterials.ts
│   ├── siteMap.ts
│   ├── snsList.ts
│   ├── worksWorld.ts
│   └── works.ts
│
├── node_modules/ (...)
│
├── public/
│   ├── doraco/ (...)
│   ├── images/ (...)
│   ├── models/ (...)
│   └── icons/ (...)
│
├── styles/
│   ├── about/
│   │   ├── Introduction.module.css
│   │   ├── ProfileImage.module.css
│   │   ├── SkillList.module.css
│   │   └── about.module.css
│   │
│   ├── contact/
│   │   ├── ContactForm.module.css
│   │   ├── InputFields.module.css
│   │   └── ProgressStatus.module.css
│   │
│   ├── common/
│   │   ├── button/
│   │   │   ├── Button.module.css
│   │   │   ├── Close.module.css
│   │   │   ├── ScrollToTop.module.css
│   │   │   └── Toggle.module.css
│   │   │
│   │   ├── loading/
│   │   │   ├── ModelViewer.module.css
│   │   │   └── PageLoading.module.css
│   │   │
│   │   ├── Card.module.css
│   │   ├── Chip.module.css
│   │   ├── Container.module.css
│   │   ├── FingerPress.module.css
│   │   ├── NextProgressBar.module.css
│   │   ├── NumberedCircled.module.css
│   │   └── PageHeader.module.css
│   │
│   ├── layout/
│   │   ├── Footer.module.css
│   │   ├── Header.module.css
│   │   └── Navigation.module.css
│   │
│   ├── works/
│   │   ├── CategoryFilter.module.css
│   │   ├── Contents.module.css
│   │   └── Portal.module.css
│   │
│   └── globals.css
│
├── hooks/
│   ├── index.ts
│   ├── useIconSize.ts
│   ├── useImageSize.ts
│   ├── useIsIos.ts
│   ├── useScrollDirection.ts
│   └── useWindowSize.ts
│
├── utils/
│   ├── world/
│   │   ├── getBackgroundColor.ts
│   │   ├── getCameraParams.ts
│   │   ├── getEnvironmentColor.ts
│   │   ├── getEnvMapIntensity.ts
│   │   ├── getFogColor.ts
│   │   ├── getLightningOccurrence.ts
│   │   ├── getRainState.ts
│   │   ├── getSunColor.ts
│   │   ├── getSunIntensity.ts
│   │   ├── index.ts
│   │   ├── setCameraPositions.ts
│   │   └── setCloudsVisible.ts
│   │
│   ├── disableScroll.ts
│   ├── gsap.ts
│   ├── index.ts
│   └── truncateString.ts
│
├── .env
├── .env.development
├── .eslintrc.json
├── .gitignore
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── REDME.md
└── tcconfig.json


// eslint-disable-next-line react-hooks/exhaustive-deps