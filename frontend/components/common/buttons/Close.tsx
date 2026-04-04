import Image from 'next/image';
import cn from 'classnames';

import { useIconSize } from '@/hooks';
import s from '@/styles/common/button/Close.module.css';

/**
 * Close コンポーネントの Props。
 * モーダルやドロワーを閉じる際に使用するアイコンボタン。
 */
type Props = {
  /** 外部から追加するクラス名 */
  className?: string;

  /** 閉じるボタンクリック時のコールバック */
  onClose: () => void;
};

const Close = ({ className, onClose }: Props) => {
  const iconSize = useIconSize(35, 40, 50);
  const rootClassNames = cn(className, s.close);

  return (
    <div className={rootClassNames} onClick={onClose}>
      <Image
        src="/icons/close.svg"
        alt="close"
        width={iconSize}
        height={iconSize}
        quality={1}
        priority={true}
      />
    </div>
  );
};

export default Close;
