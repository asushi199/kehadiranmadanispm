"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  KATEGORI,
  KATEGORI_LABEL,
  KATEGORI_WARNA,
  type Kategori,
} from "@/lib/kategori";

const ikon: Record<Kategori, ReactNode> = {
  murid: (
    <svg viewBox="0 0 32 32" className="kategori-ikon" aria-hidden="true">
      <path
        d="M4 13.5 16 8l12 5.5L16 19 4 13.5Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M8 15.2v5.3c0 2.2 3.6 4 8 4s8-1.8 8-4v-5.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),
  guru: (
    <svg viewBox="0 0 32 32" className="kategori-ikon" aria-hidden="true">
      <rect x="5" y="7" width="22" height="15" rx="1.5" fill="currentColor" />
      <rect x="7" y="9" width="18" height="11" fill="#061433" />
      <path d="M12 26h8M16 22v4" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  ibu_bapa: (
    <svg viewBox="0 0 32 32" className="kategori-ikon" aria-hidden="true">
      <circle cx="12" cy="10" r="3.2" fill="currentColor" />
      <circle cx="21" cy="11" r="2.8" fill="currentColor" />
      <path
        d="M5.5 24c.4-4 3.2-6.2 6.5-6.2S18.1 20 18.5 24"
        fill="currentColor"
      />
      <path
        d="M16.8 24c.3-3.2 2.6-5 5.2-5s4.9 1.8 5.2 5"
        fill="currentColor"
      />
    </svg>
  ),
  orang_awam: (
    <svg viewBox="0 0 32 32" className="kategori-ikon" aria-hidden="true">
      <circle cx="16" cy="10" r="3.4" fill="currentColor" />
      <path d="M7 25c.6-5.2 4-8 9-8s8.4 2.8 9 8" fill="currentColor" />
    </svg>
  ),
};

export function DaftarForm() {
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState<Kategori | "">("");
  const [honeypot, setHoneypot] = useState("");
  const [ralat, setRalat] = useState("");
  const [menghantar, setMenghantar] = useState(false);
  const [berjaya, setBerjaya] = useState<string | null>(null);
  const namaRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!berjaya) {
      namaRef.current?.focus();
    }
  }, [berjaya]);

  async function hantar(event: FormEvent) {
    event.preventDefault();
    setRalat("");

    if (nama.trim().length < 2) {
      setRalat("Sila isi nama.");
      namaRef.current?.focus();
      return;
    }
    if (!kategori) {
      setRalat("Sila pilih kategori.");
      return;
    }

    setMenghantar(true);
    try {
      const res = await fetch("/api/kehadiran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama,
          kategori,
          laman_web: honeypot,
        }),
      });
      const data = (await res.json()) as { ralat?: string };
      if (!res.ok) {
        setRalat(data.ralat || "Tidak dapat menghantar. Sila cuba lagi.");
        return;
      }
      setBerjaya(nama.trim());
      setNama("");
      setKategori("");
      window.setTimeout(() => setBerjaya(null), 2800);
    } catch {
      setRalat("Rangkaian terputus. Sila cuba lagi.");
    } finally {
      setMenghantar(false);
    }
  }

  if (berjaya) {
    return (
      <div className="gerai-kad kejayaan" role="status">
        <p className="kejayaan-label">Kehadiran direkodkan</p>
        <p className="kejayaan-nama">{berjaya}</p>
        <p className="kejayaan-nota">Terima kasih. Selamat datang ke gerai SPM.</p>
      </div>
    );
  }

  return (
    <form className="gerai-kad" onSubmit={hantar}>
      <p className="daftar-spm">Daftar Kehadiran</p>
      <label className="medan-label" htmlFor="nama">
        Nama
      </label>
      <input
        id="nama"
        ref={namaRef}
        className="medan-nama"
        value={nama}
        onChange={(event) => setNama(event.target.value)}
        autoComplete="name"
        autoCapitalize="words"
        enterKeyHint="done"
        maxLength={80}
        placeholder="Contoh: Ahmad bin Ali"
        name="nama"
      />

      <p className="medan-label" id="kategori-label">
        Siapakah anda?
      </p>
      <div
        className="kategori-grid"
        role="radiogroup"
        aria-labelledby="kategori-label"
      >
        {KATEGORI.map((item) => {
          const dipilih = kategori === item;
          return (
            <button
              key={item}
              type="button"
              role="radio"
              aria-checked={dipilih}
              className={`kategori-btn${dipilih ? " dipilih" : ""}`}
              style={{ "--aksen": KATEGORI_WARNA[item] } as CSSProperties}
              onClick={() => setKategori(item)}
            >
              {ikon[item]}
              <span>{KATEGORI_LABEL[item]}</span>
            </button>
          );
        })}
      </div>

      <div className="perangkap" aria-hidden="true">
        <label>
          Laman web
          <input
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </label>
      </div>

      {ralat ? (
        <p className="ralat" role="alert">
          {ralat}
        </p>
      ) : null}

      <button className="btn-hantar" type="submit" disabled={menghantar}>
        {menghantar ? "Merekodkan…" : "Hantar kehadiran"}
      </button>
    </form>
  );
}
