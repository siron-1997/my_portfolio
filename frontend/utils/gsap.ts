/** Props の型定義 */
type Props = {
  /** element */
  element: HTMLElement;
  /** start */
  start?: 'top bottom' | string;
  /** end */
  end?: 'bottom top' | string;
  /** delay */
  delay?: number;
  /** markers */
  markers?: boolean;
  /** id */
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
