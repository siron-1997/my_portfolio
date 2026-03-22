type Props = {
  element: HTMLElement;
  start?: 'top bottom' | string;
  end?: 'bottom top' | string;
  delay?: number;
  markers?: boolean;
  id?: string;
};

const getScrollTriggerOption = ({
  element,
  start = 'top bottom',
  end = 'bottom top',
  delay,
  markers,
  id,
}: Props) => ({
  delay: delay,
  scrollTrigger: {
    trigger: element,
    markers: markers,
    start: start,
    end: end,
    id: id,
  },
});

export default getScrollTriggerOption;
