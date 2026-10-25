#!/usr/bin/env bash
# Подключает отправку письма-визитки через Gmail hello.squadup@gmail.com.
# Запуск: bash /var/www/squadup-web/deploy/setup-mail.sh
# Скрипт попросит пароль приложения Gmail (16 букв) — при вводе он не отображается, это нормально.
set -e
DIR=/var/www/squadup-web
ENV=/etc/squadup-subscribe.env
USER_MAIL=hello.squadup@gmail.com

echo "== Проверяю, может ли сервер подключиться к Gmail…"
PORT=""
for P in 465 587; do
  if timeout 8 bash -c "cat < /dev/null > /dev/tcp/smtp.gmail.com/$P" 2>/dev/null; then PORT=$P; break; fi
  echo "   порт $P закрыт"
done
if [ -z "$PORT" ]; then
  echo "!! Хостинг закрыл почтовые порты 465 и 587. Их открывает поддержка Timeweb по запросу (текст запроса даст Claude)."
  exit 1
fi
echo "   порт $PORT открыт"

read -r -s -p "Вставьте пароль приложения Gmail и нажмите Enter: " PASS; echo
PASS=$(printf '%s' "$PASS" | tr -d ' ')
if [ ${#PASS} -ne 16 ]; then echo "!! В пароле должно быть 16 букв, а получилось ${#PASS}. Запустите скрипт ещё раз."; exit 1; fi

umask 077
cat > "$ENV" <<EOF
MAIL_USER=$USER_MAIL
MAIL_PASS=$PASS
MAIL_FROM_NAME=SquadUp
MAIL_PORT=$PORT
EOF
chmod 600 "$ENV"

mkdir -p /etc/systemd/system/squadup-subscribe.service.d
cat > /etc/systemd/system/squadup-subscribe.service.d/mail.conf <<EOF
[Service]
EnvironmentFile=$ENV
EOF
systemctl daemon-reload
systemctl restart squadup-subscribe
echo "== Обработчик формы перезапущен: $(systemctl is-active squadup-subscribe)"

read -r -p "На какой адрес отправить тестовое письмо? " TO
set -a; . "$ENV"; set +a
cd "$DIR/server" && node -e '
  import("./email/welcome.mjs").then(({ sendWelcome }) => sendWelcome(process.argv[1]))
    .then(() => console.log("== Письмо отправлено на " + process.argv[1] + ". Проверьте входящие и папку «Спам»."))
    .catch((e) => { console.log("!! Не отправилось: " + e.message); process.exit(1); });
' "$TO"
