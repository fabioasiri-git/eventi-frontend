import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import https from 'https';
import http from 'http';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const DB_URL = process.env.POSTGRES_GD_URL || "postgresql://postgres.akznjrosxfedacydovku:80GenDan9000$%25@aws-1-eu-central-1.pooler.supabase.com:6543/postgres";

let pool: Pool | null = null;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: DB_URL,
      ssl: { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}

function normStr(s: string): string {
  if (!s) return "";
  let norm = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  norm = norm.replace(/[\(\[\{]?(?:feat\.?|ft\.?|featuring|with)\b[^\)\]\}]*[\)\]\}]?/g, '');
  norm = norm.replace(/\b(?:feat\.?|ft\.?|featuring|with)\b.*$/g, '');
  norm = norm.replace(/[^a-z0-9\s]/g, '');
  return norm.trim().replace(/\s+/g, ' ');
}

async function insertSpin(station: string, artist: string, title: string): Promise<{ inserted: boolean; reason?: string }> {
  const normA = normStr(artist);
  const normT = normStr(title);

  if (!normA || !normT) {
    return { inserted: false, reason: "empty_normalized" };
  }

  const client = await getPool().connect();
  try {
    const dupCheck = await client.query(`
      SELECT id FROM storici_passaggi 
      WHERE station = $1 AND normalized_artist = $2 AND normalized_title = $3 
        AND played_at >= NOW() - INTERVAL '6 minutes'
      LIMIT 1;
    `, [station, normA, normT]);

    if (dupCheck.rows && dupCheck.rows.length > 0) {
      return { inserted: false, reason: "recent_duplicate" };
    }

    await client.query(`
      INSERT INTO storici_passaggi (station, played_at, artist, title, normalized_artist, normalized_title)
      VALUES ($1, NOW(), $2, $3, $4, $5);
    `, [station, artist, title, normA, normT]);

    return { inserted: true };
  } catch (err: any) {
    console.error(`Error inserting spin for ${station}:`, err.message);
    return { inserted: false, reason: err.message };
  } finally {
    client.release();
  }
}

function fetchIcyMetadata(streamUrl: string, timeoutMs = 5000): Promise<{ artist: string; title: string } | null> {
  return new Promise((resolve) => {
    try {
      const url = new URL(streamUrl);
      const requester = url.protocol === 'https:' ? https : http;

      const req = requester.get(url, {
        headers: {
          'Icy-MetaData': '1',
          'User-Agent': 'VLC/3.0.18',
        }
      }, (res) => {
        const metaint = parseInt((res.headers['icy-metaint'] as string) || '0', 10);
        if (!metaint || isNaN(metaint) || metaint <= 0) {
          res.destroy();
          return resolve(null);
        }

        let buffer = Buffer.alloc(0);
        let metaLen = -1;

        res.on('data', (chunk: Buffer) => {
          buffer = Buffer.concat([buffer, chunk]);

          if (metaLen === -1 && buffer.length >= metaint + 1) {
            metaLen = buffer[metaint] * 16;
            if (metaLen === 0) {
              res.destroy();
              return resolve(null);
            }
          }

          if (metaLen > 0 && buffer.length >= metaint + 1 + metaLen) {
            const metaBuf = buffer.subarray(metaint + 1, metaint + 1 + metaLen);
            const metaStr = metaBuf.toString('utf-8');
            res.destroy();

            if (metaStr.includes("StreamTitle='") && metaStr.includes("Song*")) {
              const content = metaStr.split("StreamTitle='")[1]?.split("';")[0];
              if (content) {
                const parts = content.split("*");
                if (parts.length >= 3 && parts[0] === "Song") {
                  return resolve({
                    title: parts[1].trim(),
                    artist: parts[2].trim()
                  });
                }
              }
            }
            return resolve(null);
          }
        });

        res.on('error', () => {
          res.destroy();
          resolve(null);
        });
      });

      req.setTimeout(timeoutMs, () => {
        req.destroy();
        resolve(null);
      });
      req.on('error', () => resolve(null));
    } catch {
      resolve(null);
    }
  });
}

// 1. Discoradio (Icecast)
async function pollDiscoradio() {
  const meta = await fetchIcyMetadata("https://icstream.rds.radio/disco");
  if (meta && meta.artist && meta.title) {
    return await insertSpin("Discoradio", meta.artist, meta.title);
  }
  return { inserted: false, reason: "no_metadata" };
}

// 2. m2o (REST API)
async function pollM2o() {
  try {
    const res = await fetch("https://www.m2o.it/api/pub/v2/all/gdwc-audio-player/onair?format=json", {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });
    if (!res.ok) return { inserted: false, reason: `http_${res.status}` };
    const data = await res.json();
    const titleRaw = (data.title || "").trim();
    if (!titleRaw) return { inserted: false, reason: "empty_title" };

    const lower = titleRaw.toLowerCase();
    if (["reklama", "pubblicit", "jingle", "sigla", "promo"].some(ign => lower.includes(ign))) {
      return { inserted: false, reason: "ignored_tag" };
    }

    let artist = "m2o";
    let title = titleRaw;
    if (titleRaw.includes(" - ")) {
      const parts = titleRaw.split(" - ");
      artist = parts[0].trim();
      title = parts.slice(1).join(" - ").trim();
    }

    return await insertSpin("m2o", artist, title);
  } catch (err: any) {
    return { inserted: false, reason: err.message };
  }
}

// 3. Radio Toscana (REST API)
async function pollRadioToscana() {
  try {
    const res = await fetch("https://sr14.inmystream.it/AudioPlayer/radiotoscana/playerInfo", {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });
    if (!res.ok) return { inserted: false, reason: `http_${res.status}` };
    const data = await res.json();
    const np = (data.nowplaying || "").trim();
    if (!np || !np.includes(" - ")) return { inserted: false, reason: "invalid_format" };

    const parts = np.split(" - ");
    const artist = parts[0].trim();
    const title = parts.slice(1).join(" - ").trim();

    return await insertSpin("Radio Toscana", artist, title);
  } catch (err: any) {
    return { inserted: false, reason: err.message };
  }
}

// 4. RDS Relax (Icecast)
async function pollRdsRelax() {
  const meta = await fetchIcyMetadata("https://icstream.rds.radio/rdsrelax");
  if (meta && meta.artist && meta.title) {
    return await insertSpin("RDS Relax", meta.artist, meta.title);
  }
  return { inserted: false, reason: "no_metadata" };
}

// 5. Dimensione Suono Soft (Icecast)
async function pollDimensioneSuonoSoft() {
  const meta = await fetchIcyMetadata("https://icstream.rds.radio/dssc");
  if (meta && meta.artist && meta.title) {
    return await insertSpin("Dimensione Suono Soft", meta.artist, meta.title);
  }
  return { inserted: false, reason: "no_metadata" };
}

export async function GET(request: Request) {
  const startTime = Date.now();
  console.log(`[Stream Collector] Starting polling cycle...`);

  const [discoradio, m2o, toscana, rdsRelax, dss] = await Promise.all([
    pollDiscoradio(),
    pollM2o(),
    pollRadioToscana(),
    pollRdsRelax(),
    pollDimensioneSuonoSoft()
  ]);

  const durationMs = Date.now() - startTime;
  const results = {
    "Discoradio": discoradio,
    "m2o": m2o,
    "Radio Toscana": toscana,
    "RDS Relax": rdsRelax,
    "Dimensione Suono Soft": dss
  };

  return NextResponse.json({
    status: "success",
    timestamp: new Date().toISOString(),
    durationMs,
    results
  });
}

export async function POST(request: Request) {
  return GET(request);
}
