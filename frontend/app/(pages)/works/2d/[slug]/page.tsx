// import { redirect } from 'next/navigation';
// import cn from 'classnames';
// import { Categories, Description, Images, MainImage, Portal, Tags } from '@/components/works/workTwoD';
// import { Content } from '@/types/work';
// import { contentsData } from '@/constants/test/work';
// import s from '@/styles/works/work/index.module.css'

// export default function WorkPage({ params }: { params: { slug: string } }) {
//     const { slug } = params;

//     const content = contentsData.find((content: Content) => content.slug === slug);
//     const classNames = cn('root_container', s.normal_viewer);

//     // 存在しない slug の場合は、works にリダイレクト
//     if (!content) {
//         redirect('/works');
//     };

//     if (content.category.type === 'two') {
//         return (
//             <section className={classNames}>
//                 <NormalViewer content={content} />
//                 <MainImage content={content} />
//                 <div className={s.normal}>
//                     <Categories content={content} />
//                     <Tags content={content} />
//                 </div>
//                 <Description content={content} />
//                 <Images content={content} />
//             </section>
//         );
//     };
// };

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div>
      <h1>2D Work Page</h1>
      <p>Slug: {slug}</p>
    </div>
  );
}
