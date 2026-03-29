import { TimePoint } from '@/types/world';

// ==========================================
// Inquiry API Types
// =========================================
/** お問い合わせフォーム API (/api/sendGridEmail) のリクエストボディ。 */
export type InquiryPayload = {
  name: string;
  email: string;
  message: string;
};

// ==========================================
// Weather API Types
// ==========================================
/** Open Weather API から返される天気情報の項目 */
export type WeatherItem = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

/** Open Wather API から返される現在の天候データのレスポンス全体。 */
export type OpenWeatherCurrentData = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: WeatherItem[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  rain?: {
    '1h': number;
  };
  snow?: {
    '1h': number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

/** アプリケーションの API (/api/getCurrentWeather) のレスポンス。 */
export type GetCurrentWeatherAPIResponse = {
  success: boolean;
  message: string;
  data: {
    timePoint: TimePoint;
    data: OpenWeatherCurrentData;
  };
};

// ==========================================
// Works API Types (Supabase)
// ==========================================
/** 作品一覧取得 API のパラメータ (クエリなど)。 */
export type GetWorksParams = {
  limit?: number;
};

/** 作品一覧で表示するサマリーデータ */
export type WorkSummary = {
  id: number;
  title: string;
  description: string;
  slug: string;
  created: string;
  created_at: string;
  image_url: string;
  alternative_text: string;
  category_key: string;
  category_name: string;
};

/** 作品カテゴリのデータ */
export type WorkCategory = {
  id: number;
  key: string;
  name: string;
};

/** 作品詳細ページの操作パネルのコントロール */
export type WorkControl = {
  title: string;
  description: string;
  animation_name: string;
  is_loop: boolean;
};

/** 作品詳細ページ用のデータ */
export type WorkDetail = {
  id: number;
  key: string;
  title: string;
  description: string;
  slug: string;
  created_at: string;
  introduction_title: string;
  introduction_description: string;
  controls_title: string;
  controls_description: string;
  controls: WorkControl[];
};
