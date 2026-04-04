import { Typography, ListItem } from '@mui/material';

/** Props の型定義 */
type Props = {
  /** title */
  title: string;
  /** description */
  description: string;
  /** index */
  index: number;
  /** className */
  className: string;
  /** style */
  style?: React.CSSProperties;
  /** onClick */
  onClick: React.MouseEventHandler<HTMLLIElement>;
};

const ControlItems = ({
  title,
  description,
  index,
  className,
  style,
  onClick,
}: Props) => {
  const customStyles = {
    fontSize: 15,
    lineHeight: 1.2,
    letterSpacing: 1,
    borderRadius: 10,
    cursor: 'pointer',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgb(0, 0, 0, 0.3)',
    padding: '2px 7px 3px 7px',
  };

  return (
    <ListItem className={className} style={style} onClick={onClick}>
      <Typography
        component="h5"
        variant="h5"
        sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 'auto' }}
      >
        <Typography component="span" sx={customStyles}>
          {index + 1}
        </Typography>
        {title}
      </Typography>
      <Typography component="p" variant="p" sx={{ fontSize: 13, mr: 'auto' }}>
        {description}
      </Typography>
    </ListItem>
  );
};

export default ControlItems;
