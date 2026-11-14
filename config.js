/* ============================================================
   DocHome — настройки сайта. Единственное место, где меняются
   данные клиента: телефон, WhatsApp, Google Ads, Telegram-бот.
   ============================================================ */
window.DOCHOME = {
  /* Название для подписей в заявках */
  site: 'DocHome (Астана/Алматы)',

  /* Телефон: в формате для ссылок tel: и WhatsApp (без «+», только цифры) */
  phone: '+77003281750',
  phoneDisplay: '8 700 328 17 50',
  wa: '77003281750',

  /* Google Ads. Оставьте googleAdsId пустым — тег не подключится.
     Пример: googleAdsId: 'AW-1234567890',
             conversions: { phone: 'AW-1234567890/AbCdEf', lead: '...', contact: '...' } */
  googleAdsId: '',
  conversions: {
    phone: '',    /* клик по номеру телефона */
    lead: '',     /* отправка формы заявки */
    contact: ''   /* клик по WhatsApp */
  },

  /* Telegram-бот (через Cloudflare Worker). Оставьте пустым — заявки
     уйдут только в WhatsApp, как и сейчас. */
  telegram: {
    worker: 'https://dochome-leadbot.alikanafin.workers.dev',
    secret: '7e16c934307e2147ed0a7e043e43258161536f6599f2f9f3'
  }
};
