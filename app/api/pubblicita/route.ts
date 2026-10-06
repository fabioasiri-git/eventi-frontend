import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dunogeleekgqztkrlxsz.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8803277543:AAHxvV6tC5kGdVasDlje0FaL875fcnzBo9M';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '648657216';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { azienda, referente, telefono, email, settore, obiettivo, note, source, utm_campaign } = data;

    if (!azienda || !telefono) {
      return NextResponse.json({ success: false, error: 'Azienda e telefono sono obbligatori' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const leadId = `web-lead-${Date.now()}`;

    // 1. Registra in Supabase dashboard_leads
    if (SUPABASE_SERVICE_ROLE_KEY) {
      const leadData = {
        id: leadId,
        nome_azienda_evento: azienda,
        referente: referente || 'Da Contattare',
        telefono: telefono,
        email: email || '',
        settore: settore || 'B2B / Locale',
        comune: 'Toscana',
        provincia: 'FI',
        area_target: 'Radio Toscana (Rete Regionale)',
        fase_commerciale: 'PREVENTIVO INVIATO',
        colonna: 'PREVENTIVO INVIATO',
        tipo_contratto: 'SPOT_TABELLARE',
        valore_preventivo: 1000,
        probabilita_chiusura: 70,
        anno_riferimento: '2026',
        data_preventivo: timestamp.split('T')[0],
        copy_testo: `Lead da Landing Pubblicità (${source || 'Inbound Web'}). Obiettivo: ${obiettivo || 'Campagna Radio'}. Note: ${note || 'Nessuna nota aggiuntiva'}.`,
        quote_items: [],
        note: `Inbound Landing Web. Campagna: ${utm_campaign || 'Diretta'}. Richiesta ricevuta il ${new Date().toLocaleString('it-IT')}.`
      };

      try {
        await fetch(`${SUPABASE_URL}/rest/v1/dashboard_leads`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            id: leadId,
            lead_data: leadData,
            updated_at: timestamp
          })
        });
      } catch (dbErr) {
        console.error('Errore salvataggio Supabase dashboard_leads:', dbErr);
      }

      // Salva anche nella tabella leads per il tracking CRM
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ditta: azienda,
            nome_attivita: azienda,
            telefono: telefono,
            email: email || '',
            settore: settore || 'Inbound Landing',
            fase_commerciale: 'IN TRATTATIVA',
            note: `Richiesta Landing Pubblicità: ${obiettivo || 'Nuova Campagna'}. Referente: ${referente || '-'}.`
          })
        });
      } catch (crmErr) {
        console.error('Errore salvataggio tabella leads:', crmErr);
      }
    }

    // 2. Alert Istantaneo Telegram a Fabio
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const msg = [
        `🎯 <b>NUOVO LEAD DA LANDING PUBBLICITÀ!</b>`,
        ``,
        `🏢 <b>Azienda:</b> ${azienda}`,
        `👤 <b>Referente:</b> ${referente || 'Non specificato'}`,
        `📞 <b>Telefono:</b> <code>${telefono}</code>`,
        `✉️ <b>Email:</b> ${email || 'Non indicata'}`,
        `💼 <b>Settore:</b> ${settore || 'Generale'}`,
        `🎯 <b>Obiettivo:</b> ${obiettivo || 'Campagna Radio Toscana'}`,
        note ? `📝 <b>Note:</b> ${note}` : '',
        source ? `🌐 <b>Sorgente:</b> ${source}` : '',
        ``,
        `⚡ <i>Lead inserito automaticamente nel CRM e in Supabase.</i>`
      ].filter(Boolean).join('\n');

      try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: msg,
            parse_mode: 'HTML'
          })
        });
      } catch (tgErr) {
        console.error('Errore invio Telegram:', tgErr);
      }
    }

    return NextResponse.json({ success: true, leadId });
  } catch (err: any) {
    console.error('Errore API pubblicità:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
