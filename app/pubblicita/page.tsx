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
    obiettivo: 'Svegliare l\'attenzione dei clienti nel territorio',
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
          source: 'Landing Dystopian Monolith Radio Toscana',
          utm_campaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') || 'dystopian-2026' : 'dystopian-2026'
        })
      });

      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(json.error || 'Errore durante la trasmissione del segnale.');
      }
    } catch (err) {
      setErrorMsg('Interruzione di rete. Riprova tra poco.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#ffffff',
      color: '#000000',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      minHeight: '100vh',
      lineHeight: 1.5,
      letterSpacing: '-0.02em',
      overflowX: 'hidden'
    }}>
      {/* GLITCH / PROTOCOL TICKER BIANCO/NERO */}
      <div style={{
        background: '#000000',
        color: '#ffffff',
        fontSize: '11px',
        fontWeight: 900,
        padding: '9px 18px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '3px solid #ff0033'
      }}>
        <span>📡 PROTOCOLLO BROADCAST TOSCANA // 104.7 FM • 98.2 FM • DAB+ ATTIVO</span>
        <span style={{ color: '#ff0033', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff0033', display: 'inline-block' }}></span>
          ON AIR LIVE // 298.000 DISPOSITIVI CONNESSI
        </span>
      </div>

      {/* HEADER MONOLITICO MINIMALISTA BRUTALIST */}
      <header style={{
        padding: '24px 32px',
        maxWidth: '1360px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px solid #000000'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img
            src="/logo_radio_toscana.png"
            alt="Radio Toscana"
            style={{
              height: '52px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
          <div style={{ borderLeft: '2px solid #000000', paddingLeft: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ff0033' }}>
              SOLO TOSCANA | SOLO HIT
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#000000', letterSpacing: '0.04em' }}>
              DIVISIONE PROPAGANDA &amp; MEDIA // RADIO MONTE SERRA S.R.L.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="tel:3476818595"
            style={{
              color: '#000000',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 900,
              padding: '10px 18px',
              border: '2px solid #000000',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              background: '#ffffff',
              boxShadow: '4px 4px 0px #000000'
            }}
          >
            LINEA DIRETTA: <strong>347 6818595</strong>
          </a>
          <a
            href="#protocollo-trasmissione"
            style={{
              background: '#000000',
              color: '#ffffff',
              padding: '12px 22px',
              fontWeight: 900,
              fontSize: '13px',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              border: '2px solid #000000',
              boxShadow: '4px 4px 0px #ff0033'
            }}
          >
            PRENOTA SPAZIO ETERE ➔
          </a>
        </div>
      </header>

      {/* HERO SECTION BRUTALISTA // MANIFESTO DISTOPICO */}
      <section style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '70px 32px 60px',
        display: 'grid',
        gridTemplateColumns: '1.25fr 0.95fr',
        gap: '60px',
        alignItems: 'start'
      }}>
        {/* COLONNA SINISTRA */}
        <div>
          <div style={{
            display: 'inline-block',
            background: '#000000',
            color: '#ffffff',
            padding: '5px 12px',
            fontSize: '11px',
            fontWeight: 900,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            marginBottom: '24px'
          }}>
            [ RAPPORTO SULLA TRASMISSIONE DIRETTA // 2026 ]
          </div>

          <h1 style={{
            fontSize: '56px',
            lineHeight: 1.02,
            fontWeight: 900,
            textTransform: 'uppercase',
            margin: '0 0 24px',
            color: '#000000',
            letterSpacing: '-0.04em'
          }}>
            IL DIGITALE È SATURO.<br />
            LA PUBBLICITÀ VISIVA VIENE IGNORATA.<br />
            <span style={{ background: '#000000', color: '#ffffff', padding: '0 10px' }}>
              SOLO LA VOCE RESTA NELLA MENTE.
            </span>
          </h1>

          <p style={{
            fontSize: '19px',
            lineHeight: 1.5,
            fontWeight: 500,
            color: '#262626',
            margin: '0 0 32px',
            maxWidth: '640px'
          }}>
            Ogni giorno <strong>oltre 100.000 toscani</strong> viaggiano in auto isolati dal rumore del traffico. Non guardano schermi. Non cliccano banner. <strong>Ascoltano.</strong> La radio attraversa le difese cognitive e trasforma il tuo messaggio in un imperativo d&apos;acquisto.
          </p>

          {/* DATI AUDIENCE BRUTALIST GRID */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{ border: '2px solid #000000', padding: '18px 16px', background: '#ffffff', boxShadow: '4px 4px 0px #000000' }}>
              <div style={{ fontSize: '38px', fontWeight: 900, lineHeight: 1, color: '#ff0033' }}>298.000</div>
              <div style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '6px' }}>
                CONTATTI SETTIMANA [AUDIRADIO]
              </div>
            </div>
            <div style={{ border: '2px solid #000000', padding: '18px 16px', background: '#ffffff', boxShadow: '4px 4px 0px #000000' }}>
              <div style={{ fontSize: '38px', fontWeight: 900, lineHeight: 1, color: '#000000' }}>61 MIN</div>
              <div style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '6px' }}>
                IMMERSIONE MEDIA QUOTIDIANA
              </div>
            </div>
            <div style={{ border: '2px solid #000000', padding: '18px 16px', background: '#ffffff', boxShadow: '4px 4px 0px #000000' }}>
              <div style={{ fontSize: '38px', fontWeight: 900, lineHeight: 1, color: '#000000' }}>67%</div>
              <div style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '6px' }}>
                DECISORI &amp; RESPONSABILI ACQUISTO
              </div>
            </div>
          </div>

          {/* ASSERZIONI SCIENTIFICHE POLIMI */}
          <div style={{
            borderLeft: '4px solid #ff0033',
            background: '#f5f5f5',
            padding: '16px 20px',
            marginBottom: '10px'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ff0033', marginBottom: '4px' }}>
              EVIDENZA CLINICA // POLITECNICO DI MILANO &amp; ASSORADIO 2025:
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#000000', lineHeight: 1.45 }}>
              • Il <strong>90% delle risposte</strong> (visita al punto vendita o ricerca web) avviene entro <strong>1 ora e 33 minuti</strong> dalla messa in onda.<br />
              • Il <strong>75%</strong> degli ascoltatori converte all&apos;istante dallo smartphone durante o subito dopo il viaggio in auto.
            </div>
          </div>
        </div>

        {/* COLONNA DESTRA: TERMINALE DI PRENOTAZIONE ETERE */}
        <div id="protocollo-trasmissione" style={{
          border: '3px solid #000000',
          padding: '36px 32px',
          background: '#ffffff',
          boxShadow: '10px 10px 0px #000000',
          position: 'relative'
        }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div style={{ fontSize: '50px', marginBottom: '14px' }}>📡</div>
              <h3 style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 10px', color: '#000000' }}>
                SEGNALE ACQUISITO CON SUCCESSO
              </h3>
              <p style={{ fontSize: '14px', color: '#404040', lineHeight: 1.6, marginBottom: '24px' }}>
                La richiesta per <strong>{formData.azienda}</strong> è registrata nel registro centrale di trasmissione di Radio Monte Serra s.r.l.
                Il responsabile <strong>Fabio Asiri</strong> prenderà contatto telefonico per definire la griglia oraria e il testo del comunicato.
              </p>
              <div style={{ border: '2px solid #000000', background: '#000000', color: '#ffffff', padding: '14px', fontSize: '13px', fontWeight: 900, letterSpacing: '0.06em' }}>
                LINEA D&apos;EMERGENZA DIRETTA: 055 285030 / 347 6818595
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 900, background: '#ff0033', color: '#ffffff', padding: '3px 8px', letterSpacing: '0.1em' }}>
                  MODULO INIEZIONE PUBBLICITARIA
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#737373', letterSpacing: '0.04em' }}>
                  SLOT LIMITATI Q4
                </span>
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                PRENOTA LO SPAZIO ON-AIR
              </h2>
              <p style={{ fontSize: '12.5px', color: '#525252', margin: '0 0 20px', lineHeight: 1.45 }}>
                Compila i parametri per ricevere la disponibilità immediata nel palinsesto e il preventivo formale RMS.
              </p>

              {errorMsg && (
                <div style={{ border: '2px solid #ff0033', background: '#fff0f0', color: '#ff0033', padding: '10px', fontSize: '12px', fontWeight: 800, marginBottom: '14px' }}>
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                    1. RAGIONE SOCIALE / INSEGNA IMPRESA *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="es. TINGHI MOTORS / FATTORIA DI LAVACCHIO"
                    value={formData.azienda}
                    onChange={(e) => setFormData({ ...formData, azienda: e.target.value })}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px 14px',
                      border: '2px solid #000000',
                      background: '#ffffff',
                      color: '#000000',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                      2. REFERENTE
                    </label>
                    <input
                      type="text"
                      placeholder="es. Titolare / Resp. Mktg"
                      value={formData.referente}
                      onChange={(e) => setFormData({ ...formData, referente: e.target.value })}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '12px 14px',
                        border: '2px solid #000000',
                        background: '#ffffff',
                        color: '#000000',
                        fontSize: '13.5px',
                        fontWeight: 700,
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                      3. CONTATTO TELEFONICO *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="es. 347 0000000"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '12px 14px',
                        border: '2px solid #000000',
                        background: '#ffffff',
                        color: '#000000',
                        fontSize: '13.5px',
                        fontWeight: 700,
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                    4. INDIRIZZO EMAIL UFFICIALE
                  </label>
                  <input
                    type="email"
                    placeholder="amministrazione@azienda.it"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px 14px',
                      border: '2px solid #000000',
                      background: '#ffffff',
                      color: '#000000',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                      5. AREA GEOGRAFICA
                    </label>
                    <select
                      value={formData.areaInteresse}
                      onChange={(e) => setFormData({ ...formData, areaInteresse: e.target.value })}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '11px',
                        border: '2px solid #000000',
                        background: '#ffffff',
                        color: '#000000',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        outline: 'none'
                      }}
                    >
                      <option value="AREA 1 (Firenze, Prato, Pistoia)">AREA 1: Firenze - Prato - Pistoia</option>
                      <option value="AREA 2 (La Costa: PI, LI, LU, MS)">AREA 2: La Costa (PI, LI, LU, MS)</option>
                      <option value="AREA 3 (Toscana Interna: AR, SI, GR)">AREA 3: Interna (AR, SI, GR, Mugello)</option>
                      <option value="TUTTA LA TOSCANA (FM + DAB+ Digitale)">TUTTA LA TOSCANA (FM + DAB+)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                      6. VETTORE DI EMISSIONE
                    </label>
                    <select
                      value={formData.formatoInteresse}
                      onChange={(e) => setFormData({ ...formData, formatoInteresse: e.target.value })}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '11px',
                        border: '2px solid #000000',
                        background: '#ffffff',
                        color: '#000000',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        outline: 'none'
                      }}
                    >
                      <option value="Spot Tabellari 20&quot;">Spot Tabellare da 20&quot; (Fasce M, P, S)</option>
                      <option value="Primo di Barra (Testa del Cluster)">Primo di Barra (Posizione Esclusiva)</option>
                      <option value="Morning Show Alessandro Masti">Morning Show Alessandro Masti (08-10)</option>
                      <option value="Citazione Speaker 30&quot; o 60&quot;">Citazione Speaker in Diretta</option>
                      <option value="Sponsorizzazione Rubriche / Meteo">Sponsorizzazione Meteo / Notiziari</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: '8px',
                    background: '#000000',
                    color: '#ffffff',
                    padding: '16px 20px',
                    border: '2px solid #000000',
                    fontWeight: 900,
                    fontSize: '14.5px',
                    cursor: loading ? 'wait' : 'pointer',
                    boxShadow: '4px 4px 0px #ff0033',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    transition: 'transform 0.1s'
                  }}
                >
                  {loading ? 'TRASMISSIONE IN CORSO...' : 'INVIA RICHIESTA TRASMISSIONE ON-AIR ➔'}
                </button>

                <div style={{ fontSize: '10.5px', color: '#525252', textAlign: 'center', marginTop: '4px', letterSpacing: '0.02em' }}>
                  🔒 RISERVATEZZA GARANTITA AI SENSI DEL REG. UE 2016/679. NESSUN VINCOLO.
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* IL MANIFESTO DEI 10 PUNTI // PERCHÉ LA RADIO DOMINA IL TERRITORIO */}
      <section style={{
        background: '#000000',
        color: '#ffffff',
        padding: '80px 32px',
        borderTop: '3px solid #ff0033',
        borderBottom: '3px solid #000000'
      }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px', borderBottom: '1px solid #333333', paddingBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#ff0033', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                ANALISI COMPARATIVA DEI MEDIA // LA RADIO RENDE
              </div>
              <h2 style={{ fontSize: '38px', fontWeight: 900, textTransform: 'uppercase', margin: '6px 0 0', letterSpacing: '-0.03em' }}>
                PERCHÉ LA RADIO BATTE QUALSIASI ALTRO MEZZO
              </h2>
            </div>
            <div style={{ fontSize: '13px', color: '#a3a3a3', fontWeight: 700, textAlign: 'right' }}>
              FONTE: FCP-ASSORADIO / RICERCHE AUDIRADIO
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
            {[
              {
                code: '01 // ROI',
                title: 'HA UN ROI FINO A 10 VOLTE',
                desc: 'A parità di investimento, la radio batte la stampa e i canali display grazie al minor costo-contatto e all\'altissimo rendimento sulle vendite nel punto vendita.'
              },
              {
                code: '02 // MOMENTO GIUSTO',
                title: 'INTERCETTA PRIMA DELL\'ACQUISTO',
                desc: 'Oltre il 70% dell\'ascolto avviene in movimento: la radio è l\'ultimo punto di contatto cognitivo prima che il consumatore entri in un negozio o al supermercato.'
              },
              {
                code: '03 // ANTI-SKIPPING',
                title: 'L\'ASCOLTO NON VIENE INTERROTTO',
                desc: 'Mentre i video web vengono saltati dopo 5 secondi e i banner vengono bloccati dagli ad-blocker, lo spot radiofonico viene ascoltato interamente e senza distrazioni.'
              },
              {
                code: '04 // SHARE OF MIND',
                title: 'AUMENTA LA MEMORIA DEL BRAND',
                desc: 'La ripetizione ritmica e la componente sonora creano tracce mnemoniche indelebili: quando sorge il bisogno, il tuo marchio è il primo che viene ricordato.'
              },
              {
                code: '05 // DRIVE TO SITE',
                title: 'ATTIVA IL DIGITALE ALL\'ISTANTE',
                desc: 'Il 75% dei visitatori stimolati dallo spot accede al sito web via smartphone entro 90 minuti. La radio è il vero acceleratore del traffico web locale.'
              },
              {
                code: '06 // VELOCITÀ DI RILASCIO',
                title: 'IN ONDA IN MENO DI 48 ORE',
                desc: 'Nessuna produzione video da settimane: scrittura copy, registrazione speaker professionale in studio e programmazione immediata sui trasmettitori.'
              }
            ].map((card, idx) => (
              <div key={idx} style={{
                border: '1px solid #262626',
                background: '#0a0a0a',
                padding: '30px 24px',
                position: 'relative'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#ff0033', letterSpacing: '0.15em', marginBottom: '10px' }}>
                  {card.code}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 12px', color: '#ffffff' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '13.5px', color: '#a3a3a3', margin: 0, lineHeight: 1.6 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LA MAPPA DEL TERRITORIO // SPLITTAGGIO GEOGRAFICO */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 900, color: '#ff0033', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '8px' }}>
              TARGETING GEOGRAFICO CHIRURGICO
            </div>
            <h2 style={{ fontSize: '42px', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 20px', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
              NON PAGHI PER CHI NON TI INTERESSA.
            </h2>
            <p style={{ fontSize: '16.5px', color: '#404040', lineHeight: 1.6, margin: '0 0 28px' }}>
              Grazie alla tecnologia di splittaggio Radio Monte Serra, non sei obbligato ad acquistare l&apos;intera Toscana se la tua attività opera solo a Firenze, Prato o Pistoia. Scegli l&apos;area geografica che genera il tuo fatturato.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ border: '2px solid #000000', padding: '16px 20px', background: '#f5f5f5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '16px' }}>AREA 1: FIRENZE • PRATO • PISTOIA</strong>
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#ff0033' }}>FM 104.7 • 98.2</span>
                </div>
                <div style={{ fontSize: '13px', color: '#525252', marginTop: '4px' }}>
                  Il motore demografico ed economico della regione. La massima concentrazione di potere d&apos;acquisto.
                </div>
              </div>

              <div style={{ border: '2px solid #000000', padding: '16px 20px', background: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '16px' }}>AREA 2: LA COSTA (PISA, LIVORNO, LUCCA, MASSA)</strong>
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#000000' }}>FM 88.0 • 87.9</span>
                </div>
                <div style={{ fontSize: '13px', color: '#525252', marginTop: '4px' }}>
                  Dall&apos;area balneare e portuale fino alla Versilia. Dinamicità commerciale e turistica.
                </div>
              </div>

              <div style={{ border: '2px solid #000000', padding: '16px 20px', background: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '16px' }}>AREA 3: TOSCANA INTERNA (SIENA, AREZZO, GROSSETO)</strong>
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#000000' }}>FM 104.7 • 87.8</span>
                </div>
                <div style={{ fontSize: '13px', color: '#525252', marginTop: '4px' }}>
                  Mugello, Valdarno, Valdisieve e le province storiche del centro-sud Toscana.
                </div>
              </div>
            </div>
          </div>

          <div style={{
            border: '3px solid #000000',
            padding: '36px',
            background: '#f9f9f9',
            boxShadow: '10px 10px 0px #000000'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 900, color: '#ff0033', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>
              LEADERSHIP DIRETTA NELLA MATTINATA
            </div>
            <h3 style={{ fontSize: '30px', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 14px', lineHeight: 1.1 }}>
              IL MORNING SHOW CON ALESSANDRO MASTI (08:00 - 10:00)
            </h3>
            <p style={{ fontSize: '14.5px', color: '#404040', lineHeight: 1.6, margin: '0 0 20px' }}>
              Non è un semplice programma radiofonico: è un rito quotidiano condiviso da decine di migliaia di toscani.
              Associando il tuo brand o concordando una diretta con Alessandro Masti, acquisisci la sua credibilità e simpatia, superando qualsiasi barriera diffidente del cliente.
            </p>

            <div style={{ borderTop: '2px dashed #000000', paddingTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#ff0033' }}>PICCO MASSIMO</div>
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>DELL&apos;INTERA GIORNATA</div>
              </div>
              <a
                href="#protocollo-trasmissione"
                style={{
                  background: '#000000',
                  color: '#ffffff',
                  padding: '10px 16px',
                  fontWeight: 900,
                  fontSize: '12px',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}
              >
                VERIFICA DISPONIBILITÀ MASTI ➔
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNER CHE HANNO SCELTO LA VOCE DI RADIO TOSCANA */}
      <section style={{
        background: '#f5f5f5',
        padding: '40px 32px',
        borderTop: '2px solid #000000',
        borderBottom: '2px solid #000000'
      }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '18px', color: '#525252' }}>
            ORGANIZZAZIONI E MARCHI CHE TRASMETTONO SULLE NOSTRE FREQUENZE:
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '34px',
            fontSize: '15px',
            fontWeight: 900,
            color: '#000000'
          }}>
            <span>COLDIRETTI TOSCANA</span>
            <span>/</span>
            <span>CLK ITALIA</span>
            <span>/</span>
            <span>TINGHI MOTORS (RENAULT-DACIA)</span>
            <span>/</span>
            <span>CONFCOMMERCIO</span>
            <span>/</span>
            <span>CONFESERCENTI FIRENZE</span>
            <span>/</span>
            <span>MERCATO CENTRALE</span>
            <span>/</span>
            <span>CARITAS FIRENZE</span>
            <span>/</span>
            <span>ESTRA ENERGIA</span>
            <span>/</span>
            <span>BEAT FESTIVAL</span>
            <span>/</span>
            <span>FATTORIA DI LAVACCHIO</span>
          </div>
        </div>
      </section>

      {/* FOOTER MONOLITICO */}
      <footer style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '60px 32px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '40px',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 900, color: '#ff0033', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '6px' }}>
            UFFICIO COMMERCIALE REGIONALE
          </div>
          <h3 style={{ fontSize: '26px', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 10px', color: '#000000' }}>
            RESPONSABILE PUBBLICITÀ: FABIO ASIRI
          </h3>
          <p style={{ fontSize: '14.5px', color: '#525252', margin: '0 0 18px', maxWidth: '520px' }}>
            Consulenza diretta per pianificazioni mirate, preventivi in giornata e produzioni copy personalizzate per PMI ed eventi in Toscana.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '14px', fontWeight: 900 }}>
            <div>TELEFONO: <a href="tel:3476818595" style={{ color: '#000000' }}>347 6818595</a></div>
            <div>EMAIL: <a href="mailto:fabio.asiri@radiotoscana.it" style={{ color: '#ff0033' }}>fabio.asiri@radiotoscana.it</a></div>
            <div>CENTRALINO: 055 285030</div>
          </div>
        </div>

        <div style={{ textAlign: 'right', fontSize: '12px', color: '#737373', lineHeight: 1.7 }}>
          <div style={{ fontWeight: 900, color: '#000000', fontSize: '14px' }}>RADIO MONTE SERRA S.R.L.</div>
          <div>Via de&apos; Pucci, 2 • 50122 Firenze (FI) • P.IVA 04472740481 • CCIAA n. 453074</div>
          <div style={{ marginTop: '8px' }}>
            <a href="https://www.radiotoscana.it" target="_blank" rel="noreferrer" style={{ color: '#000000', fontWeight: 900, textDecoration: 'underline' }}>
              WWW.RADIOTOSCANA.IT
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
