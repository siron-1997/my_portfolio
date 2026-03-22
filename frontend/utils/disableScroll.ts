const disableScroll = (isLoading: boolean) => {
  const html: HTMLElement = document.getElementsByTagName('html')[0];
  const body: HTMLElement = document.body;

  // ローディング中はスクロールを禁止
  if (isLoading) {
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
  } else {
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
  }
  // クリーンアップ
  return () => {
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
  };
};

export default disableScroll;
