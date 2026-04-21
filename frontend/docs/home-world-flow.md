# HomeWorld 処理フロー図

## 1. 全体シーケンス（マウント〜3D シーン表示）

```mermaid
sequenceDiagram
    participant Browser
    participant HomeProvider
    participant HomeWorld
    participant useHomeWorld
    participant useGeolocation
    participant API as Next.js API Route
    participant OpenWeather as OpenWeatherMap API

    Browser->>HomeProvider: マウント
    Note over HomeProvider: isLoading = true<br/>portalRef 初期化
    HomeProvider->>HomeWorld: レンダリング
    HomeWorld->>useHomeWorld: 呼び出し
    Note over useHomeWorld: isViewerLoading = false<br/>currentWeatherData = null<br/>weather = DEFAULT_WEATHER<br/>timePoint = "night"

    useHomeWorld->>useGeolocation: DEFAULT_COORDINATES を渡して呼び出し
    Note over useGeolocation: isPermissionHandled = false
    HomeWorld-->>Browser: ModelViewerLoading 表示<br/>（isViewerLoading が false のため）

    useGeolocation->>Browser: Geolocation API 呼び出し
    alt 位置情報を許可
        Browser-->>useGeolocation: 緯度・経度を取得
        Note over useGeolocation: coordinates = 実際の座標<br/>isPermissionHandled = true
    else 位置情報を拒否 or ブラウザ非対応
        Browser-->>useGeolocation: エラー / undefined
        Note over useGeolocation: coordinates = DEFAULT_COORDINATES（東京駅）<br/>isPermissionHandled = true
    end

    useGeolocation-->>useHomeWorld: { coordinates, isPermissionHandled }
    Note over useHomeWorld: isPermissionHandled が true になった<br/>→ useEffect 発火

    useHomeWorld->>API: POST /api/getCurrentWeather<br/>{ latitude, longitude }
    API->>API: キーバリデーション<br/>座標バリデーション<br/>API KEY 確認
    API->>OpenWeather: GET /data/2.5/weather
    OpenWeather-->>API: OpenWeatherCurrentData
    API->>API: タイムゾーンから timePoint 計算<br/>（morning / lunch / evening / night）
    API-->>useHomeWorld: { success, data: { data, timePoint } }

    Note over useHomeWorld: setCurrentWeatherData(data)<br/>setTimePoint(timePoint)<br/>setWeather(data.weather)
    Note over useHomeWorld: [finally] setIsViewerLoading(true)

    useHomeWorld-->>HomeWorld: isViewerLoading = true

    HomeWorld-->>Browser: Canvas + Experience + Rain (DOM canvas) を表示

    Note over Browser: Canvas onCreated コールバック発火
    HomeWorld->>HomeProvider: setIsLoading(false)
    Note over HomeProvider: isLoading = false<br/>→ ポータルアニメーション開始トリガー
```

---

## 2. コンポーネント状態管理

```mermaid
stateDiagram-v2
    direction LR

    state "ModelViewerLoading 表示" as Loading
    state "Canvas + Experience + Rain 表示" as Viewer
    state "ポータルアニメーション開始" as Portal
    state "天気 API 取得" as weatherFetch {
        state "位置情報取得中" as locationFetch
        state "API 呼び出し" as apiCall
        [*] --> locationFetch
        locationFetch --> apiCall: isPermissionHandled = true
        apiCall --> [*]: finally setIsViewerLoading(true)
    }

    [*] --> Loading: HomeWorld マウント (isViewerLoading=false)
    Loading --> weatherFetch
    weatherFetch --> Viewer: isViewerLoading = true
    Viewer --> Portal: Canvas onCreated → setIsLoading(false)
```

---

## 3. 状態変数の二層構造

```mermaid
flowchart TB
    subgraph HomeContext["HomeContext（グローバル）"]
        isLoading["isLoading\n初期値: true\n→ Canvas 初期化後に false"]
        portalRef["portalRef\n→ RigCamera のアニメーション対象 DOM"]
    end

    subgraph useHomeWorld["useHomeWorld（ローカル）"]
        isViewerLoading["isViewerLoading\n初期値: false\n→ 天気 API 完了後に true"]
        currentWeatherData["currentWeatherData\n初期値: null\n→ API レスポンス"]
        weather["weather\n初期値: DEFAULT_WEATHER\n→ API レスポンスの weather[]"]
        timePoint["timePoint\n初期値: 'night'\n→ API から計算（morning/lunch/evening/night）"]
        backgroundColor["backgroundColor\n→ timePoint に応じた背景色"]
    end

    isViewerLoading -->|true になると Canvas をレンダリング| Canvas
    Canvas -->|onCreated| isLoading
    isLoading -->|false になるとアニメーション開始| RigCamera
    portalRef --> RigCamera
```

---

## 4. Experience 内の 3D シーン構成

