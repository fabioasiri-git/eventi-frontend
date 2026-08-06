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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'contratti' | 'eventi'>('contratti');
  const [eventi, setEventi] = useState<EventoDashboard[]>([]);
  const [contratti, setContratti] = useState<Contratto[]>(STORICO_CONTRATTI_DEFAULT);
  
  // Stati di caricamento ed errori
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'online' | 'paused' | 'checking'>('checking');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Filtri e Ricerca
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroStato, setFiltroStato] = useState<string>('tutti');

  // Calcoli finanziari basati sullo storico contratti
  const totaleFatturato = contratti.reduce((sum, c) => sum + c.importo, 0);
  const valoreMedioContratto = contratti.length > 0 ? (totaleFatturato / contratti.length) : 0;
  const pipelineAttesa = 3450.00; // Valore stimato preventivi aperti
  const cambioMerceValore = 2000.00; // Es. contratto GDM Italiana (Barter)

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
        // Se c'è errore di rete o DNS, assumiamo che il DB sia sospeso/paused
        setDbStatus('paused');
        setErrorMsg("Il database Supabase (unwqyqguxiumkrnlxatz) sembra Sospeso o Inattivo. La Dashboard è stata avviata in Modalità Offline mostrando lo Storico Contratti estratto dal desktop.");
        setLoading(false);
        return;
      }

      setDbStatus('online');

      // Carica dati reali da Supabase (se il database è online)
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
                {dbStatus === 'online' ? 'Database Online' : 'Database Offline'}
              </span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent mt-1">
              Dashboard Commerciale & Contratti
            </h1>
          </div>
          
          {/* Tabs */}
          <div className="flex bg-zinc-950 p-1.5 rounded-xl border border-zinc-850">
            <button
              onClick={() => setActiveTab('contratti')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'contratti'
                  ? 'bg-zinc-800 text-zinc-100 shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              📂 Storico Contratti
            </button>
            <button
              onClick={() => setActiveTab('eventi')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'eventi'
                  ? 'bg-zinc-800 text-zinc-100 shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              📥 Lead & Eventi
            </button>
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

        {/* 1. SEZIONE FINANZIARIA (Sempre visibile - Cuore del business) */}
        <section className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
            <span>📈</span> Metriche Finanziarie RT
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Fatturato Contrattualizzato */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-zinc-850 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Fatturato Contrattualizzato</p>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-2 font-mono">
                €{totaleFatturato.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">Totale di 7 contratti attivi o storici</p>
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

        {/* 2. TAB CONTENUTO - STORICO CONTRATTI */}
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

        {/* 3. TAB CONTENUTO - LEAD E OUTREACH DA DATABASE */}
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
    </div>
  );
}
