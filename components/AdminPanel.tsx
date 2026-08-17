"use client";

import { useMemo, useState, type FormEvent } from "react";
import { KATEGORI_LABEL } from "@/lib/kategori";
import type { RekodKehadiran } from "@/lib/types";

function formatMasa(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("ms-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function AdminPanel() {
  const [pin, setPin] = useState("");
  const [ralat, setRalat] = useState("");
  const [rows, setRows] = useState<RekodKehadiran[] | null>(null);
  const [memuat, setMemuat] = useState(false);

  async function buka(event: FormEvent) {
    event.preventDefault();
    setMemuat(true);
    setRalat("");
    try {
      const res = await fetch(`/api/rekod?pin=${encodeURIComponent(pin)}`);
      const data = (await res.json()) as {
        rows?: RekodKehadiran[];
        ralat?: string;
      };
      if (!res.ok) {
        setRalat(data.ralat || "PIN tidak sah.");
        setRows(null);
        return;
      }
      setRows(data.rows || []);
    } catch {
      setRalat("Tidak dapat memuatkan rekod.");
    } finally {
      setMemuat(false);
    }
  }

  const ringkasan = useMemo(() => {
    if (!rows) return "";
    return `${rows.length} rekod`;
  }, [rows]);

  return (
    <div className="admin">
      <h1>Rekod kehadiran</h1>
      <p className="admin-sub">SPM · Sektor Pembangunan Murid · staf gerai sahaja</p>

      {!rows ? (
        <form className="admin-pin" onSubmit={buka}>
          <label htmlFor="pin">PIN staf</label>
          <input
            id="pin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
          />
          {ralat ? <p className="ralat">{ralat}</p> : null}
          <button type="submit" disabled={memuat || !pin}>
            {memuat ? "Membuka…" : "Buka rekod"}
          </button>
        </form>
      ) : (
        <>
          <div className="admin-bar">
            <p>{ringkasan}</p>
            <a href={`/api/export?pin=${encodeURIComponent(pin)}`}>
              Muat turun CSV
            </a>
          </div>
          <div className="admin-jadual-bungkus">
            <table className="admin-jadual">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Kategori</th>
                  <th>Masa</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={3}>Belum ada rekod.</td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.nama}</td>
                      <td>{KATEGORI_LABEL[row.kategori]}</td>
                      <td>{formatMasa(row.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
