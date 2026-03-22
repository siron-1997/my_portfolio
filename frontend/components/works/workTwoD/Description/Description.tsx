// "use client";

// import React, { useRef, useEffect } from 'react';
// import { Typography } from '@mui/material';
// import { Container } from '@/components/common';
// // import { descriptionAnimation } from '@/animations/components/works/work/normalViewer'
// import { colors } from '@/constants/colors';
// import s from '@/styles/works/work/normalViewer/Description.module.css'

// type Props = {
//     post?: any
// }

// const Description: React.FC<Props> = ({ post }) => {
//     const descriptionrRef = useRef<HTMLDivElement>(null!);
//     const url = post?.attributes?.url;
//     const description = post?.attributes?.description;

//     // useEffect(() => {
//     //     const ctx = descriptionAnimation({
//     //         description: descriptionrRef.current.querySelector('#description'),
//     //         descriptionrRef
//     //     });
//     //     return () => ctx.revert();
//     // }, []);

//     return (
//         <div ref={descriptionrRef}>
//             <Container>
//                 <div className={s.description} id='description'>
//                     {url !== null && (
//                         <Typography component='p' variant='p' className={s.link_text}>
//                             <span>Link:</span>
//                             <a
//                                 href={url}
//                                 className={s.link}
//                                 style={{ color: colors.navigation, opacity: 1 }}
//                             >
//                                 {url}
//                             </a>
//                         </Typography>
//                     )}
//                     <Typography component='p' variant='p'>{description}</Typography>
//                 </div>
//             </Container>
//         </div>
//     );
// };

// export default Description;
