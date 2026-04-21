# OpenWeatherMap 未対応天気コード一覧

Home World の 3D エフェクト（Rain / Lightning / Clouds / SunLight / WeatherEnvironment など）が
視覚的に対応していない天気コードの記録。

対応済みの判定基準：`WEATHER_TYPES`（`constants/world.ts`）に `main` 値が含まれており、
かつ各コンポーネントで適切な 3D エフェクトが設定されていること。

参照元: [OpenWeatherMap - Weather Conditions](https://openweathermap.org/weather-conditions)

---

## Group 3xx: Drizzle（霧雨）

`WEATHER_TYPES` への `'Drizzle'` 追加は完了済み。
3D エフェクト（Rain コンポーネントの `_getRainState` 等）への description 追加が保留。

| ID  | main    | description                   | 備考               |
| --- | ------- | ----------------------------- | ------------------ |
| 300 | Drizzle | light intensity drizzle       | 弱い霧雨           |
| 301 | Drizzle | drizzle                       | 霧雨               |
| 302 | Drizzle | heavy intensity drizzle       | 強い霧雨           |
| 310 | Drizzle | light intensity drizzle rain  | 弱い霧雨混じりの雨 |
| 311 | Drizzle | drizzle rain                  | 霧雨混じりの雨     |
| 312 | Drizzle | heavy intensity drizzle rain  | 強い霧雨混じりの雨 |
| 313 | Drizzle | shower rain and drizzle       | にわか雨と霧雨     |
| 314 | Drizzle | heavy shower rain and drizzle | 強いにわか雨と霧雨 |
| 321 | Drizzle | shower drizzle                | にわか霧雨         |

**対応予定：** Rain コンポーネントに軽量な雨エフェクトを追加する。
SunLight・Clouds・getEnvMapIntensity は `getWeatherCategory` 経由で `thickCloud` として扱われるため追加不要。

---

## Group 6xx: Snow（雪）

`WEATHER_TYPES` への `'Snow'` 追加は完了済み。
雪の 3D バリエーション（パーティクルエフェクト等）の実装が保留。

| ID  | main | description         | 備考           |
| --- | ---- | ------------------- | -------------- |
| 600 | Snow | light snow          | 小雪           |
| 601 | Snow | snow                | 雪             |
| 602 | Snow | heavy snow          | 大雪           |
| 611 | Snow | sleet               | 霙（みぞれ）   |
| 612 | Snow | light shower sleet  | 弱いにわか霙   |
| 613 | Snow | shower sleet        | にわか霙       |
| 615 | Snow | light rain and snow | 弱い雨雪混じり |
| 616 | Snow | rain and snow       | 雨雪混じり     |
| 620 | Snow | light shower snow   | 弱いにわか雪   |
| 621 | Snow | shower snow         | にわか雪       |
| 622 | Snow | heavy shower snow   | 強いにわか雪   |

**対応予定：** Snow 専用パーティクルコンポーネントを新規作成し、
SunLight の `sunIntensity` switch に snow 系 description の強度値を定義する。

---

## 補足：対応済みに変更した天気コード（本作業にて）

以下は本作業（2026-03-30）で対応済みになった Group 7xx の description。
`WEATHER_DESCRIPTIONS_ATMOSPHERE` に追加し、`thickCloud` として扱われる。

| ID  | main    | description      |
| --- | ------- | ---------------- |
| 741 | Fog     | fog              |
| 711 | Smoke   | smoke            |
| 721 | Haze    | haze             |
| 731 | Dust    | sand/dust whirls |
| 751 | Sand    | sand             |
| 761 | Dust    | dust             |
| 762 | Ash     | volcanic ash     |
| 771 | Squall  | squalls          |
| 781 | Tornado | tornado          |

> **注意**: これらは `thickCloud` として Clouds・SunLight・getEnvMapIntensity が反応するが、
> Rain / Lightning / WeatherEnvironment には個別の 3D エフェクトは未実装。
> 竜巻・火山灰など視覚的に特別な表現が必要な description は将来的に専用エフェクトを検討する。
