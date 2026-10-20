'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

// Palette Ufficiale Brand Identity Radio Toscana (CMYK/RGB da Brand Manual):
// ANTRACITE SCURO: RGB(71, 67, 80) -> #474350
// ROSSO TOSCANA:   RGB(212, 63, 74) -> #D43F4A
// BIANCO PURO:     RGB(255, 255, 255) -> #FFFFFF
// SFONDO NEUTRO:   #F3F4F6 / #E5E7EB

const TERRITORI = [
  {
    id: 'regionale',
    nome: 'Tutta la Toscana (Rete Regionale)',
    badge: '11 Impianti • 3.200.398 Abitanti',
    ascoltatoriSettimanali: '300.000',
    ascoltatoriGiorno: '63.000',
    frequenze: 'FM 88.0 • 104.7 • 98.2 • 87.8 • 107.6 + DAB+ & Streaming',
    comuni: 'Tutte le 10 province toscane coperte capillarmente da 11 postazioni SRT (tra cui Monte Serra 5 kW e Poggio Firenze 3 kW).',
    descrizione: 'Tutte le 10 province toscane coperte in FM e DAB+. Il massimo impatto per brand regionali, catene e manifestazioni.',
    frequenzaConsigliata: '40-60 spot/settimana'
  },
  {
    id: 'firenze-prato-pistoia',
    nome: 'Zona 1: Firenze, Prato & Pistoia',
    badge: 'Zona 1 • Cuore Produttivo',
    ascoltatoriSettimanali: '185.000',
    ascoltatoriGiorno: '38.000',
    frequenze: '104.7 MHz • 98.2 MHz • Mugello 107.6 • Pontassieve 95.8',
    comuni: 'Firenze, Prato, Pistoia, Scandicci, Sesto Fiorentino, Empoli, Campi Bisenzio, Quarrata, Montemurlo, Bagno a Ripoli, Lastra a Signa.',
    descrizione: 'Il bacino metropolitano con la più alta densità economica e di pendolarismo in auto della Toscana (oltre 1,6 milioni di residenti).',
    frequenzaConsigliata: '30-45 spot/settimana'
  },
  {
    id: 'costa',
    nome: 'Zona 2: Costa Tirrenica (Pisa, Livorno, Lucca, Versilia)',
    badge: 'Zona 2 • Monte Serra 5.000 W (88.0 MHz)',
    ascoltatoriSettimanali: '95.000',
    ascoltatoriGiorno: '21.000',
    frequenze: '88.000 MHz unificata (Monte Serra 5 kW)',
    comuni: 'Pisa, Lucca, Livorno, Viareggio, Massa, Carrara, Pietrasanta, Camaiore, Cecina, Pontedera, Cascina, Piombino, Rosignano.',
    descrizione: 'Copertura continua da Carrara all\'Isola d\'Elba su frequenza unificata 88.0 MHz. Ideale per turismo, retail, nautica e commercio tirrenico.',
    frequenzaConsigliata: '25-35 spot/settimana'
  },
  {
    id: 'sud',
    nome: 'Zona 3: Toscana Interna (Arezzo, Siena, Grosseto)',
    badge: 'Zona 3 • Centro-Sud',
    ascoltatoriSettimanali: '52.000',
    ascoltatoriGiorno: '12.000',
    frequenze: '104.7 MHz (Arezzo/Siena) • 87.8 MHz (Grosseto) • 87.9 MHz (Follonica)',
    comuni: 'Arezzo, Siena, Grosseto, Valdarno, Colle Val d\'Elsa, Cortona, Montevarchi, San Giovanni Valdarno, Follonica.',
    descrizione: 'Raggiunge le famiglie, gli artigiani e le imprese dell\'entroterra toscano e delle vallate produttive e vitivinicole.',
    frequenzaConsigliata: '20-30 spot/settimana'
  }
];

const SPOT_EXAMPLES = [
  {
    id: 'forno',
    titolo: 'Forno & Pasticceria Artigianale',
    durata: '30"',
    audioSrc: '/audio/spot-radio-toscana-forno.mp3',
    descrizione: 'Freschezza, profumo mattutino e richiamo sensoriale durante il drive-time di inizio giornata.',
    claim: '«Il buon pane caldo ti aspetta prima del lavoro»'
  },
  {
    id: 'bar',
    titolo: 'Bar, Bistrot & Ristorazione',
    durata: '30"',
    audioSrc: '/audio/spot-radio-toscana-bar.mp3',
    descrizione: 'Focus su colazioni, pausa pranzo e aperitivo serale con invito all\'azione immediato sul territorio.',
    claim: '«A pranzo scegli la qualità, la pausa che meriti»'
  },
  {
    id: 'fiorista',
    titolo: 'Fiorista & Idee Regalo',
    durata: '30"',
    audioSrc: '/audio/spot-radio-toscana-fiorista.mp3',
    descrizione: 'Emozione, ricorrenze speciali e stimolo all\'acquisto per weekend e momenti unici.',
    claim: '«Un gesto spontaneo dice più di mille parole»'
  }
];

