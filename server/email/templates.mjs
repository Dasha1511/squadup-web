// Шаблоны письма-визитки SquadUp (три варианта оформления).
// Табличная вёрстка и inline-стили — так письмо одинаково выглядит в Gmail, Mail.ru, Яндексе и Outlook.
// asset(name) возвращает адрес картинки: в рассылке https://squadup.ru/email/<name>, в превью — data: URI.

const FONT = "-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const TG = 'https://t.me/SquadUp_cyber';
const SITE = 'https://squadup.ru';
export const CONTACT = process.env.MAIL_CONTACT || 'hello.squadup@gmail.com';

export const SUBJECT = 'Вы в списке первых — SquadUp';
export const PREHEADER = 'Напишем, когда SquadUp выйдет в Google Play и App Store.';

const C = {
  bg: '#0b0e14', surface: '#151a23', surface2: '#1e242e', border: '#222834',
  text: '#f2f4f8', text2: '#8b95a5', primary: '#7c5cff', primaryFill: '#6b4cf6', cyan: '#22d3ee', success: '#2bd67b',
};

function shell({ title, bodyBg, inner, preheaderColor }) {
  return `<!doctype html>
<html lang="ru" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${title}</title>
<style>
  body{margin:0;padding:0;background:${bodyBg};}
  a{text-decoration:none;}
  @media (max-width:620px){
    .w{width:100% !important;}
    .px{padding-left:20px !important;padding-right:20px !important;}
    .stack{display:block !important;width:auto !important;}
    .shot{padding:0 6px 24px !important;}
    .m-left{text-align:left !important;padding:0 20px 24px !important;}
    .m-left table{margin:0 !important;}
    .stack-gap{padding-top:16px !important;}
    .h1{font-size:28px !important;line-height:34px !important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:${bodyBg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${preheaderColor};">${PREHEADER}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${bodyBg};">
<tr><td align="center" style="padding:32px 12px;">
${inner}
</td></tr>
</table>
</body>
</html>`;
}

function footer({ color, link }) {
  return `<p style="margin:0 0 8px;font:13px/20px ${FONT};color:${color};">Вы получили это письмо, потому что оставили адрес на <a href="${SITE}" style="color:${link};">squadup.ru</a> и согласились получить уведомление о запуске.</p>
<p style="margin:0;font:13px/20px ${FONT};color:${color};">Чтобы отписаться, ответьте на это письмо словом «Отписаться». Вопросы: <a href="mailto:${CONTACT}" style="color:${link};">${CONTACT}</a> · <a href="${SITE}/privacy/" style="color:${link};">Политика конфиденциальности</a></p>`;
}

function button({ href, label, bg, color = '#ffffff', center = false }) {
  return `<table role="presentation"${center ? ' align="center" style="margin:0 auto;"' : ''} cellpadding="0" cellspacing="0" border="0"><tr>
<td align="center" bgcolor="${bg}" style="border-radius:14px;background:${bg};">
<a href="${href}" style="display:inline-block;padding:15px 28px;font:600 16px/20px ${FONT};color:${color};border-radius:14px;">${label}</a>
</td></tr></table>`;
}

function chip(label, bg, color) {
  return `<td style="padding:0 6px 6px 0;"><span style="display:inline-block;padding:6px 12px;border-radius:999px;background:${bg};font:600 13px/16px ${FONT};color:${color};white-space:nowrap;">${label}</span></td>`;
}

