# Home 3D ワールド 仕様書

## 1. 概要

Home ページに配置された 3D インタラクティブシーン。
ユーザーの現在地（Geolocation API）から取得した**リアルタイムの天気情報**を元に、
シーンの外観（天気・時間帯・雨・雲・星・照明）が動的に変化する。

スクロール連動でカメラが前進し、扉を通過して屋内に入るアニメーションを提供する。

---

## 2. コンポーネント構造

```
HomeClient（'use client'）
└── HomeProvider（Context: isLoading / portalRef）
    └── World（React.memo）
        ├── LevaPanel（createPortal → document.body）
        ├── Canvas（@react-three/fiber）
        │   ├── Perf（開発環境のみ）
        │   └── Suspense
        │       └── Experience（React.memo）
        │           ├── WeatherEnvironment
        │           ├── SunLight
        │           ├── Clouds
        │           ├── Star
        │           ├── Fog
        │           ├── Ocean
        │           ├── Lightning
        │           ├── Model（山・地面）
        │           ├── Door
        │           ├── RigCamera
        │           └── BakeShadows
        └── Rain（isCanvasReady が true になってからマウント）
```

> **Rain が Canvas 外にある理由**
> 雨は `<canvas>` 要素（2D API）で描画する DOM レイヤーであり、
> Three.js の WebGL Canvas とは別に重ねて表示する。
> また Leva の `useControls` 制御グループが Rain より先に登録されると
> パネルの順序が崩れるため、Canvas の `onCreated` 後にマウントする。

---

## 3. 状態管理

| 状態 | 保持先 | 型 | 初期値 | 説明 |
|---|---|---|---|---|
| `isLoading` | `HomeProvider` (Context) | `boolean` | `true` | ページ全体のローディング状態。Canvas 準備完了で `false` |
| `isCanvasReady` | `HomeClient` | `boolean` | `false` | Canvas `onCreated` で `true` になる |
| `currentWeatherData` | `World` | `OpenWeatherCurrentData \| null` | `null` | OpenWeather API の生レスポンス |
| `effectiveWeatherData` | `World` | `OpenWeatherCurrentData \| null` | `null` | Leva デバッグ上書き後のデータ（本番では常に `currentWeatherData` と同値） |
| `timePoint` | `World` | `TimePoint` | `'night'` | 時間帯分類（API レスポンスから算出） |
| `isInsideRoom` | `World` | `boolean` | `false` | ドアを通過して屋内に入ったかどうか |
| `hasWeatherFetched` | `World` | `boolean` | `false` | 天気 API の呼び出し完了フラグ（成功/失敗問わず） |

---

## 4. データフロー

詳細なシーケンス図は [home-world-flow.md](./home-world-flow.md) を参照。

```
useGeolocation(DEFAULT_COORDINATES)
  → isPermissionHandled = true になったら
    → POST /api/getCurrentWeather { latitude, longitude }
      → setCurrentWeatherData(data)
      → setTimePoint(data.timePoint)
      → [finally] setHasWeatherFetched(true)
  → setInterval(fetchCurrentWeatherData, 1時間)
```

- 位置情報が**拒否・非対応**の場合は `DEFAULT_COORDINATES`（東京駅付近）をフォールバックとして使用
- 天気 API が失敗した場合は `currentWeatherData = null` のまま（各モジュールはデフォルト値で動作）
- 天気は**1時間ごと**に自動再取得する

---

## 5. 天気システム

### 5.1 TimePoint（時間帯）

API レスポンスのタイムゾーン情報からサーバーサイドで算出し、レスポンスに含める。

| 値 | 帯域（現地時刻） |
|---|---|
| `'morning'` | 日の出〜正午前 |
| `'lunch'` | 正午〜日の入り前 |
| `'evening'` | 日の入り〜夜前 |
| `'night'` | 夜〜翌日の日の出前 |

TimePoint はシーン全体の**背景色・環境色・照明強度・星の透明度**に影響する。

### 5.2 WeatherCategory（天気カテゴリ）

OpenWeather の `weather[].description` を3種類に分類する（`getWeatherCategory` ユーティリティ）。

| カテゴリ | 定数 | 対象天気 |
|---|---|---|
| 晴れ | `WEATHER_CATEGORY_CLEAR_SKY` | clear sky, few clouds（11-25%）|
| 薄い雲 | `WEATHER_CATEGORY_THIN_CLOUD` | scattered clouds（25-50%）|
| 厚い雲 | `WEATHER_CATEGORY_THICK_CLOUD` | broken clouds（51-84%）, overcast clouds（85-100%）|
| 未対応 | `null` | snow 等（保留）|

