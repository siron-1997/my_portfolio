'use client';

import React, { useState, useContext } from 'react';
import { HomeContextType } from '@/types/contexts';

/** Props の型定義 */
type Props = {
  /** children */
  children: React.ReactNode;
};

const HomeContext = React.createContext<HomeContextType | undefined>(undefined);

export const HomeProvider: React.FC<Props> = ({ children }) => {
  const portalRef = React.useRef<HTMLDivElement>(null!);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <HomeContext.Provider value={{ portalRef, isLoading, setIsLoading }}>
      {children}
    </HomeContext.Provider>
  );
};

export const useHomeContext = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHomeContext must be used within a HomeProvider');
  }
  return context;
};
