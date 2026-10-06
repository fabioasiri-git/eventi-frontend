'use client';

import React, { useState } from 'react';

export default function LandingPubblicita() {
  const [formData, setFormData] = useState({
    azienda: '',
    referente: '',
    telefono: '',
    email: '',
    settore: 'Commercio / Retail',
    areaInteresse: 'AREA 1 (Firenze, Prato, Pistoia)',
    formatoInteresse: 'Spot Tabellari 20"',
    obiettivo: 'Portare nuovi clienti nel punto vendita',
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
          source: 'Landing Media Kit 2026 Radio Toscana',
          utm_campaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') || 'media-kit-2026' : 'media-kit-2026'
        })
      });

      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(json.error || 'Si è verificato un errore durante l\'invio.');
      }
    } catch (err) {
      setErrorMsg('Errore di connessione. Riprova tra poco.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#090d16',
      color: '#f8fafc',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      minHeight: '100vh',
      lineHeight: 1.6
    }}>
      {/* TOP TICKER UFFICIALE */}
      <div style={{
        background: 'linear-gradient(90deg, #991b1b 0%, #dc2626 50%, #991b1b 100%)',
        color: '#ffffff',
        fontSize: '13px',
        fontWeight: 800,
        padding: '10px 16px',
        textAlign: 'center',
        letterSpacing: '0.02em',
        boxShadow: '0 2px 12px rgba(220, 38, 38, 0.35)'
      }}>
        📻 MEDIA KIT COMMERCIALE 2026: Dati Audiradio certificati, splittaggi FM/DAB+ e soluzioni on-air per far crescere la tua azienda in Toscana.
      </div>

      {/* HEADER PROFESSIONALE CON LOGO UFFICIALE E CONTATTO DIRETTO */}
      <header style={{
        padding: '16px 24px',
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/logo_radio_toscana.png" alt="Radio Toscana" style={{ height: '46px', width: 'auto', objectFit: 'contain' }} />
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 900, color: '#ef4444', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              SOLO TOSCANA | SOLO HIT
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
              Ufficio Commerciale • Radio Monte Serra S.r.l.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="tel:3476818595"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#f8fafc',
              textDecoration: 'none',
              fontSize: '13.5px',
              fontWeight: 700,
              background: 'rgba(255,255,255,0.06)',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.12)'
            }}
          >
            <span>👤</span> <span>Fabio Asiri: <strong>347 6818595</strong></span>
          </a>
          <a
            href="#richiesta-preventivo"
            style={{
              background: '#dc2626',
              color: '#ffffff',
              padding: '9px 18px',
              borderRadius: '8px',
              fontWeight: 900,
              fontSize: '13px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.45)',
              transition: 'all 0.2s',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            Richiedi Piano Media ➔
          </a>
        </div>
      </header>

      {/* HERO SECTION CON DATI AUDIRADIO */}
      <section style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '50px 24px 40px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.95fr',
        gap: '44px',
        alignItems: 'center'
      }}>
        {/* COLONNA SX */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(220, 38, 38, 0.12)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            color: '#f87171',
            padding: '5px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.04em',
            marginBottom: '18px'
          }}>
            <span>📊</span> MEDIA KIT 2026 • DATI AUDIRADIO I SEMESTRE 2025
          </div>

          <h1 style={{
            fontSize: '44px',
            lineHeight: 1.15,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            margin: '0 0 18px',
            color: '#ffffff'
          }}>
            La radio che racconta la Toscana, suona solo le hit e <span style={{ color: '#ef4444' }}>fa crescere la tua azienda</span>.
          </h1>

          <p style={{
            fontSize: '17px',
            lineHeight: 1.6,
            color: '#94a3b8',
            margin: '0 0 24px',
            maxWidth: '580px'
          }}>
            Radio Toscana è la tua community: un&apos;informazione puntuale, l&apos;intrattenimento dei conduttori più amati della regione e un pubblico ad altissima fedeltà pronto a scoprire i tuoi prodotti e servizi.
          </p>

          {/* DATI AUDIENCE BOX (PAGINA 10 E 11 DEL MEDIA KIT) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '28px'
          }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#ef4444' }}>298.000</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Ascoltatori Settimanali*</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff' }}>61.000</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Media Giorno Medio*</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff' }}>61 Minuti</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Durata Media Ascolto*</div>
            </div>
          </div>

          {/* TARGET DEMOGRAFICO (PAGINA 11 MEDIA KIT) */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.06)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '10px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '22px' }}>🛒</span>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>67% Responsabili di Acquisto</div>
                <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>47,5% Laurea/Diploma • 52% Uomo / 48% Donna</div>
              </div>
            </div>
            <span style={{ fontSize: '10.5px', color: '#64748b', fontStyle: 'italic' }}>*Fonte: Audiradio I sem. 2025</span>
          </div>
        </div>

        {/* COLONNA DX: FORM DIRETTO */}
        <div id="richiesta-preventivo" style={{
          background: 'linear-gradient(145deg, #131926 0%, #0c101a 100%)',
          borderRadius: '16px',
          padding: '34px 30px',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          position: 'relative'
        }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 10px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
                Richiesta Ricevuta!
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
                Grazie <strong>{formData.referente || formData.azienda}</strong>. La tua richiesta è stata presa in carico direttamente da <strong>Fabio Asiri</strong> (Resp. Commerciale Radio Toscana). Ti ricontatteremo entro 24 ore con il piano media dettagliato e la quotazione riservata.
              </p>
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '14px',
                borderRadius: '8px',
                color: '#34d399',
                fontSize: '13px',
                fontWeight: 600
              }}>
                📞 Vuoi parlare subito con Fabio? Chiama il <strong>347 6818595</strong> o lo <strong>055 285030</strong>
              </div>
            </div>
          ) : (
            <div>
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 800,
                display: 'inline-block',
                marginBottom: '10px'
              }}>
                ⚡ PREVENTIVO &amp; MEDIA KIT PERSONALIZZATO
              </div>

              <h2 style={{ fontSize: '23px', fontWeight: 900, color: '#ffffff', margin: '0 0 6px' }}>
                Costruiamo la Tua Campagna
              </h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 18px' }}>
                Seleziona l&apos;area geografica e il formato: elaboriamo la migliore rotazione oraria per il tuo budget.
              </p>

              {errorMsg && (
                <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px', borderRadius: '6px', fontSize: '12px', marginBottom: '16px' }}>
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '3px' }}>
                    Nome Azienda o Insegna *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="es. Fattoria / Concessionaria / Brand"
                    value={formData.azienda}
                    onChange={(e) => setFormData({ ...formData, azienda: e.target.value })}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#ffffff',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '3px' }}>
                      Referente
                    </label>
                    <input
                      type="text"
                      placeholder="es. Mario Rossi"
                      value={formData.referente}
                      onChange={(e) => setFormData({ ...formData, referente: e.target.value })}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '13.5px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '3px' }}>
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
                        boxSizing: 'border-box',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '13.5px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '3px' }}>
                    Email Aziendale (per invio prospetto PDF)
                  </label>
                  <input
                    type="email"
                    placeholder="es. commerciale@azienda.it"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#ffffff',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* SCELTA AREA COPERTURA (PAGINA 12-13 MEDIA KIT) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '3px' }}>
                      Area di Copertura Target
                    </label>
                    <select
                      value={formData.areaInteresse}
                      onChange={(e) => setFormData({ ...formData, areaInteresse: e.target.value })}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px',
                        borderRadius: '8px',
                        background: '#1a2234',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '12.5px',
                        outline: 'none'
                      }}
                    >
                      <option value="AREA 1 (Firenze, Prato, Pistoia)">Area 1: Firenze, Prato, Pistoia</option>
                      <option value="AREA 2 (La Costa: Pisa, Livorno, Lucca, Massa)">Area 2: La Costa (PI, LI, LU, MS)</option>
                      <option value="AREA 3 (Toscana Interna: AR, SI, GR, Mugello)">Area 3: Toscana Interna (AR, SI, GR)</option>
                      <option value="TUTTA LA TOSCANA (Copertura Totale FM + DAB+)">Tutta la Toscana (Copertura Totale)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '3px' }}>
                      Formato Pubblicitario
                    </label>
                    <select
                      value={formData.formatoInteresse}
                      onChange={(e) => setFormData({ ...formData, formatoInteresse: e.target.value })}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px',
                        borderRadius: '8px',
                        background: '#1a2234',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '12.5px',
                        outline: 'none'
                      }}
                    >
                      <option value="Spot Tabellari 20&quot;">Spot Tabellari (10&quot;, 20&quot;, 30&quot;)</option>
                      <option value="Primo di Barra (Cluster Prioritario)">Primo di Barra (Posizione Esclusiva)</option>
                      <option value="Citazioni Speaker (30&quot;, 60&quot;, 90&quot;)">Citazioni Speaker (30&quot;, 60&quot;, 90&quot;)</option>
                      <option value="Intervista / Pillola Redazionale">Intervista / Pillola Redazionale (60-90&quot;)</option>
                      <option value="Sponsorizzazione Programma Masti">Morning Show Alessandro Masti</option>
                      <option value="Sponsorizzazione Rubriche / Meteo">Sponsorizzazione Meteo / Viabilità / Rubriche</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: '8px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                    color: '#ffffff',
                    padding: '14px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 900,
                    fontSize: '14.5px',
                    cursor: loading ? 'wait' : 'pointer',
                    boxShadow: '0 6px 20px rgba(239, 68, 68, 0.45)',
                    transition: 'all 0.2s',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  {loading ? 'Elaborazione in corso...' : 'Ricevi Proposta Personalizzata ➔'}
                </button>

                <div style={{ fontSize: '10.5px', color: '#64748b', textAlign: 'center', marginTop: '2px' }}>
                  🔒 Nessun vincolo contrattuale. Assistenza diretta Fabio Asiri (Radio Toscana).
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* 6 BUONI MOTIVI PER SCEGLIERE RADIO TOSCANA (PAGINA 3 DEL MEDIA KIT) */}
      <section style={{
        background: '#0d121d',
        padding: '70px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 46px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#ef4444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              PUNTO PER PUNTO DAL MEDIA KIT UFFICIALE
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              6 Buoni Motivi per Scegliere Radio Toscana e Far Crescere la Tua Azienda
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '22px' }}>
            {[
              {
                num: '1',
                title: 'Arrivi ovunque, in tutta la Toscana',
                desc: 'Grazie a un segnale potente e preciso raggiungi ascoltatori in ogni parte della nostra regione: nelle case, nelle aziende, nei negozi e in auto.'
              },
              {
                num: '2',
                title: 'È la più toscana di tutte',
                desc: 'Con noi la tua storia sarà ancora più grande ed il protagonista sarai proprio tu. Fai scoprire ai toscani i tuoi prodotti dando vera "voce" al tuo brand.'
              },
              {
                num: '3',
                title: 'Troverai un pubblico "di amici"',
                desc: 'Pronti a conoscere il tuo brand, ascoltare la tua storia e acquistare i tuoi prodotti. Tanti ascoltatori "fedelissimi" integrati con continui nuovi arrivi.'
              },
              {
                num: '4',
                title: 'È convincente: speaker come influencer',
                desc: 'I nostri conduttori sono capaci di ispirare i consumatori e orientare velocemente le decisioni d’acquisto grazie a un rapporto di fiducia coltivato nel tempo.'
              },
              {
                num: '5',
                title: 'Originale, creativa e in onda in pochi giorni',
                desc: 'Grazie a un grande lavoro di squadra la tua pubblicità sarà pronta e registrata nel giro di pochissimi giorni, curata dalla scrittura all\'incisione in regia.'
              },
              {
                num: '6',
                title: 'La soluzione perfetta per qualsiasi budget',
                desc: 'Piani modulari su misura: dai pacchetti locali iper-mirati fino alle grandi campagne di rete regionale, c\'è sempre la combinazione perfetta per le tue esigenze.'
              }
            ].map((box, idx) => (
              <div key={idx} style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '28px 24px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.08)',
                position: 'relative'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px'
                }}>
                  {box.num}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '0 0 10px' }}>
                  {box.title}
                </h3>
                <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                  {box.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* I PROGRAMMI E GLI SPEAKER DI PUNTA (PAGINE 5 E 6 DEL MEDIA KIT) */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '70px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 46px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#ef4444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
            IL PALINSESTO RADIO TOSCANA
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', margin: 0 }}>
            I Nostri Conduttori: Voci che la Toscana Riconosce e Ama
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '15.5px', marginTop: '10px' }}>
            Ogni ora notiziari locali, aggiornamenti meteo e viabilità per sapere tutto quello che succede nella nostra regione.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '22px' }}>
          {/* MASTI */}
          <div style={{ background: '#111624', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' }}>Dalle 8:00 alle 10:00 • Morning Show</span>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '6px 0 10px' }}>Alessandro Masti</h3>
            <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
              Un autentico mix di simpatia, arguzia e pungente toscanità che da sempre lo rende un personaggio inconfondibile al microfono. Il picco assoluto di ascolto per iniziare la giornata.
            </p>
          </div>

          {/* GIULIA QUERCIOLI */}
          <div style={{ background: '#111624', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' }}>Dalle 10:00 alle 13:00</span>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '6px 0 10px' }}>Giulia Quercioli</h3>
            <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
              Il timone della radio passa a Giulia: la mattina scorre vivace, leggera e con il sorriso, tra giochi, enigmi, curiosità e tutte le hit di ieri e di oggi.
            </p>
          </div>

          {/* ALESSANDRA RICCETTI */}
          <div style={{ background: '#111624', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' }}>Dalle 13:00 alle 16:00</span>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '6px 0 10px' }}>Alessandra Riccetti</h3>
            <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
              La voce bellissima, gentile e accogliente di Alessandra per raccontare le meraviglie della Toscana, le eccellenze del territorio e la musica che ti tiene compagnia nel primo pomeriggio.
            </p>
          </div>

          {/* EMILIANO GERI */}
          <div style={{ background: '#111624', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' }}>Dalle 16:00 alle 19:00 • Memory</span>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '6px 0 10px' }}>Emiliano Geri</h3>
            <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
              Gli anni passano, la musica resta: film, concerti, personaggi e ricordi nel drive-time del rientro serale dal lavoro con il format Memory.
            </p>
          </div>

          {/* NOTIZIE */}
          <div style={{ background: '#111624', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' }}>Ore 07:00-08:00 &amp; 19:00-20:00</span>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '6px 0 10px' }}>Radio Toscana Notizie</h3>
            <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
              Due notiziari di approfondimento regionali, rassegna stampa curata dalla redazione, commenti con ospiti e breaking news all&apos;inizio di ogni ora.
            </p>
          </div>

          {/* QUELLI DEL WEEKEND */}
          <div style={{ background: '#111624', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' }}>Sabato e Domenica 15:00-19:00</span>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '6px 0 10px' }}>Quelli del Weekend</h3>
            <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
              Veronica Bellandi Bulgari e Giulio Dispensieri: una montagna di sorrisi, canzoni ed energia per scoprire gli eventi e le eccellenze del fine settimana.
            </p>
          </div>
        </div>
      </section>

      {/* FM / LE AREE E LO SPLITTAGGIO GEOGRAFICO (PAGINE 12 E 13 DEL MEDIA KIT) */}
      <section style={{
        background: '#0d121d',
        padding: '70px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 46px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#ef4444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              PIANIFICAZIONE GEOGRAFICA INTELLIGENTE
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              Scegli la Tua Dimensione: Acquisto per Area o Tutta la Toscana
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '15.5px', marginTop: '10px' }}>
              Grazie alla nostra tecnologia di splittaggio puoi concentrarti sulla tua provincia di riferimento oppure conquistare l&apos;intera regione.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#ef4444', marginBottom: '6px' }}>AREA 1</div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '0 0 10px' }}>Firenze • Prato • Pistoia</h3>
              <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 12px' }}>
                Il cuore economico e la zona più popolosa della Toscana. Ideale per attività commerciali, concessionarie e retail locale.
              </p>
              <div style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 700 }}>FM: 104.7 • 98.2</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#ef4444', marginBottom: '6px' }}>AREA 2</div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '0 0 10px' }}>La Costa</h3>
              <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 12px' }}>
                Da Massa a Livorno, Lucca, Pisa e Follonica. Forte presenza turistica e commerciale, perfetta per attività stagionali e non.
              </p>
              <div style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 700 }}>FM: 88.0 • 87.9</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#ef4444', marginBottom: '6px' }}>AREA 3</div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '0 0 10px' }}>Toscana Interna</h3>
              <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 12px' }}>
                Arezzo, Siena, Grosseto, Mugello, Valdarno e Valdisieve. Territorio ricco di eccellenze e forte identità locale.
              </p>
              <div style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 700 }}>FM: 104.7 • 87.8 • 107.6 • 95.8</div>
            </div>

            <div style={{ background: 'linear-gradient(145deg, #1e2638 0%, #111726 100%)', padding: '24px 20px', borderRadius: '12px', border: '1.5px solid #ef4444' }}>
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#38bdf8', marginBottom: '6px' }}>AREA 4 &amp; RETE</div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '0 0 10px' }}>Tutta la Toscana + Digital</h3>
              <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 12px' }}>
                Copertura totale su tutta la regione in FM + Digitale DAB+, App iOS/Android, Alexa, Google Home, CarPlay e Android Auto.
              </p>
              <div style={{ fontSize: '11px', color: '#34d399', fontWeight: 800 }}>Capillarità Totale 100%</div>
            </div>
          </div>
        </div>
      </section>

      {/* FORMATI COMMERCIALI & OPZIONI DI CRESCITA (PAGINE 7, 8 E 9 DEL MEDIA KIT) */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '70px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 46px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#ef4444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
            FACCIAMO CRESCERE IL TUO BRAND
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', margin: 0 }}>
            Tutti i Formati Disponibili a Listino
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '22px' }}>
          <div style={{ background: '#111624', padding: '26px 22px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444' }}>DURATA 10&quot;, 20&quot;, 30&quot;</span>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#ffffff', margin: '6px 0 10px' }}>Spot Tradizionale</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              La forza espressiva della musica unita a parole che raccontano la tua azienda. Produzione copy e incisione in studio con speaker professionisti.
            </p>
          </div>

          <div style={{ background: '#111624', padding: '26px 22px', borderRadius: '12px', border: '1.5px solid #ef4444' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8' }}>POSIZIONAMENTO ESCLUSIVO</span>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#ffffff', margin: '6px 0 10px' }}>Primo di Barra (10&quot;)</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Lo spot viene collocato all&apos;inizio del cluster pubblicitario in posizione privilegiata. Sarai il primo ad arrivare agli ascoltatori con massima attenzione.
            </p>
          </div>

          <div style={{ background: '#111624', padding: '26px 22px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444' }}>DURATA 30&quot;, 60&quot;, 90&quot;</span>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#ffffff', margin: '6px 0 10px' }}>Citazioni Speaker</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Lo spazio che lo speaker dedica al tuo brand con il giusto tono, energia e ritmo. Anticipata da un jingle, per un coinvolgimento empatico immediato.
            </p>
          </div>

          <div style={{ background: '#111624', padding: '26px 22px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444' }}>DURATA 60&quot;, 90&quot;</span>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#ffffff', margin: '6px 0 10px' }}>Pillole &amp; Redazionali</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Un taglio informativo e meno pubblicitario per presentare un prodotto, un servizio o la storia della tua impresa con la tua stessa voce in primo piano.
            </p>
          </div>

          <div style={{ background: '#111624', padding: '26px 22px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444' }}>FORMAT DI SERVIZIO</span>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#ffffff', margin: '6px 0 10px' }}>Sponsorizzazione Rubriche</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Associa il tuo brand alle rubriche storiche: Meteo, Viabilità, Almanacco, Oroscopo, Mollica&apos;s, Avvocato Condominiale, Cucina ed Eventi.
            </p>
          </div>

          <div style={{ background: '#111624', padding: '26px 22px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444' }}>ON-SITE &amp; DIRETTE</span>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#ffffff', margin: '6px 0 10px' }}>Eventi Live &amp; Partnership</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Porta Radio Toscana al tuo evento: dirette con inviati, animazione con dj set, presentatori ufficiali e copertura radiofonica sul posto.
            </p>
          </div>
        </div>
      </section>

      {/* MEDIA PARTNERSHIP & COLLABORAZIONI (PAGINE 16 E 17 DEL MEDIA KIT) */}
      <section style={{
        background: '#0d121d',
        padding: '50px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#ef4444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
            I NOSTRI PREZIOSI MEDIA PARTNER &amp; COLLABORAZIONI AZIENDALI
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '30px',
            color: '#cbd5e1',
            fontSize: '15px',
            fontWeight: 800
          }}>
            <span>BEAT FESTIVAL EMPOLI</span>
            <span>•</span>
            <span>HALF MARATHON FIRENZE (UISP)</span>
            <span>•</span>
            <span>MIDA (MOSTRA INTERNAZIONALE ARTIGIANATO)</span>
            <span>•</span>
            <span>PISTOIA BLUES</span>
            <span>•</span>
            <span>TEDx EMPOLI WOMEN</span>
            <span>•</span>
            <span>CONFCOMMERCIO PISA</span>
            <span>•</span>
            <span>ESTRA</span>
            <span>•</span>
            <span>FOUR SEASONS</span>
          </div>
        </div>
      </section>

      {/* FOOTER UFFICIALE CON CONTATTO DIRETTO FABIO ASIRI (PAGINA 18 DEL MEDIA KIT) */}
      <footer style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '50px 24px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '30px',
        alignItems: 'center',
        borderTop: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#ef4444', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
            CRESCI CON NOI!
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', margin: '0 0 10px' }}>
            Responsabile Commerciale: Fabio Asiri
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 16px', lineHeight: 1.6 }}>
            Costruiamo insieme la crescita del tuo business tramite opzioni e offerte che rispondano appieno alle tue esigenze: spot, sponsorizzazioni, citazioni, redazionali, partnership ed eventi.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: '#cbd5e1' }}>
            <div>📞 Cell: <a href="tel:3476818595" style={{ color: '#ffffff', fontWeight: 800, textDecoration: 'none' }}>347 6818595</a></div>
            <div>✉️ Email: <a href="mailto:fabio.asiri@radiotoscana.it" style={{ color: '#ef4444', fontWeight: 700, textDecoration: 'none' }}>fabio.asiri@radiotoscana.it</a></div>
            <div>🏢 Centralino: <strong>055 285030</strong></div>
          </div>
        </div>

        <div style={{ textAlign: 'right', color: '#64748b', fontSize: '12px', lineHeight: 1.6 }}>
          <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '14px' }}>Radio Monte Serra S.r.l.</div>
          <div>Via de&apos; Pucci, 2 • 50122 Firenze (FI)</div>
          <div>P.IVA 04472740481 • CCIAA n. 453074</div>
          <div style={{ marginTop: '8px' }}>
            <a href="https://www.radiotoscana.it" target="_blank" rel="noreferrer" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 700 }}>www.radiotoscana.it</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
