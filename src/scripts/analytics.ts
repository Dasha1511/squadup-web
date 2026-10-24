/**
 * Согласие на cookies и счётчики статистики Squadup.
 * До нажатия «Принять» ни один внешний счётчик не загружается.
 * Счётчики: LiveInternet (ЛР №3), Рамблер/топ-100 (ЛР №4), MyTracker / Top.Mail.Ru (ЛР №5).
 */

type Cfg = {
  liveinternet: { enabled: boolean; type: string; title: string };
  rambler: { projectId: string; blockAttribute: string; trackHashes: boolean };
  mytracker: { counterId: string; logoSrc: string; logoHref: string };
};

type Params = Record<string, string | number | boolean>;

declare global {
  interface Window {
    _top100q?: Array<() => void>;
    top100Counter?: { trackEvent: (name: string, data?: object) => void };
    top100?: new (opts: object) => Window['top100Counter'];
    _tmr?: Array<object>;
    sqAnalytics?: { consent: string | null; loaded: string[]; events: Array<{ name: string; params: Params; at: string; sentTo: string[] }>; track: typeof track };
  }
}

const KEY = 'sq_consent_v1';
const cfg: Cfg = JSON.parse(document.getElementById('sq-analytics-config')?.textContent || '{}');
const debug = /[?&]sqdebug=1/.test(location.search) || safeGet('sq_debug') === '1';
const loaded: string[] = [];
const events: NonNullable<Window['sqAnalytics']>['events'] = [];
const pendingRambler: Array<[string, Params]> = [];

function safeGet(k: string): string | null {
  try { return localStorage.getItem(k); } catch { return null; }
}
function safeSet(k: string, v: string) {
  try { localStorage.setItem(k, v); } catch { /* приватный режим — согласие живёт до перезагрузки */ }
}
function log(...a: unknown[]) { if (debug) console.info('[squadup-analytics]', ...a); }

let consent: string | null = safeGet(KEY);

function showSlot(name: string) {
  const el = document.querySelector<HTMLElement>(`[data-counter="${name}"]`);
  if (el) el.hidden = false;
  return el;
}

function insertScript(src: string, id: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement('script');
  s.async = true; s.src = src; s.id = id;
  document.head.appendChild(s);
}

/* ---------- LiveInternet ---------- */
function loadLiveInternet() {
  if (!cfg.liveinternet?.enabled) return;
  const img = document.getElementById('licnt') as HTMLImageElement | null;
  if (!img) return;
  const s = screen;
  img.title = cfg.liveinternet.title;
  img.src = 'https://counter.yadro.ru/hit?' + cfg.liveinternet.type +
    ';r' + escape(document.referrer) +
    ';s' + s.width + '*' + s.height + '*' + (s.colorDepth || (s as Screen & { pixelDepth?: number }).pixelDepth) +
    ';u' + escape(document.URL) +
    ';h' + escape(document.title.substring(0, 150)) +
    ';' + Math.random();
  showSlot('liveinternet');
  loaded.push('liveinternet');
}

/* ---------- Рамблер/топ-100 ---------- */
function loadRambler() {
  const id = cfg.rambler?.projectId;
  if (!id) return;
  const w = window;
  (w._top100q = w._top100q || []).push(function () {
    try {
      w.top100Counter = new w.top100!({
        project: Number(id),
        element: 'top100_widget',
        trackHashes: cfg.rambler.trackHashes,
        attributes_dataset: [cfg.rambler.blockAttribute],
      });
      flushRambler();
    } catch (e) { log('top100 init error', e); }
  });
  insertScript('https://st.top100.ru/top100/top100.js', 'top100-js');
  showSlot('rambler');
  loaded.push('rambler');
}
function flushRambler() {
  while (pendingRambler.length && window.top100Counter) {
    const [n, p] = pendingRambler.shift()!;
    window.top100Counter.trackEvent(n, p);
    log('rambler event sent', n, p);
  }
}

