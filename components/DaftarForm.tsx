"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import {
  KATEGORI,
  KATEGORI_LABEL,
  KATEGORI_WARNA,
  type Kategori,
} from "@/lib/kategori";
import { KategoriIkon } from "@/components/KategoriIkon";

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
              <KategoriIkon jenis={item} />
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
