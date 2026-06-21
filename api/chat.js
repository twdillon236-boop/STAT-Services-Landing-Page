const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const systemPrompt = `
You are the STAT Services website assistant.
Keep responses concise, business-friendly, and helpful for prospective clients.
Guide users toward these services when relevant:
- QuickBooks support
- Setup & training
- Bookkeeping
- Notary services
- New business setup
- Requesting a consultation
When useful, suggest requesting a consultation through the form on the page or by emailing Support@STATIndy.com.
Avoid legal, tax, or financial advice beyond general service guidance.
`.trim();

function sanitizeMessages(messages = []) {
  return messages
    .filter((message) => message && typeof message.content === 'string')
    .map((message) => ({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: message.content.slice(0, 1000)
    }))
    .slice(-10);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Server is missing OPENAI_API_KEY.' });
  }

  try {
    const { messages = [], userMessage = '' } = req.body || {};
    const normalizedUserMessage = typeof userMessage === 'string' ? userMessage.trim() : '';

    if (!normalizedUserMessage) {
      return res.status(400).json({ error: 'Please provide a message.' });
    }

    const safeMessages = sanitizeMessages(messages);
    safeMessages.push({ role: 'user', content: normalizedUserMessage.slice(0, 1000) });

    const upstreamResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + process.env.OPENAI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        temperature: 0.4,
        max_tokens: 220,
        messages: [{ role: 'system', content: systemPrompt }, ...safeMessages]
      })
    });

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      console.error('OpenAI API error:', errorText);
      return res.status(502).json({ error: 'AI assistant is temporarily unavailable.' });
    }

    const data = await upstreamResponse.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({ error: 'No response from AI assistant.' });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({ error: 'Failed to process chat request.' });
  }
};