/* ---------- MyTracker / Top.Mail.Ru ---------- */
function loadMyTracker() {
  const id = cfg.mytracker?.counterId;
  if (!id) return;
  const t = (window._tmr = window._tmr || []);
  t.push({ id, type: 'pageView', start: Date.now() });
  insertScript('https://top-fwz1.mail.ru/js/code.js', 'tmr-code');
  const slot = showSlot('mytracker');
  if (slot && !slot.firstChild) {
    const a = document.createElement('a');
    a.target = '_blank'; a.rel = 'noopener';
    if (cfg.mytracker.logoSrc) {
      // Логотип счётчика от сервиса
      a.href = cfg.mytracker.logoHref || `https://top-fwz1.mail.ru/jump?from=${id}`;
      const img = document.createElement('img');
      img.src = cfg.mytracker.logoSrc; img.width = 88; img.height = 31; img.alt = 'Top.Mail.Ru'; img.style.border = '0';
      a.appendChild(img);
    } else {
      // MyTracker не выдаёт логотип — показываем собственный значок 88×31 в стиле сайта
      a.href = 'https://tracker.my.com/';
      a.className = 'mt-badge';
      a.title = 'Статистика сайта: MyTracker';
      a.innerHTML = '<span class="mt-badge__dot"></span><span class="mt-badge__txt"><b>MyTracker</b><small>статистика</small></span>';
    }
    slot.appendChild(a);
  }
  loaded.push('mytracker');
}

function loadAll() {
  if (loaded.length) return;
  loadLiveInternet();
  loadRambler();
  loadMyTracker();
  log('counters loaded:', loaded);
}

/* ---------- События ---------- */
export function track(name: string, params: Params = {}) {
  const p: Params = { page: location.pathname, ...params };
  const sentTo: string[] = [];
  if (consent === 'granted') {
    if (cfg.rambler?.projectId) {
      pendingRambler.push([name, p]);
      flushRambler();
      sentTo.push('rambler');
    }
    if (cfg.mytracker?.counterId) {
      window._tmr = window._tmr || [];
      window._tmr.push({ id: cfg.mytracker.counterId, type: 'reachGoal', goal: name, params: p });
      sentTo.push('mytracker');
    }
  }
  events.push({ name, params: p, at: new Date().toISOString(), sentTo });
  log('event', name, p, sentTo.length ? '→ ' + sentTo.join(', ') : '(без согласия — не отправлено)');
}

// Счётчик Рамблера может загрузиться позже клика — досылаем события
const ramblerWait = setInterval(() => { if (window.top100Counter) { flushRambler(); } }, 1000);
setTimeout(() => clearInterval(ramblerWait), 20000);

document.addEventListener('click', (e) => {
  const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]');
  if (!el) return;
  const params: Params = {};
  if (el.dataset.trackPlace) params.place = el.dataset.trackPlace;
  track(el.dataset.track!, params);
});

document.querySelectorAll<HTMLDetailsElement>('details[data-track-open]').forEach((d) => {
  d.addEventListener('toggle', () => { if (d.open) track(d.dataset.trackOpen!, { question: d.id || '' }); });
});

/* ---------- Баннер согласия ---------- */
const banner = document.getElementById('cookie-banner');
function setConsent(v: 'granted' | 'denied') {
  const prev = consent;
  consent = v;
  safeSet(KEY, v);
  if (banner) banner.hidden = true;
  if (v === 'granted') loadAll();
  // Отзыв согласия: перезагружаем страницу, чтобы выгрузить уже подключённые счётчики
  if (v === 'denied' && prev === 'granted') location.reload();
}
banner?.querySelectorAll<HTMLButtonElement>('[data-consent]').forEach((b) =>
  b.addEventListener('click', () => setConsent(b.dataset.consent as 'granted' | 'denied')),
);
document.querySelectorAll('[data-open-consent]').forEach((b) =>
  b.addEventListener('click', () => { if (banner) banner.hidden = false; }),
);

if (consent === 'granted') loadAll();
else if (consent !== 'denied' && banner) banner.hidden = false;

window.sqAnalytics = { get consent() { return consent; }, loaded, events, track } as Window['sqAnalytics'];
