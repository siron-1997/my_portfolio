'use client';

import React, { useReducer, useContext } from 'react';
import { FormStep } from '@/types/common';
import { ContactFormContextType, ContactFormAction } from '@/types/contexts';

type ContactFormState = Omit<ContactFormContextType, 'dispatch'>;

const initialState: ContactFormState = {
  name: '',
  email: '',
  message: '',
  isNotNameEmpty: false,
  isNotEmailValid: false,
  emailErrorMessage: '',
  isNotMessageEmpty: false,
  isSending: false,
  isSended: undefined,
  formStep: 'FIRST_STEP',
  isValidationError: false,
  isInitialValidationCheck: false,
};

const contactFormReducer = (
  state: ContactFormState,
  action: ContactFormAction,
): ContactFormState => {
  switch (action.type) {
    case 'CHANGE_NAME':
      return {
        ...state,
        name: action.payload.value,
        isNotNameEmpty: action.payload.isValid,
      };
    case 'CHANGE_EMAIL':
      return {
        ...state,
        email: action.payload.value,
        isNotEmailValid: action.payload.isValid,
        emailErrorMessage: action.payload.errorMessage,
      };
    case 'CHANGE_MESSAGE':
      return {
        ...state,
        message: action.payload.value,
        isNotMessageEmpty: action.payload.isValid,
      };
    case 'SET_EMAIL_ERROR_MESSAGE':
      return { ...state, emailErrorMessage: action.payload };
    case 'SET_FORM_STEP':
      return { ...state, formStep: action.payload };
    case 'SET_VALIDATION_ERROR':
      return { ...state, isValidationError: action.payload };
    case 'SET_INITIAL_VALIDATION_CHECK':
      return { ...state, isInitialValidationCheck: action.payload };
    case 'START_SENDING':
      return { ...state, isSending: true };
    case 'FINISH_SENDING':
      return {
        ...state,
        isSending: false,
        formStep: 'LAST_STEP',
        isSended: action.payload.isSended,
      };
    default:
      return state;
  }
};

type Props = {
  children: React.ReactNode;
};

const ContactFormContext = React.createContext<ContactFormContextType | undefined>(
  undefined,
);

export const ContactFormProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(contactFormReducer, initialState);

  return (
    <ContactFormContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ContactFormContext.Provider>
  );
};

export const useContactFormContext = (): ContactFormContextType => {
  const context = useContext(ContactFormContext);
  if (!context) {
    throw new Error('useContactFormContext must be used within a ContactFormProvider');
  }
  return context;
};
