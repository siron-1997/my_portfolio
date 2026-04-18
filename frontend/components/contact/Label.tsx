import React, { JSX } from 'react';

import s from '@/styles/contact.module.css';

type Props = {
  /** ラベルのタイトル */
  title: string;

  /** ラベル要素識別 id */
  id: string;

  /** 確認ステップかどうか */
  isConfirmStep: boolean;
};

const Label = React.memo(({ title, id, isConfirmStep }: Props): JSX.Element => {
  return (
    <label htmlFor={id} className={s.label}>
      {/** 必須フィールドの表示 (確認ステップでない場合のみ表示) */}
      {!isConfirmStep && <span className={s.required}>※ 必須</span>}
      <span className={s.label_name}>{title}</span>
    </label>
  );
});

Label.displayName = 'Label';

export default Label;
