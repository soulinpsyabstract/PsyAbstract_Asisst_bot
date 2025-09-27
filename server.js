const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// 🔑 Секреты Render
const TELEGRAM_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID;

// 📝 FAQ-база
const FAQ = [
  { k: ["цена", "prices", "$400", "$600", "$800", "$1000"], 
    a: "Базовые: $400 The Beginning, $600 Labyrinths, $800 Other, $1000 Acrylic. Неон-акрил $1200. Эксклюзив = +$200 к любой категории. Комиссии $1500 / $2000 (по обсуждению)." },

  { k: ["эксклюзив", "rights", "права"], 
    a: "Эксклюзив: +$200 — покупатель получает физическую работу и эксклюзивные права на будущий цифровой контент по этой работе. Неэксклюзив: оригинал у клиента, но я могу создавать цифровой контент по фото." },

  { k: ["доставка", "shipping", "fedex", "почта"], 
    a: "Доставка: Standard $150 (5–10 б.д.), FedEx Economy $200 (4–6 б.д.), FedEx Express $300 (2–4 б.д.). Обработка 1–3 дня." },

  { k: ["оплата", "paypal", "pay"], 
    a: "Оплата через PayPal. Картина и доставка могут быть двумя отдельными платежами. Кнопки и QR доступны на сайте." },

  { k: ["комиссия", "на заказ", "commission"], 
    a: "Комиссионные: $1500/$2000. Обсуждаем стиль/глубину/технику. Я не рисую портреты; работаю интуитивно. Делаю 3 варианта — вы выбираете." },

  { k: ["срок", "когда", "сколько дней", "deadline"], 
    a: "Типично 1–3 дня на обработку + срок доставки по тарифу. Для комиссий — сроки обсуждаем перед оплатой." },

  { k: ["контакт", "связаться", "help"], 
    a: "Напишите, какая работа/размер и страна доставки — помогу подобрать и посчитаю итог." },
];

// 🔹 Функция ответа
function getAnswer(text) {
  text = text.toLowerCase();
  for (let item of FAQ) {
    if (item.k.some(k => text.includes(k.toLowerCase()))) {
      return item.a;
    }
  }
  return "❓ Я не понял вопрос. Спроси про: цена, доставка, оплата, комиссия, срок.";
}

// 🔹 Webhook Telegram
app.post("/webhook", async (req, res) => {
  const message = req.body.message;
  if (message && message.text) {
    const chatId = message.chat.id;
    const answer = getAnswer(message.text);

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: answer,
    });
  }
  res.send("ok");
});

app.get("/", (req, res) => res.send("✅ PsyAbstract Assist Bot online!"));

app.listen(3000, () => console.log("Bot server running"));
