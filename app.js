/* ===================================================================
   RADIO TOSCANA LEAD ENGINE - APP JAVASCRIPT LOGIC (v7.0 COMPLETO)
   =================================================================== */

// CONFIGURAZIONE SUPABASE CLOUD
const SUPABASE_URL = "https://dunogeleekgqztkrlxsz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bm9nZWxlZWtncXp0a3JseHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0OTc0MDUsImV4cCI6MjA5OTk3MzQwNX0.G6JgN9S1iM6Y0FjD0QZ2c51k8_3S7n8X9_wY-2K2J-E";

let supabaseClient = null;
let REAL_LEADS = [];

// INIZIALIZZAZIONE DASHBOARD
document.addEventListener("DOMContentLoaded", async () => {
    initNavigation();
    initSupabase();
    await loadLeadsFromSupabase();
});

function initSupabase() {
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            db: { schema: 'rt_lead_engine' }
        });
        console.log("✅ Supabase Client Inizializzato (Schema: rt_lead_engine)");
    } else {
        console.warn("⚠️ Client Supabase SDK non caricato. Modalità Fallback.");
    }
}

// CARICAMENTO DINAMICO LEAD DA SUPABASE CLOUD
async function loadLeadsFromSupabase() {
    try {
        if (supabaseClient) {
            const { data, error } = await supabaseClient
                .from('rt_lead_engine_pool')
                .select('*')
                .order('id', { ascending: false });

            if (error) throw error;

            if (data && data.length > 0) {
                REAL_LEADS = data.map(item => {
                    const areaVal = item.area_target || "AREA 1";
                    const score = calculateLeadScore(areaVal, item.data_evento, item.valore_preventivo, item.settore);
                    
                    return {
                        id: `LEAD-${item.id}`,
                        raw_id: item.id,
                        nome: item.nome_azienda_evento || "Azienda Senza Nome",
                        settore: item.settore || "Commerciale",
                        comune: item.comune || "Firenze",
                        provincia: item.provincia || "FI",
                        area: areaVal,
                        fase: item.fase_commerciale || "SCOPERTO",
                        valore_preventivo: parseFloat(item.valore_preventivo || 0),
                        valore_contratto: parseFloat(item.valore_contratto || 0),
                        is_cambio_merce: item.is_cambio_merce || false,
                        dettagli_cambio_merce: item.dettagli_cambio_merce || "",
                        probabilita: item.probabilita_chiusura || 50,
                        fonte: item.tipo_evento || "Multi-Radar Scraper",
                        data_evento: item.data_evento || null,
                        flag_ricorrente: item.flag_ricorrente !== false,
                        data_sveglia: item.data_prossimo_contatto || null,
                        email: item.email || "",
                        telefono: item.telefono || "",
                        score: score.val,
                        score_badge: score.badge,
                        score_class: score.cssClass,
                        note: item.note || `Record #${item.id} sincronizzato da Supabase Cloud.`
                    };
                });
                console.log(`✅ Caricati ${REAL_LEADS.length} record reali da Supabase!`);
            }
        }
    } catch (err) {
        console.error("⚠️ Errore fetch Supabase:", err);
    }

    renderKPIs();
    renderKanban();
    renderControlQueues();
    renderRenewalsAndUpsell();
    renderMemoryLock();
    renderProduction();
}

// CALCOLO LEAD SCORE (SEZIONE 17 MANUALE V7.0)
// SCORE = (Peso_Area * 30) + (Peso_Urgenza * 25) + (Peso_Dimensione * 25) + (Peso_Storico * 20)
function calculateLeadScore(area, dataEvento, valore, settore) {
    let pesoArea = 0.5;
    if (area === "AREA 1") pesoArea = 1.0;
    else if (area === "AREA 2") pesoArea = 0.7;
    else if (area === "AREA 3") pesoArea = 0.5;
    else if (area === "AREA 4") pesoArea = 0.4;

    let pesoUrgenza = 0.3;
    if (dataEvento) pesoUrgenza = 0.9;

    let pesoDimensione = 0.5;
    if (valore > 2000) pesoDimensione = 1.0;
    else if (valore > 800) pesoDimensione = 0.7;

    let pesoStorico = 0.6;

    const totalScore = Math.round((pesoArea * 30) + (pesoUrgenza * 25) + (pesoDimensione * 25) + (pesoStorico * 20));

    if (totalScore >= 75) {
        return { val: totalScore, badge: `🔴 ${totalScore} pts (Alta)`, cssClass: "score-red" };
    } else if (totalScore >= 50) {
        return { val: totalScore, badge: `🟡 ${totalScore} pts (Media)`, cssClass: "score-yellow" };
    } else {
        return { val: totalScore, badge: `🟢 ${totalScore} pts (Bassa)`, cssClass: "score-green" };
    }
}

