const NOTION_DATABASE_ID = '25bd9e90c8f44257a82cda48d9e8e0f5';
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

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...cors(origin) },
      });
    }

    const message = (body.message || '').trim();

    if (!message) {
      return new Response(JSON.stringify({ error: 'empty_message' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...cors(origin) },
      });
    }

    if (message.length > 1000) {
      return new Response(JSON.stringify({ error: 'too_long' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...cors(origin) },
      });
    }

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
          Sugerencia: {
            title: [{ text: { content: message } }],
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
