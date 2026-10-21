import { NextResponse } from 'next/server';

function checkLuhnChecksum(piva: string): boolean {
  if (piva.length !== 11 || !/^\d{11}$/.test(piva)) return false;
  let s = 0;
  for (let i = 0; i < 10; i++) {
    let n = parseInt(piva[i], 10);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    s += n;
  }
  const controllo = (10 - (s % 10)) % 10;
  return parseInt(piva[10], 10) === controllo;
}

function parseViesAddress(rawAddress: string) {
  const lines = rawAddress
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  let indirizzo = lines[0] || '';
  let cap = '';
  let comune = '';
  let provincia = '';

  if (lines.length > 1) {
    const secondLine = lines[1];
    const match = secondLine.match(/^(\d{5})\s+(.*?)\s+([A-Z]{2})$/);
    if (match) {
      cap = match[1];
      comune = match[2];
      provincia = match[3];
    } else {
      const capMatch = secondLine.match(/(\d{5})/);
      if (capMatch) cap = capMatch[1];
      const provMatch = secondLine.match(/\b([A-Z]{2})\b/);
      if (provMatch) provincia = provMatch[1];
      comune = secondLine.replace(/\b\d{5}\b/, '').replace(/\b[A-Z]{2}\b/, '').trim();
    }
  }

  return { indirizzo, cap, comune, provincia };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawPiva = searchParams.get('piva') || '';
    const cleanPiva = rawPiva.replace(/^IT/i, '').replace(/[\s\.\-_]/g, '').trim();

    if (!cleanPiva) {
      return NextResponse.json({ success: false, error: 'Parametro Partita IVA mancante' }, { status: 400 });
    }

    if (!checkLuhnChecksum(cleanPiva)) {
      return NextResponse.json({
        success: false,
        error: 'Formato Partita IVA non valido (lunghezza o codice di controllo errato)'
      }, { status: 400 });
    }

    // Interroga il servizio VIES della Commissione Europea / Agenzia delle Entrate
    const viesUrl = `https://ec.europa.eu/taxation_customs/vies/rest-api/ms/IT/vat/${cleanPiva}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const viesRes = await fetch(viesUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'RadioToscana-LeadEngine/2026'
      }
    });
    clearTimeout(timeout);

    if (!viesRes.ok) {
      return NextResponse.json({
        success: false,
        error: `Servizio di verifica momentaneamente non raggiungibile (HTTP ${viesRes.status})`
      }, { status: 502 });
    }

    const viesData = await viesRes.json();

    if (!viesData.isValid) {
      return NextResponse.json({
        success: false,
        isValid: false,
        piva: cleanPiva,
        error: 'Partita IVA non attiva o non presente nell\'archivio fiscale'
      });
    }

    const { indirizzo, cap, comune, provincia } = parseViesAddress(viesData.address || '');

    return NextResponse.json({
      success: true,
      isValid: true,
      piva: cleanPiva,
      ragioneSociale: viesData.name?.trim() || '',
      indirizzo,
      cap,
      comune,
      provincia,
      rawAddress: viesData.address,
      fonte: 'Anagrafe Tributaria / VIES Commissione Europea'
    });
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return NextResponse.json({ success: false, error: 'Timeout durante la connessione all\'Anagrafe Tributaria' }, { status: 504 });
    }
    return NextResponse.json({ success: false, error: err.message || 'Errore interno durante la verifica' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawPiva = body.piva || '';
    const url = new URL(request.url);
    url.searchParams.set('piva', rawPiva);
    return GET(new Request(url.toString(), { method: 'GET' }));
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Body JSON non valido' }, { status: 400 });
  }
}