// Вариант A — «Карточка игрока»: письмо повторяет карточку из ленты свайпов.
export function variantA(asset) {
  const stat = (label, value) => `<td width="33%" align="center" style="padding:12px 4px;">
<div style="font:600 11px/14px ${FONT};letter-spacing:1px;text-transform:uppercase;color:${C.text2};">${label}</div>
<div style="font:700 17px/22px ${FONT};color:${C.text};padding-top:4px;">${value}</div></td>`;
  const inner = `<table role="presentation" class="w" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px;">
<tr><td align="center" style="padding:0 0 24px;"><img src="${asset('logo.png')}" width="150" alt="SquadUp" style="display:block;width:150px;height:auto;border:0;"></td></tr>
<tr><td bgcolor="${C.surface}" style="background:${C.surface};border:1px solid ${C.border};border-radius:24px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr><td class="px" style="padding:20px 28px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="font:600 15px/20px ${FONT};color:${C.text};">SquadUp</td>
      <td align="right"><span style="display:inline-block;padding:5px 12px;border-radius:999px;background:${C.surface2};border:1px solid ${C.border};font:600 12px/14px ${FONT};color:${C.text};"><span style="color:${C.success};">&#9679;</span>&nbsp; RU</span></td>
    </tr></table>
  </td></tr>
  <tr><td align="center" style="padding:28px 28px 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td align="center" width="96" height="96" bgcolor="${C.primaryFill}" style="width:96px;height:96px;border-radius:28px;background:${C.primaryFill};background-image:linear-gradient(135deg,${C.primary},#3b2bb3);">
        <div style="font:700 11px/14px ${FONT};letter-spacing:1.5px;color:#e6e0ff;">EARLY</div>
        <div style="font:800 30px/34px ${FONT};color:#ffffff;">#1</div>
      </td></tr></table>
  </td></tr>
  <tr><td align="center" class="px" style="padding:22px 28px 0;">
    <h1 class="h1" style="margin:0;font:800 32px/38px ${FONT};color:${C.text};">Вы в списке <span style="color:#a48dff;">первых</span></h1>
    <p style="margin:12px 0 0;font:15px/22px ${FONT};color:${C.text2};">Спасибо, что оставили почту. Как только SquadUp выйдет в Google Play и App Store, мы пришлём письмо со ссылками.</p>
  </td></tr>
  <tr><td class="px" style="padding:24px 28px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.surface2}" style="background:${C.surface2};border-radius:16px;"><tr>
      ${stat('Игры', '3')}${stat('В команде', '5 + 2')}${stat('Турниры', 'с призами')}
    </tr></table>
  </td></tr>
  <tr><td align="center" class="px" style="padding:20px 28px 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      ${chip('Dota 2', 'rgba(194,60,42,.18)', '#ff7a66')}${chip('League of Legends', 'rgba(47,111,224,.18)', '#5aa2ff')}${chip('CS2', 'rgba(240,185,11,.16)', '#f0b90b')}
    </tr></table>
  </td></tr>
  <tr><td class="px" style="padding:20px 28px 0;">
    <p style="margin:0 0 10px;font:15px/22px ${FONT};color:${C.text};"><span style="color:${C.cyan};">&#9679;</span>&nbsp; Ищите тиммейтов по рангу, роли и времени игры — свайпами, как в ленте.</p>
    <p style="margin:0 0 10px;font:15px/22px ${FONT};color:${C.text};"><span style="color:${C.cyan};">&#9679;</span>&nbsp; Собирайте команду до 5 игроков и до 2 запасных.</p>
    <p style="margin:0;font:15px/22px ${FONT};color:${C.text};"><span style="color:${C.cyan};">&#9679;</span>&nbsp; Записывайтесь на турниры и следите за результатами.</p>
  </td></tr>
  <tr><td align="center" style="padding:28px 28px 32px;">
    ${button({ href: TG, label: 'Новости в Telegram', bg: C.primaryFill })}
    <p style="margin:14px 0 0;font:13px/18px ${FONT};color:${C.text2};">Там первыми появятся скриншоты и дата запуска</p>
  </td></tr>
  </table>
</td></tr>
<tr><td class="px" style="padding:24px 12px 0;">${footer({ color: '#5a6473', link: C.text2 })}</td></tr>
</table>`;
  return shell({ title: SUBJECT, bodyBg: C.bg, inner, preheaderColor: C.bg });
}

// Вариант B — «Экраны приложения»: три скриншота показывают, что будет в SquadUp.
export function variantB(asset) {
  const shot = (img, title, text) => `<td class="stack shot" width="33%" valign="top" style="padding:0 6px;">
<img src="${asset(img)}" width="160" alt="${title}" style="display:block;width:100%;max-width:160px;height:auto;margin:0 auto;border:1px solid ${C.border};border-radius:18px;">
<div style="font:700 15px/20px ${FONT};color:${C.text};padding-top:12px;text-align:center;">${title}</div>
<div style="font:13px/18px ${FONT};color:${C.text2};padding-top:4px;text-align:center;">${text}</div></td>`;
  const inner = `<table role="presentation" class="w" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;">
<tr><td bgcolor="${C.surface}" style="background:${C.surface};background-image:radial-gradient(120% 70% at 50% 0%,rgba(124,92,255,.35),rgba(21,26,35,0) 70%);border-radius:28px 28px 0 0;border:1px solid ${C.border};border-bottom:0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr><td align="center" style="padding:36px 32px 0;"><img src="${asset('logo.png')}" width="120" alt="SquadUp" style="display:block;width:120px;height:auto;border:0;"></td></tr>
  <tr><td align="center" class="px" style="padding:24px 40px 0;">
    <div style="display:inline-block;padding:6px 14px;border-radius:999px;background:rgba(43,214,123,.12);border:1px solid rgba(43,214,123,.3);font:600 13px/16px ${FONT};color:${C.success};">&#10003;&nbsp; Подписка подтверждена</div>
    <h1 class="h1" style="margin:18px 0 0;font:800 34px/40px ${FONT};color:${C.text};">Скоро соберём<br>вашу команду</h1>
    <p style="margin:14px 0 0;font:16px/24px ${FONT};color:${C.text2};">SquadUp выйдет в Google Play и App Store — и вы узнаете об этом первыми. А пока посмотрите, что вас ждёт.</p>
  </td></tr>
  <tr><td style="padding:32px 18px 36px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      ${shot('feed.jpg', 'Тиммейты', 'Ранг, роль и время игры на одной карточке')}
      ${shot('team.jpg', 'Команда', 'До 5 игроков и до 2 запасных')}
      ${shot('tournaments.jpg', 'Турниры', 'Регистрация, сетка и призы')}
    </tr></table>
  </td></tr>
  </table>
</td></tr>
<tr><td bgcolor="${C.surface2}" style="background:${C.surface2};border-radius:0 0 28px 28px;border:1px solid ${C.border};border-top:0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td class="stack px" valign="middle" style="padding:24px 0 24px 32px;">
      <div style="font:700 16px/22px ${FONT};color:${C.text};">Дата запуска — в Telegram</div>
      <div style="font:14px/20px ${FONT};color:${C.text2};padding-top:4px;">Новости, скриншоты и бета-тест: t.me/SquadUp_cyber</div>
    </td>
    <td class="stack m-left" align="right" valign="middle" style="padding:24px 32px 24px 16px;">${button({ href: TG, label: 'Открыть канал', bg: C.cyan, color: '#062a33' })}</td>
  </tr></table>
</td></tr>
<tr><td class="px" style="padding:24px 16px 0;">${footer({ color: '#5a6473', link: C.text2 })}</td></tr>
</table>`;
  return shell({ title: SUBJECT, bodyBg: C.bg, inner, preheaderColor: C.bg });
}

