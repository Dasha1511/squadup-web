export const SITE = {
  name: 'SquadUp',
  url: 'https://squadup.ru',
  title: 'SquadUp — поиск тиммейтов и турниры по Dota 2, LoL и CS2',
  description:
    'SquadUp — мобильное приложение для поиска тиммейтов, сбора команд и турниров с призовым фондом по Dota 2, League of Legends и CS2.',
  email: 'hello.squadup@gmail.com',
  telegram: 'https://t.me/SquadUp_cyber',
  telegramHandle: '@SquadUp_cyber',
  operator: 'Молчанова Дарья Дмитриевна',
  // Город владельца сайта (ст. 10 149-ФЗ: место нахождения владельца сайта)
  ownerCity: 'г. Москва',
  policyDate: '25 октября 2026 г.',
  // Версия текстов согласий в форме — сохраняется вместе с подпиской
  consentVersion: '2026-10-25',
  // Сайт размещён на GitHub Pages, обработчик формы — на сервере Timeweb за api.squadup.ru
  subscribeUrl: 'https://api.squadup.ru/api/subscribe',
  // Коды подтверждения прав из Яндекс Вебмастера и Google Search Console
  yandexVerification: '101fd8004a185609',
  googleVerification: '',
};

export const NAV = [
  { href: '/features/', label: 'Возможности' },
  { href: '/how-it-works/', label: 'Как это работает' },
  { href: '/games/', label: 'Игры' },
  { href: '/faq/', label: 'Вопросы' },
  { href: '/contacts/', label: 'Контакты' },
];

/**
 * Идентификаторы счётчиков. Заполняются после регистрации сайта в сервисах:
 * пока значение пустое, соответствующий счётчик на сайте не загружается.
 */
export const ANALYTICS = {
  // LiveInternet (ЛР №3): счётчик привязан к домену, ID не нужен.
  // type — вид счётчика из генератора кода LiveInternet (фрагмент "hit?t52.5", серый 88×31).
  liveinternet: {
    enabled: true,
    type: 't52.5',
    title: 'LiveInternet: показано число просмотров и посетителей за 24 часа',
  },
  // Рамблер/топ-100 (ЛР №4): номер счётчика из кабинета Статистики SberAds (бывший top100.rambler.ru).
  rambler: {
    projectId: '7753231',
    // data-атрибут разметки блоков; должен совпадать с настройкой «Аналитика блоков» в кабинете
    blockAttribute: 'sq-block',
    trackHashes: true,
  },
  // MyTracker / Top.Mail.Ru (ЛР №5): ID счётчика сайта.
  mytracker: {
    counterId: '3808325',
    // Адрес картинки-логотипа счётчика из кабинета (вставляется в подвал)
    logoSrc: '',
    logoHref: '',
  },
};

/** События сайта. Имена — только латиница, так требуют цели Top.Mail.Ru. */
export const EVENTS = {
  notifyClick: 'notifyclick', // нажал «Узнать о запуске»
  subscribe: 'subscribe', // успешно оставил email
  telegram: 'telegram', // перешёл в Telegram-канал
  storeAndroid: 'storeandroid', // нажал кнопку Google Play
  storeIos: 'storeios', // нажал кнопку App Store
  faqOpen: 'faqopen', // открыл вопрос FAQ
  emailClick: 'emailclick', // нажал на email в контактах
} as const;

/** Строка о владельце сайта (ст. 10 149-ФЗ), всегда заканчивается точкой. */
export const OWNER_LINE = SITE.ownerCity ? `${SITE.operator}, ${SITE.ownerCity}.` : `${SITE.operator}.`;
