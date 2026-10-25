#!/usr/bin/env bash
# Показывает всех, кто подписался на уведомление о запуске.
# Запуск:          bash /var/www/squadup-web/deploy/subscribers.sh
# Выгрузка в CSV:  bash /var/www/squadup-web/deploy/subscribers.sh csv
FILE=${SUB_FILE:-/var/lib/squadup-subscribe/subscribers.jsonl}

if [ ! -s "$FILE" ]; then echo "Подписчиков пока нет"; exit 0; fi

if [ "$1" = "csv" ]; then
  OUT=/root/subscribers-$(date +%F).csv
  node -e '
    const rows = require("fs").readFileSync(process.argv[1], "utf8").trim().split("\n").map(JSON.parse);
    console.log("﻿email;дата_подписки;согласие_на_рассылки;откуда");
    for (const r of rows) console.log([r.email, r.created_at, r.marketing ? "да" : "нет", r.page].join(";"));
  ' "$FILE" > "$OUT"
  echo "Сохранено в $OUT"
  exit 0
fi

node -e '
  const rows = require("fs").readFileSync(process.argv[1], "utf8").trim().split("\n").map(JSON.parse);
  const fmt = (iso) => new Date(iso).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
  rows.forEach((r, i) => console.log(String(i + 1).padStart(3) + ". " + r.email.padEnd(36) + fmt(r.created_at) + "   рассылки: " + (r.marketing ? "да " : "нет") + "   " + (r.page || "")));
  console.log("\nВсего подписчиков: " + rows.length);
' "$FILE"
