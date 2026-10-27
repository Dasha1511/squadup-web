// Статьи раздела /articles/. Новые статьи добавляются сюда и отдельной страницей в src/pages/articles/.
export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  lead: string;
  published: string; // ISO-дата
  updated: string;
  readMinutes: number;
  tags: string[];
}

export const ARTICLES: ArticleMeta[] = [
  {
    slug: 'legendy-kibersporta',
    title: 'Легенды киберспорта: 6 игроков, которые изменили Dota 2, CS и League of Legends',
    description:
      'Dendi, N0tail, s1mple, ZywOo, Faker и Deft — истории шести легенд киберспорта: рекорды, титулы, главные моменты карьеры и чему у них поучиться.',
    lead:
      'Шесть игроков, без которых киберспорт был бы другим: от первого чемпиона The International до человека, который выиграл Worlds шесть раз. По две легенды на каждую игру.',
    published: '2026-10-27',
    updated: '2026-10-27',
    readMinutes: 11,
    tags: ['Dota 2', 'CS2', 'League of Legends', 'Игроки'],
  },
  {
    slug: 'kak-ustroen-kibersport',
    title: 'Как устроен киберспорт: форматы матчей Bo1, Bo3, Bo5 и турнирные сетки',
    description:
      'Что значит Bo1, Bo3 и Bo5, чем верхняя сетка отличается от нижней, как работает швейцарская система и как устроены турниры по Dota 2, CS2 и League of Legends.',
    lead:
      'Разбираем, из чего состоит киберспортивный матч, что значат Bo1, Bo3 и Bo5, как работают сетки на выбывание, швейцарская система и группы — на примерах Dota 2, CS2 и League of Legends.',
    published: '2026-10-27',
    updated: '2026-10-27',
    readMinutes: 14,
    tags: ['Dota 2', 'CS2', 'League of Legends', 'Турниры'],
  },
];

export const formatDate = (iso: string) =>
  new Date(iso + 'T12:00:00+03:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
