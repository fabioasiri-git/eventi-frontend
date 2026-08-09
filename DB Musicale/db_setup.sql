-- Tabella del Catalogo Interno di Radio Toscana
CREATE TABLE IF NOT EXISTS catalogo_toscana (
    id SERIAL PRIMARY KEY,
    artist TEXT NOT NULL,
    title TEXT NOT NULL,
    normalized_artist TEXT NOT NULL,
    normalized_title TEXT NOT NULL,
    category TEXT,
    spins_total INTEGER DEFAULT 0,
    spins_recent INTEGER DEFAULT 0,
    spins_other INTEGER DEFAULT 0,
    year INTEGER,
    audio_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_catalog_track UNIQUE (normalized_artist, normalized_title)
);

CREATE INDEX IF NOT EXISTS idx_catalogo_norm_artist_title ON catalogo_toscana (normalized_artist, normalized_title);

-- Tabella dello Storico dei Passaggi dei Concorrenti
CREATE TABLE IF NOT EXISTS storici_passaggi (
    id SERIAL PRIMARY KEY,
    station TEXT NOT NULL,
    played_at TIMESTAMPTZ NOT NULL,
    artist TEXT NOT NULL,
    title TEXT NOT NULL,
    normalized_artist TEXT NOT NULL,
    normalized_title TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_station_play UNIQUE (station, played_at)
);

CREATE INDEX IF NOT EXISTS idx_storici_station_played_at ON storici_passaggi (station, played_at);
CREATE INDEX IF NOT EXISTS idx_storici_norm_artist_title ON storici_passaggi (normalized_artist, normalized_title);

-- Tabella di Cache Popolarità Spotify
CREATE TABLE IF NOT EXISTS spotify_popolarita (
    id SERIAL PRIMARY KEY,
    artist TEXT NOT NULL,
    title TEXT NOT NULL,
    normalized_artist TEXT NOT NULL,
    normalized_title TEXT NOT NULL,
    popularity INTEGER NOT NULL CHECK (popularity >= 0 AND popularity <= 100),
    spotify_id TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_spotify_track UNIQUE (normalized_artist, normalized_title)
);

CREATE INDEX IF NOT EXISTS idx_spotify_norm_artist_title ON spotify_popolarita (normalized_artist, normalized_title);
