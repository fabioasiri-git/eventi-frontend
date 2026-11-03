import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const apiKey = process.env.TRELLO_API_KEY || '3e338c5029eacc367f1018b78a10016e';
    const token = process.env.TRELLO_API_TOKEN || 'ATTAf83b3d7cb153554dca090d35d3ab958264d11e6303b3673b9c51d14669c2767625B1FB56';
    const boardId = process.env.TRELLO_BOARD_ID || '646dc51185d295d89c878bff';

    const url = `https://api.trello.com/1/boards/${boardId}/lists?cards=open&card_fields=name,desc,due,shortUrl,dateLastActivity&fields=name&key=${apiKey}&token=${token}`;

    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ success: false, error: err }, { status: res.status });
    }

    const lists = await res.json();
    const activeLists = Array.isArray(lists) 
      ? lists.filter((l: any) => l.name !== 'Annullato')
      : [];

    return NextResponse.json({
      success: true,
      board: {
        id: boardId,
        name: 'Radio Toscana Copy - Spot',
        url: 'https://trello.com/b/7JoUM2H9/radio-toscana-copy-spot',
        lists: activeLists
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Errore server Trello' }, { status: 500 });
  }
}
