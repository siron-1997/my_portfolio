'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { TextField, InputLabel, Chip, Autocomplete } from '@mui/material';

import { useWorksContext } from '@/contexts';
import { useWindowSize } from '@/hooks';
import { categoryFilterAnimation } from '@/animations/works';
import { WorkCategory } from '@/types/api';
import { BREAK_POINTS } from '@/constants/common';
import s from '@/styles/works/CategoryFilter.module.css';

/**
 * CategoryFilter コンポーネントの Props。
 * 作品一覧のカテゴリ絞り込みオートコンプリートフィルター。
 */
type Props = {
  /** フィルタリング対象のカテゴリデータ配列 */
  data: WorkCategory[];
};

const CategoryFilter = ({ data }: Props) => {
  /** カテゴリーフィルター参照 Ref */
  const ref = useRef<HTMLDivElement | null>(null);

  const { setCategories } = useWorksContext();

  /** ウィンドウ幅を取得 */
  const { width } = useWindowSize();

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
        limitTags={width && width < BREAK_POINTS.XS ? 2 : 4}
        id="size-small-outlined-multi"
        className={s.autocomplete}
        size="small"
        onChange={(_, value: WorkCategory[]) => setCategories(value)}
        options={data}
        getOptionLabel={(option) => option.name}
        defaultValue={data}
        renderTags={(value, getTagProps) =>
          value.map((option, i) => {
            /** key を分離 */
            const { key, ...tagProps } = getTagProps({ index: i });
            return <Chip key={key} label={option.name} {...tagProps} />;
          })
        }
        /** フィルター アイコン */
        renderInput={(params) => (
          <div className={s.filter_container}>
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
            <TextField {...params} variant="standard" />
          </div>
        )}
      />
    </div>
  );
};

export default CategoryFilter;
