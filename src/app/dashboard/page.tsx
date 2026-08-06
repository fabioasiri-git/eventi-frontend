'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configurazione Supabase
const supabase = createClient(
  'https://unwqyqguxiumkrnlxatz.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVud3F5cWd1eGl1bWtybmx4YXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MzQxMDAsImV4cCI6MjA2ODUxMDEwMH0.rr2by4ydY5u87t-eDhnzGfrUcx51qUC-arBFIYNFimw'
);

interface EventoDashboard {
  evento_id: number;
  nome_evento: string;
  data_evento: string;
  luogo: string;
  url_evento?: string;
  email_organizzatore?: string;
  telefono_organizzatore?: string;
  totale_contatti: number;
  da_contattare: number;
  email_inviate: number;
  risposte_ricevute: number;
  interessati: number;
  totale_comunicazioni: number;
  ultima_comunicazione?: string;
  follow_up_scaduti: number;
  follow_up_programmati: number;
}

interface Contratto {
  id: number;
  azienda: string;
  garante: string;
  piva: string;
  email: string;
  importo: number;
  date_campagna: string;
  data_firma: string;
  dettagli: string;
}

interface KanbanCard {
  id: string;
  azienda: string;
  stato: 'preventivo' | 'attivo' | 'concluso' | 'radar';
  score: number;
  importo: number;
  dettagli_prodotto: string;
  localita: string;
  dettagli_extra?: string;
}

interface QuoteItem {
  id: string;
  prodotto: string;
  qty: number;
}

// Storico contratti estratti dal desktop (Dati reali offline)
const STORICO_CONTRATTI_DEFAULT: Contratto[] = [
  {
    id: 1,
    azienda: "Fondazione dell'Ospedale Pediatrico Anna Meyer ONLUS",
    garante: "Giampaolo Donzelli",
    piva: "C.F. 94080 470480",
    email: "a.benedetti@meyer.it",
    importo: 5000.0,
    date_campagna: "8 pp al gg dal 11/05 al 15/06",
    data_firma: "25/03/2022",
    dettagli: "Radio Toscana"
  },
  {
    id: 2,
    azienda: "Fondazione dell'Ospedale Pediatrico Anna Meyer ONLUS",
    garante: "Giampaolo Donzelli",
    piva: "C.F. 94080 470480",
    email: "a.benedetti@meyer.it",
    importo: 2400.0,
    date_campagna: "N/D",
    data_firma: "25/03/2022",
    dettagli: "Toscana Info (TO)"
  },
  {
    id: 3,
    azienda: "GDM Italiana Centro Italia SSD a RL",
    garante: "Giorgio Bucci",
    piva: "04445360409",
    email: "gdmissd@legalmail.it",
    importo: 2000.0,
    date_campagna: "N/D",
    data_firma: "12/01/2022",
    dettagli: "N/D"
  },
  {
    id: 4,
    azienda: "TORREMAR SRL",
    garante: "Cosimo Stiozzi Ridolfi",
    piva: "01229230535",
    email: "torremar@pec.milleritalia.net",
    importo: 780.0,
    date_campagna: "dal 14/02/2021 al 27/02/2021",
    data_firma: "11/02/2021",
    dettagli: "70 spot in totale"
  },
  {
    id: 5,
    azienda: "E-DWAY srl Mobility Solution",
    garante: "Sconosciuto",
    piva: "7000670484",
    email: "nadia@edway.it",
    importo: 500.0,
    date_campagna: "Sponsor 'Due in Trasferta' dal 9/11/20 al 01/4/20",
    data_firma: "05/11/2020",
    dettagli: "N/D"
  },
  {
    id: 6,
    azienda: "Ass. Naz. Autieri d'Italia Sez. Garfagnana",
    garante: "Massimo Turri",
    piva: "C.F. : 90004760469",
    email: "massimoturri@hotmail.it",
    importo: 450.0,
    date_campagna: "e dal 11/04 al 16/04",
    data_firma: "05/04/2022",
    dettagli: "N/D"
  },
  {
    id: 7,
    azienda: "Findale Consulting di D'Alessandro Ferdinando",
    garante: "D'Alessandro Ferdinando",
    piva: "3244400614",
    email: "findale@findale.it",
    importo: 250.0,
    date_campagna: "N/D",
    data_firma: "31/12/2020",
    dettagli: "N/D"
  }
];

