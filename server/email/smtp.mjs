// Минимальная отправка письма через SMTP (Gmail: smtp.gmail.com:465, TLS сразу).
// Без зависимостей. Поддерживает AUTH LOGIN и письмо HTML + текстовая версия.
import tls from 'node:tls';
import net from 'node:net';
import crypto from 'node:crypto';

const b64 = (s) => Buffer.from(s, 'utf8').toString('base64');
const encWord = (s) => `=?UTF-8?B?${b64(s)}?=`;
const wrap76 = (s) => s.replace(/.{1,76}/g, '$&\r\n');

export function buildMessage({ fromName, from, to, replyTo, subject, html, text }) {
  const boundary = 'sq_' + crypto.randomBytes(12).toString('hex');
  const domain = from.split('@')[1];
  const headers = [
    `From: ${encWord(fromName)} <${from}>`,
    `To: <${to}>`,
    replyTo ? `Reply-To: <${replyTo}>` : null,
    `Subject: ${encWord(subject)}`,
    `Date: ${new Date().toUTCString().replace('GMT', '+0000')}`,
    `Message-ID: <${crypto.randomUUID()}@${domain}>`,
    `List-Unsubscribe: <mailto:${replyTo || from}?subject=${encodeURIComponent('Отписаться')}>`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ].filter(Boolean);
  const part = (type, body) => [
    `--${boundary}`,
    `Content-Type: ${type}; charset=UTF-8`,
    'Content-Transfer-Encoding: base64',
    '',
    wrap76(b64(body)),
  ].join('\r\n');
  return headers.join('\r\n') + '\r\n\r\n' + part('text/plain', text) + '\r\n' + part('text/html', html) + `\r\n--${boundary}--\r\n`;
}

export function sendMail({ host, port = 465, secure = true, user, pass, from, to, message, timeoutMs = 20000 }) {
  return new Promise((resolve, reject) => {
    const sock = secure ? tls.connect({ host, port, servername: host }) : net.connect({ host, port });
    sock.setEncoding('utf8');
    sock.setTimeout(timeoutMs, () => { sock.destroy(); reject(new Error('smtp timeout')); });
    sock.on('error', reject);

    let buf = '';
    const queue = [];
    sock.on('data', (chunk) => {
      buf += chunk;
      // ответ SMTP закончен, когда последняя строка вида «250 текст» (пробел после кода)
      const lines = buf.split('\r\n');
      buf = lines.pop();
      for (const line of lines) {
        if (/^\d{3} /.test(line)) { const w = queue.shift(); if (w) w(line); }
        else if (!/^\d{3}-/.test(line)) { /* пустая строка */ }
      }
    });
    const expect = (codes) => new Promise((res, rej) => queue.push((line) => (codes.includes(+line.slice(0, 3)) ? res(line) : rej(new Error('smtp: ' + line)))));
    const cmd = (line, codes) => { const p = expect(codes); sock.write(line + '\r\n'); return p; };

    (async () => {
      await expect([220]);
      await cmd('EHLO squadup.ru', [250]);
      await cmd('AUTH LOGIN', [334]);
      await cmd(b64(user), [334]);
      await cmd(b64(pass), [235]);
      await cmd(`MAIL FROM:<${from}>`, [250]);
      await cmd(`RCPT TO:<${to}>`, [250, 251]);
      await cmd('DATA', [354]);
      const body = message.replace(/\r\n\./g, '\r\n..');
      await cmd(body + '\r\n.', [250]);
      await cmd('QUIT', [221]).catch(() => {});
      sock.end();
      resolve();
    })().catch((e) => { sock.destroy(); reject(e); });
  });
}
