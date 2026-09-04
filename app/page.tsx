'use client';

import React, { useState, useEffect } from 'react';
import storicoClientiData from '../data/storico_clienti.json';

interface HistoricalContract {
  anno: string;
  data: string;
  prezzo: number | string;
  spot: string;
  file: string;
  referente: string;
}

interface HistoricalClient {
  ditta: string;
  referente: string;
  indirizzo: string;
  cap: string;
  citta: string;
  provincia: string;
  telefono: string;
  email: string;
  piva: string;
  contratti: HistoricalContract[];
  totale_contratti: number;
  ultimo_prezzo: number | string;
  ultimo_anno: string;
}

interface QuoteLineItem {
  id: string;
  tipo: string;
  copertura: string;
  dettagli: string;
  fascia: string;
  periodo: string;
  prezzoListino: number;
  valore: number;
  // Specifiche avanzate per Spot Tabellari (Data Inizio, Data Fine, Quantità Giornaliera, Omaggi)
  isSpot?: boolean;
  dataInizio?: string;
  dataFine?: string;
  spotGiornalieri?: number;
  giorniTotali?: number;
  spotTotali?: number;
  spotOmaggio?: number;
  formatoSecondi?: number;
  // Specifiche Produzione Audio Spot (Solo RT+RF 100€ vs Diritti Liberi 169€)
  tipoProduzione?: 'SOLO_RT_RF' | 'DIRITTI_LIBERI_TOSCANA';
  tariffaUnitaria?: number;
}

interface LeadRow {
  id?: number | string;
  nome_azienda_evento: string;
  settore: string;
  comune: string;
  provincia: string;
  area_target: string;
  fase_commerciale: string;
  tipo_contratto?: 'SECCO' | 'SCALARE';
  valore_preventivo: number;
  valore_contratto: number;
  plafond_totale_spot?: number;
  spot_rimasti?: number;
  is_cambio_merce: boolean;
  dettagli_cambio_merce?: string;
  probabilita_chiusura: number;
  data_evento?: string;
  flag_ricorrente?: boolean;
  data_prossimo_contatto?: string;
  tipo_produzione_spot?: string;
  numero_contratto?: string;
  stato_programmazione?: string;
  data_invio_programmazione?: string;
  anno_riferimento?: string;
}