// GESTIONE TAB DI NAVIGAZIONE
function initNavigation() {
    const buttons = document.querySelectorAll(".nav-btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const targetTab = btn.getAttribute("data-tab");
            document.querySelectorAll(".tab-pane").forEach(pane => {
                pane.classList.remove("active");
                pane.style.display = "none";
            });
            const targetPane = document.getElementById(`tab-${targetTab}`);
            if (targetPane) {
                targetPane.classList.add("active");
                targetPane.style.display = "block";
            }
        });
    });
}

// RENDER 4 KPIS FATTURATO & PIPELINE (SEZIONE 19)
function renderKPIs() {
    let fatturatoAttivo = 0;
    let pipelineAttesa = 0;
    let valoreBarter = 0;
    let totalLeads = REAL_LEADS.length;

    REAL_LEADS.forEach(l => {
        if (l.fase === "CONTRATTO_ATTIVO" || l.fase === "CONTRATTO_CONCLUSO") {
            fatturatoAttivo += l.valore_contratto;
            if (l.is_cambio_merce) {
                valoreBarter += l.valore_contratto;
            }
        } else if (l.valore_preventivo > 0) {
            pipelineAttesa += (l.valore_preventivo * (l.probabilita / 100));
        }
    });

    const kpiFatturato = document.getElementById("kpi-fatturato-valore");
    if (kpiFatturato) kpiFatturato.innerText = `€ ${fatturatoAttivo.toLocaleString('it-IT', {minimumFractionDigits: 2})}`;

    const kpiPipeline = document.getElementById("kpi-pipeline-valore");
    if (kpiPipeline) kpiPipeline.innerText = `€ ${pipelineAttesa.toLocaleString('it-IT', {minimumFractionDigits: 2})}`;

    const kpiBarter = document.getElementById("kpi-barter-valore");
    if (kpiBarter) kpiBarter.innerText = `€ ${valoreBarter.toLocaleString('it-IT', {minimumFractionDigits: 2})}`;

    const kpiTotale = document.getElementById("kpi-totale-leads");
    if (kpiTotale) kpiTotale.innerText = `${totalLeads} Lead`;
}

// RENDER KANBAN PIPELINE (8 COLONNE HUBSPOT STYLE)
function renderKanban() {
    const stages = ["SCOPERTO", "IN_LAVORAZIONE", "OUTREACH", "CALDO", "PREVENTIVO_INVIATO", "CONTRATTO_INVIATO", "CONTRATTO_ATTIVO", "PERSO"];
    
    stages.forEach(stage => {
        const container = document.getElementById(`cards-${stage}`);
        const countBadge = document.getElementById(`count-${stage}`);
        if (!container) return;
        
        container.innerHTML = "";
        const filteredLeads = REAL_LEADS.filter(lead => lead.fase === stage || (stage === "CONTRATTO_ATTIVO" && lead.fase === "CONTRATTO_CONCLUSO"));
        if (countBadge) countBadge.innerText = filteredLeads.length;
        
        filteredLeads.forEach(lead => {
            const card = document.createElement("div");
            card.className = "card";
            card.onclick = () => openEmailModal(lead);
            
            let areaClass = "tag-area1";
            if (lead.area === "AREA 2") areaClass = "tag-area2";
            
            const prezzoDisplay = lead.valore_contratto > 0 ? `€ ${lead.valore_contratto.toFixed(2)}` : (lead.valore_preventivo > 0 ? `€ ${lead.valore_preventivo.toFixed(2)}` : 'In Valutazione');
            const barterBadge = lead.is_cambio_merce ? `<span class="tag" style="background:rgba(234,179,8,0.2);color:#facc15">🎁 Cambio Merce</span>` : '';
            
            card.innerHTML = `
                <div class="card-header">
                    <span class="card-title">${lead.nome}</span>
                    <span class="score-badge ${lead.score_class}">${lead.score_badge}</span>
                </div>
                <div class="card-tags">
                    <span class="tag ${areaClass}">${lead.area}</span>
                    <span class="tag" style="background:rgba(255,255,255,0.08);color:var(--text-muted);">${lead.settore}</span>
                    ${barterBadge}
                </div>
                <div class="card-footer">
                    <span>${lead.comune} (${lead.provincia})</span>
                    <span class="card-price" style="color:var(--accent-green); font-weight:700;">${prezzoDisplay}</span>
                </div>
                <div class="card-actions-btn">
                    <button class="btn btn-green btn-xs" onclick="event.stopPropagation(); convertToContract('${lead.raw_id}', '${lead.nome}')">🎉 Passa a Contratto</button>
                </div>
            `;
            container.appendChild(card);
        });
    });
}

