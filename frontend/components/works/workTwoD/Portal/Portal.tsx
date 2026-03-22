// "use client";

// import React, { useRef, useEffect } from 'react';
// import { Typography } from '@mui/material';
// // import { normalViewerPortalAnimation } from '@/animations/components/works/work/normalViewer'

// type Props = {
//     post?: any
// }

// const Portal: React.FC<Props> = ({ post }) => {
//     const titleRef = useRef<HTMLHeadingElement>(null!);

//     // useEffect(() => {
//     //     const ctx = normalViewerPortalAnimation({
//     //         title: titleRef.current,
//     //         titleRef
//     //     });
//     //     return () => ctx.revert();
//     // }, []);

//     return (
//         <Typography component='h1' variant='h2' ref={titleRef}>
//             {post?.attributes?.title}
//         </Typography>
//     );
// };

// export default Portal;
