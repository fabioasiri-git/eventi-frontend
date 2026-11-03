import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, dueDate, listId } = body;

    const apiKey = process.env.TRELLO_API_KEY || '3e338c5029eacc367f1018b78a10016e';
    const token = process.env.TRELLO_API_TOKEN || 'ATTAf83b3d7cb153554dca090d35d3ab958264d11e6303b3673b9c51d14669c2767625B1FB56';
    const targetListId = listId || process.env.TRELLO_LIST_DA_FARE_ID || '646dc5b02752eebe83a9cce3';

    if (!title) {
      return NextResponse.json({ success: false, error: 'Titolo obbligatorio' }, { status: 400 });
    }

    // 1. Crea la card su Trello inviando i campi nel body JSON (evita 414 URI Too Long)
    const cardPayload: any = {
      idList: targetListId,
      name: title,
      desc: description || '',
      pos: 'top',
    };

    if (dueDate && String(dueDate).trim()) {
      const cleanDue = String(dueDate).trim().split(' ')[0];
      if (/^\d{4}-\d{2}-\d{2}/.test(cleanDue)) {
        cardPayload.due = `${cleanDue}T18:00:00.000Z`;
      }
    }

    const resCard = await fetch(`https://api.trello.com/1/cards?key=${apiKey}&token=${token}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cardPayload)
    });

    if (!resCard.ok) {
      const errText = await resCard.text();
      return NextResponse.json({ success: false, error: errText }, { status: resCard.status });
    }

    const cardData = await resCard.json();
    const cardId = cardData.id;
    const cardUrl = cardData.shortUrl || cardData.url;

    // 2. Crea la checklist operativa per Edi
    try {
      const resChk = await fetch(`https://api.trello.com/1/checklists?key=${apiKey}&token=${token}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idCard: cardId,
          name: 'Checklist Produzione Spot Audio'
        })
      });

      if (resChk.ok) {
        const chkData = await resChk.json();
        const chkId = chkData.id;

        const checkItems = [
          'Contattare referente per briefing ed esigenze promozionali',
          'Stesura testo copy 20" (ca. 40-45 parole)',
          'Approvazione testo scritta dal cliente (WhatsApp o Email)',
          'Registrazione voce speaker in studio & mastering broadcast',
          'Caricare file Master Audio definitivo (WAV/MP3) in questa scheda'
        ];

        for (const item of checkItems) {
          await fetch(`https://api.trello.com/1/checklists/${chkId}/checkItems?key=${apiKey}&token=${token}`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: item,
              pos: 'bottom'
            })
          });
        }
      }
    } catch (e) {
      console.warn('Errore creazione checklist secondaria:', e);
    }

    return NextResponse.json({
      success: true,
      cardId: cardId,
      cardUrl: cardUrl,
      message: 'Card creata con successo nella colonna Da Fare di Edi'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Errore server' }, { status: 500 });
  }
}
