import Image from 'next/image';
import Link from 'next/link';
import { Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import { APP_THEME_COLORS } from '@/constants/colors';
import useCard from './useCard';
import s from '@/styles/common/Card.module.css';

/** Props の型定義 */
type Props = {
  /** image */
  image?: string;
  /** link */
  link?: string;
  /** alt */
  alt?: string;
  /** title */
  title: string;
  /** description */
  description: string;
  /** categoryType */
  categoryType: string;
  /** type */
  type: 'work' | 'home';
};

const CustomCard = ({
  image = '',
  alt = '',
  link = '',
  title,
  description,
  categoryType,
  type,
}: Props) => {
  const {
    pointWidth,
    pointHeight,
    termsWorks,
    cardClassNames,
    cardMediaClassNames,
    txtClassNames,
  } = useCard(type);

  return (
    <div className="content">
      <Card
        className={cardClassNames}
        sx={{ bgcolor: APP_THEME_COLORS.bgColor.dark.sub }}
      >
        <CardMedia className={cardMediaClassNames}>
          <Link href={link}>
            <Image
              src={image}
              alt={alt}
              width={pointWidth}
              height={pointHeight}
              quality={100}
              placeholder="blur"
              blurDataURL={image}
            />
          </Link>
        </CardMedia>
        <CardContent className={txtClassNames}>
          <Link href={link}>
            <Typography component="h4" variant="h4">
              {title}
            </Typography>
            <Typography component="p" variant="p" className="card_paragraph">
              {description}
            </Typography>
          </Link>
        </CardContent>
        {termsWorks && (
          <CardActions className={s.tags}>
            <Typography variant="tag">{categoryType}</Typography>
          </CardActions>
        )}
      </Card>
    </div>
  );
};

export default CustomCard;
