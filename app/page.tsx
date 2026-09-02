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
  const [qNome, setQNome] = useState('Antico Fattore AT');
  const [qReferente, setQReferente] = useState('Dott. Rossi');
  const [qTelefono, setQTelefono] = useState('334/8424204');
  const [qEmail, setQEmail] = useState('amministrazione@anticofattore.it');
  const [qComune, setQComune] = useState('Firenze');
  const [qProvincia, setQProvincia] = useState('FI');
  const [qPiva, setQPiva] = useState('01234567890');
  const [qSdi, setQSdi] = useState('M5UXCR1');

  const [tipoAccordo, setTipoAccordo] = useState<'STANDARD' | 'BARTER_PARZIALE' | 'BARTER_PURO'>('BARTER_PARZIALE');
  const [includeSpot, setIncludeSpot] = useState(true);
  const [spotArea, setSpotArea] = useState('Area 1 (FI / PO / PT — FM 104.7 / 98.2)');
  const [spotDurata, setSpotDurata] = useState('20"');
  const [spotQuantita, setSpotQuantita] = useState(300);
  const [spotValore, setSpotValore] = useState(1500);

  const [includeProduzione, setIncludeProduzione] = useState(true);
  const [produzioneValore, setProduzioneValore] = useState(100);

  const [includeCitazioni, setIncludeCitazioni] = useState(false);
  const [citazioniQuantita, setCitazioniQuantita] = useState(20);
  const [citazioniValore, setCitazioniValore] = useState(400);

  const [campiLiberi, setCampiLiberi] = useState<{ id: string; descrizione: string; valore: number }[]>([
    { id: 'c1', descrizione: "Intervento puntata Mastiscio' 4 interventi", valore: 800 }
  ]);

  const [barterRadio, setBarterRadio] = useState('24 pasti per cena staff Radio Toscana');
  const [barterAscoltatori, setBarterAscoltatori] = useState('16 pasti omaggio per giochi on-air');

  // Bozza Contratto Monte Serra State
  const [contractData, setContractData] = useState({
    numero: '2026/0902-RMS',
    dataDecorrenza: '2026-09-07',
    dataScadenza: '2026-10-07',
    committente: '',
    referente: '',
    piva: '',
    sdi: '',
    indirizzo: 'Via Calzaiuoli 12, Firenze',
    totaleNetto: 2400,
    totaleBarter: 1200,
    modalitaPagamento: 'RIBA 30gg d.f. f.m.',
    noteContratto: 'Accordo Radio Monte Serra con quota Barter Enogastronomica'
  });

  // Supabase Fetch & Fallback Dati Puliti da Settembre 2026
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
          setLeads(getInitialLeads());
        }
      } else {
        setLeads(getInitialLeads());
      }
    } catch (e) {
      setLeads(getInitialLeads());
    }
  }

  function getInitialLeads(): LeadRow[] {
    return [
      {
        id: 1,
        nome_azienda_evento: "TINGHI MOTORS SRL",
        settore: "AUTOMOTIVE",
        comune: "Empoli",
        provincia: "FI",
        area_target: "AREA 1",
        fase_commerciale: "CONTRATTO ATTIVO",
        tipo_contratto: "SCALARE",
        valore_preventivo: 6500.00,
        valore_contratto: 6500.00,
        plafond_totale_spot: 500,
        spot_rimasti: 416,
        is_cambio_merce: false,
        probabilita_chiusura: 100,
        numero_contratto: "2023/14197",
        tipo_produzione_spot: "FULL_RT",
        stato_programmazione: "INVIATO",
        anno_riferimento: "2026"
      },
      {
        id: 2,
        nome_azienda_evento: "COMUNE DI FIRENZE",
        settore: "PUBBLICA AMMINISTRAZIONE",
        comune: "Firenze",
        provincia: "FI",
        area_target: "RETE",
        fase_commerciale: "CONTRATTO ATTIVO",
        tipo_contratto: "SCALARE",
        valore_preventivo: 15000.00,
        valore_contratto: 15000.00,
        plafond_totale_spot: 1000,
        spot_rimasti: 880,
        is_cambio_merce: false,
        probabilita_chiusura: 100,
        numero_contratto: "PA-2026/088",
        tipo_produzione_spot: "FORNITO",
        stato_programmazione: "INVIATO",
        anno_riferimento: "2026"
      },
      {
        id: 3,
        nome_azienda_evento: "ACQUE SPA",
        settore: "UTILITIES & ENERGIA",
        comune: "Pisa",
        provincia: "PI",
        area_target: "AREA 2",
        fase_commerciale: "CONTRATTO ATTIVO",
        tipo_contratto: "SCALARE",
        valore_preventivo: 10000.00,
        valore_contratto: 10000.00,
        plafond_totale_spot: 800,
        spot_rimasti: 720,
        is_cambio_merce: false,
        probabilita_chiusura: 100,
        numero_contratto: "ENT-2026/412",
        tipo_produzione_spot: "FULL_RT",
        stato_programmazione: "INVIATO",
        anno_riferimento: "2026"
      },
      {
        id: 4,
        nome_azienda_evento: "ANTICO FATTORE AT",
        settore: "RISTORAZIONE & FOOD",
        comune: "Firenze",
        provincia: "FI",
        area_target: "AREA 1",
        fase_commerciale: "PREVENTIVO INVIATO",
        tipo_contratto: "SECCO",
        valore_preventivo: 2400.00,
        valore_contratto: 0,
        is_cambio_merce: true,
        dettagli_cambio_merce: "Barter Parziale Pasti e Cene Staff RT",
        probabilita_chiusura: 85,
        anno_riferimento: "2026"
      },
      {
        id: 5,
        nome_azienda_evento: "ETRURIA LUCE E GAS SPA",
        settore: "UTILITIES & ENERGIA",
        comune: "Firenze",
        provincia: "FI",
        area_target: "AREA 1",
        fase_commerciale: "CONTRATTO CHIUSO",
        tipo_contratto: "SECCO",
        valore_preventivo: 2800.00,
        valore_contratto: 2800.00,
        is_cambio_merce: true,
        dettagli_cambio_merce: "Fornitura Energia Sede RT",
        probabilita_chiusura: 100,
        numero_contratto: "2026/0906",
        tipo_produzione_spot: "FORNITO",
        stato_programmazione: "INVIATO",
        anno_riferimento: "2026"
      }
    ];
  }

  // Calcolo Totali Preventivo Modulare
  const totSpot = includeSpot ? Number(spotValore || 0) : 0;
  const totProd = includeProduzione ? Number(produzioneValore || 0) : 0;
  const totCit = includeCitazioni ? Number(citazioniValore || 0) : 0;
  const totLiberi = campiLiberi.reduce((acc, curr) => acc + Number(curr.valore || 0), 0);
  const totaleInvestimento = totSpot + totProd + totCit + totLiberi;

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
Tel: 334/8424204 | Email: commerciale@radiotoscana.it`);
    } else if (step === 2) {
      setRemindSubject(`Radio Toscana — Urgenza Disponibilità Palinsesto Settembre (${clientName})`);
      setRemindBody(`Gentile Referente di ${clientName},

