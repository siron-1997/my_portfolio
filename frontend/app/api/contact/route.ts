import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { InquiryPayload } from '@/types/api';
import { LOG_MESSAGES, API_ALLOWED_KEYS } from '@/constants/api';

/** ユーザー入力値をメール HTML に埋め込む前にエスケープする */
const escapeHtml = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export async function POST(request: NextRequest) {
  const apiName = 'Resend API - Email Sending';
  const isDevelopment = process.env.NODE_ENV === 'development';
  const apiKey = process.env.RESEND_API_KEY;
  const myName = process.env.MY_NAME || 'Default Name';
  const myEmail = process.env.MY_EMAIL || 'default@example.com';

  /** 開発環境の場合 */
  if (isDevelopment) console.log(`${apiName}: 取得開始...`);

  /** 環境変数に API キーが設定されているか確認 */
  if (!apiKey) {
    if (isDevelopment) {
      console.error(LOG_MESSAGES.MISSING_ENV_VARIABLE('RESEND_API_KEY'));
    }
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  /** 送信元アドレス（Resend で認証済みのドメイン、またはテスト用 onboarding@resend.dev） */
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  try {
    const data: InquiryPayload = await request.json();

    /** 許可されたリクエストキーを検証 */
    const invalidKeys = Object.keys(data).filter(
      (key) => !API_ALLOWED_KEYS.RESEND.includes(key),
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
        console.error(LOG_MESSAGES.RESEND_MISSING_EMAIL(apiName));
      }
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    /** 自動返信メールを送信 */
    const autoReplyResult = await resend.emails.send({
      to: data.email,
      from: `${escapeHtml(myName)} <${fromEmail}>`,
      subject: 'Junpei Oue へのお問い合わせメール',
      html: `
        <p>${escapeHtml(data.name || 'お客様')} 様</p>
        <p>お問い合せいただき、ありがとうございます。</p>
        <p>以下の内容を受け付けました。</p>
        <p>
          ${data.name ? `お名前： ${escapeHtml(data.name)}<br/>` : ''}
          メール： ${escapeHtml(data.email)}<br/>
          ${data.message ? `メッセージ： ${escapeHtml(data.message)}<br/>` : ''}
        </p>
        <p>サーバートラブルなどにより、メールが正常に送付されないことがあります。</p>
        <p>その際には ${escapeHtml(myEmail)} にお問い合わせください。</p>
        <hr/>
        <p>${escapeHtml(myName)}</p>
        <p>Email: ${escapeHtml(myEmail)}</p>
      `,
    });

    if (autoReplyResult.error) {
      throw new Error(autoReplyResult.error.message);
    }

    if (isDevelopment) {
      console.log(LOG_MESSAGES.RESEND_EMAIL_SENT(apiName, data.email));
    }

    /** 問い合わせ内容を運営側に送信 */
    const inquiryResult = await resend.emails.send({
      to: myEmail,
      from: `Portfolio System <${fromEmail}>`,
      replyTo: data.email,
      subject: 'Portfolio からのお問合せ',
      html: `
        <p>${escapeHtml(data.name || '匿名')} さんから以下の内容を受信しました。</p>
        <p>=======================================================================================</p>
        <p>
          ${data.name ? `お名前： ${escapeHtml(data.name)}<br/>` : ''}
          メール： ${escapeHtml(data.email)}<br/>
          ${data.message ? `メッセージ： ${escapeHtml(data.message)}<br/>` : ''}
        </p>
        <p>=======================================================================================</p>
      `,
    });

    if (inquiryResult.error) {
      throw new Error(inquiryResult.error.message);
    }

    if (isDevelopment) {
      console.log(LOG_MESSAGES.RESEND_EMAIL_SENT(apiName, myEmail));
    }

    return NextResponse.json({ message: 'Emails sent successfully' }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    if (isDevelopment) {
      console.error(LOG_MESSAGES.RESEND_ERROR(apiName, message));
    }
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}
