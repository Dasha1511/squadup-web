// Письмо-визитка новому подписчику (вариант C — «Светлое письмо»).
// Настройки берутся из /etc/squadup-subscribe.env (см. deploy/setup-mail.sh).
import { variantC, plainText, SUBJECT } from './templates.mjs';
import { buildMessage, sendMail } from './smtp.mjs';

const ASSETS = 'https://squadup.ru/email/';

export const mailConfigured = () => Boolean(process.env.MAIL_USER && process.env.MAIL_PASS);

export async function sendWelcome(to) {
  const user = process.env.MAIL_USER;
  const message = buildMessage({
    fromName: process.env.MAIL_FROM_NAME || 'Squadup',
    from: user,
    to,
    replyTo: user,
    subject: SUBJECT,
    html: variantC((name) => ASSETS + name),
    text: plainText(),
  });
  await sendMail({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.MAIL_PORT || 465),
    secure: process.env.MAIL_SECURE !== 'false',
    user,
    pass: String(process.env.MAIL_PASS).replace(/\s+/g, ''),
    from: user,
    to,
    message,
  });
}
