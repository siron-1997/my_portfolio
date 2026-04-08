import { TimePoint } from '@/types/world';

/** Inquiry API Types */
/** お問い合わせフォーム API (/api/contact) のリクエストボディ。 */
export type InquiryPayload = {
  /** 送信者の氏名 */
  name: string;

  /** 返信先のメールアドレス */
  email: string;

  /** お問い合わせの本文 */
  message: string;
};

/** Weather API Types */
/** Open Weather API から返される天気情報の項目 */
export type WeatherItem = {
  /** Open Weather API の天気状態 ID */
  id: number;

  /** 天気の主分類（"Rain", "Snow", "Clear" 等） */
  main: string;

  /** 天気の詳細説明文 */
  description: string;

  /** 天気アイコンコード（API アイコン URL に使用） */
  icon: string;
};

/** Open Weather API から返される現在の天候データのレスポンス全体。 */
export type OpenWeatherCurrentData = {
  /** 観測地点の座標 */
  coord: {
    /** 観測地点の経度 */
    lon: number;

    /** 観測地点の緯度 */
    lat: number;
  };

  /** 天気状態の配列（複数該当する場合あり） */
  weather: WeatherItem[];

  /** 観測ステーション名 */
  base: string;

  /** 気温・気圧・湿度の計測値 */
  main: {
    /** 現在の気温（ケルビン） */
    temp: number;

    /** 体感気温（ケルビン） */
    feels_like: number;

    /** 最低気温（ケルビン） */
    temp_min: number;

    /** 最高気温（ケルビン） */
    temp_max: number;

    /** 大気圧（hPa） */
    pressure: number;

    /** 湿度（%） */
    humidity: number;

    /** 海面気圧（hPa、任意） */
    sea_level?: number;

    /** 地上気圧（hPa、任意） */
    grnd_level?: number;
  };

  /** 視程（メートル） */
  visibility: number;

  /** 風速・風向の計測値 */
  wind: {
    /** 風速（m/s） */
    speed: number;

    /** 風向（度、北=0） */
    deg: number;

    /** 突風速度（m/s、任意） */
    gust?: number;
  };

  /** 降雨量データ（任意） */
  rain?: {
    /** 直近 1 時間の降雨量（mm） */
    '1h': number;
  };

  /** 降雪量データ（任意） */
  snow?: {
    /** 直近 1 時間の降雪量（mm） */
    '1h': number;
  };

  /** 雲量データ */
  clouds: {
    /** 雲量（%） */
    all: number;
  };

  /** データ観測時刻（UNIX タイムスタンプ） */
  dt: number;

  /** 国・日照情報 */
  sys: {
    /** 内部システムタイプ番号 */
    type: number;

    /** 内部管理 ID */
    id: number;

    /** 国コード（例: "JP"） */
    country: string;

    /** 日の出時刻（UNIX タイムスタンプ） */
    sunrise: number;

    /** 日没時刻（UNIX タイムスタンプ） */
    sunset: number;
  };

  /** UTC からのオフセット秒数 */
  timezone: number;

  /** Open Weather API の都市 ID */
  id: number;

  /** 都市名 */
  name: string;

  /** API レスポンスステータスコード */
  cod: number;
};

/** アプリケーションの API (/api/getCurrentWeather) のレスポンス。 */
export type GetCurrentWeatherAPIResponse = {
  /** リクエスト成功フラグ */
  success: boolean;

  /** エラー時のメッセージ、成功時は空文字 */
  message: string;

  /** レスポンスのデータ本体 */
  data: {
    /** 現在時刻の時間帯区分 */
    timePoint: TimePoint;

    /** Open Weather API から取得した天気データ */
    data: OpenWeatherCurrentData;
  };
};

/** Works API Types (Supabase) */
/** 作品一覧取得 API のパラメータ (クエリなど)。 */
export type GetWorksParams = {
  /** 取得する作品数の上限（未指定時は全件） */
  limit?: number;
};

/** 作品一覧で表示するサマリーデータ */
export type WorkSummary = {
  /** 作品の DB 主キー */
  id: number;

  /** 作品のタイトル */
  title: string;

  /** 作品の概要テキスト */
  description: string;

  /** URL スラッグ（ルーティングに使用） */
  slug: string;

  /** 作品の公開日 */
  created: string;

  /** DB へのレコード作成日時 */
  created_at: string;

  /** サムネイル画像の URL */
  image_url: string;

  /** サムネイル画像の代替テキスト */
  alternative_text: string;

  /** カテゴリの識別キー */
  category_key: string;

  /** カテゴリの表示名 */
  category_name: string;
};

/** 作品カテゴリのデータ */
export type WorkCategory = {
  /** カテゴリの DB 主キー */
  id: number;

  /** カテゴリの識別キー */
  key: string;

  /** カテゴリの表示名 */
  name: string;
};

/** 作品詳細ページの操作パネルのコントロール */
export type WorkControl = {
  /** コントロールパネルの項目タイトル */
  title: string;

  /** コントロールの説明文 */
  description: string;

  /** 再生する GLTF アニメーション名 */
  animation_name: string;

  /** アニメーションをループ再生するかどうか */
  is_loop: boolean;
};

/** 作品詳細ページ用のデータ */
export type WorkDetail = {
  /** 作品の DB 主キー */
  id: number;

  /** 作品の識別キー */
  key: string;

  /** 作品のタイトル */
  title: string;

  /** 作品の概要テキスト */
  description: string;

  /** URL スラッグ */
  slug: string;

  /** DB レコード作成日時 */
  created_at: string;

  /** 紹介セクションのタイトル */
  introduction_title: string;

  /** 紹介セクションの本文 */
  introduction_description: string;

  /** 操作パネルセクションのタイトル */
  controls_title: string;

  /** 操作パネルセクションの説明文 */
  controls_description: string;

  /** 操作パネルの各コントロール項目 */
  controls: WorkControl[];
};
