import Head from 'next/head';
import React from 'react';
import useMeta from './useMeta';

type Props = {
  title?: string;
  keywords?: string;
  description?: string;
  imagePath?: string;
  type?: string;
};

const Meta = ({
  title = 'Junpei Oue',
  keywords = 'Siron-1997,portfolio',
  description = 'web developer',
  imagePath,
  type: _type,
}: Props) => {
  const { xUserName } = useMeta();

  return (
    <Head>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>
      {/* SNS */}
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={imagePath} />
      {/*  */}
      <meta name="twitter:card" content={imagePath} />
      <meta name="twitter:site" content={xUserName} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:creator" content={xUserName} />
      <meta name="twitter:image:src" content={imagePath} />
      {/*  */}
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://junpei-oue.vercel.app" />
      <meta property="og:image" content={imagePath} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="Junpei Oue" />
    </Head>
  );
};

export default Meta;
