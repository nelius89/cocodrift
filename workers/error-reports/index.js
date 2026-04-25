const NOTION_DATABASE_ID = '9f5be7b959e54740a88f8dc5d55077d8';
const NOTION_VERSION = '2022-06-28';
const ALLOWED_ORIGIN = 'https://sup-app.pages.dev';

const cors = (origin) => ({
  'Access-Control-Allow-Origin': origin || ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
});

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const isAllowed = origin === ALLOWED_ORIGIN || origin.endsWith('.pages.dev');

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    if (!isAllowed) {
      return new Response('Forbidden', { status: 403 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...cors(origin) },
      });
    }

    const spot        = (body.spot || '').trim().slice(0, 100);
    const condiciones = (body.condiciones || '').trim().slice(0, 500);
    const mensajes    = (body.mensajes || '').trim().slice(0, 1000);
    const comentario  = (body.comentario || '').trim().slice(0, 500);

    if (!spot || !condiciones) {
      return new Response(JSON.stringify({ error: 'missing_data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...cors(origin) },
      });
    }

    const now = new Date().toLocaleString('es-ES', {
      timeZone: 'Europe/Madrid',
      dateStyle: 'short',
      timeStyle: 'short',
    });
    const titulo = `${spot} · ${now}`;

    const notionRes = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.NOTION_TOKEN}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          Reporte: {
            title: [{ text: { content: titulo } }],
          },
          Spot: {
            rich_text: [{ text: { content: spot } }],
          },
          Condiciones: {
            rich_text: [{ text: { content: condiciones } }],
          },
          Mensajes: {
            rich_text: mensajes ? [{ text: { content: mensajes } }] : [],
          },
          Comentario: {
            rich_text: comentario ? [{ text: { content: comentario } }] : [],
          },
          Estado: {
            select: { name: 'Nueva' },
          },
        },
      }),
    });

    if (!notionRes.ok) {
      return new Response(JSON.stringify({ error: 'notion_error' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...cors(origin) },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...cors(origin) },
    });
  },
};
