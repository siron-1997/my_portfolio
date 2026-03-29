/*
 * check_works_view.sql: v_works ビューの出力内容を確認するデバッグクエリ。
 * このファイルはマイグレーション対象外。実行しても DB に変更を加えない。
 *
 * 確認項目:
 *   - image_url が Storage に存在するパス（large / medium / small）を返しているか
 *   - slug・category_key・category_name が正しく設定されているか
 */
SELECT
    slug          -- 作品スラッグ（API のパス引数になる）
    , image_url   -- Storage パス（formats フォールバック後の値）
    , category_key
    , category_name
FROM
    public.v_works
LIMIT 10;
