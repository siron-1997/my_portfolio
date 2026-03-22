'use client';

import { Typography } from '@mui/material';
import { Container } from '@/components/common';
import { ToggleButton } from '../ToggleButton';
import { FingerPress } from '../FingerPress';
import { WorkDetail } from '@/types/api';
import useIntroduction from './useIntroduction';

type Props = {
  content: WorkDetail;
};

const Introduction = ({ content }: Props) => {
  const { introductionRef, classNames } = useIntroduction();

  return (
    <div className={classNames} id="introduction" ref={introductionRef}>
      <Container style={{ position: 'relative', height: '100%' }}>
        <section>
          <Typography component="h2" variant="h2">
            {content.introduction_title}
          </Typography>
          <Typography component="p" variant="p" sx={{ maxWidth: 650 }}>
            {content.introduction_description}
          </Typography>
          <FingerPress />
          <ToggleButton />
        </section>
      </Container>
    </div>
  );
};

export default Introduction;
