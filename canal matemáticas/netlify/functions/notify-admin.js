exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  const { nombre, email, comentario, imagen_url } = JSON.parse(event.body);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Canal Matemáticas <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL],
      subject: '📩 Nueva consulta recibida en tu canal',
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:2rem;background:#f0f4ff;border-radius:16px;">
          <h2 style="color:#1e3a5f;">📩 Nueva consulta recibida</h2>
          <div style="background:#fff;border-radius:12px;padding:1.5rem;margin:1rem 0;border-left:4px solid #f5a623;">
            <p style="margin:0 0 8px;"><strong>👤 Nombre:</strong> ${nombre}</p>
            <p style="margin:0 0 8px;"><strong>📧 Email:</strong> ${email}</p>
            <p style="margin:0;"><strong>💬 Consulta:</strong> ${comentario}</p>
            ${imagen_url ? `<p style="margin:8px 0 0;"><strong>🖼️ Imagen:</strong> <a href="${imagen_url}">Ver imagen adjunta</a></p>` : ''}
          </div>
          <p style="color:#6b7280;font-size:12px;">Entrá al panel admin para responderle.</p>
        </div>
      `
    })
  });

  if (res.ok) return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  return { statusCode: 500, body: JSON.stringify({ error: 'Error' }) };
};