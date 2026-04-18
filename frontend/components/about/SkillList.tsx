'use client';

import React, { JSX, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';

import { Typography } from '@mui/material';
import cn from 'classnames';

import { skillsListAnimation } from '@/animations/about';
import { SKILLS } from '@/constants/about';
import { BREAK_POINTS } from '@/constants/common';
import { useWindowSize } from '@/hooks';
import s from '@/styles/about.module.css';
import { type Skill, type Skills } from '@/types/common';

type ChunkedSkills = Omit<Skills, 'skills'> & {
  /** チャンク化されたスキル配列 */
  skills: Skill[][];
};

const SkillsList = React.memo((): JSX.Element => {
  /** スキルリストのコンテナ要素の参照 Ref */
  const ref = useRef<HTMLDivElement | null>(null);

  /** ウィンドウ幅を取得 */
  const { width } = useWindowSize();

  /** スキルリストのコンテナクラス名 */
  const skillsListContainerClassNames = cn(
    s.skills_list_container,
    'skills-list-container',
  );

  /** スキルリストのクラス名 */
  const skillListClassNames = cn(s.skill_list, 'skill-list');

  /** スキルリストのコンテナクラス名 */
  const skillListContainerClassNames = cn(
    s.skill_list_container,
    'skill-list-container',
  );

  /** スキルアイテムのクラス名 */
  const skillClassNames = cn(s.skill, {
    /** スキルアイテムがアクティブかどうか */
    [s.active]: width && width > BREAK_POINTS.SM,
  });

  /** チャンク化されたスキル配列 */
  const chunkedSkills = useMemo<ChunkedSkills[]>(() => {
    /** チャンクサイズを取得
     * @param skills スキル配列
     * @returns チャンクサイズ
     */
    const getChunkSize = (skills: Skill[]): number => {
      /** XL以上 or SM以下: 全ての要素を1つの配列に */
      if (width >= BREAK_POINTS['2XL'] || width < BREAK_POINTS.SM) {
        return skills.length;
      }
      /** XL: 最大8つ */
      if (width >= BREAK_POINTS.XL) {
        return 8;
      }
      /** LG: 最大7つ */
      if (width >= BREAK_POINTS.LG) {
        return 7;
      }
      /** SM: 最大6つ */
      if (width >= BREAK_POINTS.SM) {
        return 6;
      }
      return 0;
    };

    /** スキルカテゴリごとにチャンク化 */
    const chunkedSkills = SKILLS.map((category) => {
      /** チャンクサイズを取得 */
      const chunkSize = getChunkSize(category.skills);

      /** チャンクサイズに分割 */
      const chunkedCategorySkills: Skill[][] = [];
      for (let i = 0; i < category.skills.length; i += chunkSize) {
        chunkedCategorySkills.push(category.skills.slice(i, i + chunkSize));
      }

      return {
        title: category.title,
        skills: chunkedCategorySkills,
      };
    });

    return chunkedSkills;
  }, [width]);

  useEffect(() => {
    if (!ref.current) return;

    /** スキルリストのアニメーションを初期化 */
    const ctx = skillsListAnimation({
      skillList: ref.current.querySelectorAll(
        '.skills-list-container',
      ) as NodeListOf<Element>,
      ref,
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className={s.skills_list} ref={ref}>
      {chunkedSkills.map((category, i1) => (
        <div key={i1} className={skillsListContainerClassNames}>
          {/** スキルカテゴリのタイトル */}
          <Typography component="h3" variant="h3">
            {category.title}
          </Typography>

          {/** スキル一覧 */}
          <div className={skillListClassNames}>
            {category.skills.map((skillsChunk, i2) => (
              /** チャンク化されたスキル配列ごとにリストを生成 */
              <ul key={i2} className={skillListContainerClassNames}>
                {skillsChunk.map((item, i3) => (
                  <li key={i3} className={skillClassNames}>
                    {/** アイコン画像 */}
                    <Image
                      src={item.image}
                      alt={item.alt}
                      width={60}
                      height={60}
                      className={s.image}
                      quality={item.name === 'Three.js' ? 75 : 1}
                      placeholder="blur"
                      blurDataURL={item.image}
                    />

                    <div className={s.txt}>
                      {/** スキルのタイトル */}
                      <Typography component="span" variant="p">
                        {item.name}
                      </Typography>

                      {/** スキルの経験年数 */}
                      <Typography component="p" variant="p">
                        {item.year}
                      </Typography>
                    </div>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

SkillsList.displayName = 'SkillsList';

export default SkillsList;
