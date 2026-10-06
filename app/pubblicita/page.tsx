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
    obiettivo: 'Incrementare notorietà e contatti sul territorio toscano',
    note: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
      `}} />

      {/* 1. TOP BAR FREQUENZE & BROADCAST REGIONALE */}
      <div style={{
        background: '#474350',
        color: '#ffffff',
        fontSize: '12px',
        padding: '10px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '2px solid #D43F4A'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span className="font-panton" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#D43F4A',
            color: '#ffffff',
            padding: '3px 12px',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: 900,
            fontStyle: 'italic',
            letterSpacing: '0.08em',
            transform: 'skewX(-8deg)'
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#ffffff',
              display: 'inline-block'
            }}></span>
            ON AIR LIVE
          </span>
          <span className="font-panton" style={{ color: '#e2e8f0', fontSize: '13px', letterSpacing: '0.05em' }}>
            FIRENZE <b>104.7 FM</b> • PISTOIA <b>88.0 FM</b> • COSTA & VERSILIA <b>102.8 FM</b> • <b>DAB+ TOSCANA</b>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', fontSize: '12px' }}>
          <span style={{ color: '#cbd5e1' }}>
            🎙️ <b>298.000</b> ascoltatori settimanali certificati TER
          </span>
          <a
            href="tel:3476818595"
            style={{
              color: '#ffffff',
              background: 'rgba(255,255,255,0.12)',
              padding: '4px 12px',
              borderRadius: '9999px',
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

      {/* 2. HEADER UFFICIALE CON LOGO & EDITORIALE */}
      <header style={{
        background: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 4px 18px rgba(71, 67, 80, 0.04)'
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <img
              src="/logo_radio_toscana.png"
              alt="Radio Toscana"
              style={{
                height: '52px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
            <div style={{ borderLeft: '2px solid #D43F4A', paddingLeft: '14px' }}>
              <div className="font-panton" style={{
                fontSize: '14px',
                fontWeight: 900,
                fontStyle: 'italic',
                letterSpacing: '0.06em',
                color: '#D43F4A',
                textTransform: 'uppercase'
              }}>
                SOLO TOSCANA | SOLO HIT
              </div>
              <div style={{ fontSize: '11px', color: '#474350', fontWeight: 600 }}>
                Emittente Regionale della Toscana • Ufficio Pianificazione Pubblicitaria
              </div>
            </div>
          </div>

          {/* Navigazione */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <a href="#perche-la-radio" style={{ textDecoration: 'none', color: '#474350', fontWeight: 600, fontSize: '14px' }}>
              Perché la Radio Rende
            </a>
            <a href="#drivetosite" style={{ textDecoration: 'none', color: '#474350', fontWeight: 600, fontSize: '14px' }}>
              Drive-to-Store & Territorio
            </a>
            <a href="#copertura" style={{ textDecoration: 'none', color: '#474350', fontWeight: 600, fontSize: '14px' }}>
              Bacini e Frequenze
            </a>
            <a
              href="#preventivo"
              className="font-panton"
              style={{
                background: '#D43F4A',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '10px 24px',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: 900,
                fontStyle: 'italic',
                letterSpacing: '0.06em',
                boxShadow: '0 6px 18px rgba(212, 63, 74, 0.35)',
                transform: 'skewX(-6deg)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ transform: 'skewX(6deg)' }}>RICHIEDI PROPOSTA 2026 →</span>
            </a>
          </nav>
        </div>
      </header>

      {/* 3. HERO SECTION AUTOREVOLE CON VISUAL DOUBLE EXPOSURE (BRAND BOOK RADIO TOSCANA) */}
      <section style={{
        position: 'relative',
        padding: '64px 24px 80px',
        background: 'linear-gradient(180deg, #fdfdfd 0%, #f7f7f9 100%)',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '48px',
            alignItems: 'center'
          }}>
            {/* Testo Principale */}
            <div>
              {/* Badge Ufficiale Logo Inclinato */}
              <div style={{ display: 'inline-block', marginBottom: '20px' }}>
                <div className="font-panton" style={{
                  background: '#474350',
                  color: '#ffffff',
                  padding: '7px 18px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  letterSpacing: '0.08em',
                  transform: 'skewX(-8deg)',
                  boxShadow: '0 6px 15px rgba(71, 67, 80, 0.15)'
                }}>
                  <span style={{ transform: 'skewX(8deg)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#D43F4A' }}>●</span> AUTOREVOLEZZA & RADICAMENTO TERRITORIALE
                  </span>
                </div>
              </div>

              <h1 className="font-panton" style={{
                fontSize: 'clamp(36px, 4.4vw, 56px)',
                fontWeight: 900,
                fontStyle: 'italic',
                lineHeight: 1.1,
                color: '#474350',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                marginBottom: '20px'
              }}>
                La radio non mostra.<br />
                <span style={{ color: '#D43F4A' }}>Fa immaginare.</span><br />
                E ciò che immagini è già tuo.
              </h1>

              {/* Soundwave a matrice grafica dal brand book (pagina 7) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                height: '28px',
                margin: '16px 0 24px'
              }}>
                {[6, 12, 18, 26, 16, 22, 28, 20, 14, 24, 28, 18, 10, 22, 28, 14, 8, 16, 24, 18, 10, 6].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: '4px',
                      height: `${h}px`,
                      borderRadius: '2px',
                      background: i % 3 === 0 ? '#D43F4A' : '#474350',
                      opacity: 0.85
                    }}
                  ></div>
                ))}
                <span className="font-panton" style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#6b7280',
                  letterSpacing: '0.12em',
                  marginLeft: '10px',
                  textTransform: 'uppercase'
                }}>
                  DIFFUSIONE CAPILLARE FM & DAB+
                </span>
              </div>

              <p style={{
                fontSize: '17px',
                color: '#474350',
                lineHeight: 1.65,
                marginBottom: '32px',
                fontWeight: 450
              }}>
                In un ecosistema digitale saturo di notifiche volatili e banner ignorati, <b>Radio Toscana</b> unisce la credibilità dell'informazione regionale e la forza della grande musica: la voce dell'emittente entra ogni giorno nella quotidianità di <b>298.000 toscani</b>.
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <a
                  href="#preventivo"
                  className="font-panton"
                  style={{
                    background: '#D43F4A',
                    color: '#ffffff',
                    textDecoration: 'none',
                    padding: '16px 36px',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: 900,
                    fontStyle: 'italic',
                    letterSpacing: '0.06em',
                    transform: 'skewX(-6deg)',
                    boxShadow: '0 10px 25px rgba(212, 63, 74, 0.4)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span style={{ transform: 'skewX(6deg)' }}>PIANIFICA LA TUA CAMPAGNA 2026 →</span>
                </a>

                <a
                  href="#perche-la-radio"
                  className="font-panton"
                  style={{
                    background: '#ffffff',
                    color: '#474350',
                    textDecoration: 'none',
                    padding: '16px 28px',
                    borderRadius: '6px',
                    fontSize: '15px',
                    fontWeight: 800,
                    fontStyle: 'italic',
                    letterSpacing: '0.06em',
                    border: '2px solid #474350',
                    transform: 'skewX(-6deg)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ transform: 'skewX(6deg)' }}>I DATI DI EFFICACIA AUDIO ↓</span>
                </a>
              </div>
            </div>

            {/* Visual Double Exposure Ufficiale (Brand Book Pagina 1 e 8) */}
            <div style={{ position: 'relative' }}>
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
                  bottom: '18px',
                  left: '18px',
                  right: '18px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
                }}>
                  <div className="font-panton" style={{
                    fontSize: '13px',
                    fontWeight: 900,
                    fontStyle: 'italic',
                    color: '#474350'
                  }}>
                    LA VOCE DEL TERRITORIO TOSCANO
                  </div>
                  <div className="font-panton" style={{
                    background: '#D43F4A',
                    color: '#ffffff',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
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
        padding: '32px 24px',
        background: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          <div className="font-panton" style={{
            fontSize: '13px',
            fontWeight: 800,
            fontStyle: 'italic',
            letterSpacing: '0.12em',
            color: '#6b7280',
            marginBottom: '18px'
          }}>
            AZIENDE E GRANDI REALTÀ CHE SCELGONO RADIO TOSCANA PER CRESCERE
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '32px'
          }}>
            <div className="font-panton" style={{
              padding: '8px 20px',
              borderRadius: '6px',
              background: '#f8fafc',
              border: '2px solid #D43F4A',
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: '16px',
              letterSpacing: '0.08em',
              color: '#D43F4A',
              transform: 'skewX(-6deg)'
            }}>
              <span style={{ transform: 'skewX(6deg)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span>●</span> COLDIRETTI TOSCANA
              </span>
            </div>

            <div className="font-panton" style={{ fontWeight: 900, fontStyle: 'italic', fontSize: '16px', color: '#474350', letterSpacing: '0.06em' }}>
              FATTORIA DI LAVACCHIO
            </div>
            <div className="font-panton" style={{ fontWeight: 900, fontStyle: 'italic', fontSize: '16px', color: '#474350', letterSpacing: '0.06em' }}>
              TINGHI MOTORS
            </div>
            <div className="font-panton" style={{ fontWeight: 900, fontStyle: 'italic', fontSize: '16px', color: '#474350', letterSpacing: '0.06em' }}>
              TOSCANA AEROPORTI
            </div>
            <div className="font-panton" style={{ fontWeight: 900, fontStyle: 'italic', fontSize: '16px', color: '#474350', letterSpacing: '0.06em' }}>
              MERCATO CENTRALE FIRENZE
            </div>
            <div className="font-panton" style={{ fontWeight: 900, fontStyle: 'italic', fontSize: '16px', color: '#474350', letterSpacing: '0.06em' }}>
              FIVAG CISL
            </div>
            <div className="font-panton" style={{ fontWeight: 900, fontStyle: 'italic', fontSize: '16px', color: '#474350', letterSpacing: '0.06em' }}>
              HICARE SURGERY
            </div>
            <div className="font-panton" style={{ fontWeight: 900, fontStyle: 'italic', fontSize: '16px', color: '#474350', letterSpacing: '0.06em' }}>
              CARITAS FIRENZE
            </div>
          </div>
        </div>
      </section>

      {/* 5. DATI SCIENTIFICI DI EFFICACIA: ASSORADIO / POLIMI & LARADIORENDE */}
      <section id="perche-la-radio" style={{
        padding: '84px 24px',
        background: '#ffffff'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 56px' }}>
            <div className="font-panton" style={{
              color: '#D43F4A',
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: '15px',
              letterSpacing: '0.1em'
            }}>
              EVIDENZE SCIENTIFICHE DALL'OSSERVATORIO FCP-ASSORADIO & POLIMI
            </div>
            <h2 className="font-panton" style={{
              fontSize: 'clamp(30px, 3.8vw, 46px)',
              fontWeight: 900,
              fontStyle: 'italic',
              color: '#474350',
              marginTop: '10px',
              lineHeight: 1.15
            }}>
              Perché la Radio Genera il Massimo Ritorno per la Tua Impresa
            </h2>
            <p style={{ color: '#6b7280', fontSize: '16px', marginTop: '14px' }}>
              La combinazione unica di ascolto in mobilità, costo contatto competitivo e assenza di filtri digitali rende l'audio lo strumento commerciale più redditizio.
            </p>
          </div>

          {/* 3 Metric Box Istituzionali */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '48px'
          }}>
            <div style={{
              background: '#f9fafb',
              padding: '28px',
              borderRadius: '12px',
              borderLeft: '4px solid #D43F4A',
              borderTop: '1px solid #e5e7eb',
              borderRight: '1px solid #e5e7eb',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div className="font-panton" style={{ fontSize: '13px', fontWeight: 900, fontStyle: 'italic', color: '#6b7280' }}>
                MOLTIPLICATORE FATTURATO
              </div>
              <div className="font-panton" style={{ fontSize: '28px', fontWeight: 900, fontStyle: 'italic', color: '#474350', margin: '6px 0' }}>
                10€ di Ritorno per 1€ Investito
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                Studio scientifico FCP / Politecnico di Milano sul ROI medio della pianificazione radiofonica continuativa.
              </div>
            </div>

            <div style={{
              background: '#f9fafb',
              padding: '28px',
              borderRadius: '12px',
              borderLeft: '4px solid #474350',
              borderTop: '1px solid #e5e7eb',
              borderRight: '1px solid #e5e7eb',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div className="font-panton" style={{ fontSize: '13px', fontWeight: 900, fontStyle: 'italic', color: '#6b7280' }}>
                RICERCA DIGITALE IMMEDIATA
              </div>
              <div className="font-panton" style={{ fontSize: '28px', fontWeight: 900, fontStyle: 'italic', color: '#474350', margin: '6px 0' }}>
                58% Drive-to-Web in 90 Minuti
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                La maggioranza degli ascoltatori effettua una ricerca su Google del brand entro un'ora e mezza dal passaggio on-air.
              </div>
            </div>

            <div style={{
              background: '#f9fafb',
              padding: '28px',
              borderRadius: '12px',
              borderLeft: '4px solid #D43F4A',
              borderTop: '1px solid #e5e7eb',
              borderRight: '1px solid #e5e7eb',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div className="font-panton" style={{ fontSize: '13px', fontWeight: 900, fontStyle: 'italic', color: '#6b7280' }}>
                ASCOLTO FUORI CASA
              </div>
              <div className="font-panton" style={{ fontSize: '28px', fontWeight: 900, fontStyle: 'italic', color: '#474350', margin: '6px 0' }}>
                75% in Mobilità e in Auto
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                Il contatto avviene mentre i consumatori si spostano per lavoro, acquisti e tempo libero nel territorio regionale.
              </div>
            </div>
          </div>

          {/* 4 Pilastri di Efficacia */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '24px'
          }}>
            <div style={{
              background: '#f9fafb',
              borderRadius: '14px',
              padding: '30px 24px',
              border: '1px solid #e5e7eb',
              borderTop: '4px solid #D43F4A'
            }}>
              <div className="font-panton" style={{ fontSize: '13px', fontWeight: 900, fontStyle: 'italic', color: '#D43F4A', marginBottom: '8px' }}>
                PILASTRO 01 // PSICOACUSTICA
              </div>
              <h3 className="font-panton" style={{ fontSize: '22px', fontWeight: 900, fontStyle: 'italic', color: '#474350', marginBottom: '10px' }}>
                L'Effetto Immaginazione
              </h3>
              <p style={{ color: '#474350', fontSize: '14px', lineHeight: 1.6 }}>
                Non imponendo un'immagine rigida sullo schermo, la voce induce l'ascoltatore a visualizzare il prodotto. Questo processo neurologico crea ricordi duraturi e personali, aumentando l'intenzione d'acquisto fino a 3 volte rispetto al web display.
              </p>
            </div>

            <div style={{
              background: '#f9fafb',
              borderRadius: '14px',
              padding: '30px 24px',
              border: '1px solid #e5e7eb',
              borderTop: '4px solid #474350'
            }}>
              <div className="font-panton" style={{ fontSize: '13px', fontWeight: 900, fontStyle: 'italic', color: '#474350', marginBottom: '8px' }}>
                PILASTRO 02 // CALL TO ACTION
              </div>
              <h3 className="font-panton" style={{ fontSize: '22px', fontWeight: 900, fontStyle: 'italic', color: '#474350', marginBottom: '10px' }}>
                Drive-to-Store & Territorio
              </h3>
              <p style={{ color: '#474350', fontSize: '14px', lineHeight: 1.6 }}>
                L'ascolto avviene prima dell'acquisto, spesso in auto verso il centro commerciale o il negozio. Il 58% cerca il nome dell'azienda su Google o naviga il sito e-commerce entro un'ora e mezza dal messaggio on-air.
              </p>
            </div>

            <div style={{
              background: '#f9fafb',
              borderRadius: '14px',
              padding: '30px 24px',
              border: '1px solid #e5e7eb',
              borderTop: '4px solid #D43F4A'
            }}>
              <div className="font-panton" style={{ fontSize: '13px', fontWeight: 900, fontStyle: 'italic', color: '#D43F4A', marginBottom: '8px' }}>
                PILASTRO 03 // RESISTENZA AL BLOCCO
              </div>
              <h3 className="font-panton" style={{ fontSize: '22px', fontWeight: 900, fontStyle: 'italic', color: '#474350', marginBottom: '10px' }}>
                100% Ascolto Reale No-Skip
              </h3>
              <p style={{ color: '#474350', fontSize: '14px', lineHeight: 1.6 }}>
                Mani sul volante, occhi sulla strada: la radio non soffre di banner blindness né di pulsanti "salta annuncio". Lo spot viene ascoltato dall'inizio alla fine nella sua interezza.
              </p>
            </div>

            <div style={{
              background: '#f9fafb',
              borderRadius: '14px',
              padding: '30px 24px',
              border: '1px solid #e5e7eb',
              borderTop: '4px solid #474350'
            }}>
              <div className="font-panton" style={{ fontSize: '13px', fontWeight: 900, fontStyle: 'italic', color: '#474350', marginBottom: '8px' }}>
                PILASTRO 04 // REDDITIVITÀ
              </div>
              <h3 className="font-panton" style={{ fontSize: '22px', fontWeight: 900, fontStyle: 'italic', color: '#474350', marginBottom: '10px' }}>
                ROI Moltiplicatore x10
              </h3>
              <p style={{ color: '#474350', fontSize: '14px', lineHeight: 1.6 }}>
                I dati confermano che ogni euro investito in radio genera mediamente 10 euro di fatturato. Il minor costo per contatto della pianificazione toscana protegge il budget aziendale e massimizza la resa commerciale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DRIVE-TO-STORE & VISUAL FIRENZE */}
      <section id="drivetosite" style={{
        padding: '84px 24px',
        background: '#f7f7f9',
        borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '48px',
            alignItems: 'center'
          }}>
            <div>
              <div className="font-panton" style={{
                background: '#D43F4A',
                color: '#ffffff',
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 900,
                fontStyle: 'italic',
                transform: 'skewX(-8deg)',
                marginBottom: '16px'
              }}>
                <span style={{ transform: 'skewX(8deg)', display: 'inline-block' }}>
                  DALL'ON-AIR AL NEGOZIO FISICO & SITO WEB
                </span>
              </div>

              <h2 className="font-panton" style={{
                fontSize: 'clamp(28px, 3.4vw, 42px)',
                fontWeight: 900,
                fontStyle: 'italic',
                color: '#474350',
                lineHeight: 1.18,
                marginBottom: '18px'
              }}>
                Come Radio Toscana Porta Clienti Reali alla Tua Impresa
              </h2>

              <p style={{ color: '#474350', fontSize: '16px', lineHeight: 1.65, marginBottom: '24px' }}>
                Negli spostamenti quotidiani tra Firenze, Prato, Pistoia, l'arco tirrenico e l'entroterra, la radio è la voce fidata e autorevole per centinaia di migliaia di residenti e professionisti.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '4px',
                    background: '#D43F4A',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '13px',
                    flexShrink: 0
                  }}>✓</div>
                  <div>
                    <b style={{ color: '#474350' }}>67% Responsabili d'Acquisto:</b>{' '}
                    <span style={{ color: '#6b7280' }}>Il pubblico decide le spese della famiglia o dell'azienda durante l'ascolto quotidiano.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '4px',
                    background: '#D43F4A',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '13px',
                    flexShrink: 0
                  }}>✓</div>
                  <div>
                    <b style={{ color: '#474350' }}>Top of Mind sul Territorio:</b>{' '}
                    <span style={{ color: '#6b7280' }}>La ripetizione costante del tuo messaggio crea familiarità e riconoscibilità immediata.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '4px',
                    background: '#D43F4A',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '13px',
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
                className="font-panton"
                style={{
                  background: '#474350',
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: '14px 28px',
                  borderRadius: '6px',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  fontSize: '15px',
                  letterSpacing: '0.06em',
                  transform: 'skewX(-6deg)',
                  display: 'inline-flex',
                  alignItems: 'center',
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
              border: '4px solid #ffffff'
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
      <section id="copertura" style={{
        padding: '70px 24px',
        background: '#ffffff'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}>
            <div className="font-panton" style={{
              color: '#D43F4A',
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: '13px',
              letterSpacing: '0.1em'
            }}>
              FLESSIBILITÀ DI PIANIFICAZIONE TERRITORIALE
            </div>
            <h2 className="font-panton" style={{
              fontSize: 'clamp(26px, 3.2vw, 38px)',
              fontWeight: 900,
              fontStyle: 'italic',
              color: '#474350',
              marginTop: '8px'
            }}>
              I 4 Macro-Bacini Commerciali della Toscana
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '20px'
          }}>
            <div style={{ background: '#f9fafb', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', borderLeft: '4px solid #D43F4A' }}>
              <div className="font-panton" style={{ fontSize: '13px', fontWeight: 900, fontStyle: 'italic', color: '#D43F4A' }}>AREA 1 • METROPOLITANA</div>
              <div className="font-panton" style={{ fontSize: '20px', fontWeight: 900, fontStyle: 'italic', color: '#474350', margin: '4px 0' }}>Firenze, Prato, Pistoia</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>104.7 FM & 88.0 FM. Il bacino a massima densità commerciale, uffici e retail.</div>
            </div>

            <div style={{ background: '#f9fafb', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', borderLeft: '4px solid #474350' }}>
              <div className="font-panton" style={{ fontSize: '13px', fontWeight: 900, fontStyle: 'italic', color: '#474350' }}>AREA 2 • POLO TIRRENICO</div>
              <div className="font-panton" style={{ fontSize: '20px', fontWeight: 900, fontStyle: 'italic', color: '#474350', margin: '4px 0' }}>Pisa, Lucca, Livorno</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>102.8 FM & DAB+. Polo logistico, universitario e costiero ad alta mobilità.</div>
            </div>

            <div style={{ background: '#f9fafb', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', borderLeft: '4px solid #D43F4A' }}>
              <div className="font-panton" style={{ fontSize: '13px', fontWeight: 900, fontStyle: 'italic', color: '#D43F4A' }}>AREA 3 • ENTROTERRA & VALLI</div>
              <div className="font-panton" style={{ fontSize: '20px', fontWeight: 900, fontStyle: 'italic', color: '#474350', margin: '4px 0' }}>Arezzo, Siena, Empolese</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>Copertura strategica per artigianato d'eccellenza, manifattura e turismo.</div>
            </div>

            <div style={{ background: '#f9fafb', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', borderLeft: '4px solid #474350' }}>
              <div className="font-panton" style={{ fontSize: '13px', fontWeight: 900, fontStyle: 'italic', color: '#474350' }}>AREA 4 • DIGITAL &amp; MULTIPLATFORM</div>
              <div className="font-panton" style={{ fontSize: '20px', fontWeight: 900, fontStyle: 'italic', color: '#474350', margin: '4px 0' }}>Streaming, App, Web &amp; Podcast</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>Piattaforma streaming HD, App Radio Toscana, Smart Speaker e canali web per un'audience sempre connessa.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FORM DI PIANIFICAZIONE RISERVATA */}
      <section id="preventivo" style={{
        padding: '84px 24px',
        background: '#f7f7f9',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '48px 40px',
            boxShadow: '0 20px 50px rgba(71, 67, 80, 0.1)',
            border: '2px solid #e5e7eb'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div className="font-panton" style={{
                background: '#474350',
                color: '#ffffff',
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 900,
                fontStyle: 'italic',
                transform: 'skewX(-8deg)',
                marginBottom: '12px'
              }}>
                <span style={{ transform: 'skewX(8deg)', display: 'inline-block' }}>
                  PIANIFICAZIONE MEDIA RISERVATA 2026
                </span>
              </div>
              <h2 className="font-panton" style={{ fontSize: '32px', fontWeight: 900, fontStyle: 'italic', color: '#474350' }}>
                Richiedi la Proposta Commerciale per la Tua Azienda
              </h2>
              <p style={{ color: '#6b7280', fontSize: '15px', marginTop: '6px' }}>
                Il nostro ufficio pianificazione ti fornirà la stima di copertura e il listino agevolato per il tuo bacino d'interesse.
              </p>
            </div>

            {submitted ? (
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
                <div style={{ fontSize: '13px', color: '#166534', fontWeight: 700 }}>
                  Per urgenze immediate: chiama Fabio al <a href="tel:3476818595" style={{ color: '#166534', textDecoration: 'underline' }}>347 6818595</a>.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#474350', marginBottom: '6px' }}>
                    Nome Azienda / Attività *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="es. Fattoria di Lavacchio, Tinghi Motors..."
                    value={formData.azienda}
                    onChange={(e) => setFormData({ ...formData, azienda: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #d1d5db',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#474350', marginBottom: '6px' }}>
                    Nome e Cognome Referente
                  </label>
                  <input
                    type="text"
                    placeholder="es. Mario Rossi"
                    value={formData.referente}
                    onChange={(e) => setFormData({ ...formData, referente: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #d1d5db',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#474350', marginBottom: '6px' }}>
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
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #d1d5db',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#474350', marginBottom: '6px' }}>
                    Email Aziendale
                  </label>
                  <input
                    type="email"
                    placeholder="es. direzione@azienda.it"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #d1d5db',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#474350', marginBottom: '6px' }}>
                    Area Territoriale Target
                  </label>
                  <select
                    value={formData.areaInteresse}
                    onChange={(e) => setFormData({ ...formData, areaInteresse: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #d1d5db',
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
                    <option value="Area 4 (Digital, Streaming &amp; Web)">Area 4 (Digital, Streaming &amp; Web)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#474350', marginBottom: '6px' }}>
                    Formato di Pianificazione
                  </label>
                  <select
                    value={formData.formatoInteresse}
                    onChange={(e) => setFormData({ ...formData, formatoInteresse: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #d1d5db',
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
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#474350', marginBottom: '6px' }}>
                    Obiettivo o Note Aggiuntive
                  </label>
                  <textarea
                    rows={3}
                    placeholder="es. Promozione nuovo punto vendita, campagna stagionale, notorietà di brand..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #d1d5db',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  ></textarea>
                </div>

                {errorMsg && (
                  <div style={{ gridColumn: '1 / -1', color: '#b91c1c', background: '#fee2e2', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>
                    ⚠️ {errorMsg}
                  </div>
                )}

                <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
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
            )}
          </div>
        </div>
      </section>

      {/* 9. FOOTER UFFICIALE RADIO MONTE SERRA S.R.L. */}
      <footer style={{
        background: '#474350',
        color: '#d1d5db',
        padding: '54px 24px 36px',
        borderTop: '3px solid #D43F4A'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
            paddingBottom: '32px',
            marginBottom: '28px'
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
              <div style={{ borderLeft: '2px solid #D43F4A', paddingLeft: '14px' }}>
                <div className="font-panton" style={{ color: '#ffffff', fontWeight: 900, fontStyle: 'italic', fontSize: '15px' }}>
                  RADIO MONTE SERRA S.R.L.
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  Emittente Regionale della Toscana • Sede Operativa: Firenze
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '13px' }}>
              <span style={{ color: '#ffffff', fontWeight: 600 }}>Ufficio Pubblicità:</span>
              <a href="tel:3476818595" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 800 }}>
                📞 347 6818595
              </a>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
              <a href="mailto:pubblicita@radiotoscana.it" style={{ color: '#ffffff', textDecoration: 'none' }}>
                ✉️ pubblicita@radiotoscana.it
              </a>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            fontSize: '12px',
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
