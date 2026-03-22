import { OpenWeatherCurrentData } from '@/types/api';
import { TimePoint } from '@/types/world';
import { useWindowSize } from '@/hooks';
import { TIME_POINT_ENV_COLORS } from '@/constants/colors';

type Props = {
  currentWeatherData: OpenWeatherCurrentData | null;
  timePoint: TimePoint;
};

/**
 * HomeWorld の霧の色を管理するカスタムフック
 * @param currentWeatherData - 現在の天気APIデータ
 * @param timePoint - 時間帯
 */
const useFog = ({ currentWeatherData, timePoint }: Props) => {
  const { width } = useWindowSize();
  // 天気と時間帯に応じて霧の色を計算
  let fogColor = '';
  // 時間帯に応じた霧の色を設定
  switch (timePoint) {
    case 'evening':
      fogColor = TIME_POINT_ENV_COLORS.evening.fog;
      break;
    case 'night':
      fogColor = TIME_POINT_ENV_COLORS.night.fog;
      break;
    case 'lunch':
      fogColor = TIME_POINT_ENV_COLORS.lunch.fog;
      break;
    default:
      break;
  }
  // 湿度を取得（デフォルトは0）
  const humidity = currentWeatherData?.main?.humidity || 0;

  return { width, fogColor, humidity };
};

export default useFog;
