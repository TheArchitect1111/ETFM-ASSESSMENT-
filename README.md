# ETFM Financial Snapshot — Deployment Guide

## What's in this package

```
etfm-assessment/
├── api/
│   └── claude.js        ← Secure server-side proxy (hides your API key)
├── src/
│   ├── main.jsx         ← React entry point
│   └── ETFMAssessment.jsx ← Your full app
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```

---

## Step 1 — Get your Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign in (or create a free account)
3. Click **API Keys** in the left sidebar
4. Click **Create Key** — copy it and save it somewhere safe

---

## Step 2 — Upload to GitHub

Vercel deploys from GitHub, so you need a free account there too.

1. Go to [github.com](https://github.com) and create a free account
2. Click the **+** icon → **New repository**
3. Name it `etfm-assessment`, set it to **Private**, click **Create repository**
4. On the next screen, click **uploading an existing file**
5. Drag and drop ALL the files from this folder (keep the folder structure)
6. Click **Commit changes**

---

## Step 3 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account
2. Click **Add New Project**
3. Find and select your `etfm-assessment` repository → click **Import**
4. Leave all settings as default — Vercel will detect Vite automatically
5. Before clicking Deploy, click **Environment Variables**
6. Add one variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** paste your API key from Step 1
7. Click **Deploy**

Vercel will build and deploy in about 60 seconds.
You'll get a live URL like: `https://etfm-assessment.vercel.app`

---

## Step 4 — Share it

- **Link in bio** (Instagram, TikTok, Twitter/X): paste your Vercel URL
- **Gamma page**: add a Button block → paste the URL
- **Email**: link the URL in your newsletter or welcome sequence
- **Custom domain** (optional): in Vercel → Settings → Domains, add your own domain like `assessment.etfm.com`

---

## Updating the app later

Any time you want to change questions, copy, or styling:
1. Edit `src/ETFMAssessment.jsx`
2. Upload the updated file to GitHub (same repo, same path)
3. Vercel redeploys automatically in ~60 seconds

---

## Questions?

The app calls Claude via a secure serverless function (`api/claude.js`).
Your API key lives only in Vercel's environment — it is never visible in the browser.
