'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// Dati per il simulatore di copertura territoriale
const TERRITORI = [
  {
    id: 'regionale',
    nome: 'Tutta la Toscana (Rete Regionale)',
    badge: 'Massima Copertura',
    ascoltatoriSettimanali: '298.000',
    ascoltatoriGiorno: '61.000',
    descrizione: 'Tutte le 10 province toscane coperte in FM e DAB+. Il massimo impatto per brand regionali, catene e manifestazioni.',
    frequenzaConsigliata: '40-60 spot/settimana'
  },
  {
    id: 'firenze-prato-pistoia',
    nome: 'Firenze, Prato & Pistoia',
    badge: 'Cuore Produttivo',
    ascoltatoriSettimanali: '185.000',
    ascoltatoriGiorno: '38.000',
    descrizione: 'Il bacino metropolitano con la più alta densità economica e di pendolarismo in auto della Toscana.',
    frequenzaConsigliata: '30-45 spot/settimana'
  },
  {
    id: 'costa',
    nome: 'Costa Tirrenica (Pisa, Livorno, Lucca, Versilia)',
    badge: 'Bacino Tirreno',
    ascoltatoriSettimanali: '92.000',
    ascoltatoriGiorno: '19.000',
    descrizione: 'Copertura ideale per il commercio costiero, artigianato, nautica e turismo da Viareggio a Cecina.',
    frequenzaConsigliata: '25-35 spot/settimana'
  },
  {
    id: 'sud',
    nome: 'Toscana Sud (Arezzo, Siena & Valdichiana)',
    badge: 'Centro-Sud',
    ascoltatoriSettimanali: '48.000',
    ascoltatoriGiorno: '10.500',
    descrizione: 'Raggiunge le famiglie e le imprese dell\'entroterra toscano e delle vallate produttive.',
    frequenzaConsigliata: '20-30 spot/settimana'
  }
];

const SPOT_EXAMPLES = [
  {
    id: 'forno',
    titolo: 'Forno & Pasticceria Artigianale',
    durata: '30"',
    audioSrc: '/audio/spot-radio-toscana-forno.mp3',
    descrizione: 'Focus su freschezza, profumo e richiamo sensoriale mattutino durante il drive-time.',
    claim: '«Il buon pane caldo ti aspetta prima del lavoro»'
  },
  {
    id: 'bar',
    titolo: 'Bar, Bistrot & Ristorazione',
    durata: '30"',
    audioSrc: '/audio/spot-radio-toscana-bar.mp3',
    descrizione: 'Puntato sulle pause pranzo e l\'aperitivo serale con invito all\'azione immediato.',
    claim: '«A pranzo scegli la qualità, la pausa che meriti»'
  },
  {
    id: 'fiorista',
    titolo: 'Fiorista & Idee Regalo',
    durata: '30"',
    audioSrc: '/audio/spot-radio-toscana-fiorista.mp3',
    descrizione: 'Emozione, ricorrenze e drive-to-store per occasioni speciali e weekend.',
    claim: '«Un gesto spontaneo dice più di mille parole»'
  }
];

