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
  referente?: string;
  email?: string;
  telefono?: string;
  piva?: string;
  sdi?: string;
  settore: string;
  comune: string;
  provincia: string;
  area_target: string;
  fase_commerciale: string;
  tipo_contratto?: 'SECCO' | 'SCALARE' | 'SPOT_TABELLARE' | 'BARTER';
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
  numero_preventivo?: string;
  numero_contratto?: string;
  stato_programmazione?: string;
  data_invio_programmazione?: string;
  anno_riferimento?: string;
  note?: string;
  quote_items?: QuoteLineItem[];
  tipo_accordo?: 'STANDARD' | 'BARTER_PARZIALE' | 'BARTER_PURO';
  barter_radio?: string;
  barter_ascoltatori?: string;
  data_preventivo?: string;
  data_ultimo_invio?: string;
  stato_produzione?: 'NON_RICHIESTA' | 'IN_ATTESA_COPY' | 'IN_STUDIO' | 'IN_ATTESA_AUDIO_TRELLO' | 'PRODOTTO_APPROVATO';
  data_scadenza_produzione?: string;
  copy_testo?: string;
  data_inizio_trasmissione?: string;
  data_fine_trasmissione?: string;
  spot_giornalieri?: number;
}

const INITIAL_LEADS_POOL: LeadRow[] = [
  {
    id: 'coldiretti-toscana-2026',
    nome_azienda_evento: 'Federazione Regionale Coldiretti Toscana',
    referente: 'ANDREA BERTI',
    email: 'toscana@coldiretti.it',
    telefono: '055 323651',
    piva: 'CF 80012150480',
    sdi: '',
    settore: 'Agricoltura / Istituzionale',
    comune: 'Firenze',
    provincia: 'FI',
    area_target: 'Radio Toscana Area 1 (FI - PO - PT)',
    fase_commerciale: 'CONTRATTO ATTIVO',
    tipo_contratto: 'SPOT_TABELLARE',
    valore_preventivo: 1000,
    valore_contratto: 1000,
    numero_preventivo: 'PREV-2026/001',
    numero_contratto: '2026/001-RMS',
    plafond_totale_spot: 180,
    spot_rimasti: 180,
    is_cambio_merce: false,
    probabilita_chiusura: 100,
    anno_riferimento: '2026',
    data_preventivo: '2026-09-04',
    data_ultimo_invio: '2026-09-11',
    tipo_accordo: 'STANDARD',
    stato_produzione: 'PRONTO_IN_ONDA',
    data_scadenza_produzione: '2026-09-10',
    copy_testo: 'Campagna "Villaggio Coldiretti" (File audio: S:\\Spot\\2026\\B VILLAGGIO COLDIRETTI.mp3 caricato in regia broadcast).',
    data_inizio_trasmissione: '2026-09-10',
    data_fine_trasmissione: '2026-09-17',
    spot_giornalieri: 22,
    stato_programmazione: 'IN_ONDA',
    quote_items: [
      {
        id: 'it-coldiretti-1',
        tipo: 'Spot Radiofonici Tabellari',
        copertura: 'Radio Toscana Area 1 (FI - PO - PT)',
        dettagli: '180 spot tabellari da 20" (22-23 spot/gg dal 10/09 al 17/09)',
        fascia: 'Fasce M, P, S (06.58 – 20.58 a rotazione)',
        periodo: 'Dal 10/09/2026 al 17/09/2026 (8 gg)',
        prezzoListino: 1620,
        valore: 831,
        isSpot: true,
        dataInizio: '2026-09-10',
        dataFine: '2026-09-17',
        spotGiornalieri: 22,
        giorniTotali: 8,
        spotTotali: 180,
        spotOmaggio: 0,
        formatoSecondi: 20
      },
      {
        id: 'it-coldiretti-2',
        tipo: 'Realizzazione Spot Audio',
        copertura: 'Diffusione Emittenti Toscana',
        dettagli: 'Realizzazione copy + Registrazione file B VILLAGGIO COLDIRETTI.mp3',
        fascia: 'Costo Una Tantum',
        periodo: '',
        prezzoListino: 169,
        valore: 169,
        tipoProduzione: 'DIRITTI_LIBERI_TOSCANA'
      }
    ],
    note: 'Commissione Radio Monte Serra S.r.l. n. 2026/001-RMS (Rif. Programmazione Regia n. 2023/14208) per la campagna "Villaggio Coldiretti". 180 spot Area 1 FIRENZE dal 10/09 al 17/09/2026. File in onda: S:\\Spot\\2026\\B VILLAGGIO COLDIRETTI.mp3. Totale netto: € 1.000,00 + IVA.'
  },
  {
    id: 'fivag-cisl-firenze-2026',
    nome_azienda_evento: 'FIVAG CISL FIRENZE',
    referente: 'Donatella Santini',
    email: 'donatella.caf@gmail.com',
    telefono: '055 285030',
    piva: 'CF 94233520488',
    sdi: '',
    settore: 'Associazioni di Categoria / Ambulanti',
    comune: 'Firenze',
    provincia: 'FI',
    area_target: 'Radio Toscana Area 1 + Bus ATAF Firenze',
    fase_commerciale: 'PREVENTIVO INVIATO',
    tipo_contratto: 'SPOT_TABELLARE',
    valore_preventivo: 2400,
    valore_contratto: 0,
    numero_preventivo: 'PREV-2026/002',
    numero_contratto: '',
    plafond_totale_spot: 100,
    spot_rimasti: 100,
    is_cambio_merce: false,
    probabilita_chiusura: 80,
    anno_riferimento: '2026',
    data_preventivo: '2026-09-11',
    data_ultimo_invio: '2026-09-11',
    tipo_accordo: 'STANDARD',
    stato_produzione: 'IN_ATTESA_COPY',
    data_scadenza_produzione: '2026-09-25',
    copy_testo: 'FIVAG CISL Firenze: valorizzazione e tutela del commercio ambulante su aree pubbliche (Spot audio 20" per Radio Toscana + Grafica Maxiside 190x220 per Bus ATAF).',
    data_inizio_trasmissione: '2026-10-06',
    data_fine_trasmissione: '2026-11-02',
    spot_giornalieri: 10,
    stato_programmazione: 'IN_ATTESA_CONFERMA',
    quote_items: [
      {
        id: 'it-fivag-1',
        tipo: 'Spot Radiofonici Tabellari',
        copertura: 'Radio Toscana Area 1 (FI - PO - PT)',
        dettagli: '10 spot/gg per 14 gg dal 19/10 al 01/11 (80 spot paganti + 20 OMAGGIO da 20")',
        fascia: 'Fasce M, P, S (07.00 – 21.00 a rotazione)',
        periodo: 'Dal 19/10/2026 al 01/11/2026 (14 gg)',
        prezzoListino: 900,
        valore: 350,
        isSpot: true,
        dataInizio: '2026-10-19',
        dataFine: '2026-11-01',
        spotGiornalieri: 10,
        giorniTotali: 14,
        spotTotali: 80,
        spotOmaggio: 20,
        formatoSecondi: 20
      },
      {
        id: 'it-fivag-2',
        tipo: 'Affissioni Dinamiche Bus ATAF',
        copertura: 'Comune di Firenze / Rete Urbana ATAF',
        dettagli: '3 Maxiside (formato 190x220 cm) su Bus ATAF Firenze per 4 settimane',
        fascia: 'Dinamica Urbana',
        periodo: 'Dal 06/10/2026 al 02/11/2026 (4 settimane)',
        prezzoListino: 2400,
        valore: 1850,
        isSpot: false
      },
      {
        id: 'it-fivag-3',
        tipo: 'Materiale Pubblicitario & Grafica',
        copertura: 'Produzione Radio Toscana + Grafica ATAF',
        dettagli: 'Realizzazione 1 spot audio 20" + Adattamento grafico per 1 Maxiside Bus (190x220)',
        fascia: 'Costo Una Tantum',
        periodo: 'Consegna entro 25/09/2026',
        prezzoListino: 200,
        valore: 200,
        tipoProduzione: 'SOLO_RT_RF'
      }
    ],
    note: 'Proposta Preventivo Rif. PREV-2026/002 per FIVAG CISL Firenze: campagna integrata Radio Toscana (100 spot Area 1) + 3 Maxiside Bus ATAF Firenze per 4 settimane + realizzazione spot audio e grafica (Totale € 2.400,00 + IVA). In fase di preventivo, contratto da formalizzare.'
  },
  {
    id: 'tinghi-motors-settembre-2026',
    nome_azienda_evento: 'TINGHI MOTORS SRL',
    referente: 'EVA SINOSINI',
    email: 'eva.sinosini@tinghimotors.it',
    telefono: '0571 944444',
    piva: '00918250481',
    sdi: '0RBL7JD',
    settore: 'Automotive / Concessionaria Renault Dacia',
    comune: 'Empoli',
    provincia: 'FI',
    area_target: 'Radio Toscana Area 1 (FI - PO - PT)',
    fase_commerciale: 'CONTRATTO ATTIVO',
    tipo_contratto: 'SPOT_TABELLARE',
    valore_preventivo: 375,
    valore_contratto: 375,
    numero_contratto: '2026/09-TINGHI',
    plafond_totale_spot: 72,
    spot_rimasti: 72,
    is_cambio_merce: false,
    probabilita_chiusura: 100,
    anno_riferimento: '2026',
    data_preventivo: '2026-09-11',
    data_ultimo_invio: '2026-09-11',
    tipo_accordo: 'STANDARD',
    stato_produzione: 'PRONTO_IN_ONDA',
    data_scadenza_produzione: '2026-09-07',
    copy_testo: 'Promozione Tinghi Motors Concessionaria Ufficiale Renault e Dacia Empoli (Spot 20" rotazione M, P, S).',
    data_inizio_trasmissione: '2026-09-07',
    data_fine_trasmissione: '2026-09-18',
    spot_giornalieri: 6,
    stato_programmazione: 'IN_ONDA',
    quote_items: [
      {
        id: 'it-tinghi-1',
        tipo: 'Spot Radiofonici Tabellari',
        copertura: 'Radio Toscana Area 1 (FI - PO - PT)',
        dettagli: '6 spot/gg per 12 gg dal 07/09 al 18/09 (72 spot da 20")',
        fascia: 'Fasce M, P, S (07.00 – 21.00 a rotazione)',
        periodo: 'Dal 07/09/2026 al 18/09/2026 (12 gg)',
        prezzoListino: 648,
        valore: 375,
        isSpot: true,
        dataInizio: '2026-09-07',
        dataFine: '2026-09-18',
        spotGiornalieri: 6,
        giorniTotali: 12,
        spotTotali: 72,
        spotOmaggio: 0,
        formatoSecondi: 20
      }
    ],
    note: 'Commissione Radio Monte Serra S.r.l. sottoscritta l\'11/09/2026 da Asiri Fabio per TINGHI MOTORS SRL. Campagna Radio Toscana Area 1 (72 spot da 20", 6 spot/gg dal 07/09 al 18/09/2026, rotazione M, P, S). Totale netto spazi € 375,00 + IVA. Bonifico 60 gg DF. Cod. Destinatario: 0RBL7JD.'
  }
];

