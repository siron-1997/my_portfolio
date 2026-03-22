'use client';

import Link from 'next/link';
import React from 'react';
import { Typography } from '@mui/material';
import { Button } from '@/components/common';
import { InputFields } from '@/components/contact/InputFields';
import { APP_THEME_COLORS } from '@/constants/colors';
import useContactForm from './useContactForm';
import s from '@/styles/contact/ContactForm.module.css';

const ContactForm = () => {
  const {
    isSended,
    classNames,
    formStep,
    sendMessage,
    handleEndInput,
    handleGoBackToInput,
    handleSubmit,
  } = useContactForm();

  return (
    <div className={s.form_container}>
      <div
        className={classNames}
        style={{ backgroundColor: APP_THEME_COLORS.bgColor.dark.sub }}
      >
        {formStep !== 'LAST_STEP' ? (
          <form className={s.form} onSubmit={handleSubmit} name="form">
            <InputFields />
            <div className={s.btn_container}>
              {formStep === 'SECOND_STEP' ? (
                <>
                  <Button type="button" onClick={handleGoBackToInput}>
                    修正する
                  </Button>
                  <Button type="submit">送信</Button>
                </>
              ) : (
                <Button type="button" onClick={handleEndInput}>
                  入力内容の確認
                </Button>
              )}
            </div>
          </form>
        ) : (
          <>
            <div className={s.txt_container}>
              <Typography component="h3" variant="h3">
                {sendMessage.title}
              </Typography>
              <Typography component="p" variant="p">
                {sendMessage.description}
              </Typography>
              <br />
              {isSended && (
                <>
                  <Typography component="p" variant="p">
                    土日祝を除き、1～2日以内にご返信しています。
                  </Typography>
                  <Typography component="p" variant="p">
                    サーバートラブルなどにより、メールが正常に送付されないことがあります。
                  </Typography>
                  <Typography component="p" variant="p">
                    その際は junpei.oue@gmail.com に直接お問い合わせください。
                  </Typography>
                </>
              )}
            </div>
            <div className={s.btn_container}>
              <Link href="/">
                <Button>Homeへ戻る</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
