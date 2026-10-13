import { NextResponse } from 'next/server';

// 1x1 GIF trasparente in base64
const TRANSPARENT_GIF_BUFFER = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8838460062:AAHR0rJBa644NUFaUg2W6S4quHtSOLGTVtM';
const TG_CHAT = process.env.TELEGRAM_CHAT_ID || '648657216';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const azienda = searchParams.get('azienda') || searchParams.get('c') || 'Azienda Anonima';
    const email = searchParams.get('email') || searchParams.get('e') || '';
    const campagna = searchParams.get('utm_campaign') || searchParams.get('campagna') || 'Outreach B2B';
    const lid = searchParams.get('lid') || '';

    // Notifica istantanea Telegram per apertura email
    if (TG_TOKEN && TG_CHAT) {
      const msg = `📩 *EMAIL APERTA (PIXEL TRACKING)!*
━━━━━━━━━━━━━━━━━━
🏢 *Azienda:* \`${azienda}\`
${email ? `✉️ *Destinatario:* \`${email}\`\n` : ''}${lid ? `🆔 *Lead ID:* \`${lid}\`\n` : ''}🎯 *Campagna:* \`${campagna}\`
⏱ *Orario:* ${new Date().toLocaleTimeString('it-IT')}
━━━━━━━━━━━━━━━━━━
👉 *Il destinatario ha appena visualizzato l'email nella sua casella di posta!*`;

      fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TG_CHAT,
          text: msg,
          parse_mode: 'Markdown'
        })
      }).catch(err => console.error('Telegram pixel tracking error:', err));
    }
  } catch (err) {
    console.error('Pixel tracking error:', err);
  }

  // Restituisce sempre la GIF trasparente 1x1 senza cache
  return new NextResponse(TRANSPARENT_GIF_BUFFER, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Content-Length': TRANSPARENT_GIF_BUFFER.length.toString(),
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}