Rain は `weather[].rain['1h']`（1時間降雨量 mm）を直接参照するため WeatherCategory には属さない。

---

## 6. 各モジュール仕様

### 6.1 WeatherEnvironment

- `@react-three/drei` の `<Environment background>` を使用
- 200×200×200 の BoxGeometry（背面レンダリング）に `BackSide` で描画
- `TIME_POINT_ENV_COLORS[timePoint].environment` の色を `opacity: 0.2` で重ねる
- Canvas の `style.background` も同テーブルの `.background` 色で設定（Canvas の clearColor）

### 6.2 SunLight

- `DirectionalLight` + PCFShadowMap によるシャドウ付きの太陽光
- 強度（intensity）は **WeatherCategory × TimePoint** の組み合わせで変動する

| WeatherCategory | ベース強度定数 |
|---|---|
| `clear sky` | `HOME_WORLD_SUN_LIGHT_INTENSITY_BASE_CLEAR_SKY` |
| `few clouds` | `HOME_WORLD_SUN_LIGHT_INTENSITY_BASE_FEW_CLOUDS` |
| `scattered clouds` | `HOME_WORLD_SUN_LIGHT_INTENSITY_BASE_SCATTERED_CLOUDS` |
| `broken clouds` | `HOME_WORLD_SUN_LIGHT_INTENSITY_BASE_BROKEN_CLOUDS` |
| 厚い雲全般 | `HOME_WORLD_SUN_LIGHT_INTENSITY_BASE_THICK_CLOUD` |

TimePoint ごとのオフセット（`lunch` は +、`night` は -）を加算して最終値を決定する。

### 6.3 Clouds

- **薄雲**（ThinCloud）と**厚雲**（ThickCloud）の2種類を独立して制御
- テクスチャーは `PUBLIC_PATH/images/` から読み込み
- 表示判定：`WeatherCategory` が `thin/thick` に合致するか
- 透明度：`clouds.all`（雲量 %）を `OPACITY_DIVISOR` 定数で割って算出
- 環境マップ強度：`getEnvMapIntensity(weather, timePoint, ENV_MAP_MODEL_TYPE_CLOUD)` で算出
- iOS は環境マップ強度オフセット（`HOME_WORLD_THIN_CLOUD_ENV_INTENSITY_MOBILE_OFFSET`）を適用

### 6.4 Star

- Three.js の `Points` ジオメトリで描画
- iOS の場合は `opacity = (100 - cloudAll) / 100` で雲量に応じてフェード
- 非 iOS の場合：
  - `night`: `opacity = max(0, 1 - cloudAll / 500)`（雲量500%相当で完全不透明）
  - `evening`: `opacity = 0.4`（固定）
  - `lunch`: `visible = false`（完全非表示）

### 6.5 Rain

- Three.js とは**独立した HTML Canvas（2D）** で描画
- Canvas の `position: absolute` で WebGL Canvas の上に重ねる
- **降雨量の計算**：`rain['1h'] × （幅に応じた係数）`
  - モバイル（`< BREAK_POINTS.XS`）: 係数 180
  - デスクトップ: 係数 250
- `isInsideRoom = true` のとき本番環境では雨を非表示にする（屋内演出）

### 6.6 RigCamera

- `Group` をカメラリグコンテナとして配置し、`gsap.timeline` + `ScrollTrigger` でスクロール連動
- **2つのアニメーションタイムライン**を同時に制御：
  1. **カメラ位置アニメーション** - Portal セクション要素を `trigger` に、`scrub: 0.7`
  2. **ドア開閉アニメーション** - `doorAnimStart%` 〜 `doorAnimEnd%` の範囲
- ブレイクポイント別のカメラ設定（`HOME_WORLD_RIG_CAMERA_POSITIONS`）

| ブレイクポイント | 適用設定キー |
|---|---|
| `>= 2XL` | `xxl` |
| `>= XL` | `xl` |
| `>= LG` | `lg` |
| `>= SM` | `sm` |
| `>= XS` | `xs` |
| `< XS`（モバイル）| `mobile` |

- ドア回転角が `doorHideRainThresholdDeg` を超えたとき `onInsideRoomChange(true)` を呼び出す
- `CameraShake` で微細なカメラ揺れを追加

### 6.7 Model

