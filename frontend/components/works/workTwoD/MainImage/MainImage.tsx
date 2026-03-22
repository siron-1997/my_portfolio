// "use client";

// import Image from 'next/image';
// import React, { useRef, useEffect } from 'react';
// import cn from 'classnames';
// import { Container } from '@/components/common';
// import { mainImageAnimation } from '@/animations/components/works/work/normalViewer'
// import s from '@/styles/works/work/normalViewer/MainImage.module.css'

// type Props = {
//     post?: any
// }

// const MainImage: React.FC<Props> = ({ post }) => {
//     const mainImageRef = useRef<HTMLDivElement>(null!);
//     const classNames = cn('image_container', s.main_image, 'main-image');

//     useEffect(() => {
//         const ctx = mainImageAnimation({
//             mainImage: mainImageRef.current.querySelector('.main-image'),
//             mainImageRef
//         });
//         return () => ctx.revert();
//     }, []);

//     return (
//         <div ref={mainImageRef}>
//             <Container>
//                 <div className={classNames}>
//                     <Image
//                         src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${post?.attributes?.main?.data?.attributes?.url}`}
//                         alt={post?.attributes?.main?.data?.attributes?.alternativeText}
//                         fill
//                         quality={100}
//                         placeholder='blur'
//                         blurDataURL={`${process.env.NEXT_PUBLIC_STRAPI_URL}${post?.attributes?.main?.data?.attributes?.url}`}
//                     />
//                 </div>
//             </Container>
//         </div>
//     );
// };

// export default MainImage;
