import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dunogeleekgqztkrlxsz.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';

// GET: Legge tutti i lead sincronizzati dal Cloud Supabase
export async function GET() {
  try {
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ success: false, error: 'SUPABASE_SERVICE_ROLE_KEY non configurata' }, { status: 500 });
    }

    const endpoint = SUPABASE_URL + '/rest/v1/dashboard_leads?select=id,lead_data,updated_at&order=updated_at.desc';
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_SERVICE_ROLE_KEY,
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ success: false, error: errText }, { status: res.status });
    }

    const rows = await res.json();
    const leads = rows.map((r: any) => r.lead_data);

    return NextResponse.json({ success: true, leads, count: leads.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Errore fetch Supabase' }, { status: 500 });
  }
}

// POST: Salva / Aggiorna uno o più lead nel Cloud Supabase
export async function POST(request: Request) {
  try {
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ success: false, error: 'SUPABASE_SERVICE_ROLE_KEY non configurata' }, { status: 500 });
    }

    const body = await request.json();
    const { lead, leads } = body;

    const payloadList = leads ? leads : (lead ? [lead] : []);

    if (payloadList.length === 0) {
      return NextResponse.json({ success: false, error: 'Nessun dato fornito per il salvataggio' }, { status: 400 });
    }

    const records = payloadList.map((item: any) => ({
      id: String(item.id || item.nome_azienda_evento || Date.now()),
      lead_data: item,
      updated_at: new Date().toISOString()
    }));

    const endpoint = SUPABASE_URL + '/rest/v1/dashboard_leads';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(records)
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ success: false, error: errText }, { status: res.status });
    }

    return NextResponse.json({ success: true, synced: records.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Errore salvataggio Supabase' }, { status: 500 });
  }
}
