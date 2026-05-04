# LinguaPanel

> Grammar Agent + EN→HI Translator · Dark Navy + Cyan Instrument Panel UI

A PWA (Progressive Web App) that works on **Desktop and Android** — installable, offline-ready, and powered by **GROQ** (primary) and **Google Gemini** (fallback).

---

## Features

- **Grammar Agent** — AI chat assistant that corrects and improves your English or Hindi writing
- **EN → HI Translator** — Unlimited content translation with no character limits
- **Dual API** — GROQ as primary, Gemini as automatic fallback
- **PWA** — Install to Android home screen or desktop, works like a native app
- **Cloudflare Worker** — Optional proxy to keep your API keys off the browser
- **Persistent Settings** — API keys survive browser restarts when installed as PWA

---

## Setup

### 1. Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "init LinguaPanel"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/linguapanel.git
git push -u origin main
```

Then in your GitHub repo → **Settings → Pages → Source: main branch / root**.

Your app will be live at: `https://YOUR_USERNAME.github.io/linguapanel/`

---

### 2. (Optional) Deploy Cloudflare Worker

This hides your API keys from the browser — recommended for production.

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → Create Worker
2. Paste the contents of `cloudflare-worker.js`
3. Click **Deploy**
4. Go to **Settings → Variables** and add:
   - `GROQ_API_KEY` = your GROQ key (`gsk_...`)
   - `GEMINI_API_KEY` = your Gemini key (`AIza...`)
5. Copy your Worker URL (e.g. `https://linguapanel.YOUR_USERNAME.workers.dev`)
6. In the app → **Settings → Worker URL** → paste it

When Worker URL is set, API keys are NOT needed in the app settings — they live in the Worker.

---

### 3. Install on Android

1. Open your GitHub Pages URL in **Chrome for Android**
2. Tap the **three-dot menu → Add to Home Screen**
3. Or go to **Settings tab** in the app → tap **Install App**

### Install on Desktop

1. Open in **Chrome or Edge**
2. Look for the install icon in the address bar (or Settings → Install App)

---

## API Keys

| Service | Get Key | Free Tier |
|---------|---------|-----------|
| GROQ | [console.groq.com](https://console.groq.com) | Generous free tier |
| Gemini | [aistudio.google.com](https://aistudio.google.com) | Free with limits |

---

## Files

```
index.html          ← Main app (single file, no build needed)
manifest.json       ← PWA manifest
sw.js               ← Service Worker (offline support)
cloudflare-worker.js← Cloudflare Worker proxy (deploy separately)
```

---

## Icons

Add `icon-192.png` and `icon-512.png` to your repo for the PWA install icon.  
Use any image — a simple tool like [favicon.io](https://favicon.io) can generate them.

---

## Notes

- **No build step** — pure HTML/CSS/JS, works directly from GitHub Pages
- **Keys stored in localStorage** — persist when installed as PWA
- **GROQ fails → auto-fallback to Gemini** — no manual action needed
- The app UI uses **JetBrains Mono + Instrument Serif** fonts from Google Fonts
