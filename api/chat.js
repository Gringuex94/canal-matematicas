module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    if (messages.length > 20) {
      return res.status(400).json({ error: 'Too many messages' });
    }

    // Convertir formato de Gemini ({role, parts:[{text}]}) a Claude ({role, content})
    const claudeMessages = messages.map(m => ({
      role: m.role === 'model' ? 'assistant' : 'user',
      content: m.parts ? m.parts[0].text : m.content
    }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        system: 'Eres un asistente de matemáticas útil y claro. Ayudás a estudiantes a entender conceptos matemáticos de forma sencilla.',
        messages: claudeMessages
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Claude error:', err);
      return res.status(500).json({ error: 'AI service error' });
    }

    const data = await response.json();
    const reply = data.content[0].text;
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
