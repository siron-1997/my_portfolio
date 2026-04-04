import sgMail from '@sendgrid/mail';
import { NextRequest, NextResponse } from 'next/server';
import { InquiryPayload } from '@/types/api';
import { LOG_MESSAGES } from '@/constants/api';
import { API_ALLOWED_KEYS } from '@/constants/api';

export async function POST(request: NextRequest) {
  const apiName = 'SendGrid API - Email Sending';
  const isDevelopment = process.env.NODE_ENV === 'development';
  const apiKey = process.env.SENDGRID_API_KEY;
  const myName = process.env.MY_NAME || 'Default Name';
  const myEmail = process.env.MY_EMAIL || 'default@example.com';

  /** 開発環境の場合 */
  if (isDevelopment) console.log(`${apiName}: 取得開始...`);

  /** 環境変数に API キーが設定されているか確認 */
  if (!apiKey) {
    if (isDevelopment) {
      console.error(LOG_MESSAGES.MISSING_ENV_VARIABLE('SENDGRID_API_KEY'));
    }
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  /** SendGrid の API キーを設定 */
  sgMail.setApiKey(apiKey);

  try {
    const data: InquiryPayload = await request.json();

    /** 許可されたリクエストキーを検証 */
    const invalidKeys = Object.keys(data).filter(
      (key) => !API_ALLOWED_KEYS.SENDGRID.includes(key),
    );
    if (invalidKeys.length > 0) {
      if (isDevelopment) {
        console.error(LOG_MESSAGES.INVALID_KEYS(apiName, invalidKeys));
      }
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    /** メールアドレスが存在しない場合はエラーを返す */
    if (!data.email) {
      if (isDevelopment) {
        console.error(LOG_MESSAGES.SENDGRID_MISSING_EMAIL(apiName));
      }
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    /** 自動返信メッセージの設定 */
    const autoReplyMsg = {
      to: data.email,
      from: { email: myEmail, name: myName },
      subject: 'Junpei Oue へのお問い合わせメール',
      html: `
                <p>${data.name || 'お客様'} 様</p>
                <p>お問い合せいただき、ありがとうございます。</p>
                <p>以下の内容を受け付けました。</p>
                <p>
                    ${data.name ? `お名前： ${data.name}<br/>` : ''}
                    メール： ${data.email}<br/>
                    ${data.message ? `メッセージ： ${data.message}<br/>` : ''}
                </p>
                <p>サーバートラブルなどにより、メールが正常に送付されないことがあります。</p>
                <p>その際には ${myEmail} にお問い合わせください。</p>
                <hr/>
                <p>${myName}</p>
                <p>Email: ${myEmail}</p>
            `,
    };

    /** 問い合わせ内容を運営側に送信するメッセージの設定 */
    const inquiryMsg = {
      to: myEmail,
      from: { email: myEmail, name: 'Portfolio System' },
      replyTo: { email: data.email, name: data.name || '匿名' },
      subject: 'Portfolio からのお問合せ',
      html: `
                <p>${data.name || '匿名'} さんから以下の内容を受信しました。</p>
                <p>=======================================================================================</p>
                <p>
                    ${data.name ? `お名前： ${data.name}<br/>` : ''}
                    メール： ${data.email}<br/>
                    ${data.message ? `メッセージ： ${data.message}<br/>` : ''}
                </p>
                <p>=======================================================================================</p>
            `,
    };

    /** 自動返信メールを送信 */
    await sgMail.send(autoReplyMsg);
    if (isDevelopment) {
      console.log(LOG_MESSAGES.SENDGRID_EMAIL_SENT(apiName, data.email));
    }

    /** 問い合わせ内容を運営側に送信 */
    await sgMail.send(inquiryMsg);
    if (isDevelopment) {
      console.log(LOG_MESSAGES.SENDGRID_EMAIL_SENT(apiName, myEmail));
    }

    return NextResponse.json({ message: 'Emails sent successfully' }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (isDevelopment) {
        console.error(LOG_MESSAGES.SENDGRID_ERROR(apiName, error.message));
      }
      return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
    } else {
      if (isDevelopment) {
        console.error(LOG_MESSAGES.SENDGRID_ERROR(apiName, 'An unknown error occurred'));
      }
      return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
    }
  }
}
