-- ===================================================================
-- 👹 RT-LEAD-ENGINE (RADIO TOSCANA) - DATABASE SCHEMA & MEMORY LOCK
-- ===================================================================

-- Schema dedicato per isolare i dati dal resto del database
CREATE SCHEMA IF NOT EXISTS rt_lead_engine;

-- 1. Tabella Principale Lead & CRM Commerciale
CREATE TABLE IF NOT EXISTS rt_lead_engine.rt_lead_engine_pool (
    id SERIAL PRIMARY KEY,
    nome_azienda_evento TEXT NOT NULL,
    settore VARCHAR(100),
    comune VARCHAR(100),
    provincia VARCHAR(10) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(50),
    sito_web TEXT,
    
    -- Profilazione Geografica & Media Kit 2026
    area_target VARCHAR(20) DEFAULT 'AREA 4', -- AREA 1, AREA 2, AREA 3, AREA 4 Digital
    
    -- Stato Pipeline Commerciale (HubSpot Style)
    fase_commerciale VARCHAR(50) DEFAULT 'SCOPERTO', -- SCOPERTO, IN_LAVORAZIONE, OUTREACH, CALDO, PREVENTIVO_INVIATO, CONTRATTO_INVIATO, CONTRATTO_ATTIVO, PERSO
    
    -- Tracciamento Finanziario & Cambio Merce
    valore_preventivo DECIMAL(10,2) DEFAULT 0.00,
    valore_contratto DECIMAL(10,2) DEFAULT 0.00,
    is_cambio_merce BOOLEAN DEFAULT FALSE,     -- Flag Cambio Merce / Barter Deal
    dettagli_cambio_merce TEXT,                 -- Descrizione beni o premi per contest
    probabilita_chiusura INT DEFAULT 0,         -- 0%, 10%, 30%, 50%, 80%, 100%
    
    -- Tracciamento Sequenza Email (1-a-1)
    email_inviate_totali INT DEFAULT 0,
    ultimo_step_inviato INT DEFAULT 0,
    data_ultimo_invio TIMESTAMPTZ,
    
    -- 📅 UNIVERSAL MEMORY LOCK (Sagre, Fiere, Mostre, Festival, Sport)
    data_evento DATE,                          -- Data dell'evento per l'edizione corrente
    tipo_evento VARCHAR(50) DEFAULT 'EVENTO',  -- Sagra, Fiera, Mostra, Festival, Sport, Mercatino
    flag_ricorrente BOOLEAN DEFAULT TRUE,      -- TRUE se è un evento annuale
    anno_riferimento INT DEFAULT 2026,          -- Anno dell'edizione gestita
    giorni_anticipo_notifica INT DEFAULT 90,   -- Giorni di anticipo per il re-engagement (default 90 gg = 3 mesi)
    data_prossimo_contatto DATE,               -- Data esatta in cui il sistema sveglierà il lead l'anno successivo
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indici di Performance nello Schema Dedicato
CREATE INDEX IF NOT EXISTS idx_rt_lead_fase ON rt_lead_engine.rt_lead_engine_pool (fase_commerciale);
CREATE INDEX IF NOT EXISTS idx_rt_lead_provincia ON rt_lead_engine.rt_lead_engine_pool (provincia);
CREATE INDEX IF NOT EXISTS idx_rt_lead_area ON rt_lead_engine.rt_lead_engine_pool (area_target);
CREATE INDEX IF NOT EXISTS idx_rt_lead_memory ON rt_lead_engine.rt_lead_engine_pool (data_prossimo_contatto, flag_ricorrente, fase_commerciale);

-- 2. Trigger per il Calcolo Automatico del Memory Lock (Sveglia 90 giorni prima dell'anno successivo)
CREATE OR REPLACE FUNCTION rt_lead_engine.update_rt_memory_lock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.data_evento IS NOT NULL AND NEW.flag_ricorrente = TRUE THEN
        NEW.data_prossimo_contatto := (NEW.data_evento + INTERVAL '1 year') - (NEW.giorni_anticipo_notifica || ' days')::INTERVAL;
    END IF;
    
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_rt_memory_lock ON rt_lead_engine.rt_lead_engine_pool;
CREATE TRIGGER trigger_rt_memory_lock
BEFORE INSERT OR UPDATE ON rt_lead_engine.rt_lead_engine_pool
FOR EACH ROW
EXECUTE FUNCTION rt_lead_engine.update_rt_memory_lock();

-- 3. Vista per l'Estrazione Automatica dei Lead da Re-ingaggiare (Cron n8n)
CREATE OR REPLACE VIEW rt_lead_engine.view_rt_memory_lock_to_reengage AS
SELECT 
    id,
    nome_azienda_evento,
    comune,
    provincia,
    area_target,
    email,
    tipo_evento,
    data_evento AS edizione_precedente,
    data_prossimo_contatto AS data_sveglia,
    giorni_anticipo_notifica
FROM rt_lead_engine.rt_lead_engine_pool
WHERE flag_ricorrente = TRUE
  AND data_prossimo_contatto <= CURRENT_DATE
  AND fase_commerciale IN ('SCOPERTO', 'PERSO', 'CONTRATTO_ATTIVO');
