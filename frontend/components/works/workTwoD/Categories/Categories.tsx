// "use client";

// import React, { useRef, useEffect } from 'react';
// import { Typography } from '@mui/material';
// import { Container } from '@/components/common';
// // import { categoriesAnimation } from '@/animations/components/works/work/normalViewer'
// import s from '@/styles/works/work/normalViewer/Categories.module.css'

// type Props = {
//     post?: any
// }

// const Categories: React.FC<Props> = ({ post }) => {
//     const categoriesRef = useRef<HTMLDivElement>(null!);
//     const categories = post?.attributes?.categories;
//     const categoriesArray = categories.split(',');

//     // useEffect(() => {
//     //     const ctx = categoriesAnimation({
//     //         categories: categoriesRef.current.querySelector('#categories'),
//     //         categoriesContainer: categoriesRef.current.querySelector('#categories-container'),
//     //         categoriesRef
//     //     });
//     //     return () => ctx.revert();
//     // }, []);

//     return (
//         <div ref={categoriesRef}>
//             <Container id='categories-container'>
//                 <div className={s.categories} id='categories'>
//                     <Typography component='div' variant='p'>Category: </Typography>
//                     <div className={s.category_tags}>
//                         {categoriesArray.map((category: any, i: number) => (
//                             <Typography component='span' variant='tag' key={i}>{category}</Typography>
//                         ))}
//                     </div>
//                 </div>
//             </Container>
//         </div>
//     );
// };

// export default Categories;
