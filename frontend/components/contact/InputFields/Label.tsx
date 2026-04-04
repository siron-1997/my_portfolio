import s from '@/styles/contact/InputFields.module.css';

/** Props の型定義 */
type Props = {
  /** title */
  title: string;
  /** id */
  id: string;
  /** isFinishedFirstStep */
  isFinishedFirstStep: boolean;
};

const Label = ({ title, id, isFinishedFirstStep }: Props) => {
  return (
    <label htmlFor={id} className={s.label}>
      {!isFinishedFirstStep && <span className={s.required}>※ 必須</span>}
      <span className={s.label_name}>{title}</span>
    </label>
  );
};

export default Label;
