#!/usr/bin/env bash
# Сохраняет дополнительный IP 5.129.202.139 в настройках сети (netplan), чтобы он
# оставался после перезагрузки. Основной адрес (DHCP) не меняется.
# Запуск: bash /var/www/squadup-web/deploy/persist-extra-ip.sh
set -e
IP=5.129.202.139
FILE=/etc/netplan/60-squadup-extra-ip.yaml

if ! grep -rqs "eth0:" /etc/netplan/*.yaml; then
  echo "В netplan нет интерфейса с именем eth0 — ничего не меняю. Пришлите вывод: cat /etc/netplan/*.yaml"
  exit 1
fi

cat > "$FILE" <<EOF
network:
  version: 2
  ethernets:
    eth0:
      addresses:
        - $IP/32
EOF
chmod 600 "$FILE"

# Проверяем синтаксис, ничего не применяя (адрес уже активен)
netplan generate
echo "== Файл $FILE сохранён, проверка netplan пройдена"
ip -4 addr show eth0 | grep inet
echo "== Готово"
