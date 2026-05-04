/**
 * LinguaPanel — Cloudflare Worker
 *
 * Environment variables (set in Worker Settings → Variables):
 *   GROQ_API_KEY     = gsk_...
 *   GEMINI_API_KEY   = AIza...
 *
 * Routes:
 *   GET  /status  → returns { groq: true/false, gemini: true/false }
 *   POST /groq    → proxies to GROQ API
 *   POST /gemini  → proxies to Gemini API
 *   OPTIONS *     → CORS preflight
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

export default {
  async fetch(request, env) {
    const method = request.method;
    const path = new URL(request.url).pathname;

    if (method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    if (path === '/status') {
      return json({ groq: !!env.GROQ_API_KEY, gemini: !!env.GEMINI_API_KEY });
    }

    if (method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    if (path === '/groq') {
      if (!env.GROQ_API_KEY) return json({ error: 'GROQ_API_KEY not set in Worker' }, 500);
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + env.GROQ_API_KEY,
          },
          body: JSON.stringify(body),
        });
        const data = await res.text();
        return new Response(data, { status: res.status, headers: { 'Content-Type': 'application/json', ...CORS } });
      } catch (err) {
        return json({ error: 'GROQ fetch failed: ' + err.message }, 502);
      }
    }

    if (path === '/gemini') {
      if (!env.GEMINI_API_KEY) return json({ error: 'GEMINI_API_KEY not set in Worker' }, 500);
      const model = body.model || 'gemini-1.5-flash';
      const payload = { ...body };
      delete payload.model;
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.text();
        return new Response(data, { status: res.status, headers: { 'Content-Type': 'application/json', ...CORS } });
      } catch (err) {
        return json({ error: 'Gemini fetch failed: ' + err.message }, 502);
      }
    }

    return json({ error: 'Route not found: ' + path }, 404);
  }
};