// Вариант C — «Светлое письмо»: тёмная шапка с логотипом, дальше светлый текст.
// Самый читаемый вариант, не ломается при автоматической тёмной теме в почтовых клиентах.
export function variantC(asset) {
  const ink = '#141821', muted = '#5b6475', line = '#e4e7ee', paper = '#ffffff', ground = '#f2f3f7', violet = '#6b4cf6';
  const row = (n, title, text) => `<tr><td valign="top" width="44" style="padding:0 0 18px;">
<div style="width:32px;height:32px;border-radius:10px;background:#efeaff;text-align:center;font:700 15px/32px ${FONT};color:${violet};">${n}</div></td>
<td valign="top" style="padding:2px 0 18px;"><div style="font:700 16px/22px ${FONT};color:${ink};">${title}</div>
<div style="font:15px/22px ${FONT};color:${muted};padding-top:2px;">${text}</div></td></tr>`;
  const inner = `<table role="presentation" class="w" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px;">
<tr><td align="center" bgcolor="${C.bg}" style="background:${C.bg};border-radius:20px 20px 0 0;padding:28px 24px;">
  <div style="font:900 34px/38px ${FONT};letter-spacing:-1px;color:#ffffff;">Squad<span style="color:#7c5cff;">Up</span></div>
</td></tr>
<tr><td bgcolor="${C.cyan}" style="background:${C.cyan};height:4px;line-height:4px;font-size:0;">&nbsp;</td></tr>
<tr><td bgcolor="${paper}" class="px" style="background:${paper};padding:36px 40px 12px;border-left:1px solid ${line};border-right:1px solid ${line};">
  <h1 class="h1" style="margin:0;font:800 30px/36px ${FONT};color:${ink};">Готово, вы в списке!</h1>
  <p style="margin:14px 0 0;font:16px/25px ${FONT};color:${muted};">Спасибо, что заглянули на squadup.ru. Мы напишем, когда приложение выйдет в Google Play и App Store. Вот что будет в приложении:</p>
</td></tr>
<tr><td bgcolor="${paper}" class="px" style="background:${paper};padding:20px 40px 8px;border-left:1px solid ${line};border-right:1px solid ${line};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    ${row('1', 'Подбор тиммейтов', 'Карточки игроков с рангом, ролью и временем игры. Взаимный лайк открывает ник и чат.')}
    ${row('2', 'Команды', 'Основной состав до 5 игроков и до 2 запасных, роли и приглашения.')}
    ${row('3', 'Турниры с призами', 'Dota 2, League of Legends и CS2: регистрация, матчи и результаты.')}
  </table>
</td></tr>
<tr><td bgcolor="${paper}" class="px" style="background:${paper};padding:4px 40px 36px;border-left:1px solid ${line};border-right:1px solid ${line};border-bottom:1px solid ${line};border-radius:0 0 20px 20px;">
  ${button({ href: TG, label: 'Следить в Telegram', bg: violet, center: true })}
  <p style="margin:16px 0 0;font:14px/20px ${FONT};color:${muted};text-align:center;">Или просто ответьте на это письмо — мы читаем всё.</p>
</td></tr>
<tr><td class="px" style="padding:24px 12px 0;">${footer({ color: '#8a92a3', link: violet })}</td></tr>
</table>`;
  return shell({ title: SUBJECT, bodyBg: ground, inner, preheaderColor: ground });
}

export function plainText() {
  return `Вы в списке первых!

Спасибо, что оставили почту на squadup.ru. Когда SquadUp выйдет в Google Play и App Store, мы пришлём письмо со ссылками.

SquadUp — поиск тиммейтов, команд и турниров в Dota 2, League of Legends и CS2.

Новости и дата запуска: ${TG}

Вы получили это письмо, потому что оставили адрес на squadup.ru и согласились получить уведомление о запуске. Чтобы отписаться, ответьте на это письмо словом «Отписаться». Вопросы: ${CONTACT}. Политика конфиденциальности: ${SITE}/privacy/`;
}