```mermaid
flowchart TB
    HomeWorld --> Canvas
    Canvas --> Experience

    subgraph Experience["Experience（3D シーン）"]
        direction TB
        WE["WeatherEnvironment\n背景環境カラー (timePoint)"]
        FG["Fog\n霧の濃さ (fogRef)"]
        SL["SunLight\n光源 (sunLightRef)\n天気・時間帯により色・強度が変化"]
        Models["group: models\n┣ Model（メインモデル）\n┣ Door（ポータルドア）\n┗ Ocean（海面）"]
        ST["Star\n夜空の星"]
        CL["Clouds\n雲 (thinCloudRef / thickCloudRef)\n天気カテゴリに応じて切替"]
        LG["Lightning\n稲妻 (lightningRef)\nThunderstorm 時のみ発光"]
        RC["RigCamera\n画面サイズに応じたカメラ位置\nポータルアニメーション管理"]
        BS["BakeShadows\n影の焼き込み"]

        WE --> FG --> SL --> Models --> ST --> CL --> LG --> RC --> BS
    end

    subgraph useExperience["useExperience（3D ロジック）"]
        refs["6 refs\ndoorRef / sunLightRef / lightningRef\nfogRef / thinCloudRef / thickCloudRef"]
        leva["leva コントロール（開発環境のみ）\ndebugTimePoint / fogNear・fogFar\nthinCloudVisible・thickCloudVisible\nsunLightHelper・lightningHelper"]
        effects["useEffect × 4（開発環境のみ）\n① debugTimePoint → setTimePoint\n② fog → fogRef 同期\n③ clouds → cloudRefs 同期\n④ ライトヘルパー生成・破棄"]
        frame["useFrame（開発環境のみ）\nDirectionalLightHelper.update()\nPointLightHelper.update()"]

        refs --- leva
        leva --- effects
        effects --- frame
    end

    Canvas --> useExperience
    HomeWorld -->|2D canvas DOM| Rain["Rain（DOM canvas）\n風速・雨量に応じた 2D 雨アニメーション"]
```

---

## 5. 天気データの props drilling

```mermaid
flowchart LR
    API["OpenWeatherMap API\nOpenWeatherCurrentData"] -->|レスポンス| useHomeWorld

    useHomeWorld -->|currentWeatherData\nweather\ntimePoint| HomeWorld
    HomeWorld -->|currentWeatherData\nweather\ntimePoint\nbackgroundColor| Experience
    Experience -->|timePoint| WeatherEnvironment
    Experience -->|timePoint\ncurrentWeatherData\nweather| SunLight
    Experience -->|timePoint\nweather| Clouds
    Experience -->|timePoint\nweather| Fog
    Experience -->|timePoint| Star
    Experience -->|currentWeatherData\nweather| Lightning
    Experience -->|currentWeatherData\nweather| Rain["Rain (DOM)"]

    subgraph gwc["getWeatherCategory()（共通ヘルパー）"]
        desc["description: string → thickCloud / thinCloud / clearSky / null"]
    end

    SunLight --> gwc
    Clouds --> gwc
    getEnvMapIntensity["getEnvMapIntensity()"] --> gwc
```

---

## 6. RigCamera のポータルアニメーション フロー

```mermaid
flowchart TD
    A["Canvas onCreated\n→ setIsLoading(false)"] --> B["HomeContext: isLoading = false"]
    B --> C["RigCamera: useLayoutEffect 発火\n（portalRef, windowSize が確定）"]
    C --> D{windowSize 有効?}
    D -- No --> E["early return（待機）"]
    D -- Yes --> F["scene から 'models' グループを取得\ndoorRef から 'door-container' / 'room' を取得"]
    F --> G{3要素すべて揃っている?}
    G -- No --> H["アニメーション実行なし"]
    G -- Yes --> I{window.width の範囲}
    I --> |width >= 1920| J["camera.position = xxl.start\nmodels.y = -0.85"]
    I --> |1536 to 1920| K["camera.position = xl.start\nmodels.y = -0.6"]
    I --> |1280 to 1536| L["camera.position = lg.start\nmodels.y = -0.4"]
    I --> |1024 to 1280| M["camera.position = tb.start\nmodels.y = -1.4"]
    I --> |768 to 1024| N["camera.position = sp.start\nmodels.y = -0.x"]
    J --> O["rigCameraAnimation 実行\nGSAP: startPosition to endPosition\nportalRef にドア通過アニメーション"]
    K --> O
    L --> O
    M --> O
    N --> O
```

---

## 7. 問題点のサマリー（フロー上の課題）

````mermaid
flowchart TB
    subgraph naming["命名の反転"]
        A["isViewerLoading: false → LoadingUI を表示\n（Loading なのに false が ローディング中）"]
        B["isLoading: true → Canvas 未初期化状態\n（Loading が true = まだ読み込んでいない）"]
    end

    subgraph resp["責務分散"]
        C["HomeContext（グローバル）\nポータルアニメーション専用の isLoading を管理"]
        D["useHomeWorld（ローカル）\n天気取得完了の isViewerLoading を管理"]
        E["2つの Loading フラグが異なる層で同時に動いている"]
    end

    subgraph unintuitive["非直感的なフロー"]
        F["Canvas onCreated（3D ライブラリの内部イベント）\n→ Context の setIsLoading を更新"]
        G["レンダリングシステムの内部状態変化が\nReact Context に直接影響する構造"]
    end
```　
　
````
