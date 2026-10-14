'use client';

import React, { useState } from 'react';

interface PreventivoFormProps {
  initialCompany?: string;
  initialReferente?: string;
  initialTelefono?: string;
  initialEmail?: string;
}

function PreventivoForm({
  initialCompany = '',
  initialReferente = '',
  initialTelefono = '',
  initialEmail = ''
}: PreventivoFormProps) {
  const [formData, setFormData] = useState({
    azienda: initialCompany,
    referente: initialReferente,
    telefono: initialTelefono,
    email: initialEmail,
    settore: 'Commercio / Retail',
    areaInteresse: 'Area 1 (Firenze, Prato, Pistoia)',
    formatoInteresse: 'Spot Tabellari 20"-30"',
    obiettivo: 'Incrementare notorietà e contatti sul territorio toscano',
    note: ''
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  React.useEffect(() => {
    if (initialCompany && !formData.azienda) {
      setFormData(prev => ({
        ...prev,
        azienda: initialCompany,
        referente: initialReferente || prev.referente,
        telefono: initialTelefono || prev.telefono,
        email: initialEmail || prev.email
      }));
    }
  }, [initialCompany, initialReferente, initialTelefono, initialEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/pubblicita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'Landing Istituzionale Radio Toscana 2026',
          utm_campaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') || 'istituzionale-2026' : 'istituzionale-2026'
        })
      });

      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(json.error || 'Errore durante la trasmissione. Riprova tra poco.');
      }
    } catch (err) {
      setErrorMsg('Interruzione di connessione. Riprova tra poco o contattaci telefonicamente.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{
        background: '#f0fdf4',
        border: '2px solid #bbf7d0',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>✨</div>
        <h3 className="font-panton" style={{ fontSize: '26px', fontWeight: 900, fontStyle: 'italic', color: '#166534', marginBottom: '8px' }}>
          Richiesta Ricevuta con Successo!
        </h3>
        <p style={{ color: '#15803d', fontSize: '15px', maxWidth: '520px', margin: '0 auto 20px' }}>
          L'ufficio commerciale di Radio Toscana prenderà in carico la tua richiesta e ti ricontatterà al recapito indicato.
        </p>
        <div style={{ display: 'inline-flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            href={`mailto:commerciale@radiotoscana.it?subject=${encodeURIComponent('Richiesta Pianificazione Pubblicitaria: ' + formData.azienda)}&body=${encodeURIComponent('Buongiorno,\n\nconfermo la richiesta di proposta per ' + formData.azienda + '.\nReferente: ' + (formData.referente || '-') + '\nTelefono: ' + formData.telefono + '\nNote: ' + (formData.note || '-') + '\n\nGrazie')}`}
            className="font-panton"
            style={{
              background: '#D43F4A',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 900,
              fontStyle: 'italic',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>✉️ APRI COPIA EMAIL DIRETTA PER commerciale@radiotoscana.it</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="lead-form-grid">
      <div className="lead-form-col-1">
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#474350', marginBottom: '6px' }}>
          Nome Azienda / Attività *
        </label>
        <input
          type="text"
          required
          placeholder="es. Fattoria di Lavacchio, Tinghi Motors..."
          value={formData.azienda}
          onChange={(e) => setFormData({ ...formData, azienda: e.target.value })}
          className="lead-field-input"
        />
      </div>

      <div className="lead-form-col-1">
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#474350', marginBottom: '6px' }}>
          Nome e Cognome Referente
        </label>
        <input
          type="text"
          placeholder="es. Mario Rossi"
          value={formData.referente}
          onChange={(e) => setFormData({ ...formData, referente: e.target.value })}
          className="lead-field-input"
        />
      </div>

      <div className="lead-form-col-1">
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#474350', marginBottom: '6px' }}>
          Telefono Diretto *
        </label>
        <input
          type="tel"
          required
          placeholder="es. 055 1234567"
          value={formData.telefono}
          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
          className="lead-field-input"
        />
      </div>

      <div className="lead-form-col-1">
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#474350', marginBottom: '6px' }}>
          Email Aziendale
        </label>
        <input
          type="email"
          placeholder="es. direzione@azienda.it"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="lead-field-input"
        />
      </div>

      <div className="lead-form-col-full">
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#474350', marginBottom: '6px' }}>
          Come possiamo aiutarti? (Note o Obiettivo)
        </label>
        <textarea
          rows={4}
          placeholder="es. Vorrei promuovere un nuovo punto vendita, una campagna stagionale, far conoscere la mia attività..."
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          className="lead-field-textarea"
        ></textarea>
      </div>

      {errorMsg && (
        <div className="lead-form-col-full" style={{ color: '#b91c1c', background: '#fee2e2', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="lead-form-col-full" style={{ marginTop: '10px' }}>
        <button
          type="submit"
          disabled={loading}
          className="font-panton"
          style={{
            width: '100%',
            background: '#D43F4A',
            color: '#ffffff',
            border: 'none',
            padding: '16px 24px',
            borderRadius: '8px',
            fontSize: '17px',
            fontWeight: 900,
            fontStyle: 'italic',
            letterSpacing: '0.06em',
            cursor: loading ? 'not-allowed' : 'pointer',
            transform: 'skewX(-4deg)',
            boxShadow: '0 10px 25px rgba(212, 63, 74, 0.4)',
            opacity: loading ? 0.7 : 1
          }}
        >
          <span style={{ transform: 'skewX(4deg)', display: 'inline-block' }}>
            {loading ? 'TRASMISSIONE IN CORSO...' : 'INVIA RICHIESTA E RICEVI PROPOSTA RISERVATA →'}
          </span>
        </button>
        <div style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280', marginTop: '12px' }}>
          🔒 Trattamento dati protetto ai sensi del GDPR. Nessuna comunicazione commerciale indesiderata.
        </div>
      </div>
    </form>
  );
}

export default function LandingPubblicita() {
  const [targetCompany, setTargetCompany] = useState<string>('');
  const [initialLead, setInitialLead] = useState({
    referente: '',
    telefono: '',
    email: '',
    settore: ''
  });

  // Player Audio Interattivo Demo Spot & Format Radio Toscana
  const [activeAudioIndex, setActiveAudioIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const audioDemos = [
    {
      title: 'Spot 01 // "Il Forno & La Schiacciata Calda"',
      category: 'Botteghe, Artigianato & Alimentari',
      desc: '"Un po\' di schiacciata? Arrivo, l\'abbiamo appena sfornata... Ovunque: al bar, dal parrucchiere, in auto. Ogni giorno entriamo nella vita di tanti toscani."',
      url: '/audio/spot-radio-toscana-forno.mp3',
      isLive: false,
      tag: 'ON-AIR SPOT 30"'
    },
    {
      title: 'Spot 02 // "Il Bar & Il Caffè Triplo"',
      category: 'Professionisti, Servizi & Uffici',
      desc: '"Caffè doppio, anzi triplo... Nottataccia? Riunione tra 5 minuti. Siamo accanto alle persone che cerchi. Trasforma Radio Toscana nella tua nuova opportunità di business."',
      url: '/audio/spot-radio-toscana-bar.mp3',
      isLive: false,
      tag: 'ON-AIR SPOT 30"'
    },
    {
      title: 'Spot 03 // "Il Fiorista & Le Rose"',
      category: 'Retail, Shopping & Occasioni Speciali',
      desc: '"Mi serve qualcosa che dica \'Ti penso\', ma che non sembri troppo... Rose, funzionano sempre! Chiamaci allo 055 285030 e fatti sentire adesso."',
      url: '/audio/spot-radio-toscana-fiorista.mp3',
      isLive: false,
      tag: 'ON-AIR SPOT 30"'
    }
  ];

  const sendTelemetry = (event: string, details?: string) => {
    try {
      const az = targetCompany || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('azienda') || new URLSearchParams(window.location.search).get('cliente') || '' : '');
      fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: az || 'Visitatore Diretto',
          url: typeof window !== 'undefined' ? window.location.href : 'Landing Pubblicità',
          event,
          details,
          timestamp: new Date().toISOString()
        })
      }).catch(() => {});
    } catch (_) {}
  };

  const toggleAudio = (index: number) => {
    if (activeAudioIndex === index && isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      setActiveAudioIndex(index);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = audioDemos[index].url;
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
      // Tracciamento ascolto traccia audio
      const demo = audioDemos[index];
      sendTelemetry('AUDIO_PLAY', `${demo.title} (${demo.tag})`);
    }
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const az = params.get('azienda') || params.get('cliente') || '';
      const ref = params.get('referente') || '';
      const tel = params.get('telefono') || '';
      const em = params.get('email') || '';
      const set = params.get('settore') || '';

      if (az) {
        setTargetCompany(az);
        setInitialLead({
          referente: ref,
          telefono: tel,
          email: em,
          settore: set
        });

        // Telemetria apertura landing visitatore noto
        sendTelemetry('LANDING_PUBBLICITA_VISIT');
      }

      // Tracciamento permanenza oltre 35 secondi (Hot Lead)
      const timer = setTimeout(() => {
        sendTelemetry('PAGE_ENGAGED', 'Permanenza > 35 secondi');
      }, 35000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div style={{
      background: '#ffffff',
      color: '#474350',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      minHeight: '100vh',
      lineHeight: 1.6,
      overflowX: 'hidden'
    }}>
      {/* CARICAMENTO FONT UFFICIALI RADIO TOSCANA DA FILE ORIGINALI /fonts */}
      <style dangerouslySetInnerHTML={{ __html: `
        @font-face {
          font-family: 'Panton Narrow';
          src: url('/fonts/panton-narrow-black.otf') format('opentype');
          font-weight: 900;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: 'Berthold Akzidenz Grotesk';
          src: url('/fonts/akzidenzgrotesk-bold.otf') format('opentype');
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }

        .font-panton {
          font-family: 'Panton Narrow', -apple-system, BlinkMacSystemFont, sans-serif !important;
          letter-spacing: 0.03em;
        }

        .font-akzidenz {
          font-family: 'Berthold Akzidenz Grotesk', -apple-system, BlinkMacSystemFont, sans-serif !important;
        }

        body, div, p, span, a, input, select, textarea, button {
          font-family: 'Berthold Akzidenz Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Reset e azzeramento scroll orizzontale */
        html, body {
          width: 100% !important;
          max-width: 100vw !important;
          overflow-x: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          -webkit-text-size-adjust: 100%;
        }

        *, *:before, *:after {
          box-sizing: border-box !important;
        }

        /* Disattivazione smooth scroll globale: previene il rimbalzo continuo durante la digitazione */
        html {
          scroll-behavior: auto !important;
          overscroll-behavior-y: none;
        }

        html:focus-within {
          scroll-behavior: auto !important;
        }

        /* CLASSI STRUTTURALI ADATTIVE */
        .pubb-section {
          padding: 80px 24px;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
        }

        .pubb-container {
          max-width: 1240px;
          margin: 0 auto;
          width: 100%;
        }

        .pubb-grid-hero {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 48px;
          align-items: center;
        }

        .pubb-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 28px;
        }

        .pubb-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .pubb-grid-4 {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
        }

        .pubb-card-pad {
          padding: 36px 30px;
        }

        .pubb-form-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 48px 40px;
          box-shadow: 0 20px 50px rgba(71, 67, 80, 0.1);
          border: 2px solid #e5e7eb;
        }

        /* HEADER & TOPBAR */
        .pubb-topbar {
          background: #474350;
          color: #ffffff;
          font-size: 12px;
          padding: 10px 24px;
          display: flex;
          justifyContent: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          border-bottom: 2px solid #D43F4A;
        }

        .pubb-header-nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .pubb-hero-btn-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        /* FORM */
        .lead-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          align-items: start;
        }

        .lead-form-col-1 {
          grid-column: span 1;
        }

        .lead-form-col-full {
          grid-column: 1 / -1;
        }

        .lead-field-input {
          width: 100%;
          height: 48px;
          padding: 12px 14px;
          border-radius: 8px;
          border: 1.5px solid #d1d5db;
          font-size: 16px !important;
          box-sizing: border-box !important;
          outline: none;
          background-color: #ffffff;
          color: #1f2937;
          touch-action: manipulation;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .lead-field-input:focus {
          border-color: #D43F4A !important;
          box-shadow: 0 0 0 3px rgba(212, 63, 74, 0.18) !important;
        }

        .lead-field-textarea {
          width: 100%;
          padding: 12px 14px;
          border-radius: 8px;
          border: 1.5px solid #d1d5db;
          font-size: 16px !important;
          box-sizing: border-box !important;
          outline: none;
          background-color: #ffffff;
          color: #1f2937;
          resize: vertical;
          min-height: 110px;
          touch-action: manipulation;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .lead-field-textarea:focus {
          border-color: #D43F4A !important;
          box-shadow: 0 0 0 3px rgba(212, 63, 74, 0.18) !important;
        }

        .pubb-btn-text-mob {
          display: none !important;
        }

        /* 📱 TABLET RESPONSIVE (< 960px) */
        @media (max-width: 960px) {
          .pubb-header-nav-links {
            display: none !important;
          }

          .pubb-grid-hero {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }

          .pubb-grid-3 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 20px !important;
          }

          .pubb-grid-4 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 16px !important;
          }
        }

        /* 📱 SMARTPHONE RESPONSIVE (< 680px) */
        @media (max-width: 680px) {
          .pubb-top-promo-banner {
            display: none !important;
          }

          .pubb-section {
            padding: 36px 14px !important;
          }

          .pubb-container {
            padding: 0 14px !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }

          .pubb-topbar {
            padding: 8px 12px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }

          .pubb-topbar-links {
            width: 100% !important;
            display: flex !important;
            justifyContent: space-between !important;
            gap: 8px !important;
          }

          .pubb-header-inner {
            padding: 8px 12px !important;
          }

          .pubb-header-logo {
            height: 32px !important;
          }

          .pubb-header-claim {
            display: none !important;
          }

          .pubb-header-btn-desk {
            padding: 6px 12px !important;
            font-size: 11px !important;
            letter-spacing: 0.02em !important;
            transform: none !important;
          }

          .pubb-header-btn-desk span {
            transform: none !important;
          }

          .pubb-btn-text-desk {
            display: none !important;
          }

          .pubb-btn-text-mob {
            display: inline-block !important;
          }

          .pubb-badge-skew {
            transform: none !important;
            font-size: 10px !important;
            padding: 4px 8px !important;
          }

          .pubb-badge-skew span {
            transform: none !important;
          }

          .pubb-hero-btn-row {
            flex-direction: column !important;
            gap: 10px !important;
            width: 100% !important;
          }

          .pubb-btn-hero-main, .pubb-btn-hero-sec {
            width: 100% !important;
            text-align: center !important;
            justify-content: center !important;
            padding: 13px 14px !important;
            font-size: 13px !important;
            white-space: normal !important;
            transform: none !important;
            box-sizing: border-box !important;
          }

          .pubb-btn-hero-main span, .pubb-btn-hero-sec span {
            transform: none !important;
          }

          .pubb-soundwave-label {
            display: none !important;
          }

          .pubb-grid-2, .pubb-grid-3, .pubb-grid-4 {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }

          .lead-form-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }

          .lead-form-col-1 {
            grid-column: 1 / -1 !important;
          }

          .pubb-card-pad {
            padding: 20px 14px !important;
          }

          .pubb-form-card {
            padding: 24px 14px !important;
            border-radius: 12px !important;
          }

          .pubb-soundwave-row {
            max-width: 100% !important;
            overflow-x: hidden !important;
          }

          .pubb-footer-wrap {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
        }
      `}} />

      {/* BANNER INTESTAZIONE ISTITUZIONALE PUBBLICITÀ */}
      <div className="pubb-top-promo-banner" style={{
        background: 'linear-gradient(90deg, #D43F4A 0%, #991b1b 100%)',
        color: '#ffffff',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        boxShadow: '0 4px 12px rgba(212, 63, 74, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>🎙️</span>
          <div>
            <div style={{ fontWeight: 900, fontSize: '13px', letterSpacing: '0.02em' }}>
              PIANIFICAZIONE PUBBLICITARIA RADIO TOSCANA 2026
            </div>
            <div style={{ fontSize: '11px', opacity: 0.9 }}>
              Dati TER certificati, copertura regionale FM/DAB+ per le imprese toscane.
            </div>
          </div>
        </div>
        <a
          href="#preventivo"
          style={{
            background: '#ffffff',
            color: '#D43F4A',
            padding: '6px 12px',
            borderRadius: '4px',
            fontWeight: 800,
            fontSize: '11px',
            textDecoration: 'none',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap'
          }}
        >
          Modulo Proposta ↓
        </a>
      </div>

      {/* 1. TOP BAR ISTITUZIONALE & CONTATTI COMMERCIALI */}
      <div className="pubb-topbar">
        {/* Dati Certificati & Copertura */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '12px' }}>
            🎙️ 298.000 ascoltatori settimanali TER
          </span>
          <span style={{ color: '#94a3b8' }}>•</span>
          <span className="font-panton" style={{ color: '#e2e8f0', fontSize: '12px', letterSpacing: '0.04em' }}>
            Copertura Regionale FM & DAB+ Toscana
          </span>
        </div>

        {/* Canali Ufficiali Sede */}
        <div className="pubb-topbar-links" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '12px' }}>
          <a
            href="mailto:commerciale@radiotoscana.it"
            onClick={() => sendTelemetry('CLICK_EMAIL', 'commerciale@radiotoscana.it')}
            style={{
              color: '#ffffff',
              background: 'rgba(255,255,255,0.12)',
              padding: '4px 10px',
              borderRadius: '9999px',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px'
            }}
          >
            <span>✉️ commerciale@radiotoscana.it</span>
          </a>

          <a
            href="tel:055285030"
            onClick={() => sendTelemetry('CLICK_PHONE', '055 285030')}
            style={{
              color: '#ffffff',
              background: 'rgba(255,255,255,0.12)',
              padding: '4px 10px',
              borderRadius: '9999px',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px'
            }}
          >
            <span>📞 055 285030</span>
          </a>
        </div>
      </div>

      {/* 2. HEADER UFFICIALE CON LOGO & EDITORIALE */}
      <header style={{
        background: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 4px 18px rgba(71, 67, 80, 0.04)'
      }}>
        <div className="pubb-header-inner" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* Logo Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src="/logo_radio_toscana.png"
              alt="Radio Toscana"
              className="pubb-header-logo"
              style={{
                height: '46px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
            <div className="pubb-header-claim" style={{ borderLeft: '2px solid #D43F4A', paddingLeft: '12px' }}>
              <div className="font-panton" style={{
                fontSize: '13px',
                fontWeight: 900,
                fontStyle: 'italic',
                letterSpacing: '0.06em',
                color: '#D43F4A',
                textTransform: 'uppercase'
              }}>
                SOLO TOSCANA | SOLO HIT
              </div>
              <div style={{ fontSize: '11px', color: '#474350', fontWeight: 600 }}>
                Emittente Regionale della Toscana • Ufficio Pubblicità
              </div>
            </div>
          </div>

          {/* Navigazione Desktop */}
          <nav className="pubb-header-nav-links">
            <a href="#perche-la-radio" style={{ textDecoration: 'none', color: '#474350', fontWeight: 600, fontSize: '14px' }}>
              Perché la Radio Rende
            </a>
            <a href="#drivetosite" style={{ textDecoration: 'none', color: '#474350', fontWeight: 600, fontSize: '14px' }}>
              Drive-to-Store & Territorio
            </a>
            <a href="#copertura" style={{ textDecoration: 'none', color: '#474350', fontWeight: 600, fontSize: '14px' }}>
              Bacini e Frequenze
            </a>
          </nav>

          {/* Bottone CTA Header sempre visibile e compatto su mobile */}
          <a
            href="#preventivo"
            className="font-panton pubb-header-btn-desk"
            style={{
              background: '#D43F4A',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '10px 18px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 900,
              fontStyle: 'italic',
              letterSpacing: '0.04em',
              boxShadow: '0 6px 18px rgba(212, 63, 74, 0.35)',
              transform: 'skewX(-6deg)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            <span className="pubb-btn-text-desk" style={{ transform: 'skewX(6deg)' }}>RICHIEDI PROPOSTA 2026 →</span>
            <span className="pubb-btn-text-mob" style={{ transform: 'skewX(6deg)' }}>PREVENTIVO →</span>
          </a>
        </div>
      </header>

      {/* 3. HERO SECTION AUTOREVOLE CON VISUAL DOUBLE EXPOSURE (BRAND BOOK RADIO TOSCANA) */}
      <section className="pubb-section" style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #fdfdfd 0%, #f7f7f9 100%)',
        overflow: 'hidden'
      }}>
        <div className="pubb-container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="pubb-grid-hero">
            {/* Testo Principale */}
            <div>
              {/* Badge Ufficiale Logo Inclinato */}
              <div style={{ display: 'inline-block', marginBottom: '18px', maxWidth: '100%' }}>
                <div className="font-panton pubb-badge-skew" style={{
                  background: '#474350',
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  letterSpacing: '0.06em',
                  transform: 'skewX(-8deg)',
                  boxShadow: '0 6px 15px rgba(71, 67, 80, 0.15)',
                  maxWidth: '100%'
                }}>
                  <span style={{ transform: 'skewX(8deg)', display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#D43F4A' }}>●</span> AUTOREVOLEZZA & RADICAMENTO TERRITORIALE
                  </span>
                </div>
              </div>

              <h1 className="font-panton" style={{
                fontSize: 'clamp(26px, 4.5vw, 54px)',
                fontWeight: 900,
                fontStyle: 'italic',
                lineHeight: 1.12,
                color: '#474350',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                marginBottom: '18px'
              }}>
                La radio non mostra.<br />
                <span style={{ color: '#D43F4A' }}>Fa immaginare.</span><br />
                E ciò che immagini è già tuo.
              </h1>

              {/* Soundwave a matrice grafica dal brand book (pagina 7) */}
              <div className="pubb-soundwave-row" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                height: '28px',
                margin: '14px 0 22px',
                maxWidth: '100%',
                overflow: 'hidden'
              }}>
                {[6, 12, 18, 26, 16, 22, 28, 20, 14, 24, 28, 18, 10, 22, 28, 14, 8, 16, 24, 18, 10, 6].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: '4px',
                      height: `${h}px`,
                      borderRadius: '2px',
                      background: i % 3 === 0 ? '#D43F4A' : '#474350',
                      opacity: 0.85,
                      flexShrink: 0
                    }}
                  ></div>
                ))}
                <span className="font-panton pubb-soundwave-label" style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#6b7280',
                  letterSpacing: '0.1em',
                  marginLeft: '8px',
                  textTransform: 'uppercase'
                }}>
                  DIFFUSIONE CAPILLARE FM & DAB+
                </span>
              </div>

              <p style={{
                fontSize: '16px',
                color: '#474350',
                lineHeight: 1.6,
                marginBottom: '28px',
                fontWeight: 450
              }}>
                In un ecosistema digitale saturo di notifiche volatili e banner ignorati, <b>Radio Toscana</b> unisce la credibilità dell'informazione regionale e la forza della grande musica: la voce dell'emittente entra ogni giorno nella quotidianità di <b>298.000 toscani</b>.
              </p>

              <div className="pubb-hero-btn-row">
                <a
                  href="#preventivo"
                  className="font-panton pubb-btn-hero-main"
                  style={{
                    background: '#D43F4A',
                    color: '#ffffff',
                    textDecoration: 'none',
                    padding: '16px 28px',
                    borderRadius: '6px',
                    fontSize: '15px',
                    fontWeight: 900,
                    fontStyle: 'italic',
                    letterSpacing: '0.05em',
                    transform: 'skewX(-6deg)',
                    boxShadow: '0 10px 25px rgba(212, 63, 74, 0.4)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ transform: 'skewX(6deg)' }}>PIANIFICA LA TUA CAMPAGNA 2026 →</span>
                </a>

                <a
                  href="#perche-la-radio"
                  className="font-panton pubb-btn-hero-sec"
                  style={{
                    background: '#ffffff',
                    color: '#474350',
                    textDecoration: 'none',
                    padding: '16px 24px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 800,
                    fontStyle: 'italic',
                    letterSpacing: '0.05em',
                    border: '2px solid #474350',
                    transform: 'skewX(-6deg)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ transform: 'skewX(6deg)' }}>I DATI DI EFFICACIA AUDIO ↓</span>
                </a>
              </div>
            </div>

            {/* Visual Double Exposure Ufficiale (Brand Book Pagina 1 e 8) */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '100%' }}>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(71, 67, 80, 0.16)',
                border: '4px solid #ffffff',
                position: 'relative'
              }}>
                <img
                  src="/radio_toscana_double_exposure.jpg?v=2026"
                  alt="Radio Toscana - Ascolto autentico e territorio toscano"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />

                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  right: '12px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  <div className="font-panton" style={{
                    fontSize: '12px',
                    fontWeight: 900,
                    fontStyle: 'italic',
                    color: '#474350'
                  }}>
                    LA VOCE DEL TERRITORIO TOSCANO
                  </div>
                  <div className="font-panton" style={{
                    background: '#D43F4A',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 900,
                    fontStyle: 'italic'
                  }}>
                    SOLO TOSCANA | SOLO HIT
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BRAND PARTNER DI FIDUCIA // CLK ITALIA & GRANDI MARCHI */}
      <section style={{
        padding: '28px 16px',
        background: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        <div className="pubb-container" style={{ textAlign: 'center' }}>
          <div className="font-panton" style={{
            fontSize: '12px',
            fontWeight: 800,
            fontStyle: 'italic',
            letterSpacing: '0.1em',
            color: '#6b7280',
            marginBottom: '16px'
          }}>
            AZIENDE E GRANDI REALTÀ CHE SCELGONO RADIO TOSCANA PER CRESCERE
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div className="font-panton" style={{
              padding: '6px 14px',
              borderRadius: '6px',
              background: '#f8fafc',
              border: '2px solid #D43F4A',
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: '13px',
              letterSpacing: '0.04em',
              color: '#D43F4A',
              transform: 'skewX(-6deg)'
            }}>
              <span style={{ transform: 'skewX(6deg)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span>●</span> FIRENZE FIERA
              </span>
            </div>

            <div className="font-panton" style={{
              padding: '6px 14px',
              borderRadius: '6px',
              background: '#f8fafc',
              border: '2px solid #474350',
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: '13px',
              letterSpacing: '0.04em',
              color: '#474350',
              transform: 'skewX(-6deg)'
            }}>
              <span style={{ transform: 'skewX(6deg)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span>●</span> COLDIRETTI TOSCANA
              </span>
            </div>

            <div className="font-panton" style={{ fontWeight: 900, fontStyle: 'italic', fontSize: '13px', color: '#474350', letterSpacing: '0.04em' }}>
              UNICOOP FIRENZE
            </div>
            <div className="font-panton" style={{ fontWeight: 900, fontStyle: 'italic', fontSize: '13px', color: '#474350', letterSpacing: '0.04em' }}>
              CONFESERCENTI TOSCANA
            </div>
            <div className="font-panton" style={{ fontWeight: 900, fontStyle: 'italic', fontSize: '13px', color: '#474350', letterSpacing: '0.04em' }}>
              FONDAZIONE MEYER
            </div>
            <div className="font-panton" style={{ fontWeight: 900, fontStyle: 'italic', fontSize: '13px', color: '#474350', letterSpacing: '0.04em' }}>
              FATTORIA DI LAVACCHIO
            </div>
            <div className="font-panton" style={{ fontWeight: 900, fontStyle: 'italic', fontSize: '13px', color: '#474350', letterSpacing: '0.04em' }}>
              TINGHI MOTORS
            </div>
            <div className="font-panton" style={{ fontWeight: 900, fontStyle: 'italic', fontSize: '13px', color: '#474350', letterSpacing: '0.04em' }}>
              TOSCANA AEROPORTI
            </div>
            <div className="font-panton" style={{ fontWeight: 900, fontStyle: 'italic', fontSize: '13px', color: '#474350', letterSpacing: '0.04em' }}>
              MERCATO CENTRALE FIRENZE
            </div>
            <div className="font-panton" style={{ fontWeight: 900, fontStyle: 'italic', fontSize: '13px', color: '#474350', letterSpacing: '0.04em' }}>
              FIVAG CISL
            </div>
            <div className="font-panton" style={{ fontWeight: 900, fontStyle: 'italic', fontSize: '13px', color: '#474350', letterSpacing: '0.04em' }}>
              CARITAS FIRENZE
            </div>
          </div>
        </div>
      </section>

      {/* 5. DATI SCIENTIFICI DI EFFICACIA: ASSORADIO / POLIMI & LARADIORENDE */}
      <section id="perche-la-radio" className="pubb-section" style={{ background: '#ffffff' }}>
        <div className="pubb-container">
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px' }}>
            <div className="font-panton" style={{
              color: '#D43F4A',
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: '13px',
              letterSpacing: '0.08em'
            }}>
              EVIDENZE SCIENTIFICHE DALL'OSSERVATORIO FCP-ASSORADIO & POLIMI
            </div>
            <h2 className="font-panton" style={{
              fontSize: 'clamp(26px, 3.6vw, 44px)',
              fontWeight: 900,
              fontStyle: 'italic',
              color: '#474350',
              marginTop: '10px',
              lineHeight: 1.15
            }}>
              Perché la Radio Genera il Massimo Ritorno per la Tua Impresa
            </h2>
            <p style={{ color: '#6b7280', fontSize: '15px', marginTop: '12px' }}>
              La combinazione unica di ascolto in mobilità, costo contatto competitivo e assenza di filtri digitali rende l'audio lo strumento commerciale più redditizio.
            </p>
          </div>

          {/* 3 Metric Box Istituzionali */}
          <div className="pubb-grid-3" style={{ marginBottom: '32px' }}>
            <div style={{
              background: '#f9fafb',
              padding: '24px',
              borderRadius: '12px',
              borderLeft: '4px solid #D43F4A',
              borderTop: '1px solid #e5e7eb',
              borderRight: '1px solid #e5e7eb',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div className="font-panton" style={{ fontSize: '12px', fontWeight: 900, fontStyle: 'italic', color: '#6b7280' }}>
                MOLTIPLICATORE FATTURATO
              </div>
              <div className="font-panton" style={{ fontSize: '24px', fontWeight: 900, fontStyle: 'italic', color: '#474350', margin: '6px 0' }}>
                10€ di Ritorno per 1€ Investito
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                Studio scientifico FCP / Politecnico di Milano sul ROI medio della pianificazione radiofonica continuativa.
              </div>
            </div>

            <div style={{
              background: '#f9fafb',
              padding: '24px',
              borderRadius: '12px',
              borderLeft: '4px solid #474350',
              borderTop: '1px solid #e5e7eb',
              borderRight: '1px solid #e5e7eb',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div className="font-panton" style={{ fontSize: '12px', fontWeight: 900, fontStyle: 'italic', color: '#6b7280' }}>
                RICERCA DIGITALE IMMEDIATA
              </div>
              <div className="font-panton" style={{ fontSize: '24px', fontWeight: 900, fontStyle: 'italic', color: '#474350', margin: '6px 0' }}>
                58% Drive-to-Web in 90 Minuti
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                La maggioranza degli ascoltatori effettua una ricerca su Google del brand entro un'ora e mezza dal passaggio on-air.
              </div>
            </div>

            <div style={{
              background: '#f9fafb',
              padding: '24px',
              borderRadius: '12px',
              borderLeft: '4px solid #D43F4A',
              borderTop: '1px solid #e5e7eb',
              borderRight: '1px solid #e5e7eb',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div className="font-panton" style={{ fontSize: '12px', fontWeight: 900, fontStyle: 'italic', color: '#6b7280' }}>
                ASCOLTO FUORI CASA
              </div>
              <div className="font-panton" style={{ fontSize: '24px', fontWeight: 900, fontStyle: 'italic', color: '#474350', margin: '6px 0' }}>
                75% in Mobilità e in Auto
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                Il contatto avviene mentre i consumatori si spostano per lavoro, acquisti e tempo libero nel territorio regionale.
              </div>
            </div>
          </div>

          {/* 4 Pilastri di Efficacia */}
          <div className="pubb-grid-4">
            <div style={{
              background: '#f9fafb',
              borderRadius: '14px',
              padding: '24px 20px',
              border: '1px solid #e5e7eb',
              borderTop: '4px solid #D43F4A'
            }}>
              <div className="font-panton" style={{ fontSize: '12px', fontWeight: 900, fontStyle: 'italic', color: '#D43F4A', marginBottom: '8px' }}>
                PILASTRO 01 // PSICOACUSTICA
              </div>
              <h3 className="font-panton" style={{ fontSize: '19px', fontWeight: 900, fontStyle: 'italic', color: '#474350', marginBottom: '8px' }}>
                L'Effetto Immaginazione
              </h3>
              <p style={{ color: '#474350', fontSize: '13px', lineHeight: 1.6 }}>
                Non imponendo un'immagine rigida sullo schermo, la voce induce l'ascoltatore a visualizzare il prodotto, aumentando l'intenzione d'acquisto fino a 3 volte.
              </p>
            </div>

            <div style={{
              background: '#f9fafb',
              borderRadius: '14px',
              padding: '24px 20px',
              border: '1px solid #e5e7eb',
              borderTop: '4px solid #474350'
            }}>
              <div className="font-panton" style={{ fontSize: '12px', fontWeight: 900, fontStyle: 'italic', color: '#474350', marginBottom: '8px' }}>
                PILASTRO 02 // CALL TO ACTION
              </div>
              <h3 className="font-panton" style={{ fontSize: '19px', fontWeight: 900, fontStyle: 'italic', color: '#474350', marginBottom: '8px' }}>
                Drive-to-Store & Territorio
              </h3>
              <p style={{ color: '#474350', fontSize: '13px', lineHeight: 1.6 }}>
                L'ascolto avviene prima dell'acquisto, spesso in auto. Il 58% cerca il nome dell'azienda su Google o naviga il sito entro un'ora e mezza dal messaggio on-air.
              </p>
            </div>

            <div style={{
              background: '#f9fafb',
              borderRadius: '14px',
              padding: '24px 20px',
              border: '1px solid #e5e7eb',
              borderTop: '4px solid #D43F4A'
            }}>
              <div className="font-panton" style={{ fontSize: '12px', fontWeight: 900, fontStyle: 'italic', color: '#D43F4A', marginBottom: '8px' }}>
                PILASTRO 03 // RESISTENZA AL BLOCCO
              </div>
              <h3 className="font-panton" style={{ fontSize: '19px', fontWeight: 900, fontStyle: 'italic', color: '#474350', marginBottom: '8px' }}>
                100% Ascolto Reale No-Skip
              </h3>
              <p style={{ color: '#474350', fontSize: '13px', lineHeight: 1.6 }}>
                Mani sul volante, occhi sulla strada: la radio non soffre di banner blindness né di skip. Lo spot viene ascoltato dall'inizio alla fine.
              </p>
            </div>

            <div style={{
              background: '#f9fafb',
              borderRadius: '14px',
              padding: '24px 20px',
              border: '1px solid #e5e7eb',
              borderTop: '4px solid #474350'
            }}>
              <div className="font-panton" style={{ fontSize: '12px', fontWeight: 900, fontStyle: 'italic', color: '#474350', marginBottom: '8px' }}>
                PILASTRO 04 // REDDITIVITÀ
              </div>
              <h3 className="font-panton" style={{ fontSize: '19px', fontWeight: 900, fontStyle: 'italic', color: '#474350', marginBottom: '8px' }}>
                ROI Moltiplicatore x10
              </h3>
              <p style={{ color: '#474350', fontSize: '13px', lineHeight: 1.6 }}>
                Ogni euro investito in radio genera mediamente 10 euro di fatturato. Il minor costo per contatto della pianificazione toscana protegge il budget aziendale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5-BIS. PLAYER AUDIO INTERATTIVO // ASCOLTA I FORMAT E GLI SPOT */}
      <section id="demo-audio" className="pubb-section" style={{
        background: '#1e1b24',
        color: '#ffffff',
        borderTop: '3px solid #D43F4A',
        borderBottom: '3px solid #D43F4A'
      }}>
        {/* Hidden Audio Element */}
        <audio ref={audioRef} preload="none" onEnded={() => setIsPlaying(false)} />

        <div className="pubb-container">
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px' }}>
            <div className="font-panton" style={{
              background: '#D43F4A',
              color: '#ffffff',
              display: 'inline-block',
              padding: '5px 12px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 900,
              fontStyle: 'italic',
              letterSpacing: '0.08em',
              transform: 'skewX(-8deg)',
              marginBottom: '12px'
            }}>
              <span style={{ transform: 'skewX(8deg)', display: 'inline-block' }}>
                🎙️ ESPERIENZA D'ASCOLTO INTERATTIVA
              </span>
            </div>
            <h2 className="font-panton" style={{
              fontSize: 'clamp(24px, 3.4vw, 40px)',
              fontWeight: 900,
              fontStyle: 'italic',
              color: '#ffffff',
              lineHeight: 1.15
            }}>
              Ascolta la Qualità dei Nostri Format &amp; il Sound di Radio Toscana
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '15px', marginTop: '10px' }}>
              Dallo spot promozionale ad alto impatto per retail, fino allo storytelling redazionale e al jingle: seleziona una traccia e prova l'esperienza on-air.
            </p>
          </div>

          <div className="pubb-grid-3">
            {audioDemos.map((demo, idx) => {
              const active = activeAudioIndex === idx && isPlaying;
              return (
                <div
                  key={idx}
                  onClick={() => toggleAudio(idx)}
                  style={{
                    background: active ? 'linear-gradient(135deg, rgba(212, 63, 74, 0.25) 0%, rgba(30, 27, 36, 0.95) 100%)' : '#282430',
                    border: active ? '2px solid #D43F4A' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: active ? '0 12px 30px rgba(212, 63, 74, 0.35)' : '0 6px 16px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minWidth: 0
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span className="font-panton" style={{
                        fontSize: '11px',
                        fontWeight: 900,
                        color: active ? '#ffffff' : '#D43F4A',
                        background: active ? '#D43F4A' : 'rgba(212, 63, 74, 0.15)',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        letterSpacing: '0.08em',
                        fontStyle: 'italic'
                      }}>
                        {demo.tag}
                      </span>

                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: active ? '#D43F4A' : '#ffffff',
                        color: active ? '#ffffff' : '#1e1b24',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '15px',
                        fontWeight: 900,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
                      }}>
                        {active ? '⏸' : '▶'}
                      </div>
                    </div>

                    <h3 className="font-panton" style={{
                      fontSize: '18px',
                      fontWeight: 900,
                      fontStyle: 'italic',
                      color: '#ffffff',
                      marginBottom: '6px'
                    }}>
                      {demo.title}
                    </h3>

                    <div style={{ fontSize: '13px', color: '#f87171', fontWeight: 600, marginBottom: '8px' }}>
                      {demo.category}
                    </div>

                    <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: 1.55 }}>
                      {demo.desc}
                    </p>
                  </div>

                  <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: active ? '#4ade80' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: active ? '#22c55e' : '#94a3b8', display: 'inline-block' }}></span>
                      {active ? 'In Riproduzione...' : 'Clicca per Ascoltare'}
                    </span>
                    <span className="font-panton" style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>
                      HD 128 KBPS
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. DRIVE-TO-STORE & VISUAL FIRENZE */}
      <section id="drivetosite" className="pubb-section" style={{
        background: '#f7f7f9',
        borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div className="pubb-container">
          <div className="pubb-grid-hero">
            <div>
              <div className="font-panton" style={{
                background: '#D43F4A',
                color: '#ffffff',
                display: 'inline-block',
                padding: '5px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 900,
                fontStyle: 'italic',
                transform: 'skewX(-8deg)',
                marginBottom: '14px'
              }}>
                <span style={{ transform: 'skewX(8deg)', display: 'inline-block' }}>
                  DALL'ON-AIR AL NEGOZIO FISICO & SITO WEB
                </span>
              </div>

              <h2 className="font-panton" style={{
                fontSize: 'clamp(24px, 3.2vw, 38px)',
                fontWeight: 900,
                fontStyle: 'italic',
                color: '#474350',
                lineHeight: 1.18,
                marginBottom: '16px'
              }}>
                Come Radio Toscana Porta Clienti Reali alla Tua Impresa
              </h2>

              <p style={{ color: '#474350', fontSize: '15px', lineHeight: 1.65, marginBottom: '22px' }}>
                Negli spostamenti quotidiani tra Firenze, Prato, Pistoia, l'arco tirrenico e l'entroterra, la radio è la voce fidata e autorevole per centinaia di migliaia di residenti e professionisti.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    background: '#D43F4A',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '12px',
                    flexShrink: 0
                  }}>✓</div>
                  <div>
                    <b style={{ color: '#474350' }}>67% Responsabili d'Acquisto:</b>{' '}
                    <span style={{ color: '#6b7280' }}>Il pubblico decide le spese della famiglia o dell'azienda durante l'ascolto quotidiano.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    background: '#D43F4A',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '12px',
                    flexShrink: 0
                  }}>✓</div>
                  <div>
                    <b style={{ color: '#474350' }}>Top of Mind sul Territorio:</b>{' '}
                    <span style={{ color: '#6b7280' }}>La ripetizione costante del tuo messaggio crea familiarità e riconoscibilità immediata.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    background: '#D43F4A',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '12px',
                    flexShrink: 0
                  }}>✓</div>
                  <div>
                    <b style={{ color: '#474350' }}>Amplificatore Digitale (+42%):</b>{' '}
                    <span style={{ color: '#6b7280' }}>Integrata con campagne social o Google Ads, la radio fa decollare il tasso di conversione delle inserzioni online.</span>
                  </div>
                </div>
              </div>

              <a
                href="#preventivo"
                className="font-panton pubb-btn-hero-main"
                style={{
                  background: '#474350',
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: '14px 24px',
                  borderRadius: '6px',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  fontSize: '14px',
                  letterSpacing: '0.05em',
                  transform: 'skewX(-6deg)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ transform: 'skewX(6deg)' }}>CONFIGURA LA TUA CAMPAGNA LOCALE →</span>
              </a>
            </div>

            {/* Immagine Auto Sintonizzata su Radio Toscana */}
            <div style={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 45px rgba(71, 67, 80, 0.16)',
              border: '4px solid #ffffff',
              maxWidth: '100%'
            }}>
              <img
                src="/auto_radio_toscana.jpg?v=2026_v4"
                alt="Auto sintonizzata su Radio Toscana 104.7 FM DAB+ lungo le strade della Toscana"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. COPERTURA E LE 4 AREE GEOGRAFICHE TOSCANE */}
      <section id="copertura" className="pubb-section" style={{ background: '#ffffff' }}>
        <div className="pubb-container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 36px' }}>
            <div className="font-panton" style={{
              color: '#D43F4A',
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: '13px',
              letterSpacing: '0.08em'
            }}>
              FLESSIBILITÀ DI PIANIFICAZIONE TERRITORIALE
            </div>
            <h2 className="font-panton" style={{
              fontSize: 'clamp(24px, 3.2vw, 36px)',
              fontWeight: 900,
              fontStyle: 'italic',
              color: '#474350',
              marginTop: '8px'
            }}>
              I 4 Macro-Bacini Commerciali della Toscana
            </h2>
          </div>

          <div className="pubb-grid-4">
            <div style={{ background: '#f9fafb', padding: '22px', borderRadius: '12px', border: '1px solid #e5e7eb', borderLeft: '4px solid #D43F4A' }}>
              <div className="font-panton" style={{ fontSize: '12px', fontWeight: 900, fontStyle: 'italic', color: '#D43F4A' }}>AREA 1 • METROPOLITANA</div>
              <div className="font-panton" style={{ fontSize: '18px', fontWeight: 900, fontStyle: 'italic', color: '#474350', margin: '4px 0' }}>Firenze, Prato, Pistoia</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>104.7 FM & 88.0 FM. Il bacino a massima densità commerciale, uffici e retail.</div>
            </div>

            <div style={{ background: '#f9fafb', padding: '22px', borderRadius: '12px', border: '1px solid #e5e7eb', borderLeft: '4px solid #474350' }}>
              <div className="font-panton" style={{ fontSize: '12px', fontWeight: 900, fontStyle: 'italic', color: '#474350' }}>AREA 2 • POLO TIRRENICO</div>
              <div className="font-panton" style={{ fontSize: '18px', fontWeight: 900, fontStyle: 'italic', color: '#474350', margin: '4px 0' }}>Pisa, Lucca, Livorno</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>102.8 FM & DAB+. Polo logistico, universitario e costiero ad alta mobilità.</div>
            </div>

            <div style={{ background: '#f9fafb', padding: '22px', borderRadius: '12px', border: '1px solid #e5e7eb', borderLeft: '4px solid #D43F4A' }}>
              <div className="font-panton" style={{ fontSize: '12px', fontWeight: 900, fontStyle: 'italic', color: '#D43F4A' }}>AREA 3 • ENTROTERRA & VALLI</div>
              <div className="font-panton" style={{ fontSize: '18px', fontWeight: 900, fontStyle: 'italic', color: '#474350', margin: '4px 0' }}>Arezzo, Siena, Grosseto</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>Copertura strategica per artigianato d'eccellenza, manifattura e turismo.</div>
            </div>

            <div style={{ background: '#f9fafb', padding: '22px', borderRadius: '12px', border: '1px solid #e5e7eb', borderLeft: '4px solid #474350' }}>
              <div className="font-panton" style={{ fontSize: '12px', fontWeight: 900, fontStyle: 'italic', color: '#474350' }}>AREA 4 • DIGITAL &amp; MULTIPLATFORM</div>
              <div className="font-panton" style={{ fontSize: '18px', fontWeight: 900, fontStyle: 'italic', color: '#474350', margin: '4px 0' }}>Streaming, App, Web &amp; Podcast</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>Piattaforma streaming HD, App Radio Toscana e Smart Speaker per un'audience sempre connessa.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7-BIS. CONFRONTO: CARTELLONISTICA STRADALE vs RADIO TOSCANA */}
      <section className="pubb-section" style={{
        background: '#f1f5f9',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div className="pubb-container" style={{ maxWidth: '1120px' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}>
            <div className="font-panton" style={{
              color: '#D43F4A',
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: '13px',
              letterSpacing: '0.1em'
            }}>
              EFFICIENZA DI BUDGET // DOVE VANNO DAVVERO I TUOI SOLDI?
            </div>
            <h2 className="font-panton" style={{
              fontSize: 'clamp(24px, 3.2vw, 38px)',
              fontWeight: 900,
              fontStyle: 'italic',
              color: '#474350',
              marginTop: '10px',
              lineHeight: 1.2
            }}>
              Cartelli Stradali 70x100 vs Radio Toscana FM &amp; DAB+
            </h2>
            <p style={{ color: '#64748b', fontSize: '15px', marginTop: '10px' }}>
              Molte manifestazioni e PMI investono migliaia di euro in cartelli cartacei o manifesti fosforescenti. Ecco perché la voce on-air batte la carta 10 a 1 per tasso di conversione.
            </p>
          </div>

          <div className="pubb-grid-2">
            {/* Box Cartelloni */}
            <div className="pubb-card-pad" style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '2px solid #e2e8f0',
              boxShadow: '0 10px 25px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span style={{ fontSize: '22px' }}>🛑</span>
                <h3 className="font-panton" style={{ fontSize: '19px', fontWeight: 900, fontStyle: 'italic', color: '#64748b' }}>
                  Cartelloni 70x100 &amp; Manifesti
                </h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#64748b' }}>
                <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#ef4444', fontWeight: 900 }}>✕</span>
                  <span><b>Visibilità 1,2 secondi:</b> chi guida a 60-90 km/h non riesce a leggere data, luogo o programma.</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#ef4444', fontWeight: 900 }}>✕</span>
                  <span><b>Zero copertura regionale:</b> visibili solo a chi passa fisicamente da quella specifica rotatoria.</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#ef4444', fontWeight: 900 }}>✕</span>
                  <span><b>Costi nascosti alti:</b> stampa, affissione, tasse comunali di pubblicità e deterioramento da pioggia.</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#ef4444', fontWeight: 900 }}>✕</span>
                  <span><b>Nessuna emozione:</b> un foglio di carta statico non trasmette calore né autorevolezza.</span>
                </li>
              </ul>
            </div>

            {/* Box Radio Toscana */}
            <div className="pubb-card-pad" style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '3px solid #D43F4A',
              boxShadow: '0 16px 35px rgba(212, 63, 74, 0.12)',
              position: 'relative'
            }}>
              <div className="font-panton" style={{
                position: 'absolute',
                top: '-13px',
                right: '20px',
                background: '#D43F4A',
                color: '#ffffff',
                padding: '3px 12px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 900,
                letterSpacing: '0.06em',
                fontStyle: 'italic'
              }}>
                SCELTA STRATEGICA ROI x10
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span style={{ fontSize: '22px' }}>🎙️</span>
                <h3 className="font-panton" style={{ fontSize: '19px', fontWeight: 900, fontStyle: 'italic', color: '#D43F4A' }}>
                  Campagna Radio Toscana
                </h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#334155' }}>
                <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#22c55e', fontWeight: 900 }}>✓</span>
                  <span><b>20-30 Secondi di Attenzione Pura:</b> lo spot entra nell'abitacolo durante il drive-time senza distrazioni.</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#22c55e', fontWeight: 900 }}>✓</span>
                  <span><b>298.000 Ascoltatori TER:</b> raggiunge chi viaggia da Firenze, Prato, Pistoia, Pisa, Lucca, Livorno, Arezzo e Siena.</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#22c55e', fontWeight: 900 }}>✓</span>
                  <span><b>Drive-to-Web Immediato (58%):</b> l'automobilista cerca l'evento o l'azienda direttamente dallo smartphone all'arrivo.</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#22c55e', fontWeight: 900 }}>✓</span>
                  <span><b>Formula Chiavi in Mano:</b> copywriting, produzione audio professionale e messa in onda inclusi.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FORM DI PIANIFICAZIONE RISERVATA */}
      <section id="preventivo" className="pubb-section" style={{
        background: '#f7f7f9',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div className="pubb-form-card">
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div className="font-panton" style={{
                background: '#474350',
                color: '#ffffff',
                display: 'inline-block',
                padding: '5px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 900,
                fontStyle: 'italic',
                transform: 'skewX(-8deg)',
                marginBottom: '10px'
              }}>
                <span style={{ transform: 'skewX(8deg)', display: 'inline-block' }}>
                  PIANIFICAZIONE MEDIA RISERVATA 2026
                </span>
              </div>
              <h2 className="font-panton" style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 900, fontStyle: 'italic', color: '#474350' }}>
                Richiedi la Proposta Commerciale per la Tua Azienda
              </h2>
              <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '6px' }}>
                Il nostro ufficio pianificazione ti fornirà la stima di copertura e il listino agevolato per il tuo bacino d'interesse.
              </p>
            </div>

            <PreventivoForm
              initialCompany={targetCompany}
              initialReferente={initialLead.referente}
              initialTelefono={initialLead.telefono}
              initialEmail={initialLead.email}
            />
          </div>
        </div>
      </section>

      {/* 9. FOOTER UFFICIALE RADIO MONTE SERRA S.R.L. */}
      <footer style={{
        background: '#474350',
        color: '#d1d5db',
        padding: '48px 20px 32px',
        borderTop: '3px solid #D43F4A'
      }}>
        <div className="pubb-container">
          <div className="pubb-footer-wrap" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
            paddingBottom: '28px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img
                src="/logo_radio_toscana.png"
                alt="Radio Toscana"
                style={{
                  height: '42px',
                  width: 'auto'
                }}
              />
              <div style={{ borderLeft: '2px solid #D43F4A', paddingLeft: '12px' }}>
                <div className="font-panton" style={{ color: '#ffffff', fontWeight: 900, fontStyle: 'italic', fontSize: '14px' }}>
                  RADIO MONTE SERRA S.R.L.
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                  Emittente Regionale della Toscana • Sede Operativa: Firenze
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', fontSize: '13px' }}>
              <span style={{ color: '#ffffff', fontWeight: 600 }}>Ufficio Pubblicità:</span>
              <a href="tel:055285030" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 700 }}>
                📞 055 285030
              </a>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
              <a href="mailto:commerciale@radiotoscana.it" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 600 }}>
                ✉️ commerciale@radiotoscana.it
              </a>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '11px',
            color: '#9ca3af'
          }}>
            <div>
              © 2026 Radio Toscana (Radio Monte Serra S.r.l.) - Tutti i diritti riservati. P.IVA 01228220508.
            </div>
            <div className="font-panton" style={{ fontStyle: 'italic', letterSpacing: '0.04em' }}>
              DATI UFFICIALI TER (TAVOLO EDITORI RADIO) • METRICHE DI EFFICACIA FCP-ASSORADIO
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
