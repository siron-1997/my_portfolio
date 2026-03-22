// "use client";

// import Image from 'next/image';
// import React, { useRef, useEffect } from 'react';
// import cn from 'classnames';
// import { Container } from '@/components/common';
// // import { imagesAnimation } from '@/animations/components/works/work/normalViewer'
// import s from '@/styles/works/work/normalViewer/Images.module.css'

// type CustomProps = {
//     post?: any
// }

// const Images: React.FC<CustomProps> = ({ post }) => {
//     const imagesRef = useRef<HTMLDivElement>(null!);
//     const classNames = cn('image_container', s.thumbnail, 'image-container');
//     const thumbnail = post?.attributes?.thumbnail?.data;

//     // useEffect(() => {
//     //     const ctx = imagesAnimation({
//     //         images: imagesRef.current.querySelectorAll('.image-container'),
//     //         imagesRef
//     //     });
//     //     return () => ctx.revert();
//     // }, []);

//     return (
//         <div ref={imagesRef}>
//             <Container>
//                 {thumbnail?.map((item: any, i: number) => (
//                     <div className={classNames} key={i}>
//                         <Image
//                             src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${item?.attributes?.url}`}
//                             alt={item?.attributes?.alternativeText}
//                             fill
//                             quality={100}
//                             placeholder='blur'
//                             blurDataURL={`${process.env.NEXT_PUBLIC_STRAPI_URL}${item?.attributes?.url}`}
//                         />
//                     </div>
//                 ))}
//             </Container>
//         </div>
//     );
// };

// export default Images;
