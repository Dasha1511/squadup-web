#!/usr/bin/env bash
# Отправляет тестовое письмо-визитку на указанный адрес.
# Запуск: bash /var/www/squadup-web/deploy/send-test-mail.sh you@example.com
set -e
TO="$1"
if [ -z "$TO" ]; then read -r -p "На какой адрес отправить тестовое письмо? " TO; fi
set -a; . /etc/squadup-subscribe.env; set +a
cd /var/www/squadup-web/server && node -e '
  import("./email/welcome.mjs").then(({ sendWelcome }) => sendWelcome(process.argv[1]))
    .then(() => console.log("== Письмо отправлено на " + process.argv[1] + ". Проверьте входящие и папку «Спам»."))
    .catch((e) => { console.log("!! Не отправилось: " + e.message); process.exit(1); });
' "$TO"
