'use client';

import React, { useReducer, useRef } from 'react';
import type { JSX } from 'react';
import dynamic from 'next/dynamic';

import { Loading, PageHeader } from '@/components/common';
import { Controls, Introduction, Portal } from '@/components/works/workThreeD';

/** Canvas を含む WorkWorld は SSR 非対応のため dynamic import で無効化 */
const World = dynamic(
  () => import('@/components/works/workThreeD/World').then((mod) => mod.World),
  { ssr: false },
);

import s from '@/styles/works/workThreeD/workThreeDhreeD.module.css';
import { type WorkDetail } from '@/types/api';
import { type WorkThreeDAction, type WorkThreeDState } from '@/types/contexts';

type Props = {
  /** 表示する作品の詳細データ */
  content: WorkDetail;
};

/** work 個別ページの初期状態 (3D) */
const initialState: WorkThreeDState = {
  /** 3Dモデルのロード中フラグ */
  isLoading: true,

  /** 初期コントロール状態フラグ（Controls セクションに入る前の初期状態） */
  isInitialControl: true,

  /** コントロール開始フラグ（Controls セクションに到達したとき true になる） */
  isStartControls: false,

  /** 指アイコン表示フラグ */
  isFingerVisible: true,

  /** ビュワーアクティブフラグ（ビュワーモード中は true） */
  isViewerActive: false,

  /** 現在選択中のコントロールインデックス */
  currentIndex: 0,
};

/**
 * 3D作品ビュワーの状態を管理するリデューサー。
 *
 * @param state - 現在の状態
 * @param action - 実行するアクション
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
      return {
        ...state,
        isInitialControl: false,
        currentIndex: action.payload,
      };
    default:
      return state;
  }
};

/**
 * works/3d/[slug] ページの Client Component ラッパー。
 * WorkThreeD 全体の state と refs を保持し、子コンポーネントへ Props で渡す。
 * Context を使用せず、状態を props drilling で伝播する。
 */
const WorkThreeDClient = ({ content }: Props): JSX.Element => {
  /** portal セクションの参照 Ref */
  const portalRef = useRef<HTMLElement | null>(null);

  /** introduction セクションの参照 Ref */
  const introductionRef = useRef<HTMLDivElement | null>(null);

  /** controls セクションの参照 Ref */
  const controlsRef = useRef<HTMLDivElement | null>(null);

  /** toggleButton の参照 Ref */
  const toggleButtonRef = useRef<HTMLDivElement | null>(null);

  /** work 個別ページの状態 (3D) */
  const [state, dispatch] = useReducer(workThreeDReducer, initialState);

  return (
    <>
      <Loading isLoading={state.isLoading} />

      <World
        content={content}
        isLoading={state.isLoading}
        isInitialControl={state.isInitialControl}
        isStartControls={state.isStartControls}
        isViewerActive={state.isViewerActive}
        currentIndex={state.currentIndex}
        dispatch={dispatch}
        portalRef={portalRef}
        introductionRef={introductionRef}
        controlsRef={controlsRef}
        toggleButtonRef={toggleButtonRef}
      />

      <PageHeader
        id="3d-page-header"
        figureClassName={s.figure}
        figcaptionClassName={s.figcaption}
      >
        <Portal
          content={content}
          portalRef={portalRef}
          isLoading={state.isLoading}
        />
      </PageHeader>

      <Introduction
        content={content}
        introductionRef={introductionRef}
        isLoading={state.isLoading}
        isViewerActive={state.isViewerActive}
        isFingerVisible={state.isFingerVisible}
        toggleButtonRef={toggleButtonRef}
        dispatch={dispatch}
      />

      <Controls
        content={content}
        controlsRef={controlsRef}
        currentIndex={state.currentIndex}
        isLoading={state.isLoading}
        dispatch={dispatch}
      />
    </>
  );
};

export default WorkThreeDClient;
