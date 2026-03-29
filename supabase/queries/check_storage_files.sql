/*
 * check_storage_files.sql: Storage バケット内のファイル一覧を確認するデバッグクエリ。
 * このファイルはマイグレーション対象外。実行しても DB に変更を加えない。
 *
 * 確認項目:
 *   - portfolio-works バケットに実際に存在するファイル名を把握する
 *   - files テーブルの url・formats と Storage の実態を突き合わせる
 *
 * 使用場面:
 *   - Strapi で画像をアップロード後、Storage に保存されたファイル名を確認したいとき
 *   - 画像が 404 になる原因調査（files.url vs Storage 実ファイルの乖離を確認）
 */

-- Storage バケット内の全ファイル名を確認する
SELECT
    name        -- ファイルパス（例: large_rc_plane.webp-abc123.webp）
    , bucket_id -- バケット名（portfolio-works）
    , created_at
FROM
    storage.objects
WHERE
    bucket_id = 'portfolio-works'
ORDER BY
    created_at DESC;
