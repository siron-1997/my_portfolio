'use client';

import React, { useState, useContext } from 'react';
import { WorksContextType } from '@/types/contexts';
import { WorkCategory } from '@/types/api';

type Props = {
  children: React.ReactNode;
};

const WorksContext = React.createContext<WorksContextType | undefined>(undefined);

export const WorksProvider: React.FC<Props> = ({ children }) => {
  const [categories, setCategories] = useState<WorkCategory[]>([]);

  return (
    <WorksContext.Provider value={{ categories, setCategories }}>
      {children}
    </WorksContext.Provider>
  );
};

export const useWorksContext = () => {
  const context = useContext(WorksContext);
  if (!context) {
    throw new Error('useWorksContext must be used within a WorksProvider');
  }
  return context;
};
