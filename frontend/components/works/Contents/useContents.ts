import { useRef, useEffect } from 'react';
import { WorkSummary, WorkCategory } from '@/types/api';
import { useWorksContext } from '@/contexts';
import { contentsAnimation } from '@/animations/works';

/** Props の型定義 */
type Props = {
  /** data */
  data: WorkSummary[];
};

/**
 * 選択されたカテゴリに応じて作品リストをフィルタリング
 * @param data - すべての作品データ
 * @param categories - 選択中のカテゴリリスト
 * @returns 選択されたカテゴリに一致する作品リスト（カテゴリ未選択時は全件）
 *
 * @example
 * const { contentsRef, selectedWorks } = useContents({ data });
 */
export const useContents = ({ data }: Props) => {
  const contentsRef = useRef<HTMLDivElement>(null!);
  const { categories } = useWorksContext();

  const selectedWorks = data.reduce((selectedWorks: WorkSummary[], work: WorkSummary) => {
    /** カテゴリが選択されている場合 */
    if (categories.length > 0) {
      categories.forEach((category: WorkCategory) => {
        /** 作品のカテゴリキーが選択中カテゴリキーと一致したら追加 */
        if (work.category_key === category.key) {
          selectedWorks.push(work);
        }
      });

      /** カテゴリ未選択時は全件追加 */
    } else {
      selectedWorks.push(work);
    }
    return selectedWorks;
  }, []);

  useEffect(() => {
    const ctx = contentsAnimation({
      contentItems: contentsRef.current.querySelectorAll<HTMLElement>('.content'),
      contentsRef,
    });
    return () => {
      ctx.revert();
    };
  }, []);

  return {
    contentsRef,
    selectedWorks,
  };
};
