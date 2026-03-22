import { useRef, useEffect } from 'react';
import { useContactFormContext } from '@/contexts';
import { progressStatusAnimation } from '@/animations/contact';

type UseProgressStatus = {
  progressStatusRef: React.RefObject<HTMLDivElement>;
  sendMessage: string;
};

const useProgressStatus = (): UseProgressStatus => {
  const progressStatusRef = useRef<HTMLDivElement>(null!);
  const { isSended } = useContactFormContext();

  let sendMessage = '';

  if (typeof isSended !== 'boolean') {
    sendMessage = '送信';
  } else {
    sendMessage = isSended ? '送信完了' : '送信失敗';
  }

  useEffect(() => {
    const ctx = progressStatusAnimation({
      title: progressStatusRef.current.querySelector('h1') as HTMLHeadingElement,
      progressBar: progressStatusRef.current.querySelector('div') as HTMLDivElement,
      progressStatusRef,
    });
    return () => ctx.revert();
  }, []);

  return { progressStatusRef, sendMessage };
};

export default useProgressStatus;
