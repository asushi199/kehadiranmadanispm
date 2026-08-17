"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { TajukKarnival } from "@/components/TajukKarnival";
import {
  KATEGORI,
  KATEGORI_LABEL,
  KATEGORI_WARNA,
  emptyKategoriCount,
} from "@/lib/kategori";
import type { Statistik } from "@/lib/types";

function padDigits(n: number) {
  const text = String(Math.max(0, n));
  return text.length >= 3 ? text : text.padStart(3, "0");
}

function Scoreboard({ value }: { value: number }) {
  const digits = padDigits(value).split("");

  return (
    <div className="scoreboard" aria-live="polite" aria-atomic="true">
      {digits.map((digit, i) => (
        <span className="digit-window" key={`${i}-${digits.length}`}>
          <span className="digit-face" key={`${digit}-${value}`}>
            {digit}
          </span>
        </span>
      ))}
    </div>
  );
}

function jamMalaysia() {
  return new Intl.DateTimeFormat("ms-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

export function PapanTV({ daftarUrl }: { daftarUrl: string }) {
  const [statistik, setStatistik] = useState<Statistik>({
    jumlah: 0,
    kategori: emptyKategoriCount(),
  });
  const [jam, setJam] = useState("");
  const [gagal, setGagal] = useState(false);

  useEffect(() => {
    let aktif = true;

    async function muat() {
      try {
        const res = await fetch("/api/statistik", { cache: "no-store" });
        if (!res.ok) throw new Error("gagal");
        const data = (await res.json()) as Statistik;
        if (aktif) {
          setStatistik(data);
          setGagal(false);
        }
      } catch {
        if (aktif) setGagal(true);
      }
    }

    muat();
    const statistikId = window.setInterval(muat, 2000);
    return () => {
      aktif = false;
      window.clearInterval(statistikId);
    };
  }, []);

  useEffect(() => {
    const tik = () => setJam(jamMalaysia());
    tik();
    const id = window.setInterval(tik, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let lock: WakeLockSentinel | undefined;
    const minta = async () => {
      try {
        lock = await navigator.wakeLock?.request("screen");
      } catch {
        /* TV browser may ignore wake lock */
      }
    };
    minta();
    const onVis = () => {
      if (document.visibilityState === "visible") minta();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      void lock?.release();
    };
  }, []);

  const maksimum = Math.max(statistik.jumlah, 1);

  return (
    <div className="papan">
      <header className="papan-kepala">
        <div className="papan-util">
          <p className="live-badge">
            <span className="live-dot" />
            Langsung
          </p>
          <p className="papan-jam">{jam}</p>
        </div>
        <TajukKarnival />
      </header>

      <div className="papan-isi">
        <aside className="papan-qr">
          <div className="qr-bingkai">
            {daftarUrl ? (
              <QRCodeSVG
                value={daftarUrl}
                size={168}
                bgColor="#f7fbff"
                fgColor="#030b24"
                level="M"
              />
            ) : (
              <div className="qr-placeholder" />
            )}
          </div>
          <p>Imbas untuk daftar</p>
        </aside>

        <section className="papan-jumlah">
          <Scoreboard value={statistik.jumlah} />
          <p className="jumlah-label">Jumlah kehadiran</p>
          {gagal ? (
            <p className="papan-status">Menunggu rangkaian…</p>
          ) : statistik.jumlah === 0 ? (
            <p className="papan-status">Menunggu tetamu pertama</p>
          ) : null}
        </section>
      </div>

      <ul className="lorong">
        {KATEGORI.map((item) => {
          const n = statistik.kategori[item];
          const peratus = Math.round((n / maksimum) * 100);
          return (
            <li key={item} className="lorong-item">
              <div className="lorong-meta">
                <span className="lorong-nama">{KATEGORI_LABEL[item]}</span>
                <span className="lorong-nombor">
                  {n}
                  <small>
                    {statistik.jumlah === 0
                      ? "0%"
                      : `${Math.round((n / statistik.jumlah) * 100)}%`}
                  </small>
                </span>
              </div>
              <div className="lorong-trek">
                <span
                  className="lorong-isi"
                  style={{
                    width: `${peratus}%`,
                    background: KATEGORI_WARNA[item],
                    boxShadow: `0 0 16px ${KATEGORI_WARNA[item]}`,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
