/*
 * check_files_table.sql: Strapi の files テーブルの内容を確認するデバッグクエリ。
 * このファイルはマイグレーション対象外。実行しても DB に変更を加えない。
 *
 * 確認項目:
 *   - files.url（オリジナルパス）と formats.large/medium/small（レスポンシブ形式）の両方を確認
 *   - Strapi のアップロードプロバイダーがどのファイルを Storage に保存したか把握する
 */

-- files テーブルの url と formats カラムを確認する
SELECT
    id
    , name                              -- Strapi 管理上のファイル名
    , url                               -- オリジナルファイルの Storage パス（Storage に存在しない場合あり）
    , formats->'large'->>'url'  AS large_url    -- large 形式の Storage パス
    , formats->'medium'->>'url' AS medium_url   -- medium 形式の Storage パス
    , formats->'small'->>'url'  AS small_url    -- small 形式の Storage パス
FROM
    public.files
ORDER BY
    created_at DESC
LIMIT 20;