export default function LeadEngineDashboard() {
  const [activeTab, setActiveTab] = useState<'kanban' | 'queues' | 'renewals' | 'memory' | 'production' | 'schedules'>('kanban');
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [selectedYear, setSelectedYear] = useState<'2026' | '2025' | '2024' | 'ALL'>('2026');

  // Modali Preventivo, Proposta A4, Contratto, Remind e Invio Email
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedLeadForEmail, setSelectedLeadForEmail] = useState<LeadRow | null>(null);

  // Modale Email Proposta Commerciale Dedicata
  const [showProposalEmailModal, setShowProposalEmailModal] = useState(false);
  const [selectedLeadForProposalEmail, setSelectedLeadForProposalEmail] = useState<LeadRow | null>(null);
  const [proposalEmailRecipient, setProposalEmailRecipient] = useState('');
  const [proposalEmailCc, setProposalEmailCc] = useState('amministrazione@radiotoscana.it');
  const [proposalEmailSubject, setProposalEmailSubject] = useState('');
  const [proposalEmailBody, setProposalEmailBody] = useState('');
  const [proposalEmailSentNotification, setProposalEmailSentNotification] = useState(false);

  // Modale Invio Email Contratto con Allegato PDF & CC Amministrazione
  const [showContractEmailModal, setShowContractEmailModal] = useState(false);
  const [contractEmailRecipient, setContractEmailRecipient] = useState('');
  const [contractEmailCc, setContractEmailCc] = useState('amministrazione@radiotoscana.it');
  const [contractEmailSubject, setContractEmailSubject] = useState('');
  const [contractEmailBody, setContractEmailBody] = useState('');

  // Modale Generatore Scheda Trello Ufficiale & WhatsApp Push
  const [showTrelloDispatchModal, setShowTrelloDispatchModal] = useState(false);
  const [selectedLeadForTrello, setSelectedLeadForTrello] = useState<LeadRow | null>(null);
  const [trelloBoardUrl, setTrelloBoardUrl] = useState('https://trello.com/b/7JoUM2H9/radio-toscana-copy-spot');
  const [isCreatingTrelloCard, setIsCreatingTrelloCard] = useState(false);
  const [createdTrelloCardUrl, setCreatedTrelloCardUrl] = useState<string | null>(null);
  const [trelloCardTitle, setTrelloCardTitle] = useState('');
  const [trelloCardDueDate, setTrelloCardDueDate] = useState('');
  const [trelloCardDescription, setTrelloCardDescription] = useState('');
  const [trelloWaMessage, setTrelloWaMessage] = useState('');

  // Stato Modifica Preventivo Esistente (Edit in Place)
  const [editingLeadId, setEditingLeadId] = useState<string | number | null>(null);

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
      fascia: 'Costo Una Tantum',
      periodo: '',
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
          fascia: 'Costo Una Tantum',
          periodo: '',
          prezzoListino: 100,
          valore: 100
        };
      } else {
        return {
          ...it,
          tipoProduzione: 'DIRITTI_LIBERI_TOSCANA',
          tipo: 'Realizzazione Spot Audio (Diritti Liberi)',
          copertura: 'Diffusione Emittenti Toscana',
          dettagli: 'Realizzazione copy + Registrazione in studio + Diritti di diffusione per emittenti toscane',
          fascia: 'Costo Una Tantum',
          periodo: '',
          prezzoListino: 169,
          valore: 169
        };
      }
    }));
  }

  function handlePrintProposal() {
    if (typeof document !== 'undefined') {
      document.body.classList.add('printing-proposal');
      document.body.classList.remove('printing-contract');
    }
    const sanitizedClient = (qNome || 'Cliente').trim().replace(/[/\\?%*:|"<>]/g, '_');
    const dateStr = new Date().toLocaleDateString('it-IT').replace(/\//g, '-');
    const originalTitle = document.title;

    // Assegna il nome file corretto per il salvataggio PDF: "Preventivo - [Cliente] - [Data]"
    document.title = `Preventivo - ${sanitizedClient} - ${dateStr}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
      if (typeof document !== 'undefined') {
        document.body.classList.remove('printing-proposal');
      }
    }, 1500);
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
          fascia: 'Costo Una Tantum',
          periodo: '',
          prezzoListino: 100,
          valore: 100,
          tipoProduzione: 'SOLO_RT_RF'
        }
      ]);
    }
  }

  // Stato Modale Contratto: Distinzione se è già attivo (confermato) o ancora da attivare
  const [isContractAlreadyActive, setIsContractAlreadyActive] = useState(false);
  const [currentQuoteNumber, setCurrentQuoteNumber] = useState('PREV-2026/001');

  // Helper Generazione Numerazione Progressiva Reale Preventivi (es. PREV-2026/001)
  function getNextQuoteNumber(currentLeads: LeadRow[]): string {
    let maxNum = 0;
    for (const l of currentLeads) {
      if (l.numero_preventivo) {
        const m = l.numero_preventivo.match(/PREV-2026\/(\d+)/i);
        if (m) {
          const n = parseInt(m[1], 10);
          if (n > maxNum) maxNum = n;
        }
      }
    }
    return `PREV-2026/${String(maxNum + 1).padStart(3, '0')}`;
  }

  // Helper Generazione Numerazione Progressiva Reale Contratti RMS (es. 2026/001-RMS)
  function getNextContractNumber(currentLeads: LeadRow[]): string {
    let maxNum = 0;
    for (const l of currentLeads) {
      if (l.numero_contratto) {
        const m = l.numero_contratto.match(/2026\/(\d+)-RMS/i);
        if (m) {
          const n = parseInt(m[1], 10);
          if (n > maxNum) maxNum = n;
        }
      }
    }
    return `2026/${String(maxNum + 1).padStart(3, '0')}-RMS`;
  }

  // Bozza Contratto Monte Serra State
  const [contractData, setContractData] = useState({
    numero: '2026/001-RMS',
    dataDecorrenza: '',
    dataScadenza: '',
    committente: '',
    referente: '',
    piva: '',
    sdi: '',
    indirizzo: '',
    telefono: '',
    email: '',
    mezzo: 'Radio Toscana',
    formato: '20"',
    quantitaSpot: 0,
    area: 'RT Rete (Tutta la Toscana)',
    prezzoSpazi: 0,
    prezzoProduzione: 0,
    totaleNetto: 0,
    totaleBarter: 0,
    modalitaPagamento: 'Bonifico bancario 30gg d.f. f.m.',
    noteContratto: '',
    bancaAppoggio: '',
    iban: ''
  });

  const STORAGE_KEY = 'rt_lead_engine_leads_v4';

  // Helper Persistenza Reale (Cloud Supabase + LocalStorage + Memoria)
  function updateLeadsAndPersist(updater: (prev: LeadRow[]) => LeadRow[]) {
    setLeads(prev => {
      const next = updater(prev);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          // Sincronizza istantaneamente in background con Supabase Cloud
          fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leads: next })
          }).catch(err => console.error('Cloud Supabase sync error:', err));
        } catch (e) {
          console.error('LocalStorage write error', e);
        }
      }
      return next;
    });
  }

  // Caricamento Dati Iniziali: Cloud Supabase con Fallback su LocalStorage
  useEffect(() => {
    async function loadData() {
      // 1. Carica subito da cache locale per visualizzazione istantanea
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const existingIds = new Set(parsed.map((l: any) => l.id));
              const merged = [...parsed];
              for (const initLead of INITIAL_LEADS_POOL) {
                if (!existingIds.has(initLead.id)) {
                  merged.push(initLead);
                }
              }
              setLeads(merged);
            }
          }
        } catch (e) {}
      }

      // 2. Sincronizzazione in tempo reale dal Cloud Supabase (Centralizzato)
      try {
        const res = await fetch('/api/leads');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.leads) && json.leads.length > 0) {
            const existingIds = new Set(json.leads.map((l: any) => l.id));
            const merged = [...json.leads];
            let needsSync = false;
            for (const initLead of INITIAL_LEADS_POOL) {
              if (!existingIds.has(initLead.id)) {
                merged.push(initLead);
                needsSync = true;
              }
            }
            setLeads(merged);
            if (typeof window !== 'undefined') {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            }
            if (needsSync) {
              fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leads: merged })
              }).catch(() => {});
            }
            return;
          }
        }
      } catch (err) {
        console.log('Supabase cloud fetch fallback:', err);
      }

      // 3. Fallback se DB vuoto: inizializza con pool ufficiale
      setLeads(INITIAL_LEADS_POOL);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADS_POOL));
        } catch (e) {}
      }
    }

    loadData();
  }, []);

  // Calcolo Totali Preventivo Modulare Dinamico
  const totaleInvestimento = quoteItems.reduce((acc, curr) => acc + Number(curr.valore || 0), 0);
  const totaleListino = quoteItems.reduce((acc, curr) => acc + Number(curr.prezzoListino || curr.valore || 0), 0);
  const scontoApplicato = Math.max(0, totaleListino - totaleInvestimento);

  // Stampa / Salva in PDF Contratto Ufficiale RMS (Bifacciale 2 Pagine)
  function handlePrintContract() {
    if (typeof document !== 'undefined') {
      document.body.classList.add('printing-contract');
      document.body.classList.remove('printing-proposal');
    }
    const sanitizedClient = (contractData.committente || 'Cliente').trim().replace(/[/\\?%*:|"<>]/g, '_');
    const dateStr = new Date().toLocaleDateString('it-IT').replace(/\//g, '-');
    const originalTitle = document.title;
    document.title = `Contratto RMS - ${sanitizedClient} - ${dateStr}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
      if (typeof document !== 'undefined') {
        document.body.classList.remove('printing-contract');
      }
    }, 1500);
  }

  // Ripulisci e azzera il preventivatore per nuova trattativa
  function resetQuoteBuilder() {
    setEditingLeadId(null);
    setQNome('');
    setQReferente('');
    setQTelefono('');
    setQEmail('');
    setQComune('');
    setQProvincia('');
    setQPiva('');
    setQSdi('');
    setSelectedHistory(null);
    setTipoAccordo('STANDARD');
    setBarterRadio('');
    setBarterAscoltatori('');
    setQuoteItems([
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
        dettagli: 'Realizzazione copy + Registrazione in studio + Diritti di diffusione per emittenti toscane',
        fascia: 'Costo Una Tantum',
        periodo: '',
        prezzoListino: 100,
        valore: 100,
        tipoProduzione: 'SOLO_RT_RF'
      }
    ]);
  }

  // Salva o Aggiorna Preventivo nella colonna PREVENTIVI IN TRATTATIVA della Dashboard
  function saveAsQuoteInNegotiation() {
    if (!qNome.trim()) {
      alert('Inserisci almeno il Nome Azienda / Cliente prima di salvare il preventivo.');
      return;
    }
    const clientName = qNome.trim();
    const mainSpot = quoteItems.find(it => it.isSpot) || quoteItems[0];
    const hasProd = quoteItems.some(it => !it.isSpot || it.tipoProduzione);
    const prodItem = quoteItems.find(it => !it.isSpot || it.tipoProduzione);

    const updatedLeadData: Partial<LeadRow> = {
      nome_azienda_evento: clientName,
      referente: qReferente,
      email: qEmail,
      telefono: qTelefono,
      comune: qComune,
      provincia: qProvincia,
      piva: qPiva,
      sdi: qSdi,
      fase_commerciale: 'PREVENTIVO INVIATO',
      valore_preventivo: totaleInvestimento,
      area_target: mainSpot?.copertura || quoteItems[0]?.copertura || 'Toscana',
      plafond_totale_spot: mainSpot?.spotTotali || 0,
      spot_rimasti: mainSpot?.spotTotali || 0,
      anno_riferimento: '2026',
      probabilita_chiusura: 70,
      tipo_accordo: tipoAccordo,
      barter_radio: barterRadio,
      barter_ascoltatori: barterAscoltatori,
      quote_items: [...quoteItems],
      data_preventivo: new Date().toISOString().split('T')[0],
      data_inizio_trasmissione: mainSpot?.dataInizio,
      data_fine_trasmissione: mainSpot?.dataFine,
      spot_giornalieri: mainSpot?.spotGiornalieri,
      tipo_produzione_spot: prodItem ? (prodItem.tipoProduzione || 'SOLO_RT_RF') : undefined,
      stato_produzione: hasProd ? 'IN_ATTESA_COPY' : 'NON_RICHIESTA',
      data_scadenza_produzione: hasProd ? new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0] : undefined,
      note: `Proposta commerciale emessa il ${new Date().toLocaleDateString('it-IT')} per € ${totaleInvestimento.toLocaleString('it-IT')}. Formula: ${tipoAccordo}. Voci: ${quoteItems.length}.`
    };

    updateLeadsAndPersist(prev => {
      const existingLead = editingLeadId ? prev.find(l => l.id === editingLeadId) : null;
      const assignedQuoteNum = existingLead?.numero_preventivo || currentQuoteNumber || getNextQuoteNumber(prev);
      setCurrentQuoteNumber(assignedQuoteNum);

      if (editingLeadId) {
        // Aggiorna lead esistente in-place
        return prev.map(l => {
          if (l.id === editingLeadId) {
            return { ...l, ...updatedLeadData, numero_preventivo: assignedQuoteNum };
          }
          return l;
        });
      } else {
        // Crea nuovo lead
        const newLead: LeadRow = {
          id: `quote-${Date.now()}`,
          settore: 'B2B / Servizi',
          valore_contratto: 0,
          is_cambio_merce: tipoAccordo !== 'STANDARD',
          ...updatedLeadData,
          numero_preventivo: assignedQuoteNum
        } as LeadRow;
        return [newLead, ...prev.filter(l => l.nome_azienda_evento.toLowerCase() !== clientName.toLowerCase())];
      }
    });

    setShowQuoteModal(false);
    alert(`✅ Preventivo per "${clientName}" (€ ${totaleInvestimento.toLocaleString('it-IT')}) salvato con successo in "PREVENTIVI IN TRATTATIVA"!`);
  }

  // Funzione Modifica Preventivo Esistente (Edit in Place con Autocompilazione Totale)
  function openEditQuoteModal(lead: LeadRow) {
    setEditingLeadId(lead.id || null);
    setQNome(lead.nome_azienda_evento || '');
    setQReferente(lead.referente || '');
    setQTelefono(lead.telefono || '');
    setQEmail(lead.email || '');
    setQComune(lead.comune || '');
    setQProvincia(lead.provincia || '');
    setQPiva(lead.piva || '');
    setQSdi(lead.sdi || '');
    setTipoAccordo(lead.tipo_accordo || 'STANDARD');
    if (lead.barter_radio) setBarterRadio(lead.barter_radio);
    if (lead.barter_ascoltatori) setBarterAscoltatori(lead.barter_ascoltatori);

    setCurrentQuoteNumber(lead.numero_preventivo || getNextQuoteNumber(leads));

    if (lead.quote_items && lead.quote_items.length > 0) {
      setQuoteItems([...lead.quote_items]);
    } else {
      // Ricostruzione elementi se non presenti
      setQuoteItems([
        {
          id: `edit-${Date.now()}-1`,
          tipo: 'Spot Radiofonici Tabellari',
          copertura: lead.area_target || 'Radio Toscana Rete',
          dettagli: `${lead.plafond_totale_spot || 140} spot pianificati da 20"`,
          fascia: '07.00 – 21.00 a rotazione',
          periodo: lead.data_inizio_trasmissione && lead.data_fine_trasmissione
            ? `Dal ${lead.data_inizio_trasmissione} al ${lead.data_fine_trasmissione}`
            : 'Pianificazione concordata',
          prezzoListino: Math.round((lead.valore_preventivo || 1000) * 1.3),
          valore: lead.valore_preventivo || 1000,
          isSpot: true,
          spotTotali: lead.plafond_totale_spot || 140,
          formatoSecondi: 20
        }
      ]);
    }
    setShowQuoteModal(true);
  }

  // Visualizza Proposta A4 Direttamente dal Lead Kanban
  function openProposalA4ForLead(lead: LeadRow) {
    openEditQuoteModal(lead);
    setShowPdfModal(true);
  }

  // Passa Direttamente a Contratto RMS dal Lead Kanban
  function openContractForLead(lead: LeadRow) {
    openEditQuoteModal(lead);
    const items = lead.quote_items && lead.quote_items.length > 0 ? lead.quote_items : quoteItems;
    const mainSpot = items.find(it => it.isSpot) || items[0];
    const summaryItems = items.map(it => `${it.tipo} [${it.copertura}] - ${it.dettagli} (Valore: €${it.valore})`).join(' | ');
    const spacesPrice = items.filter(i => i.isSpot).reduce((s, i) => s + (i.valore || 0), 0);
    const prodPrice = items.filter(i => !i.isSpot).reduce((s, i) => s + (i.valore || 0), 0);
    const totalVal = lead.valore_preventivo || items.reduce((s, i) => s + (i.valore || 0), 0);

    const mezzoVal = (mainSpot?.copertura || lead.area_target || '').includes('Firenze') && !(mainSpot?.copertura || lead.area_target || '').includes('Toscana')
      ? 'Radio Firenze 88.7'
      : ((mainSpot?.copertura || lead.area_target || '').includes('Combinata') ? 'Radio Toscana + Radio Firenze' : 'Radio Toscana');

    const contractNum = lead.numero_contratto || getNextContractNumber(leads);

    setContractData({
      numero: contractNum,
      dataDecorrenza: mainSpot?.dataInizio || lead.data_inizio_trasmissione || '2026-09-15',
      dataScadenza: mainSpot?.dataFine || lead.data_fine_trasmissione || '2026-09-28',
      committente: lead.nome_azienda_evento,
      referente: lead.referente || 'Referente Aziendale',
      piva: lead.piva || '',
      sdi: lead.sdi || '',
      indirizzo: [lead.comune, lead.provincia ? `(${lead.provincia})` : ''].filter(Boolean).join(' ') || 'Toscana',
      telefono: lead.telefono || '',
      email: lead.email || '',
      mezzo: mezzoVal,
      formato: `${mainSpot?.formatoSecondi || 20}"`,
      quantitaSpot: mainSpot?.spotTotali || lead.plafond_totale_spot || 0,
      area: mainSpot?.copertura || lead.area_target || 'RT Rete (Tutta la Toscana)',
      prezzoSpazi: spacesPrice,
      prezzoProduzione: prodPrice,
      totaleNetto: totalVal,
      totaleBarter: lead.tipo_accordo === 'STANDARD' ? 0 : Math.round(totalVal / 2),
      modalitaPagamento: lead.tipo_accordo === 'BARTER_PURO' ? '100% Cambio Merce / Barter' : 'Bonifico bancario 30gg d.f. f.m.',
      noteContratto: `Formula Accordo: ${lead.tipo_accordo || 'STANDARD'}. ${summaryItems}`,
      bancaAppoggio: '',
      iban: ''
    });
    setIsContractAlreadyActive(lead.fase_commerciale === 'CONTRATTO ATTIVO');
    setShowContractModal(true);
  }

  // Apertura Modale Invio Email Contratto con CC Amministrazione & Allegato PDF
  function openContractEmailModal() {
    const comm = contractData.committente || qNome || 'Cliente';
    const ref = contractData.referente || qReferente || 'Referente';
    const emailTo = contractData.email || qEmail || 'toscana@coldiretti.it';
    const num = contractData.numero;

    setContractEmailRecipient(emailTo);
    setContractEmailCc('amministrazione@radiotoscana.it');
    setContractEmailSubject(`Radio Toscana (Radio Monte Serra S.r.l.) — Trasmissione Contratto Pubblicitario n. ${num} per ${comm}`);

    const body = `Gentile ${ref} / Spett.le ${comm},

in riferimento agli accordi commerciali intercorsi per la campagna on-air su Radio Toscana (Radio Monte Serra S.r.l.), Le trasmettiamo in allegato la Commissione Pubblicitaria ufficiale n. ${num}.

📋 RIEPILOGO ESTREMI DELLA CAMPAGNA PUBBLICITARIA:
• Committente: ${comm}
• Mezzo: ${contractData.mezzo} (${contractData.area})
• Quantità Spot: ${contractData.quantitaSpot} passaggi da ${contractData.formato}
• Periodo di Trasmissione: Dal ${contractData.dataDecorrenza} al ${contractData.dataScadenza}
• Tariffa Spazi Pubblicitari: € ${contractData.prezzoSpazi.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
${contractData.prezzoProduzione > 0 ? `• Quota Produzione Spot (Diritti Liberi): € ${contractData.prezzoProduzione.toLocaleString('it-IT', { minimumFractionDigits: 2 })}\n` : ''}• TOTALE NETTO DI CAMPAGNA: € ${contractData.totaleNetto.toLocaleString('it-IT', { minimumFractionDigits: 2 })} + IVA
• Modalità di Pagamento: ${contractData.modalitaPagamento}

📌 ISTRUZIONI PER IL PERFEZIONAMENTO:
Si prega cortesemente di:
1. Stampare e restituire la presente commissione timbrata e siglata per accettazione in calce;
2. Confermare il Codice Destinatario SDI e indirizzo PEC per l'emissione della relativa fattura elettronica.

La presente comunicazione è trasmessa in copia conoscenza alla nostra Direzione Amministrativa (amministrazione@radiotoscana.it) per l'apertura della posizione contabile e la corretta registrazione fiscale.

Restiamo a completa disposizione per qualsiasi chiarimento operativo e per la ricezione del materiale audio per la messa in onda.

Cordiali saluti,

Fabio Asiri — Direzione Commerciale Radio Toscana
Radio Monte Serra S.r.l. • Via de' Pucci, 2 • 50122 Firenze
Cell: 347 6818595 • Email: commerciale@radiotoscana.it`;

    setContractEmailBody(body);
    setShowContractEmailModal(true);
  }

  // Apertura Modale Invio Email Proposta Commerciale
  function openProposalEmailModal(lead: LeadRow) {
    setSelectedLeadForProposalEmail(lead);
    setProposalEmailRecipient(lead.email || 'commerciale@radiotoscana.it');
    setProposalEmailCc('amministrazione@radiotoscana.it');
    const rif = `RT-2026/09-${new Date().getDate().toString().padStart(2, '0')}`;
    setProposalEmailSubject(`Radio Toscana — Proposta Commerciale per ${lead.nome_azienda_evento} (Rif. ${rif})`);

    const items = lead.quote_items && lead.quote_items.length > 0 ? lead.quote_items : quoteItems;
    const itemsSummary = items.map(i => `• ${i.tipo}: ${i.copertura} (${i.dettagli}) — Netto € ${i.valore}`).join('\n');
    const tot = lead.valore_preventivo || items.reduce((s, i) => s + (i.valore || 0), 0);

    setProposalEmailBody(`Gentile ${lead.referente || lead.nome_azienda_evento},

in riferimento ai nostri accordi commerciali, Le trasmetto la Proposta Commerciale ufficiale per la campagna di comunicazione on-air su Radio Toscana (Radio Monte Serra S.r.l.).

📌 PIANO DI COMUNICAZIONE & SPECIFICHE DELLA CAMPAGNA:
${itemsSummary}

💰 TOTALE INVESTIMENTO COMMERCIALE NETTO: € ${tot.toLocaleString('it-IT', { minimumFractionDigits: 2 })} + IVA
• Formula Contrattuale: ${lead.tipo_accordo || 'Standard (100% Fatturato)'}
• Pagamento: Bonifico Bancario 30 gg fine mese d.f.
• Messa in onda: Condizionata alla restituzione della proposta siglata per accettazione e alla fornitura del materiale audio.

In allegato a questa email Le trasmetto il documento ufficiale in formato PDF pronto per la visione e la firma.

Resto a Sua completa disposizione per qualsiasi chiarimento operativo o per calibrare gli orari di programmazione.

Un cordiale saluto,

Fabio Asiri — Direzione Commerciale
Radio Toscana • Radio Firenze (Radio Monte Serra S.r.l.)
Tel. 347 6818595 | commerciale@radiotoscana.it
Via de' Pucci 2, 50122 Firenze`);

    setProposalEmailSentNotification(false);
    setShowProposalEmailModal(true);
  }

  // Inoltra Incarico alla Tab Produzione Spot Audio
  function sendLeadToProduction(lead: LeadRow) {
    const hasProd = lead.quote_items?.some(it => !it.isSpot || it.tipoProduzione) || true;
    updateLeadsAndPersist(prev => prev.map(l => {
      if (l.id === lead.id) {
        return {
          ...l,
          stato_produzione: 'IN_ATTESA_COPY',
          data_scadenza_produzione: l.data_scadenza_produzione || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0]
        };
      }
      return l;
    }));
    setActiveTab('production');
    alert(`🎙️ Incarico di Produzione Spot Audio attivato per "${lead.nome_azienda_evento}"!\n• SLA di Consegna: 7 Giorni (Scadenza: ${new Date(Date.now() + 7 * 24 * 3600 * 1000).toLocaleDateString('it-IT')})\n• Trasferito nella scheda Produzione Spot.`);
  }

  // Inoltra alla Tab Programmazione On-Air
  function sendLeadToSchedule(lead: LeadRow) {
    updateLeadsAndPersist(prev => prev.map(l => {
      if (l.id === lead.id) {
        return {
          ...l,
          stato_programmazione: 'IN_PALINSESTO'
        };
      }
      return l;
    }));
    setActiveTab('schedules');
    alert(`📅 Campagna per "${lead.nome_azienda_evento}" registrata nel Palinsesto di Programmazione On-Air!`);
  }

  // Apertura Modale Generatore Scheda Trello & Notifica WhatsApp
  function openTrelloDispatchModal(lead: LeadRow) {
    setSelectedLeadForTrello(lead);
    setCreatedTrelloCardUrl(null);
    const startDate = lead.data_inizio_trasmissione || '2026-09-15';
    const d = new Date(startDate);
    const dueDateObj = isNaN(d.getTime()) ? new Date(Date.now() + 5 * 24 * 3600 * 1000) : new Date(d.getTime() - 2 * 24 * 3600 * 1000);
    const dueDateStr = dueDateObj.toISOString().split('T')[0];

    const isDiritti = lead.tipo_produzione_spot === 'DIRITTI_LIBERI_TOSCANA' || lead.quote_items?.some(it => it.tipoProduzione === 'DIRITTI_LIBERI_TOSCANA');
    const dirittiTxt = isDiritti ? 'Diritti Liberi Toscana (169€)' : 'Solo RT+RF (100€)';

    const title = `[RT] ${lead.nome_azienda_evento} — Spot 20" (On-Air: ${startDate})`;
    setTrelloCardTitle(title);
    setTrelloCardDueDate(`${dueDateStr} (Ore 18:00)`);

    const desc = `### 📻 COMMESSA SPOT AUDIO — RADIO TOSCANA / RADIO FIRENZE

**COMMITTENTE:** ${lead.nome_azienda_evento}
**REFERENTE DA CONTATTARE:** ${lead.referente || 'Da verificare'}
**TELEFONO:** ${lead.telefono || '—'}
**EMAIL:** ${lead.email || '—'}
**LOCALITÀ:** ${lead.comune} (${lead.provincia})

---
### 🗓️ PIANIFICAZIONE & SPECIFICHE
* **Periodo Messa in Onda:** Dal ${startDate} al ${lead.data_fine_trasmissione || 'fine campagna'} (${lead.spot_giornalieri || 10} spot/gg)
* **Formato:** 20 Secondi (ca. 40-45 parole parlate)
* **Tipologia Diritti:** ${dirittiTxt}
* **Data Limite Consegna Audio:** **${dueDateStr} entro le ore 18:00** (Tassativa per caricamento in regia broadcast 48h prima)

---
### 📋 CHECKLIST DI LAVORAZIONE
- [ ] Contattare referente per intervista / briefing promozionale
- [ ] Stesura testo copy 20"
- [ ] Approvazione testo scritta dal cliente (email o WhatsApp)
- [ ] Registrazione voce speaker & mastering audio broadcast
- [ ] Allegare Master Audio definitivo (WAV/MP3) a questa scheda Trello`;

    setTrelloCardDescription(desc);

    const waMsg = `Ciao Edi! Ti ho caricato su Trello la nuova commessa spot per *${lead.nome_azienda_evento}* (On-Air dal ${startDate}).
Trovi tutti i dettagli nella bacheca: https://trello.com/b/7JoUM2H9/radio-toscana-copy-spot
Consegna file audio richiesta entro il ${dueDateObj.toLocaleDateString('it-IT')}.
Grazie e buon lavoro!`;
    setTrelloWaMessage(waMsg);

    setShowTrelloDispatchModal(true);
  }

  // Creazione Automatica Card su Trello via API
  async function handleAutoCreateTrelloCard() {
    if (!selectedLeadForTrello) return;
    setIsCreatingTrelloCard(true);
    try {
      const res = await fetch('/api/trello/create-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: trelloCardTitle,
          description: trelloCardDescription,
          dueDate: trelloCardDueDate.split(' ')[0],
          leadId: selectedLeadForTrello.id
        })
      });
      const data = await res.json();
      if (data.success) {
        setCreatedTrelloCardUrl(data.cardUrl);
        updateLeadsAndPersist(prev => prev.map(l => {
          if (l.id === selectedLeadForTrello.id) {
            return {
              ...l,
              stato_produzione: 'IN_ATTESA_AUDIO_TRELLO',
              data_scadenza_produzione: trelloCardDueDate.split(' ')[0]
            };
          }
          return l;
        }));
        const updatedWaMsg = `Ciao Edi! Ti ho caricato su Trello la nuova commessa spot per *${selectedLeadForTrello.nome_azienda_evento}*.\nEcco la scheda diretta: ${data.cardUrl}\nConsegna file audio richiesta entro il ${trelloCardDueDate}.\nGrazie e buon lavoro!`;
        setTrelloWaMessage(updatedWaMsg);
        alert(`🎉 CARD CREATA CON SUCCESSO SU TRELLO!\n\nLa scheda è atterrata nella colonna "Da Fare" di Edi con la checklist completa.`);
      } else {
        alert(`⚠️ Errore creazione Trello: ${data.error || 'Verifica connessione'}`);
      }
    } catch (err: any) {
      alert(`⚠️ Errore creazione Trello: ${err.message}`);
    } finally {
      setIsCreatingTrelloCard(false);
    }
  }

  // Conferma invio scheda a Trello
  function markAsDispatchedToTrello() {
    if (!selectedLeadForTrello) return;
    updateLeadsAndPersist(prev => prev.map(l => {
      if (l.id === selectedLeadForTrello.id) {
        return {
          ...l,
          stato_produzione: 'IN_ATTESA_AUDIO_TRELLO',
          data_scadenza_produzione: trelloCardDueDate.split(' ')[0]
        };
      }
      return l;
    }));
    setShowTrelloDispatchModal(false);
    alert(`📋 Scheda per "${selectedLeadForTrello.nome_azienda_evento}" registrata per Trello!\nStato aggiornato a: 🟡 In Lavorazione Esterna (In attesa audio).`);
  }

  // Ricezione File Audio Finito e Sblocco Regia
  function markAudioReceivedInRegia(lead: LeadRow) {
    updateLeadsAndPersist(prev => prev.map(l => {
      if (l.id === lead.id) {
        return {
          ...l,
          stato_produzione: 'PRODOTTO_APPROVATO',
          stato_programmazione: 'IN_PALINSESTO'
        };
      }
      return l;
    }));
    alert(`🎉 File Audio Ricevuto per "${lead.nome_azienda_evento}"!\n• Sbloccato per la Regia Broadcast On-Air\n• Semaforo verde 🟢 assegnato nel Palinsesto.`);
  }

  // Conferma & Attiva Contratto: Passa a CONTRATTO ATTIVO e ripulisce il preventivatore
  function confirmAndActivateContract() {
    const clientName = contractData.committente.trim() || 'Nuovo Cliente Contratto';
    const newContractLead: LeadRow = {
      id: editingLeadId || `contract-${Date.now()}`,
      nome_azienda_evento: clientName,
      referente: contractData.referente,
      email: contractData.email || qEmail,
      telefono: contractData.telefono || qTelefono,
      comune: qComune,
      provincia: qProvincia,
      piva: contractData.piva,
      sdi: contractData.sdi,
      fase_commerciale: 'CONTRATTO ATTIVO',
      tipo_contratto: tipoAccordo === 'STANDARD' ? 'SPOT_TABELLARE' : 'BARTER',
      valore_contratto: contractData.totaleNetto,
      valore_preventivo: contractData.totaleNetto,
      numero_contratto: contractData.numero,
      area_target: contractData.area || 'Toscana',
      plafond_totale_spot: contractData.quantitaSpot || 0,
      spot_rimasti: contractData.quantitaSpot || 0,
      anno_riferimento: '2026',
      probabilita_chiusura: 100,
      quote_items: [...quoteItems],
      data_inizio_trasmissione: contractData.dataDecorrenza,
      data_fine_trasmissione: contractData.dataScadenza,
      stato_programmazione: 'IN_PALINSESTO',
      note: `Contratto Radio Monte Serra S.r.l. regolarmente attivato e sottoscritto. ${contractData.noteContratto}`
    } as LeadRow;

    // Aggiorna lista e salva su localStorage
    updateLeadsAndPersist(prev => [newContractLead, ...prev.filter(l => l.id !== (editingLeadId || '') && l.nome_azienda_evento.toLowerCase() !== clientName.toLowerCase())]);

    // Ripulisce preventivatore
    resetQuoteBuilder();

    // Chiudi modali
    setShowContractModal(false);
    setShowQuoteModal(false);
    setShowPdfModal(false);

    alert(`🎉 Contratto ${contractData.numero} per "${clientName}" attivato con successo!\n\n• Valore Contratto: € ${contractData.totaleNetto.toLocaleString('it-IT')}\n• Spostato in "CONTRATTI ATTIVI" sulla Dashboard\n• Preventivatore azzerato e pronto per la prossima pratica.`);
  }

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
    const mainSpot = quoteItems.find(it => it.isSpot) || quoteItems[0];
    const summaryItems = quoteItems.map(it => `${it.tipo} [${it.copertura}] - ${it.dettagli} (Valore: €${it.valore})`).join(' | ');
    
    const spacesPrice = quoteItems.filter(i => i.isSpot).reduce((s, i) => s + (i.valore || 0), 0);
    const prodPrice = quoteItems.filter(i => !i.isSpot).reduce((s, i) => s + (i.valore || 0), 0);

    const mezzoVal = mainSpot?.copertura?.includes('Firenze') && !mainSpot?.copertura?.includes('Toscana')
      ? 'Radio Firenze 88.7'
      : (mainSpot?.copertura?.includes('Combinata') ? 'Radio Toscana + Radio Firenze' : 'Radio Toscana');

    const nextNum = getNextContractNumber(leads);

    setContractData({
      numero: nextNum,
      dataDecorrenza: mainSpot?.dataInizio || '2026-09-15',
      dataScadenza: mainSpot?.dataFine || '2026-09-28',
      committente: qNome || 'Azienda Committente',
      referente: qReferente || 'Referente Aziendale',
      piva: qPiva || '',
      sdi: qSdi || '',
      indirizzo: [qComune, qProvincia ? `(${qProvincia})` : ''].filter(Boolean).join(' ') || 'Toscana',
      telefono: qTelefono || '',
      email: qEmail || '',
      mezzo: mezzoVal,
      formato: `${mainSpot?.formatoSecondi || 20}"`,
      quantitaSpot: mainSpot?.spotTotali || 0,
      area: mainSpot?.copertura || 'RT Rete (Tutta la Toscana)',
      prezzoSpazi: spacesPrice,
      prezzoProduzione: prodPrice,
      totaleNetto: totaleInvestimento,
      totaleBarter: tipoAccordo === 'STANDARD' ? 0 : Math.round(totaleInvestimento / 2),
      modalitaPagamento: tipoAccordo === 'BARTER_PURO' ? '100% Cambio Merce / Barter' : 'Bonifico bancario 30gg d.f. f.m.',
      noteContratto: `Formula Accordo: ${tipoAccordo}. ${summaryItems}`,
      bancaAppoggio: '',
      iban: ''
    });
    setIsContractAlreadyActive(false);
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
      <div className="no-print">
        {/* HEADER PRINCIPALE */}
        <header>
        <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="brand-logo" style={{ background: 'transparent', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}>
            <img src="/logo_radio_toscana.png" alt="Radio Toscana" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <div className="brand-text">
            <h1>
              Radio Toscana Commerciale{' '}
              <span style={{ fontSize: '12px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '6px', marginLeft: '8px', fontWeight: 800 }}>
                v7.8.0 — Cloud Sync Live &amp; Contratto A4 Pro
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

                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                            📍 {l.comune} ({l.provincia})
                          </div>

                          {l.referente && (
                            <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '4px' }}>
                              👤 <strong>{l.referente}</strong> {l.telefono ? `• 📞 ${l.telefono}` : ''}
                            </div>
                          )}

                          {l.plafond_totale_spot && l.plafond_totale_spot > 0 ? (
                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>
                              📻 <strong>{l.plafond_totale_spot} spot</strong> {l.data_inizio_trasmissione && l.data_fine_trasmissione ? `(dal ${l.data_inizio_trasmissione} al ${l.data_fine_trasmissione})` : ''}
                            </div>
                          ) : null}

                          {l.tipo_produzione_spot && (
                            <div style={{ fontSize: '10px', color: '#fb7185', marginTop: '2px', fontWeight: 700 }}>
                              🎙️ Produzione: {l.tipo_produzione_spot === 'DIRITTI_LIBERI_TOSCANA' ? 'Diritti Liberi Toscana (169€)' : 'Solo RT+RF (100€)'}
                            </div>
                          )}

                          <div className="lead-footer" style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                            <span style={{ fontWeight: 900, color: 'var(--accent-green)', fontSize: '14px' }}>
                              € {(l.valore_contratto || l.valore_preventivo).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                            </span>
                            <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>
                              {col.phase === 'PREVENTIVO INVIATO' ? 'In Trattativa' : col.phase}
                            </span>
                          </div>

                          {/* BARRA AZIONI OPERATIVE RAPIDE KANBAN */}
                          {col.phase === 'PREVENTIVO INVIATO' && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '8px' }}>
                              <button
                                className="btn btn-xs"
                                style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', fontWeight: 700 }}
                                onClick={() => openEditQuoteModal(l)}
                                title="Modifica il preventivo (aggiungi, togli o varia voci, date e prezzi)"
                              >
                                ✏️ Modifica
                              </button>
                              <button
                                className="btn btn-xs"
                                style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', fontWeight: 700 }}
                                onClick={() => openProposalA4ForLead(l)}
                                title="Visualizza e stampa la Proposta Commerciale A4"
                              >
                                📄 Proposta A4
                              </button>
                              <button
                                className="btn btn-xs"
                                style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 700 }}
                                onClick={() => openContractForLead(l)}
                                title="Trasforma direttamente in Contratto Ufficiale RMS"
                              >
                                📝 Passa a Contratto RMS
                              </button>
                              <button
                                className="btn btn-xs"
                                style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', fontWeight: 700 }}
                                onClick={() => openProposalEmailModal(l)}
                                title="Invia la proposta via email al cliente"
                              >
                                ✉️ Invia Email
                              </button>
                              <button
                                className="btn btn-xs"
                                style={{ background: 'rgba(0, 121, 191, 0.2)', color: '#38bdf8', border: '1px solid rgba(0, 121, 191, 0.4)', fontWeight: 700 }}
                                onClick={() => openTrelloDispatchModal(l)}
                                title="Genera scheda per Trello e invia notifica WhatsApp alla collaboratrice esterna"
                              >
                                📋 Commessa Trello
                              </button>
                              {l.stato_produzione === 'IN_ATTESA_AUDIO_TRELLO' && (
                                <button
                                  className="btn btn-xs"
                                  style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.4)', fontWeight: 800 }}
                                  onClick={() => markAudioReceivedInRegia(l)}
                                  title="Segna il file audio come ricevuto e sblocca per la regia broadcast"
                                >
                                  ✅ Audio Ricevuto
                                </button>
                              )}
                              <button
                                className="btn btn-xs"
                                style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#facc15', border: '1px solid rgba(234, 179, 8, 0.3)', fontWeight: 700 }}
                                onClick={() => sendLeadToSchedule(l)}
                                title="Pianifica nel Palinsesto On-Air"
                              >
                                📅 Palinsesto
                              </button>
                              <button
                                className="btn btn-xs"
                                style={{ background: '#f59e0b', color: '#000', fontWeight: 800 }}
                                onClick={() => openRemindModal(l)}
                                title="Sequenza solleciti remind a 3 step"
                              >
                                ⏰ Remind
                              </button>
                            </div>
                          )}

                          {col.phase === 'CONTRATTO ATTIVO' && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '8px' }}>
                              <button
                                className="btn btn-xs"
                                style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 700 }}
                                onClick={() => openContractForLead(l)}
                              >
                                📄 Stampa Contratto RMS
                              </button>
                              <button
                                className="btn btn-xs"
                                style={{ background: 'rgba(0, 121, 191, 0.2)', color: '#38bdf8', border: '1px solid rgba(0, 121, 191, 0.4)', fontWeight: 700 }}
                                onClick={() => openTrelloDispatchModal(l)}
                                title="Genera o visualizza scheda Trello per la produzione spot"
                              >
                                📋 Commessa Trello
                              </button>
                              {l.stato_produzione === 'IN_ATTESA_AUDIO_TRELLO' && (
                                <button
                                  className="btn btn-xs"
                                  style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.4)', fontWeight: 800 }}
                                  onClick={() => markAudioReceivedInRegia(l)}
                                >
                                  ✅ Audio Ricevuto
                                </button>
                              )}
                              <button
                                className="btn btn-xs btn-primary"
                                onClick={() => {
                                  setSelectedLeadForEmail(l);
                                  setShowEmailModal(true);
                                }}
                              >
                                ✉️ Notifica On-Air
                              </button>
                            </div>
                          )}

                          {col.phase !== 'PREVENTIVO INVIATO' && col.phase !== 'CONTRATTO ATTIVO' && (
                            <div style={{ marginTop: '8px' }}>
                              <button
                                className="btn btn-xs btn-primary"
                                style={{ width: '100%' }}
                                onClick={() => openEditQuoteModal(l)}
                              >
                                💼 Crea / Modifica Preventivo
                              </button>
                            </div>
                          )}
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

      {/* CONTENT TAB 4: PRODUZIONE SPOT AUDIO & LISTINO SLA 7GG */}
      {activeTab === 'production' && (
        <div style={{ background: 'var(--panel-bg)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--panel-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎙️ Pipeline Produzione Spot Audio &amp; Sala Incisione (SLA 7 Giorni)
              </h3>
              <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                Gestione operativa: Stesura Copy -&gt; Registrazione Speaker Studio -&gt; Approvazione &amp; Sblocco Regia On-Air. (Listino Ufficiale Toscana Comunica: Solo RT+RF 100€ | Diritti Liberi Toscana 169€)
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                className="btn btn-xs"
                style={{ background: '#0079bf', color: '#ffffff', fontWeight: 800, border: '1px solid rgba(255,255,255,0.2)', padding: '6px 12px' }}
                onClick={() => window.open('https://trello.com/b/7JoUM2H9/radio-toscana-copy-spot', '_blank')}
                title="Apre la bacheca di Edi in un nuovo tab"
              >
                📋 Apri Bacheca Trello di Edi
              </button>
              <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.3)', fontSize: '12px', fontWeight: 800 }}>
                ⏱️ SLA Standard Produzione: 7 Giorni Lavorativi
              </div>
            </div>
          </div>

          {leads.filter(l => l.stato_produzione && l.stato_produzione !== 'NON_RICHIESTA' || l.quote_items?.some(it => !it.isSpot)).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px dashed var(--panel-border)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎙️</div>
              <h4 style={{ margin: 0, color: 'var(--text-muted)' }}>Nessun incarico di produzione audio attivo al momento.</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Crea un preventivo che include la &quot;Realizzazione Spot Audio&quot; o clicca su &quot;🎙️ Produzione&quot; da una scheda trattativa nel Kanban.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '16px' }}>
              {leads.filter(l => l.stato_produzione && l.stato_produzione !== 'NON_RICHIESTA' || l.quote_items?.some(it => !it.isSpot)).map((l, pIdx) => {
                const isDirittiLiberi = l.tipo_produzione_spot === 'DIRITTI_LIBERI_TOSCANA' || l.quote_items?.some(it => it.tipoProduzione === 'DIRITTI_LIBERI_TOSCANA');
                const stato = l.stato_produzione || 'IN_ATTESA_COPY';

                return (
                  <div key={pIdx} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '16px', border: '1px solid var(--panel-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#fff' }}>{l.nome_azienda_evento}</h4>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                          👤 {l.referente || 'Referente'} {l.telefono ? `• 📞 ${l.telefono}` : ''}
                        </div>
                      </div>
                      <span className="tag" style={{
                        background: isDirittiLiberi ? 'rgba(244, 63, 94, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                        color: isDirittiLiberi ? '#fb7185' : '#38bdf8',
                        border: isDirittiLiberi ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)',
                        fontWeight: 800,
                        fontSize: '11px'
                      }}>
                        {isDirittiLiberi ? 'Diritti Liberi Toscana (169€)' : 'Solo RT+RF (100€)'}
                      </span>
                    </div>

                    {/* MONITORAGGIO SLA 7 GIORNI */}
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '8px 12px', borderRadius: '6px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                      <span style={{ color: '#cbd5e1' }}>
                        🎯 Scadenza SLA Produzione: <strong>{l.data_scadenza_produzione || 'Entro 7 giorni'}</strong>
                      </span>
                      <span style={{ color: stato === 'PRODOTTO_APPROVATO' ? 'var(--accent-green)' : '#facc15', fontWeight: 700 }}>
                        {stato === 'PRODOTTO_APPROVATO' ? '🟢 Audio Approvato' : '⏱️ In Lavorazione (SLA OK)'}
                      </span>
                    </div>

                    {/* STATI PIPELINE PRODUZIONE */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                      <span style={{
                        flex: 1, textAlign: 'center', padding: '5px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                        background: stato === 'IN_ATTESA_COPY' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(255,255,255,0.05)',
                        color: stato === 'IN_ATTESA_COPY' ? '#facc15' : '#64748b',
                        border: stato === 'IN_ATTESA_COPY' ? '1px solid rgba(234, 179, 8, 0.4)' : '1px solid transparent'
                      }}>
                        1. Stesura Copy
                      </span>
                      <span style={{
                        flex: 1, textAlign: 'center', padding: '5px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                        background: stato === 'IN_STUDIO' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.05)',
                        color: stato === 'IN_STUDIO' ? '#38bdf8' : '#64748b',
                        border: stato === 'IN_STUDIO' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent'
                      }}>
                        2. Sala Incisione
                      </span>
                      <span style={{
                        flex: 1, textAlign: 'center', padding: '5px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                        background: stato === 'PRODOTTO_APPROVATO' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.05)',
                        color: stato === 'PRODOTTO_APPROVATO' ? '#4ade80' : '#64748b',
                        border: stato === 'PRODOTTO_APPROVATO' ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid transparent'
                      }}>
                        3. Approvato On-Air
                      </span>
                    </div>

                    {/* BOX TESTO COPY AUDIO */}
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Testo / Note Copywriter per Speaker (Formato 20&quot; - ca. 45 parole):
                      </label>
                      <textarea
                        className="form-textarea"
                        style={{ height: '65px', fontSize: '12px' }}
                        value={l.copy_testo || ''}
                        placeholder="Inserisci il testo dello spot da incidere in sala o le indicazioni del cliente..."
                        onChange={e => {
                          const val = e.target.value;
                          updateLeadsAndPersist(prev => prev.map(item => item.id === l.id ? { ...item, copy_testo: val } : item));
                        }}
                      />
                    </div>

                    {/* PULSANTI DI AVANZAMENTO STATO */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {stato === 'IN_ATTESA_COPY' && (
                        <button
                          className="btn btn-xs"
                          style={{ flex: 1, background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)', fontWeight: 700 }}
                          onClick={() => {
                            updateLeadsAndPersist(prev => prev.map(item => item.id === l.id ? { ...item, stato_produzione: 'IN_STUDIO' } : item));
                            alert(`🎙️ Testo approvato! Inviato a Sala di Registrazione per "${l.nome_azienda_evento}".`);
                          }}
                        >
                          🎙️ Invia in Sala Incisione
                        </button>
                      )}
                      {stato === 'IN_STUDIO' && (
                        <button
                          className="btn btn-xs"
                          style={{ flex: 1, background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.4)', fontWeight: 700 }}
                          onClick={() => {
                            updateLeadsAndPersist(prev => prev.map(item => item.id === l.id ? { ...item, stato_produzione: 'PRODOTTO_APPROVATO', stato_programmazione: 'IN_PALINSESTO' } : item));
                            alert(`✅ File Audio registrato e approvato per "${l.nome_azienda_evento}"!\nSbloccato per la messa in onda.`);
                          }}
                        >
                          ✅ Approva Audio &amp; Sblocca Palinsesto
                        </button>
                      )}
                      {stato === 'PRODOTTO_APPROVATO' && (
                        <div style={{ width: '100%', textAlign: 'center', fontSize: '11px', color: '#4ade80', fontWeight: 800, padding: '6px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '6px' }}>
                          🎉 Audio Pronto in Regia per la Messa in Onda
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CONTENT TAB 5: PROGRAMMAZIONE ON-AIR */}
      {activeTab === 'schedules' && (
        <div style={{ background: 'var(--panel-bg)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--panel-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                📅 Registro Programmazione On-Air &amp; Palinsesto Radio Toscana
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                Riepilogo delle trasmissioni programmate, volumi spot giornalieri e sincronizzazione con la regia broadcast.
              </p>
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Cliente / Azienda</th>
                <th>Copertura &amp; Area</th>
                <th>Periodo On-Air</th>
                <th>Spot / Giorno</th>
                <th>Totale Passaggi</th>
                <th>Stato Audio Regia</th>
                <th>Azione</th>
              </tr>
            </thead>
            <tbody>
              {leads.filter(l => l.fase_commerciale === 'CONTRATTO ATTIVO' || l.fase_commerciale === 'PREVENTIVO INVIATO' || l.stato_programmazione === 'IN_PALINSESTO').map((l, sIdx) => {
                const isAudioPronto = l.stato_produzione === 'PRODOTTO_APPROVATO' || !l.quote_items?.some(it => !it.isSpot);
                return (
                  <tr key={sIdx}>
                    <td>
                      <strong>{l.nome_azienda_evento}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{l.referente}</div>
                    </td>
                    <td><span className="tag">{l.area_target || 'Radio Toscana'}</span></td>
                    <td>
                      <strong>
                        {l.data_inizio_trasmissione && l.data_fine_trasmissione
                          ? `${l.data_inizio_trasmissione} -&gt; ${l.data_fine_trasmissione}`
                          : 'Dal 15/09 al 28/09/2026'}
                      </strong>
                    </td>
                    <td><strong>{l.spot_giornalieri || 10} spot/gg</strong></td>
                    <td><span style={{ fontWeight: 800, color: 'var(--accent-green)' }}>{l.plafond_totale_spot || 140} spot</span></td>
                    <td>
                      <span style={{
                        padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                        background: isAudioPronto ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                        color: isAudioPronto ? '#4ade80' : '#facc15'
                      }}>
                        {isAudioPronto ? '🟢 Audio Pronto' : '🟡 In Produzione'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-xs btn-primary"
                        onClick={() => {
                          setSelectedLeadForEmail(l);
                          setShowEmailModal(true);
                        }}
                      >
                        ✉️ Invia Prospetto
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CONTENT TAB 2: CODE DI CONTROLLO */}
      {activeTab === 'queues' && (
        <div style={{ background: 'var(--panel-bg)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--panel-border)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 800 }}>
            🚫 Code di Controllo &amp; Revisione Lead
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
              <h4 style={{ margin: '0 0 10px', color: 'var(--accent-blue)' }}>🕵️‍♂️ Radar Redazione &amp; Scouter Inbound</h4>
              {leads.filter(l => l.fase_commerciale === 'SCOUTER DISCOVERY').map((l, qIdx) => (
                <div key={qIdx} style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', marginBottom: '8px' }}>
                  <strong>{l.nome_azienda_evento}</strong>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>📍 {l.comune} ({l.provincia})</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', margin: '4px 0' }}>{l.note}</div>
                  <button className="btn btn-xs btn-primary" onClick={() => openEditQuoteModal(l)}>💼 Crea Preventivo</button>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
              <h4 style={{ margin: '0 0 10px', color: 'var(--accent-yellow)' }}>🟡 Preventivi In Attesa di Riscontro</h4>
              {leads.filter(l => l.fase_commerciale === 'PREVENTIVO INVIATO').map((l, qIdx) => (
                <div key={qIdx} style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', marginBottom: '8px' }}>
                  <strong>{l.nome_azienda_evento}</strong> — € {l.valore_preventivo}
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Ultimo invio: {l.data_ultimo_invio || 'Recentemente'}</div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                    <button className="btn btn-xs" onClick={() => openEditQuoteModal(l)}>✏️ Modifica</button>
                    <button className="btn btn-xs btn-primary" onClick={() => openRemindModal(l)}>⏰ Remind</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTENT TAB 6: UNIVERSAL MEMORY LOCK */}
      {activeTab === 'memory' && (
        <div style={{ background: 'var(--panel-bg)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--panel-border)' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800 }}>
            🎡 Universal Memory Lock &amp; Storico Clienti (267 Contratti)
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Archivio storico delle aziende toscane contrattualizzate. Clicca su &quot;Crea Preventivo&quot; per precompilare il listino con l&apos;ultimo valore di chiusura concordato.
          </p>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Azienda / Ditta</th>
                  <th>Città</th>
                  <th>Referente</th>
                  <th>Contratti Storici</th>
                  <th>Ultimo Investimento</th>
                  <th>Azione</th>
                </tr>
              </thead>
              <tbody>
                {(storicoClientiData as HistoricalClient[]).slice(0, 30).map((h, hIdx) => (
                  <tr key={hIdx}>
                    <td><strong>{h.ditta}</strong></td>
                    <td>{h.citta} ({h.provincia})</td>
                    <td>{h.referente || '—'}</td>
                    <td><span className="tag">{h.totale_contratti} contratti</span></td>
                    <td><strong>€ {h.ultimo_prezzo || '—'}</strong></td>
                    <td>
                      <button
                        className="btn btn-xs btn-primary"
                        onClick={() => {
                          selectHistoricalClient(h);
                          setShowQuoteModal(true);
                        }}
                      >
                        💼 Crea Preventivo
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>

      {/* MODALE PREVENTIVO MODULARE (STANDARD / BARTER PARZIALE / BARTER PURO) */}
      {showQuoteModal && (
        <div className={`modal-overlay ${showPdfModal || showContractModal ? 'no-print' : ''}`}>
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
              <label className="form-label" style={{ color: 'var(--accent-yellow)', fontWeight: 800 }}>Tipologia Accordo Commerciale:</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button
                  className="btn btn-xs"
                  style={{ flex: 1, background: tipoAccordo === 'STANDARD' ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: 600 }}
                  onClick={() => setTipoAccordo('STANDARD')}
                >
                  Standard (100% Fatturato)
                </button>
                <button
                  className="btn btn-xs"
                  style={{ flex: 1, background: tipoAccordo === 'BARTER_PARZIALE' ? 'var(--accent-purple)' : 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: 600 }}
                  onClick={() => setTipoAccordo('BARTER_PARZIALE')}
                >
                  Barter Parziale (Quota Merce)
                </button>
                <button
                  className="btn btn-xs"
                  style={{ flex: 1, background: tipoAccordo === 'BARTER_PURO' ? '#ec4899' : 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: 600 }}
                  onClick={() => setTipoAccordo('BARTER_PURO')}
                >
                  Barter Puro (100% Merce)
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
                          background: 'rgba(56, 189, 248, 0.15)', 
                          color: '#38bdf8', 
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
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Archivio Storico Radio Monte Serra ({selectedHistory.contratti.length} contratti precedenti trovati)
                  </span>
                  <button 
                    className="btn btn-xs"
                    style={{ background: '#38bdf8', color: '#0f172a', fontWeight: 800, fontSize: '11px', padding: '4px 8px' }}
                    onClick={() => selectHistoricalClient(selectedHistory)}
                  >
                    Applica Condizioni Ultimo Contratto (€ {selectedHistory.ultimo_prezzo})
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
                    Moduli Campagna &amp; Voci Preventivo ({quoteItems.length} voci attive)
                  </h4>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                    Aggiungi e personalizza le linee di programmazione per emittente, fascia, listino e prezzo riservato
                  </div>
                </div>
              </div>

              {/* PULSANTIERA AGGIUNTA RAPIDA MODULI UFFICIALI RADIO TOSCANA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                
                {/* RIGA 1: SPOT TABELLARI PER AREA */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', width: '130px' }}>Spot per Area:</span>
                  <button
                    type="button"
                    className="btn btn-xs"
                    style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', fontWeight: 700 }}
                    onClick={() => addQuoteItem(
                      'Spot Radiofonici Tabellari',
                      'Radio Toscana Rete (Tutta la Toscana)',
                      '10 spot/gg per 14 gg (140 spot paganti da 20") + 14 spot OMAGGIO (Totale 154 passaggi)',
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
                    + Spot Rete (Tutta la Toscana)
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
                    + Area 1 (FI-PO-PT)
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
                    + Area 2 (Costa LI-PI-LU-MS)
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
                    + Area 3 (AR-SI-GR)
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
                    + Radio Firenze 95.4 FM
                  </button>
                </div>

                {/* RIGA 2: REALIZZAZIONE SPOT AUDIO */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', width: '130px' }}>Produzione Spot:</span>
                  <button
                    type="button"
                    className="btn btn-xs"
                    style={{ background: 'rgba(212, 63, 74, 0.15)', color: '#f87171', border: '1px solid rgba(212, 63, 74, 0.35)', fontWeight: 700 }}
                    onClick={() => addQuoteItem(
                      'Realizzazione Spot Audio',
                      'Diffusione Radio Toscana + Radio Firenze',
                      'Realizzazione copy + Registrazione in studio + Diritti di diffusione (Radio Toscana e Radio Firenze)',
                      'Costo Una Tantum',
                      '',
                      100,
                      100,
                      { tipoProduzione: 'SOLO_RT_RF' }
                    )}
                  >
                    + Spot Solo RT+RF (€100)
                  </button>
                  <button
                    type="button"
                    className="btn btn-xs"
                    style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', fontWeight: 700 }}
                    onClick={() => addQuoteItem(
                      'Realizzazione Spot Audio (Diritti Liberi)',
                      'Diffusione Emittenti Toscana',
                      'Realizzazione copy + Registrazione in studio + Diritti di diffusione per emittenti toscane',
                      'Costo Una Tantum',
                      '',
                      169,
                      169,
                      { tipoProduzione: 'DIRITTI_LIBERI_TOSCANA' }
                    )}
                  >
                    + Spot Diritti Liberi Toscana (€169)
                  </button>
                </div>

                {/* RIGA 3: FORMAT & EVENTI LISTINO UFFICIALE RADIO TOSCANA */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', width: '130px' }}>Format &amp; Eventi:</span>
                  <button
                    type="button"
                    className="btn btn-xs"
                    style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 700 }}
                    onClick={() => addQuoteItem(
                      'Citazione On-Air',
                      'Radio Toscana Rete',
                      'Citazione in diretta conduttori on-air',
                      'Fascia concordata',
                      'Nel periodo della campagna',
                      30,
                      30
                    )}
                  >
                    + Citazione (€30)
                  </button>
                  <button
                    type="button"
                    className="btn btn-xs"
                    style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', fontWeight: 700 }}
                    onClick={() => addQuoteItem(
                      'Prima Messa in Onda Pillola',
                      'Radio Toscana Rete',
                      'Comprende realizzazione intervista, post produzione e montaggio',
                      'Palinsesto concordato',
                      'Nel periodo della campagna',
                      150,
                      150
                    )}
                  >
                    + 1ª Messa in Onda Pillola (€150)
                  </button>
                  <button
                    type="button"
                    className="btn btn-xs"
                    style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', fontWeight: 700 }}
                    onClick={() => addQuoteItem(
                      'Dalla Seconda Messa in Onda Pillola',
                      'Radio Toscana Rete',
                      'Messa in onda replica / passaggio successivo pillola',
                      'A rotazione palinsesto',
                      'Nel periodo della campagna',
                      100,
                      100
                    )}
                  >
                    + Dalla 2ª Messa in Onda Pillola (€100)
                  </button>
                  <button
                    type="button"
                    className="btn btn-xs"
                    style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', fontWeight: 700 }}
                    onClick={() => addQuoteItem(
                      'DJ Set + Promo Radio (5 Citazioni)',
                      'Radio Toscana Rete',
                      'DJ Set evento con DJ Radio Toscana + Promo Radio (5 citazioni on-air)',
                      'Evento + Fasce ad alto ascolto',
                      'Data evento concordata',
                      500,
                      500
                    )}
                  >
                    + DJ Set + Promo Radio (€500)
                  </button>
                  <button
                    type="button"
                    className="btn btn-xs"
                    style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: '1px solid rgba(236, 72, 153, 0.3)', fontWeight: 700 }}
                    onClick={() => addQuoteItem(
                      'Presentazione Evento',
                      'Radio Toscana Rete',
                      'Presenza e conduzione/presentazione evento a cura di conduttore Radio Toscana',
                      'Orario evento',
                      'Data evento concordata',
                      400,
                      400
                    )}
                  >
                    + Presentazione Evento (€400)
                  </button>
                  <button
                    type="button"
                    className="btn btn-xs"
                    style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', fontWeight: 700 }}
                    onClick={() => addQuoteItem(
                      'Presenza in Onda durante Masti Sciò',
                      'Radio Toscana Rete',
                      'Intervento in diretta on-air durante Masti Sciò (durata max 5 minuti con Massimo Galli)',
                      '17.00 – 19.00 Masti Sciò',
                      'Data concordata',
                      250,
                      250
                    )}
                  >
                    + Presenza Masti Sciò max 5\' (€250)
                  </button>
                  <button
                    type="button"
                    className="btn btn-xs"
                    style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 700 }}
                    onClick={() => addQuoteItem(
                      'Realizzazione Materiale: Copy per Citazione',
                      'Radio Toscana Rete',
                      'Realizzazione materiale: stesura testo e copy per citazione on-air',
                      'Una Tantum',
                      'Immediato',
                      30,
                      30
                    )}
                  >
                    + Copy per Citazione (€30)
                  </button>
                  <button
                    type="button"
                    className="btn btn-xs"
                    style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#f8fafc', border: '1px solid rgba(255, 255, 255, 0.2)', fontWeight: 700 }}
                    onClick={() => addQuoteItem(
                      'Voce Fuori Listino / Personalizzata',
                      'Radio Toscana Rete',
                      'Dettagli prestazione concordata',
                      'Fascia concordata',
                      'Periodo concordato',
                      500,
                      400
                    )}
                  >
                    + Voce Libera
                  </button>
                </div>
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
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
                        </div>
                        <button
                          type="button"
                          onClick={() => removeQuoteItem(it.id)}
                          className="btn btn-xs"
                          style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '4px 10px', fontWeight: 600 }}
                          title="Elimina voce"
                        >
                          Rimuovi
                        </button>
                      </div>

                      {/* SELETTORE A BOTTONI 1-CLIC PER BACINO / AREA EMITTENTE */}
                      {!isProdItem && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '10px', background: 'rgba(0,0,0,0.2)', padding: '6px 10px', borderRadius: '6px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Bacino di Trasmissione:</span>
                          {[
                            { val: 'Radio Toscana Rete (Tutta la Toscana)', short: 'RT Rete (Toscana)' },
                            { val: 'Radio Toscana Area 1 (FI - PO - PT)', short: 'Area 1 (FI-PO-PT)' },
                            { val: 'Radio Toscana Area 2 (Costa: LI - PI - LU - MS)', short: 'Area 2 (Costa)' },
                            { val: 'Radio Toscana Area 3 (AR - SI - GR)', short: 'Area 3 (Sud)' },
                            { val: 'Radio Firenze 95.4 FM', short: 'Radio Firenze 95.4' },
                            { val: 'RT + RF Combinata (Rete + Firenze)', short: 'RT + RF Combinata' }
                          ].map(opt => {
                            const active = it.copertura === opt.val;
                            return (
                              <button
                                key={opt.val}
                                type="button"
                                onClick={() => updateQuoteItem(it.id, 'copertura', opt.val)}
                                style={{
                                  fontSize: '11px',
                                  padding: '4px 9px',
                                  borderRadius: '5px',
                                  border: active ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                                  background: active ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255,255,255,0.04)',
                                  color: active ? '#ffffff' : '#94a3b8',
                                  fontWeight: active ? 800 : 500,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                {active ? '✓ ' : ''}{opt.short}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* BLOCCO DEDICATO PIANIFICAZIONE SPOT: DATE, QUANTITÀ GIORNALIERA, TOTALI, OMAGGI */}
                      {isSpotItem && (
                        <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '6px', padding: '10px', marginBottom: '10px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>Programmazione Spot (Da Data a Data, Cadenza Giornaliera e Omaggi):</span>
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
                              <label style={{ fontSize: '10px', color: '#f43f5e', fontWeight: 800, display: 'block', marginBottom: '2px' }}>Spot OMAGGIO:</label>
                              <input
                                type="number"
                                className="form-input"
                                style={{ fontSize: '11px', width: '100%', padding: '4px 6px', borderColor: 'rgba(244, 63, 94, 0.4)', color: '#fb7185', fontWeight: 800 }}
                                value={it.spotOmaggio || 0}
                                min={0}
                                placeholder="0"
                                onChange={e => handleSpotFieldChange(it.id, { spotOmaggio: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Formato Audio:</label>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                {[
                                  { sec: 10, label: '10"' },
                                  { sec: 20, label: '20"' },
                                  { sec: 30, label: '30"' }
                                ].map(f => {
                                  const active = (it.formatoSecondi || 20) === f.sec;
                                  return (
                                    <button
                                      key={f.sec}
                                      type="button"
                                      onClick={() => handleSpotFieldChange(it.id, { formatoSecondi: f.sec })}
                                      style={{
                                        flex: 1,
                                        padding: '4px 2px',
                                        fontSize: '11px',
                                        borderRadius: '4px',
                                        border: active ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                                        background: active ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255,255,255,0.04)',
                                        color: active ? '#ffffff' : '#94a3b8',
                                        fontWeight: active ? 800 : 600,
                                        cursor: 'pointer'
                                      }}
                                    >
                                      {f.label}
                                    </button>
                                  );
                                })}
                              </div>
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
                                  Periodo: <strong>{it.giorniTotali || 14} giorni</strong> • <strong>{spotPag} spot paganti ({it.formatoSecondi || 20}")</strong>
                                  {(it.spotOmaggio || 0) > 0 && (
                                    <span style={{ color: '#fb7185', marginLeft: '6px', fontWeight: 800 }}>
                                      + {it.spotOmaggio} OMAGGIO (Totale: {spotPag + (it.spotOmaggio || 0)} passaggi)
                                    </span>
                                  )}
                                </span>
                                <span style={{ color: '#38bdf8', fontWeight: 700 }}>
                                  Listino Ufficiale: € {tariffa.toFixed(2)}/spot → <strong>Totale: € {listinoTot.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</strong>
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* BLOCCO DEDICATO PRODUZIONE AUDIO: SOLO RT+RF (100€) VS DIRITTI LIBERI TOSCANA (169€) */}
                      {isProdItem && (
                        <div style={{ background: 'rgba(71, 67, 80, 0.4)', border: '1px solid rgba(212, 63, 74, 0.35)', borderRadius: '6px', padding: '12px', marginBottom: '12px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: '#f8fafc', marginBottom: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            Ambito di Diffusione e Diritti Spot (Selezione con Spunta):
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px' }}>
                            <label style={{
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                              color: (it.tipoProduzione === 'SOLO_RT_RF' || it.valore === 100) ? '#ffffff' : '#94a3b8',
                              fontWeight: 700,
                              background: (it.tipoProduzione === 'SOLO_RT_RF' || it.valore === 100) ? 'rgba(212, 63, 74, 0.25)' : 'rgba(0,0,0,0.25)',
                              border: (it.tipoProduzione === 'SOLO_RT_RF' || it.valore === 100) ? '1px solid #D43F4A' : '1px solid rgba(255,255,255,0.1)',
                              padding: '10px 12px',
                              borderRadius: '6px'
                            }}>
                              <input
                                type="radio"
                                name={`tipoProd-${it.id}`}
                                checked={it.tipoProduzione === 'SOLO_RT_RF' || it.valore === 100}
                                onChange={() => handleProduzioneChange(it.id, 'SOLO_RT_RF')}
                              />
                              Solo Radio Toscana + Radio Firenze (€ 100,00 + IVA)
                            </label>
                            <label style={{
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                              color: (it.tipoProduzione === 'DIRITTI_LIBERI_TOSCANA' || it.valore === 169) ? '#ffffff' : '#94a3b8',
                              fontWeight: 700,
                              background: (it.tipoProduzione === 'DIRITTI_LIBERI_TOSCANA' || it.valore === 169) ? 'rgba(56, 189, 248, 0.25)' : 'rgba(0,0,0,0.25)',
                              border: (it.tipoProduzione === 'DIRITTI_LIBERI_TOSCANA' || it.valore === 169) ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                              padding: '10px 12px',
                              borderRadius: '6px'
                            }}>
                              <input
                                type="radio"
                                name={`tipoProd-${it.id}`}
                                checked={it.tipoProduzione === 'DIRITTI_LIBERI_TOSCANA' || it.valore === 169}
                                onChange={() => handleProduzioneChange(it.id, 'DIRITTI_LIBERI_TOSCANA')}
                              />
                              Diritti Liberi per altre emittenti Toscana (€ 169,00 + IVA)
                            </label>
                          </div>
                          <div style={{ fontSize: '10.5px', color: '#cbd5e1', marginTop: '8px', background: 'rgba(0,0,0,0.2)', padding: '8px 10px', borderRadius: '4px', lineHeight: 1.45 }}>
                            {it.tipoProduzione === 'DIRITTI_LIBERI_TOSCANA'
                              ? 'Comprende: Realizzazione copy (testo) + Registrazione in studio professionale + Diritti di diffusione per emittenti toscane.'
                              : 'Comprende: Realizzazione copy (testo) + Registrazione in studio professionale + Diritti di diffusione per la messa in onda riservata alle frequenze di Radio Toscana e Radio Firenze.'}
                          </div>
                        </div>
                      )}

                      {/* RIGA DATI GENERALI: DETTAGLI, FASCIA, PERIODO, LISTINO, PREZZO RISERVATO */}
                      {isProdItem ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px 100px 100px', gap: '8px', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Specifiche Servizio Audio:</span>
                            <input
                              type="text"
                              className="form-input"
                              style={{ fontSize: '11px', width: '100%' }}
                              value={it.dettagli}
                              onChange={e => updateQuoteItem(it.id, 'dettagli', e.target.value)}
                              placeholder="Specifiche tecniche e di produzione..."
                            />
                          </div>
                          <div>
                            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Tipologia Costo:</span>
                            <div style={{
                              background: 'rgba(255,255,255,0.06)',
                              border: '1px solid rgba(255,255,255,0.12)',
                              borderRadius: '4px',
                              padding: '6px 8px',
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#cbd5e1',
                              textAlign: 'center'
                            }}>
                              Costo Una Tantum
                            </div>
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
                            <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: '2px' }}>Riservato (€):</span>
                            <input
                              type="number"
                              className="form-input"
                              style={{ fontSize: '12px', width: '100%', textAlign: 'right', fontWeight: 800, color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.35)' }}
                              value={it.valore}
                              onChange={e => updateQuoteItem(it.id, 'valore', Number(e.target.value))}
                            />
                          </div>
                        </div>
                      ) : (
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
                            <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: '2px' }}>Riservato (€):</span>
                            <input
                              type="number"
                              className="form-input"
                              style={{ fontSize: '12px', width: '100%', textAlign: 'right', fontWeight: 800, color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.35)' }}
                              value={it.valore}
                              onChange={e => updateQuoteItem(it.id, 'valore', Number(e.target.value))}
                            />
                          </div>
                        </div>
                      )}
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
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff' }}>
                    € {totaleInvestimento.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>

            {/* SEZIONE BARTER (SE ATTIVO) */}
            {tipoAccordo !== 'STANDARD' && (
              <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                <label className="form-label" style={{ color: '#c084fc', fontWeight: 800 }}>Dettaglio Accordo Barter (Cambio Merce):</label>
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
                  style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#facc15', border: '1px solid rgba(234, 179, 8, 0.3)', fontWeight: 700 }}
                  onClick={saveAsQuoteInNegotiation}
                >
                  {editingLeadId ? '💾 Salva Modifiche Preventivo' : '💾 Salva in Trattativa'}
                </button>
                <button
                  className="btn"
                  style={{ background: 'rgba(168,85,247,0.2)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.4)', fontWeight: 700 }}
                  onClick={() => setShowPdfModal(true)}
                >
                  Proposta A4 Radio Toscana
                </button>
                <button
                  className="btn btn-primary"
                  onClick={openContractGenerator}
                >
                  Genera Bozza Contratto RMS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE GENERATORE PROPOSTA COMMERCIALE A4 CORPORATE BRAND */}
      {showPdfModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '900px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', background: '#000000', padding: '0', borderRadius: '12px' }}>
            <div className="no-print" style={{ background: '#111111', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222222' }}>
              <span style={{ fontWeight: 800, color: '#f43f5e', fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                PROPOSTA COMMERCIALE A4 — ANTEPRIMA DI STAMPA
              </span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  className="btn btn-xs"
                  style={{ background: '#22c55e', color: '#fff', fontWeight: 800 }}
                  onClick={saveAsQuoteInNegotiation}
                  title="Salva immediatamente questo preventivo nella colonna Trattative del Kanban"
                >
                  💾 Salva nella Dashboard
                </button>
                <button
                  className="btn btn-xs"
                  style={{ background: '#3b82f6', color: '#fff', fontWeight: 800 }}
                  onClick={() => {
                    const currentLead: LeadRow = {
                      id: editingLeadId || `quote-${Date.now()}`,
                      nome_azienda_evento: qNome || 'Cliente',
                      referente: qReferente,
                      email: qEmail,
                      telefono: qTelefono,
                      comune: qComune,
                      provincia: qProvincia,
                      piva: qPiva,
                      sdi: qSdi,
                      settore: 'B2B',
                      area_target: quoteItems[0]?.copertura || 'Toscana',
                      fase_commerciale: 'PREVENTIVO INVIATO',
                      valore_preventivo: totaleInvestimento,
                      valore_contratto: 0,
                      is_cambio_merce: tipoAccordo !== 'STANDARD',
                      probabilita_chiusura: 70,
                      quote_items: [...quoteItems],
                      tipo_accordo: tipoAccordo
                    };
                    saveAsQuoteInNegotiation();
                    openProposalEmailModal(currentLead);
                  }}
                  title="Invia la proposta commerciale via email al cliente"
                >
                  ✉️ Invia Proposta via Email
                </button>
                <button
                  className="btn btn-xs"
                  style={{ background: '#a855f7', color: '#fff', fontWeight: 800 }}
                  onClick={() => {
                    saveAsQuoteInNegotiation();
                    openContractGenerator();
                  }}
                  title="Trasforma direttamente in Contratto Ufficiale Radio Monte Serra"
                >
                  📝 Passa a Contratto RMS
                </button>
                <button className="btn btn-primary btn-xs" onClick={handlePrintProposal}>
                  Salva / Stampa in PDF
                </button>
                <button className="modal-close" onClick={() => setShowPdfModal(false)}>✕</button>
              </div>
            </div>

            {/* FOGLIO A4 STAMPABILE CORPORATE RADIO TOSCANA */}
            <div
              className="a4-page-preview printable-document"
              id="printable-proposal"
              style={{
                background: '#ffffff',
                color: '#111111',
                padding: '16px 22px',
                margin: '10px auto',
                width: '210mm',
                maxWidth: '100%',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                boxSizing: 'border-box',
                fontFamily: "'Akzidenz-Grotesk', 'Panton', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                position: 'relative'
              }}
            >
              
              {/* HEADER UFFICIALE RADIO TOSCANA CARTA INTESTATA */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2.5px solid #474350', paddingBottom: '12px', marginBottom: '14px', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: '-2.5px', left: 0, width: '90px', height: '2.5px', background: '#D43F4A' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src="/logo_radio_toscana.png"
                    alt="Radio Toscana - Solo Toscana | Solo Hit"
                    style={{ height: '46px', width: 'auto', objectFit: 'contain', display: 'block' }}
                  />
                  <div style={{ borderLeft: '1px solid #cbd5e1', paddingLeft: '12px' }}>
                    <div style={{ fontSize: '8px', color: '#64748b', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>EMITTENTE REGIONALE</div>
                    <div style={{ fontSize: '11px', fontWeight: 900, color: '#474350', letterSpacing: '0.04em' }}>SOLO TOSCANA | SOLO HIT</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginBottom: '4px' }}>
                    <img
                      src="/logo_radio_firenze.png"
                      alt="88.7 Radio Firenze"
                      style={{ height: '22px', width: 'auto', objectFit: 'contain', display: 'block' }}
                    />
                    <span style={{ fontSize: '8.5px', fontWeight: 800, background: '#f1f5f9', color: '#474350', border: '1px solid #cbd5e1', padding: '2px 6px', borderRadius: '3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      PROPOSTA COMMERCIALE
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#474350', fontWeight: 700 }}>
                    N. Prev: <span style={{ color: '#D43F4A', fontWeight: 800 }}>{currentQuoteNumber || 'PREV-2026/001'}</span> • Data: {new Date().toLocaleDateString('it-IT')}
                  </div>
                  <div style={{ fontSize: '8.5px', color: '#94a3b8' }}>
                    Validità offerta: 30 giorni data emissione
                  </div>
                </div>
              </div>

              {/* SCHEDA DATI COMMITTENTE & CONTATTO DIRETTO (GRIGLIA B2B A 2 COLONNE) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px', background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '8.5px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>COMMITTENTE / AZIENDA</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 900, color: '#474350', marginTop: '2px', lineHeight: 1.2 }}>{qNome || 'Azienda Partner'}</div>
                  <div style={{ fontSize: '10px', color: '#475569', marginTop: '3px' }}>
                    Referente: <strong>{qReferente || 'Direzione'}</strong> • P.IVA / C.F.: <strong>{qPiva || 'In fase di definizione'}</strong>
                  </div>
                  {qComune && (
                    <div style={{ fontSize: '9.5px', color: '#64748b', marginTop: '1px' }}>
                      Sede: {qComune} {qProvincia ? `(${qProvincia})` : ''}
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '8.5px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>EMITTENTE &amp; CONTATTO DIRETTO</div>
                  <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#474350', marginTop: '2px' }}>Fabio Asiri — Direzione Commerciale</div>
                  <div style={{ fontSize: '10px', color: '#475569', marginTop: '3px' }}>
                    commerciale@radiotoscana.it • Tel. 347 6818595
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#D43F4A', fontWeight: 700, marginTop: '1px' }}>
                    Radio Toscana • Radio Firenze (Radio Monte Serra S.r.l.)
                  </div>
                </div>
              </div>

              {/* DETTAGLIO DELLA PROPOSTA ECONOMICA */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '10.5px', fontWeight: 900, color: '#474350', textTransform: 'uppercase', letterSpacing: '0.06em', borderLeft: '3px solid #D43F4A', paddingLeft: '6px', margin: 0 }}>
                    PIANO DI COMUNICAZIONE &amp; MODULI DELLA CAMPAGNA
                  </h4>
                  <span style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>{quoteItems.length} linee di pianificazione</span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                  <thead>
                    <tr style={{ background: '#474350', color: '#ffffff', textTransform: 'uppercase', fontSize: '8.5px', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '7px 8px', textAlign: 'left', fontWeight: 700 }}>Modulo &amp; Ambito di Diffusione</th>
                      <th style={{ padding: '7px 8px', textAlign: 'left', fontWeight: 700, width: '115px' }}>Fascia / Tipologia</th>
                      <th style={{ padding: '7px 8px', textAlign: 'left', fontWeight: 700 }}>Dettagli &amp; Specifiche</th>
                      <th style={{ padding: '7px 8px', textAlign: 'right', fontWeight: 700, width: '80px' }}>Listino</th>
                      <th style={{ padding: '7px 8px', textAlign: 'right', fontWeight: 700, width: '90px' }}>Prezzo Netto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quoteItems.map((it, idx) => {
                      const isProd = !!it.tipoProduzione || it.tipo.toLowerCase().includes('produzione') || it.tipo.toLowerCase().includes('realizzazione');
                      return (
                        <tr key={it.id} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                          <td style={{ padding: '6px 8px', verticalAlign: 'top' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: 800, color: '#1e293b' }}>{it.tipo}</span>
                              {it.spotOmaggio && it.spotOmaggio > 0 ? (
                                <span style={{ fontSize: '7.5px', background: '#fef2f2', color: '#D43F4A', border: '1px solid #fecaca', padding: '1px 4px', borderRadius: '3px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  + {it.spotOmaggio} OMAGGIO
                                </span>
                              ) : null}
                            </div>
                            <div style={{ fontSize: '9px', color: '#D43F4A', fontWeight: 700, marginTop: '2px' }}>{it.copertura}</div>
                          </td>
                          <td style={{ padding: '6px 8px', verticalAlign: 'top' }}>
                            {isProd ? (
                              <span style={{ fontWeight: 800, color: '#475569', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Costo Una Tantum
                              </span>
                            ) : (
                              <>
                                <div style={{ fontWeight: 700, color: '#334155' }}>{it.fascia}</div>
                                {it.periodo && <div style={{ fontSize: '9px', color: '#64748b', marginTop: '1px' }}>{it.periodo}</div>}
                              </>
                            )}
                          </td>
                          <td style={{ padding: '6px 8px', color: '#334155', verticalAlign: 'top' }}>
                            <div style={{ lineHeight: 1.35 }}>{it.dettagli}</div>
                            {it.tipoProduzione === 'DIRITTI_LIBERI_TOSCANA' && (
                              <div style={{ fontSize: '8.5px', color: '#0284c7', fontWeight: 700, marginTop: '2px' }}>
                                Ambito: Diritti di diffusione per emittenti toscane
                              </div>
                            )}
                            {it.tipoProduzione === 'SOLO_RT_RF' && (
                              <div style={{ fontSize: '8.5px', color: '#D43F4A', fontWeight: 700, marginTop: '2px' }}>
                                Ambito: Diffusione riservata su Radio Toscana e Radio Firenze
                              </div>
                            )}
                          </td>
                        <td style={{ padding: '6px 8px', textAlign: 'right', color: '#94a3b8', verticalAlign: 'top', textDecoration: it.prezzoListino && it.prezzoListino > it.valore ? 'line-through' : 'none' }}>
                          € {Number(it.prezzoListino || it.valore).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 800, color: '#1e293b', fontSize: '11px', verticalAlign: 'top' }}>
                          € {Number(it.valore).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                        </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* QUADRO ECONOMICO E CONDIZIONI GENERALI (LAYOUT COESO SENZA DUPLICAZIONI) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px', alignItems: 'start', marginBottom: '14px' }}>
                
                {/* COLONNA SINISTRA: CONDIZIONI COMMERCIALI E ACCORDO */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: '6px', fontSize: '9.5px' }}>
                  <div style={{ fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    FORMULA CONTRATTUALE: {tipoAccordo === 'STANDARD' ? 'STANDARD (100% FATTURATO)' : tipoAccordo === 'BARTER_PARZIALE' ? 'BARTER PARZIALE (QUOTA MERCE)' : 'BARTER PURO (100% MERCE)'}
                  </div>
                  {tipoAccordo !== 'STANDARD' && (
                    <div style={{ color: '#475569', marginBottom: '4px', lineHeight: 1.35 }}>
                      • Quota Radio Toscana: <strong>{barterRadio || 'Come da accordi'}</strong><br />
                      • Quota Ascoltatori (Promozioni On-Air): <strong>{barterAscoltatori || 'Come da accordi'}</strong>
                    </div>
                  )}
                  <div style={{ color: '#64748b', lineHeight: 1.4 }}>
                    • Pagamento: <strong>Bonifico Bancario 30 gg fine mese d.f.</strong> (salvo diversi accordi scritti)<br />
                    • Messa in onda: <strong>Condizionata alla restituzione della presente siglata</strong> e fornitura materiale audio.
                  </div>
                </div>

                {/* COLONNA DESTRA: TOTALIZZATORE ECONOMICO AD ALTO CONTRASTO */}
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ background: '#f1f5f9', padding: '6px 10px', display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#64748b' }}>
                    <span>Valore Listino Ufficiale:</span>
                    <span style={{ fontWeight: 700, textDecoration: scontoApplicato > 0 ? 'line-through' : 'none' }}>
                      € {totaleListino.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {scontoApplicato > 0 && (
                    <div style={{ background: '#fef2f2', padding: '5px 10px', display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: '#D43F4A', fontWeight: 800 }}>
                      <span>Vantaggio Riservato Cliente:</span>
                      <span>- € {scontoApplicato.toLocaleString('it-IT', { minimumFractionDigits: 2 })} ({Math.round((scontoApplicato / (totaleListino || 1)) * 100)}%)</span>
                    </div>
                  )}
                  <div style={{ background: '#1e293b', color: '#ffffff', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '8.5px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.07em' }}>TOTALE INVESTIMENTO NETTO</div>
                      <div style={{ fontSize: '7.5px', color: '#cbd5e1' }}>+ IVA di legge</div>
                    </div>
                    <div style={{ fontSize: '19px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
                      € {totaleInvestimento.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

              </div>

              {/* MODULO ACCETTAZIONE FIRMA E CLAUSOLA LICENZA AUDIO */}
              <div style={{ border: '1px solid #cbd5e1', padding: '10px 14px', borderRadius: '6px', background: '#ffffff', marginBottom: '12px' }}>
                <div style={{ fontSize: '9px', fontWeight: 900, color: '#474350', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>
                  ACCETTAZIONE DELLA PROPOSTA COMMERCIALE E CONDIZIONI GENERALI DI TRASMISSIONE
                </div>
                <div style={{ fontSize: '7.5px', color: '#64748b', lineHeight: 1.35, marginBottom: '6px', borderLeft: '2.5px solid #D43F4A', paddingLeft: '6px' }}>
                  <strong>Tutela Diritto d&apos;Autore:</strong> Il materiale audio è concesso in licenza d&apos;uso esclusivamente per l&apos;ambito concordato (RT+RF o Diritti Liberi Toscana), con espressa esclusione di network nazionali, circuiti esterni e digital advertising non autorizzati per iscritto.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '12px', marginTop: '6px', fontSize: '9px', color: '#64748b' }}>
                  <div>Data: ____ / ____ / 2026</div>
                  <div>Luogo: ____________________</div>
                  <div>
                    <div>Timbro e Firma per Accettazione:</div>
                    <div style={{ height: '22px', borderBottom: '1px dashed #94a3b8', marginTop: '4px' }}></div>
                  </div>
                </div>
              </div>

              {/* ELEMENTO CORPORATE LED METER UFFICIALE RADIO TOSCANA */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', opacity: 0.9 }}>
                <svg width="108" height="28" viewBox="0 0 128 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {[2, 4, 2, 3, 1, 1, 3, 2, 4, 2, 1, 3, 2, 4, 5, 4, 6, 4, 3, 1].map((count, cIdx) => (
                    <g key={cIdx}>
                      {Array.from({ length: count }).map((_, dIdx) => (
                        <circle
                          key={dIdx}
                          cx={3 + cIdx * 6.4}
                          cy={35 - dIdx * 6.4}
                          r={2.4}
                          fill="#BD323D"
                        />
                      ))}
                    </g>
                  ))}
                </svg>
              </div>

              {/* FOOTER UFFICIALE CARTA INTESTATA RADIO MONTE SERRA / RADIO TOSCANA / RADIO FIRENZE */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '6px', textAlign: 'center', fontSize: '8px', color: '#64748b', lineHeight: 1.4 }}>
                <div style={{ fontWeight: 800, color: '#D43F4A', fontSize: '9px', marginBottom: '1px' }}>Radio Toscana • Radio Firenze</div>
                <div>Direzione e sede: Via de&apos; Pucci 2, 50122 Firenze • Tel. 055 285030 • Fax 055 283793 • radiomonteserra@pec.it</div>
                <div>Radio Toscana e Radio Firenze sono marchi di Radio Monte Serra S.r.l. — P.IVA 04472740481 • C.F. 00940130503 • CCIAA Firenze 453074</div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODALE GENERATORE & STAMPA CONTRATTO RADIO MONTE SERRA S.R.L. */}
      {showContractModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '920px', maxWidth: '96vw', maxHeight: '92vh', overflowY: 'auto', background: '#0b0f19', padding: '0', borderRadius: '12px', border: '1px solid #334155' }}>
            <div className="no-print" style={{ background: '#111827', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f2937' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: 800, color: '#38bdf8', fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  CONTRATTO PUBBLICITARIO A4 — RADIO MONTE SERRA S.R.L.
                </span>
                <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  Modello Ufficiale
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button className="btn btn-primary btn-xs" onClick={handlePrintContract} style={{ background: '#0284c7', borderColor: '#0ea5e9' }}>
                  Salva / Stampa Contratto in PDF
                </button>
                <button 
                  className="btn btn-xs" 
                  onClick={openContractEmailModal}
                  style={{ background: 'rgba(234, 179, 8, 0.2)', color: '#facc15', fontWeight: 700, borderColor: 'rgba(234, 179, 8, 0.4)' }}
                  title="Prepara l'email formale con il Contratto allegato per il cliente e in CC ad amministrazione@radiotoscana.it"
                >
                  ✉️ Invia Contratto al Cliente (CC Amministrazione)
                </button>
                {isContractAlreadyActive ? (
                  <span 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      background: 'rgba(22, 163, 74, 0.2)', 
                      color: '#4ade80', 
                      border: '1px solid rgba(34, 197, 94, 0.4)', 
                      borderRadius: '4px', 
                      padding: '4px 10px', 
                      fontSize: '11px', 
                      fontWeight: 800, 
                      letterSpacing: '0.03em' 
                    }}
                  >
                    🟢 Contratto Attivo &amp; Convalidato (In Palinsesto)
                  </span>
                ) : (
                  <button className="btn btn-xs" onClick={confirmAndActivateContract} style={{ background: '#16a34a', color: '#ffffff', fontWeight: 700, borderColor: '#22c55e' }}>
                    Conferma &amp; Attiva Contratto
                  </button>
                )}
                <button className="modal-close" onClick={() => setShowContractModal(false)}>✕</button>
              </div>
            </div>

            {/* DOCUMENTO UFFICIALE A4 CONTRATTO RADIO MONTE SERRA S.R.L. - 2 PAGINE FRONTE E RETRO */}
            {/* DOCUMENTO UFFICIALE A4 CONTRATTO RADIO MONTE SERRA S.R.L. - 2 PAGINE FRONTE E RETRO */}
            <div
              className="printable-document"
              id="printable-contract"
              style={{
                width: '210mm',
                maxWidth: '100%',
                margin: '12px auto',
                boxSizing: 'border-box',
                fontFamily: "'Akzidenz-Grotesk', 'Panton', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                position: 'relative'
              }}
            >
              {/* ========================================================================= */}
              {/* ===== PAGINA 1: COMMISSIONE PUBBLICITARIA (MODULO ISTITUZIONALE FRONTE) ===== */}
              {/* ========================================================================= */}
              <div
                className="contract-page-1 a4-page-preview"
                style={{
                  background: '#ffffff',
                  color: '#111111',
                  padding: '24px 28px',
                  minHeight: '272mm',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                  borderRadius: '2px',
                  boxSizing: 'border-box',
                  marginBottom: '28px'
                }}
              >
                <div>
                  {/* HEADER COMMISSIONE PUBBLICITARIA RMS */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2.5px solid #1e293b', paddingBottom: '10px', marginBottom: '12px', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img src="/logo_radio_toscana.png" alt="Radio Toscana" style={{ height: '42px', width: 'auto', objectFit: 'contain' }} />
                      <img src="/logo_radio_firenze.png" alt="Radio Firenze" style={{ height: '25px', width: 'auto', objectFit: 'contain' }} />
                      <div style={{ borderLeft: '1.5px solid #cbd5e1', paddingLeft: '12px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a', letterSpacing: '0.04em' }}>RADIO MONTE SERRA S.r.l.</div>
                        <div style={{ fontSize: '8px', color: '#64748b' }}>Via de&apos; Pucci, 2 • 50122 Firenze • Tel. 055/285030 • Fax 055/283793 • P.IVA 04472740481</div>
                        <div style={{ fontSize: '8px', color: '#94a3b8' }}>CCIAA Firenze n. 453074 • info@radiotoscana.it • commerciale@radiotoscana.it</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '8.5px', fontWeight: 900, background: '#1e293b', color: '#ffffff', padding: '4px 10px', borderRadius: '3px', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'inline-block', marginBottom: '4px' }}>
                        COMMISSIONE PUBBLICITARIA — COPIA PER RADIO TOSCANA
                      </span>
                      <div style={{ fontSize: '11px', color: '#0f172a', fontWeight: 900 }}>
                        N. Comm: <span style={{ color: '#D43F4A' }}>{contractData.numero}</span> • Data: {new Date().toLocaleDateString('it-IT')}
                      </div>
                      <div style={{ fontSize: '9px', color: '#475569' }}>Agente di Riferimento: <strong>Fabio Asiri</strong></div>
                    </div>
                  </div>

                  {/* BOX DATI COMMITTENTE & GARANTE */}
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '10px 14px', marginBottom: '12px', background: '#f8fafc' }}>
                    <div style={{ fontSize: '9.5px', fontWeight: 900, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px' }}>
                      1. Dati Anagrafici Committente &amp; Garante
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px', fontSize: '9.5px', lineHeight: 1.4 }}>
                      <div>
                        <div><strong>Ditta Committente:</strong> <span style={{ fontSize: '10px', fontWeight: 700, color: '#0f172a' }}>{contractData.committente || '—'}</span></div>
                        <div><strong>Garante / Legale Rappr.:</strong> {contractData.referente || '—'}</div>
                        <div><strong>Sede Legale / Indirizzo:</strong> {contractData.indirizzo || '—'}</div>
                      </div>
                      <div>
                        <div><strong>Partita IVA / C.F.:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{contractData.piva || '—'}</span></div>
                        <div><strong>Codice SDI / PEC:</strong> {contractData.sdi || '—'}</div>
                        <div><strong>Telefono / Email:</strong> {contractData.telefono || qTelefono || '—'} • {contractData.email || qEmail || '—'}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: '6px', fontSize: '7.8px', color: '#64748b', fontStyle: 'italic', borderTop: '1px dashed #e2e8f0', paddingTop: '4px', lineHeight: 1.3 }}>
                      Il Committente conferma con la presente commissione l&apos;impegno ad effettuare pubblicità riguardante la ditta nel nome e nell&apos;interesse della quale agisce come garante, tramite le emittenti Radio Toscana e/o Radio Firenze, testate edite da Radio Monte Serra s.r.l., in seguito definita Emittente.
                    </div>
                  </div>

                  {/* TABELLA PROGRAMMAZIONE SPATIALI E SPOT */}
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#1e293b', color: '#ffffff' }}>
                          <th style={{ padding: '7px 10px', fontWeight: 800 }}>Mezzo / Canale</th>
                          <th style={{ padding: '7px 10px', fontWeight: 800 }}>Formato</th>
                          <th style={{ padding: '7px 10px', fontWeight: 800 }}>Quantità Spot &amp; Periodo</th>
                          <th style={{ padding: '7px 10px', fontWeight: 800 }}>Fascia Oraria</th>
                          <th style={{ padding: '7px 10px', fontWeight: 800 }}>Area Diffusione</th>
                          <th style={{ padding: '7px 10px', fontWeight: 800, textAlign: 'right' }}>Prezzo Spazi</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px 10px', fontWeight: 700, color: '#D43F4A' }}>{contractData.mezzo}</td>
                          <td style={{ padding: '8px 10px', fontWeight: 800 }}>{contractData.formato}</td>
                          <td style={{ padding: '8px 10px' }}>
                            <strong>{contractData.quantitaSpot} spot</strong> complessivi<br/>
                            <span style={{ fontSize: '8px', color: '#64748b' }}>Dal {contractData.dataDecorrenza} al {contractData.dataScadenza}</span>
                          </td>
                          <td style={{ padding: '8px 10px' }}>07:00 – 21:00 (Rotazione)</td>
                          <td style={{ padding: '8px 10px' }}>{contractData.area}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, fontSize: '10px' }}>€ {contractData.prezzoSpazi.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</td>
                        </tr>
                        {contractData.prezzoProduzione > 0 && (
                          <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                            <td colSpan={5} style={{ padding: '7px 10px' }}>
                              <strong>Materiale Pubblicitario:</strong> Realizzazione copy + Registrazione in studio + Diritti di diffusione per emittenti toscane
                            </td>
                            <td style={{ padding: '7px 10px', textAlign: 'right', fontWeight: 800, fontSize: '10px' }}>
                              € {contractData.prezzoProduzione.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* RIEPILOGO ECONOMICO & CONDIZIONI DI PAGAMENTO */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '14px', marginBottom: '16px' }}>
                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px 14px', background: '#f8fafc' }}>
                      <div style={{ fontSize: '9.5px', fontWeight: 900, color: '#1e293b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>
                        Condizioni di Pagamento
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>
                        {contractData.modalitaPagamento}
                      </div>
                      <div style={{ fontSize: '8.5px', color: '#64748b', marginTop: '5px', lineHeight: 1.35 }}>
                        Accredito a favore di <strong>Radio Monte Serra S.r.l.</strong> presso istituto bancario d&apos;appoggio dell&apos;Emittente.
                      </div>
                    </div>

                    <div style={{ border: '1.5px solid #1e293b', borderRadius: '4px', padding: '12px 14px', background: '#1e293b', color: '#ffffff', textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ fontSize: '8.5px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                        TOTALE COMPLESSIVO (IVA ESCLUSA)
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
                        € {contractData.totaleNetto.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                      </div>
                      <div style={{ fontSize: '8px', color: '#cbd5e1', marginTop: '2px' }}>
                        IVA 22% a norma di legge a carico del committente
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  {/* SOTTOSCRIZIONE ORDINARIA EMITTENTE & COMMITTENTE */}
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px 16px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '9px' }}>
                      <div>Luogo e data: <strong>Firenze, lì {new Date().toLocaleDateString('it-IT')}</strong></div>
                      <div style={{ fontSize: '8px', color: '#64748b' }}>Il presente rapporto è regolato dalle condizioni esposte e da quelle generali a tergo</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '38px' }}>PER L&apos;EMITTENTE (Radio Monte Serra S.r.l.)</div>
                        <div style={{ borderBottom: '1px solid #94a3b8', width: '80%', margin: '0 auto 4px' }}></div>
                        <div style={{ fontSize: '9.5px', fontWeight: 700 }}>Fabio Asiri — Direzione Commerciale</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '38px' }}>IL COMMITTENTE (Timbro e Firma)</div>
                        <div style={{ borderBottom: '1px solid #94a3b8', width: '80%', margin: '0 auto 4px' }}></div>
                        <div style={{ fontSize: '9.5px', fontWeight: 700 }}>{contractData.committente || 'Firma Legale Rappresentante'}</div>
                      </div>
                    </div>
                  </div>

                  {/* CLAUSOLE VESSATORIE ART. 1341 E 1342 C.C. */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '9px 12px', fontSize: '7.6px', color: '#64748b', lineHeight: 1.35, background: '#fafafa' }}>
                    <p style={{ margin: '0 0 5px 0' }}>
                      <strong>Approvazione Specifica Clausole ex Artt. 1341 e 1342 C.C.:</strong> Dopo attenta lettura delle condizioni generali di commissione riportate a tergo, si approvano specificatamente le seguenti clausole: 1. DURATA DELLA COMMISSIONE - 2. EFFICACIA E DIVIETO DI CESSIONE - 3. SOTTOSCRIZIONE AGENZIA - 4. REVOCA COMMISSIONE (PENALE 75%) - 5. CESSIONE AZIENDA - 6. RESPONSABILITÀ E MANLEVA MATERIALE - 7. DIRITTI PROPRIETÀ MATERIALE - 8. TERMINI CONSEGNA (10GG) - 9. PROGRAMMAZIONE - 10. MODIFICA PROGRAMMAZIONE (±30 MIN) - 11. RECLAMI (DECADENZA 30GG) - 12. SANZIONI OMESSO PAGAMENTO (INTERESSI D.LGS 231/02) - 13. AUTODISCIPLINA PUBBLICITARIA - 14. ESCLUSIVA - 15. MEZZI IN CONCESSIONE - 16. SPESE DI BOLLO E REGISTRO - 17. COMPETENZA ESCLUSIVA FORO DI FIRENZE - 18. INTERDIPENDENZA CLAUSOLE.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px', marginTop: '6px' }}>
                      <span style={{ fontSize: '8.2px', fontWeight: 800, color: '#1e293b' }}>Firma per approvazione specifica del Committente:</span>
                      <div style={{ borderBottom: '1px solid #94a3b8', width: '200px', height: '14px' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEPARATORE VISIVO SCREEN-ONLY (NASCOSTO IN STAMPA) */}
              <div className="screen-only-page-divider" style={{ textAlign: 'center', margin: '24px 0 20px 0', position: 'relative' }}>
                <div style={{ borderTop: '2px dashed #94a3b8', position: 'absolute', top: '50%', left: 0, right: 0, zIndex: 1 }}></div>
                <span style={{ position: 'relative', zIndex: 2, background: '#1e293b', color: '#f8fafc', padding: '6px 18px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                  📄 Pagina 2 di 2 — Retro: Condizioni Generali di Commissione
                </span>
              </div>

              {/* ========================================================================= */}
              {/* ===== PAGINA 2: CONDIZIONI GENERALI DI COMMISSIONE (RETRO LEGALE INTEGRALE) ===== */}
              {/* ========================================================================= */}
              <div
                className="contract-page-2 contract-page-break a4-page-preview"
                style={{
                  pageBreakBefore: 'always',
                  breakBefore: 'page',
                  background: '#ffffff',
                  color: '#111111',
                  padding: '24px 28px',
                  minHeight: '272mm',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                  borderRadius: '2px',
                  boxSizing: 'border-box'
                }}
              >
                <div>
                  <div style={{ textAlign: 'center', borderBottom: '2px solid #1e293b', paddingBottom: '8px', marginBottom: '14px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      CONDIZIONI GENERALI DI COMMISSIONE — RADIO MONTE SERRA S.R.L.
                    </div>
                    <div style={{ fontSize: '8.5px', color: '#64748b', marginTop: '2px' }}>
                      Condizioni disciplinanti la diffusione e programmazione dei comunicati pubblicitari sulle emittenti Radio Toscana e Radio Firenze
                    </div>
                  </div>

                  {/* TESTO INTEGRALE DEI 18 ARTICOLI IN FORMATO A DUE COLONNE */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', fontSize: '8.2px', lineHeight: 1.38, color: '#1e293b', textAlign: 'justify' }}>
                    <div>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>1. DURATA DELLA COMMISSIONE:</strong> La presente commissione viene stipulata dalle parti per la durata di 12 mesi decorrenti dalla data del perfezionamento secondo le modalità di seguito esposte. Le parti convengono di adottare, ai fini della validità della convenzione, la forma scritta per la conclusione del contratto e per ogni clausola aggiuntiva, modificativa o risolutiva. Se per fatto della ditta Committente lo spazio impegnato non risultasse completamente utilizzato entro i termini convenuti, l&apos;Emittente si riserva il diritto di pretendere, a titolo di risarcimento del danno, una somma pari al 75% del costo della pubblicità non utilizzata.
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>2. EFFICACIA E DIVIETO DI CESSIONE DELLA COMMISSIONE:</strong> La presente commissione impegna immediatamente e irrevocabilmente la ditta Committente: non è utilizzabile a favore di terzi ed è soggetta ad accettazione da parte dell&apos;Emittente. L&apos;esecuzione parziale non costituisce accettazione della totalità della commissione.
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>3. SOTTOSCRIZIONE DA PARTE DI AGENZIA PUBBLICITARIA:</strong> Qualora la presente commissione venga sottoscritta da Agenzia Pubblicitaria per conto di proprio cliente, la medesima Agenzia dovrà fornire adeguata giustificazione scritta dei suoi poteri nelle forme di cui all&apos;art. 1393 c.c. e sarà comunque responsabile in solido con la rappresentante cliente per tutti gli obblighi derivanti dal presente contratto.
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>4. REVOCA DELLA COMMISSIONE:</strong> La commissione può essere revocata solo con il consenso scritto dell&apos;Emittente che è autorizzata a pretendere a titolo di rimborso spese il 75% dell&apos;importo della commissione.
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>5. CESSIONE DELL&apos;AZIENDA:</strong> Nel caso di cessione dell&apos;azienda da parte della ditta Committente, questa si obbliga a far subentrare il cessionario nei diritti e obblighi di cui alla presente commissione, salvo facoltà dell&apos;Emittente di risolvere la commissione entro 30 giorni dalla comunicazione della cessione. Il cedente è, comunque, responsabile insieme al cessionario delle obbligazioni assunte e dei corrispettivi già maturati.
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>6. RESPONSABILITÀ ED OBBLIGHI CIRCA IL MATERIALE PUBBLICITARIO:</strong> Il materiale necessario per le inserzioni pubblicitarie oggetto della presente commissione è fornito dalla ditta Committente (anche se prodotto dall&apos;Emittente); la ditta Committente resta piena ed esclusiva responsabile nei confronti del Fisco, degli Editori, del Pubblico e dei terzi in genere per la pubblicazione dei messaggi pubblicitari; garantisce il proprio diritto all&apos;uso dei testi, slogan pubblicitari, marchi e altre figurazioni, nonché la loro liceità obbligandosi alla manleva nei confronti dell&apos;Emittente. Il materiale pubblicitario sarà programmato solo dopo la dichiarazione di espressa approvazione da parte dell&apos;Emittente che può modificarlo e respingerlo a suo insindacabile giudizio. La ditta Committente dichiara fin da ora di approvare il contenuto del materiale mandato in programmazione rinunciando a ogni e qualsiasi azione nei confronti dell&apos;Emittente per eventuali danni che essa ditta Committente dovesse subire nella preparazione e programmazione del materiale stesso.
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>7. DIRITTI INERENTI LA PROPRIETÀ DEL MATERIALE:</strong> L&apos;Emittente conserva tutti i diritti inerenti alla proprietà del materiale pubblicitario prodotto suo tramite, ivi comprendendosi espressamente il diritto esclusivo alla utilizzazione tecnica e lo sfruttamento economico. In difetto di richiesta scritta e di restituzione l&apos;Emittente ha altresì la facoltà di distruggere il materiale pubblicitario decorsi 90 giorni dalla data della sua ultima pubblicazione. Il materiale fornito dalla ditta Committente non verrà restituito dall&apos;Emittente se non a seguito di esplicita richiesta scritta della Committente da fare pervenire tramite raccomandata con r.r. o PEC entro il termine essenziale di 30 giorni dall&apos;ultima pubblicazione.
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>8. TERMINI CONSEGNA MATERIALE:</strong> La ditta Committente si obbliga a sua cura e sue spese all&apos;approntamento del materiale necessario per la preparazione dei comunicati pubblicitari che dovranno essere consegnati, già conformi ai requisiti richiesti per il mezzo, all&apos;Emittente almeno 10 giorni prima della partenza della pubblicità. La durata e lo spazio del materiale da programmare non potrà essere superiore a quanto concordato nella presente commissione: in caso contrario l&apos;Emittente è fin da ora autorizzata a procedere ai tagli necessari per ridurre lo spazio o la durata del comunicato come concordato nella presente.
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>9. PROGRAMMAZIONE:</strong> La programmazione è quella indicata nella apposita griglia esplicativa riportata nel fronte che le parti dichiarano di avere comunemente concordato con la firma della presente commissione.
                      </p>
                    </div>

                    <div>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>10. MODIFICA DELLA PROGRAMMAZIONE:</strong> Qualsiasi richiesta di modifica o temporanea sospensione che la ditta Committente dovesse avanzare dovrà pervenire all&apos;Emittente almeno 7 giorni prima dell&apos;inizio previsto della programmazione per le modifiche e 30 giorni per le sospensioni. Gli orari di trasmissione della pubblicità possono variare in più o in meno di circa 30 minuti rispetto a quelli convenuti per esigenze di programmazione. Se per qualsivoglia causa o ragione l&apos;Emittente non potesse trasmettere, sia parzialmente che totalmente la pubblicità concordata, il contratto è da ritenersi risolto a tutti gli effetti, obbligandosi a restituire alla ditta Committente le somme già ricevute a titolo di acconto ed eccedenti l&apos;importo della pubblicità già trasmessa, senza interessi e rivalutazione monetaria. Le parti concordano e limitano la responsabilità dell&apos;Emittente solo per le ipotesi di colpa grave e individuano come unica ed esclusiva forma di risarcimento la gratuita ripetizione della trasmissione del messaggio pubblicitario rettificato.
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>11. RECLAMI:</strong> Eventuali reclami della ditta Committente per irregolarità nelle programmazioni pubblicitarie dovranno essere presentati, a pena di decadenza, entro 30 giorni dalla avvenuta uscita pubblicitaria, a mezzo raccomandata con ricevuta di ritorno o PEC. Viene espressamente convenuto e sottoscritto che la proposizione del reclamo non ha efficacia sospensiva sul pagamento del corrispettivo pattuito, che pertanto dovrà essere interamente versato alle scadenze previste: l&apos;inosservanza di quanto sopra comporta l&apos;improcedibilità del reclamo e la risoluzione del contratto per fatto e colpa della ditta Committente. Ai fini della contestazione faranno fede ad ogni effetto i log della regia e le risultanze dell&apos;Emittente.
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>12. SANZIONI PER OMESSO O INCOMPLETO PAGAMENTO NEI TERMINI:</strong> I pagamenti comprensivi di corrispettivi e spese dovranno essere effettuati nei termini pattuiti. Nel caso di mancato rispetto di tale adempimento da parte della ditta Committente, l&apos;Emittente ha il diritto di risolvere il contratto e sospendere la pubblicità addebitando alla ditta Committente i due terzi dell&apos;importo impegnato e non usufruito a titolo di penale. In ogni caso di ritardato pagamento verranno addebitati alla ditta Committente gli interessi di mora al tasso commerciale corrente ai sensi del D.Lgs. 231/2002 unitamente alle spese legali e di recupero. La ditta Committente autorizza l&apos;Emittente all&apos;emissione di ricevute bancarie o all&apos;incasso a mezzo bonifico bancario per l&apos;ammontare del prezzo pattuito nella presente commissione.
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>13. CODICE DI AUTODISCIPLINA PUBBLICITARIA:</strong> La ditta Committente dichiara di accettare senza riserve il Codice di Autodisciplina Pubblicitaria che sa di essere obbligatorio anche per il mezzo e inoltre la competenza del Comitato di Accertamento e del Giurì, impegnandosi a conformarsi in via definitiva alle decisioni di quest&apos;ultimo anche in ordine all&apos;eventuale pubblicazione delle decisioni.
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>14. ESCLUSIVA:</strong> Non sono ammesse clausole di esclusiva o divieti di pubblicità nei confronti di concorrenti della Committente, clausole che comunque, anche se apposte dalla ditta Committente, verranno considerate nulle. L&apos;Emittente potrà trasmettere, contestualmente a ciascun ordine, comunicati di aziende e prodotti concorrenti. Parimenti la ditta Committente non vanta alcun diritto di utilizzare spazi speciali salvo casi da decidersi con apposito accordo scritto con l&apos;Emittente.
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>15. MEZZI IN CONCESSIONE:</strong> Per gli spazi pubblicitari concessi su mezzi terzi, valgono integralmente le disposizioni e i regolamenti tecnici stabiliti dall&apos;Emittente e dalla concessionaria Radio Monte Serra S.r.l.
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>16. SPESE DI BOLLO E DI REGISTRO:</strong> Le spese di bollo e di registro del presente atto anche per il caso d&apos;uso, eventuali imposte e tasse governative, i diritti SIAE, le spese di incasso tra cui quelle di sconto, sono a carico esclusivo della ditta Committente che si obbliga a pagarli a semplice richiesta dell&apos;Emittente.
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>17. COMPETENZA TERRITORIALE ESCLUSIVA:</strong> Competente a decidere in merito a qualsiasi controversia, contestazione o vertenza giudiziaria dipendente dalla presente commissione o connessa alla sua validità, efficacia, interpretazione ed esecuzione è esclusivamente il Foro di Firenze.
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>18. INTERDIPENDENZA ED ESSENZIALITÀ DELLE CLAUSOLE:</strong> Tutte le condizioni suscritte si considerano conosciute e accettate dalla ditta Committente al momento della sottoscrizione della commissione. Esse sono tutte essenziali per l&apos;Emittente e vincolanti per la ditta Committente.
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '14px', borderTop: '1px solid #cbd5e1', paddingTop: '6px', textAlign: 'center', fontSize: '7.5px', color: '#64748b' }}>
                  Radio Monte Serra S.r.l. • Sede Legale ed Amministrativa: Via de&apos; Pucci, 2 - 50122 Firenze • Tel. 055/285030 • Fax 055/283793 • P.IVA 04472740481 • CCIAA Firenze n. 453074
                </div>
              </div>
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

      {/* MODALE EMAIL PROPOSTA COMMERCIALE DEDICATA */}
      {showProposalEmailModal && selectedLeadForProposalEmail && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/logo_radio_toscana.png" alt="Radio Toscana" style={{ height: '28px', width: 'auto' }} />
                <h3 className="modal-title" style={{ margin: 0 }}>✉️ Invia Proposta Commerciale al Cliente</h3>
              </div>
              <button className="modal-close" onClick={() => setShowProposalEmailModal(false)}>✕</button>
            </div>

            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)', marginBottom: '14px', fontSize: '12px' }}>
              Committente: <strong style={{ color: '#fff' }}>{selectedLeadForProposalEmail.nome_azienda_evento}</strong>
              {selectedLeadForProposalEmail.referente ? ` • Referente: ${selectedLeadForProposalEmail.referente}` : ''}
              {` • Valore: € ${selectedLeadForProposalEmail.valore_preventivo.toLocaleString('it-IT')} + IVA`}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">Destinatario Email (A: Cliente)</label>
                <input
                  type="email"
                  className="form-input"
                  value={proposalEmailRecipient}
                  onChange={e => setProposalEmailRecipient(e.target.value)}
                  placeholder="es. andrea.berti@coldiretti.it"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Copia Conoscenza Obbligatoria (CC: Amministrazione)</label>
                <input
                  type="email"
                  className="form-input"
                  value={proposalEmailCc}
                  onChange={e => setProposalEmailCc(e.target.value)}
                  style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', color: '#facc15', fontWeight: 700 }}
                  title="Indirizzo per presa in carico contabile e archivio preventivi"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Oggetto dell&apos;Email</label>
              <input
                type="text"
                className="form-input"
                value={proposalEmailSubject}
                onChange={e => setProposalEmailSubject(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Testo dell&apos;Email Commerciale Ufficiale</label>
              <textarea
                className="form-textarea"
                style={{ height: '220px', fontSize: '12px', lineHeight: 1.4 }}
                value={proposalEmailBody}
                onChange={e => setProposalEmailBody(e.target.value)}
              />
            </div>

            {proposalEmailSentNotification && (
              <div style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '10px', borderRadius: '6px', marginBottom: '12px', textAlign: 'center', fontWeight: 700, fontSize: '12px' }}>
                ✅ Proposta segnata come inviata con CC amministrazione! Data di invio aggiornata sul CRM e cronometro remind avviato.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <button
                className="btn btn-xs"
                style={{ background: 'rgba(255,255,255,0.08)' }}
                onClick={() => {
                  navigator.clipboard.writeText(proposalEmailBody);
                  alert('📋 Testo email copiato negli appunti!');
                }}
              >
                📋 Copia Testo Email
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-xs"
                  style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)', fontWeight: 700 }}
                  onClick={() => {
                    const mailtoUrl = `mailto:${encodeURIComponent(proposalEmailRecipient)}?cc=${encodeURIComponent(proposalEmailCc)}&subject=${encodeURIComponent(proposalEmailSubject)}&body=${encodeURIComponent(proposalEmailBody)}`;
                    window.open(mailtoUrl, '_blank');
                    // Aggiorna data invio
                    updateLeadsAndPersist(prev => prev.map(l => l.id === selectedLeadForProposalEmail.id ? { ...l, data_ultimo_invio: new Date().toISOString().split('T')[0] } : l));
                    setProposalEmailSentNotification(true);
                  }}
                  title="Apre la bozza già pronta con A: e CC: amministrazione nel tuo client email di default (Outlook, Thunderbird, ecc.)"
                >
                  📧 Apri nel Client Email (Outlook con CC)
                </button>

                <button
                  className="btn btn-primary btn-xs"
                  onClick={() => {
                    // Salva timestamp invio sul lead
                    updateLeadsAndPersist(prev => prev.map(l => l.id === selectedLeadForProposalEmail.id ? { ...l, data_ultimo_invio: new Date().toISOString().split('T')[0] } : l));
                    setProposalEmailSentNotification(true);
                    setTimeout(() => {
                      setShowProposalEmailModal(false);
                      alert(`🚀 Proposta Commerciale per "${selectedLeadForProposalEmail.nome_azienda_evento}" registrata come inviata!`);
                    }, 800);
                  }}
                >
                  ✅ Segna come Inviata al Cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE TRASMISSIONE CONTRATTO UFFICIALE RMS CON ALLEGATO PDF & CC AMMINISTRAZIONE */}
      {showContractEmailModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '720px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/logo_radio_toscana.png" alt="Radio Toscana" style={{ height: '28px', width: 'auto' }} />
                <div>
                  <h3 className="modal-title" style={{ margin: 0 }}>📝 Trasmissione Contratto Ufficiale RMS con Allegato PDF</h3>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Invio formale al committente con copia automatica all&apos;amministrazione</div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowContractEmailModal(false)}>✕</button>
            </div>

            {/* BOX RIEPILOGO PRATICA */}
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)', marginBottom: '14px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  Committente: <strong style={{ color: '#fff' }}>{contractData.committente}</strong>
                  {contractData.referente ? ` • Referente: ${contractData.referente}` : ''}
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                    Contratto n. <strong>{contractData.numero}</strong> • Periodo: {contractData.dataDecorrenza} / {contractData.dataScadenza}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--accent-green)' }}>
                    € {contractData.totaleNetto.toLocaleString('it-IT', { minimumFractionDigits: 2 })} + IVA
                  </div>
                  <div style={{ fontSize: '10px', color: '#38bdf8' }}>{contractData.quantitaSpot} Spot ({contractData.formato})</div>
                </div>
              </div>
            </div>

            {/* BOX ALLEGATO PDF EVIDENZIATO */}
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px' }}>📄</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#34d399' }}>
                    Allegato Contratto: Contratto_RMS_{contractData.numero.replace(/\//g, '_')}.pdf
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    Documento A4 ufficiale pronto per essere allegato e sottoscritto dal legale rappresentante
                  </div>
                </div>
              </div>
              <button
                className="btn btn-xs"
                style={{ background: '#0284c7', color: '#fff', fontWeight: 700, borderColor: '#0ea5e9', padding: '6px 12px' }}
                onClick={handlePrintContract}
                title="Salva o visualizza il PDF ufficiale prima di trasmetterlo"
              >
                📥 Scarica / Visiona PDF
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">Destinatario Email (A: Cliente)</label>
                <input
                  type="email"
                  className="form-input"
                  value={contractEmailRecipient}
                  onChange={e => setContractEmailRecipient(e.target.value)}
                  placeholder="es. toscana@coldiretti.it"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Copia Conoscenza Obbligatoria (CC: Amministrazione)</label>
                <input
                  type="email"
                  className="form-input"
                  value={contractEmailCc}
                  onChange={e => setContractEmailCc(e.target.value)}
                  style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', color: '#facc15', fontWeight: 700 }}
                  title="Indirizzo per presa in carico contabile e fatturazione elettronica"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Oggetto dell&apos;Email Ufficiale</label>
              <input
                type="text"
                className="form-input"
                value={contractEmailSubject}
                onChange={e => setContractEmailSubject(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Testo dell&apos;Email di Trasmissione Contratto (Modificabile)</label>
              <textarea
                className="form-textarea"
                style={{ height: '180px', fontSize: '11.5px', lineHeight: 1.45, fontFamily: 'monospace' }}
                value={contractEmailBody}
                onChange={e => setContractEmailBody(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <button
                className="btn btn-xs"
                style={{ background: 'rgba(255,255,255,0.08)' }}
                onClick={() => {
                  navigator.clipboard.writeText(contractEmailBody);
                  alert('📋 Testo email di trasmissione copiato negli appunti!');
                }}
              >
                📋 Copia Testo Email
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-xs"
                  style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)', fontWeight: 700 }}
                  onClick={() => {
                    handlePrintContract();
                    const mailtoUrl = `mailto:${encodeURIComponent(contractEmailRecipient)}?cc=${encodeURIComponent(contractEmailCc)}&subject=${encodeURIComponent(contractEmailSubject)}&body=${encodeURIComponent(contractEmailBody)}`;
                    window.open(mailtoUrl, '_blank');
                    confirmAndActivateContract();
                    setShowContractEmailModal(false);
                  }}
                  title="Scarica il PDF e apre la bozza con A e CC amministrazione su Outlook"
                >
                  📥 Scarica PDF &amp; Apri Outlook (CC Amministrazione)
                </button>

                <button
                  className="btn btn-primary btn-xs"
                  style={{ background: '#16a34a', borderColor: '#22c55e', color: '#fff', fontWeight: 800 }}
                  onClick={() => {
                    handlePrintContract();
                    confirmAndActivateContract();
                    setShowContractEmailModal(false);
                    alert(`🎉 Contratto ${contractData.numero} per "${contractData.committente}" registrato come trasmesso con CC ad amministrazione@radiotoscana.it e spostato in CONTRATTI ATTIVI!`);
                  }}
                  title="Registra l'invio al cliente e CC amministrazione e attiva il contratto nel CRM"
                >
                  ✅ Conferma Invio &amp; Sposta in Contratti Attivi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showTrelloDispatchModal && selectedLeadForTrello && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '720px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>📋</span>
                <div>
                  <h3 className="modal-title" style={{ margin: 0 }}>Genera Scheda Trello Ufficiale &amp; WhatsApp</h3>
                  <p style={{ margin: '3px 0 0', fontSize: '11px', color: '#94a3b8' }}>
                    Commessa di Produzione Audio Spot per collaboratrice esterna
                  </p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowTrelloDispatchModal(false)}>✕</button>
            </div>

            {/* BOX ANTEPRIMA CARD TRELLO */}
            <div style={{ background: 'rgba(0, 121, 191, 0.12)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(0, 121, 191, 0.3)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  📌 ANTEPRIMA SCHEDA TRELLO
                </span>
                <span style={{ fontSize: '11px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  🚨 Scadenza Audio: {trelloCardDueDate}
                </span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                {trelloCardTitle}
              </div>
              <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                Committente: <strong>{selectedLeadForTrello.nome_azienda_evento}</strong> • Referente: <strong>{selectedLeadForTrello.referente || '—'}</strong> ({selectedLeadForTrello.telefono || selectedLeadForTrello.email || '—'})
              </div>
            </div>

            {/* CAMPI DI MODIFICA TITOLO E DESCRIZIONE TRELLO */}
            <div className="form-group">
              <label className="form-label">Titolo Card Trello</label>
              <input
                type="text"
                className="form-input"
                value={trelloCardTitle}
                onChange={e => setTrelloCardTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descrizione Dettagliata &amp; Checklist (Formato Trello Markdown)</label>
              <textarea
                className="form-textarea"
                style={{ height: '170px', fontSize: '11px', fontFamily: 'monospace', lineHeight: 1.35 }}
                value={trelloCardDescription}
                onChange={e => setTrelloCardDescription(e.target.value)}
              />
            </div>

            {/* SEZIONE NOTIFICA WHATSAPP RAPIDA */}
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.25)', marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#4ade80', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span>💬</span> Messaggio WhatsApp di Notifica Rapida per la Collaboratrice:
              </label>
              <textarea
                className="form-textarea"
                style={{ height: '70px', fontSize: '11.5px', marginBottom: '8px' }}
                value={trelloWaMessage}
                onChange={e => setTrelloWaMessage(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-xs"
                  style={{ background: '#22c55e', color: '#ffffff', fontWeight: 800 }}
                  onClick={() => {
                    const waUrl = `https://wa.me/?text=${encodeURIComponent(trelloWaMessage)}`;
                    window.open(waUrl, '_blank');
                  }}
                  title="Apre WhatsApp Web / Desktop con il messaggio precompilato pronto per l'invio"
                >
                  📲 Apri Chat WhatsApp con Notifica
                </button>
                <button
                  className="btn btn-xs"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}
                  onClick={() => {
                    navigator.clipboard.writeText(trelloWaMessage);
                    alert('📋 Messaggio WhatsApp copiato negli appunti!');
                  }}
                >
                  📋 Copia Testo WhatsApp
                </button>
              </div>
            </div>

            {/* BANNER CARD CREATA SU TRELLO */}
            {createdTrelloCardUrl && (
              <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', borderRadius: '6px', padding: '10px 14px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#4ade80', fontSize: '12px', fontWeight: 700 }}>
                  🎉 Card creata con successo su Trello nella colonna &quot;Da Fare&quot; di Edi!
                </span>
                <a
                  href={createdTrelloCardUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-xs"
                  style={{ background: '#22c55e', color: '#000', fontWeight: 800, textDecoration: 'none' }}
                >
                  🔗 Apri Card Diretta
                </a>
              </div>
            )}

            {/* AZIONI DI CHIUSURA & AUTOMAZIONE TRELLO */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', marginTop: '14px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-xs"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                  onClick={() => {
                    const fullCardText = `${trelloCardTitle}\n\nSCADENZA: ${trelloCardDueDate}\n\n${trelloCardDescription}`;
                    navigator.clipboard.writeText(fullCardText);
                    alert('📋 Testo completo della Card Trello copiato negli appunti!');
                  }}
                >
                  📋 Copia Testo Card
                </button>
                <button
                  className="btn btn-xs"
                  style={{ background: '#0079bf', color: '#ffffff', fontWeight: 800 }}
                  onClick={() => window.open(trelloBoardUrl, '_blank')}
                  title="Apre la bacheca di Edi in un nuovo tab"
                >
                  🌐 Apri Bacheca di Edi
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-xs"
                  disabled={isCreatingTrelloCard}
                  style={{ background: isCreatingTrelloCard ? '#64748b' : '#16a34a', color: '#ffffff', fontWeight: 900, border: '1px solid #22c55e', padding: '6px 14px' }}
                  onClick={handleAutoCreateTrelloCard}
                  title="Crea la card direttamente nella colonna Da Fare di Edi via API senza copia/incolla"
                >
                  {isCreatingTrelloCard ? '⏳ Creazione in corso...' : '⚡ Invia a Edi su Trello (1-Click)'}
                </button>

                <button
                  className="btn btn-primary btn-xs"
                  onClick={markAsDispatchedToTrello}
                >
                  ✅ Segna come Inviata
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