// Matrice Soundwave (Dot-Matrix da Brand Manual Pag. 7)
// Rappresenta le colonne di pallini (da 1 a 6 punti per colonna)
const DOT_COLUMNS = [2, 3, 5, 6, 4, 3, 5, 2, 4, 6, 5, 3, 6, 4, 2, 5, 6, 4, 3, 5, 6, 4, 2, 4, 6, 3, 2];

export default function LandingPubblicitaVarianteB() {
  const [formData, setFormData] = useState({
    azienda: '',
    referente: '',
    telefono: '',
    email: '',
    settore: 'Commercio / Retail',
    bacino: 'Tutta la Toscana (Rete Regionale)',
    obiettivo: 'Portare nuovi clienti in negozio / alla mia attività',
    note: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Player Audio
  const [activeAudioIndex, setActiveAudioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Simulatore
  const [selectedTerritorio, setSelectedTerritorio] = useState(0);
  const [durataCampagna, setDurataCampagna] = useState<'1' | '2' | '4'>('2');

  const formSectionRef = useRef<HTMLDivElement | null>(null);

  const togglePlayAudio = (index: number) => {
    if (activeAudioIndex === index && isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setActiveAudioIndex(index);
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(e => console.log('Audio play error:', e));
        }
      }, 50);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setAudioProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const onAudioEnded = () => {
    setIsPlaying(false);
    setAudioProgress(0);
  };

  const scrollToFormWithPreset = (territorioNome?: string) => {
    if (territorioNome) {
      setFormData(prev => ({ ...prev, bacino: territorioNome }));
    }
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!privacyAccepted) {
      setErrorMsg('È necessario accettare l\'informativa privacy per procedere.');
      return;
    }

    if (!formData.azienda || !formData.telefono) {
      setErrorMsg('Inserisci il nome dell\'attività e un recapito telefonico.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/pubblicita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          azienda: formData.azienda,
          referente: formData.referente,
          telefono: formData.telefono,
          email: formData.email,
          settore: formData.settore,
          obiettivo: `${formData.obiettivo} (Bacino: ${formData.bacino})`,
          note: formData.note,
          source: 'Landing Pubblicità Variante B (Brand Identity 2026)',
          utm_campaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') || 'brand-variant-b' : 'brand-variant-b'
        })
      });

      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(json.error || 'Errore durante la trasmissione. Riprova tra poco.');
      }
    } catch (err) {
      setErrorMsg('Errore di connessione. Riprova tra poco o contattaci telefonicamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#F3F4F6',
      color: '#474350',
      minHeight: '100vh',
      fontFamily: "'Akzidenz-Grotesk', system-ui, -apple-system, sans-serif"
    }}>
      {/* 1. TOP A/B TEST SWITCHER BAR */}
      <div style={{
        background: '#474350',
        borderBottom: '2px solid #D43F4A',
        padding: '8px 16px',
        fontSize: '12px',
        textAlign: 'center',
        color: '#FFFFFF'
      }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{
            background: '#D43F4A',
            color: '#FFFFFF',
            padding: '2px 8px',
            borderRadius: '4px',
            fontFamily: "'Panton Narrow', 'Panton', sans-serif",
            fontWeight: 800,
            fontStyle: 'italic',
            fontSize: '11px',
            letterSpacing: '0.04em'
          }}>
            TEST A/B
          </span>
          <span>Stai visualizzando la <b>Variante B (Nuova Linea Grafica Ufficiale &amp; Performance)</b></span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>•</span>
          <Link href="/pubblicita" style={{ color: '#FCD34D', fontWeight: 700, textDecoration: 'underline' }}>
            Passa alla Variante A (Istituzionale Classica) →
          </Link>
        </div>
      </div>

      {/* 2. HEADER UFFICIALE CON LOGO INCLINATO & CLAIM ROSSO */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        boxShadow: '0 2px 10px rgba(71, 67, 80, 0.06)'
      }}>
        <div style={{
          maxWidth: '1140px',
          margin: '0 auto',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo Brand Ufficiale */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src="/logo_radio_toscana.png"
              alt="Radio Toscana - Solo Toscana | Solo Hit"
              style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
            />
            <div style={{
              borderLeft: '2px solid #D43F4A',
              paddingLeft: '12px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <span style={{
                fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                fontSize: '13px',
                fontWeight: 800,
                fontStyle: 'italic',
                color: '#474350',
                letterSpacing: '0.05em',
                lineHeight: 1.1
              }}>
                UFFICIO PUBBLICITÀ
              </span>
              <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600 }}>
                300.000 Ascoltatori Settimanali (TER) • 3.200.398 Abitanti Coperti (SRT)
              </span>
            </div>
          </div>

          {/* CTA & Telefono */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <a
              href="tel:055285030"
              style={{
                display: 'none',
                color: '#474350',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none'
              }}
              className="header-phone-desktop"
            >
              📞 055 285030
            </a>
            <button
              onClick={() => scrollToFormWithPreset()}
              style={{
                backgroundColor: '#D43F4A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 18px',
                fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                fontSize: '13.5px',
                fontWeight: 800,
                fontStyle: 'italic',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(212, 63, 74, 0.3)',
                transition: 'all 0.15s ease'
              }}
            >
              RICHIEDI PROPOSTA ➔
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION BRAND UFFICIALE (DOPPIA ESPOSIZIONE COPERTINA BRAND MANUAL) */}
      <section style={{
        position: 'relative',
        backgroundColor: '#474350',
        color: '#FFFFFF',
        overflow: 'hidden',
        borderBottom: '4px solid #D43F4A'
      }}>
        {/* Background Image: Doppia Esposizione Ragazza & Colline Toscane */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/radio_toscana_double_exposure.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.22,
          mixBlendMode: 'luminosity'
        }} />

        {/* Claim Background Watermark a 45° (da Brand Manual Pag. 7) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          pointerEvents: 'none',
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            #FFFFFF,
            #FFFFFF 1px,
            transparent 1px,
            transparent 60px
          )`
        }} />

        <div style={{
          position: 'relative',
          maxWidth: '1140px',
          margin: '0 auto',
          padding: '70px 20px 60px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>
          {/* Colonna Testo Hero */}
          <div>
            {/* Pillola Claim Ufficiale */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '999px',
              padding: '6px 14px',
              marginBottom: '20px'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D43F4A', display: 'inline-block' }} />
              <span style={{
                fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#FFFFFF'
              }}>
                SOLO TOSCANA | SOLO HIT
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Panton Narrow', 'Panton', sans-serif",
              fontSize: 'clamp(32px, 5.2vw, 56px)',
              fontWeight: 800,
              fontStyle: 'italic',
              lineHeight: 1.08,
              letterSpacing: '-0.01em',
              marginBottom: '18px',
              color: '#FFFFFF'
            }}>
              LA RADIO NON MOSTRA.<br />
              <span style={{ color: '#D43F4A' }}>FA IMMAGINARE.</span><br />
              E CIÒ CHE IMMAGINI È GIÀ TUO.
            </h1>

            <p style={{
              fontSize: '16px',
              color: '#D1D5DB',
              lineHeight: 1.6,
              marginBottom: '32px',
              maxWidth: '540px'
            }}>
              In automobile la radio vanta il monopolio dell’attenzione (<b>&gt;80%</b>) e un ritorno medio di <b>2,00€ per ogni 1€ investito</b> (Nielsen 2026). Porta nuovi clienti nella tua attività con spot scritti da noi e passaggi nei drive-time più seguiti.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => scrollToFormWithPreset()}
                style={{
                  backgroundColor: '#D43F4A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '16px 28px',
                  fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                  fontSize: '16px',
                  fontWeight: 800,
                  fontStyle: 'italic',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(212, 63, 74, 0.45)'
                }}
              >
                RICHIEDI PREVENTIVO 2026 ➔
              </button>

              <a
                href="#ascolta-spot"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#474350',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '16px 22px',
                  fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                  fontSize: '15px',
                  fontWeight: 800,
                  fontStyle: 'italic',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🎧 ASCOLTA GLI SPOT
              </a>
            </div>
          </div>

          {/* Colonna Destra: 4 Numeri Chiave in Riquadri Brand Identity */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '14px'
          }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderTop: '3px solid #D43F4A',
              borderRadius: '8px',
              padding: '18px'
            }}>
              <div style={{
                fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                fontSize: '34px',
                fontWeight: 800,
                fontStyle: 'italic',
                color: '#FFFFFF',
                lineHeight: 1
              }}>
                300.000
              </div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#F3F4F6', marginTop: '6px' }}>
                Ascoltatori Settimanali
              </div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                Dati Ufficiali TER Toscana
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderTop: '3px solid #D43F4A',
              borderRadius: '8px',
              padding: '18px'
            }}>
              <div style={{
                fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                fontSize: '34px',
                fontWeight: 800,
                fontStyle: 'italic',
                color: '#FCD34D',
                lineHeight: 1
              }}>
                2.00€
              </div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#F3F4F6', marginTop: '6px' }}>
                ROI per ogni 1€ Speso
              </div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                Nielsen Global Compass 2026
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderTop: '3px solid #D43F4A',
              borderRadius: '8px',
              padding: '18px'
            }}>
              <div style={{
                fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                fontSize: '34px',
                fontWeight: 800,
                fontStyle: 'italic',
                color: '#FFFFFF',
                lineHeight: 1
              }}>
                69%
              </div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#F3F4F6', marginTop: '6px' }}>
                Decisori d'Acquisto
              </div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                Responsabili Acquisti TER
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderTop: '3px solid #D43F4A',
              borderRadius: '8px',
              padding: '18px'
            }}>
              <div style={{
                fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                fontSize: '34px',
                fontWeight: 800,
                fontStyle: 'italic',
                color: '#D43F4A',
                lineHeight: 1
              }}>
                3,2M
              </div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#F3F4F6', marginTop: '6px' }}>
                Popolazione Coperta
              </div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                Rilievo Tecnico S.R.T. srl
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SEZIONE SOUNDWAVE DOT-MATRIX PLAYER (DIRETTAMENTE DA BRAND MANUAL PAG. 7) */}
      <section id="ascolta-spot" style={{
        padding: '60px 20px',
        maxWidth: '1140px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 8px 30px rgba(71, 67, 80, 0.08)',
          padding: '40px 30px',
          position: 'relative'
        }}>
          {/* Header Sezione */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
            <div>
              <div style={{
                fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                fontSize: '12px',
                fontWeight: 800,
                color: '#D43F4A',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                ALTRI ELEMENTI • SOUNDWAVE DEMO
              </div>
              <h2 style={{
                fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                fontSize: 'clamp(24px, 3.8vw, 36px)',
                fontWeight: 800,
                fontStyle: 'italic',
                color: '#474350',
                marginTop: '4px'
              }}>
                Ascolta come suona uno spot professionale per la tua attività
              </h2>
              <p style={{ fontSize: '14.5px', color: '#6B7280', maxWidth: '640px' }}>
                Scritto, registrato e prodotto direttamente dai nostri studi con speaker e doppiatori nazionali:
              </p>
            </div>

            {/* Logo Watermark Piccolo */}
            <div style={{ display: 'none' }} className="header-phone-desktop">
              <span style={{
                fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                fontSize: '12px',
                fontWeight: 800,
                fontStyle: 'italic',
                color: '#9CA3AF'
              }}>
                RADIO TOSCANA • STUDIO PRODUZIONI
              </span>
            </div>
          </div>

          {/* Tab di Selezione Settori con Stile Brand Guide */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {SPOT_EXAMPLES.map((spot, idx) => (
              <button
                key={spot.id}
                onClick={() => togglePlayAudio(idx)}
                style={{
                  padding: '11px 18px',
                  borderRadius: '6px',
                  border: activeAudioIndex === idx ? '2px solid #D43F4A' : '1px solid #D1D5DB',
                  backgroundColor: activeAudioIndex === idx ? '#474350' : '#F9FAFB',
                  color: activeAudioIndex === idx ? '#FFFFFF' : '#474350',
                  fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                  fontSize: '14px',
                  fontWeight: 800,
                  fontStyle: 'italic',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{activeAudioIndex === idx && isPlaying ? '⏸' : '▶'}</span>
                <span>{spot.titolo}</span>
                <span style={{ fontSize: '11px', opacity: 0.8 }}>({spot.durata})</span>
              </button>
            ))}
          </div>

          {/* Area Player con Dot-Matrix Soundwave Animata */}
          <div style={{
            backgroundColor: '#474350',
            borderRadius: '12px',
            padding: '24px 28px',
            color: '#FFFFFF'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{
                  fontSize: '11px',
                  fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: '#D43F4A',
                  textTransform: 'uppercase'
                }}>
                  SPOT IN RIPRODUZIONE
                </span>
                <h3 style={{
                  fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                  fontSize: '22px',
                  fontWeight: 800,
                  fontStyle: 'italic',
                  color: '#FFFFFF',
                  margin: '2px 0 4px'
                }}>
                  {SPOT_EXAMPLES[activeAudioIndex].titolo}
                </h3>
                <div style={{ fontSize: '13.5px', color: '#FCD34D', fontStyle: 'italic' }}>
                  {SPOT_EXAMPLES[activeAudioIndex].claim}
                </div>
              </div>

              <button
                onClick={() => togglePlayAudio(activeAudioIndex)}
                style={{
                  backgroundColor: isPlaying ? '#D43F4A' : '#10B981',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '12px 26px',
                  fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                  fontSize: '14px',
                  fontWeight: 800,
                  fontStyle: 'italic',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
                }}
              >
                <span>{isPlaying ? 'FERMA ASCOLTO ⏸' : 'AVVIA ASCOLTO SPOT ▶'}</span>
              </button>
            </div>

            {/* SOUNDWAVE DOT-MATRIX (FEDELE ALLA PAGINA 7 DEL BRAND MANUAL) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              height: '56px',
              padding: '10px 0',
              overflow: 'hidden'
            }}>
              {DOT_COLUMNS.map((numDots, colIdx) => (
                <div
                  key={colIdx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {[...Array(6)].map((_, dotIdx) => {
                    const isLit = dotIdx < numDots;
                    const activeColor = isPlaying
                      ? (colIdx % 4 === 0 ? '#D43F4A' : '#FFFFFF')
                      : '#6B7280';
                    return (
                      <div
                        key={dotIdx}
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: isLit ? activeColor : 'rgba(255,255,255,0.06)',
                          transition: 'background-color 0.2s ease, transform 0.2s ease',
                          transform: isPlaying && isLit ? 'scale(1.15)' : 'scale(1)'
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '5px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: '999px',
              overflow: 'hidden',
              marginTop: '12px'
            }}>
              <div style={{
                width: `${audioProgress}%`,
                height: '100%',
                backgroundColor: '#D43F4A',
                transition: 'width 0.1s linear'
              }} />
            </div>

            <audio
              ref={audioRef}
              src={SPOT_EXAMPLES[activeAudioIndex].audioSrc}
              onTimeUpdate={onTimeUpdate}
              onEnded={onAudioEnded}
            />

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              fontSize: '12px',
              color: '#9CA3AF'
            }}>
              <span>
                ✍️ <b>Produzione Completa:</b> Copywriting persuasivo + Speaker nazionale + Diritti SIAE/SCF inclusi.
              </span>
              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, settore: SPOT_EXAMPLES[activeAudioIndex].titolo }));
                  scrollToFormWithPreset();
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#FCD34D',
                  fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                  fontSize: '13px',
                  fontWeight: 800,
                  fontStyle: 'italic',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Voglio uno spot simile per il mio settore ➔
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. IL SIMULATORE DI COPERTURA TERRITORIALE (LEAD MAGNET) */}
      <section style={{
        padding: '50px 20px',
        maxWidth: '1140px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 36px' }}>
          <span style={{
            fontFamily: "'Panton Narrow', 'Panton', sans-serif",
            fontSize: '12px',
            fontWeight: 800,
            color: '#D43F4A',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            PIANIFICAZIONE TRASPARENTE
          </span>
          <h2 style={{
            fontFamily: "'Panton Narrow', 'Panton', sans-serif",
            fontSize: 'clamp(26px, 4vw, 36px)',
            fontWeight: 800,
            fontStyle: 'italic',
            color: '#474350',
            marginTop: '4px'
          }}>
            Simula il Bacino di Copertura per la tua Zona
          </h2>
          <p style={{ fontSize: '15px', color: '#6B7280' }}>
            Seleziona l'area geografica della tua clientela e verifica la penetrazione stimata:
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'stretch'
        }}>
          {/* Elenco Territori */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {TERRITORI.map((t, idx) => (
              <div
                key={t.id}
                onClick={() => setSelectedTerritorio(idx)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  border: selectedTerritorio === idx ? '2px solid #D43F4A' : '1px solid #E5E7EB',
                  padding: '18px 20px',
                  cursor: 'pointer',
                  boxShadow: selectedTerritorio === idx ? '0 4px 16px rgba(212, 63, 74, 0.15)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <b style={{
                    fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                    fontSize: '17px',
                    fontWeight: 800,
                    fontStyle: 'italic',
                    color: selectedTerritorio === idx ? '#D43F4A' : '#474350'
                  }}>
                    {t.nome}
                  </b>
                  <span style={{
                    fontSize: '11px',
                    fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                    fontWeight: 800,
                    fontStyle: 'italic',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: selectedTerritorio === idx ? '#D43F4A' : '#F3F4F6',
                    color: selectedTerritorio === idx ? '#FFFFFF' : '#474350'
                  }}>
                    {t.badge}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.45 }}>
                  {t.descrizione}
                </div>
              </div>
            ))}
          </div>

          {/* Riquadro Dettaglio Bacino Calcolato */}
          <div style={{
            backgroundColor: '#474350',
            color: '#FFFFFF',
            borderRadius: '14px',
            padding: '28px',
            borderTop: '4px solid #D43F4A',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{
                fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                fontSize: '11.5px',
                fontWeight: 800,
                color: '#D43F4A',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                STIMA UFFICIALE TER TOSCANA
              </span>
              <h3 style={{
                fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                fontSize: '24px',
                fontWeight: 800,
                fontStyle: 'italic',
                color: '#FFFFFF',
                margin: '4px 0 16px'
              }}>
                {TERRITORI[selectedTerritorio].nome}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11.5px', color: '#9CA3AF' }}>Ascoltatori / Settimana</div>
                  <div style={{
                    fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                    fontSize: '28px',
                    fontWeight: 800,
                    fontStyle: 'italic',
                    color: '#D43F4A'
                  }}>
                    {TERRITORI[selectedTerritorio].ascoltatoriSettimanali}
                  </div>
                </div>

                <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11.5px', color: '#9CA3AF' }}>Giorno Medio Tipico</div>
                  <div style={{
                    fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                    fontSize: '28px',
                    fontWeight: 800,
                    fontStyle: 'italic',
                    color: '#FFFFFF'
                  }}>
                    {TERRITORI[selectedTerritorio].ascoltatoriGiorno}
                  </div>
                </div>
              </div>

              {/* Dettaglio Frequenze e Comuni da Rilievo Tecnico SRT & Mediakit */}
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                padding: '12px 14px',
                marginBottom: '16px',
                fontSize: '12px'
              }}>
                <div style={{ color: '#FCD34D', fontWeight: 700, marginBottom: '4px' }}>
                  📻 Frequenze di Trasmissione:
                </div>
                <div style={{ color: '#FFFFFF', fontWeight: 600, marginBottom: '8px' }}>
                  {(TERRITORI[selectedTerritorio] as any).frequenze}
                </div>
                <div style={{ color: '#9CA3AF', fontSize: '11.5px', lineHeight: 1.45 }}>
                  <b style={{ color: '#E5E7EB' }}>Comuni Chiave:</b> {(TERRITORI[selectedTerritorio] as any).comuni}
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '6px',
                padding: '10px 14px',
                fontSize: '12px',
                color: '#D1FAE5',
                marginBottom: '20px'
              }}>
                ✓ <b>Fasce Drive-Time Riservate:</b> Rotazione garantita 7:00-9:30 e 17:00-19:30 • <b>62 min</b> durata media d'ascolto.
              </div>
            </div>

            <button
              onClick={() => scrollToFormWithPreset(TERRITORI[selectedTerritorio].nome)}
              style={{
                width: '100%',
                backgroundColor: '#D43F4A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '14px',
                fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                fontSize: '15px',
                fontWeight: 800,
                fontStyle: 'italic',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 4px 14px rgba(212, 63, 74, 0.4)'
              }}
            >
              RICHIEDI PREVENTIVO PER {TERRITORI[selectedTerritorio].nome.toUpperCase()} ➔
            </button>
          </div>
        </div>
      </section>

      {/* 6. I BENCHMARK SCIENTIFICI NIELSEN 2026 ED EDISON RESEARCH */}
      <section style={{
        padding: '50px 20px',
        maxWidth: '1140px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          padding: '40px 30px'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 36px' }}>
            <span style={{
              fontFamily: "'Panton Narrow', 'Panton', sans-serif",
              fontSize: '12px',
              fontWeight: 800,
              color: '#D43F4A',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              DATI UFFICIALI DI MERCATO 2026
            </span>
            <h2 style={{
              fontFamily: "'Panton Narrow', 'Panton', sans-serif",
              fontSize: 'clamp(24px, 4vw, 34px)',
              fontWeight: 800,
              fontStyle: 'italic',
              color: '#474350',
              marginTop: '4px'
            }}>
              Il Paradosso del Click: Perché la Radio Batte il Digitale nei Risultati Reali
            </h2>
            <p style={{ fontSize: '14.5px', color: '#6B7280' }}>
              Molte aziende credono che sponsorizzare post sui social sia sempre la scelta più redditizia. I report internazionali 2026 dimostrano il contrario:
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {/* Box 1 */}
            <div style={{
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderTop: '3px solid #D43F4A',
              borderRadius: '8px',
              padding: '22px'
            }}>
              <div style={{
                fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                fontSize: '32px',
                fontWeight: 800,
                fontStyle: 'italic',
                color: '#D43F4A',
                marginBottom: '4px'
              }}>
                2.00€ vs 1.52€
              </div>
              <div style={{
                fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                fontSize: '17px',
                fontWeight: 800,
                fontStyle: 'italic',
                color: '#474350',
                marginBottom: '8px'
              }}>
                La Radio Batte Google Search per ROI
              </div>
              <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.55, marginBottom: '14px' }}>
                Per ogni 1€ investito, la radio genera 2,00€ di ritorno medio sulle vendite (il 2° mezzo più redditizio al mondo), superando Google Ads (1,52€), i cartelloni (1,56€), la TV (1,49€) e la stampa (1,15€).
              </p>
              <div style={{ fontSize: '11px', color: '#9CA3AF', borderTop: '1px solid #E5E7EB', paddingTop: '8px' }}>
                📚 <i>Fonte: Nielsen Global Compass Benchmark 2026</i>
              </div>
            </div>

            {/* Box 2 */}
            <div style={{
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderTop: '3px solid #474350',
              borderRadius: '8px',
              padding: '22px'
            }}>
              <div style={{
                fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                fontSize: '32px',
                fontWeight: 800,
                fontStyle: 'italic',
                color: '#474350',
                marginBottom: '4px'
              }}>
                82% vs 15%
              </div>
              <div style={{
                fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                fontSize: '17px',
                fontWeight: 800,
                fontStyle: 'italic',
                color: '#474350',
                marginBottom: '8px'
              }}>
                Il Falso Mito di Spotify e dello Streaming
              </div>
              <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.55, marginBottom: '14px' }}>
                Chi usa piattaforme streaming paga l'abbonamento premium proprio per NON ascoltare spot. L'82% del tempo totale dedicato all'audio commerciale è Radio (61%) e Podcast (21%). Lo streaming con annunci conta solo per il 15%.
              </p>
              <div style={{ fontSize: '11px', color: '#9CA3AF', borderTop: '1px solid #E5E7EB', paddingTop: '8px' }}>
                📚 <i>Fonte: Edison Research "Share of Ear" Q4 2025 / Nielsen 2026</i>
              </div>
            </div>

            {/* Box 3 */}
            <div style={{
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderTop: '3px solid #D43F4A',
              borderRadius: '8px',
              padding: '22px'
            }}>
              <div style={{
                fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                fontSize: '32px',
                fontWeight: 800,
                fontStyle: 'italic',
                color: '#D43F4A',
                marginBottom: '4px'
              }}>
                +126% e +42%
              </div>
              <div style={{
                fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                fontSize: '17px',
                fontWeight: 800,
                fontStyle: 'italic',
                color: '#474350',
                marginBottom: '8px'
              }}>
                Fiducia Territoriale &amp; Moltiplicatore Web
              </div>
              <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.55, marginBottom: '14px' }}>
                La propensione a consigliare un brand sentito in radio supera del +126% gli annunci impersonali sui social. Inoltre, abbinare la radio al web fa decollare del +42% le conversioni digitali grazie alle ricerche spontanee su Google.
              </p>
              <div style={{ fontSize: '11px', color: '#9CA3AF', borderTop: '1px solid #E5E7EB', paddingTop: '8px' }}>
                📚 <i>Fonti: Nielsen Community Study &amp; PoliMI / FCP-Assoradio</i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FORM PREVENTIVO BRAND IDENTITY (ANTRACITE & ROSSO) */}
      <section ref={formSectionRef} style={{
        padding: '50px 20px 80px',
        maxWidth: '1140px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          padding: '40px 28px',
          boxShadow: '0 10px 40px rgba(71, 67, 80, 0.08)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'start'
          }}>
            {/* Sinistra: Garanzie Ufficiali */}
            <div>
              <div style={{
                display: 'inline-block',
                backgroundColor: 'rgba(212, 63, 74, 0.1)',
                border: '1px solid #D43F4A',
                borderRadius: '4px',
                padding: '4px 10px',
                fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                fontSize: '12px',
                fontWeight: 800,
                fontStyle: 'italic',
                color: '#D43F4A',
                marginBottom: '12px',
                letterSpacing: '0.04em'
              }}>
                PACCHETTO START 2026 PER LE IMPRESE TOSCANE
              </div>

              <h2 style={{
                fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                fontSize: 'clamp(26px, 3.8vw, 36px)',
                fontWeight: 800,
                fontStyle: 'italic',
                color: '#474350',
                marginBottom: '14px',
                lineHeight: 1.15
              }}>
                Richiedi la tua Proposta di Pianificazione Radiofonica
              </h2>

              <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.6, marginBottom: '24px' }}>
                Nessun impegno né vincoli a lungo termine. Elaboriamo un piano personalizzato per la tua zona con gli orari ottimali e la bozza di testo per lo spot.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#D43F4A', fontWeight: 900 }}>✓</span>
                  <span style={{ fontSize: '14px', color: '#474350' }}><b>Produzione Spot Inclusa:</b> copywriter e doppiatori professionisti.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#D43F4A', fontWeight: 900 }}>✓</span>
                  <span style={{ fontSize: '14px', color: '#474350' }}><b>Presidio Drive-Time:</b> spot trasmessi negli orari di massimo ascolto in auto.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#D43F4A', fontWeight: 900 }}>✓</span>
                  <span style={{ fontSize: '14px', color: '#474350' }}><b>Risposta Entro 24 Ore:</b> via email o telefono da un nostro consulente dedicato.</span>
                </div>
              </div>

              {/* Contatto Diretto */}
              <div style={{
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '13px',
                color: '#6B7280'
              }}>
                <div style={{
                  fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                  fontWeight: 800,
                  fontStyle: 'italic',
                  color: '#474350',
                  fontSize: '14px',
                  marginBottom: '4px'
                }}>
                  Hai bisogno di chiarimenti immediati?
                </div>
                <div>
                  Ufficio Pubblicità Radio Toscana: <a href="tel:055285030" style={{ color: '#D43F4A', fontWeight: 700, textDecoration: 'none' }}>055 285030</a>
                </div>
                <div style={{ fontSize: '11.5px', color: '#9CA3AF', marginTop: '4px' }}>
                  Sede: Largo Alcide De Gasperi 1, 50136 Firenze (FI)
                </div>
              </div>
            </div>

            {/* Destra: Form */}
            <div style={{
              backgroundColor: '#474350',
              borderRadius: '12px',
              padding: '28px',
              color: '#FFFFFF'
            }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>✨</div>
                  <h3 style={{
                    fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                    fontSize: '24px',
                    fontWeight: 800,
                    fontStyle: 'italic',
                    color: '#FCD34D',
                    marginBottom: '8px'
                  }}>
                    Richiesta Inviata con Successo!
                  </h3>
                  <p style={{ color: '#E5E7EB', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                    Grazie per l'interesse. L'ufficio commerciale di Radio Toscana prenderà in carico i dettagli di <b>{formData.azienda}</b> e ti ricontatterà entro 24 ore.
                  </p>
                  <a
                    href="tel:055285030"
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#D43F4A',
                      color: '#FFFFFF',
                      padding: '10px 18px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                      fontSize: '13.5px',
                      fontWeight: 800,
                      fontStyle: 'italic'
                    }}
                  >
                    Hai urgenza? Chiama lo 055 285030
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#D1D5DB', marginBottom: '4px' }}>
                      Nome dell'Azienda / Attività *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Es. Forno Artigiano Rossi / Concessionaria Auto"
                      value={formData.azienda}
                      onChange={e => setFormData({ ...formData, azienda: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        backgroundColor: '#FFFFFF',
                        color: '#1F2937',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#D1D5DB', marginBottom: '4px' }}>
                        Telefono Diretto *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Es. 333 1234567"
                        value={formData.telefono}
                        onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          backgroundColor: '#FFFFFF',
                          color: '#1F2937',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#D1D5DB', marginBottom: '4px' }}>
                        Referente
                      </label>
                      <input
                        type="text"
                        placeholder="Nome e Cognome"
                        value={formData.referente}
                        onChange={e => setFormData({ ...formData, referente: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          backgroundColor: '#FFFFFF',
                          color: '#1F2937',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#D1D5DB', marginBottom: '4px' }}>
                      Email (opzionale per invio proposta)
                    </label>
                    <input
                      type="email"
                      placeholder="info@tuaazienda.it"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        backgroundColor: '#FFFFFF',
                        color: '#1F2937',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#D1D5DB', marginBottom: '4px' }}>
                        Settore Merceologico
                      </label>
                      <select
                        value={formData.settore}
                        onChange={e => setFormData({ ...formData, settore: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          backgroundColor: '#FFFFFF',
                          color: '#1F2937',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="Commercio / Retail">Commercio / Negozio</option>
                        <option value="Ristorazione / Bar">Ristorazione / Bar / Food</option>
                        <option value="Artigianato / Manifattura">Artigianato / Produzione</option>
                        <option value="Automotive / Motori">Concessionaria / Officina</option>
                        <option value="Servizi / Professionisti">Studi e Servizi B2B</option>
                        <option value="Eventi / Sagre">Eventi / Spettacoli / Fiere</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#D1D5DB', marginBottom: '4px' }}>
                        Bacino Territoriale
                      </label>
                      <select
                        value={formData.bacino}
                        onChange={e => setFormData({ ...formData, bacino: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          backgroundColor: '#FFFFFF',
                          color: '#1F2937',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="Tutta la Toscana (Rete Regionale)">Tutta la Toscana (298k)</option>
                        <option value="Firenze, Prato & Pistoia">Firenze, Prato &amp; Pistoia</option>
                        <option value="Costa Tirrenica (Pisa, Livorno, Lucca)">Costa Tirrenica</option>
                        <option value="Toscana Sud (Arezzo, Siena)">Toscana Sud</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#D1D5DB', marginBottom: '4px' }}>
                      Cosa vorresti promuovere? (Facoltativo)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Es. Apertura nuovo punto vendita, promozione stagionale, evento..."
                      value={formData.note}
                      onChange={e => setFormData({ ...formData, note: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        backgroundColor: '#FFFFFF',
                        color: '#1F2937',
                        fontSize: '13px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Consenso Privacy */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '11.5px', color: '#D1D5DB' }}>
                    <input
                      type="checkbox"
                      checked={privacyAccepted}
                      onChange={e => setPrivacyAccepted(e.target.checked)}
                      style={{ marginTop: '2px' }}
                    />
                    <span>
                      Dichiaro di aver preso visione dell'informativa privacy e acconsento al trattamento dei dati per la formulazione della proposta (GDPR Reg. UE 2016/679).
                    </span>
                  </label>

                  {errorMsg && (
                    <div style={{ backgroundColor: '#EF4444', color: '#FFFFFF', padding: '10px', borderRadius: '6px', fontSize: '12.5px' }}>
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: '#D43F4A',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '15px',
                      fontFamily: "'Panton Narrow', 'Panton', sans-serif",
                      fontSize: '16px',
                      fontWeight: 800,
                      fontStyle: 'italic',
                      letterSpacing: '0.04em',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 14px rgba(212, 63, 74, 0.4)',
                      transition: 'all 0.15s ease',
                      marginTop: '4px'
                    }}
                  >
                    {loading ? 'INVIO IN CORSO...' : 'INVIA RICHIESTA DI PROPOSTA ➔'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER PULITO SOCIETARIO */}
      <footer style={{
        backgroundColor: '#474350',
        color: '#9CA3AF',
        padding: '30px 20px 80px',
        textAlign: 'center',
        fontSize: '12px',
        borderTop: '3px solid #D43F4A'
      }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <img
            src="/logo_radio_toscana.png"
            alt="Radio Toscana"
            style={{ height: '32px', width: 'auto', marginBottom: '8px', filter: 'brightness(1.1)' }}
          />
          <div style={{ color: '#E5E7EB', fontWeight: 600 }}>
            <b>Radio Toscana S.r.l.</b> • Largo Alcide De Gasperi 1, 50136 Firenze (FI) • P.IVA 04584210486
          </div>
          <div>
            Concessione Comunitaria / Commerciale • Emittente Radiofonica Regionale FM e DAB+
          </div>
          <div style={{ color: '#6B7280', fontSize: '11px', marginTop: '6px' }}>
            Variante B (Brand Identity &amp; Performance) • Test A/B attivo
          </div>
        </div>
      </footer>

      {/* 10. STICKY MOBILE BAR (THUMB-FRIENDLY) */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99,
        backgroundColor: '#474350',
        borderTop: '2px solid #D43F4A',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }} className="mobile-only-sticky-bar">
        <a
          href="tel:055285030"
          style={{
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: '#FFFFFF',
            borderRadius: '6px',
            padding: '12px',
            textAlign: 'center',
            fontFamily: "'Panton Narrow', 'Panton', sans-serif",
            fontSize: '14px',
            fontWeight: 800,
            fontStyle: 'italic',
            textDecoration: 'none'
          }}
        >
          📞 CHIAMA
        </a>
        <button
          onClick={() => scrollToFormWithPreset()}
          style={{
            flex: 1.5,
            backgroundColor: '#D43F4A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            padding: '12px',
            fontFamily: "'Panton Narrow', 'Panton', sans-serif",
            fontSize: '14px',
            fontWeight: 800,
            fontStyle: 'italic',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(212, 63, 74, 0.4)'
          }}
        >
          PREVENTIVO ➔
        </button>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .header-phone-desktop {
            display: inline-block !important;
          }
          .mobile-only-sticky-bar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
