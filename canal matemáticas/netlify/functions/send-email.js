exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
  
  const { to, nombre, comentario, respuesta } = JSON.parse(event.body);
  
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Matemáticas con Javier <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL],
      reply_to: to,
      subject: `📐 Respuesta para ${nombre}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:2rem;background:#f0f4ff;border-radius:16px;">
          <h2 style="color:#1e3a5f;">📐 Respuesta para reenviar a ${nombre}</h2>
          <p style="color:#6b7280;">Email del alumno: <strong>${to}</strong></p>
          <p style="color:#6b7280;">Consulta original: <em>${comentario}</em></p>
          <div style="background:#fff;border-radius:12px;padding:1.5rem;margin:1rem 0;border-left:4px solid #f5a623;">
            <p style="color:#1a1d23;font-size:15px;"><strong>Tu respuesta:</strong><br>${respuesta}</p>
          </div>
          <p style="color:#6b7280;font-size:12px;">Respondé a este email para que le llegue directamente a ${nombre}.</p>
        </div>
      `
    })
  });

  if (res.ok) return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  const err = await res.text();
  return { statusCode: 500, body: JSON.stringify({ error: err }) };
};