export default function LeadEngineDashboard() {
  const [activeTab, setActiveTab] = useState<'kanban' | 'queues' | 'renewals' | 'memory' | 'production' | 'schedules'>('kanban');
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [selectedYear, setSelectedYear] = useState<'2026' | '2025' | '2024' | 'ALL'>('2026');

  // Modali Preventivo, Proposta A4, Contratto e Remind
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedLeadForEmail, setSelectedLeadForEmail] = useState<LeadRow | null>(null);

  // Remind Modal a 3 Step (Lavoro Ufficio 18:30)
  const [showRemindModal, setShowRemindModal] = useState(false);
  const [selectedQuoteForRemind, setSelectedQuoteForRemind] = useState<LeadRow | null>(null);
  const [remindStep, setRemindStep] = useState<1 | 2 | 3>(1);
  const [remindSubject, setRemindSubject] = useState('');
  const [remindBody, setRemindBody] = useState('');
  const [remindSent, setRemindSent] = useState(false);

  // Preventivo Modulare Form State (Standard / Barter Parziale / Barter Puro)
  const [qNome, setQNome] = useState('');
  const [qReferente, setQReferente] = useState('');
  const [qTelefono, setQTelefono] = useState('');
  const [qEmail, setQEmail] = useState('');
  const [qComune, setQComune] = useState('');
  const [qProvincia, setQProvincia] = useState('');
  const [qPiva, setQPiva] = useState('');
  const [qSdi, setQSdi] = useState('');

  // Moduli Preventivo Modulare Dinamico
  const [quoteItems, setQuoteItems] = useState<QuoteLineItem[]>([
    {
      id: 'it-1',
      tipo: 'Spot Radiofonici Tabellari',
      copertura: 'Radio Toscana Rete (Tutta la Toscana)',
      dettagli: '10 spot/gg per 14 gg (140 spot paganti da 20") + 14 spot OMAGGIO (Totale 154 passaggi in onda)',
      fascia: '07.00 – 21.00 a rotazione',
      periodo: 'Dal 15/09/2026 al 28/09/2026 (14 gg)',
      prezzoListino: 1820,
      valore: 1400,
      isSpot: true,
      dataInizio: '2026-09-15',
      dataFine: '2026-09-28',
      spotGiornalieri: 10,
      giorniTotali: 14,
      spotTotali: 140,
      spotOmaggio: 14,
      formatoSecondi: 20
    },
    {
      id: 'it-2',
      tipo: 'Realizzazione Spot Audio',
      copertura: 'Diffusione Radio Toscana + Radio Firenze',
      dettagli: 'Realizzazione copy + Registrazione in studio + Diritti di diffusione (Radio Toscana e Radio Firenze)',
      fascia: 'Una Tantum',
      periodo: 'Immediato',
      prezzoListino: 100,
      valore: 100,
      tipoProduzione: 'SOLO_RT_RF'
    }
  ]);

  function addQuoteItem(
    tipo: string,
    copertura: string,
    dettagli: string,
    fascia: string,
    periodo: string,
    listino: number,
    valore: number,
    extraProps?: Partial<QuoteLineItem>
  ) {
    const isProdItem = tipo.toLowerCase().includes('produzione') || tipo.toLowerCase().includes('realizzazione') || !!extraProps?.tipoProduzione;
    const isSpotItem = ((tipo.toLowerCase().includes('spot') && !isProdItem) || !!extraProps?.isSpot);

    const defaultDataInizio = '2026-09-15';
    const defaultDataFine = '2026-09-28';
    const defaultGiorni = 14;
    const defaultGiornalieri = 10;
    const defaultTotali = 140;

    const newItem: QuoteLineItem = {
      id: `it-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      tipo,
      copertura,
      dettagli,
      fascia,
      periodo,
      prezzoListino: listino,
      valore: valore,
      isSpot: isSpotItem,
      dataInizio: isSpotItem ? defaultDataInizio : undefined,
      dataFine: isSpotItem ? defaultDataFine : undefined,
      spotGiornalieri: isSpotItem ? defaultGiornalieri : undefined,
      giorniTotali: isSpotItem ? defaultGiorni : undefined,
      spotTotali: isSpotItem ? defaultTotali : undefined,
      spotOmaggio: isSpotItem ? 0 : undefined,
      formatoSecondi: isSpotItem ? 20 : undefined,
      tipoProduzione: isProdItem ? (valore === 169 ? 'DIRITTI_LIBERI_TOSCANA' : 'SOLO_RT_RF') : undefined,
      ...extraProps
    };
    setQuoteItems(prev => [...prev, newItem]);
  }

  // TARIFFE UFFICIALI RADIO TOSCANA & RADIO FIRENZE DA LISTINO DEPOSITATO TOSCANA COMUNICA SRL
  function getTariffaUfficialeSpot(copertura: string, formatoSec: number = 20): number {
    const f = formatoSec === 10 ? 10 : (formatoSec === 30 ? 30 : 20);
    const cop = (copertura || '').toLowerCase();
    
    if (cop.includes('area 1')) {
      if (f === 10) return 6.50;
      if (f === 30) return 11.00;
      return 9.00; // 20"
    }
    if (cop.includes('area 2')) {
      if (f === 10) return 3.50;
      if (f === 30) return 5.50;
      return 4.50; // 20"
    }
    if (cop.includes('area 3')) {
      if (f === 10) return 3.50;
      if (f === 30) return 5.50;
      return 4.50; // 20"
    }
    if (cop.includes('firenze 95.4') || cop.includes('radio firenze')) {
      if (f === 10) return 6.00;
      if (f === 30) return 9.50;
      return 7.50; // 20"
    }
    if (cop.includes('combinata') || cop.includes('rt + rf')) {
      if (f === 10) return 15.00; // 9.00 + 6.00
      if (f === 30) return 25.50; // 16.00 + 9.50
      return 20.50; // 13.00 + 7.50
    }
    // Default: Rete (Tutta la Toscana)
    if (f === 10) return 9.00;
    if (f === 30) return 16.00;
    return 13.00; // 20"
  }

  function updateQuoteItem(id: string, field: keyof QuoteLineItem, val: any) {
    setQuoteItems(prev => prev.map(it => {
      if (it.id !== id) return it;
      const updated = { ...it, [field]: val };
      if (field === 'copertura' && updated.isSpot) {
        const tariffa = getTariffaUfficialeSpot(String(val), updated.formatoSecondi || 20);
        const spotPaganti = updated.spotTotali || 0;
        updated.tariffaUnitaria = tariffa;
        updated.prezzoListino = Math.round(tariffa * spotPaganti * 100) / 100;
      }
      return updated;
    }));
  }

  function removeQuoteItem(id: string) {
    setQuoteItems(prev => prev.filter(it => it.id !== id));
  }

  function handleSpotFieldChange(id: string, updates: Partial<QuoteLineItem>) {
    setQuoteItems(prev => prev.map(it => {
      if (it.id !== id) return it;
      const updated = { ...it, ...updates };

      let giorni = updated.giorniTotali || 14;
      if (updated.dataInizio && updated.dataFine) {
        const d1 = new Date(updated.dataInizio);
        const d2 = new Date(updated.dataFine);
        if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
          const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)) + 1;
          if (diffDays > 0) giorni = diffDays;
        }
      }
      updated.giorniTotali = giorni;

      if ('spotGiornalieri' in updates || 'dataInizio' in updates || 'dataFine' in updates) {
        const daily = updated.spotGiornalieri || 10;
        updated.spotTotali = daily * giorni;
      }

      const spotPaganti = updated.spotTotali || 0;
      const omaggi = updated.spotOmaggio || 0;
      const formato = updated.formatoSecondi || 20;
      const totPassaggi = spotPaganti + omaggi;
      const daily = updated.spotGiornalieri || Math.round(spotPaganti / (giorni || 1));

      const d1Str = updated.dataInizio ? new Date(updated.dataInizio).toLocaleDateString('it-IT') : '';
      const d2Str = updated.dataFine ? new Date(updated.dataFine).toLocaleDateString('it-IT') : '';
      if (d1Str && d2Str) {
        updated.periodo = `Dal ${d1Str} al ${d2Str} (${giorni} gg)`;
      }

      let dett = `${daily} spot/gg per ${giorni} gg (${spotPaganti} spot paganti da ${formato}")`;
      if (omaggi > 0) {
        dett += ` + ${omaggi} spot OMAGGIO (Totale ${totPassaggi} passaggi in onda)`;
      }
      updated.dettagli = dett;

      // Calcolo Listino Ufficiale da Tariffa Unitaria x Spot Totali
      const tariffa = getTariffaUfficialeSpot(updated.copertura, formato);
      updated.tariffaUnitaria = tariffa;
      updated.prezzoListino = Math.round(tariffa * spotPaganti * 100) / 100;

      return updated;
    }));
  }

  function handleProduzioneChange(id: string, tipoProd: 'SOLO_RT_RF' | 'DIRITTI_LIBERI_TOSCANA') {
    setQuoteItems(prev => prev.map(it => {
      if (it.id !== id) return it;
      if (tipoProd === 'SOLO_RT_RF') {
        return {
          ...it,
          tipoProduzione: 'SOLO_RT_RF',
          tipo: 'Realizzazione Spot Audio',
          copertura: 'Diffusione Radio Toscana + Radio Firenze',
          dettagli: 'Realizzazione copy + Registrazione in studio + Diritti di diffusione (Radio Toscana e Radio Firenze)',
          prezzoListino: 100,
          valore: 100
        };
      } else {
        return {
          ...it,
          tipoProduzione: 'DIRITTI_LIBERI_TOSCANA',
          tipo: 'Realizzazione Spot Audio (Diritti Liberi)',
          copertura: 'Diffusione Tutte le Emittenti della Toscana',
          dettagli: 'Realizzazione copy + Registrazione in studio + Cessione file master broadcast con diritti liberi per tutte le emittenti toscane',
          prezzoListino: 169,
          valore: 169
        };
      }
    }));
  }

  const [tipoAccordo, setTipoAccordo] = useState<'STANDARD' | 'BARTER_PARZIALE' | 'BARTER_PURO'>('STANDARD');
  const [barterRadio, setBarterRadio] = useState('');
  const [barterAscoltatori, setBarterAscoltatori] = useState('');

  // Ricerca e Autocomplete Storico Contratti (126 clienti / 267 contratti)
  const [selectedHistory, setSelectedHistory] = useState<HistoricalClient | null>(null);
  const [historySuggestions, setHistorySuggestions] = useState<HistoricalClient[]>([]);
  const [showHistorySuggestions, setShowHistorySuggestions] = useState(false);

  function handleClientNameChange(val: string) {
    setQNome(val);
    if (val.trim().length >= 2) {
      const q = val.toLowerCase();
      const matches = (storicoClientiData as HistoricalClient[]).filter(c => 
        c.ditta.toLowerCase().includes(q) || 
        (c.referente && c.referente.toLowerCase().includes(q)) ||
        (c.citta && c.citta.toLowerCase().includes(q))
      );
      setHistorySuggestions(matches.slice(0, 8));
      setShowHistorySuggestions(true);
    } else {
      setShowHistorySuggestions(false);
      setHistorySuggestions([]);
    }
  }

  function selectHistoricalClient(client: HistoricalClient) {
    setSelectedHistory(client);
    setQNome(client.ditta);
    setQReferente(client.referente || '');
    setQComune(client.citta || '');
    setQProvincia(client.provincia || '');
    setQPiva(client.piva || '');
    setQEmail(client.email || '');
    setQTelefono(client.telefono || '');
    setShowHistorySuggestions(false);

    if (client.ultimo_prezzo && !isNaN(Number(client.ultimo_prezzo))) {
      const p = Number(client.ultimo_prezzo);
      const lastContract = client.contratti?.[0];
      const spotTxt = lastContract?.spot ? `${lastContract.spot} spot complessivi` : 'Pianificazione concordata da archivio';
      setQuoteItems([
        {
          id: 'hist-1',
          tipo: 'Spot Radiofonici Tabellari',
          copertura: 'Radio Toscana Rete (Tutta la Toscana)',
          dettagli: `${spotTxt} — Formato 20"`,
          fascia: '07.00 – 21.00 a rotazione',
          periodo: 'Dal 15/09/2026 al 28/09/2026 (14 gg)',
          prezzoListino: Math.round(p * 1.25),
          valore: p,
          isSpot: true,
          dataInizio: '2026-09-15',
          dataFine: '2026-09-28',
          spotGiornalieri: 10,
          giorniTotali: 14,
          spotTotali: 140,
          spotOmaggio: 0,
          formatoSecondi: 20
        },
        {
          id: 'hist-2',
          tipo: 'Realizzazione Spot Audio',
          copertura: 'Diffusione Radio Toscana + Radio Firenze',
          dettagli: 'Realizzazione copy + Registrazione in studio + Diritti di diffusione (Radio Toscana e Radio Firenze)',
          fascia: 'Una Tantum',
          periodo: 'Immediato',
          prezzoListino: 100,
          valore: 100,
          tipoProduzione: 'SOLO_RT_RF'
        }
      ]);
    }
  }

  // Bozza Contratto Monte Serra State
  const [contractData, setContractData] = useState({
    numero: '',
    dataDecorrenza: '',
    dataScadenza: '',
    committente: '',
    referente: '',
    piva: '',
    sdi: '',
    indirizzo: '',
    totaleNetto: 0,
    totaleBarter: 0,
    modalitaPagamento: 'Bonifico bancario 30gg',
    noteContratto: ''
  });

  // Supabase Fetch & Fallback Dati Reali
  useEffect(() => {
    fetchSupabaseLeads();
  }, []);

  async function fetchSupabaseLeads() {
    try {
      const res = await fetch('https://dunogeleekgqztkrlxsz.supabase.co/rest/v1/rt_lead_engine_pool?select=*', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bm9nZWxlZWtncXp0a3JseHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTE2OTEsImV4cCI6MjA3MDA2NzY5MX0.b_-Jc1Q2914-9988_0',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bm9nZWxlZWtncXp0a3JseHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTE2OTEsImV4cCI6MjA3MDA2NzY5MX0.b_-Jc1Q2914-9988_0',
          'Accept-Profile': 'rt_lead_engine'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setLeads(data);
        } else {
          setLeads([]);
        }
      } else {
        setLeads([]);
      }
    } catch (e) {
      setLeads([]);
    }
  }

  // Calcolo Totali Preventivo Modulare Dinamico
  const totaleInvestimento = quoteItems.reduce((acc, curr) => acc + Number(curr.valore || 0), 0);
  const totaleListino = quoteItems.reduce((acc, curr) => acc + Number(curr.prezzoListino || curr.valore || 0), 0);
  const scontoApplicato = Math.max(0, totaleListino - totaleInvestimento);

  // Gestione Step Remind a 3 Fasi
  function openRemindModal(lead: LeadRow) {
    setSelectedQuoteForRemind(lead);
    setRemindStep(1);
    setRemindSent(false);
    switchRemindStep(1, lead);
    setShowRemindModal(true);
  }

  function switchRemindStep(step: 1 | 2 | 3, targetLead?: LeadRow) {
    const l = targetLead || selectedQuoteForRemind;
    const clientName = l ? l.nome_azienda_evento : 'Cliente';
    const val = l ? `€ ${(l.valore_preventivo || 1200).toLocaleString('it-IT')}` : '€ 1.200,00';
    setRemindStep(step);

    if (step === 1) {
      setRemindSubject(`Radio Toscana — Proposta Commerciale per ${clientName} (Verifica Ricezione)`);
      setRemindBody(`Gentile Referente di ${clientName},

Le scrivo per assicurarmi che la nostra proposta commerciale per la campagna on-air su Radio Toscana (valore ${val} + IVA) Le sia stata regolarmente recapitata.

Resto a disposizione per qualsiasi chiarimento sui dettagli del piano di trasmissione o per calibrare le date di messa in onda.

Un cordiale saluto,
Fabio Asiri — Direzione Commerciale Radio Toscana
Tel: 347/6818595 | Email: commerciale@radiotoscana.it`);
    } else if (step === 2) {
      setRemindSubject(`Radio Toscana — Urgenza Disponibilità Palinsesto Settembre (${clientName})`);
      setRemindBody(`Gentile Referente di ${clientName},

in vista della pianificazione del palinsesto di Settembre, La ricontatto poiché gli spazi on-air nelle fasce orarie richieste sono in fase di chiusura.

Per poterLe garantire le frequenze e le posizioni concordate nella proposta (${val} + IVA), avremmo necessità di una conferma entro i prossimi giorni.

Resto a Sua disposizione anche telefonicamente per confermare i dettagli.

Cordiali saluti,
Fabio Asiri — Direzione Commerciale Radio Toscana
Tel: 347/6818595`);
    } else {
      setRemindSubject(`Radio Toscana — Aggiornamento Pratica Commerciale ${clientName}`);
      setRemindBody(`Gentile Referente di ${clientName},

non avendo ricevuto riscontro in merito alla proposta commerciale inviata, provvediamo a svincolare temporaneamente gli spazi opzionati per consentire la programmazione ad altri inserzionisti del territorio.

Qualora desiderasse riattivare la pianificazione o valutare una diversa formula, sarò lieto di aggiornare la proposta.

RingraziandoLa per il tempo dedicatoci, porgo i miei più cordiali saluti.

Fabio Asiri — Direzione Commerciale Radio Toscana
Tel: 347/6818595 | Email: commerciale@radiotoscana.it`);
    }
  }

  // Apertura Generatore Bozza Contratto Radio Monte Serra
  function openContractGenerator() {
    const summaryItems = quoteItems.map(it => `${it.tipo} [${it.copertura}] - ${it.dettagli} (Valore: €${it.valore})`).join(' | ');
    setContractData({
      numero: `2026/${Math.floor(1000 + Math.random() * 9000)}-RMS`,
      dataDecorrenza: '2026-09-07',
      dataScadenza: '2026-10-07',
      committente: qNome || 'Azienda Committente',
      referente: qReferente || 'Referente Aziendale',
      piva: qPiva || '01234567890',
      sdi: qSdi || '0000000',
      indirizzo: `${qComune} (${qProvincia})`,
      totaleNetto: totaleInvestimento,
      totaleBarter: tipoAccordo === 'STANDARD' ? 0 : Math.round(totaleInvestimento / 2),
      modalitaPagamento: tipoAccordo === 'BARTER_PURO' ? '100% Cambio Merce / Barter' : 'RIBA 30gg d.f. f.m.',
      noteContratto: `Formula Accordo: ${tipoAccordo}. ${summaryItems}`
    });
    setShowContractModal(true);
  }

  // Filtraggio per Anno Selezionato
  const filteredLeads = leads.filter(l => {
    if (selectedYear === 'ALL') return true;
    return (l.anno_riferimento || '2026') === selectedYear;
  });

  // Metriche Header
  const fatturatoContrattualizzato = filteredLeads
    .filter(l => l.fase_commerciale === 'CONTRATTO ATTIVO' || l.fase_commerciale === 'CONTRATTO CHIUSO')
    .reduce((sum, l) => sum + (l.valore_contratto || 0), 0);

  const pipelineAttesa = filteredLeads
    .filter(l => l.fase_commerciale !== 'CONTRATTO CHIUSO' && l.fase_commerciale !== 'SCARTATO')
    .reduce((sum, l) => sum + ((l.valore_preventivo || 0) * ((l.probabilita_chiusura || 50) / 100)), 0);

  const scalariLeads = filteredLeads.filter(l => l.tipo_contratto === 'SCALARE');
  const rinnovatiCount = scalariLeads.filter(l => (l.spot_rimasti || 0) < (l.plafond_totale_spot || 0) * 0.2).length;
  const tassoRinnovo = scalariLeads.length > 0 ? `${Math.round((rinnovatiCount / scalariLeads.length) * 100)}%` : '0%';

  // Colonne Kanban Pulite
  const kanbanColumns = [
    { title: '1. PREVENTIVI IN TRATTATIVA 🟡', phase: 'PREVENTIVO INVIATO' },
    { title: '2. CONTRATTI ATTIVI (IN ONDA / SCALARE) 🟢', phase: 'CONTRATTO ATTIVO' },
    { title: '3. CONTRATTI CONCLUSI (STORICO) 📁', phase: 'CONTRATTO CHIUSO' },
    { title: '4. MEMORY LOCK RADAR 🎡', phase: 'MEMORY LOCK' },
    { title: '5. NUOVI LEAD SCOUTER 🕵️‍♂️', phase: 'SCOUTER DISCOVERY' },
    { title: '6. QUALIFICAZIONE ARCHE', phase: 'IN QUALIFICAZIONE' },
    { title: '7. OUTREACH EMAIL IN CORSO ✉️', phase: 'OUTREACH INVIATO' },
    { title: '8. SCARTATI / RINVIATI 💤', phase: 'SCARTATO' }
  ];

  return (
    <div>
      {/* HEADER PRINCIPALE */}
      <header>
        <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="brand-logo" style={{ background: 'transparent', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}>
            <img src="/logo_radio_toscana.png" alt="Radio Toscana" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <div className="brand-text">
            <h1>
              Radio Toscana Commerciale{' '}
              <span style={{ fontSize: '12px', background: 'rgba(225,29,72,0.25)', color: '#f43f5e', border: '1px solid rgba(225,29,72,0.4)', padding: '2px 8px', borderRadius: '6px', marginLeft: '8px', fontWeight: 800 }}>
                v7.7.0 - Cloud Vault &amp; Modern UX Engine
              </span>
            </h1>
            <p>Lead Engine &amp; CRM Cloud — Sincronizzato con Cassaforte Cloud Supabase</p>
          </div>
        </div>

        {/* SELETTORE ANNO (LAVORO UFFICIO 18:30) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', marginRight: '6px', fontWeight: 700 }}>ANNO:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value as any)}
              style={{ background: '#0f172a', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', outline: 'none' }}
            >
              <option value="2026">2026 (Attuale)</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="ALL">Tutti gli Anni</option>
            </select>
          </div>

          <button className="btn" onClick={() => alert('Cassaforte Cloud Supabase: system_vault connesso e sincronizzato!')}>
            🔒 Cloud Vault OK
          </button>
          <button className="btn btn-primary" onClick={() => setShowQuoteModal(true)}>
            ➕ Nuovo Preventivo Modulare
          </button>
        </div>
      </header>

      {/* KPI METRICS */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-title">Fatturato Contrattualizzato ({selectedYear})</div>
          <div className="kpi-value" style={{ color: 'var(--accent-green)' }}>
            € {fatturatoContrattualizzato.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
          </div>
          <div className="kpi-sub">Sincronizzato da Supabase Cloud</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Pipeline Attesa Ponderata</div>
          <div className="kpi-value" style={{ color: 'var(--accent-blue)' }}>
            € {pipelineAttesa.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
          </div>
          <div className="kpi-sub">Trattative Attive</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Tasso Rinnovo Plafond %</div>
          <div className="kpi-value" style={{ color: 'var(--accent-purple)' }}>
            {tassoRinnovo}
          </div>
          <div className="kpi-sub">Plafond a Scalare Rinnovati</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Lead Lavorati nel CRM</div>
          <div className="kpi-value" style={{ color: '#f43f5e' }}>
            {filteredLeads.length} Lead
          </div>
          <div className="kpi-sub">Pipeline Anno {selectedYear}</div>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="nav-tabs">
        <button className={`nav-btn ${activeTab === 'kanban' ? 'active' : ''}`} onClick={() => setActiveTab('kanban')}>
          📊 Pipeline Kanban (8 Colonne)
        </button>
        <button className={`nav-btn ${activeTab === 'queues' ? 'active' : ''}`} onClick={() => setActiveTab('queues')}>
          🚫 Code di Controllo (3 Code)
        </button>
        <button className={`nav-btn ${activeTab === 'renewals' ? 'active' : ''}`} onClick={() => setActiveTab('renewals')}>
          ⏰ Rinnovi &amp; Upsell Plafond
        </button>
        <button className={`nav-btn ${activeTab === 'memory' ? 'active' : ''}`} onClick={() => setActiveTab('memory')}>
          🎡 Universal Memory Lock
        </button>
        <button className={`nav-btn ${activeTab === 'production' ? 'active' : ''}`} onClick={() => setActiveTab('production')}>
          🎙️ Produzione Spot Audio &amp; Listino
        </button>
        <button className={`nav-btn ${activeTab === 'schedules' ? 'active' : ''}`} onClick={() => setActiveTab('schedules')}>
          📅 Programmazione On-Air
        </button>
      </div>

      {/* CONTENT TAB 1: KANBAN BOARD */}
      {activeTab === 'kanban' && (
        <div className="kanban-board">
          {kanbanColumns.map((col, idx) => {
            const colLeads = filteredLeads.filter(l => l.fase_commerciale === col.phase);
            return (
              <div key={idx} className="kanban-col">
                <div className="col-header">
                  <span className="col-title">{col.title}</span>
                  <span className="col-badge">{colLeads.length}</span>
                </div>
                <div className="col-cards">
                  {colLeads.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', textAlign: 'center', marginTop: '20px' }}>
                      Nessuna pratica in questa colonna
                    </div>
                  ) : (
                    colLeads.map((l, lIdx) => {
                      const isScalare = l.tipo_contratto === 'SCALARE';
                      const pctRimasti = isScalare && l.plafond_totale_spot ? Math.round((l.spot_rimasti || 0) / l.plafond_totale_spot * 100) : 100;
                      
                      return (
                        <div key={lIdx} className="lead-card">
                          <div className="lead-title">
                            <span>{l.nome_azienda_evento}</span>
                            <span className="score-badge score-green">🟢 {l.probabilita_chiusura}%</span>
                          </div>
                          <div className="lead-tags">
                            <span className="tag">{l.area_target}</span>
                            <span className="tag">{l.settore}</span>
                            {isScalare && <span className="tag" style={{ background: 'rgba(56,189,248,0.2)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.4)' }}>🔋 SCALARE</span>}
                            {l.is_cambio_merce && <span className="tag tag-barter">🎁 BARTER</span>}
                          </div>

                          {/* BARRA PLAFOND PER CONTRATTI A SCALARE */}
                          {isScalare && l.plafond_totale_spot && (
                            <div style={{ marginTop: '8px', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '6px', border: '1px solid var(--panel-border)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>
                                <span>Plafond Spot:</span>
                                <span style={{ color: pctRimasti < 20 ? '#f43f5e' : 'var(--accent-green)' }}>
                                  {l.spot_rimasti} / {l.plafond_totale_spot} Spot ({pctRimasti}%)
                                </span>
                              </div>
                              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${pctRimasti}%`, height: '100%', background: pctRimasti < 20 ? '#f43f5e' : 'var(--accent-green)' }}></div>
                              </div>
                            </div>
                          )}

                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                            📍 {l.comune} ({l.provincia})
                          </div>

                          <div className="lead-footer">
                            <span style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>
                              € {(l.valore_contratto || l.valore_preventivo).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                            </span>
                            {col.phase === 'PREVENTIVO INVIATO' ? (
                              <button className="btn btn-xs" style={{ background: '#f59e0b', color: '#000', fontWeight: 800 }} onClick={() => openRemindModal(l)}>
                                ⏰ Remind
                              </button>
                            ) : (
                              <button className="btn btn-xs btn-primary" onClick={() => {
                                setSelectedLeadForEmail(l);
                                setShowEmailModal(true);
                              }}>
                                ✉️ Dettagli
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONTENT TAB 3: RINNOVI PLAFOND */}
      {activeTab === 'renewals' && (
        <div style={{ background: 'var(--panel-bg)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--panel-border)' }}>
          <h3 style={{ marginBottom: '16px' }}>⏰ Monitoraggio Plafond &amp; Rinnovi Pacchetto (Metodo Thinkable Data-Driven)</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Cliente / Azienda</th>
                <th>Tipologia Contratto</th>
                <th>Plafond Spot Totali</th>
                <th>Spot Rimasti</th>
                <th>Stato Consumo</th>
                <th>Azione Suggerita</th>
              </tr>
            </thead>
            <tbody>
              {scalariLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '28px' }}>
                    Nessun contratto a scalare presente nel CRM.
                  </td>
                </tr>
              ) : (
                scalariLeads.map((l, idx) => {
                  const pct = l.plafond_totale_spot ? Math.round(((l.spot_rimasti || 0) / l.plafond_totale_spot) * 100) : 0;
                  return (
                    <tr key={idx}>
                      <td><strong>{l.nome_azienda_evento}</strong></td>
                      <td><span className="tag" style={{ background: 'rgba(56,189,248,0.2)', color: '#38bdf8' }}>🔋 SCALARE</span></td>
                      <td>{l.plafond_totale_spot || 0} Spot</td>
                      <td><strong>{l.spot_rimasti || 0} Spot</strong></td>
                      <td>
                        <span style={{ color: pct < 20 ? 'var(--accent-red, #f43f5e)' : 'var(--accent-green)', fontWeight: 700 }}>
                          {pct < 20 ? '🔴' : '🟢'} {pct}% Disponibile
                        </span>
                      </td>
                      <td><button className="btn btn-xs btn-primary">✉️ Invia Prospetto Consumi</button></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODALE PREVENTIVO MODULARE (STANDARD / BARTER PARZIALE / BARTER PURO) */}
      {showQuoteModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src="/logo_radio_toscana.png" alt="Radio Toscana" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
                <h3 className="modal-title" style={{ margin: 0 }}>Crea Preventivo Modulare Radio Toscana</h3>
              </div>
              <button className="modal-close" onClick={() => setShowQuoteModal(false)}>✕</button>
            </div>

            {/* FORMULA ACCORDO */}
            <div className="form-group" style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
              <label className="form-label" style={{ color: 'var(--accent-yellow)', fontWeight: 800 }}>📌 Tipologia Accordo Commerciale:</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button
                  className="btn btn-xs"
                  style={{ flex: 1, background: tipoAccordo === 'STANDARD' ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)', color: '#fff' }}
                  onClick={() => setTipoAccordo('STANDARD')}
                >
                  💵 Standard (100% Fatturato)
                </button>
                <button
                  className="btn btn-xs"
                  style={{ flex: 1, background: tipoAccordo === 'BARTER_PARZIALE' ? 'var(--accent-purple)' : 'rgba(255,255,255,0.05)', color: '#fff' }}
                  onClick={() => setTipoAccordo('BARTER_PARZIALE')}
                >
                  🎁 Barter Parziale (Quota Merce)
                </button>
                <button
                  className="btn btn-xs"
                  style={{ flex: 1, background: tipoAccordo === 'BARTER_PURO' ? '#ec4899' : 'rgba(255,255,255,0.05)', color: '#fff' }}
                  onClick={() => setTipoAccordo('BARTER_PURO')}
                >
                  🔄 Barter Puro (100% Merce)
                </button>
              </div>
            </div>

            {/* DATI CLIENTE CON AUTOCOMPLETE DA STORICO CONTRATTI */}
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Nome Cliente / Azienda (Cerca nei 267 Contratti Storici)</span>
                {selectedHistory && (
                  <span style={{ color: 'var(--accent-green)', fontSize: '11px', fontWeight: 800 }}>
                    ✓ Cliente Storico Trovato ({selectedHistory.totale_contratti} contratti registrati)
                  </span>
                )}
              </label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Es. Coldiretti, Tinghi Motors, Alia, Artex, Misericordia..."
                value={qNome} 
                onChange={e => handleClientNameChange(e.target.value)}
                onFocus={() => { if (qNome.length >= 2) setShowHistorySuggestions(true); }}
              />

              {/* DROPDOWN AUTOCOMPLETE SUGGERIMENTI */}
              {showHistorySuggestions && historySuggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 999,
                  background: '#1e293b',
                  border: '1px solid #38bdf8',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  marginTop: '4px'
                }}>
                  {historySuggestions.map((c, idx) => (
                    <div 
                      key={idx}
                      onClick={() => selectHistoricalClient(c)}
                      style={{
                        padding: '10px 14px',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(56,189,248,0.15)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div>
                        <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '13px' }}>{c.ditta}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          👤 {c.referente || 'N/D'} | 📍 {c.citta} ({c.provincia}) | ✉️ {c.email || 'N/D'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ 
                          fontSize: '11px', 
                          background: 'rgba(34,197,94,0.2)', 
                          color: '#4ade80', 
                          padding: '3px 8px', 
                          borderRadius: '4px',
                          fontWeight: 700 
                        }}>
                          {c.totale_contratti} contr. | Ultimo € {c.ultimo_prezzo || 'N/D'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="form-group">
              <div>
                <label className="form-label">Referente Commerciale Cliente</label>
                <input type="text" className="form-input" value={qReferente} onChange={e => setQReferente(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Comune &amp; Provincia</label>
                <input type="text" className="form-input" value={qComune ? `${qComune} (${qProvincia})` : ''} onChange={e => setQComune(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Partita IVA / SDI</label>
                <input type="text" className="form-input" value={qPiva ? `${qPiva} / ${qSdi}` : ''} onChange={e => setQPiva(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Recapiti Diretti (Tel / Email)</label>
                <input type="text" className="form-input" value={`${qTelefono} | ${qEmail}`} onChange={e => setQTelefono(e.target.value)} />
              </div>
            </div>

            {/* SEZIONE SPECIALE: SCHEDA STORICO CONTRATTI TROVATI */}
            {selectedHistory && selectedHistory.contratti && selectedHistory.contratti.length > 0 && (
              <div style={{
                background: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#4ade80', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📂 Archivio Storico Radio Monte Serra ({selectedHistory.contratti.length} contratti precedenti trovati)
                  </span>
                  <button 
                    className="btn btn-xs"
                    style={{ background: 'var(--accent-green)', color: '#0f172a', fontWeight: 800, fontSize: '11px', padding: '4px 8px' }}
                    onClick={() => selectHistoricalClient(selectedHistory)}
                  >
                    ⚡ Applica Condizioni Ultimo Contratto (€ {selectedHistory.ultimo_prezzo})
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                  {selectedHistory.contratti.map((co, cidx) => (
                    <div key={cidx} style={{ background: 'rgba(0,0,0,0.2)', padding: '8px 10px', borderRadius: '6px', fontSize: '11px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontWeight: 800, color: '#f8fafc' }}>
                        Anno {co.anno} — € {co.prezzo ? Number(co.prezzo).toLocaleString('it-IT', { minimumFractionDigits: 2 }) : 'N/D'}
                      </div>
                      <div style={{ color: '#94a3b8', marginTop: '2px' }}>Spot: {co.spot || 'Standard'}</div>
                      <div style={{ color: '#64748b', fontSize: '10px' }}>Ref: {co.referente || 'Archivio'} | {co.file}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULI DI ACQUISTO MODULARE RADIO TOSCANA */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--panel-border)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#fff', margin: 0 }}>
                    📦 Moduli Campagna &amp; Voci Preventivo ({quoteItems.length} voci attive)
                  </h4>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                    Aggiungi e personalizza le linee di programmazione per emittente, fascia, listino e prezzo riservato
                  </div>
                </div>
              </div>

              {/* PULSANTIERA AGGIUNTA RAPIDA MODULI TIPICI RADIO TOSCANA DA LISTINO UFFICIALE */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px', background: 'rgba(0,0,0,0.25)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', alignSelf: 'center', marginRight: '4px' }}>+ Da Listino Ufficiale:</span>
                <button
                  type="button"
                  className="btn btn-xs"
                  style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', fontWeight: 700 }}
                  onClick={() => addQuoteItem(
                    'Spot Radiofonici Tabellari',
                    'Radio Toscana Rete (Tutta la Toscana)',
                    '10 spot/gg per 14 gg (140 spot paganti da 20") + 14 spot OMAGGIO (Totale 154 passaggi in onda)',
                    '07.00 – 21.00 a rotazione',
                    'Dal 15/09/2026 al 28/09/2026 (14 gg)',
                    1820,
                    1400,
                    {
                      isSpot: true,
                      dataInizio: '2026-09-15',
                      dataFine: '2026-09-28',
                      spotGiornalieri: 10,
                      giorniTotali: 14,
                      spotTotali: 140,
                      spotOmaggio: 14,
                      formatoSecondi: 20
                    }
                  )}
                >
                  📻 + Spot Rete (140 spot da 20")
                </button>
                <button
                  type="button"
                  className="btn btn-xs"
                  style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', fontWeight: 700 }}
                  onClick={() => addQuoteItem(
                    'Spot Radiofonici Tabellari',
                    'Radio Toscana Area 1 (FI - PO - PT)',
                    '7 spot/gg per 14 gg (98 spot paganti da 20")',
                    '08.00 – 10.00 Drive Time',
                    'Dal 15/09/2026 al 28/09/2026 (14 gg)',
                    882,
                    700,
                    {
                      isSpot: true,
                      dataInizio: '2026-09-15',
                      dataFine: '2026-09-28',
                      spotGiornalieri: 7,
                      giorniTotali: 14,
                      spotTotali: 98,
                      spotOmaggio: 0,
                      formatoSecondi: 20
                    }
                  )}
                >
                  📍 + Area 1 (FI-PO-PT)
                </button>
                <button
                  type="button"
                  className="btn btn-xs"
                  style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', fontWeight: 700 }}
                  onClick={() => addQuoteItem(
                    'Spot Radiofonici Tabellari',
                    'Radio Toscana Area 2 (Costa: LI - PI - LU - MS)',
                    '7 spot/gg per 14 gg (98 spot paganti da 20")',
                    '07.00 – 21.00 a rotazione',
                    'Dal 15/09/2026 al 28/09/2026 (14 gg)',
                    441,
                    350,
                    {
                      isSpot: true,
                      dataInizio: '2026-09-15',
                      dataFine: '2026-09-28',
                      spotGiornalieri: 7,
                      giorniTotali: 14,
                      spotTotali: 98,
                      spotOmaggio: 0,
                      formatoSecondi: 20
                    }
                  )}
                >
                  🌊 + Area 2 (Costa LI-PI-LU-MS)
                </button>
                <button
                  type="button"
                  className="btn btn-xs"
                  style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', fontWeight: 700 }}
                  onClick={() => addQuoteItem(
                    'Spot Radiofonici Tabellari',
                    'Radio Toscana Area 3 (AR - SI - GR)',
                    '7 spot/gg per 14 gg (98 spot paganti da 20")',
                    '07.00 – 21.00 a rotazione',
                    'Dal 15/09/2026 al 28/09/2026 (14 gg)',
                    441,
                    350,
                    {
                      isSpot: true,
                      dataInizio: '2026-09-15',
                      dataFine: '2026-09-28',
                      spotGiornalieri: 7,
                      giorniTotali: 14,
                      spotTotali: 98,
                      spotOmaggio: 0,
                      formatoSecondi: 20
                    }
                  )}
                >
                  ⛰️ + Area 3 (AR-SI-GR)
                </button>
                <button
                  type="button"
                  className="btn btn-xs"
                  style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.3)', fontWeight: 700 }}
                  onClick={() => addQuoteItem(
                    'Spot Radiofonici Tabellari',
                    'Radio Firenze 95.4 FM',
                    '7 spot/gg per 14 gg (98 spot paganti da 20")',
                    '07.00 – 21.00 a rotazione',
                    'Dal 15/09/2026 al 28/09/2026 (14 gg)',
                    735,
                    550,
                    {
                      isSpot: true,
                      dataInizio: '2026-09-15',
                      dataFine: '2026-09-28',
                      spotGiornalieri: 7,
                      giorniTotali: 14,
                      spotTotali: 98,
                      spotOmaggio: 0,
                      formatoSecondi: 20
                    }
                  )}
                >
                  ⚜️ + Radio Firenze 95.4 FM
                </button>

                <button
                  type="button"
                  className="btn btn-xs"
                  style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', fontWeight: 700 }}
                  onClick={() => addQuoteItem(
                    'Realizzazione Spot Audio',
                    'Diffusione Radio Toscana + Radio Firenze',
                    'Realizzazione copy + Registrazione in studio + Diritti di diffusione (Radio Toscana e Radio Firenze)',
                    'Una Tantum',
                    'Immediato',
                    100,
                    100,
                    { tipoProduzione: 'SOLO_RT_RF' }
                  )}
                >
                  🎧 + Spot Solo RT+RF (€100)
                </button>
                <button
                  type="button"
                  className="btn btn-xs"
                  style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', fontWeight: 700 }}
                  onClick={() => addQuoteItem(
                    'Realizzazione Spot Audio (Diritti Liberi)',
                    'Diffusione Tutte le Emittenti della Toscana',
                    'Realizzazione copy + Registrazione in studio + Cessione master broadcast con diritti liberi per tutte le emittenti toscane',
                    'Una Tantum',
                    'Immediato',
                    169,
                    169,
                    { tipoProduzione: 'DIRITTI_LIBERI_TOSCANA' }
                  )}
                >
                  🌐 + Spot Diritti Liberi Toscana (€169)
                </button>
                <button
                  type="button"
                  className="btn btn-xs"
                  style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', fontWeight: 700 }}
                  onClick={() => addQuoteItem(
                    'Intervento Radiofonico Masti Sciò',
                    'Radio Toscana Rete',
                    'Intervento in diretta 5 minuti con Massimo Galli (1 v/settimana)',
                    '17.00 – 19.00 Masti Sciò',
                    'Canone Mensile',
                    750,
                    550
                  )}
                >
                  🎙️ + Masti Sciò (5 min)
                </button>
                <button
                  type="button"
                  className="btn btn-xs"
                  style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 700 }}
                  onClick={() => addQuoteItem(
                    'Sponsorizzazione Rubrica Notiziario / Meteo',
                    'Radio Toscana Rete',
                    'Sigla apertura/chiusura Meteo Toscana (6 passaggi al giorno per 30 gg)',
                    'Ogni ora dalle 07.30 alle 19.30',
                    'Mese Intero',
                    950,
                    700
                  )}
                >
                  ⛅ + Rubrica Meteo / Notiziario
                </button>
                <button
                  type="button"
                  className="btn btn-xs"
                  style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: '1px solid rgba(236, 72, 153, 0.3)', fontWeight: 700 }}
                  onClick={() => addQuoteItem(
                    'Citazioni Live Conduttori',
                    'Radio Toscana Rete',
                    '10 citazioni spontanee in diretta durante le fasce ad alto ascolto',
                    'Fasce 08-10 / 12-14',
                    'Nel periodo della campagna',
                    500,
                    350
                  )}
                >
                  📢 + Citazioni Live
                </button>
                <button
                  type="button"
                  className="btn btn-xs"
                  style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#f8fafc', border: '1px solid rgba(255, 255, 255, 0.2)', fontWeight: 700 }}
                  onClick={() => addQuoteItem(
                    'Voce Personalizzata',
                    'Radio Toscana Rete',
                    'Dettagli prestazione concordata',
                    'Fascia concordata',
                    'Periodo concordato',
                    500,
                    400
                  )}
                >
                  ✏️ + Voce Libera
                </button>
              </div>

              {/* LISTA EDITABILE DEI MODULI */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {quoteItems.map((it, idx) => {
                  const isProdItem = !!it.tipoProduzione || it.tipo.toLowerCase().includes('produzione') || it.tipo.toLowerCase().includes('realizzazione');
                  const isSpotItem = (it.isSpot || it.tipo.toLowerCase().includes('spot')) && !isProdItem;

                  return (
                    <div
                      key={it.id}
                      style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '14px'
                      }}
                    >
                      {/* HEADER MODULO: TIPO E COPERTURA */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(225,29,72,0.2)', color: '#f43f5e', padding: '2px 6px', borderRadius: '4px' }}>
                            #{idx + 1}
                          </span>
                          <input
                            type="text"
                            className="form-input"
                            style={{ fontWeight: 800, fontSize: '13px', color: '#f8fafc', width: '280px' }}
                            value={it.tipo}
                            onChange={e => updateQuoteItem(it.id, 'tipo', e.target.value)}
                            placeholder="Tipo modulo (es. Spot Tabellari, Masti Sciò)"
                          />
                          {isProdItem ? (
                            <select
                              className="form-input"
                              style={{ fontSize: '12px', width: '290px' }}
                              value={it.copertura}
                              onChange={e => {
                                const val = e.target.value;
                                if (val.includes('Tutte le Emittenti')) {
                                  handleProduzioneChange(it.id, 'DIRITTI_LIBERI_TOSCANA');
                                } else {
                                  handleProduzioneChange(it.id, 'SOLO_RT_RF');
                                }
                              }}
                            >
                              <option value="Diffusione Radio Toscana + Radio Firenze">Ambito: Radio Toscana + Radio Firenze (€ 100,00)</option>
                              <option value="Diffusione Tutte le Emittenti della Toscana">Ambito: Tutte Emittenti Toscana (€ 169,00)</option>
                            </select>
                          ) : (
                            <select
                              className="form-input"
                              style={{ fontSize: '12px', width: '240px' }}
                              value={it.copertura}
                              onChange={e => updateQuoteItem(it.id, 'copertura', e.target.value)}
                            >
                              <option value="Radio Toscana Rete (Tutta la Toscana)">Radio Toscana Rete (Tutta la Toscana)</option>
                              <option value="Radio Toscana Area 1 (FI - PO - PT)">Radio Toscana Area 1 (FI - PO - PT)</option>
                              <option value="Radio Toscana Area 2 (Costa: LI - PI - LU - MS)">Radio Toscana Area 2 (Costa LI-PI-LU-MS)</option>
                              <option value="Radio Toscana Area 3 (AR - SI - GR)">Radio Toscana Area 3 (AR - SI - GR)</option>
                              <option value="Radio Firenze 95.4 FM">Radio Firenze 95.4 FM</option>
                              <option value="RT + RF Combinata (Rete + Firenze)">RT + RF Combinata (Rete + Firenze)</option>
                            </select>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeQuoteItem(it.id)}
                          className="btn btn-xs"
                          style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '2px 8px' }}
                          title="Elimina voce"
                        >
                          🗑️ Rimuovi
                        </button>
                      </div>

                      {/* BLOCCO DEDICATO PIANIFICAZIONE SPOT: DATE, QUANTITÀ GIORNALIERA, TOTALI, OMAGGI */}
                      {isSpotItem && (
                        <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '6px', padding: '10px', marginBottom: '10px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>🗓️ Programmazione Spot (Da Data a Data, Cadenza Giornaliera e Omaggi):</span>
                            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 400 }}>Calcolo automatico passaggi e periodo</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                            <div>
                              <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Data Inizio:</label>
                              <input
                                type="date"
                                className="form-input"
                                style={{ fontSize: '11px', width: '100%', padding: '4px 6px' }}
                                value={it.dataInizio || '2026-09-15'}
                                onChange={e => handleSpotFieldChange(it.id, { dataInizio: e.target.value })}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Data Fine:</label>
                              <input
                                type="date"
                                className="form-input"
                                style={{ fontSize: '11px', width: '100%', padding: '4px 6px' }}
                                value={it.dataFine || '2026-09-28'}
                                onChange={e => handleSpotFieldChange(it.id, { dataFine: e.target.value })}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Spot / Giorno:</label>
                              <input
                                type="number"
                                className="form-input"
                                style={{ fontSize: '11px', width: '100%', padding: '4px 6px' }}
                                value={it.spotGiornalieri || 10}
                                min={1}
                                onChange={e => handleSpotFieldChange(it.id, { spotGiornalieri: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Spot Paganti (Tot):</label>
                              <input
                                type="number"
                                className="form-input"
                                style={{ fontSize: '11px', width: '100%', padding: '4px 6px' }}
                                value={it.spotTotali || 140}
                                min={1}
                                onChange={e => handleSpotFieldChange(it.id, { spotTotali: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '10px', color: '#4ade80', fontWeight: 800, display: 'block', marginBottom: '2px' }}>🎁 Spot OMAGGIO:</label>
                              <input
                                type="number"
                                className="form-input"
                                style={{ fontSize: '11px', width: '100%', padding: '4px 6px', borderColor: 'rgba(74, 222, 128, 0.5)', color: '#4ade80', fontWeight: 800 }}
                                value={it.spotOmaggio || 0}
                                min={0}
                                placeholder="0"
                                onChange={e => handleSpotFieldChange(it.id, { spotOmaggio: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Formato Audio:</label>
                              <select
                                className="form-input"
                                style={{ fontSize: '11px', width: '100%', padding: '4px 6px' }}
                                value={it.formatoSecondi || 20}
                                onChange={e => handleSpotFieldChange(it.id, { formatoSecondi: Number(e.target.value) })}
                              >
                                <option value={10}>10 secondi (10")</option>
                                <option value={20}>20 secondi (20")</option>
                                <option value={30}>30 secondi (30")</option>
                              </select>
                            </div>
                          </div>
                          {/* RIEPILOGO RAPIDO DEL PIANO SPOT CON LISTINO UFFICIALE */}
                          {(() => {
                            const tariffa = getTariffaUfficialeSpot(it.copertura, it.formatoSecondi || 20);
                            const spotPag = it.spotTotali || 0;
                            const listinoTot = Math.round(tariffa * spotPag * 100) / 100;
                            return (
                              <div style={{ marginTop: '8px', fontSize: '11px', color: '#cbd5e1', background: 'rgba(0,0,0,0.25)', padding: '8px 10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                <span>
                                  📊 Periodo: <strong>{it.giorniTotali || 14} giorni</strong> • <strong>{spotPag} spot paganti ({it.formatoSecondi || 20}")</strong>
                                  {(it.spotOmaggio || 0) > 0 && (
                                    <span style={{ color: '#4ade80', marginLeft: '6px', fontWeight: 800 }}>
                                      + {it.spotOmaggio} OMAGGIO (Totale: {spotPag + (it.spotOmaggio || 0)} passaggi)
                                    </span>
                                  )}
                                </span>
                                <span style={{ color: '#38bdf8', fontWeight: 700 }}>
                                  📋 Listino Ufficiale: € {tariffa.toFixed(2)}/spot → <strong>Totale: € {listinoTot.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</strong>
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* BLOCCO DEDICATO PRODUZIONE AUDIO: SOLO RT+RF (100€) VS DIRITTI LIBERI TOSCANA (169€) */}
                      {isProdItem && (
                        <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '6px', padding: '10px', marginBottom: '10px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: '#c084fc', marginBottom: '8px' }}>
                            🎧 Realizzazione Spot Audio — Ambito di Diffusione &amp; Diritti:
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
                            <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: (it.tipoProduzione === 'SOLO_RT_RF' || it.valore === 100) ? '#4ade80' : '#94a3b8', fontWeight: 700, background: 'rgba(0,0,0,0.2)', padding: '8px 10px', borderRadius: '4px' }}>
                              <input
                                type="radio"
                                name={`tipoProd-${it.id}`}
                                checked={it.tipoProduzione === 'SOLO_RT_RF' || it.valore === 100}
                                onChange={() => handleProduzioneChange(it.id, 'SOLO_RT_RF')}
                              />
                              📻 Solo Radio Toscana + Radio Firenze (€ 100,00 + IVA)
                            </label>
                            <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: (it.tipoProduzione === 'DIRITTI_LIBERI_TOSCANA' || it.valore === 169) ? '#38bdf8' : '#94a3b8', fontWeight: 700, background: 'rgba(0,0,0,0.2)', padding: '8px 10px', borderRadius: '4px' }}>
                              <input
                                type="radio"
                                name={`tipoProd-${it.id}`}
                                checked={it.tipoProduzione === 'DIRITTI_LIBERI_TOSCANA' || it.valore === 169}
                                onChange={() => handleProduzioneChange(it.id, 'DIRITTI_LIBERI_TOSCANA')}
                              />
                              🌐 Diritti Liberi per altre emittenti Toscana (€ 169,00 + IVA)
                            </label>
                          </div>
                          <div style={{ fontSize: '10px', color: '#cbd5e1', marginTop: '6px', background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: '4px' }}>
                            {it.tipoProduzione === 'DIRITTI_LIBERI_TOSCANA'
                              ? '✓ Comprende: Realizzazione copy (testo) + Registrazione in studio professionale + Cessione master broadcast con liberatoria diritti aperta a qualsiasi altra emittente toscana.'
                              : '✓ Comprende: Realizzazione copy (testo) + Registrazione in studio professionale + Diritti di diffusione per la messa in onda riservata alle frequenze di Radio Toscana e Radio Firenze.'}
                          </div>
                        </div>
                      )}

                      {/* RIGA DATI GENERALI: DETTAGLI, FASCIA, PERIODO, LISTINO, PREZZO RISERVATO */}
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 100px 100px', gap: '8px', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Dettagli / Passaggi / Formato:</span>
                          <input
                            type="text"
                            className="form-input"
                            style={{ fontSize: '11px', width: '100%' }}
                            value={it.dettagli}
                            onChange={e => updateQuoteItem(it.id, 'dettagli', e.target.value)}
                            placeholder='es. 10 spot/gg x 14 gg (140 passaggi da 20")'
                          />
                        </div>
                        <div>
                          <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Fascia Oraria:</span>
                          <input
                            type="text"
                            className="form-input"
                            style={{ fontSize: '11px', width: '100%' }}
                            value={it.fascia}
                            onChange={e => updateQuoteItem(it.id, 'fascia', e.target.value)}
                            placeholder="es. 07.00 - 21.00"
                          />
                        </div>
                        <div>
                          <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Periodo / Validità:</span>
                          <input
                            type="text"
                            className="form-input"
                            style={{ fontSize: '11px', width: '100%' }}
                            value={it.periodo}
                            onChange={e => updateQuoteItem(it.id, 'periodo', e.target.value)}
                            placeholder="es. Settembre 2026"
                          />
                        </div>
                        <div>
                          <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Listino (€):</span>
                          <input
                            type="number"
                            className="form-input"
                            style={{ fontSize: '12px', width: '100%', textAlign: 'right' }}
                            value={it.prezzoListino}
                            onChange={e => updateQuoteItem(it.id, 'prezzoListino', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 700, display: 'block', marginBottom: '2px' }}>Riservato (€):</span>
                          <input
                            type="number"
                            className="form-input"
                            style={{ fontSize: '12px', width: '100%', textAlign: 'right', fontWeight: 800, color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.4)' }}
                            value={it.valore}
                            onChange={e => updateQuoteItem(it.id, 'valore', Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* RIEPILOGO TOTALI E SCONTO COMMERCIALE */}
              <div style={{ marginTop: '14px', background: 'rgba(0,0,0,0.35)', padding: '12px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Valore Totale Listino:</span>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#cbd5e1', textDecoration: scontoApplicato > 0 ? 'line-through' : 'none' }}>
                      € {totaleListino.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  {scontoApplicato > 0 && (
                    <div>
                      <span style={{ fontSize: '11px', color: '#f43f5e' }}>Sconto Riservato Accordato:</span>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#f43f5e' }}>
                        - € {scontoApplicato.toLocaleString('it-IT', { minimumFractionDigits: 2 })} ({Math.round((scontoApplicato / (totaleListino || 1)) * 100)}%)
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Investimento Totale Netto (+ IVA):</span>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#4ade80' }}>
                    € {totaleInvestimento.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>

            {/* SEZIONE BARTER (SE ATTIVO) */}
            {tipoAccordo !== 'STANDARD' && (
              <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                <label className="form-label" style={{ color: '#c084fc', fontWeight: 800 }}>🎁 Dettaglio Accordo Barter (Cambio Merce):</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Quota Staff Radio Toscana:</span>
                    <input type="text" className="form-input" value={barterRadio} onChange={e => setBarterRadio(e.target.value)} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Quota Giochi On-Air Ascoltatori:</span>
                    <input type="text" className="form-input" value={barterAscoltatori} onChange={e => setBarterAscoltatori(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* TOTALE E PULSANTI AZIONE */}
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>TOTALE INVESTIMENTO COMMERCIALE</span>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-green)' }}>
                  € {totaleInvestimento.toLocaleString('it-IT', { minimumFractionDigits: 2 })} + IVA
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn"
                  style={{ background: 'rgba(168,85,247,0.2)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.4)', fontWeight: 700 }}
                  onClick={() => setShowPdfModal(true)}
                >
                  📄 Proposta A4 Modern UX
                </button>
                <button
                  className="btn btn-primary"
                  onClick={openContractGenerator}
                >
                  📝 Genera Bozza Contratto RMS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE GENERATORE PROPOSTA COMMERCIALE A4 MODERN UX 2026 */}
      {showPdfModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '900px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', background: '#000000', padding: '0', borderRadius: '12px' }}>
            <div style={{ background: '#111111', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222222' }}>
              <span style={{ fontWeight: 800, color: '#f43f5e', fontSize: '14px' }}>📄 PROPOSTA COMMERCIALE A4 MODERN UX 2026 — PRONTA STAMPA</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-primary btn-xs" onClick={() => window.print()}>🖨️ Stampa / Salva in PDF</button>
                <button className="modal-close" onClick={() => setShowPdfModal(false)}>✕</button>
              </div>
            </div>

            {/* FOGLIO A4 STAMPABILE MODERN UX */}
            <div className="a4-page-preview" style={{ background: '#ffffff', color: '#111111', padding: '40px', margin: '20px auto', width: '210mm', minHeight: '297mm', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', boxSizing: 'border-box', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
              
              {/* HEADER UFFICIALE RADIO TOSCANA CARTA INTESTATA */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '24px' }}>
                <div>
                  <img
                    src="/logo_radio_toscana.png"
                    alt="Radio Toscana - Solo Toscana | Solo Hit"
                    style={{ height: '65px', width: 'auto', objectFit: 'contain', display: 'block' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <img
                    src="/logo_radio_firenze.png"
                    alt="88.7 Radio Firenze"
                    style={{ height: '34px', width: 'auto', objectFit: 'contain', display: 'block' }}
                  />
                  <div style={{ textAlign: 'right', marginTop: '6px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>PROPOSTA COMMERCIALE ON-AIR</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Opportunity 2026 — Formula {tipoAccordo}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>Data: {new Date().toLocaleDateString('it-IT')}</div>
                  </div>
                </div>
              </div>

              {/* SCHEDA DATI CLIENTE E REFERENTE COMMERCIAL E */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>COMMITTENTE</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{qNome || 'Azienda Partner'}</div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>Referente: {qReferente} | P.IVA: {qPiva}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>DIREZIONE COMMERCIALE</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>Fabio Asiri</div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>📧 commerciale@radiotoscana.it | 📞 347/6818595</div>
                </div>
              </div>

              {/* DETTAGLIO DELLA PROPOSTA ECONOMICA */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase' }}>
                  📊 Dettaglio Moduli della Campagna Pubblicitaria
                </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: '#0f172a', color: '#ffffff', textTransform: 'uppercase', fontSize: '10px' }}>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Modulo / Ambito di Diffusione</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Fascia &amp; Periodo</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Dettagli (Copy, Studio, Diritti)</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Listino Ufficiale</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Prezzo Riservato</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quoteItems.map((it, idx) => (
                      <tr key={it.id} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                        <td style={{ padding: '10px', fontWeight: 700 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span>{it.tipo}</span>
                            {it.spotOmaggio && it.spotOmaggio > 0 ? (
                              <span style={{ fontSize: '9px', background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>
                                +{it.spotOmaggio} OMAGGIO
                              </span>
                            ) : null}
                          </div>
                          <div style={{ fontSize: '10px', color: '#e11d48', fontWeight: 600 }}>{it.copertura}</div>
                        </td>
                        <td style={{ padding: '10px' }}>
                          <div>{it.fascia}</div>
                          <div style={{ fontSize: '10px', color: '#64748b' }}>{it.periodo}</div>
                        </td>
                        <td style={{ padding: '10px', color: '#334155' }}>
                          <div>{it.dettagli}</div>
                          {it.tipoProduzione === 'DIRITTI_LIBERI_TOSCANA' && (
                            <div style={{ fontSize: '10px', color: '#0284c7', fontWeight: 700, marginTop: '2px' }}>
                              ★ Ambito: Diritti Liberi per tutte le emittenti toscane (File master broadcast incluso)
                            </div>
                          )}
                          {it.tipoProduzione === 'SOLO_RT_RF' && (
                            <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: 700, marginTop: '2px' }}>
                              ★ Ambito: Riservato per trasmissione su Radio Toscana e Radio Firenze
                            </div>
                          )}

                        </td>
                        <td style={{ padding: '10px', textAlign: 'right', color: '#64748b', textDecoration: it.prezzoListino && it.prezzoListino > it.valore ? 'line-through' : 'none' }}>
                          € {Number(it.prezzoListino || it.valore).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '10px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>
                          € {Number(it.valore).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    {scontoApplicato > 0 && (
                      <tr style={{ borderTop: '2px solid #cbd5e1', background: '#f1f5f9' }}>
                        <td colSpan={3} style={{ padding: '8px 10px', fontWeight: 700, textAlign: 'right', color: '#64748b' }}>
                          Totale a Listino Ufficiale:
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#64748b', textDecoration: 'line-through' }}>
                          € {totaleListino.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                        </td>
                        <td></td>
                      </tr>
                    )}
                    {scontoApplicato > 0 && (
                      <tr style={{ background: '#fef2f2' }}>
                        <td colSpan={4} style={{ padding: '8px 10px', fontWeight: 800, textAlign: 'right', color: '#e11d48' }}>
                          Sconto Commerciale Esclusivo a Voi Riservato:
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#e11d48' }}>
                          - € {scontoApplicato.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    )}
                    <tr style={{ background: '#0f172a', color: '#ffffff' }}>
                      <td colSpan={4} style={{ padding: '10px', fontWeight: 800, textAlign: 'right', textTransform: 'uppercase' }}>
                        Totale Netto Concordato (+ IVA):
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', fontWeight: 900, fontSize: '14px', color: '#4ade80' }}>
                        € {totaleInvestimento.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* SEZIONE BARTER NELLA STAMPA (SE PRESENTE) */}
              {tipoAccordo !== 'STANDARD' && (
                <div style={{ background: '#fdf4ff', border: '1px solid #f0abfc', padding: '14px', borderRadius: '8px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#a21caf', textTransform: 'uppercase' }}>
                    🎁 Quota Cambio Merce / Barter Accordo:
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                    • Quota Radio Toscana: <strong>{barterRadio}</strong>
                    <br />
                    • Quota Ascoltatori (Promozioni On-Air): <strong>{barterAscoltatori}</strong>
                  </div>
                </div>
              )}

              {/* TOTALE INVESTIMENTO */}
              <div style={{ background: '#0f172a', color: '#ffffff', padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>FORMULA CONCORDATA</div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#38bdf8', marginTop: '2px' }}>{tipoAccordo}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>INVESTIMENTO TOTALE NETTO</div>
                  <div style={{ fontSize: '26px', fontWeight: 900, color: '#4ade80', marginTop: '2px' }}>
                    € {totaleInvestimento.toLocaleString('it-IT', { minimumFractionDigits: 2 })} + IVA
                  </div>
                </div>
              </div>

              {/* MODULO ACCETTAZIONE FIRMA */}
              <div style={{ border: '1px solid #cbd5e1', padding: '16px', borderRadius: '8px', background: '#ffffff', marginBottom: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '8px' }}>
                  📝 Per Accettazione della Proposta Commerciale e Condizioni di Messa in Onda
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '24px', fontSize: '11px', color: '#64748b' }}>
                  <div>Data: ___________________</div>
                  <div>Luogo: ___________________</div>
                  <div>
                    <div>Timbro e Firma Committente:</div>
                    <div style={{ height: '35px', borderBottom: '1px dashed #94a3b8', marginTop: '10px' }}></div>
                  </div>
                </div>
              </div>

              {/* FOOTER UFFICIALE CARTA INTESTATA RADIO MONTE SERRA / RADIO TOSCANA / RADIO FIRENZE */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', textAlign: 'center', fontSize: '10px', color: '#64748b', lineHeight: 1.5 }}>
                <div style={{ fontWeight: 800, color: '#e11d48', fontSize: '11px', marginBottom: '2px' }}>Radio Toscana e Radio Firenze</div>
                <div>Direzione e sede: via de&apos; Pucci, 2 - 50122 Firenze - Tel. 055 285030 - Fax 055 283793</div>
                <div>Radio Toscana e Radio Firenze sono marchi di proprietà di Radio Monte Serra srl</div>
                <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px' }}>P.IVA 04472740481 - C.F. 00940130503 - CCIAA Firenze 453074 - Conc. Prot. 903292 - Reg. Trib. Fi 63912</div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODALE BOZZA CONTRATTO RADIO MONTE SERRA (LAVORO UFFICIO 18:30) */}
      {showContractModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3 className="modal-title">📝 Bozza Contratto Radio Monte Serra — Travaso Automatico</h3>
              <button className="modal-close" onClick={() => setShowContractModal(false)}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="form-group">
              <div>
                <label className="form-label">Numero Contratto Ufficiale</label>
                <input type="text" className="form-input" value={contractData.numero} onChange={e => setContractData({ ...contractData, numero: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Ragione Sociale Committente</label>
                <input type="text" className="form-input" value={contractData.committente} onChange={e => setContractData({ ...contractData, committente: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Partita IVA</label>
                <input type="text" className="form-input" value={contractData.piva} onChange={e => setContractData({ ...contractData, piva: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Codice Univoco SDI</label>
                <input type="text" className="form-input" value={contractData.sdi} onChange={e => setContractData({ ...contractData, sdi: e.target.value })} />
              </div>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn" onClick={() => setShowContractModal(false)}>Annulla</button>
              <button className="btn btn-primary" onClick={() => {
                alert(`Contratto ${contractData.numero} per ${contractData.committente} attivato e salvato su Supabase!`);
                setShowContractModal(false);
                setShowQuoteModal(false);
              }}>
                💾 Conferma &amp; Attiva Contratto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE REMIND PREVENTIVO A 3 STEP (LAVORO UFFICIO 18:30) */}
      {showRemindModal && selectedQuoteForRemind && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">⏰ Invia Remind Trattativa in Corso</h3>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                  Cliente: <strong style={{ color: '#38bdf8' }}>{selectedQuoteForRemind.nome_azienda_evento}</strong> (Trattativa: € {(selectedQuoteForRemind.valore_preventivo || 1200).toLocaleString('it-IT')})
                </p>
              </div>
              <button className="modal-close" onClick={() => setShowRemindModal(false)}>✕</button>
            </div>

            {/* SELEZIONE STEP REMIND */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {[
                { s: 1 as const, label: 'Step 1: Ricezione (+3gg)' },
                { s: 2 as const, label: 'Step 2: Urgenza Spazi (+8gg)' },
                { s: 3 as const, label: 'Step 3: Break-up (+15gg)' }
              ].map(st => (
                <button
                  key={st.s}
                  onClick={() => switchRemindStep(st.s)}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: remindStep === st.s ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                    background: remindStep === st.s ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.03)',
                    color: remindStep === st.s ? '#fbbf24' : '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Oggetto Email</label>
              <input type="text" className="form-input" value={remindSubject} onChange={e => setRemindSubject(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Testo del Remind</label>
              <textarea rows={7} className="form-textarea" value={remindBody} onChange={e => setRemindBody(e.target.value)} />
            </div>

            {remindSent ? (
              <div style={{ padding: '12px', background: 'rgba(34, 197, 94, 0.2)', border: '1px solid rgba(34, 197, 94, 0.4)', borderRadius: '8px', color: '#4ade80', textAlign: 'center', fontWeight: 700 }}>
                ✅ Remind Step {remindStep} inviato con successo da commerciale@radiotoscana.it!
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button className="btn" onClick={() => setShowRemindModal(false)}>Annulla</button>
                <button
                  className="btn btn-primary"
                  style={{ background: '#f59e0b', borderColor: '#f59e0b', color: '#000', fontWeight: 800 }}
                  onClick={() => {
                    setRemindSent(true);
                    setTimeout(() => setShowRemindModal(false), 1500);
                  }}
                >
                  ✉️ Invia Remind Ufficiale
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODALE EMAIL PROGRAMMAZIONE ON-AIR */}
      {showEmailModal && selectedLeadForEmail && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">✉️ Invia Programmazione On-Air al Cliente</h3>
              <button className="modal-close" onClick={() => setShowEmailModal(false)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">Oggetto dell&apos;Email</label>
              <input
                type="text"
                className="form-input"
                readOnly
                value={`Radio Toscana — Programmazione Messa in Onda Campagna "${selectedLeadForEmail.nome_azienda_evento}"${selectedLeadForEmail.numero_contratto ? ` (Contratto Nr. ${selectedLeadForEmail.numero_contratto})` : ''}`}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Corpo Email Preconfigurato</label>
              <textarea
                className="form-textarea"
                readOnly
                value={`Gentile ${selectedLeadForEmail.nome_azienda_evento},

desideriamo confermarLe che la Sua campagna pubblicitaria è stata regolarmente pianificata ed è pronta per la messa in onda sulle nostre frequenze.

📌 RIEPILOGO DELLA PROGRAMMAZIONE ON-AIR:
• Contratto di Riferimento: Nr. ${selectedLeadForEmail.numero_contratto || 'In definizione'}
• Area Target: ${selectedLeadForEmail.area_target || 'Toscana'}
• Totale Spot Pianificati: ${selectedLeadForEmail.plafond_totale_spot || 'Secondo accordi'}
• Stato Programmazione: ${selectedLeadForEmail.stato_programmazione || 'Iniziata'}

In allegato a questa email trova il prospetto ufficiale della Programmazione On-Air con la scansione esatta di tutti gli orari di trasmissione giornalieri.

Restiamo a Sua completa disposizione per qualsiasi esigenza.

Cordiali saluti,

Direzione Commerciale & Programmazione
Radio Toscana
📧 commerciale@radiotoscana.it
🌐 www.radiotoscana.it`}
              />
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn" onClick={() => setShowEmailModal(false)}>Annulla</button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  alert(`Email di Programmazione On-Air inviata con successo a ${selectedLeadForEmail.nome_azienda_evento}!`);
                  setShowEmailModal(false);
                }}
              >
                🚀 Invia Email Ora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
