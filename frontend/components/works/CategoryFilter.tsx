'use client';

import React, {
  type Dispatch,
  type JSX,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import Image from 'next/image';

import {
  Autocomplete,
  type AutocompleteRenderGetTagProps,
  type AutocompleteRenderInputParams,
  Chip,
  InputLabel,
  TextField,
} from '@mui/material';

import { categoryFilterAnimation } from '@/animations/works';
import { BREAK_POINTS } from '@/constants/common';
import {
  CATEGORY_FILTER_ICON_ALT,
  CATEGORY_FILTER_ICON_QUALITY,
  CATEGORY_FILTER_ICON_SIZE,
  CATEGORY_FILTER_ICON_SRC,
  CATEGORY_FILTER_INPUT_ID,
  CATEGORY_FILTER_LIMIT_TAGS_DESKTOP,
  CATEGORY_FILTER_LIMIT_TAGS_MOBILE,
} from '@/constants/works';
import { useWindowSize } from '@/hooks';
import s from '@/styles/works.module.css';
import { type WorkCategory } from '@/types/api';

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
   * @param _ イベントオブジェクト（未使用）
   * @param value 選択されたカテゴリの配列
   */
  const handleChange = useCallback(
    (_: React.SyntheticEvent, value: WorkCategory[]): void =>
      setSelectedCategories(value),
    [setSelectedCategories],
  );

  /** オプション（カテゴリ）から表示用のラベル（カテゴリ名）を返す関数
   *
   * @param option カテゴリオブジェクト
   * @returns カテゴリ名
   */
  const getOptionLabel = useCallback(
    (option: WorkCategory): string => option.name,
    [],
  );

  /** 選択されたカテゴリの配列からチップをレンダリングする関数
   *
   * @param value 選択されたカテゴリの配列
   * @param getTagProps チップのプロパティを取得する関数
   * @returns チップ要素の配列
   */
  const renderTags = useCallback(
    (
      value: WorkCategory[],
      getTagProps: AutocompleteRenderGetTagProps,
    ): JSX.Element[] =>
      value.map((option, i) => {
        /** key を分離 */
        const { key, ...tagProps } = getTagProps({ index: i });
        return <Chip key={key} label={option.name} {...tagProps} />;
      }),
    [],
  );

  /** テキストフィールドのレンダリング関数
   *
   * @param params Autocomplete のレンダリングパラメータ
   * @returns テキストフィールド要素
   */
  const renderInput = useCallback(
    (params: AutocompleteRenderInputParams): JSX.Element => (
      <div className={s.filter_container}>
        {/** フィルター アイコン */}
        <InputLabel htmlFor={CATEGORY_FILTER_INPUT_ID} className={s.label}>
          <Image
            src={CATEGORY_FILTER_ICON_SRC}
            alt={CATEGORY_FILTER_ICON_ALT}
            width={CATEGORY_FILTER_ICON_SIZE}
            height={CATEGORY_FILTER_ICON_SIZE}
            quality={CATEGORY_FILTER_ICON_QUALITY}
            priority
          />
        </InputLabel>
        {/** テキストフィールド */}
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
      ref,
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
        limitTags={
          width && width < BREAK_POINTS.XS
            ? CATEGORY_FILTER_LIMIT_TAGS_MOBILE
            : CATEGORY_FILTER_LIMIT_TAGS_DESKTOP
        }
        id={CATEGORY_FILTER_INPUT_ID}
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
