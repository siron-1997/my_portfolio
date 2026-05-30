import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import WorkCard from '@/components/works/WorkCard';

/**
 * WorkCard コンポーネントの Storybook 定義。
 * Figmaデザインに基づく、フルブリード画像 + テキストオーバーレイレイアウト。
 *
 * バリアント: デフォルト / ホバー（CSSホバーで制御）
 * ブレークポイント: XS（<768px）/ SM（<1024px）/ LG（<1280px）/ XL（<1536px）/ 2XL（<1920px）
 */
const meta = {
  title: 'Components/Works/WorkCard',
  component: WorkCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      options: {
        dark: { name: 'Dark', value: '#1D1730' },
        'dark-sub': { name: 'Dark Sub', value: '#2A2E3F' },
      },
    },
  },
  globals: {
    backgrounds: { value: 'dark' },
  },
  argTypes: {
    image: { control: 'text' },
    alt: { control: 'text' },
    link: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    categoryType: {
      control: 'select',
      options: ['Web Design', 'Application', '3D', 'Branding', 'Other'],
    },
  },
} satisfies Meta<typeof WorkCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** デフォルト引数（Symphonyプロジェクト想定） */
const defaultArgs = {
  image: 'https://picsum.photos/520/390?random=10',
  alt: 'Symphony - 気象情報APIと3D UIを連携したインタラクティブなWeb表現',
  link: '/works/symphony',
  title: 'Symphony',
  description:
    '気象情報APIと3D UIを連携し、環境とオブジェクトが調和するインタラクティブなWeb表現。Three.jsとGSAP...',
  categoryType: '3D',
} as const;

/**
 * デフォルト（Card XS相当）。
 * ベースサイズ 320×240px のデフォルト表示。
 */
export const Default: Story = {
  args: defaultArgs,
};

/**
 * Card XS: モバイル（〜768px未満）。
 * width: 320px / height: 240px
 */
export const CardXS: Story = {
  name: 'Card XS（〜768px）',
  args: defaultArgs,
  globals: { viewport: { value: 'mobile2' } },
};

/**
 * Card SM: スモール（768px〜1024px未満）。
 * width: 360px / height: 270px
 */
export const CardSM: Story = {
  name: 'Card SM（768px〜）',
  args: defaultArgs,
  globals: { viewport: { value: 'tablet' } },
};

/**
 * Card LG: ラージ（1024px〜1280px未満）。
 * width: 300px / height: 225px
 */
export const CardLG: Story = {
  name: 'Card LG（1024px〜）',
  args: defaultArgs,
  globals: { viewport: { value: 'desktop' } },
};

/**
 * Card XL: エクストララージ（1280px〜1536px未満）。
 * width: 380px / height: 285px
 */
export const CardXL: Story = {
  name: 'Card XL（1280px〜）',
  args: defaultArgs,
  globals: { viewport: { value: 'desktopXl' } },
};

/**
 * Card 2XL: 2エクストララージ（1536px〜1920px未満）。
 * width: 420px / height: 315px
 */
export const Card2XL: Story = {
  name: 'Card 2XL（1536px〜）',
  args: defaultArgs,
  globals: { viewport: { value: 'desktopXxl' } },
};

/**
 * Webデザインカテゴリの例。
 */
export const WebDesign: Story = {
  args: {
    image: 'https://picsum.photos/520/390?random=20',
    alt: 'Web Design project',
    link: '/works/web-design',
    title: 'Portfolio Website',
    description:
      'モダンなUIとアニメーションを組み合わせたポートフォリオサイト。',
    categoryType: 'Web Design',
  },
};

/**
 * 画像なしのフォールバック表示。
 * 画像が利用できない場合の表示確認用。
 */
export const WithoutImage: Story = {
  args: {
    image: '',
    alt: '',
    link: '/works/no-image',
    title: 'Project Without Image',
    description: '画像が設定されていない場合のフォールバック表示。',
    categoryType: 'Other',
  },
};
