'use client';

import React, { useState } from 'react';

export default function LandingPubblicita() {
  const [formData, setFormData] = useState({
    azienda: '',
    referente: '',
    telefono: '',
    email: '',
    settore: 'Commercio / Retail',
    areaInteresse: 'Area 1 (Firenze, Prato, Pistoia)',
    formatoInteresse: 'Spot Tabellari 20"-30"',
    obiettivo: 'Incrementare visite e vendite in Toscana',
    note: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'perche' | 'formati' | 'voci' | 'dati'>('perche');

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
          source: 'Landing Elegance Radio Toscana 2026',
          utm_campaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') || 'radio-rende-2026' : 'radio-rende-2026'
        })
      });

      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(json.error || 'Errore durante l\'invio. Riprova tra poco.');
      }
    } catch (err) {
      setErrorMsg('Interruzione di connessione. Riprova tra poco o chiamaci direttamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#fcfcfd',
      color: '#0f172a',
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      minHeight: '100vh',
      lineHeight: 1.6,
      overflowX: 'hidden'
    }}>
      {/* 1. TOP FREQUENCY & TUNER TICKER - SAPORE DI RADIO VERA */}
      <div style={{
        background: 'linear-gradient(90deg, #0b1120 0%, #1e1b4b 50%, #0b1120 100%)',
        color: '#f8fafc',
        fontSize: '12px',
        padding: '10px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            background: 'rgba(239, 68, 68, 0.25)',
            border: '1px solid rgba(239, 68, 68, 0.6)',
            padding: '3px 10px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.06em',
            color: '#fca5a5'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#ef4444',
              boxShadow: '0 0 10px #ef4444'
            }}></span>
            ON AIR LIVE
          </span>
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>
            FIRENZE <b>104.7 FM</b> • PISTOIA <b>88.0 FM</b> • COSTA & VERSILIA <b>102.8 FM</b> • <b>DAB+ TOSCANA</b>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', fontSize: '12px' }}>
          <span style={{ color: '#cbd5e1' }}>
            🎙️ <b>298.000</b> ascoltatori settimanali certificati
          </span>
          <a
            href="tel:3476818595"
            style={{
              color: '#38bdf8',
              textDecoration: 'none',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Linea Diretta: 347 6818595</span>
          </a>
        </div>
      </div>

      {/* 2. HEADER ELEGANTE CON LOGO ORIGINALE & CALL TO ACTION */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.03)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src="/logo_radio_toscana.png"
              alt="Radio Toscana"
              style={{
                height: '52px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
            <div style={{ borderLeft: '1.5px solid #e2e8f0', paddingLeft: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.08em', color: '#e11d48', textTransform: 'uppercase' }}>
                SOLO TOSCANA • SOLO HIT
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                Ufficio Pianificazione Media & Pubblicità 2026
              </div>
            </div>
          </div>

          {/* Navigazione */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <a href="#perche-la-radio" style={{ textDecoration: 'none', color: '#334155', fontWeight: 600, fontSize: '14px' }}>
              Perché la Radio Rende
            </a>
            <a href="#drivetosite" style={{ textDecoration: 'none', color: '#334155', fontWeight: 600, fontSize: '14px' }}>
              Drive to Site & Negozio
            </a>
            <a href="#voci" style={{ textDecoration: 'none', color: '#334155', fontWeight: 600, fontSize: '14px' }}>
              Le Nostre Voci
            </a>
            <a href="#copertura" style={{ textDecoration: 'none', color: '#334155', fontWeight: 600, fontSize: '14px' }}>
              Copertura FM & DAB+
            </a>
            <a
              href="#preventivo"
              style={{
                background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '10px 22px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 700,
                boxShadow: '0 8px 20px -4px rgba(225, 29, 72, 0.4)',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Richiedi Proposta 2026</span>
              <span>→</span>
            </a>
          </nav>
        </div>
      </header>

      {/* 3. HERO SECTION ONIRICA & DISTOPICA: "UN POSTO IN PARADISO" */}
      <section style={{
        position: 'relative',
        padding: '70px 24px 90px',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 90% 60% at 50% -10%, rgba(254, 205, 211, 0.4) 0%, rgba(240, 249, 255, 0.5) 45%, #fcfcfd 100%)'
      }}>
        {/* Glows d'atmosfera */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '15%',
          width: '380px',
          height: '380px',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(50px)',
          zIndex: 0
        }}></div>
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '12%',
          width: '420px',
          height: '420px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(60px)',
          zIndex: 0
        }}></div>

        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 48px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#ffffff',
              border: '1px solid #fecdd3',
              borderRadius: '9999px',
              padding: '6px 18px',
              fontSize: '12px',
              fontWeight: 800,
              color: '#be123c',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              boxShadow: '0 6px 16px rgba(225, 29, 72, 0.08)',
              marginBottom: '22px'
            }}>
              <span>☁️ CAMPAGNA EDITORIALE 2026 // UN POSTO IN PARADISO</span>
            </div>

            <h1 style={{
              fontSize: ' clamp(32px, 4.8vw, 56px)',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#0f172a',
              marginBottom: '22px'
            }}>
              La radio non mostra: <span style={{
                background: 'linear-gradient(135deg, #e11d48 0%, #a855f7 50%, #2563eb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}>fa immaginare.</span><br />
              E ciò che immagini è già tuo.
            </h1>

            <p style={{
              fontSize: '18px',
              color: '#475569',
              lineHeight: 1.6,
              maxWidth: '740px',
              margin: '0 auto 36px',
              fontWeight: 450
            }}>
              Mentre gli schermi affaticano e i social vengono ignorati a colpi di swipe, la voce autentica di <b>Radio Toscana</b> viaggia nell’etere, entra nell’orecchio e accende il desiderio d’acquisto nella mente di <b>298.000 toscani</b> ogni settimana.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a
                href="#preventivo"
                style={{
                  background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: '16px 36px',
                  borderRadius: '9999px',
                  fontSize: '16px',
                  fontWeight: 800,
                  boxShadow: '0 12px 28px -6px rgba(225, 29, 72, 0.45)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span>Richiedi una Pianificazione Su Misura</span>
                <span>🎙️</span>
              </a>

              <a
                href="#perche-la-radio"
                style={{
                  background: '#ffffff',
                  color: '#334155',
                  textDecoration: 'none',
                  padding: '16px 30px',
                  borderRadius: '9999px',
                  fontSize: '15px',
                  fontWeight: 700,
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>Scopri i Dati di Ascolto FCP</span>
                <span>↓</span>
              </a>
            </div>
          </div>

          {/* VISUAL ONIRICO HERO "UN POSTO IN PARADISO" CON OVERLAY STATISTICHE */}
          <div style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px -15px rgba(225, 29, 72, 0.18), 0 0 0 1px rgba(226, 232, 240, 0.8)',
            background: '#ffffff'
          }}>
            <img
              src="/paradiso_etere_radio.jpg"
              alt="Un Posto in Paradiso - La Radio Rende Radio Toscana"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '600px',
                objectFit: 'cover',
                display: 'block'
              }}
            />

            {/* Floating Pills Statistiche Eteree */}
            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              right: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(16px)',
                padding: '14px 22px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.8)',
                boxShadow: '0 10px 25px rgba(15, 23, 42, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '20px'
                }}>
                  📈
                </div>
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', fontWeight: 800 }}>
                    MOLTIPLICATORE MEDIO
                  </div>
                  <div style={{ fontSize: '19px', fontWeight: 900, color: '#0f172a' }}>
                    10€ di Ritorno per 1€ Investito
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(16px)',
                padding: '14px 22px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.8)',
                boxShadow: '0 10px 25px rgba(15, 23, 42, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '20px'
                }}>
                  🚗
                </div>
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', fontWeight: 800 }}>
                    ASCOLTO IN MOBILITÀ
                  </div>
                  <div style={{ fontSize: '19px', fontWeight: 900, color: '#0f172a' }}>
                    75% in Auto & Nei Negozi
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(16px)',
                padding: '14px 22px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.8)',
                boxShadow: '0 10px 25px rgba(15, 23, 42, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '20px'
                }}>
                  🛡️
                </div>
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', fontWeight: 800 }}>
                    RESISTENZA AD-BLOCKER
                  </div>
                  <div style={{ fontSize: '19px', fontWeight: 900, color: '#0f172a' }}>
                    100% Ascolto Reale No-Skip
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BRAND PARTNER DI FIDUCIA // CLK ITALIA & GRANDI MARCHI */}
      <section style={{
        padding: '38px 24px',
        background: '#ffffff',
        borderTop: '1px solid #f1f5f9',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: '#94a3b8',
            marginBottom: '20px'
          }}>
            AZIENDE E BRAND CHE SCELGONO RADIO TOSCANA PER CRESCERE SUL TERRITORIO
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '36px'
          }}>
            {/* CLK ITALIA (In evidenza) */}
            <div style={{
              padding: '10px 22px',
              borderRadius: '12px',
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              fontWeight: 900,
              fontSize: '15px',
              letterSpacing: '0.08em',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ color: '#e11d48' }}>●</span> CLK ITALIA
            </div>

            <div style={{ fontWeight: 800, fontSize: '15px', color: '#475569', letterSpacing: '0.04em' }}>
              CONAD
            </div>
            <div style={{ fontWeight: 800, fontSize: '15px', color: '#475569', letterSpacing: '0.04em' }}>
              UNICOOP FIRENZE
            </div>
            <div style={{ fontWeight: 800, fontSize: '15px', color: '#475569', letterSpacing: '0.04em' }}>
              BPER BANCA
            </div>
            <div style={{ fontWeight: 800, fontSize: '15px', color: '#475569', letterSpacing: '0.04em' }}>
              CHIANTIBANCA
            </div>
            <div style={{ fontWeight: 800, fontSize: '15px', color: '#475569', letterSpacing: '0.04em' }}>
              AUTORICAMBI FIRENZE
            </div>
            <div style={{ fontWeight: 800, fontSize: '15px', color: '#475569', letterSpacing: '0.04em' }}>
              CONSORZIO DEL CHIANTI
            </div>
          </div>
        </div>
      </section>

      {/* 5. SEZIONE "PERCHÉ LA RADIO RENDE": DATI POLIMI / FCP ASSORADIO */}
      <section id="perche-la-radio" style={{
        padding: '90px 24px',
        background: '#ffffff'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 64px' }}>
            <span style={{
              color: '#e11d48',
              fontWeight: 800,
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              I FONDAMENTI SCIENTIFICI DEL MARKETING AUDIO
            </span>
            <h2 style={{
              fontSize: 'clamp(28px, 3.6vw, 42px)',
              fontWeight: 900,
              color: '#0f172a',
              marginTop: '10px',
              lineHeight: 1.2
            }}>
              Perché la Radio Rende Più di Qualsiasi Altro Mezzo?
            </h2>
            <p style={{ color: '#64748b', fontSize: '17px', marginTop: '14px' }}>
              Dalle evidenze della ricerca FCP-Assoradio / Politecnico di Milano e dell'osservatorio "La Radio Rende", ecco come l'audio genera valore tangibile e immediato.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {/* Card 1: Psicoacustica */}
            <div style={{
              background: '#fafafa',
              borderRadius: '20px',
              padding: '36px 30px',
              border: '1px solid #f1f5f9',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: '#fee2e2',
                color: '#e11d48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                marginBottom: '22px'
              }}>
                🧠
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                1. L'Effetto Psicoacustico
              </h3>
              <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6 }}>
                La voce umana sussurra direttamente nella coscienza dell'ascoltatore. Senza barriere visive, il cervello proietta l'immagine del tuo prodotto in modo personalizzato ed emotivo: <b>ciò che viene immaginato viene ricordato 3 volte più a lungo</b> rispetto a un banner web.
              </p>
            </div>

            {/* Card 2: Drive-to-Store & Web */}
            <div style={{
              background: '#fafafa',
              borderRadius: '20px',
              padding: '36px 30px',
              border: '1px solid #f1f5f9',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                marginBottom: '22px'
              }}>
                ⚡
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                2. Drive-to-Web in 90 Minuti
              </h3>
              <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6 }}>
                Il <b>58% degli ascoltatori toscani</b> dichiara di aver effettuato una ricerca su Google o visitato il sito del brand entro un'ora e mezza dal passaggio on-air. La radio è il vero acceleratore del traffico digitale di prossimità.
              </p>
            </div>

            {/* Card 3: Zero Skipping */}
            <div style={{
              background: '#fafafa',
              borderRadius: '20px',
              padding: '36px 30px',
              border: '1px solid #f1f5f9',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                marginBottom: '22px'
              }}>
                🛡️
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                3. Zero Ad-Blocker, Zero Skip
              </h3>
              <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6 }}>
                A differenza di YouTube, Facebook o Spotify, la radio accompagna l'ascoltatore mentre guida verso il lavoro o fa shopping: <b>mani sul volante, occhi sulla strada e orecchie accese sul tuo messaggio</b>. Nessun algoritmo può sopprimere la tua voce.
              </p>
            </div>

            {/* Card 4: ROI Moltiplicatore */}
            <div style={{
              background: '#fafafa',
              borderRadius: '20px',
              padding: '36px 30px',
              border: '1px solid #f1f5f9',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: '#d1fae5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                marginBottom: '22px'
              }}>
                💶
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                4. ROI Moltiplicatore x10
              </h3>
              <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6 }}>
                Il costo per mille (CPM) della radio locale è tra i più competitivi del mercato europeo. La costanza di pianificazione garantisce un fatturato generato fino a 10 volte superiore rispetto all'investimento iniziale certificato.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DRIVE-TO-SITE & LOCAL CONVERSION CON VISUAL FIRENZE / AUTO D'EPOCA */}
      <section id="drivetosite" style={{
        padding: '90px 24px',
        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '48px',
            alignItems: 'center'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#e0f2fe',
                color: '#0284c7',
                borderRadius: '9999px',
                padding: '6px 16px',
                fontSize: '12px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '16px'
              }}>
                <span>🚗 DALL'ON-AIR AL NEGOZIO</span>
              </div>

              <h2 style={{
                fontSize: 'clamp(28px, 3.4vw, 42px)',
                fontWeight: 900,
                color: '#0f172a',
                lineHeight: 1.2,
                marginBottom: '20px'
              }}>
                Come Radio Toscana Porta Clienti Fisici e Visite Web al Tuo Brand
              </h2>

              <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.7, marginBottom: '24px' }}>
                Nel tragitto quotidiano tra Firenze, Prato, Pistoia, la costa e l'entroterra, la radio è la compagnia privilegiata di dirigenti, professionisti e famiglie toscane.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#e11d48',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '13px',
                    flexShrink: 0
                  }}>✓</div>
                  <div>
                    <b style={{ color: '#0f172a' }}>67% Responsabili di Acquisto:</b>{' '}
                    <span style={{ color: '#64748b' }}>Chi ascolta Radio Toscana gestisce il budget familiare o aziendale per acquisti e investimenti.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#e11d48',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '13px',
                    flexShrink: 0
                  }}>✓</div>
                  <div>
                    <b style={{ color: '#0f172a' }}>Effetto Ricordo Immediato:</b>{' '}
                    <span style={{ color: '#64748b' }}>Gli annunci radiofonici creano familiarità top-of-mind nel momento esatto in cui le persone decidono cosa comprare.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#e11d48',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '13px',
                    flexShrink: 0
                  }}>✓</div>
                  <div>
                    <b style={{ color: '#0f172a' }}>Cross-Media Amplifier:</b>{' '}
                    <span style={{ color: '#64748b' }}>Se hai già campagne social o cartellonistica, la radio aumenta le conversioni digitali del +42%.</span>
                  </div>
                </div>
              </div>

              <a
                href="#preventivo"
                style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: '14px 30px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>Configura la Tua Campagna Locale</span>
                <span>→</span>
              </a>
            </div>

            {/* Immagine Firenze Surreal Audio Drive-to-Store */}
            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.15)',
              border: '1px solid #e2e8f0'
            }}>
              <img
                src="/audio_immersion_drivetosite.jpg"
                alt="Firenze Audio Immersion & Drive to Store"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. I CONDUTTORI: LE VOCI PIÙ AMATE E SEGUITE DI TOSCANA */}
      <section id="voci" style={{
        padding: '90px 24px',
        background: '#ffffff'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 60px' }}>
            <span style={{
              color: '#e11d48',
              fontWeight: 800,
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              FIDUCIA E AUTOREVOLEZZA SENZA FILTRI
            </span>
            <h2 style={{
              fontSize: 'clamp(28px, 3.4vw, 42px)',
              fontWeight: 900,
              color: '#0f172a',
              marginTop: '10px'
            }}>
              Le Voci di Cui i Toscani si Fidano Ogni Giorno
            </h2>
            <p style={{ color: '#64748b', fontSize: '17px', marginTop: '12px' }}>
              Quando uno spot o una citazione esce dalla bocca di un conduttore amato, non è pubblicità: è il consiglio di un amico di famiglia.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {/* Alessandro Masti */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '20px',
              padding: '28px',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                margin: '0 auto 16px',
                boxShadow: '0 8px 20px -4px rgba(225, 29, 72, 0.4)'
              }}>
                🎙️
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>Alessandro Masti</h3>
              <div style={{ color: '#e11d48', fontWeight: 700, fontSize: '13px', marginBottom: '12px' }}>
                Il Morning Show (Dalle 07:00)
              </div>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5 }}>
                La voce che sveglia tutta la Toscana con ironia graffiante, buonumore contagioso e il massimo picco di ascolto regionale in auto.
              </p>
            </div>

            {/* Giovanni Quercioli */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '20px',
              padding: '28px',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                margin: '0 auto 16px',
                boxShadow: '0 8px 20px -4px rgba(2, 132, 199, 0.4)'
              }}>
                📻
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>Giovanni Quercioli</h3>
              <div style={{ color: '#0284c7', fontWeight: 700, fontSize: '13px', marginBottom: '12px' }}>
                Attualità & Territorio (12:00 - 15:00)
              </div>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5 }}>
                Punto di riferimento per notizie, economia locale e dibattito. La sua credibilità conferisce autorevolezza istantanea a ogni brand.
              </p>
            </div>

            {/* Niccolò Riccetti */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '20px',
              padding: '28px',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                margin: '0 auto 16px',
                boxShadow: '0 8px 20px -4px rgba(124, 58, 237, 0.4)'
              }}>
                ⚽
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>Niccolò Riccetti</h3>
              <div style={{ color: '#7c3aed', fontWeight: 700, fontSize: '13px', marginBottom: '12px' }}>
                Sport, Passione Viola & Pomeriggio
              </div>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5 }}>
                Il cuore pulsante dello sport toscano e del commento alla Fiorentina, con un pubblico fedelissimo e attento a ogni dettaglio.
              </p>
            </div>

            {/* Roberto Geri */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '20px',
              padding: '28px',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                margin: '0 auto 16px',
                boxShadow: '0 8px 20px -4px rgba(245, 158, 11, 0.4)'
              }}>
                🎵
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>Roberto Geri</h3>
              <div style={{ color: '#d97706', fontWeight: 700, fontSize: '13px', marginBottom: '12px' }}>
                Hit Parade, Weekend & Intrattenimento
              </div>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5 }}>
                Il ritmo dei grandi eventi, dei festival e della musica di qualità che accompagna il tempo libero e lo shopping del fine settimana.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. COPERTURA E MODULI PUBBLICITARI DISPONIBILI */}
      <section id="copertura" style={{
        padding: '80px 24px',
        background: '#f8fafc',
        borderTop: '1px solid #e2e8f0'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px' }}>
            <span style={{
              color: '#e11d48',
              fontWeight: 800,
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              FLESSIBILITÀ DI PIANIFICAZIONE TERRITORIALE
            </span>
            <h2 style={{
              fontSize: 'clamp(26px, 3.2vw, 38px)',
              fontWeight: 900,
              color: '#0f172a',
              marginTop: '10px'
            }}>
              I 4 Macro-Bacini e i Formati Pubblicitari 2026
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#e11d48', textTransform: 'uppercase' }}>AREA 1 • CUORE REGIONALE</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '6px 0' }}>Firenze, Prato, Pistoia</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Frequenza 104.7 FM & 88.0 FM. Il bacino a più alta densità commerciale e retail.</div>
            </div>

            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>AREA 2 • POLO OCCIDENTALE</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '6px 0' }}>Pisa, Lucca, Livorno</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Frequenza 102.8 FM & DAB+. Area ad alto potere d'acquisto, universitaria e logistica.</div>
            </div>

            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase' }}>AREA 3 • ENTROTERRA & VALDELSA</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '6px 0' }}>Arezzo, Siena, Empolese</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Copertura capillare per artigianato d'eccellenza, turismo, viticoltura e servizi.</div>
            </div>

            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>AREA 4 • COSTA & ARCO TIRRENICO</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '6px 0' }}>Versilia, Grosseto, Elba</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Stagionalità forte, ristorazione, hospitality ed eventi esclusivi.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FORM DI CONTATTO & PREVENTIVATORE INTELLIGENTE */}
      <section id="preventivo" style={{
        padding: '90px 24px',
        background: '#ffffff',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '28px',
            padding: '48px 40px',
            boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.1), 0 0 0 1px #e2e8f0',
            position: 'relative'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#fee2e2',
                color: '#e11d48',
                borderRadius: '9999px',
                padding: '6px 16px',
                fontSize: '12px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '12px'
              }}>
                <span>🎙️ PROGETTA LA TUA ONDA SONORA</span>
              </div>
              <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a' }}>
                Richiedi una Proposta Commerciale Riservata
              </h2>
              <p style={{ color: '#64748b', fontSize: '15px', marginTop: '8px' }}>
                Compila i campi: il nostro team pianificazione ti invierà la stima di copertura e il listino agevolato per la tua zona.
              </p>
            </div>

            {submitted ? (
              <div style={{
                background: '#f0fdf4',
                border: '1.5px solid #bbf7d0',
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '52px', marginBottom: '14px' }}>✨</div>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#166534', marginBottom: '10px' }}>
                  Richiesta Ricevuta con Successo!
                </h3>
                <p style={{ color: '#15803d', fontSize: '16px', maxWidth: '540px', margin: '0 auto 24px' }}>
                  I dati sono stati trasmessi alla direzione commerciale di Radio Toscana. Ti contatteremo telefonicamente entro poche ore lavorative.
                </p>
                <div style={{ fontSize: '13px', color: '#166534', fontWeight: 700 }}>
                  Per urgenze immediate: chiama Fabio al <a href="tel:3476818595" style={{ color: '#166534', textDecoration: 'underline' }}>347 6818595</a>.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Nome Azienda / Attività *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="es. CLK Italia S.r.l."
                    value={formData.azienda}
                    onChange={(e) => setFormData({ ...formData, azienda: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Nome e Cognome Referente
                  </label>
                  <input
                    type="text"
                    placeholder="es. Mario Rossi"
                    value={formData.referente}
                    onChange={(e) => setFormData({ ...formData, referente: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Telefono Diretto *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="es. 347 1234567"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Email Aziendale
                  </label>
                  <input
                    type="email"
                    placeholder="es. direzione@azienda.it"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Area Geografica di Interesse
                  </label>
                  <select
                    value={formData.areaInteresse}
                    onChange={(e) => setFormData({ ...formData, areaInteresse: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '15px',
                      outline: 'none',
                      background: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Tutta la Toscana (Rete Regionale Completa)">Tutta la Toscana (Rete Regionale Completa)</option>
                    <option value="Area 1 (Firenze, Prato, Pistoia)">Area 1 (Firenze, Prato, Pistoia)</option>
                    <option value="Area 2 (Pisa, Lucca, Livorno)">Area 2 (Pisa, Lucca, Livorno)</option>
                    <option value="Area 3 (Arezzo, Siena, Empolese)">Area 3 (Arezzo, Siena, Empolese)</option>
                    <option value="Area 4 (Costa, Versilia, Grosseto)">Area 4 (Costa, Versilia, Grosseto)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Formato Pubblicitario Desiderato
                  </label>
                  <select
                    value={formData.formatoInteresse}
                    onChange={(e) => setFormData({ ...formData, formatoInteresse: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '15px',
                      outline: 'none',
                      background: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Spot Tabellari 20&quot;-30&quot;">Spot Tabellari 20&quot;-30&quot; (Fasce Top Drive Time)</option>
                    <option value="Citazione Conduttore / Promoredazionale">Citazione Conduttore / Promoredazionale</option>
                    <option value="Sponsorizzazione Rubrica (Meteo / Viabilità)">Sponsorizzazione Rubrica (Meteo / Viabilità)</option>
                    <option value="Pacchetto Speciale Evento sul Territorio">Pacchetto Speciale Evento sul Territorio</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Obiettivo della Campagna o Note Aggiuntive
                  </label>
                  <textarea
                    rows={3}
                    placeholder="es. Promozione nuovo punto vendita a Firenze, lancio nuovo prodotto B2B, aumento notorietà..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  ></textarea>
                </div>

                {errorMsg && (
                  <div style={{ gridColumn: '1 / -1', color: '#b91c1c', background: '#fee2e2', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: 600 }}>
                    ⚠️ {errorMsg}
                  </div>
                )}

                <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '18px 24px',
                      borderRadius: '14px',
                      fontSize: '16px',
                      fontWeight: 800,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 12px 25px -4px rgba(225, 29, 72, 0.45)',
                      transition: 'all 0.2s ease',
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? 'Elaborazione segnale in corso...' : 'Invia Richiesta e Ricevi Proposta Personalizzata →'}
                  </button>
                  <div style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '12px' }}>
                    🔒 I tuoi dati sono protetti e trattati esclusivamente dalla direzione commerciale di Radio Toscana. Nessuno spam.
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 10. FOOTER ELEGANTE & ISTITUZIONALE */}
      <footer style={{
        background: '#0b1120',
        color: '#94a3b8',
        padding: '60px 24px 40px',
        borderTop: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '30px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '40px',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img
                src="/logo_radio_toscana.png"
                alt="Radio Toscana"
                style={{
                  height: '46px',
                  width: 'auto',
                  filter: 'brightness(0) invert(1)'
                }}
              />
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '14px' }}>
                <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '13px' }}>
                  RADIO MONTE SERRA S.R.L.
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Sede Operativa: Firenze • Editore Radiofonico Regionale
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '13px' }}>
              <span style={{ color: '#e2e8f0' }}>Ufficio Commerciale:</span>
              <a href="tel:3476818595" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 700 }}>
                📞 347 6818595
              </a>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
              <a href="mailto:pubblicita@radiotoscana.it" style={{ color: '#38bdf8', textDecoration: 'none' }}>
                ✉️ pubblicita@radiotoscana.it
              </a>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '12px'
          }}>
            <div>
              © 2026 Radio Toscana (Radio Monte Serra S.r.l.) - Tutti i diritti riservati. P.IVA 01228220508.
            </div>
            <div>
              Dati di ascolto certificati TER (Tavolo Editori Radio) • Monitoraggio AGCOM • Modello FCP-Assoradio
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
