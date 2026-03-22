'use client';

import Image from 'next/image';
import { TextField, InputLabel, Chip, Autocomplete } from '@mui/material';
import { WorkCategory } from '@/types/api';
import { BREAK_POINTS } from '@/constants/common';
import { useCategoryFilter } from './useCategoryFilter';
import s from '@/styles/works/CategoryFilter.module.css';

type Props = {
  data: WorkCategory[];
};

const CategoryFilter = ({ data }: Props) => {
  const { categoryFilterRef, setCategories, width } = useCategoryFilter();

  return (
    <div className={s.category_filter} ref={categoryFilterRef}>
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
            const { key, ...tagProps } = getTagProps({ index: i }); // key を分離
            return <Chip key={key} label={option.name} {...tagProps} />;
          })
        }
        // フィルター アイコン
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
