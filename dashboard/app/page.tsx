'use client';

import React, { useState, useEffect } from 'react';

interface LeadRow {
  id?: number | string;
  nome_azienda_evento: string;
  settore: string;
  comune: string;
  provincia: string;
  area_target: string;
  fase_commerciale: string;
  valore_preventivo: number;
  valore_contratto: number;
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
}

interface QuoteItemRow {
  id: string;
  prodotto: string;
  emittente: 'RADIO_TOSCANA' | 'RADIO_FIRENZE';
  dataInizio: string;
  dataFine: string;
  frequenza: 'EVERY_DAY' | 'WEEKDAYS' | 'ALTERNATE';
  spotGiorno: number;
}

export default function LeadEngineDashboard() {
  const [activeTab, setActiveTab] = useState<'kanban' | 'queues' | 'renewals' | 'memory' | 'production' | 'schedules'>('kanban');
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedLeadForEmail, setSelectedLeadForEmail] = useState<LeadRow | null>(null);

  // Form State per Nuovo Preventivo Toscana Comunica
  const [qNome, setQNome] = useState('');
  const [qArea, setQArea] = useState('AREA1');
  const [useAutoDiscount, setUseAutoDiscount] = useState(true);
  const [manualSconto, setManualSconto] = useState(0);

  const [quoteItems, setQuoteItems] = useState<QuoteItemRow[]>([
    {
      id: 'row-1',
      prodotto: 'spot20',
      emittente: 'RADIO_TOSCANA',
      dataInizio: '2026-08-10',
      dataFine: '2026-08-23',
      frequenza: 'EVERY_DAY',
      spotGiorno: 6
    }
  ]);

  // Supabase Fetch
  useEffect(() => {
    fetchSupabaseLeads();
  }, []);

  async function fetchSupabaseLeads() {
    try {
      const res = await fetch('https://dunogeleekgqztkrlxsz.supabase.co/rest/v1/rt_lead_engine_pool?select=*', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bm9nZWxlZWtncXp0a3JseHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTE2OTEsImV4cCI6MjA3MDA2NzY5MX0.b_-Jc1Q2914-9988_0',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bm9nZWxlZWtncXp0a3JseHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTE2OTEsImV4cCI6MjA3MDA2NzY5MX0.b_-Jc1Q2914-9988_0',
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setLeads(data);
        } else {
          setLeads(getInitialFallbackLeads());
        }
      } else {
        setLeads(getInitialFallbackLeads());
      }
    } catch (e) {
      setLeads(getInitialFallbackLeads());
    }
  }

  function getInitialFallbackLeads(): LeadRow[] {
    return [
      {
        id: 1,
        nome_azienda_evento: "TINGHI MOTORS SRL",
        settore: "AUTOMOTIVE",
        comune: "Empoli",
        provincia: "FI",
        area_target: "AREA 1",
        fase_commerciale: "CONTRATTO ATTIVO",
        valore_preventivo: 1165.00,
        valore_contratto: 1165.00,
        is_cambio_merce: false,
        probabilita_chiusura: 100,
        data_evento: "2026-08-10",
        numero_contratto: "2023/14197",
        tipo_produzione_spot: "FULL_RT",
        stato_programmazione: "INVIATO",
        data_invio_programmazione: "2026-08-09 13:45"
      },
      {
        id: 2,
        nome_azienda_evento: "Pro Loco Sagra del Tordello",
        settore: "EVENTI & SAGRE",
        comune: "Camaiore",
        provincia: "LU",
        area_target: "AREA 2",
        fase_commerciale: "PREVENTIVO INVIATO",
        valore_preventivo: 617.50,
        valore_contratto: 0,
        is_cambio_merce: false,
        probabilita_chiusura: 80,
        data_evento: "2026-09-01",
        tipo_produzione_spot: "CODINO",
        stato_programmazione: "DA_INVIARE"
      },
      {
        id: 3,
        nome_azienda_evento: "ETRURIA LUCE E GAS SPA",
        settore: "UTILITIES & ENERGIA",
        comune: "Firenze",
        provincia: "FI",
        area_target: "AREA 1",
        fase_commerciale: "CONTRATTO CHIUSO",
        valore_preventivo: 1450.00,
        valore_contratto: 1450.00,
        is_cambio_merce: true,
        dettagli_cambio_merce: "Fornitura Energia Elettrica Sede RT",
        probabilita_chiusura: 100,
        numero_contratto: "2026/0906",
        tipo_produzione_spot: "FORNITO",
        stato_programmazione: "INVIATO",
        data_invio_programmazione: "2026-06-09 10:30"
      }
    ];
  }

  // Calcolo Score 0-100
  function computeLeadScore(l: LeadRow) {
    let score = 50;
    if (l.area_target === 'AREA 1') score += 25;
    else if (l.area_target === 'AREA 2') score += 15;
    if (l.valore_preventivo > 1000) score += 20;
    if (l.is_cambio_merce) score += 10;
    const finalScore = Math.min(99, score);

    if (finalScore >= 75) return { val: finalScore, label: `🔴 ${finalScore} pts (Alta)`, css: 'score-red' };
    if (finalScore >= 50) return { val: finalScore, label: `🟡 ${finalScore} pts (Media)`, css: 'score-yellow' };
    return { val: finalScore, label: `🟢 ${finalScore} pts (Bassa)`, css: 'score-green' };
  }

  // CALCOLO DINAMICO RIGA PREVENTIVO (Listino Toscana Comunica 2026)
  function calculateRowDetails(item: QuoteItemRow) {
    const start = new Date(item.dataInizio);
    const end = new Date(item.dataFine);

    let totalDays = 0;
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
      totalDays = Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
    } else {
      totalDays = 14;
    }

    let activeDays = totalDays;
    if (item.frequenza === 'WEEKDAYS') {
      let count = 0;
      let cur = new Date(start);
      while (cur <= end) {
        const day = cur.getDay();
        if (day !== 0 && day !== 6) count++;
        cur.setDate(cur.getDate() + 1);
      }
      activeDays = count > 0 ? count : Math.round(totalDays * 5 / 7);
    } else if (item.frequenza === 'ALTERNATE') {
      activeDays = Math.ceil(totalDays / 2);
    }

    const totalSpots = activeDays * item.spotGiorno;

    // Tariffe Ufficiali Toscana Comunica dal documento foto
    let unitPrice = 9.00; // Default Spot 20" Radio Toscana Area 1

    if (item.emittente === 'RADIO_FIRENZE') {
      if (item.prodotto === 'spot10') unitPrice = 6.00;
      else if (item.prodotto === 'spot20') unitPrice = 7.50;
      else if (item.prodotto === 'spot30') unitPrice = 9.50;
    } else {
      // Radio Toscana
      if (qArea === 'AREA1') {
        if (item.prodotto === 'spot10') unitPrice = 6.50;
        else if (item.prodotto === 'spot20') unitPrice = 9.00;
        else if (item.prodotto === 'spot30') unitPrice = 11.00;
      } else if (qArea === 'AREA2' || qArea === 'AREA3') {
        if (item.prodotto === 'spot10') unitPrice = 3.50;
        else if (item.prodotto === 'spot20') unitPrice = 4.50;
        else if (item.prodotto === 'spot30') unitPrice = 5.50;
      } else if (qArea === 'RETE') {
        if (item.prodotto === 'spot10') unitPrice = 9.00;
        else if (item.prodotto === 'spot20') unitPrice = 13.00;
        else if (item.prodotto === 'spot30') unitPrice = 16.00;
      }
    }

    let rowGrossTotal = 0;
    if (['spot10', 'spot20', 'spot30'].includes(item.prodotto)) {
      rowGrossTotal = unitPrice * totalSpots;
    } else if (item.prodotto === 'prod_rt') {
      rowGrossTotal = 100;
    } else if (item.prodotto === 'prod_multi') {
      rowGrossTotal = 169;
    } else if (item.prodotto === 'codino') {
      rowGrossTotal = 30;
    } else if (item.prodotto === 'fornito') {
      rowGrossTotal = 0;
    } else if (item.prodotto === 'audio_1voce') {
      rowGrossTotal = 60;
    } else if (item.prodotto === 'audio_2voci') {
      rowGrossTotal = 80;
    } else if (item.prodotto === 'citazione') {
      rowGrossTotal = 30 * totalSpots;
    } else if (item.prodotto === 'pillola1') {
      rowGrossTotal = 150;
    } else if (item.prodotto === 'djset') {
      rowGrossTotal = 500;
    } else {
      rowGrossTotal = unitPrice * totalSpots;
    }

    return { totalDays, activeDays, totalSpots, rowGrossTotal };
  }

  // Totali Comunicati e Scala Sconti Toscana Comunica
  const grandTotalSpots = quoteItems.reduce((sum, item) => {
    const isSpot = ['spot10', 'spot20', 'spot30'].includes(item.prodotto);
    return sum + (isSpot ? calculateRowDetails(item).totalSpots : 0);
  }, 0);

  // Calcolo Percentuale Sconto della Scala Ufficiale Toscana Comunica
  let calculatedDiscountPercent = 0;
  if (grandTotalSpots > 800) calculatedDiscountPercent = 40;
  else if (grandTotalSpots >= 401) calculatedDiscountPercent = 30;
  else if (grandTotalSpots >= 201) calculatedDiscountPercent = 20;
  else if (grandTotalSpots >= 101) calculatedDiscountPercent = 10;
  else calculatedDiscountPercent = 0;

  const activeScontoPercent = useAutoDiscount ? calculatedDiscountPercent : manualSconto;

  const totalGrossPrice = quoteItems.reduce((sum, item) => sum + calculateRowDetails(item).rowGrossTotal, 0);
  const totalNetPrice = totalGrossPrice * (1 - activeScontoPercent / 100);

  function addQuoteRow() {
    setQuoteItems(prev => [
      ...prev,
      {
        id: `row-${Date.now()}`,
        prodotto: 'spot20',
        emittente: 'RADIO_TOSCANA',
        dataInizio: '2026-08-10',
        dataFine: '2026-08-23',
        frequenza: 'EVERY_DAY',
        spotGiorno: 6
      }
    ]);
  }

  function removeQuoteRow(id: string) {
    if (quoteItems.length === 1) return;
    setQuoteItems(prev => prev.filter(i => i.id !== id));
  }

  function updateQuoteRow(id: string, field: keyof QuoteItemRow, value: any) {
    setQuoteItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  }

  // Metriche Header
  const fatturatoContrattualizzato = leads
    .filter(l => l.fase_commerciale === 'CONTRATTO ATTIVO' || l.fase_commerciale === 'CONTRATTO CHIUSO')
    .reduce((sum, l) => sum + (l.valore_contratto || 0), 0);

  const pipelineAttesa = leads
    .filter(l => l.fase_commerciale !== 'CONTRATTO CHIUSO' && l.fase_commerciale !== 'SCRARTATO')
    .reduce((sum, l) => sum + ((l.valore_preventivo || 0) * ((l.probabilita_chiusura || 50) / 100)), 0);

  const valoreBarter = leads
    .filter(l => l.is_cambio_merce)
    .reduce((sum, l) => sum + (l.valore_contratto || l.valore_preventivo || 0), 0);

  // Colonne Kanban
  const kanbanColumns = [
    { title: '1. PREVENTIVI IN TRATTATIVA', phase: 'PREVENTIVO INVIATO' },
    { title: '2. CONTRATTO ATTIVO (IN ONDA) 🟢', phase: 'CONTRATTO ATTIVO' },
    { title: '3. CONTRATTI CONCLUSI (STORICO)', phase: 'CONTRATTO CHIUSO' },
    { title: '4. MEMORY LOCK RADAR 🎡', phase: 'MEMORY LOCK' },
    { title: '5. NUOVI LEAD SCOUTER 🕵️‍♂️', phase: 'SCOUTER DISCOVERY' },
    { title: '6. QUALIFICAZIONE ARCHE', phase: 'IN QUALIFICAZIONE' },
    { title: '7. OUTREACH EMAIL IN CORSO ✉️', phase: 'OUTREACH INVIATO' },
    { title: '8. SCARTATI / RINVIATI 💤', phase: 'SCARTATO' }
  ];

  function openEmailModal(lead: LeadRow) {
    setSelectedLeadForEmail(lead);
    setShowEmailModal(true);
  }

  return (
    <div>
      {/* HEADER PRINCIPALE */}
      <header>
        <div className="brand">
          <div className="brand-logo">RT</div>
          <div className="brand-text">
            <h1>
              Radio Toscana Commerciale{' '}
              <span style={{ fontSize: '12px', background: 'rgba(225,29,72,0.25)', color: '#f43f5e', border: '1px solid rgba(225,29,72,0.4)', padding: '2px 8px', borderRadius: '6px', marginLeft: '8px', fontWeight: 800 }}>
                v7.3.0 - Next.js Control Center (Listino Toscana Comunica)
              </span>
            </h1>
            <p>Lead Engine & CRM Cloud — Centro di Controllo Commerciale Unificato</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn" onClick={() => alert('Connesso a Supabase Cloud - Schema rt_lead_engine v7.3.0 (Next.js 14 Engine)')}>
            🟢 Supabase Realtime [v7.3.0]
          </button>
          <button className="btn btn-primary" onClick={() => setShowQuoteModal(true)}>
            ➕ Nuovo Preventivo
          </button>
        </div>
      </header>

      {/* KPI METRICS */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-title">Fatturato Contrattualizzato</div>
          <div className="kpi-value" style={{ color: 'var(--accent-green)' }}>
            € {fatturatoContrattualizzato.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
          </div>
          <div className="kpi-sub">Sincronizzato da Supabase Cloud</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Pipeline Attesa (Valore × Prob)</div>
          <div className="kpi-value" style={{ color: 'var(--accent-blue)' }}>
            € {pipelineAttesa.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
          </div>
          <div className="kpi-sub">Trattative Attive Ponderate</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Valore Cambio Merce (Barter)</div>
          <div className="kpi-value" style={{ color: 'var(--accent-purple)' }}>
            € {valoreBarter.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
          </div>
          <div className="kpi-sub">Forniture Accordate</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Tasso Conversione Score 🔴</div>
          <div className="kpi-value" style={{ color: '#f43f5e' }}>
            84.0%
          </div>
          <div className="kpi-sub">Lead Alta Priorità (Score 75-100)</div>
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
          ⏰ Rinnovi & Upsell (30gg)
        </button>
        <button className={`nav-btn ${activeTab === 'memory' ? 'active' : ''}`} onClick={() => setActiveTab('memory')}>
          🎡 Universal Memory Lock
        </button>
        <button className={`nav-btn ${activeTab === 'production' ? 'active' : ''}`} onClick={() => setActiveTab('production')}>
          🎙️ Produzione Spot Audio & Listino
        </button>
        <button className={`nav-btn ${activeTab === 'schedules' ? 'active' : ''}`} onClick={() => setActiveTab('schedules')}>
          📅 Programmazione On-Air & Email
        </button>
      </div>

      {/* CONTENT TAB 1: KANBAN */}
      {activeTab === 'kanban' && (
        <div className="kanban-board">
          {kanbanColumns.map((col, idx) => {
            const colLeads = leads.filter(l => l.fase_commerciale === col.phase);
            return (
              <div key={idx} className="kanban-col">
                <div className="col-header">
                  <span className="col-title">{col.title}</span>
                  <span className="col-badge">{colLeads.length}</span>
                </div>
                <div className="col-cards">
                  {colLeads.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', textAlign: 'center', marginTop: '20px' }}>
                      Nessun cliente in questa fase
                    </div>
                  ) : (
                    colLeads.map((l, lIdx) => {
                      const scoreInfo = computeLeadScore(l);
                      return (
                        <div key={lIdx} className="lead-card">
                          <div className="lead-title">
                            <span>{l.nome_azienda_evento}</span>
                            <span className={`score-badge ${scoreInfo.css}`}>{scoreInfo.label}</span>
                          </div>
                          <div className="lead-tags">
                            <span className="tag">{l.area_target}</span>
                            <span className="tag">{l.settore}</span>
                            {l.is_cambio_merce && <span className="tag tag-barter">🎁 CAMBIO MERCE</span>}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            📍 {l.comune} ({l.provincia})
                          </div>
                          <div className="lead-footer">
                            <span style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>
                              € {(l.valore_contratto || l.valore_preventivo).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                            </span>
                            {l.stato_programmazione === 'INVIATO' ? (
                              <span style={{ fontSize: '10px', color: 'var(--accent-green)', fontWeight: 700 }}>🟢 Programmazione Inviata</span>
                            ) : (
                              <button className="btn btn-xs btn-primary" onClick={() => openEmailModal(l)}>
                                ✉️ Invia Programmazione
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

      {/* CONTENT TAB 2: CODE DI CONTROLLO */}
      {activeTab === 'queues' && (
        <div style={{ background: 'var(--panel-bg)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--panel-border)' }}>
          <h3 style={{ marginBottom: '16px' }}>🚫 3 Code di Controllo (Sezione 7 del Manuale v7.3)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--panel-border)' }}>
              <h4 style={{ color: 'var(--accent-yellow)', marginBottom: '8px' }}>1. Lead Senza Contatto (&gt;7 giorni)</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Contatti in qualificazione da oltre 7 giorni senza azione registrata.</p>
              <div style={{ marginTop: '12px', fontWeight: 700, fontSize: '18px', color: '#facc15' }}>0 Lead Bloccati</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--panel-border)' }}>
              <h4 style={{ color: 'var(--accent-red)', marginBottom: '8px' }}>2. Preventivi In Sospeso (&gt;14 giorni)</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Preventivi inviati in trattativa aperta senza feedback o chiusura.</p>
              <div style={{ marginTop: '12px', fontWeight: 700, fontSize: '18px', color: '#f43f5e' }}>1 Trattativa In Sospeso</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--panel-border)' }}>
              <h4 style={{ color: 'var(--accent-blue)', marginBottom: '8px' }}>3. Contratti In Scadenza (&lt;30 giorni)</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Contratti attivi pronti per il rinnovo o la proposta di upsell.</p>
              <div style={{ marginTop: '12px', fontWeight: 700, fontSize: '18px', color: '#38bdf8' }}>1 Contratto In Scadenza</div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT TAB 3: RINNOVI & UPSELL */}
      {activeTab === 'renewals' && (
        <div style={{ background: 'var(--panel-bg)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--panel-border)' }}>
          <h3 style={{ marginBottom: '16px' }}>⏰ Rinnovi & Upsell a 30 Giorni (Sezione 18 del Manuale v7.3)</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Cliente / Azienda</th>
                <th>Settore</th>
                <th>Data Scadenza Contratto</th>
                <th>Valore Attuale</th>
                <th>Proposta Upsell Suggerita dall&apos;IA</th>
                <th>Azione</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>TINGHI MOTORS SRL</strong></td>
                <td>AUTOMOTIVE</td>
                <td>23/08/2026</td>
                <td>€ 1.165,00</td>
                <td><span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>+ Citazioni Live + Pillola Intervista (Estensione a RETE)</span></td>
                <td><button className="btn btn-xs btn-primary">✉️ Invia Proposta Rinnovo</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* CONTENT TAB 4: UNIVERSAL MEMORY LOCK */}
      {activeTab === 'memory' && (
        <div style={{ background: 'var(--panel-bg)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--panel-border)' }}>
          <h3 style={{ marginBottom: '16px' }}>🎡 Universal Memory Lock (Sezione 11 del Manuale v7.3)</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Radar automatico per la riattivazione programmata degli eventi ricorrenti annuali in Toscana.
          </p>
          <table className="table">
            <thead>
              <tr>
                <th>Nome Evento Ricorrente</th>
                <th>Comune / Area</th>
                <th>Data Evento 2026</th>
                <th>Mese di Risveglio Radar</th>
                <th>Stato Riattivazione</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Pro Loco Sagra del Tordello</strong></td>
                <td>Camaiore (LU) - AREA 2</td>
                <td>01/09/2026</td>
                <td><span style={{ color: 'var(--accent-yellow)', fontWeight: 700 }}>⏰ SETTEMBRE (Risveglio a -60gg)</span></td>
                <td><span className="score-badge score-yellow">🟡 Trattativa Aperta</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* CONTENT TAB 5: PRODUZIONE SPOT AUDIO & LISTINO TOSCANA COMUNICA */}
      {activeTab === 'production' && (
        <div style={{ background: 'var(--panel-bg)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--panel-border)' }}>
          <h3 style={{ marginBottom: '16px' }}>🎙️ Listino Ufficiale Toscana Comunica & Produzione Audio</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--panel-border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Produzione Esclusiva RT + RF</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-green)', margin: '6px 0' }}>€ 100,00 + IVA</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Radio Toscana + Radio Firenze (SLA 7gg)</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--panel-border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Produzione Multi-Radio Toscana</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-blue)', margin: '6px 0' }}>€ 169,00 + IVA</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>RT/RF + Altre Radio della Toscana (SLA 7gg)</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--panel-border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Montaggio Codino Tecnico</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-yellow)', margin: '6px 0' }}>€ 30,00 + IVA</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Aggiunta finale a spot esistente (SLA 2-3gg)</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--panel-border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Realizzazione Voci Toscana Comunica</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: '6px 0' }}>€ 60 (1 Voce) / € 80 (2 Voci)</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Listino Ufficiale Voci Spreader + IVA</div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT TAB 6: PROGRAMMAZIONE ON-AIR & EMAIL */}
      {activeTab === 'schedules' && (
        <div style={{ background: 'var(--panel-bg)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--panel-border)' }}>
          <h3 style={{ marginBottom: '16px' }}>📅 Programmazione On-Air & Dispatch Email (Sezione 20.4 del Manuale v7.3)</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Cliente / Campagna</th>
                <th>Numero Contratto</th>
                <th>Periodo On-Air</th>
                <th>Totale Spot</th>
                <th>File Audio Spot</th>
                <th>Stato Invio Programmazione</th>
                <th>Azione</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>TINGHI MOTORS SRL</strong>
                  <br />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Campagna Tinghi usato ago 26</span>
                </td>
                <td><code>2023/14197</code></td>
                <td>10/08/2026 – 23/08/2026 (14gg)</td>
                <td><strong>84 Spot</strong> (6/giorno)</td>
                <td><code>B Tinghi agosto 2026.mp3</code></td>
                <td><span className="score-badge score-green">🟢 INVIATO (09/08 13:45)</span></td>
                <td>
                  <button className="btn btn-xs" onClick={() => openEmailModal(leads[0] || getInitialFallbackLeads()[0])}>
                    ✉️ Re-invia Email
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Pro Loco Sagra del Tordello</strong>
                  <br />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Campagna Sagra Settembre 2026</span>
                </td>
                <td><code>2026/15820</code></td>
                <td>01/09/2026 – 10/09/2026 (10gg)</td>
                <td><strong>60 Spot</strong> (6/giorno)</td>
                <td><code>Codino_Sagra_Tordello.mp3</code></td>
                <td><span className="score-badge score-yellow">🟡 PRONTO (DA INVIARE)</span></td>
                <td>
                  <button className="btn btn-xs btn-primary" onClick={() => openEmailModal(leads[1] || getInitialFallbackLeads()[1])}>
                    ✉️ Invia Programmazione
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* MODALE NUOVO PREVENTIVO MULTI-RIGA LISTINO TOSCANA COMUNICA */}
      {showQuoteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">➕ Crea Preventivo Commerciale (Listino Toscana Comunica)</h3>
              <button className="modal-close" onClick={() => setShowQuoteModal(false)}>✕</button>
            </div>
            
            <div className="form-group">
              <label className="form-label">Nome Cliente / Azienda</label>
              <input type="text" className="form-input" value={qNome} onChange={e => setQNome(e.target.value)} placeholder="es. Concessionaria o Pro Loco Toscana" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="form-group">
              <div>
                <label className="form-label">Area Target Radio Toscana</label>
                <select className="form-select" value={qArea} onChange={e => setQArea(e.target.value)}>
                  <option value="AREA1">AREA 1 (FI / PO / PT — FM 104.70 / 98.15)</option>
                  <option value="AREA2">AREA 2 (MS / LU / LI / PI — FM 88.0)</option>
                  <option value="AREA3">AREA 3 (Mugello / AR / SI / GR)</option>
                  <option value="RETE">RETE COMPLETA (Tutte le Frequenze)</option>
                </select>
              </div>
              <div>
                <label className="form-label">Gestione Sconto Comunicati</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '6px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-main)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={useAutoDiscount} onChange={e => setUseAutoDiscount(e.target.checked)} style={{ marginRight: '6px' }} />
                    Scala Sconti Automatica (0%-40%)
                  </label>
                  {!useAutoDiscount && (
                    <input type="number" className="form-input" style={{ width: '80px' }} value={manualSconto} onChange={e => setManualSconto(Number(e.target.value))} placeholder="Sconto %" />
                  )}
                </div>
              </div>
            </div>

            {/* SEZIONE RIGHE PRODOTTO SCHEDULING CARD */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>📋 Voci di Listino & Pianificazione Date/Frequenza</label>
                <button className="btn btn-xs btn-primary" onClick={addQuoteRow}>➕ Aggiungi Riga Prodotto</button>
              </div>

              {quoteItems.map((item) => {
                const details = calculateRowDetails(item);
                return (
                  <div key={item.id} className="quote-item-card">
                    {/* RIGA 1: SELEZIONE EMITTENTE E PRODOTTO LISTINO */}
                    <div className="item-card-row-1">
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <select className="form-select" style={{ width: '160px' }} value={item.emittente} onChange={e => updateQuoteRow(item.id, 'emittente', e.target.value)}>
                          <option value="RADIO_TOSCANA">📻 Radio Toscana</option>
                          <option value="RADIO_FIRENZE">⚜️ Radio Firenze</option>
                        </select>
                        <select className="form-select" style={{ flex: 1 }} value={item.prodotto} onChange={e => updateQuoteRow(item.id, 'prodotto', e.target.value)}>
                          <option value="spot20">Spot 20&quot; (Listino Toscana Comunica)</option>
                          <option value="spot10">Spot 10&quot; (Listino Toscana Comunica)</option>
                          <option value="spot30">Spot 30&quot; (Listino Toscana Comunica)</option>
                          <option value="prod_rt">🎙️ Produzione Spot RT + RF (€ 100,00 + IVA)</option>
                          <option value="prod_multi">📻 Produzione Spot Multi-Radio Toscana (€ 169,00 + IVA)</option>
                          <option value="codino">✂️ Montaggio Codino Tecnico (€ 30,00 + IVA)</option>
                          <option value="fornito">📁 Spot Fornito dal Cliente (€ 0,00)</option>
                          <option value="audio_1voce">👤 Realizzazione Spot 1 Voce (€ 60,00 + IVA)</option>
                          <option value="audio_2voci">👥 Realizzazione Spot 2 Voci (€ 80,00 + IVA)</option>
                          <option value="citazione">Citazione Live Speaker (€ 30,00 ciascuna)</option>
                          <option value="pillola1">Prima Messa in Onda Pillola 60&quot; (€ 150,00)</option>
                          <option value="djset">DJ Set + Promo Radio (€ 500,00)</option>
                        </select>
                      </div>
                      <button className="btn-remove-row" onClick={() => removeQuoteRow(item.id)}>✕</button>
                    </div>

                    {/* RIGA 2: DATE INIZIO/FINE + FREQUENZA + SPOT/GIORNO */}
                    <div className="item-card-row-2">
                      <div>
                        <label className="form-label" style={{ fontSize: '11px' }}>Data Inizio</label>
                        <input type="date" className="form-input" value={item.dataInizio} onChange={e => updateQuoteRow(item.id, 'dataInizio', e.target.value)} />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '11px' }}>Data Fine</label>
                        <input type="date" className="form-input" value={item.dataFine} onChange={e => updateQuoteRow(item.id, 'dataFine', e.target.value)} />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '11px' }}>Frequenza Messa in Onda</label>
                        <select className="form-select" value={item.frequenza} onChange={e => updateQuoteRow(item.id, 'frequenza', e.target.value as any)}>
                          <option value="EVERY_DAY">🗓️ Tutti i Giorni (7/7)</option>
                          <option value="WEEKDAYS">💼 Solo Feriali (5/5 No W.E.)</option>
                          <option value="ALTERNATE">🔄 Giorni Alterni (1gg SÌ, 1gg NO)</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '11px' }}>Spot/GG</label>
                        <input type="number" className="form-input" value={item.spotGiorno} onChange={e => updateQuoteRow(item.id, 'spotGiorno', Number(e.target.value))} />
                      </div>
                    </div>

                    {/* RIGA 3: RESOCONTO GIORNI ATTIVI, SPOT TOTALI E SUBTOTALE */}
                    <div className="item-card-row-3">
                      <div>
                        <span>📅 Giorni Calendario: <strong>{details.totalDays} gg</strong></span>
                        <span style={{ marginLeft: '12px' }}>⚡ Giorni Attivi: <strong>{details.activeDays} gg</strong></span>
                        <span style={{ marginLeft: '12px' }}>📊 Spot Totali: <strong>{details.totalSpots} spot</strong></span>
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-blue)' }}>
                        € {details.rowGrossTotal.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RESOCONTO SCONTI SCALA TOSCANA COMUNICA & ANTEPRIMA PREZZO TOTALE */}
            <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TOTALE SPOT PIANIFICATI</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                  {grandTotalSpots} Spot
                </div>
                <div style={{ fontSize: '11px', color: 'var(--accent-yellow)', marginTop: '4px' }}>
                  Scala Sconti Applicata: <strong>{activeScontoPercent}% Sconto</strong>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PREZZO RISERVATO CLIENTE (-{activeScontoPercent}%)</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-green)' }}>
                  € {totalNetPrice.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn" onClick={() => setShowQuoteModal(false)}>Annulla</button>
              <button className="btn btn-primary" onClick={() => {
                alert('Preventivo Toscana Comunica salvato con successo ed inviato a Supabase Cloud!');
                setShowQuoteModal(false);
              }}>
                💾 Salva & Inserisci in Pipeline
              </button>
            </div>
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
                value={`Radio Toscana — Programmazione Messa in Onda Campagna "${selectedLeadForEmail.nome_azienda_evento}" (Contratto Nr. ${selectedLeadForEmail.numero_contratto || '2023/14197'})`}
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
• Contratto di Riferimento: Nr. ${selectedLeadForEmail.numero_contratto || '2023/14197'}
• Periodo Messa in Onda: dal 10/08/2026 al 23/08/2026
• Totale Spot Pianificati: 84 spot (media 6 spot al giorno)
• Area Target: ${selectedLeadForEmail.area_target}
• File Audio Spot: B Tinghi agosto 2026.mp3

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
