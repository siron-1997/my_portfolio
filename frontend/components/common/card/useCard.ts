import cn from 'classnames';
import { useImageSize, useWindowSize } from '@/hooks';
import { BREAK_POINTS } from '@/constants/common';
import p from '@/styles/page.module.css';
import s from '@/styles/common/Card.module.css';

const useCard = (type: 'work' | 'home') => {
  const { pointWidth, pointHeight } = useImageSize({
    sm: { pointWidth: 320, pointHeight: 240 },
    md: { pointWidth: 360, pointHeight: 270 },
    lg: { pointWidth: 300, pointHeight: 225 },
    xl: { pointWidth: 380, pointHeight: 285 },
    xl2: { pointWidth: 420, pointHeight: 315 },
    xl3: { pointWidth: 520, pointHeight: 390 },
  });
  const { width } = useWindowSize();

  // "work" タイプの場合、または"home"タイプで幅が BREAK_POINTS.XS 未満または BREAK_POINTS.SM 以上の場合に適用
  const termsWorks =
    type === 'work' ||
    (type === 'home' && !(width && width >= BREAK_POINTS.XS && width < BREAK_POINTS.SM));
  // "home" タイプで幅が BREAK_POINTS.XS 以上かつ BREAK_POINTS.SM 未満の場合に適用
  const termsHome =
    type === 'home' && width && width >= BREAK_POINTS.XS && width < BREAK_POINTS.SM;

  const cardClassNames = cn({ [s.card]: termsWorks, [p.card]: termsHome }, 'card');
  const cardMediaClassNames = cn({ [s.card_media]: termsWorks });
  const txtClassNames = cn({
    [s.txt_container]: termsWorks,
    [p.card_txt_container]: termsHome,
  });

  return {
    pointWidth,
    pointHeight,
    termsWorks,
    cardClassNames,
    cardMediaClassNames,
    txtClassNames,
  };
};

export default useCard;
