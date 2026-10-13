import { NextResponse } from 'next/server';

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8838460062:AAHR0rJBa644NUFaUg2W6S4quHtSOLGTVtM';
const TG_CHAT = process.env.TELEGRAM_CHAT_ID || '648657216';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { client, url, event, timestamp } = body;

    const message = `🔔 *ALERT APERTURA LANDING RADIO TOSCANA!*
━━━━━━━━━━━━━━━━━━
👤 *Target / Cliente:* \`${client || 'Visitatore Diretto'}\`
⏱ *Orario:* ${new Date(timestamp || Date.now()).toLocaleTimeString('it-IT')}
🌐 *Link visitato:* ${url || 'Landing Vercel'}
━━━━━━━━━━━━━━━━━━
👉 *Il cliente sta guardando la proposta e il simulatore on-air in questo momento!*`;

    if (TG_TOKEN && TG_CHAT) {
      await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TG_CHAT,
          text: message,
          parse_mode: 'Markdown'
        })
      }).catch(err => console.error('Telegram alert error:', err));
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
