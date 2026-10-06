'use client';

import React, { useState } from 'react';
import Head from 'next/head';

export default function LandingPubblicita() {
  const [formData, setFormData] = useState({
    azienda: '',
    referente: '',
    telefono: '',
    email: '',
    settore: 'Commercio / Retail',
    obiettivo: 'Portare nuovi clienti nel punto vendita',
    note: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Audio Demo Simulator
  const [activeAudioDemo, setActiveAudioDemo] = useState<string | null>(null);

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
          source: 'Landing Pubblicità Radio Toscana (Web)',
          utm_campaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') || 'organico' : 'organico'
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
      background: '#0a0d14',
      color: '#f8fafc',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      minHeight: '100vh',
      lineHeight: 1.6
    }}>
      {/* TOP BAR / URGENCY TICKER */}
      <div style={{
        background: 'linear-gradient(90deg, #991b1b 0%, #dc2626 50%, #b91c1c 100%)',
        color: '#ffffff',
        fontSize: '13px',
        fontWeight: 700,
        padding: '10px 16px',
        textAlign: 'center',
        letterSpacing: '0.02em',
        boxShadow: '0 2px 10px rgba(220, 38, 38, 0.3)'
      }}>
        📻 PIANIFICAZIONE AUTUNNO-INVERNO 2026: Disponibilità spazi in rotazione limitata nelle fasce Morning Show &amp; Drive-Time.
      </div>

      {/* HEADER PULITO CON CONTATTO DIRETTO (NO DISTRAZIONI) */}
      <header style={{
        padding: '18px 24px',
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src="/logo_radio_toscana.png" alt="Radio Toscana" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Ufficio Commerciale Ufficiale
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
              Radio Monte Serra S.r.l. • Firenze
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="tel:055285030"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#f8fafc',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 700,
              background: 'rgba(255,255,255,0.05)',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <span>📞</span> <span>055 285030</span>
          </a>
          <a
            href="#richiesta-preventivo"
            style={{
              background: '#dc2626',
              color: '#ffffff',
              padding: '9px 18px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '13px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
              transition: 'all 0.2s'
            }}
          >
            Richiedi Piano Media ➔
          </a>
        </div>
      </header>

      {/* HERO SECTION PRINCIPALE */}
      <section style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '60px 24px 50px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.95fr',
        gap: '48px',
        alignItems: 'center'
      }}>
        {/* COLONNA SINISTRA: VALUE PROPOSITION */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(220, 38, 38, 0.12)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            color: '#f87171',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.04em',
            marginBottom: '20px'
          }}>
            <span>🎙️</span> LA VOCE DELLA TOSCANA DAL 1978
          </div>

          <h1 style={{
            fontSize: '44px',
            lineHeight: 1.15,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            margin: '0 0 20px',
            color: '#ffffff'
          }}>
            Fai entrare la tua azienda nelle auto e nelle case di <span style={{ color: '#ef4444' }}>oltre 100.000 toscani</span> ogni giorno.
          </h1>

          <p style={{
            fontSize: '18px',
            lineHeight: 1.6,
            color: '#94a3b8',
            margin: '0 0 28px',
            maxWidth: '560px'
          }}>
            Basta spendere migliaia di euro in volantini buttati o click su internet senza ritorno. Con la pubblicità su <strong>Radio Toscana</strong> conquisti credibilità immediata, ascoltatori fedeli e clienti pronti all’acquisto a <strong>Firenze, Prato, Pistoia e in tutta la regione</strong>.
          </p>

          {/* BULLET POINT DIRETTO PER IMPRENDITORI */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 900 }}>✓</div>
              <div style={{ fontSize: '15px', color: '#cbd5e1' }}><strong>In onda in 48 ore:</strong> scriviamo noi il copy e incidiamo lo spot con speaker professionisti.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 900 }}>✓</div>
              <div style={{ fontSize: '15px', color: '#cbd5e1' }}><strong>Copertura geografica mirata:</strong> scegli se trasmettere nell&apos;Area Metropolitana o sull&apos;intera Toscana.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 900 }}>✓</div>
              <div style={{ fontSize: '15px', color: '#cbd5e1' }}><strong>Consulenza strategica su misura:</strong> piani media sostenibili per PMI, eventi e grandi marchi.</div>
            </div>
          </div>

          {/* BADGE DI FIDUCIA E AUDIENCE */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff' }}>104.000+</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Ascoltatori nel giorno medio</div>
            </div>
            <div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff' }}>100%</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Copertura FM, DAB+ e Web App</div>
            </div>
            <div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff' }}>25-54 anni</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Fascia con max potere d&apos;acquisto</div>
            </div>
          </div>
        </div>

        {/* COLONNA DESTRA: LEAD CAPTURE FORM (IL CUORE DELLA CONVERSIONE) */}
        <div id="richiesta-preventivo" style={{
          background: 'linear-gradient(145deg, #131926 0%, #0d121d 100%)',
          borderRadius: '16px',
          padding: '36px 32px',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          position: 'relative'
        }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 10px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
                Richiesta Ricevuta con Successo!
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
                Grazie <strong>{formData.referente || formData.azienda}</strong>. La tua richiesta è stata presa in carico dal nostro ufficio commerciale. Fabio o un consulente di Radio Toscana ti contatterà entro 24 ore lavorative con una proposta su misura.
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
                📞 Hai urgenza? Chiamaci subito al numero diretto: <strong>055 285030</strong>
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
                ⚡ PREVENTIVO GRATUITO IN 24 ORE
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', margin: '0 0 6px' }}>
                Richiedi una Proposta Pubblicitaria
              </h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 20px' }}>
                Compila i dati: elaboriamo una simulazione di passaggi, orari e costi per la tua attività senza alcun impegno.
              </p>

              {errorMsg && (
                <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px', borderRadius: '6px', fontSize: '12px', marginBottom: '16px' }}>
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Nome Azienda o Insegna *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="es. Pasticceria Rossi / Concessionaria Auto"
                    value={formData.azienda}
                    onChange={(e) => setFormData({ ...formData, azienda: e.target.value })}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                      Nome e Cognome Referente
                    </label>
                    <input
                      type="text"
                      placeholder="es. Mario Rossi"
                      value={formData.referente}
                      onChange={(e) => setFormData({ ...formData, referente: e.target.value })}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '11px 14px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                      Telefono Diretto *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="es. 333 1234567"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '11px 14px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Email Aziendale (per ricevere la proposta in PDF)
                  </label>
                  <input
                    type="email"
                    placeholder="es. direzione@azienda.it"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                      Settore di Attività
                    </label>
                    <select
                      value={formData.settore}
                      onChange={(e) => setFormData({ ...formData, settore: e.target.value })}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '11px 14px',
                        borderRadius: '8px',
                        background: '#1a2234',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    >
                      <option value="Commercio / Retail">Commercio / Negozi</option>
                      <option value="Ristorazione / Sagre / Food">Ristorazione &amp; Enogastronomia</option>
                      <option value="Automotive / Concessionarie">Automotive &amp; Concessionarie</option>
                      <option value="Servizi B2B / Artigianato">Servizi alle Imprese &amp; B2B</option>
                      <option value="Salute / Benessere / Sanità">Salute &amp; Benessere</option>
                      <option value="Eventi / Sagre / Spettacoli">Eventi, Sagre &amp; Fiere</option>
                      <option value="Altro">Altro Settore</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                      Obiettivo Campagna
                    </label>
                    <select
                      value={formData.obiettivo}
                      onChange={(e) => setFormData({ ...formData, obiettivo: e.target.value })}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '11px 14px',
                        borderRadius: '8px',
                        background: '#1a2234',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    >
                      <option value="Nuovi clienti nel punto vendita">Più clienti in negozio / sede</option>
                      <option value="Promozione evento o fiera">Lancio Evento / Offerta Limitata</option>
                      <option value="Notorietà marchio e posizionamento">Notorietà del Marchio (Branding)</option>
                      <option value="Reclutamento personale">Ricerca Personale / Lavoro</option>
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
                    padding: '15px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 900,
                    fontSize: '15px',
                    cursor: loading ? 'wait' : 'pointer',
                    boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)',
                    transition: 'all 0.2s',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  {loading ? 'Invio in corso...' : 'Ricevi Proposta & Preventivo Gratuito ➔'}
                </button>

                <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', marginTop: '4px' }}>
                  🔒 Dati trattati ai sensi del GDPR. Nessun vincolo, proposta 100% gratuita.
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* BRAND CHE CI SCELGONO (SOCIAL PROOF) */}
      <section style={{
        background: '#0e131d',
        padding: '30px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Hanno scelto le frequenze di Radio Toscana per comunicare nel territorio:
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '36px',
            opacity: 0.85
          }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#cbd5e1' }}>🌱 Coldiretti Toscana</span>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#cbd5e1' }}>🚗 Tinghi Motors (Renault Dacia)</span>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#cbd5e1' }}>🏛️ Confesercenti Firenze</span>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#cbd5e1' }}>🏥 Caritas Firenze</span>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#cbd5e1' }}>⚡ Etruria Luce e Gas</span>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#cbd5e1' }}>🥖 Mercato Centrale Firenze</span>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#cbd5e1' }}>🍷 Fattoria di Lavacchio</span>
          </div>
        </div>
      </section>

      {/* PERCHÉ LA RADIO BATTE I CANALI DIGITALI NEL COMMERCIO LOCALE */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '70px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 50px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', margin: '0 0 14px' }}>
            Perché la Radio è il mezzo più redditizio per le attività toscane?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0 }}>
            Mentre sui social le persone scorrono oltre in meno di un secondo, in radio l’ascoltatore è attento, in viaggio o al lavoro, e si fida della voce dell’emittente.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '30px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '32px', marginBottom: '14px' }}>🚗</div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '0 0 10px' }}>
              Nel momento esatto della decisione
            </h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
              Oltre il 70% degli ascolti avviene in auto, durante gli spostamenti mattutini e pomeridiani. Raggiungi il cliente proprio quando sta decidendo dove andare a fare la spesa, pranzare o fare acquisti.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '30px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '32px', marginBottom: '14px' }}>🏆</div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '0 0 10px' }}>
              Autorevolezza &amp; Fiducia Istantanea
            </h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
              Essere presenti su un&apos;emittente storica come Radio Toscana posiziona subito la tua azienda come una realtà solida, credibile e leader nel proprio territorio.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '30px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '32px', marginBottom: '14px' }}>🔁</div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '0 0 10px' }}>
              Frequenza &amp; Memorizzazione
            </h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
              Grazie alla rotazione studiata tra fasce M, P e S, il tuo messaggio viene ascoltato decine di volte dalla stessa persona, incidendo il nome del tuo brand nella memoria a lungo termine.
            </p>
          </div>
        </div>
      </section>

      {/* FORMATI PUBBLICITARI TRASPARENTI */}
      <section style={{ background: '#0e131d', padding: '70px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 50px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', margin: '0 0 14px' }}>
              Soluzioni Pubblicitarie Flessibili
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0 }}>
              Non esiste un pacchetto unico: costruiamo la pianificazione ideale calibrata sul tuo budget e sui tuoi obiettivi commerciali.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {/* FORMATO 1 */}
            <div style={{
              background: '#131926',
              padding: '32px 28px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Il Più Richiesto</span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '6px 0 14px' }}>Spot Tabellari 20&quot;</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 20px', lineHeight: 1.5 }}>
                  Passaggi ad alta intensità posizionati nelle fasce orarie a maggior ascolto radiofonico. Perfetto per promozioni, saldi, eventi e spinta vendite.
                </p>
                <ul style={{ paddingLeft: '18px', color: '#cbd5e1', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
                  <li>Produzione copy e voce inclusa</li>
                  <li>Rotazione flessibile 10-25 passaggi/giorno</li>
                  <li>Scelta tra Area 1 (FI-PO-PT) o Rete Regionale</li>
                </ul>
              </div>
              <a href="#richiesta-preventivo" style={{ marginTop: '24px', display: 'block', textAlign: 'center', background: 'rgba(255,255,255,0.06)', color: '#ffffff', padding: '10px', borderRadius: '6px', fontWeight: 700, fontSize: '13px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)' }}>
                Configura Spot ➔
              </a>
            </div>

            {/* FORMATO 2 */}
            <div style={{
              background: '#131926',
              padding: '32px 28px',
              borderRadius: '12px',
              border: '2px solid #ef4444',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', top: '-12px', right: '20px', background: '#ef4444', color: '#ffffff', padding: '2px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>
                Massimo Ascolto
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Morning Show di Alessandro Masti</span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '6px 0 14px' }}>Interventi On-Air &amp; Interviste</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 20px', lineHeight: 1.5 }}>
                  Interviste in studio o telefoniche all&apos;interno del programma più seguito e amato della radiofonia toscana (dalle 08:00 alle 10:00).
                </p>
                <ul style={{ paddingLeft: '18px', color: '#cbd5e1', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
                  <li>Dialogo empatico direttamente con Alessandro Masti</li>
                  <li>Massimo picco d&apos;ascolto della giornata</li>
                  <li>Possibilità di podcast e clip per i tuoi social</li>
                </ul>
              </div>
              <a href="#richiesta-preventivo" style={{ marginTop: '24px', display: 'block', textAlign: 'center', background: '#ef4444', color: '#ffffff', padding: '10px', borderRadius: '6px', fontWeight: 800, fontSize: '13px', textDecoration: 'none' }}>
                Richiedi Disponibilità Masti ➔
              </a>
            </div>

            {/* FORMATO 3 */}
            <div style={{
              background: '#131926',
              padding: '32px 28px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Brand Awareness</span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '6px 0 14px' }}>Sponsorizzazioni &amp; Rubriche</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 20px', lineHeight: 1.5 }}>
                  Lega il tuo brand alle rubriche di servizio più seguite: Meteo regionale, Viabilità in tempo reale, Notiziari o Dirette Sportive.
                </p>
                <ul style={{ paddingLeft: '18px', color: '#cbd5e1', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
                  <li>Citazione esclusiva in apertura e chiusura</li>
                  <li>Jingle personalizzato di forte impatto</li>
                  <li>Presenza fissa 7 giorni su 7</li>
                </ul>
              </div>
              <a href="#richiesta-preventivo" style={{ marginTop: '24px', display: 'block', textAlign: 'center', background: 'rgba(255,255,255,0.06)', color: '#ffffff', padding: '10px', borderRadius: '6px', fontWeight: 700, fontSize: '13px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)' }}>
                Scopri Rubriche ➔
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER & CONTATTI ISTITUZIONALI */}
      <footer style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '50px 24px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '24px',
        color: '#64748b',
        fontSize: '13px'
      }}>
        <div>
          <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '15px', marginBottom: '4px' }}>
            Radio Monte Serra S.r.l. — Concessionaria Radio Toscana
          </div>
          <div>Via de&apos; Pucci, 2 • 50122 Firenze (FI) • P.IVA 04472740481 • CCIAA n. 453074</div>
          <div style={{ marginTop: '4px' }}>
            Email Commerciale: <a href="mailto:commerciale@radiotoscana.it" style={{ color: '#ef4444', textDecoration: 'none' }}>commerciale@radiotoscana.it</a> • Tel. 055 285030
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div>© {new Date().getFullYear()} Radio Toscana. Tutti i diritti riservati.</div>
          <div style={{ fontSize: '11px', marginTop: '4px' }}>Emittente Regionale della Toscana • Copertura FM &amp; Digitale DAB+</div>
        </div>
      </footer>
    </div>
  );
}
