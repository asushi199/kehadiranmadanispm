import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { createClient, type Client } from "@libsql/client";
import { emptyKategoriCount, isKategori, type Kategori } from "./kategori";
import type { RekodKehadiran, Statistik } from "./types";

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS kehadiran (
    id TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    kategori TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS kehadiran_created_at_idx
    ON kehadiran (created_at DESC);
`;

let turso: Client | null = null;
let jsonQueue: Promise<void> = Promise.resolve();

function tursoUrl() {
  return process.env.TURSO_DATABASE_URL?.trim() || "";
}

function adaTurso() {
  return tursoUrl().length > 0;
}

function pastikanStor() {
  if (!adaTurso() && process.env.VERCEL) {
    throw new Error(
      "Pangkalan data cloud belum dikonfigurasi. Tetapkan TURSO_DATABASE_URL.",
    );
  }
}

function jsonPath() {
  return path.join(process.cwd(), "data", "kehadiran.json");
}

function getTurso() {
  if (!turso) {
    turso = createClient({
      url: tursoUrl(),
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return turso;
}

async function ensureTurso() {
  const client = getTurso();
  await client.executeMultiple(SCHEMA);
  return client;
}

async function readJson(): Promise<RekodKehadiran[]> {
  try {
    const raw = await readFile(jsonPath(), "utf8");
    const parsed = JSON.parse(raw) as { rows?: RekodKehadiran[] };
    return Array.isArray(parsed.rows) ? parsed.rows : [];
  } catch {
    return [];
  }
}

async function writeJson(rows: RekodKehadiran[]) {
  const dir = path.dirname(jsonPath());
  await mkdir(dir, { recursive: true });
  await writeFile(jsonPath(), JSON.stringify({ rows }, null, 2), "utf8");
}

function enqueueJson<T>(fn: () => Promise<T>): Promise<T> {
  const run = jsonQueue.then(fn, fn);
  jsonQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function statistikDari(rows: RekodKehadiran[]): Statistik {
  const kategori = emptyKategoriCount();
  for (const row of rows) {
    if (isKategori(row.kategori)) {
      kategori[row.kategori] += 1;
    }
  }
  return { jumlah: rows.length, kategori };
}

export async function tambahKehadiran(nama: string, kategori: Kategori) {
  pastikanStor();
  const rekod: RekodKehadiran = {
    id: crypto.randomUUID(),
    nama,
    kategori,
    created_at: new Date().toISOString(),
  };

  if (adaTurso()) {
    const client = await ensureTurso();
    await client.execute({
      sql: "INSERT INTO kehadiran (id, nama, kategori, created_at) VALUES (?, ?, ?, ?)",
      args: [rekod.id, rekod.nama, rekod.kategori, rekod.created_at],
    });
    return rekod;
  }

  return enqueueJson(async () => {
    const rows = await readJson();
    rows.push(rekod);
    await writeJson(rows);
    return rekod;
  });
}

export async function bacaStatistik(): Promise<Statistik> {
  pastikanStor();
  if (adaTurso()) {
    const client = await ensureTurso();
    const total = await client.execute("SELECT COUNT(*) AS n FROM kehadiran");
    const grouped = await client.execute(
      "SELECT kategori, COUNT(*) AS n FROM kehadiran GROUP BY kategori",
    );
    const kategori = emptyKategoriCount();
    for (const row of grouped.rows) {
      const key = String(row.kategori);
      if (isKategori(key)) {
        kategori[key] = Number(row.n) || 0;
      }
    }
    return {
      jumlah: Number(total.rows[0]?.n) || 0,
      kategori,
    };
  }

  return statistikDari(await readJson());
}

export async function senaraiKehadiran(): Promise<RekodKehadiran[]> {
  pastikanStor();
  if (adaTurso()) {
    const client = await ensureTurso();
    const result = await client.execute(
      "SELECT id, nama, kategori, created_at FROM kehadiran ORDER BY created_at DESC",
    );
    return result.rows.flatMap((row) => {
      const kategori = String(row.kategori);
      if (!isKategori(kategori)) return [];
      return [
        {
          id: String(row.id),
          nama: String(row.nama),
          kategori,
          created_at: String(row.created_at),
        },
      ];
    });
  }

  const rows = await readJson();
  return [...rows].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function padamSemuaKehadiran() {
  pastikanStor();
  if (adaTurso()) {
    const client = await ensureTurso();
    await client.execute("DELETE FROM kehadiran");
    return;
  }

  await enqueueJson(async () => {
    await writeJson([]);
  });
}
