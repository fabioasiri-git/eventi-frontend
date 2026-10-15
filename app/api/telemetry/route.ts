import { NextResponse } from 'next/server';

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TG_CHAT = process.env.TELEGRAM_CHAT_ID || '648657216';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { client, url, event, details, timestamp } = body;

    let title = '🔔 *NOTIFICA ATTIVITÀ LANDING*';
    let subtitle = '';

    switch (event) {
      case 'AUDIO_PLAY':
        title = '🎧 *ASCOLTO SPOT DEMO ON-AIR!*';
        subtitle = `🎵 *Traccia ascoltata:* \`${details || 'Demo Spot'}\`\n👉 *Il prospect sta valutando la qualità audio dei format!*`;
        break;

      case 'CLICK_PHONE':
        title = '📞 *CLICK SU TELEFONO FISSO (055 285030)!*';
        subtitle = `👉 *Il prospect sta tentando di chiamare la sede commerciale!*`;
        break;

      case 'CLICK_EMAIL':
        title = '✉️ *CLICK SU EMAIL COMMERCIALE!*';
        subtitle = `👉 *Il prospect ha aperto la bozza email per commerciale@radiotoscana.it!*`;
        break;

      case 'PAGE_ENGAGED':
        title = '⏱ *LETTURA PROLUNGATA DELLA PROPOSTA!*';
        subtitle = `📖 *Tempo permanenza:* \`${details || 'Oltre 30 secondi'}\`\n👉 *Interesse elevato sulla proposta commerciale!*`;
        break;

      case 'FORM_SUBMIT':
        title = '🎯 *RICHIESTA PREVENTIVO INVIATA!*';
        subtitle = `📝 *Dettagli:* \`${details || 'Modulo compilato'}\``;
        break;

      case 'LANDING_PUBBLICITA_VISIT':
      default:
        title = '👀 *VISITA LANDING PUBBLICITÀ!*';
        subtitle = `👉 *Il cliente è atterrato sulla proposta pubblicitaria 2026!*`;
        break;
    }

    const message = `${title}
━━━━━━━━━━━━━━━━━━
🏢 *Target / Cliente:* \`${client || 'Visitatore Diretto'}\`
⏱ *Orario:* ${new Date(timestamp || Date.now()).toLocaleTimeString('it-IT')}
${subtitle ? `${subtitle}\n` : ''}🌐 *URL:* ${url || 'Landing Pubblicità'}
━━━━━━━━━━━━━━━━━━`;

    if (TG_TOKEN && TG_CHAT) {
      fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
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
