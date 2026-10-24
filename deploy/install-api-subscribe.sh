#!/usr/bin/env bash
# Подключает приём формы подписки к api.squadup.ru (сайт теперь на GitHub Pages).
# Запуск: bash /var/www/squadup-web/deploy/install-api-subscribe.sh
set -e
DIR=/var/www/squadup-web
API_CONF=/etc/nginx/sites-available/squadup

cp "$DIR/deploy/nginx-api-subscribe.conf" /etc/nginx/snippets/squadup-subscribe.conf
if ! grep -q "squadup-subscribe.conf" "$API_CONF"; then
  cp "$API_CONF" /root/squadup-api-nginx.backup
  # вставляем include сразу после client_max_body_size в блоке api.squadup.ru
  sed -i '0,/client_max_body_size 12m;/s//client_max_body_size 12m;\n    include snippets\/squadup-subscribe.conf;/' "$API_CONF"
fi
nginx -t && systemctl reload nginx
systemctl is-active squadup-subscribe
curl -s -X POST -H "Content-Type: text/plain" -d '{"email":"x"}' https://api.squadup.ru/api/subscribe -o - -D - | grep -i -E "^HTTP|access-control|error"
echo "== Готово"
