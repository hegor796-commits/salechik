/**
 * Прокси для отправки заявок в Telegram (Cloudflare Worker).
 *
 * Зачем: чтобы токен бота НЕ лежал в коде сайта, где его видно всем.
 * Токен и chat_id хранятся здесь, на сервере, как секретные переменные.
 * Сайт просто отправляет сюда текст заявки, а этот код пересылает его в Telegram.
 *
 * Как развернуть — см. serverless/README.md
 *
 * Нужные переменные окружения (Settings → Variables на Cloudflare):
 *   TG_TOKEN — токен бота от @BotFather
 *   TG_CHAT  — ваш chat_id
 *   ALLOW_ORIGIN — адрес сайта, напр. https://xoxloff-farm.ru (или * для всех)
 */

export default {
  async fetch(request, env) {
    const origin = env.ALLOW_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Предзапрос браузера (CORS)
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: cors });
    }

    let text = "";
    try {
      const data = await request.json();
      text = (data && data.text ? String(data.text) : "").slice(0, 4000);
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: "bad json" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    if (!text.trim()) {
      return new Response(JSON.stringify({ ok: false, error: "empty" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const tgResp = await fetch(
      "https://api.telegram.org/bot" + env.TG_TOKEN + "/sendMessage",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.TG_CHAT,
          text: text,
          parse_mode: "HTML",
        }),
      }
    );

    return new Response(JSON.stringify({ ok: tgResp.ok }), {
      status: tgResp.ok ? 200 : 502,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  },
};