- `useGLTF` で山モデル（`HOME_WORLD_MOUNTAIN_MODEL_PATH`）を読み込み
- 環境マップ強度を `getEnvMapIntensity(weather, timePoint, ENV_MAP_MODEL_TYPE_MODEL)` で算出
- 各メッシュに `castShadow` / `receiveShadow` を設定

### 6.8 Door

- 山モデルのシーングラフ内の `HOME_WORLD_SCENE_NAME_DOOR_CONTAINER` ノードを参照
- RigCamera の `doorRef` を通じて回転を制御される

### 6.9 Fog

- Three.js の `FogExp2` を使用
- `TIME_POINT_ENV_COLORS[timePoint].fog` の色で霧の色を設定

### 6.10 Ocean

- 水面メッシュ（詳細は実装参照）

### 6.11 Lightning

- 厚雲天気時に発光エフェクトを表示

---

## 7. 環境マップ強度（getEnvMapIntensity）

モデルと雲の `envMapIntensity` を **WeatherCategory × TimePoint × ModelType** の3軸で決定する。

`utils/world/getEnvMapIntensity.ts` 内の `setTimePointIntensity` が時間帯補正を加算する。

| TimePoint | Model 補正 | Cloud 補正 |
|---|---|---|
| `night` | +6 | +50 |
| `evening` | -2 | +20 |
| `lunch` | +12 | +200 |

---

## 8. デバッグコントロール（Leva）

**開発環境のみ** (`IS_DEV`) で Leva パネルが表示される。
Leva ストアは `World` で `useCreateStore` で生成し、`Experience` と `Rain` に props で渡す。
パネルは `createPortal` で `document.body` 直下に描画する（レイヤー競合回避）。

| グループ名 | 制御対象 |
|---|---|
| タイムポイント | 時間帯・天気説明・雲量・湿度の上書き |
| 星 | 表示/非表示・色・透明度・サイズ・数 |
| 雲 | 表示/非表示・雲量・環境マップ強度 |
| 雨 | 表示/非表示・雨量・線幅・長さ・速度・透明度 |
| 太陽光 | 強度・位置・シャドウヘルパー表示 |
| カメラリグ | 始終点座標・モデル Y オフセット |

天気説明を変更すると `effectiveCurrentWeatherData` が合成データに差し替えられ、
`onEffectiveWeatherDataChange` 経由で `World` → `Rain` にも伝播する。

---

## 9. Canvas 設定

```typescript
<Canvas
  shadows={{ type: PCFShadowMap }}
  dpr={[1, 2]}
  gl={{ antialias: true, toneMapping: ReinhardToneMapping }}
  camera={{ fov: 45, near: 0.01, far: 200 }}
/>
```

| 項目 | 値 | 理由 |
|---|---|---|
| Shadow | PCFShadowMap | 柔らかいシャドウ |
| DPR | [1, 2] | Retina 対応・パフォーマンス上限 |
| ToneMapping | ReinhardToneMapping | 自然な露出再現 |
| FOV | 45° | 標準的な透視投影 |
| Near / Far | 0.01 / 200 | Z ファイティング防止・シーン範囲 |

---

## 10. 関連ファイル一覧

| パス | 説明 |
|---|---|
| `components/home/World/World.tsx` | メインコンポーネント・状態管理・天気 API 呼び出し |
| `components/home/World/Experience.tsx` | R3F シーングラフ・Leva デバッグ統合 |
| `components/home/World/modules/` | 各シーンモジュール |
| `app/api/getCurrentWeather/route.ts` | 天気 API Route Handler |
| `services/getCurrentWeather.ts` | 天気 API ヘルパー関数 |
| `animations/home.ts` | RigCamera・Portal の GSAP アニメーション定義 |
| `utils/world/getEnvMapIntensity.ts` | 環境マップ強度算出ロジック |
| `utils/world/getWeatherCategory.ts` | 天気カテゴリ分類ロジック |
| `constants/home.ts` | シーン定数（位置・サイズ・閾値・デバッグ設定） |
| `constants/colors.ts` | `TIME_POINT_ENV_COLORS`（時間帯別環境色） |
| `types/api.ts` | `OpenWeatherCurrentData` / `TimePoint` 型定義 |
| `types/home.ts` | `RainState` / `RainStateResult` 型定義 |
| `docs/home-world-flow.md` | データフロー シーケンス図・状態遷移図 |

---

## 11. 未実装・保留事項

- 雪（Snow）天気対応（`WeatherCategory = null` を返す天気説明が対象）
- Morning（日の出）時間帯の演出
- 詳細は [weather-unimplemented.md](./weather-unimplemented.md) を参照
