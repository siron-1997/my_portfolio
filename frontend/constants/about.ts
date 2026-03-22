import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';
import { SectionHeader, Skills, CareerHistory } from '@/types/common';

const path = '/icons/';
const svg = '.svg';
const webp = '.webp';

export const INTRODUCTION: SectionHeader = {
  title: 'Profile',
  description:
    '1997年生まれ大阪出身。現在は3DCGおよびwebフロントエンド開発をメインに活動をしています。\n' +
    '幼少期から物を作ることが好きで芸術、デザイン、インターネット、デジタル技術、航空機、自然に興味関心があり、個人の活動ではコンセプトRC飛行機や気象情報を用いた作品を実験的に制作しています。\n' +
    '2022年に京都精華大学を卒業し、学生時代は専攻していた芸術学部造形学科で人体をモチーフにした塑像をはじめ、ブロンズ鋳造や金属、彫刻、木彫、石彫など素材加工の基礎を学び、観察力や想像力を働かせ作品を表現する取組を行いました。\n' +
    'また学外では休学中に東京のベンチャー企業でweb制作およびデスクトップアプリ開発、2次元図面からの3次元モデル作成を担当させていただきました。\n' +
    'これからの展望としては気象情報と三次元的形状およびAPI技術などを用いた作品制作、webサービスやデスクトップアプリ開発およびUI・UXデザインの設計をメインに活動をしていきたいと考えています。\n',
};

export const SKILLS: Skills[] = [
  {
    title: 'Languages & Frameworks',
    skills: [
      {
        image: path + 'html5_48x48' + svg,
        alt: 'HTML5',
        name: 'HTML5',
        year: '5 years',
      },
      {
        image: path + 'css3_48x48' + svg,
        alt: 'CSS3',
        name: 'CSS3',
        year: '5 years',
      },
      {
        image: path + 'javascript_48x48' + svg,
        alt: 'JavaScript',
        name: 'JavaScript',
        year: '4 years',
      },
      {
        image: path + 'react' + svg,
        alt: 'React',
        name: 'React',
        year: '3 years',
      },
      {
        image: path + 'next_js_100x100' + svg,
        alt: 'Next.js',
        name: 'Next.js',
        year: '3 years',
      },
      {
        image: path + 'three_js' + webp,
        alt: 'Three.js',
        name: 'Three.js',
        year: '2 ~ 3 years',
      },
      {
        image: path + 'node_js_48x48' + svg,
        alt: 'Node.js',
        name: 'Node.js',
        year: '3 months',
      },
      {
        image: path + 'python_256x256' + svg,
        alt: 'Python',
        name: 'Python',
        year: '2 years',
      },
      {
        image: path + 'fastapi_256x256' + svg,
        alt: 'FastAPI',
        name: 'FastAPI',
        year: '1 ～ 2 years',
      },
      {
        image: path + 'sql_256x256' + svg,
        alt: 'SQL',
        name: 'SQL',
        year: '1 year',
      },
    ],
  },
  {
    title: 'Development Tools',
    skills: [
      {
        image: path + 'visual_studio_code_48x48' + svg,
        alt: 'VSCode',
        name: 'VSCode',
        year: '5 years',
      },
      {
        image: path + 'github_48x48' + svg,
        alt: 'GitHub',
        name: 'GitHub',
        year: '4 years',
      },
      {
        image: path + 'git_48x48' + svg,
        alt: 'Git',
        name: 'Git',
        year: '4 years',
      },
      {
        image: path + 'docker_256x256' + svg,
        alt: 'Docker',
        name: 'Docker',
        year: '2 years',
      },
      {
        image: path + 'ubuntu_256x256' + svg,
        alt: 'Ubuntu (Linux)',
        name: 'Ubuntu (Linux)',
        year: '2 years',
      },
      {
        image: path + 'blender_48x48' + svg,
        alt: 'Blender',
        name: 'Blender',
        year: '1 year',
      },
      {
        image: path + 'autodesk_fusion360' + svg,
        alt: 'Fusion360',
        name: 'Fusion360',
        year: '4 years',
      },
    ],
  },
];

export const CAREER_HISTORIES: CareerHistory[] = [
  {
    year: '2016年',
    title: '京都精華大学 芸術学部 造形学科 立体専攻 入学',
    description:
      '大学では彫刻やデッサン、素材と加工法の知識について学びました。\nまた、在学中に独学で3D技術（3DCAD、3Dプリンター）やプログラミングを学び、ドローンやWebサイトの制作にも取り組みました。',
    iconType: 'school',
    color: 'primary',
  },
  {
    year: '2021年',
    title: '株式会社グーテンベルク インターン勤務',
    description:
      'X（旧Twitter）でドローン制作に関する発信を行っていたことがきっかけで、3Dプリンターの開発・製造を手がける東京のモノづくりベンチャー企業へインターンとして参画。\n約2年間、3Dデータの作成・修正やWebアプリケーションの開発を担当しました。',
    iconType: 'work',
    color: 'secondary',
  },
  {
    year: '2023年\n～\n現在',
    title: 'ラーニングギフト株式会社 入社',
    description:
      'フルスタックとして、クライアントのBIツール（タスク・進捗管理）開発を一貫して担当。Pythonを主言語に、Snowflake（データウェアハウス）、FastAPI（API/バックエンド）、Streamlit（フロントエンド）を活用し、開発・テストからAWS EC2へのデプロイまで対応しました。',
    iconType: 'work',
    color: 'secondary',
  },
];
