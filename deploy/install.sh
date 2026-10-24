#!/usr/bin/env bash
# Установка и обновление сайта squadup.ru на сервере.
# Запуск: bash /var/www/squadup-web/deploy/install.sh
# Бэкенд (api.squadup.ru) и его настройки nginx не затрагиваются.
set -e

DIR=/var/www/squadup-web
cd "$DIR"

echo "== 1. Права на файлы сайта"
chown -R root:root "$DIR"
find "$DIR/dist" -type d -exec chmod 755 {} +
find "$DIR/dist" -type f -exec chmod 644 {} +

echo "== 2. nginx: отдельный файл squadup-site"
cp "$DIR/deploy/nginx-squadup.conf" /etc/nginx/sites-available/squadup-site
# Если сертификат для squadup.ru уже выпущен — сохраняем HTTPS-настройку certbot, не перезаписываем её
if [ -f /etc/letsencrypt/live/squadup.ru/fullchain.pem ] && [ -f /etc/nginx/sites-enabled/squadup-site ] && grep -q "managed by Certbot" /etc/nginx/sites-enabled/squadup-site 2>/dev/null; then
  echo "   HTTPS уже настроен — конфигурацию nginx не меняю"
else
  ln -sf /etc/nginx/sites-available/squadup-site /etc/nginx/sites-enabled/squadup-site
fi
nginx -t
systemctl reload nginx

echo "== 3. Обработчик формы подписки"
cp "$DIR/deploy/squadup-subscribe.service" /etc/systemd/system/squadup-subscribe.service
systemctl daemon-reload
systemctl enable squadup-subscribe >/dev/null 2>&1
systemctl restart squadup-subscribe
sleep 1
systemctl is-active squadup-subscribe

echo "== 4. Проверка"
curl -s -H "Host: squadup.ru" http://127.0.0.1/ | grep -o "<title>[^<]*</title>" || echo "   ВНИМАНИЕ: сайт не отвечает"
curl -s -X POST -H "Host: squadup.ru" -H "Content-Type: application/json" -d '{"email":"x"}' http://127.0.0.1/api/subscribe; echo
echo "== Готово"
