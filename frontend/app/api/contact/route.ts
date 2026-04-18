import { type NextRequest, NextResponse } from 'next/server';

import { Resend } from 'resend';

import { API_ALLOWED_KEYS, LOG_MESSAGES } from '@/constants/api';
import { IS_DEV } from '@/constants/common';
import { type InquiryPayload } from '@/types/api';

/**
 * ユーザー入力値をメール HTML 本文に埋め込む前にエスケープする処理
 * XSS 対策としてメール本文（html:）にのみ適用し、ヘッダーには使用しない。
 *
 * @param str - エスケープ対象の文字列
 * @returns HTML エスケープ済みの文字列
 */
const escapeHtml = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * お問い合わせメールを送信する API エンドポイント
 * 送信者への自動返信メールと、運営側への問い合わせ通知メールの 2 通を Resend 経由で送信する。
 * 開発環境では実際の送信をスキップしてログのみ出力する。
 *
 * @param request - クライアントからのリクエストオブジェクト
 * @returns NextResponse オブジェクト
 * @throws 400 - 許可されていないキー、メールアドレス未指定
 * @throws 500 - API キー未設定、メール送信失敗
 */
export async function POST(request: NextRequest) {
  const apiName = 'Resend API - Email Sending';

  if (IS_DEV) console.info(`${apiName}: 取得開始...`);

  try {
    const data: InquiryPayload = await request.json();

    /** 許可されたリクエストキーを検証 */
    const invalidKeys = Object.keys(data).filter(
      (key) => !API_ALLOWED_KEYS.RESEND.includes(key),
    );
    if (invalidKeys.length > 0) {
      if (IS_DEV) {
        console.error(LOG_MESSAGES.INVALID_KEYS(apiName, invalidKeys));
      }
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 },
      );
    }

    /** メールアドレスが存在しない場合はエラーを返す */
    if (!data.email) {
      if (IS_DEV) {
        console.error(LOG_MESSAGES.RESEND_MISSING_EMAIL(apiName));
      }
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 },
      );
    }

    /**
     * 開発環境では Resend API を実際に呼び出さず、ログのみ出力してスキップする。
     * Resend の無料プランは未認証アドレスへの送信が制限されるため、
     * 開発時に不要なエラーが発生するのを防ぐ。
     */
    if (IS_DEV) {
      console.info(`${apiName}: 開発環境のためメール送信をスキップ`, {
        to: data.email,
        name: data.name,
        message: data.message,
      });
      return NextResponse.json(
        { message: 'Emails sent successfully' },
        { status: 200 },
      );
    }

    /** 環境変数に API キーが設定されているか確認（本番環境のみ必要） */
    const apiKey = process.env.RESEND_API_KEY;
    const myName = process.env.MY_NAME || 'Default Name';
    const myEmail = process.env.MY_EMAIL || 'default@example.com';

    if (!apiKey) {
      console.error(LOG_MESSAGES.MISSING_ENV_VARIABLE('RESEND_API_KEY'));
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 },
      );
    }

    /** Resend クライアントの初期化 */
    const resend = new Resend(apiKey);

    /** 送信元アドレス（Resend で認証済みのドメイン、またはテスト用 onboarding@resend.dev） */
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    /** 自動返信メールを送信 */
    const autoReplyResult = await resend.emails.send({
      to: data.email,
      from: `${myName} <${fromEmail}>`,
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

    /** 自動返信メールの送信結果を確認 */
    if (autoReplyResult.error) {
      throw new Error(autoReplyResult.error.message);
    }

    console.info(LOG_MESSAGES.RESEND_EMAIL_SENT(apiName, data.email));

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

    /** 運営側への問い合わせメールの送信結果を確認 */
    if (inquiryResult.error) {
      throw new Error(inquiryResult.error.message);
    }

    console.info(LOG_MESSAGES.RESEND_EMAIL_SENT(apiName, myEmail));

    return NextResponse.json(
      { message: 'Emails sent successfully' },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (IS_DEV) {
      console.error(
        LOG_MESSAGES.RESEND_ERROR(
          apiName,
          error instanceof Error ? error.message : 'An unknown error occurred',
        ),
      );
    }
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 },
    );
  }
}
