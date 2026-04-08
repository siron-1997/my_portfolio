'use client';

import {
  TextField,
  InputLabel,
  Chip,
  Autocomplete,
  AutocompleteRenderGetTagProps,
  AutocompleteRenderInputParams,
} from '@mui/material';
import Image from 'next/image';
import React, {
  useRef,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
  JSX,
} from 'react';

import { categoryFilterAnimation } from '@/animations/works';
import { BREAK_POINTS } from '@/constants/common';
import { WorkCategory } from '@/types/api';
import { useWindowSize } from '@/hooks';
import s from '@/styles/works/CategoryFilter.module.css';

/**
 * CategoryFilter コンポーネントの Props。
 * 作品一覧のカテゴリ絞り込みオートコンプリートフィルター。
 */
type Props = {
  /** フィルタリング対象のカテゴリデータ配列 */
  data: WorkCategory[];

  /** 選択されたカテゴリを更新する関数 */
  setSelectedCategories: Dispatch<SetStateAction<WorkCategory[]>>;
};

const CategoryFilter = React.memo(({ data, setSelectedCategories }: Props) => {
  /** カテゴリーフィルター参照 Ref */
  const ref = useRef<HTMLDivElement | null>(null);

  /** ウィンドウ幅を取得 */
  const { width } = useWindowSize();

  /** 選択されたカテゴリの配列を状態管理関数に渡して更新する関数
   *
   * @params _ イベントオブジェクト（未使用）
   * @params value 選択されたカテゴリの配列
   */
  const handleChange = useCallback(
    (_: React.SyntheticEvent, value: WorkCategory[]): void =>
      setSelectedCategories(value),
    [setSelectedCategories],
  );

  /** オプション（カテゴリ）から表示用のラベル（カテゴリ名）を返す関数
   *
   * @params option カテゴリオブジェクト
   * @returns カテゴリ名
   */
  const getOptionLabel = useCallback((option: WorkCategory): string => option.name, []);

  /** 選択されたカテゴリの配列からチップをレンダリングする関数
   *
   * @params value 選択されたカテゴリの配列
   * @params getTagProps チップのプロパティを取得する関数
   * @returns チップ要素の配列
   */
  const renderTags = useCallback(
    (value: WorkCategory[], getTagProps: AutocompleteRenderGetTagProps): JSX.Element[] =>
      value.map((option, i) => {
        /** key を分離 */
        const { key, ...tagProps } = getTagProps({ index: i });
        return <Chip key={key} label={option.name} {...tagProps} />;
      }),
    [],
  );

  /** テキストフィールドのレンダリング関数
   *
   * @params params Autocomplete のレンダリングパラメータ
   * @returns テキストフィールド要素
   */
  const renderInput = useCallback(
    (params: AutocompleteRenderInputParams): JSX.Element => (
      <div className={s.filter_container}>
        {/* フィルター アイコン */}
        <InputLabel htmlFor="size-small-outlined-multi" className={s.label}>
          <Image
            src="/icons/tune_white.svg"
            alt="filters"
            width={50}
            height={50}
            quality={1}
            priority
          />
        </InputLabel>
        {/* テキストフィールド */}
        <TextField {...params} variant="standard" />
      </div>
    ),
    [],
  );

  useEffect(() => {
    if (!ref.current) return;

    /** カテゴリフィルターのアニメーションを初期化 */
    const ctx = categoryFilterAnimation({
      categoryFilter: ref.current,
      categoryFilterRef: ref,
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className={s.category_filter} ref={ref}>
      <Autocomplete
        multiple
        /** 表示するチップの最大数 */
        limitTags={width && width < BREAK_POINTS.XS ? 2 : 4}
        id="size-small-outlined-multi"
        className={s.autocomplete}
        size="small"
        onChange={handleChange}
        options={data}
        getOptionLabel={getOptionLabel}
        defaultValue={data}
        renderTags={renderTags}
        renderInput={renderInput}
      />
    </div>
  );
});

CategoryFilter.displayName = 'CategoryFilter';

export default CategoryFilter;
