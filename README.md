# STAT Services Landing Page

This landing page includes a Vercel-compatible AI chatbot for guiding visitors to STAT Services offerings:

- QuickBooks support
- Setup & training
- Bookkeeping
- Notary services
- New business setup
- Consultation requests

## AI Chatbot Setup

The frontend chat UI calls `/api/chat`, a serverless endpoint in `api/chat.js`.
The API key is read on the server from environment variables and is never exposed in browser code.

### Required environment variables

- `OPENAI_API_KEY` (required): API key for the AI provider.
- `OPENAI_MODEL` (optional): model name, defaults to `gpt-4o-mini`.

## Deploy on Vercel

1. Push this repository to GitHub.
2. Import the repository into Vercel.
3. In Vercel Project Settings → Environment Variables, add:
   - `OPENAI_API_KEY`
   - (optional) `OPENAI_MODEL`
4. Deploy.

Vercel will serve static files and automatically host the `api/chat.js` serverless function.

## Local development with Vercel CLI

1. Install Vercel CLI:
   - `npm i -g vercel`
2. In this repository, run:
   - `vercel link`
   - `vercel env add OPENAI_API_KEY`
   - `vercel env add OPENAI_MODEL` (optional)
   - `vercel dev`
3. Open the local URL and test the chatbot.