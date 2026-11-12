# DocHome — вызов врача на дом (Астана и Алматы)

Статический лэндинг: `index.html`, `styles.css`, `script.js`, `lead-capture.js`, `config.js`.

## Настройка под клиента
Все данные клиента — в одном файле **`config.js`**:
- телефон и WhatsApp;
- `googleAdsId` и ID конверсий (тег Google Ads подключается автоматически, если ID указан);
- `telegram.worker` / `telegram.secret` — Cloudflare Worker для дублирования заявок в Telegram (если пусто, заявки идут только в WhatsApp).

Телефон также продублирован в разметке `index.html` (ссылки `tel:` и `wa.me`) — при смене номера замените его поиском по файлу.

## Врачи
Карточки врачей — в секции `#vrachi` файла `index.html`, фото — в `assets/doctors/` (webp, 640×800).
Атрибут `data-spec` задаёт фильтры: `terapevt pediatr kardiolog nevrolog uzi uzkie`.
