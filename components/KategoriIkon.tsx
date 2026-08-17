import type { Kategori } from "@/lib/kategori";

export function KategoriIkon({
  jenis,
  className = "kategori-ikon",
}: {
  jenis: Kategori;
  className?: string;
}) {
  if (jenis === "murid") {
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
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
    );
  }

  if (jenis === "ibu_bapa") {
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
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
    );
  }

  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="10" r="3.4" fill="currentColor" />
      <path d="M7 25c.6-5.2 4-8 9-8s8.4 2.8 9 8" fill="currentColor" />
    </svg>
  );
}
