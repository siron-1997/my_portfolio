import { useEffect } from 'react';
import cn from 'classnames';
import { useContactFormContext } from '@/contexts';
import s from '@/styles/contact/Sending.module.css';

const useSending = () => {
  const { isSending } = useContactFormContext();
  const classNames = cn(s.sending, { [s.sending_visible]: !isSending });

  useEffect(() => {
    const html = document.getElementsByTagName('html')[0];
    const body = document.body;

    if (isSending) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      html.style.overflow = 'auto';
      body.style.overflow = 'auto';
    }

    return () => {
      html.style.overflow = 'auto';
      body.style.overflow = 'auto';
    };
  }, [isSending]);

  return { classNames };
};

export default useSending;
