import { useRef, useEffect, useMemo } from 'react';
import cn from 'classnames';
import { useIconSize, useWindowSize } from '@/hooks';
import { skillsListAnimation } from '@/animations/about';
import { BREAK_POINTS } from '@/constants/common';
import { SKILLS } from '@/constants/about';
import { Skills, Skill } from '@/types/common';
import s from '@/styles/about/SkillList.module.css';

type ChunkedSkills = Omit<Skills, 'skills'> & {
  skills: Skill[][];
};

type UseSkillsList = {
  skillsListRef: React.RefObject<HTMLDivElement>;
  iconSize: number;
  chunkedSkills: ChunkedSkills[];
  skillsListContainerClassNames: string;
  skillListContainerClassNames: string;
  skillListClassNames: string;
  skillClassNames: string;
};

const useSkillsList = (): UseSkillsList => {
  const skillsListRef = useRef<HTMLDivElement>(null!);
  const iconSize = useIconSize(45, 60, 50);
  const { width } = useWindowSize();

  const chunkedSkills = useMemo<ChunkedSkills[]>(() => {
    /** チャンクサイズを取得
     * @param skills スキル配列
     * @returns チャンクサイズ
     */
    const getChunkSize = (skills: Skill[]): number => {
      // XL以上 or SM以下: 全ての要素を1つの配列に
      if (width >= BREAK_POINTS['2XL'] || width < BREAK_POINTS.SM) {
        return skills.length;
      }
      // XL: 最大8つ
      if (width >= BREAK_POINTS.XL) {
        return 8;
      }
      // LG: 最大7つ
      if (width >= BREAK_POINTS.LG) {
        return 7;
      }
      // SM: 最大6つ
      if (width >= BREAK_POINTS.SM) {
        return 6;
      }
      return 0;
    };

    /** スキルカテゴリごとにチャンク化
     * @return チャンク化されたスキルカテゴリ配列
     */
    const chunkedSkills = SKILLS.map((category) => {
      // チャンクサイズを取得
      const chunkSize = getChunkSize(category.skills);
      // チャンクサイズに分割
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

  const skillsListContainerClassNames = cn(
    s.skills_list_container,
    'skills-list-container',
  );
  const skillListClassNames = cn(s.skill_list, 'skill-list');
  const skillListContainerClassNames = cn(s.skill_list_container, 'skill-list-container');
  const skillClassNames = cn(s.skill, { [s.active]: width && width > BREAK_POINTS.SM });

  useEffect(() => {
    const ctx = skillsListAnimation({
      skillList: skillsListRef.current.querySelectorAll(
        '.skills-list-container',
      ) as NodeListOf<Element>,
      skillsListRef,
    });
    return () => {
      ctx.revert();
    };
  }, []);

  return {
    skillsListRef,
    iconSize,
    chunkedSkills,
    skillsListContainerClassNames,
    skillListContainerClassNames,
    skillListClassNames,
    skillClassNames,
  };
};

export default useSkillsList;
