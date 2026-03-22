'use client';

import { Typography } from '@mui/material';
import Image from 'next/image';
import useSkillsList from './useSkillList';
import s from '@/styles/about/SkillList.module.css';

const SkillsList = () => {
  const {
    skillsListRef,
    iconSize,
    chunkedSkills,
    skillsListContainerClassNames,
    skillListContainerClassNames,
    skillListClassNames,
    skillClassNames,
  } = useSkillsList();

  return (
    <div className={s.skills_list} ref={skillsListRef}>
      {chunkedSkills.map((category, i1) => (
        <div key={i1} className={skillsListContainerClassNames}>
          {/* スキルカテゴリのタイトル */}
          <Typography component="h3" variant="h3">
            {category.title}
          </Typography>
          {/* <h3>{category.title}</h3> */}
          {/* スキル一覧 */}
          <div className={skillListClassNames}>
            {category.skills.map((skillsChunk, i2) => (
              <ul key={i2} className={skillListContainerClassNames}>
                {skillsChunk.map((item, i3) => (
                  <li key={i3} className={skillClassNames}>
                    {/* アイコン画像 */}
                    <Image
                      src={item.image}
                      alt={item.alt}
                      width={iconSize}
                      height={iconSize}
                      className={s.image}
                      quality={item.name === 'Three.js' ? 75 : 1}
                      placeholder="blur"
                      blurDataURL={item.image}
                    />
                    {/* スキルの説明 */}
                    <div className={s.txt}>
                      {/* スキルのタイトル */}
                      <Typography component="span" variant="p">
                        {item.name}
                      </Typography>
                      {/* スキルの経験年数 */}
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
};

export default SkillsList;
