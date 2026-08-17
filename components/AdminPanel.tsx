"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { KATEGORI_LABEL } from "@/lib/kategori";
import type { RekodKehadiran, Statistik } from "@/lib/types";

const PIN_KEY = "spm-admin-pin";

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

async function muatRekod(kunci: string) {
  const res = await fetch(`/api/rekod?pin=${encodeURIComponent(kunci)}`, {
    cache: "no-store",
  });
  const data = (await res.json()) as {
    rows?: RekodKehadiran[];
    ralat?: string;
  };
  return { res, data };
}

export function AdminPanel() {
  const [pin, setPin] = useState("");
  const [dibuka, setDibuka] = useState(false);
  const [ralat, setRalat] = useState("");
  const [rows, setRows] = useState<RekodKehadiran[] | null>(null);
  const [memuat, setMemuat] = useState(false);
  const [memadam, setMemadam] = useState(false);
  const jumlahTerakhir = useRef<number | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(PIN_KEY);
    if (!saved) return;
    setPin(saved);
    setDibuka(true);
  }, []);

  useEffect(() => {
    if (!dibuka || !pin) return;
    let aktif = true;

    async function muatPenuh() {
      const { res, data } = await muatRekod(pin);
      if (!aktif) return;
      if (!res.ok) {
        if (res.status === 401) {
          sessionStorage.removeItem(PIN_KEY);
          setDibuka(false);
          setRows(null);
          jumlahTerakhir.current = null;
          setRalat(data.ralat || "PIN tidak sah.");
        }
        return;
      }
      sessionStorage.setItem(PIN_KEY, pin);
      const list = data.rows || [];
      setRows(list);
      jumlahTerakhir.current = list.length;
    }

    async function semak() {
      try {
        if (jumlahTerakhir.current === null) {
          await muatPenuh();
          return;
        }
        const res = await fetch("/api/statistik", { cache: "no-store" });
        if (!res.ok || !aktif) return;
        const data = (await res.json()) as Statistik;
        if (data.jumlah === jumlahTerakhir.current) return;
        await muatPenuh();
      } catch {
        /* keep the last list if the network blips */
      }
    }

    void semak();
    const id = window.setInterval(semak, 2000);
    return () => {
      aktif = false;
      window.clearInterval(id);
    };
  }, [dibuka, pin]);

  async function buka(event: FormEvent) {
    event.preventDefault();
    setMemuat(true);
    setRalat("");
    try {
      const { res, data } = await muatRekod(pin);
      if (!res.ok) {
        setRalat(data.ralat || "PIN tidak sah.");
        setRows(null);
        setDibuka(false);
        return;
      }
      sessionStorage.setItem(PIN_KEY, pin);
      setRows(data.rows || []);
      jumlahTerakhir.current = (data.rows || []).length;
      setDibuka(true);
    } catch {
      setRalat("Tidak dapat memuatkan rekod.");
    } finally {
      setMemuat(false);
    }
  }

  async function padamSemua() {
    const sah = window.confirm(
      "Padam semua rekod ujian? Tindakan ini tidak boleh dibatalkan.",
    );
    if (!sah) return;

    setMemadam(true);
    setRalat("");
    try {
      const res = await fetch(`/api/rekod?pin=${encodeURIComponent(pin)}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { ralat?: string };
      if (!res.ok) {
        setRalat(data.ralat || "Tidak dapat memadam rekod.");
        return;
      }
      setRows([]);
      jumlahTerakhir.current = 0;
    } catch {
      setRalat("Tidak dapat memadam rekod.");
    } finally {
      setMemadam(false);
    }
  }

  const ringkasan = useMemo(() => {
    if (!rows) return "Memuatkan…";
    return `${rows.length} rekod`;
  }, [rows]);

  return (
    <div className={`admin${dibuka ? "" : " admin-masuk"}`}>
      <h1>Rekod kehadiran</h1>
      <p className="admin-sub">SPM · Sektor Pembangunan Murid · staf gerai sahaja</p>

      {!dibuka ? (
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
            <p className="live-badge">
              <span className="live-dot" />
              Langsung
            </p>
            <p>{ringkasan}</p>
            <div className="admin-tindakan">
              <a href={`/api/export?pin=${encodeURIComponent(pin)}`}>
                Muat turun CSV
              </a>
              <button
                type="button"
                className="btn-padam"
                onClick={() => void padamSemua()}
                disabled={memadam || !rows || rows.length === 0}
              >
                {memadam ? "Memadam…" : "Padam semua rekod"}
              </button>
            </div>
          </div>
          {ralat ? <p className="ralat">{ralat}</p> : null}
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
                {rows === null ? (
                  <tr>
                    <td colSpan={3}>Memuatkan…</td>
                  </tr>
                ) : rows.length === 0 ? (
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
