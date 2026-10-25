// Письмо-визитка новому подписчику (вариант C — «Светлое письмо»).
// Настройки берутся из /etc/squadup-subscribe.env (см. deploy/setup-mail.sh).
import { variantC, plainText, SUBJECT } from './templates.mjs';
import { buildMessage, sendMail } from './smtp.mjs';
import fs from 'node:fs';

const LOGO = fs.readFileSync(new URL('./logo.png', import.meta.url));

const ASSETS = 'https://squadup.ru/email/';

export const mailConfigured = () => Boolean(process.env.MAIL_USER && process.env.MAIL_PASS);

export async function sendWelcome(to) {
  const user = process.env.MAIL_USER;
  const message = buildMessage({
    fromName: process.env.MAIL_FROM_NAME || 'SquadUp',
    from: user,
    to,
    replyTo: user,
    subject: SUBJECT,
    html: variantC((name) => (name === 'logo.png' ? 'cid:logo@squadup' : ASSETS + name)),
    inline: [{ cid: 'logo@squadup', filename: 'squadup-logo.png', type: 'image/png', content: LOGO }],
    text: plainText(),
  });
  await sendMail({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.MAIL_PORT || 465),
    secure: (process.env.MAIL_PORT || '465') === '465' && process.env.MAIL_SECURE !== 'false',
    starttls: process.env.MAIL_PORT === '587',
    user,
    pass: String(process.env.MAIL_PASS).replace(/\s+/g, ''),
    from: user,
    to,
    message,
  });
}