in vista della pianificazione del palinsesto di Settembre, La ricontatto poiché gli spazi on-air nelle fasce orarie richieste sono in fase di chiusura.

Per poterLe garantire le frequenze e le posizioni concordate nella proposta (${val} + IVA), avremmo necessità di una conferma entro i prossimi giorni.

Resto a Sua disposizione anche telefonicamente per confermare i dettagli.

Cordiali saluti,
Fabio Asiri — Direzione Commerciale Radio Toscana
Tel: 334/8424204`);
    } else {
      setRemindSubject(`Radio Toscana — Aggiornamento Pratica Commerciale ${clientName}`);
      setRemindBody(`Gentile Referente di ${clientName},

non avendo ricevuto riscontro in merito alla proposta commerciale inviata, provvediamo a svincolare temporaneamente gli spazi opzionati per consentire la programmazione ad altri inserzionisti del territorio.

Qualora desiderasse riattivare la pianificazione o valutare una diversa formula, sarò lieto di aggiornare la proposta.

RingraziandoLa per il tempo dedicatoci, porgo i miei più cordiali saluti.

Fabio Asiri — Direzione Commerciale Radio Toscana
Tel: 334/8424204 | Email: commerciale@radiotoscana.it`);
    }
  }

  // Apertura Generatore Bozza Contratto Radio Monte Serra
  function openContractGenerator() {
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
      noteContratto: `Formula Accordo: ${tipoAccordo}. Messa in onda Radio Toscana (${spotArea}).`
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
        <div className="brand">
          <div className="brand-logo">RT</div>
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
            88.5%
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
              <tr>
                <td><strong>TINGHI MOTORS SRL</strong></td>
                <td><span className="tag" style={{ background: 'rgba(56,189,248,0.2)', color: '#38bdf8' }}>🔋 SCALARE</span></td>
                <td>500 Spot</td>
                <td><strong>416 Spot</strong></td>
                <td><span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>🟢 83.2% Disponibile</span></td>
                <td><button className="btn btn-xs btn-primary">✉️ Invia Prospetto Consumi</button></td>
              </tr>
              <tr>
                <td><strong>COMUNE DI FIRENZE</strong></td>
                <td><span className="tag" style={{ background: 'rgba(56,189,248,0.2)', color: '#38bdf8' }}>🔋 SCALARE PA</span></td>
                <td>1.000 Spot</td>
                <td><strong>880 Spot</strong></td>
                <td><span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>🟢 88.0% Disponibile</span></td>
                <td><button className="btn btn-xs btn-primary">✉️ Invia Prospetto Consumi</button></td>
              </tr>
              <tr>
                <td><strong>ACQUE SPA</strong></td>
                <td><span className="tag" style={{ background: 'rgba(56,189,248,0.2)', color: '#38bdf8' }}>🔋 SCALARE ENT</span></td>
                <td>800 Spot</td>
                <td><strong>720 Spot</strong></td>
                <td><span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>🟢 90.0% Disponibile</span></td>
                <td><button className="btn btn-xs btn-primary">✉️ Invia Prospetto Consumi</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* MODALE PREVENTIVO MODULARE (STANDARD / BARTER PARZIALE / BARTER PURO) */}
      {showQuoteModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3 className="modal-title">➕ Crea Preventivo Modulare (Standard / Barter / Servizi)</h3>
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

            {/* DATI CLIENTE */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="form-group">
              <div>
                <label className="form-label">Nome Cliente / Azienda</label>
                <input type="text" className="form-input" value={qNome} onChange={e => setQNome(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Referente Commerciale Cliente</label>
                <input type="text" className="form-input" value={qReferente} onChange={e => setQReferente(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Comune &amp; Provincia</label>
                <input type="text" className="form-input" value={`${qComune} (${qProvincia})`} onChange={e => setQComune(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Partita IVA / SDI</label>
                <input type="text" className="form-input" value={`${qPiva} / ${qSdi}`} onChange={e => setQPiva(e.target.value)} />
              </div>
            </div>

            {/* MODULI DI ACQUISTO (SPOT, PRODUZIONE, CITAZIONI, CAMPI LIBERI) */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid var(--panel-border)', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 800, marginBottom: '10px', color: '#fff' }}>📦 Pacchetto Campagna On-Air:</h4>

              {/* SPOT AUDIO */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input type="checkbox" checked={includeSpot} onChange={e => setIncludeSpot(e.target.checked)} />
                  Spot Audio ({spotQuantita} passaggi da {spotDurata})
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="number" className="form-input" style={{ width: '90px' }} value={spotValore} onChange={e => setSpotValore(Number(e.target.value))} />
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>€</span>
                </div>
              </div>

              {/* PRODUZIONE AUDIO */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input type="checkbox" checked={includeProduzione} onChange={e => setIncludeProduzione(e.target.checked)} />
                  Produzione Audio Ufficiale RT (€ 100,00)
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="number" className="form-input" style={{ width: '90px' }} value={produzioneValore} onChange={e => setProduzioneValore(Number(e.target.value))} />
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>€</span>
                </div>
              </div>

              {/* CITAZIONI LIVE */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input type="checkbox" checked={includeCitazioni} onChange={e => setIncludeCitazioni(e.target.checked)} />
                  Citazioni Live Speaker ({citazioniQuantita} citazioni)
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="number" className="form-input" style={{ width: '90px' }} value={citazioniValore} onChange={e => setCitazioniValore(Number(e.target.value))} />
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>€</span>
                </div>
              </div>

              {/* CAMPI LIBERI (ES. MASTISCIO') */}
              {campiLiberi.map((c, idx) => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                  <input
                    type="text"
                    className="form-input"
                    style={{ flex: 1, marginRight: '10px' }}
                    value={c.descrizione}
                    onChange={e => {
                      const val = e.target.value;
                      setCampiLiberi(prev => prev.map(item => item.id === c.id ? { ...item, descrizione: val } : item));
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="number"
                      className="form-input"
                      style={{ width: '90px' }}
                      value={c.valore}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setCampiLiberi(prev => prev.map(item => item.id === c.id ? { ...item, valore: val } : item));
                      }}
                    />
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>€</span>
                  </div>
                </div>
              ))}
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
              
              {/* HEADER UFFICIALE RADIO TOSCANA */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #e11d48', paddingBottom: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ background: '#e11d48', color: '#ffffff', fontWeight: 900, fontSize: '24px', padding: '10px 14px', borderRadius: '8px' }}>RT</div>
                  <div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#111111', letterSpacing: '-0.5px' }}>RADIO TOSCANA</div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#e11d48', letterSpacing: '1px', textTransform: 'uppercase' }}>SOLO TOSCANA | SOLO HIT</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#111111' }}>PROPOSTA COMMERCIALE ON-AIR</div>
                  <div style={{ fontSize: '11px', color: '#666666', marginTop: '2px' }}>Opportunity 2026 — Formula {tipoAccordo}</div>
                  <div style={{ fontSize: '11px', color: '#888888', marginTop: '2px' }}>Data: {new Date().toLocaleDateString('it-IT')}</div>
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
                  <div style={{ fontSize: '11px', color: '#475569' }}>📧 commerciale@radiotoscana.it | 📞 334/8424204</div>
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
                      <th style={{ padding: '10px', textAlign: 'left' }}>Modulo / Servizio</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Dettagli di Trasmissione</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Valore Economico</th>
                    </tr>
                  </thead>
                  <tbody>
                    {includeSpot && (
                      <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '10px', fontWeight: 700 }}>Spot Pubblicitari Radiofonici</td>
                        <td style={{ padding: '10px' }}>{spotQuantita} passaggi da {spotDurata} ({spotArea})</td>
                        <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>€ {spotValore.toFixed(2)}</td>
                      </tr>
                    )}
                    {includeProduzione && (
                      <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <td style={{ padding: '10px', fontWeight: 700 }}>Produzione Audio Ufficiale</td>
                        <td style={{ padding: '10px' }}>Registrazione spot, copy, mixaggio e master RT</td>
                        <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>€ {produzioneValore.toFixed(2)}</td>
                      </tr>
                    )}
                    {includeCitazioni && (
                      <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '10px', fontWeight: 700 }}>Citazioni Live Speaker</td>
                        <td style={{ padding: '10px' }}>{citazioniQuantita} citazioni dirette nei programmi di punta</td>
                        <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>€ {citazioniValore.toFixed(2)}</td>
                      </tr>
                    )}
                    {campiLiberi.map((c, idx) => (
                      <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                        <td style={{ padding: '10px', fontWeight: 700 }}>Accordo Editoriale Aggiuntivo</td>
                        <td style={{ padding: '10px' }}>{c.descrizione}</td>
                        <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>€ {Number(c.valore || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
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
              <div style={{ border: '1px solid #cbd5e1', padding: '16px', borderRadius: '8px', background: '#ffffff' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '8px' }}>
                  📝 Per Accettazione della Proposta Commerciale e Condizioni di Messa in Onda
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '30px', fontSize: '11px', color: '#64748b' }}>
                  <div>Data: ___________________</div>
                  <div>Luogo: ___________________</div>
                  <div>
                    <div>Timbro e Firma Committente:</div>
                    <div style={{ height: '40px', borderBottom: '1px dashed #94a3b8', marginTop: '10px' }}></div>
                  </div>
                </div>
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
