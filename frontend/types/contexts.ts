import React from 'react';
import { FormStep } from '@/types/common';
import { WorkCategory } from '@/types/api';

export type ContactFormAction =
  | { type: 'CHANGE_NAME'; payload: { value: string; isValid: boolean } }
  | {
      type: 'CHANGE_EMAIL';
      payload: { value: string; isValid: boolean; errorMessage: string };
    }
  | { type: 'CHANGE_MESSAGE'; payload: { value: string; isValid: boolean } }
  | { type: 'SET_EMAIL_ERROR_MESSAGE'; payload: string }
  | { type: 'SET_FORM_STEP'; payload: FormStep }
  | { type: 'SET_VALIDATION_ERROR'; payload: boolean }
  | { type: 'SET_INITIAL_VALIDATION_CHECK'; payload: boolean }
  | { type: 'START_SENDING' }
  | { type: 'FINISH_SENDING'; payload: { isSended: boolean | undefined } };

export type HomeContextType = {
  portalRef: React.MutableRefObject<HTMLDivElement>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ContactFormContextType = {
  name: string;
  email: string;
  message: string;
  isNotNameEmpty: boolean;
  isNotEmailValid: boolean;
  emailErrorMessage: string;
  isNotMessageEmpty: boolean;
  isSending: boolean;
  isSended: boolean | undefined;
  formStep: FormStep;
  isValidationError: boolean;
  isInitialValidationCheck: boolean;
  dispatch: React.Dispatch<ContactFormAction>;
};

/**
 * 3D作品ビュワーで管理する状態。
 * useReducer に渡す state の型。
 */
export type WorkThreeDState = {
  /** 3Dモデルのロード中フラグ */
  isLoading: boolean;

  /** 初期コントロール状態フラグ（Controls セクションに入る前の初期状態） */
  isInitialControl: boolean;

  /** コントロール開始フラグ（Controls セクションに到達したとき true になる） */
  isStartControls: boolean;

  /** 指アイコン表示フラグ */
  isFingerVisible: boolean;

  /** ビュワーアクティブフラグ（ビュワーモード中は true） */
  isViewerActive: boolean;

  /** 現在選択中のコントロールインデックス */
  currentIndex: number;
};

/**
 * WorkThreeDContext で useReducer に渡すアクションの Union 型。
 * TOGGLE_VIEWER は isFingerVisible と isViewerActive を同時更新する。
 * NAVIGATE_TO は isInitialControl を false にし currentIndex を更新する。
 */
export type WorkThreeDAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_INITIAL_CONTROL'; payload: boolean }
  | { type: 'SET_START_CONTROLS'; payload: boolean }
  | { type: 'SET_FINGER_VISIBLE'; payload: boolean }
  | { type: 'SET_VIEWER_ACTIVE'; payload: boolean }
  | { type: 'SET_CURRENT_INDEX'; payload: number }
  /** isFingerVisible と isViewerActive を同一 payload で同時更新する */
  | { type: 'TOGGLE_VIEWER'; payload: boolean }
  /** isInitialControl を false にし currentIndex を payload に更新する */
  | { type: 'NAVIGATE_TO'; payload: number };

/**
 * 3D作品ビュワーで使用する DOM ref 群。
 */
export type WorkThreeDRefs = {
  /** Portal セクションのルート要素の ref */
  portalRef: React.MutableRefObject<HTMLElement>;

  /** Introduction セクションのルート要素の ref */
  introductionRef: React.MutableRefObject<HTMLDivElement>;

  /** Controls セクションのルート要素の ref */
  controlsRef: React.MutableRefObject<HTMLDivElement>;

  /** ビュワー切り替えトグルボタンの ref */
  toggleButtonRef: React.MutableRefObject<HTMLDivElement>;
};

/**
 * WorkThreeDContext の公開型。
 * state と dispatch、ref 群の 3 点のみを外部に露出する。
 */
export type WorkThreeDContextType = {
  /** 3D作品ビュワーの状態 */
  state: WorkThreeDState;

  /** 状態更新ディスパッチ関数 */
  dispatch: React.Dispatch<WorkThreeDAction>;

  /** DOM ref 群 */
  refs: WorkThreeDRefs;
};

export type PageHeaderContextType = {
  pageHeaderRef: React.MutableRefObject<HTMLElement>;
};

export type WorksContextType = {
  categories: WorkCategory[];
  setCategories: React.Dispatch<React.SetStateAction<WorkCategory[]>>;
};
