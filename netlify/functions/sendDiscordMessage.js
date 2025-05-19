export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { user, message } = JSON.parse(event.body || '{}');
  const webhook = process.env.DISCORD_WEBHOOK_URL;

  if (!user || !message || !webhook) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Faltan datos o webhook no configurado" })
    };
  }

  const payload = {
    content: `**${user}**: ${message}`
  };

  try {
    const resp = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) throw new Error("Webhook falló");

    return { statusCode: 200, body: "Mensaje enviado a Discord." };
  } catch (err) {
    return { statusCode: 500, body: "Error: " + err.message };
  }
}
