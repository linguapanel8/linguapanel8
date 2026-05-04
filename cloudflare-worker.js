/**
 * LinguaPanel — Cloudflare Worker
 * 
 * Deploy this to Cloudflare Workers.
 * Set these environment variables in your Worker settings:
 *   GROQ_API_KEY     = gsk_...
 *   GEMINI_API_KEY   = AIza...
 * 
 * Routes:
 *   POST /groq    → proxies to GROQ API
 *   POST /gemini  → proxies to Gemini API
 *   OPTIONS *     → CORS preflight
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      const body = await request.json();

      if (path === '/groq') {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + env.GROQ_API_KEY,
          },
          body: JSON.stringify(body),
        });
        const data = await res.text();
        return new Response(data, {
          status: res.status,
          headers: { 'Content-Type': 'application/json', ...CORS },
        });
      }

      if (path === '/gemini') {
        const model = body.model || 'gemini-1.5-flash';
        delete body.model;
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          }
        );
        const data = await res.text();
        return new Response(data, {
          status: res.status,
          headers: { 'Content-Type': 'application/json', ...CORS },
        });
      }

      if (path === '/status') {
        return new Response(JSON.stringify({
          groq: !!env.GROQ_API_KEY,
          gemini: !!env.GEMINI_API_KEY,
        }), {
          headers: { 'Content-Type': 'application/json', ...CORS },
        });
      }

      return new Response('Not found', { status: 404, headers: CORS });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }
  }
};
