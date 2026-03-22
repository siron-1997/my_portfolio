// import React, { useRef, useEffect } from 'react';
// import { Typography } from '@mui/material';
// import { Container } from '@/components/common';
// // import { tagsAnimation } from '@/animations/components/works/work/normalViewer'
// import s from '@/styles/works/work/normalViewer/Tags.module.css'

// type Props = {
//     post?: any
// }

// const Tags: React.FC<Props> = ({ post }) => {
//     const tagsRef = useRef<HTMLDivElement>(null!);
//     const skillTags = post?.attributes?.skillTags
//     const tags = skillTags.split(/,| /);

//     // useEffect(() => {
//     //     const ctx = tagsAnimation({
//     //         tags: tagsRef.current.querySelector('#tags'),
//     //         tagsContainer: tagsRef.current.querySelector('#tags-container'),
//     //         tagsRef
//     //     });
//     //     return () => ctx.revert();
//     // }, []);

//     return (
//         <div ref={tagsRef}>
//             <Container id='tags-container'>
//                 <div className={s.tags} id='tags'>
//                     <Typography component='div' variant='p'>Tags: </Typography>
//                     <div className={s.tags_skill}>
//                         {tags?.map((tag: any, i: number) => (
//                             <Typography component='span' variant='tag' key={i}>{tag}</Typography>
//                         ))}
//                     </div>
//                 </div>
//             </Container>
//         </div>
//     );
// };

// export default Tags;