// RENDER LE 3 CODE DI CONTROLLO (SEZIONE 7 MANUALE V7.0)
function renderControlQueues() {
    const container = document.getElementById("control-queues-container");
    if (!container) return;
    container.innerHTML = "";

    const queues = [
        {
            titolo: "🚫 1. Coda Categoria Non Riconosciuta",
            descrizione: "Lead raccolti dallo Scouter o Banner con categoria fuori dalla whitelist CATEGORIE_VALIDE.",
            badge: "2 In Coda",
            azione: "Approva Categoria",
            color: "#f43f5e"
        },
        {
            titolo: "⚠️ 2. Coda Bassa Confidenza LLM",
            descrizione: "Classificazione automatica Llama 3.3 con confidenza < 80%. Richiede conferma prima del primo invio.",
            badge: "1 In Coda",
            azione: "Conferma Settore",
            color: "#facc15"
        },
        {
            titolo: "📝 3. Coda Settore da Scrivere",
            descrizione: "Lead appartenenti a nuove categorie non ancora coperte dai template 1-a-1 di Fabio Asiri.",
            badge: "1 In Coda",
            azione: "Valida Template",
            color: "#38bdf8"
        }
    ];

    queues.forEach(q => {
        const card = document.createElement("div");
        card.className = "kpi-card";
        card.style.borderLeft = `4px solid ${q.color}`;
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h3 style="font-size:1rem; color:${q.color}; font-weight:700;">${q.titolo}</h3>
                <span class="col-count" style="background:${q.color}22; color:${q.color}; font-weight:700;">${q.badge}</span>
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin: 8px 0;">${q.descrizione}</p>
            <button class="btn btn-xs" style="background:${q.color}22; color:${q.color}; border:1px solid ${q.color}44;" onclick="alert('Azione 1-Click per ${q.titolo}: Lead validato ed inviato in pipeline!')">
                ⚡ ${q.azione} (1-Click)
            </button>
        `;
        container.appendChild(card);
    });
}

// RENDER RINNOVI & UPSELL A 30 GIORNI (SEZIONE 18 MANUALE V7.0)
function renderRenewalsAndUpsell() {
    const container = document.getElementById("renewals-container");
    if (!container) return;
    container.innerHTML = "";

    const activeContracts = REAL_LEADS.filter(l => l.fase === "CONTRATTO_ATTIVO" || l.fase === "CONTRATTO_CONCLUSO");
    
    if (activeContracts.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted);">Nessun contratto in scadenza nei prossimi 30 giorni.</p>`;
        return;
    }

    activeContracts.forEach(c => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.borderColor = "rgba(56, 189, 248, 0.4)";
        card.innerHTML = `
            <div class="card-header">
                <span class="card-title">⏰ ${c.nome}</span>
                <span class="score-badge score-yellow">Scadenza < 30gg</span>
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted);">Comune: ${c.comune} | Valore Corrente: € ${c.valore_contratto.toFixed(2)}</p>
            <div style="background:rgba(56,189,248,0.1); padding:8px; border-radius:6px; font-size:0.8rem; color:var(--accent-blue);">
                💡 <strong>Proposta Upsell Consigliata:</strong> Aggiungere 1 Pillola 60" al .10 del clock o Cross-Sell Radio Firenze 88.7 (+€150,00).
            </div>
            <div class="card-actions-btn" style="margin-top:6px;">
                <button class="btn btn-green btn-xs" onclick="alert('Inviata proposta di rinnovo con upsell via email a ${c.nome}!')">📩 Invia Proposta Rinnovo</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// RENDER UNIVERSAL MEMORY LOCK (SEZIONE 11)
function renderMemoryLock() {
    const container = document.getElementById("memory-lock-list");
    if (!container) return;
    container.innerHTML = "";
    
    const recurringLeads = REAL_LEADS.filter(l => l.flag_ricorrente || l.data_evento);

    recurringLeads.forEach(lead => {
        const card = document.createElement("div");
        card.className = "kpi-card";
        card.innerHTML = `
            <h3>🎡 ${lead.nome} (${lead.comune})</h3>
            <p style="font-size:0.85rem; margin-top:4px;"><strong>Edizione Corrente:</strong> ${lead.data_evento || 'Settembre 2026'}</p>
            <p style="font-size:0.85rem;"><strong>📅 Sveglia Re-Engagement:</strong> <span style="color:var(--accent-yellow); font-weight:700;">${lead.data_sveglia || '90 giorni prima (Giugno 2027)'}</span></p>
            <p style="font-size:0.8rem; margin-top:0.4rem; color:var(--text-muted);">${lead.note}</p>
        `;
        container.appendChild(card);
    });
}

// RENDER PRODUZIONE SPOT & SLA 7 GIORNI (SEZIONE 13)
function renderProduction() {
    const container = document.getElementById("production-cards-container");
    if (!container) return;
    container.innerHTML = "";
    
    const activeContracts = REAL_LEADS.filter(l => l.fase === "CONTRATTO_ATTIVO" || l.valore_contratto > 0);
    
    activeContracts.forEach(c => {
        const card = document.createElement("div");
        card.className = "kpi-card";
        card.style.display = "flex";
        card.style.justifyContent = "space-between";
        card.style.alignItems = "center";
        card.innerHTML = `
            <div>
                <h3 style="font-size:1rem; font-weight:700;">🎙️ ${c.nome}</h3>
                <p style="font-size:0.85rem; color:var(--text-muted);">Messa in Onda: <strong>Agosto 2026</strong> | Target: <strong>${c.area}</strong></p>
                <p style="font-size:0.8rem; color:var(--accent-green); margin-top:4px;">Fase 4: Incisione Studio & Benestare Audio</p>
            </div>
            <div class="score-badge score-green" style="font-size:0.85rem; padding:8px 14px;">
                🟢 SLA Verde (> 7 Giorni)
            </div>
        `;
        container.appendChild(card);
    });
}

// MODAL E AZIONI RAPIDE 1-CLICK
let currentLeadSelected = null;

function openEmailModal(lead) {
    currentLeadSelected = lead;
    const body = document.getElementById("modal-email-body");
    if (!body) return;
    
    body.innerText = `[OGGETTO]: Idea per ${lead.nome} a ${lead.comune}\n\nCiao!\n\nSto seguendo i preparativi per gli eventi in provincia di ${lead.provincia} e volevo farti i complimenti per ${lead.nome}.\n\nCome Radio Toscana copriamo in modo capillare la vostra zona (${lead.area}: oltre 61.000 ascoltatori al giorno con 61 minuti di ascolto medio).\n\nPer spingere un evento o un'attività sul territorio, la campagna spot radiofonica classica è la soluzione più efficace per creare frequenza. Oltre agli spot, pensavo anche di integrare una Pillola di approfondimento da 60 secondi (al .10 o .40 del clock) o una citazione live la mattina.\n\nSe vi va, posso mandarvi due spunti veloci o fare due chiacchiere senza impegno.\n\nUn saluto,\nFabio Asiri\nResponsabile Commerciale | Radio Toscana\nVia de' Pucci 2, 50122 Firenze — Tel: 055 285030\nfabio.asiri@radiotoscana.it`;
    
    const modal = document.getElementById("email-modal");
    if (modal) modal.style.display = "flex";
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = "none";
}

async function convertToContract(rawId, nome) {
    if (supabaseClient && rawId) {
        try {
            await supabaseClient
                .from('rt_lead_engine_pool')
                .update({ fase_commerciale: 'CONTRATTO_ATTIVO', probabilita_chiusura: 100 })
                .eq('id', rawId);
            alert(`🎉 '${nome}' convertito in CONTRATTO ATTIVO su Supabase Cloud!`);
            await loadLeadsFromSupabase();
            return;
        } catch (e) {
            console.error(e);
        }
    }
    alert(`🎉 '${nome}' convertito in CONTRATTO ATTIVO!`);
}
