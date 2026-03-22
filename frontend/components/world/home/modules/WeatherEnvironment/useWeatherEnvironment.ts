import { useMemo } from 'react';
import { TimePoint } from '@/types/world';
import { TIME_POINT_ENV_COLORS } from '@/constants/colors';

type Props = {
  timePoint: TimePoint;
};

/**
 * HomeWorld の環境プリセットを管理するカスタムフック
 * @param timePoint - 時間帯
 */
const useWeatherEnvironment = ({ timePoint }: Props) => {
  // 時間帯に応じて環境プリセットを計算
  const preset = useMemo(() => {
    let environmentColor = '';
    // 時間帯に応じた環境色を取得
    switch (timePoint) {
      case 'evening':
        environmentColor = TIME_POINT_ENV_COLORS.evening.environment;
        break;
      case 'night':
        environmentColor = TIME_POINT_ENV_COLORS.night.environment;
        break;
      case 'lunch':
        environmentColor = TIME_POINT_ENV_COLORS.lunch.environment;
        break;
      default:
        break;
    }
    return environmentColor;
  }, [timePoint]);

  return { preset };
};

export default useWeatherEnvironment;
