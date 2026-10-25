// Обработчик формы «Узнать о запуске» для squadup.ru.
// Без зависимостей: node server/subscribe-server.mjs
// Слушает только 127.0.0.1 — снаружи доступен через nginx (location /api/).
// Адреса пишутся в data/subscribers.jsonl (одна строка JSON на подписку).

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import dns from 'node:dns/promises';
import { fileURLToPath } from 'node:url';

const HOST = process.env.SUB_HOST || '127.0.0.1';
const PORT = Number(process.env.SUB_PORT || 8787);
const DATA_DIR = process.env.SUB_DATA_DIR || path.join(path.dirname(fileURLToPath(import.meta.url)), 'data');
const FILE = path.join(DATA_DIR, 'subscribers.jsonl');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_BODY = 2048;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });

const known = new Set();
if (fs.existsSync(FILE)) {
  for (const line of fs.readFileSync(FILE, 'utf8').split('\n')) {
    try { known.add(JSON.parse(line).email); } catch { /* пустая строка */ }
  }
}

const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX_PER_WINDOW;
}

// Проверка, что у домена почты есть почтовый сервер (MX или хотя бы A-запись).
// Ловит опечатки вроде name@gmail.con. При сбое DNS не мешаем подписке.
async function domainCanReceiveMail(domain) {
  const ok = await domainLookup(domain);
  if (ok) return true;
  // Если DNS на сервере не работает вовсе, не отказываем никому
  return !(await domainLookup('gmail.com'));
}

async function domainLookup(domain) {
  const timeout = new Promise((r) => setTimeout(() => r('timeout'), 3000));
  const check = (async () => {
    try { if ((await dns.resolveMx(domain)).length) return true; } catch (e) {
      if (!['ENOTFOUND', 'ENODATA'].includes(e.code)) return true;
    }
    try { return (await dns.resolve4(domain)).length > 0; } catch (e) {
      return !['ENOTFOUND', 'ENODATA'].includes(e.code);
    }
  })();
  const r = await Promise.race([check, timeout]);
  return r === 'timeout' ? true : r;
}

function send(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(obj));
}

const server = http.createServer((req, res) => {
  if (req.url !== '/api/subscribe') return send(res, 404, { ok: false });
  if (req.method !== 'POST') return send(res, 405, { ok: false });
  const ip = String(req.headers['x-real-ip'] || req.socket.remoteAddress || '');
  if (limited(ip)) return send(res, 429, { ok: false, error: 'too_many_requests' });

  let body = '';
  req.on('data', (c) => {
    body += c;
    if (body.length > MAX_BODY) { send(res, 413, { ok: false }); req.destroy(); }
  });
  req.on('end', async () => {
    if (res.writableEnded) return;
    let data;
    try { data = JSON.parse(body); } catch { return send(res, 400, { ok: false, error: 'bad_json' }); }
    // Ловушка для ботов: настоящий посетитель это поле не видит
    if (data.company) return send(res, 200, { ok: true });
    const email = String(data.email || '').trim().toLowerCase();
    if (!EMAIL_RE.test(email) || email.length > 254) return send(res, 400, { ok: false, error: 'bad_email' });
    if (data.consent !== true) return send(res, 400, { ok: false, error: 'no_consent' });
    if (known.has(email)) return send(res, 409, { ok: false, error: 'already_subscribed' });
    if (!(await domainCanReceiveMail(email.split('@')[1]))) return send(res, 400, { ok: false, error: 'bad_domain' });
    if (known.has(email)) return send(res, 409, { ok: false, error: 'already_subscribed' });
    known.add(email);
    const row = {
      email,
      consent: true,
      consent_text_version: '2026-10-24',
      place: String(data.place || '').slice(0, 40),
      page: String(data.page || '').slice(0, 120),
      created_at: new Date().toISOString(),
    };
    fs.appendFileSync(FILE, JSON.stringify(row) + '\n', { mode: 0o600 });
    send(res, 200, { ok: true });
  });
});

server.listen(PORT, HOST, () => console.log(`subscribe-server: http://${HOST}:${PORT}/api/subscribe → ${FILE}`));