// Dati iniziali della Pipeline Kanban
const KANBAN_DEFAULT: KanbanCard[] = [
  {
    id: 'k-1',
    azienda: 'TINGHI MOTORS SRL',
    stato: 'preventivo',
    score: 88,
    importo: 1165.00,
    dettagli_prodotto: 'Spot 20" + Primo di Barra',
    localita: 'Empoli (FI)',
    dettagli_extra: 'Trattativa in corso'
  },
  {
    id: 'k-2',
    azienda: 'Pro Loco Sagra del Tordello',
    stato: 'preventivo',
    score: 82,
    importo: 617.50,
    dettagli_prodotto: 'Spot 20" + 5 Citazioni Live',
    localita: 'Camaiore (LU)',
    dettagli_extra: 'In attesa di approvazione'
  },
  {
    id: 'k-3',
    azienda: 'TINGHI MOTORS SRL',
    stato: 'attivo',
    score: 95,
    importo: 1450.00,
    dettagli_prodotto: '72 Spot Programmati',
    localita: 'Empoli (FI)',
    dettagli_extra: 'In onda dal 23 al 31 Luglio 2026'
  },
  {
    id: 'k-4',
    azienda: 'ETRURIA LUCE E GAS SPA',
    stato: 'concluso',
    score: 90,
    importo: 3400.00,
    dettagli_prodotto: 'Spot 20" + Citazioni',
    localita: 'Firenze (FI)',
    dettagli_extra: 'Contratto Giugno 2026'
  },
  {
    id: 'k-5',
    azienda: 'Pro Loco Sagra del Tordello (Autunno)',
    stato: 'radar',
    score: 82,
    importo: 617.50,
    dettagli_prodotto: 'Pianificazione Autunnale',
    localita: 'Camaiore (LU)',
    dettagli_extra: '⏰ Sveglia Settembre per recall'
  }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'kanban' | 'contratti' | 'eventi'>('kanban');
  const [eventi, setEventi] = useState<EventoDashboard[]>([]);
  const [contratti, setContratti] = useState<Contratto[]>(STORICO_CONTRATTI_DEFAULT);
  const [kanbanCards, setKanbanCards] = useState<KanbanCard[]>(KANBAN_DEFAULT);
  
  // Stati di caricamento ed errori
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'online' | 'paused' | 'checking'>('checking');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Filtri e Ricerca
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroStato, setFiltroStato] = useState<string>('tutti');

  // Stato Modale Preventivatore Multi-Riga
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteCliente, setQuoteCliente] = useState('');
  const [quoteLocalita, setQuoteLocalita] = useState('');
  const [quoteArea, setQuoteArea] = useState<'FI' | 'PI' | 'SI' | 'RETE'>('FI');
  const [quoteSconto, setQuoteSconto] = useState(15);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([{ id: '1', prodotto: 'spot20', qty: 100 }]);

  // Calcoli finanziari basati su contratti e pipeline
  const totaleFatturato = contratti.reduce((sum, c) => sum + c.importo, 0);
  const valoreMedioContratto = contratti.length > 0 ? (totaleFatturato / contratti.length) : 0;
  const pipelineAttesa = kanbanCards
    .filter(c => c.stato === 'preventivo')
    .reduce((sum, c) => sum + c.importo, 0);
  const cambioMerceValore = 2000.00; // Es. contratto GDM Italiana (Barter)

  useEffect(() => {
    verificaEcaricaDati();
  }, []);

  const verificaEcaricaDati = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      setDbStatus('checking');

      // Test di connessione rapido per capire se Supabase è raggiungibile
      const { error: pingError } = await supabase.from('eventi').select('id').limit(1);
      
      if (pingError) {
        setDbStatus('paused');
        setErrorMsg("Il database Supabase (unwqyqguxiumkrnlxatz) sembra Sospeso o Inattivo. La Dashboard è stata avviata in Modalità Offline mostrando lo Storico Contratti e la Pipeline Kanban interattiva.");
        setLoading(false);
        return;
      }

      setDbStatus('online');

      // Carica dati reali da Supabase
      const { data: dashboardData, error } = await supabase
        .from('dashboard_eventi_completa')
        .select('*')
        .order('data_evento', { ascending: false });

      if (error) {
        console.error('Errore nel caricare la dashboard eventi:', error);
        setErrorMsg(`Connesso a Supabase, ma impossibile caricare la vista dashboard_eventi_completa: ${error.message}`);
      } else {
        setEventi(dashboardData || []);
      }

      // Prova a caricare contratti reali dal database se esiste la tabella
      const { data: dbContratti, error: contrattiError } = await supabase
        .from('storico_contratti')
        .select('*');
        
      if (!contrattiError && dbContratti && dbContratti.length > 0) {
        setContratti(dbContratti);
      }

    } catch (err: any) {
      console.error('Errore imprevisto:', err);
      setDbStatus('paused');
      setErrorMsg(`Errore di connessione: ${err.message}. Modalità Offline abilitata.`);
    } finally {
      setLoading(false);
    }
  };

  const getStatoEvento = (evento: EventoDashboard) => {
    if (evento.follow_up_scaduti > 0) return 'urgente';
    if (evento.interessati > 0) return 'interessato';
    if (evento.risposte_ricevute > 0) return 'risposto';
    if (evento.email_inviate > 0) return 'contattato';
    if (evento.da_contattare > 0) return 'da_contattare';
    return 'senza_contatti';
  };

  const getColoreStato = (stato: string) => {
    switch (stato) {
      case 'urgente': return 'bg-red-500/20 text-red-300 border border-red-500/30';
      case 'interessato': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      case 'risposto': return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'contattato': return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
      case 'da_contattare': return 'bg-orange-500/20 text-orange-300 border border-orange-500/30';
      default: return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
    }
  };

  // Calcolo prezzi del Preventivatore Multi-Riga
  const calculateQuotePrice = () => {
    let baseSpotArea = 9.0;
    if (quoteArea === 'PI') baseSpotArea = 5.5;
    if (quoteArea === 'SI') baseSpotArea = 4.5;
    if (quoteArea === 'RETE') baseSpotArea = 13.0;

    let totalListino = 0;
    let nonDiscountableTotal = 0;

    quoteItems.forEach(item => {
      let linePrice = 0;
      const qty = item.qty;

      if (item.prodotto === 'spot20') linePrice = baseSpotArea * qty;
      else if (item.prodotto === 'spot30') linePrice = (baseSpotArea * 1.2) * qty;
      else if (item.prodotto === 'primo_barra') linePrice = 600.0;
      else if (item.prodotto === 'citazione') linePrice = 30.0 * qty;
      else if (item.prodotto === 'pillola1') linePrice = 150.0 * qty;
      else if (item.prodotto === 'pillola2') linePrice = 100.0 * qty;
      else if (item.prodotto === 'djset') linePrice = 500.0 * qty;
      else if (item.prodotto === 'segnale') linePrice = 650.0 * qty;
      else if (item.prodotto === 'prod') {
        linePrice = 100.0 * qty;
        nonDiscountableTotal += linePrice;
      }

      totalListino += linePrice;
    });

    const discountableAmount = totalListino - nonDiscountableTotal;
    const totalRiservato = (discountableAmount * (1 - (quoteSconto / 100))) + nonDiscountableTotal;

    return { totalListino, totalRiservato };
  };

  const { totalListino, totalRiservato } = calculateQuotePrice();

  const handleAddQuoteItem = () => {
    setQuoteItems([...quoteItems, { id: Date.now().toString(), prodotto: 'citazione', qty: 5 }]);
  };

  const handleRemoveQuoteItem = (id: string) => {
    setQuoteItems(quoteItems.filter(item => item.id !== id));
  };

  const handleUpdateQuoteItem = (id: string, field: 'prodotto' | 'qty', value: any) => {
    setQuoteItems(quoteItems.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleSaveQuote = () => {
    if (!quoteCliente.trim()) {
      alert("Inserire il nome cliente!");
      return;
    }
    const newCard: KanbanCard = {
      id: `k-${Date.now()}`,
      azienda: quoteCliente,
      stato: 'preventivo',
      score: 85,
      importo: totalRiservato,
      dettagli_prodotto: quoteItems.map(i => `${i.prodotto} x${i.qty}`).join(', '),
      localita: quoteLocalita || 'Firenze',
      dettagli_extra: `Multi-Riga (Sconto ${quoteSconto}%)`
    };
    setKanbanCards([newCard, ...kanbanCards]);
    setIsQuoteModalOpen(false);
    // Reset form
    setQuoteCliente('');
    setQuoteLocalita('');
    setQuoteItems([{ id: '1', prodotto: 'spot20', qty: 100 }]);
  };

  const convertToContract = (cardId: string) => {
    setKanbanCards(kanbanCards.map(c => {
      if (c.id === cardId) {
        return { ...c, stato: 'attivo' as const, dettagli_extra: 'In onda ORA' };
      }
      return c;
    }));
    alert("🎉 Convertito in CONTRATTO ATTIVO!");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: KanbanCard['stato']) => {
    const cardId = e.dataTransfer.getData('cardId');
    if (cardId) {
      setKanbanCards(kanbanCards.map(c => {
        if (c.id === cardId) {
          return { ...c, stato: targetStatus };
        }
        return c;
      }));
    }
  };

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('cardId', cardId);
  };

  // Calcoli statistiche generali degli eventi
  const statistiche = eventi.reduce((acc, evento) => ({
    totaleEventi: acc.totaleEventi + 1,
    totaleContatti: acc.totaleContatti + (evento.totale_contatti || 0),
    daContattare: acc.daContattare + (evento.da_contattare || 0),
    interessati: acc.interessati + (evento.interessati || 0),
    followUpScaduti: acc.followUpScaduti + (evento.follow_up_scaduti || 0)
  }), {
    totaleEventi: 0,
    totaleContatti: 0,
    daContattare: 0,
    interessati: 0,
    followUpScaduti: 0
  });

  // Filtro Eventi
  const eventiFiltrati = eventi.filter(evento => {
    if (filtroStato === 'tutti') return true;
    return getStatoEvento(evento) === filtroStato;
  });

  // Filtro/Ricerca Contratti
  const contrattiFiltrati = contratti.filter(c => {
    const searchLower = searchQuery.toLowerCase();
    return c.azienda.toLowerCase().includes(searchLower) || 
           c.garante.toLowerCase().includes(searchLower) ||
           c.piva.toLowerCase().includes(searchLower);
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Banner per database sospeso */}
      {dbStatus === 'paused' && (
        <div className="bg-gradient-to-r from-amber-950 to-orange-900 border-b border-amber-500/30 px-4 py-3 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-bold text-amber-200">Database Supabase Temporaneamente Sospeso</p>
                <p className="text-xs text-amber-300">Il server free tier si è addormentato per inattività. Ripristinalo dal tuo pannello Supabase.</p>
              </div>
            </div>
            <a 
              href="https://supabase.com/dashboard/project/unwqyqguxiumkrnlxatz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-lg text-sm transition shadow-lg"
            >
              🔄 Sblocca Database
            </a>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-zinc-900/60 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-md text-xs font-semibold uppercase tracking-wider border border-indigo-500/30">
                Lead Engine RT
              </span>
              <span className={`w-2.5 h-2.5 rounded-full ${dbStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span className="text-xs text-zinc-400 font-mono">
                {dbStatus === 'online' ? 'Database Realtime OK' : 'Database Offline'}
              </span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent mt-1">
              Radio Toscana Commerciale
            </h1>
          </div>
          
          {/* Pulsanti Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-rose-950/40 flex items-center gap-2"
            >
              <span>➕</span> Nuovo Preventivo Multi-Riga (Sez. 16)
            </button>

            {/* Tabs */}
            <div className="flex bg-zinc-950 p-1.5 rounded-xl border border-zinc-850">
              <button
                onClick={() => setActiveTab('kanban')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'kanban'
                    ? 'bg-zinc-800 text-zinc-100 shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                📋 Pipeline Kanban
              </button>
              <button
                onClick={() => setActiveTab('contratti')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'contratti'
                    ? 'bg-zinc-800 text-zinc-100 shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                📂 Storico Contratti
              </button>
              <button
                onClick={() => setActiveTab('eventi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'eventi'
                    ? 'bg-zinc-800 text-zinc-100 shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                📥 Lead & Eventi
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error Alert */}
        {errorMsg && dbStatus !== 'paused' && (
          <div className="mb-8 p-4 bg-red-950/40 border border-red-500/20 text-red-200 rounded-2xl flex items-start gap-3">
            <span className="text-lg">❌</span>
            <div className="text-sm">
              <h4 className="font-bold">Attenzione</h4>
              <p className="opacity-90">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* 1. SEZIONE FINANZIARIA (Sempre visibile - Sezione 19) */}
        <section className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
            <span>📈</span> Metriche Finanziarie RT (Sezione 19)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Fatturato Contrattualizzato */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-zinc-850 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Fatturato Contrattualizzato</p>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-2 font-mono">
                €{totaleFatturato.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">Somma contratti attivi/storici</p>
            </div>

            {/* Pipeline Attesa */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-zinc-850 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Pipeline Attesa (Stima)</p>
              <h3 className="text-3xl font-extrabold text-blue-400 mt-2 font-mono">
                €{pipelineAttesa.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">Preventivi aperti × prob. chiusura</p>
            </div>

            {/* Valore Barter (Cambio Merce) */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-zinc-850 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Valore Cambio Merce</p>
              <h3 className="text-3xl font-extrabold text-indigo-400 mt-2 font-mono">
                €{cambioMerceValore.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">Scambi merce/servizi registrati</p>
            </div>

            {/* Valore Medio Contratto */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-zinc-850 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Valore Medio Contratto</p>
              <h3 className="text-3xl font-extrabold text-purple-400 mt-2 font-mono">
                €{valoreMedioContratto.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">Media per singolo accordo</p>
            </div>
            
          </div>
        </section>

        {/* 2. TAB CONTENUTO - PIPELINE KANBAN (Dall'app Vercel) */}
        {activeTab === 'kanban' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-zinc-100">Pipeline Commerciale (Semaforo SLA Sez. 17)</h3>
                <p className="text-xs text-zinc-400">Trascina le schede tra le colonne per aggiornare lo stato di avanzamento</p>
              </div>
            </div>

            {/* Griglia Kanban */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Colonna 1: Preventivi in Trattativa */}
              <div 
                className="bg-zinc-900/60 p-4 rounded-3xl border border-zinc-850 flex flex-col gap-4 min-h-[500px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'preventivo')}
              >
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">1. Preventivi in Trattativa</span>
                  <span className="px-2 py-0.5 bg-zinc-800 rounded-full text-xs font-mono">
                    {kanbanCards.filter(c => c.stato === 'preventivo').length}
                  </span>
                </div>
                
                <div className="flex flex-col gap-3">
                  {kanbanCards.filter(c => c.stato === 'preventivo').map(c => (
                    <div 
                      key={c.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, c.id)}
                      className="bg-zinc-950 p-4 rounded-2xl border border-zinc-850 hover:border-zinc-700 transition cursor-grab active:cursor-grabbing shadow-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-zinc-200 text-sm">{c.azienda}</h4>
                        <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-md text-[10px] font-bold">
                          🔴 {c.score} pts
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mb-3">{c.dettagli_prodotto}</p>
                      
                      <div className="flex justify-between items-center text-xs text-zinc-500 border-t border-zinc-900 pt-3">
                        <span>{c.localita}</span>
                        <span className="font-bold text-zinc-300 font-mono">€{c.importo.toFixed(2)}</span>
                      </div>
                      
                      <button 
                        onClick={() => convertToContract(c.id)}
                        className="w-full mt-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold rounded-lg text-xs transition"
                      >
                        🎉 Passa a Contratto
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Colonna 2: Contratto Attivo */}
              <div 
                className="bg-zinc-900/60 p-4 rounded-3xl border border-zinc-850 flex flex-col gap-4 min-h-[500px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'attivo')}
              >
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">2. Contratto Attivo (In Onda)</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-mono">
                    {kanbanCards.filter(c => c.stato === 'attivo').length}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {kanbanCards.filter(c => c.stato === 'attivo').map(c => (
                    <div 
                      key={c.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, c.id)}
                      className="bg-zinc-950 p-4 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition cursor-grab shadow-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-zinc-200 text-sm">{c.azienda}</h4>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md text-[10px] font-bold">
                          🟢 IN ONDA ORA
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mb-2">{c.dettagli_prodotto}</p>
                      <p className="text-[10px] text-zinc-500 italic mb-3">{c.dettagli_extra}</p>
                      
                      <div className="flex justify-between items-center text-xs text-zinc-500 border-t border-zinc-900 pt-3">
                        <span>{c.localita}</span>
                        <span className="font-bold text-emerald-400 font-mono">€{c.importo.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Colonna 3: Contratti Conclusi */}
              <div 
                className="bg-zinc-900/60 p-4 rounded-3xl border border-zinc-850 flex flex-col gap-4 min-h-[500px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'concluso')}
              >
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">3. Contratti Conclusi (Storico)</span>
                  <span className="px-2 py-0.5 bg-zinc-800 rounded-full text-xs font-mono">
                    {kanbanCards.filter(c => c.stato === 'concluso').length}
                  </span>
                </div>

                <div className="flex flex-col gap-3 opacity-80">
                  {kanbanCards.filter(c => c.stato === 'concluso').map(c => (
                    <div 
                      key={c.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, c.id)}
                      className="bg-zinc-950 p-4 rounded-2xl border border-zinc-850 hover:border-zinc-800 transition cursor-grab shadow-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-zinc-300 text-sm">{c.azienda}</h4>
                        <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-md text-[10px] font-bold">
                          Concluso
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mb-2">{c.dettagli_prodotto}</p>
                      
                      <div className="flex justify-between items-center text-xs text-zinc-650 border-t border-zinc-900 pt-3">
                        <span>{c.localita}</span>
                        <span className="font-bold text-zinc-400 font-mono">€{c.importo.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Colonna 4: Memory Lock Radar */}
              <div 
                className="bg-zinc-900/60 p-4 rounded-3xl border border-zinc-850 flex flex-col gap-4 min-h-[500px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'radar')}
              >
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">4. Memory Lock Radar</span>
                  <span className="px-2 py-0.5 bg-zinc-800 rounded-full text-xs font-mono">
                    {kanbanCards.filter(c => c.stato === 'radar').length}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {kanbanCards.filter(c => c.stato === 'radar').map(c => (
                    <div 
                      key={c.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, c.id)}
                      className="bg-zinc-950 p-4 rounded-2xl border border-zinc-850 hover:border-zinc-800 transition cursor-grab shadow-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-zinc-200 text-sm">{c.azienda}</h4>
                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-md text-[10px] font-bold">
                          ⏰ Recall
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mb-2">{c.dettagli_prodotto}</p>
                      <p className="text-[10px] text-yellow-400/80 font-semibold mb-3">{c.dettagli_extra}</p>
                      
                      <div className="flex justify-between items-center text-xs text-zinc-500 border-t border-zinc-900 pt-3">
                        <span>{c.localita}</span>
                        <span className="font-bold text-zinc-300 font-mono">€{c.importo.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>
        )}

        {/* 3. TAB CONTENUTO - STORICO CONTRATTI */}
        {activeTab === 'contratti' && (
          <section className="bg-zinc-900 p-6 rounded-3xl border border-zinc-850 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-zinc-100">Storico Contratti Compilati</h3>
                <p className="text-xs text-zinc-400">Elenco completo dei contratti inseriti nello storico (.xls analizzati dal desktop)</p>
              </div>
              
              {/* Barra di ricerca */}
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Cerca per azienda, garante..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-zinc-700 text-zinc-100 transition"
                />
                <span className="absolute left-3 top-2.5 text-zinc-500">🔍</span>
              </div>
            </div>

            {/* Tabella Contratti */}
            <div className="overflow-x-auto rounded-xl border border-zinc-850">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950 text-zinc-400 text-xs font-semibold uppercase tracking-wider border-b border-zinc-850">
                    <th className="py-4 px-5">Ragione Sociale</th>
                    <th className="py-4 px-5">Garante</th>
                    <th className="py-4 px-5">Partita IVA</th>
                    <th className="py-4 px-5">Data Firma</th>
                    <th className="py-4 px-5">Periodo Campagna</th>
                    <th className="py-4 px-5 text-right">Importo (iva escl.)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850 text-sm">
                  {contrattiFiltrati.map((c) => (
                    <tr key={c.id} className="hover:bg-zinc-850/40 transition">
                      <td className="py-4 px-5 font-medium text-zinc-200">
                        <div>
                          <p>{c.azienda}</p>
                          <p className="text-xs text-zinc-500 font-mono mt-0.5">{c.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-zinc-300">{c.garante}</td>
                      <td className="py-4 px-5 font-mono text-xs text-zinc-400">{c.piva}</td>
                      <td className="py-4 px-5 text-zinc-350">{c.data_firma}</td>
                      <td className="py-4 px-5 text-zinc-400 max-w-xs truncate" title={c.date_campagna}>
                        {c.date_campagna}
                      </td>
                      <td className="py-4 px-5 text-right font-bold text-zinc-100 font-mono">
                        €{c.importo.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                  {contrattiFiltrati.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-zinc-500">
                        Nessun contratto trovato corrisponde alla ricerca.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 4. TAB CONTENUTO - LEAD E OUTREACH DA DATABASE */}
        {activeTab === 'eventi' && (
          <section className="space-y-6">
            
            {/* Eventi stats per lead nurturing */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-850">
                <p className="text-xs text-zinc-400 font-semibold">Lead da Contattare</p>
                <h4 className="text-2xl font-bold font-mono mt-1 text-orange-400">{statistiche.daContattare}</h4>
              </div>
              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-850">
                <p className="text-xs text-zinc-400 font-semibold">Email Inviate</p>
                <h4 className="text-2xl font-bold font-mono mt-1 text-yellow-400">
                  {eventi.reduce((sum, e) => sum + e.email_inviate, 0)}
                </h4>
              </div>
              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-850">
                <p className="text-xs text-zinc-400 font-semibold">Risposte Ricevute</p>
                <h4 className="text-2xl font-bold font-mono mt-1 text-blue-400">
                  {eventi.reduce((sum, e) => sum + e.risposte_ricevute, 0)}
                </h4>
              </div>
              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-850">
                <p className="text-xs text-zinc-400 font-semibold">Clienti Caldi (Interessati)</p>
                <h4 className="text-2xl font-bold font-mono mt-1 text-emerald-400">{statistiche.interessati}</h4>
              </div>
            </div>

            {/* Lista Eventi */}
            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-850 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">Eventi Scansionati dal Territorio</h3>
                  <p className="text-xs text-zinc-400">Eventi toscani rilevati dal Lead Engine per l'outreach commerciale</p>
                </div>
                
                {/* Filtro stato */}
                <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-850">
                  {['tutti', 'urgente', 'da_contattare', 'interessato'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFiltroStato(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                        filtroStato === s
                          ? 'bg-zinc-800 text-zinc-100'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista Eventi UI */}
              <div className="divide-y divide-zinc-850">
                {eventiFiltrati.map((e) => {
                  const stato = getStatoEvento(e);
                  return (
                    <div key={e.evento_id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getColoreStato(stato)}`}>
                            {stato.replace('_', ' ')}
                          </span>
                          <h4 className="font-semibold text-zinc-200">{e.nome_evento}</h4>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">
                          📅 {e.data_evento} • 📍 {e.luogo}
                        </p>
                        {e.email_organizzatore && (
                          <p className="text-xs text-zinc-500 mt-0.5">
                            📧 {e.email_organizzatore} {e.telefono_organizzatore && `• 📞 ${e.telefono_organizzatore}`}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right text-xs text-zinc-400">
                          <p>👥 {e.totale_contatti} Contatti</p>
                          <p className="text-zinc-500">{e.totale_comunicazioni} Invii Totali</p>
                        </div>
                        {e.url_evento && (
                          <a
                            href={e.url_evento}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition"
                          >
                            🔗 Vedi Fonte
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}

                {eventiFiltrati.length === 0 && (
                  <div className="py-12 text-center text-zinc-500 text-sm">
                    {dbStatus === 'paused' 
                      ? 'Nessun evento disponibile in modalità Offline. Sblocca il database Supabase per caricare i lead reali.' 
                      : 'Nessun evento corrisponde al filtro selezionato.'
                    }
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

      </main>

      {/* 5. MODALE INTERATTIVO PREVENTIVATORE MULTI-RIGA (Sezione 16) */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 text-xl font-bold"
            >
              ✕
            </button>
            
            <h3 className="text-xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
              <span>📋</span> Crea Preventivo Multi-Riga (Sezione 16)
            </h3>

            <div className="space-y-4">
              {/* Cliente */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Nome Cliente / Azienda</label>
                <input 
                  type="text" 
                  value={quoteCliente}
                  onChange={(e) => setQuoteCliente(e.target.value)}
                  placeholder="es. Concessionaria o Pro Loco Toscana"
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-sm focus:outline-none focus:border-zinc-700 text-zinc-100"
                />
              </div>

              {/* Località */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Località</label>
                <input 
                  type="text" 
                  value={quoteLocalita}
                  onChange={(e) => setQuoteLocalita(e.target.value)}
                  placeholder="es. Empoli (FI)"
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-sm focus:outline-none focus:border-zinc-700 text-zinc-100"
                />
              </div>

              {/* Area e Sconto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Area Copertura</label>
                  <select 
                    value={quoteArea}
                    onChange={(e) => setQuoteArea(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-sm focus:outline-none focus:border-zinc-700 text-zinc-100"
                  >
                    <option value="FI">Firenze / Prato / Pistoia (AREA 1)</option>
                    <option value="PI">Pisa / Lucca / Maremma (AREA 2)</option>
                    <option value="SI">Siena / Arezzo / Grosseto (AREA 3)</option>
                    <option value="RETE">Tutte le Province (RETE)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Sconto Complessivo (%)</label>
                  <input 
                    type="number" 
                    value={quoteSconto}
                    onChange={(e) => setQuoteSconto(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-sm focus:outline-none focus:border-zinc-700 text-zinc-100"
                  />
                </div>
              </div>

              {/* Righe Prodotti */}
              <div className="border-t border-zinc-800 pt-4 mt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase">Voci di Listino Acquistate</h4>
                  <button 
                    onClick={handleAddQuoteItem}
                    className="px-2.5 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-semibold hover:bg-indigo-500/30 transition"
                  >
                    ➕ Aggiungi Voce
                  </button>
                </div>

                <div className="space-y-3">
                  {quoteItems.map((item, idx) => (
                    <div key={item.id} className="flex flex-col md:flex-row items-center gap-3 bg-zinc-950 p-3 rounded-2xl border border-zinc-850">
                      <div className="flex-1 w-full">
                        <select
                          value={item.prodotto}
                          onChange={(e) => handleUpdateQuoteItem(item.id, 'prodotto', e.target.value)}
                          className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200"
                        >
                          <option value="spot20">Spot Tabellare 20" (Prezzo d'Area)</option>
                          <option value="spot30">Spot Tabellare 30" (+20% su d'Area)</option>
                          <option value="primo_barra">Primo di Barra 10" (14gg - €600 Area 1)</option>
                          <option value="citazione">Citazione Live Speaker (€30,00 l'una)</option>
                          <option value="pillola1">Pillola 60" (Prima Messa in Onda - €150,00)</option>
                          <option value="pillola2">Pillola 60" (Repliche - €100,00)</option>
                          <option value="djset">DJ Set + Promo Radio (€500,00)</option>
                          <option value="segnale">Segnale Orario (2 sett €650,00)</option>
                          <option value="prod">Costo Produzione Spot (€100,00 non scontabile)</option>
                        </select>
                      </div>
                      <div className="w-full md:w-24">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => handleUpdateQuoteItem(item.id, 'qty', Math.max(1, parseInt(e.target.value) || 1))}
                          placeholder="Q.tà"
                          className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-center text-zinc-100"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveQuoteItem(item.id)}
                        disabled={quoteItems.length === 1}
                        className="px-2.5 py-1.5 bg-red-950/40 text-red-400 border border-red-900/30 rounded-lg text-xs font-bold hover:bg-red-950/60 disabled:opacity-40 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anteprima prezzi */}
              <div className="grid grid-cols-2 gap-4 bg-zinc-950 p-4 rounded-2xl border border-zinc-850 mt-6">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-semibold">Totale Listino</p>
                  <p className="text-lg font-bold text-zinc-300 font-mono">€{totalListino.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500 uppercase font-semibold">Prezzo Riservato Cliente</p>
                  <p className="text-xl font-extrabold text-emerald-400 font-mono">€{totalRiservato.toFixed(2)}</p>
                </div>
              </div>

              {/* Azioni */}
              <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800 mt-6">
                <button
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-sm font-semibold rounded-xl transition"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSaveQuote}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-rose-950/20"
                >
                  💾 Salva & Inserisci in Pipeline
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