export default function LandingPubblicitaVarianteB() {
  // Stato Form
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

  // Stato Audio Player
  const [activeAudioIndex, setActiveAudioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stato Simulatore Territoriale
  const [selectedTerritorio, setSelectedTerritorio] = useState(0);
  const [durataCampagna, setDurataCampagna] = useState<'1' | '2' | '4'>('2');

  const formSectionRef = useRef<HTMLDivElement | null>(null);

  // Gestione Riproduzione Audio
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
          audioRef.current.play().catch(e => console.log('Audio autoplay blocked:', e));
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

  // Scroll rapido al form con preselezione
  const scrollToFormWithPreset = (territorioNome?: string) => {
    if (territorioNome) {
      setFormData(prev => ({ ...prev, bacino: territorioNome }));
    }
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Invio Form Inbound
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
          obiettivo: `${formData.obiettivo} (Bacino: ${formData.bacino}, Durata: ${durataCampagna} settimane)`,
          note: formData.note,
          source: 'Landing Pubblicità Variante B (Performance 2026)',
          utm_campaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') || 'ab-variant-b' : 'ab-variant-b'
        })
      });

      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(json.error || 'Errore durante la trasmissione. Riprova tra poco.');
      }
    } catch (err) {
      setErrorMsg('Errore di connessione. Riprova tra qualche istante o chiamaci direttamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#070A0F',
      color: '#F8FAFC',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 1. TOP A/B TEST SWITCHER BAR */}
      <div style={{
        background: 'linear-gradient(90deg, #1E1B4B 0%, #311042 50%, #1E1B4B 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '8px 16px',
        fontSize: '12px',
        textAlign: 'center',
        color: '#E0E7FF'
      }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{
            background: '#4338CA',
            color: '#FFFFFF',
            padding: '2px 8px',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: '10.5px'
          }}>
            TEST A/B ATTIVO
          </span>
          <span>Stai visualizzando la <b>Variante B (Performance &amp; Direct Response)</b></span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>•</span>
          <Link href="/pubblicita" style={{ color: '#FCD34D', fontWeight: 600, textDecoration: 'underline' }}>
            Visualizza la Variante A (Istituzionale) →
          </Link>
        </div>
      </div>

      {/* 2. STICKY HEADER MINIMAL (ZERO LEAKS) */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(7, 10, 15, 0.85)',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{
          maxWidth: '1140px',
          margin: '0 auto',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/logo_radio_toscana.png"
              alt="Radio Toscana"
              style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
            />
            <div style={{
              borderLeft: '1px solid rgba(255,255,255,0.2)',
              paddingLeft: '12px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', fontWeight: 700 }}>
                Ufficio Pubblicità
              </span>
              <span style={{ fontSize: '12.5px', color: '#F8FAFC', fontWeight: 600 }}>
                Copertura Regionale 2026
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href="tel:055285030"
              style={{
                display: 'none',
                color: '#CBD5E1',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
              className="header-phone-desktop"
            >
              📞 055 285030
            </a>
            <button
              onClick={() => scrollToFormWithPreset()}
              style={{
                background: 'linear-gradient(135deg, #D43F4A 0%, #B91C1C 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 18px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(212, 63, 74, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              Richiedi Proposta ⚡
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (HIGH CONVERSION / FRAMER STYLE) */}
      <section style={{
        position: 'relative',
        padding: '64px 20px 50px',
        maxWidth: '1140px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        {/* Glow circolare di sfondo */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '250px',
          background: 'radial-gradient(ellipse at center, rgba(212,63,74,0.22) 0%, rgba(7,10,15,0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Trust Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '999px',
            padding: '6px 16px',
            fontSize: '12px',
            color: '#CBD5E1',
            marginBottom: '24px'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 8px #10B981' }} />
            <span><b>298.000</b> ascoltatori ogni settimana in Toscana • <i>Dati Ufficiali TER 2026</i></span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 54px)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '20px',
            color: '#FFFFFF'
          }}>
            Fai sentire la tua voce <br />
            <span style={{
              background: 'linear-gradient(90deg, #F87171 0%, #FBBF24 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              prima che i clienti entrino nei negozi.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: '#94A3B8',
            maxWidth: '720px',
            margin: '0 auto 36px',
            lineHeight: 1.6
          }}>
            In auto la radio vanta il monopolio dell’attenzione (<b>&gt;80%</b>) e un ritorno di <b>2,00€ per ogni 1€ investito</b> (Nielsen 2026). Portiamo clienti al tuo punto vendita con spot scritti da professionisti e tracciamento verificato.
          </p>

          {/* Azioni Principali */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
            <button
              onClick={() => scrollToFormWithPreset()}
              style={{
                background: 'linear-gradient(135deg, #D43F4A 0%, #991B1B 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '16px 30px',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(212, 63, 74, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Richiedi Preventivo Gratuito ➔
            </button>

            <a
              href="#ascolta-spot"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: '#F8FAFC',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                padding: '16px 24px',
                fontSize: '15px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🎧 Ascolta Esempi di Spot
            </a>
          </div>

          {/* 4 Statistiche Snapshot */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '14px',
            textAlign: 'left'
          }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#F87171' }}>298.000</div>
              <div style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 600 }}>Ascoltatori Settimanali</div>
              <div style={{ fontSize: '10.5px', color: '#64748B' }}>Dati Ufficiali TER Toscana</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#38BDF8' }}>2.00€ per 1€</div>
              <div style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 600 }}>ROI Medio Certificato</div>
              <div style={{ fontSize: '10.5px', color: '#64748B' }}>Nielsen Global Compass 2026</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#34D399' }}>67%</div>
              <div style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 600 }}>Responsabili Acquisti</div>
              <div style={{ fontSize: '10.5px', color: '#64748B' }}>Decisori Spesa Famiglia/Azienda</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#FBBF24' }}>&gt;80%</div>
              <div style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 600 }}>Ascolto in Automobile</div>
              <div style={{ fontSize: '10.5px', color: '#64748B' }}>Monopolio Drive-Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SEZIONE AUDIO PLAYER INTERATTIVO (MICRO-DEMO IN TEMPO REALE) */}
      <section id="ascolta-spot" style={{
        padding: '50px 20px',
        maxWidth: '1140px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'linear-gradient(180deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '20px',
          padding: '36px 24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Header Sezione */}
          <div style={{ maxWidth: '640px', marginBottom: '28px' }}>
            <span style={{
              color: '#818CF8',
              fontSize: '11.5px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              Ascolto Diretto Senza Impegno
            </span>
            <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 800, color: '#FFFFFF', marginTop: '6px', marginBottom: '10px' }}>
              Ascolta come suona uno spot prodotto per la tua attività
            </h2>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.5 }}>
              Tutti gli spot di Radio Toscana sono scritti e incisi con doppiatori e speaker professionisti. Clicca sui settori qui sotto e ascolta l’effetto immediato:
            </p>
          </div>

          {/* Tag / Selettore Settori */}
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '24px'
          }}>
            {SPOT_EXAMPLES.map((spot, idx) => (
              <button
                key={spot.id}
                onClick={() => togglePlayAudio(idx)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: activeAudioIndex === idx ? '1px solid #818CF8' : '1px solid rgba(255,255,255,0.1)',
                  background: activeAudioIndex === idx ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.03)',
                  color: activeAudioIndex === idx ? '#FFFFFF' : '#CBD5E1',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{activeAudioIndex === idx && isPlaying ? '⏸️' : '▶️'}</span>
                <span>{spot.titolo}</span>
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>({spot.durata})</span>
              </button>
            ))}
          </div>

          {/* Card Player con Visualizzatore Onde Sonore */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '14px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#818CF8', fontWeight: 700, textTransform: 'uppercase' }}>
                  In Riproduzione
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
                  {SPOT_EXAMPLES[activeAudioIndex].titolo}
                </div>
                <div style={{ fontSize: '13px', color: '#FCD34D', fontStyle: 'italic', marginTop: '4px' }}>
                  {SPOT_EXAMPLES[activeAudioIndex].claim}
                </div>
              </div>

              <button
                onClick={() => togglePlayAudio(activeAudioIndex)}
                style={{
                  background: isPlaying ? '#EF4444' : '#10B981',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: isPlaying ? '0 0 16px rgba(239, 68, 68, 0.4)' : '0 0 16px rgba(16, 185, 129, 0.4)'
                }}
              >
                <span>{isPlaying ? 'Ferma Ascolto ⏸' : 'Avvia Ascolto ▶'}</span>
              </button>
            </div>

            {/* Finta Forma d'Onda / Soundwave Equalizer Animata */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              height: '40px',
              padding: '6px 0',
              overflow: 'hidden'
            }}>
              {[40, 70, 20, 90, 60, 30, 85, 45, 100, 35, 75, 50, 95, 30, 65, 80, 25, 90, 50, 70, 30, 85, 60, 40, 95, 20, 80, 50].map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    backgroundColor: isPlaying ? '#818CF8' : '#334155',
                    borderRadius: '2px',
                    height: isPlaying ? `${Math.max(15, (h * (0.4 + (i % 3) * 0.3)))}%` : '20%',
                    transition: 'height 0.25s ease'
                  }}
                />
              ))}
            </div>

            {/* Barra di avanzamento audio */}
            <div style={{
              width: '100%',
              height: '6px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '999px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${audioProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #818CF8, #D43F4A)',
                borderRadius: '999px',
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
              paddingTop: '8px',
              borderTop: '1px solid rgba(255,255,255,0.06)'
            }}>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                ✍️ <b>Incluso nel servizio:</b> Scrittura copy persuasivo + Doppiaggio nazionale + Concessione SIAE
              </span>
              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, settore: SPOT_EXAMPLES[activeAudioIndex].titolo }));
                  scrollToFormWithPreset();
                }}
                style={{
                  background: 'transparent',
                  color: '#FCD34D',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: 700,
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

      {/* 5. IL SIMULATORE DI COPERTURA TOSCANA (INTERATTIVO LEAD MAGNET) */}
      <section style={{
        padding: '50px 20px',
        maxWidth: '1140px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 36px' }}>
          <span style={{
            color: '#F59E0B',
            fontSize: '11.5px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            Pianificazione Trasparente
          </span>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 900, color: '#FFFFFF', marginTop: '6px' }}>
            Simula il Bacino di Copertura per la tua Zona
          </h2>
          <p style={{ fontSize: '14.5px', color: '#94A3B8' }}>
            Seleziona l'area geografica in cui si trovano i tuoi clienti e scopri il volume di contatti che puoi raggiungere su Radio Toscana:
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          alignItems: 'stretch'
        }}>
          {/* Colonna Sinistra: Selezione Territorio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {TERRITORI.map((t, idx) => (
              <div
                key={t.id}
                onClick={() => setSelectedTerritorio(idx)}
                style={{
                  background: selectedTerritorio === idx ? 'rgba(212, 63, 74, 0.15)' : 'rgba(255,255,255,0.03)',
                  border: selectedTerritorio === idx ? '2px solid #D43F4A' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <b style={{ color: selectedTerritorio === idx ? '#FFFFFF' : '#E2E8F0', fontSize: '15px' }}>
                    {t.nome}
                  </b>
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: selectedTerritorio === idx ? '#D43F4A' : 'rgba(255,255,255,0.08)',
                    color: '#FFFFFF'
                  }}>
                    {t.badge}
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#94A3B8', lineHeight: 1.4 }}>
                  {t.descrizione}
                </div>
              </div>
            ))}
          </div>

          {/* Colonna Destra: Risultato Dinamico Calcolato */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '16px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                Stima Copertura Ufficiale TER
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', marginBottom: '16px' }}>
                {TERRITORI[selectedTerritorio].nome}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>Ascoltatori / Settimana</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#F87171' }}>
                    {TERRITORI[selectedTerritorio].ascoltatoriSettimanali}
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>Giorno Medio Tipico</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#38BDF8' }}>
                    {TERRITORI[selectedTerritorio].ascoltatoriGiorno}
                  </div>
                </div>
              </div>

              {/* Selettore Durata */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 700, marginBottom: '8px' }}>
                  Intensità consigliata della campagna:
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { val: '1', label: '1 Settimana (Evento / Promo)' },
                    { val: '2', label: '2 Settimane (Standard Notorietà)' },
                    { val: '4', label: '1 Mese (Dominio Territoriale)' }
                  ].map(item => (
                    <button
                      key={item.val}
                      onClick={() => setDurataCampagna(item.val as any)}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: durataCampagna === item.val ? '1px solid #F59E0B' : '1px solid rgba(255,255,255,0.1)',
                        background: durataCampagna === item.val ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.02)',
                        color: durataCampagna === item.val ? '#FCD34D' : '#94A3B8',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{
                fontSize: '12.5px',
                color: '#CBD5E1',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '20px'
              }}>
                ✓ <b>Orari a Massimo Rendimento:</b> Fasce drive-time 7:00-9:30 e 17:00-19:30 riservate alle attività locali.
              </div>
            </div>

            <button
              onClick={() => scrollToFormWithPreset(TERRITORI[selectedTerritorio].nome)}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#000000',
                border: 'none',
                borderRadius: '10px',
                padding: '14px',
                fontSize: '14px',
                fontWeight: 900,
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              Richiedi Preventivo per {TERRITORI[selectedTerritorio].nome} ➔
            </button>
          </div>
        </div>
      </section>

      {/* 6. I BENCHMARK SCIENTIFICI: IL PARADOSSO DEL CLICK (NIELSEN 2026) */}
      <section style={{
        padding: '50px 20px',
        maxWidth: '1140px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '36px 28px'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 36px' }}>
            <span style={{
              color: '#F87171',
              fontSize: '11.5px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              Dati Ufficiali di Mercato
            </span>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 900, color: '#FFFFFF', marginTop: '6px' }}>
              Il Paradosso del Click: Perché la Radio Batte il Digitale nei Risultati Reali
            </h2>
            <p style={{ fontSize: '14px', color: '#94A3B8' }}>
              Molti imprenditori pensano che il web sia sempre più economico. I dati degli osservatori internazionali 2026 dimostrano il contrario:
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {/* Box 1 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: '3px solid #38BDF8',
              borderRadius: '12px',
              padding: '22px'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#38BDF8', marginBottom: '4px' }}>
                2.00€ vs 1.52€
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
                La Radio Batte Google Search per ROI
              </div>
              <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '14px' }}>
                Per ogni 1€ investito, la radio genera 2,00€ di ritorno medio sulle vendite (il 2° mezzo più redditizio al mondo), superando Google Ads (1,52€), i cartelloni (1,56€), la TV (1,49€) e la stampa (1,15€).
              </p>
              <div style={{ fontSize: '11px', color: '#64748B', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                📚 <i>Fonte: Nielsen Global Compass Benchmark 2026</i>
              </div>
            </div>

            {/* Box 2 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: '3px solid #F59E0B',
              borderRadius: '12px',
              padding: '22px'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#F59E0B', marginBottom: '4px' }}>
                82% vs 15%
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
                Il Falso Mito di Spotify e dello Streaming
              </div>
              <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '14px' }}>
                Chi usa piattaforme streaming paga l'abbonamento premium proprio per NON ascoltare spot. L'82% del tempo totale dedicato all'audio commerciale è Radio (61%) e Podcast (21%). Lo streaming con annunci conta solo per il 15%.
              </p>
              <div style={{ fontSize: '11px', color: '#64748B', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                📚 <i>Fonte: Edison Research "Share of Ear" Q4 2025 / Nielsen 2026</i>
              </div>
            </div>

            {/* Box 3 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: '3px solid #10B981',
              borderRadius: '12px',
              padding: '22px'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#10B981', marginBottom: '4px' }}>
                +126% e +42%
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
                Fiducia Locale &amp; Moltiplicatore Web
              </div>
              <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '14px' }}>
                La propensione a consigliare un brand sentito in radio supera del +126% gli annunci impersonali sui social. Inoltre, abbinare la radio al web aumenta del +42% le conversioni digitali grazie alle ricerche dirette su Google.
              </p>
              <div style={{ fontSize: '11px', color: '#64748B', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                📚 <i>Fonti: Nielsen Community Study &amp; PoliMI / FCP-Assoradio</i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. COME LO MISURI? IL TRACKING PACK */}
      <section style={{
        padding: '50px 20px',
        maxWidth: '1140px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
          <span style={{
            color: '#10B981',
            fontSize: '11.5px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            Controllo Totale
          </span>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 900, color: '#FFFFFF', marginTop: '6px' }}>
            «Ma come faccio a sapere se la radio funziona?»
          </h2>
          <p style={{ fontSize: '14px', color: '#94A3B8' }}>
            La risposta è il nostro <b>Tracking Pack</b>: un metodo in 3 fasi che rende misurabile ogni euro investito.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#D43F4A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, marginBottom: '14px' }}>
              1
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              Codice Promo o Claim Dedicato
            </h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.55 }}>
              Nello spot inseriamo una parola chiave esclusiva (es. «Dì in cassa: Ascolto Radio Toscana»). Saprai esattamente quante persone arrivano in negozio grazie alla radio.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#38BDF8', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, marginBottom: '14px' }}>
              2
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              Landing Tracciata &amp; QR Code
            </h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.55 }}>
              Forniamo un link breve memorabile e un QR Code per tracciare in tempo reale le visite al tuo sito o al catalogo web generate dai passaggi in onda.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#10B981', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, marginBottom: '14px' }}>
              3
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              Certificato di Trasmissione As-Run
            </h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.55 }}>
              Al termine della campagna ricevi il report ufficiale del software di regia con l'orario al secondo di ogni singolo passaggio trasmesso. Massima trasparenza.
            </p>
          </div>
        </div>
      </section>

      {/* 8. PACCHETTO START TRASPARENTE & FORM CONVERSIONE */}
      <section ref={formSectionRef} style={{
        padding: '50px 20px 80px',
        maxWidth: '1140px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(20, 24, 33, 0.95) 0%, rgba(11, 15, 23, 0.98) 100%)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '24px',
          padding: '40px 24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'start'
          }}>
            {/* Box Sinistro: Value Proposition & Rassicurazioni */}
            <div>
              <div style={{
                display: 'inline-block',
                background: 'rgba(212, 63, 74, 0.2)',
                border: '1px solid rgba(212, 63, 74, 0.4)',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11.5px',
                fontWeight: 800,
                color: '#F87171',
                marginBottom: '12px',
                textTransform: 'uppercase'
              }}>
                Pacchetto Pilota PMI 2026
              </div>

              <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 900, color: '#FFFFFF', marginBottom: '14px', lineHeight: 1.2 }}>
                Richiedi il tuo piano di copertura personalizzato
              </h2>

              <p style={{ fontSize: '14.5px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '24px' }}>
                Nessun costo o vincolo a lungo termine. Prepariamo una stima su misura per la tua zona con gli orari ideali di ascolto e una proposta di spot scritta per la tua attività.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#10B981', fontWeight: 900 }}>✓</span>
                  <span style={{ fontSize: '13.5px', color: '#E2E8F0' }}><b>Produzione Audio Completa:</b> scrittura copy e speaker inclusi.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#10B981', fontWeight: 900 }}>✓</span>
                  <span style={{ fontSize: '13.5px', color: '#E2E8F0' }}><b>Fasce Drive-Time Garantite:</b> spot concentrati negli orari in cui i clienti guidano.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#10B981', fontWeight: 900 }}>✓</span>
                  <span style={{ fontSize: '13.5px', color: '#E2E8F0' }}><b>Risposta Rapida:</b> proposta via email o telefonata entro 24 ore lavorative.</span>
                </div>
              </div>

              {/* Contatto Diretto Rapido */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '13px',
                color: '#94A3B8'
              }}>
                <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                  Preferisci parlare subito con noi?
                </div>
                <div>
                  Ufficio Pubblicità Radio Toscana: <a href="tel:055285030" style={{ color: '#38BDF8', fontWeight: 700, textDecoration: 'none' }}>055 285030</a>
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px' }}>
                  Largo De Gasperi 1, 50136 Firenze (FI)
                </div>
              </div>
            </div>

            {/* Box Destro: Form di Conversione */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '28px'
            }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
                  <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#34D399', marginBottom: '8px' }}>
                    Richiesta Inviata con Successo!
                  </h3>
                  <p style={{ color: '#CBD5E1', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                    Grazie per il tuo interesse. Il responsabile commerciale di Radio Toscana prenderà in carico la scheda di <b>{formData.azienda}</b> e ti ricontatterà entro 24 ore.
                  </p>
                  <a
                    href="tel:055285030"
                    style={{
                      display: 'inline-block',
                      background: 'rgba(255,255,255,0.08)',
                      color: '#FFFFFF',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: 700
                    }}
                  >
                    Hai urgenza? Chiama ora lo 055 285030
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                      Nome dell'Azienda / Attività *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Es. Pasticceria Rossi / Autofficina Mugello"
                      value={formData.azienda}
                      onChange={e => setFormData({ ...formData, azienda: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(15, 23, 42, 0.7)',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
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
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.15)',
                          background: 'rgba(15, 23, 42, 0.7)',
                          color: '#FFFFFF',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
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
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.15)',
                          background: 'rgba(15, 23, 42, 0.7)',
                          color: '#FFFFFF',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                      Email (opzionale per invio scheda)
                    </label>
                    <input
                      type="email"
                      placeholder="info@tuaazienda.it"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(15, 23, 42, 0.7)',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                        Settore Merceologico
                      </label>
                      <select
                        value={formData.settore}
                        onChange={e => setFormData({ ...formData, settore: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.15)',
                          background: '#0F172A',
                          color: '#FFFFFF',
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
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                        Bacino Territoriale
                      </label>
                      <select
                        value={formData.bacino}
                        onChange={e => setFormData({ ...formData, bacino: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.15)',
                          background: '#0F172A',
                          color: '#FFFFFF',
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
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                      Cosa vorresti promuovere? (Facoltativo)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Es. Vogliamo lanciare una nuova apertura a maggio / promuovere saldi stagionali..."
                      value={formData.note}
                      onChange={e => setFormData({ ...formData, note: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(15, 23, 42, 0.7)',
                        color: '#FFFFFF',
                        fontSize: '13px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Consenso Privacy */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '11.5px', color: '#94A3B8' }}>
                    <input
                      type="checkbox"
                      checked={privacyAccepted}
                      onChange={e => setPrivacyAccepted(e.target.checked)}
                      style={{ marginTop: '2px' }}
                    />
                    <span>
                      Dichiaro di aver preso visione dell'informativa privacy e acconsento al trattamento dei dati per la ricezione della proposta richiesta (D.Lgs 196/2003 e Regolamento UE 2016/679 - GDPR).
                    </span>
                  </label>

                  {errorMsg && (
                    <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '10px', borderRadius: '8px', fontSize: '12.5px' }}>
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #D43F4A 0%, #B91C1C 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '16px',
                      fontSize: '15px',
                      fontWeight: 800,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 8px 24px rgba(212, 63, 74, 0.45)',
                      transition: 'all 0.2s ease',
                      marginTop: '6px'
                    }}
                  >
                    {loading ? 'Invio in corso...' : 'Invia Richiesta di Proposta Gratuita ⚡'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER PULITO CON DATI SOCIETARI */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '30px 20px 80px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#64748B'
      }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <div>
            <b>Radio Toscana S.r.l.</b> • Largo Alcide De Gasperi 1, 50136 Firenze (FI) • P.IVA 04584210486
          </div>
          <div>
            Concessione radiofonica comunitaria / commerciale • Trasmissioni in FM e DAB+ su tutto il territorio regionale
          </div>
          <div style={{ color: '#475569', fontSize: '11px', marginTop: '6px' }}>
            Variante B (Performance Lead Engine) • Test A/B attivo per ottimizzazione tasso di conversione PMI
          </div>
        </div>
      </footer>

      {/* 10. STICKY BOTTOM BAR MOBILE (POLLICE FRIENDLY) */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99,
        background: 'rgba(7, 10, 15, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.12)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }} className="mobile-only-sticky-bar">
        <a
          href="tel:055285030"
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.08)',
            color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 700,
            textDecoration: 'none'
          }}
        >
          📞 Chiama Subito
        </a>
        <button
          onClick={() => scrollToFormWithPreset()}
          style={{
            flex: 1.5,
            background: 'linear-gradient(135deg, #D43F4A 0%, #B91C1C 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(212, 63, 74, 0.4)'
          }}
        >
          ⚡ Preventivo Rapido
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
