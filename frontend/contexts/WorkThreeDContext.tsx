'use client';

import React, { useRef, useReducer, useContext, useMemo } from 'react';
import {
  WorkThreeDContextType,
  WorkThreeDState,
  WorkThreeDAction,
} from '@/types/contexts';

/** Props の型定義 */
type Props = {
  /** Provider が包むコンテンツ */
  children: React.ReactNode;
};

/** workThreeDReducer の初期状態 */
const initialState: WorkThreeDState = {
  isLoading: true,
  isInitialControl: true,
  isStartControls: false,
  isFingerVisible: true,
  isViewerActive: false,
  currentIndex: 0,
};

/**
 * 3D作品ビュワーの状態を管理するリデューサー。
 *
 * @param state 現在の状態
 * @param action 実行するアクション
 * @returns 更新後の状態
 */
const workThreeDReducer = (
  state: WorkThreeDState,
  action: WorkThreeDAction,
): WorkThreeDState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_INITIAL_CONTROL':
      return { ...state, isInitialControl: action.payload };
    case 'SET_START_CONTROLS':
      return { ...state, isStartControls: action.payload };
    case 'SET_FINGER_VISIBLE':
      return { ...state, isFingerVisible: action.payload };
    case 'SET_VIEWER_ACTIVE':
      return { ...state, isViewerActive: action.payload };
    case 'SET_CURRENT_INDEX':
      return { ...state, currentIndex: action.payload };
    case 'TOGGLE_VIEWER':
      /** isFingerVisible と isViewerActive を同一 payload で同時更新する */
      return {
        ...state,
        isFingerVisible: action.payload,
        isViewerActive: action.payload,
      };
    case 'NAVIGATE_TO':
      /** isInitialControl を false にし、選択インデックスを更新する */
      return { ...state, isInitialControl: false, currentIndex: action.payload };
    default:
      return state;
  }
};

const WorkThreeDContext = React.createContext<WorkThreeDContextType | undefined>(
  undefined,
);

/**
 * 3D作品ビュワーの状態を Provider で提供するコンポーネント。
 * works/3d/[slug] ページのルートで使用する。
 */
export const WorkThreeDProvider: React.FC<Props> = ({ children }) => {
  const portalRef = useRef<HTMLElement>(null!);
  const introductionRef = useRef<HTMLDivElement>(null!);
  const controlsRef = useRef<HTMLDivElement>(null!);
  const toggleButtonRef = useRef<HTMLDivElement>(null!);
  const [state, dispatch] = useReducer(workThreeDReducer, initialState);

  /** ref は再生成不要のため useMemo でメモ化する */
  const refs = useMemo(
    () => ({ portalRef, introductionRef, controlsRef, toggleButtonRef }),
    [],
  );
  /** value を useMemo でメモ化し、state 変化時以外の Consumer 再レンダリングを防ぐ */
  const value = useMemo(() => ({ state, dispatch, refs }), [state, refs]);

  return (
    <WorkThreeDContext.Provider value={value}>{children}</WorkThreeDContext.Provider>
  );
};

/**
 * WorkThreeDContext を利用するためのカスタムフック。
 * WorkThreeDProvider 内で使用される必要がある。
 *
 * @returns WorkThreeDContext の state、dispatch、refs
 * @throws {Error} WorkThreeDProvider 外で使用された場合にエラーを投げる
 */
export const useWorkThreeDContext = (): WorkThreeDContextType => {
  const context = useContext(WorkThreeDContext);
  if (!context) {
    throw new Error('useWorkThreeDContext must be used within a WorkThreeDProvider');
  }
  return context;
};
