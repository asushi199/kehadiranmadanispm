import { isKategori, type Kategori } from "./kategori";

export function normaliseNama(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.replace(/\s+/g, " ").replace(/[\u0000-\u001F]/g, "").trim();
}

export function parseKategori(raw: unknown): Kategori | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim().toLowerCase();
  return isKategori(value) ? value : null;
}

export function pinSah(pin: string | null | undefined): boolean {
  const expected = process.env.ADMIN_PIN;
  if (!expected || !pin) return false;
  if (expected.length !== pin.length) return false;

  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= expected.charCodeAt(i) ^ pin.charCodeAt(i);
  }
  return mismatch === 0;
}
