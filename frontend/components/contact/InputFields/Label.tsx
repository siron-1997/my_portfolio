import s from '@/styles/contact/InputFields.module.css';

type Props = {
  title: string;
  id: string;
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
