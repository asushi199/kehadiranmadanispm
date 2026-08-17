export const KATEGORI = ["murid", "guru", "ibu_bapa", "orang_awam"] as const;

export type Kategori = (typeof KATEGORI)[number];

export const KATEGORI_LABEL: Record<Kategori, string> = {
  murid: "Murid",
  guru: "Guru",
  ibu_bapa: "Ibu Bapa",
  orang_awam: "Orang Awam",
};

export const KATEGORI_WARNA: Record<Kategori, string> = {
  murid: "#00D4FF",
  guru: "#F5C518",
  ibu_bapa: "#FF8A3D",
  orang_awam: "#B57BFF",
};

export function isKategori(value: string): value is Kategori {
  return (KATEGORI as readonly string[]).includes(value);
}

export function emptyKategoriCount(): Record<Kategori, number> {
  return {
    murid: 0,
    guru: 0,
    ibu_bapa: 0,
    orang_awam: 0,
  };
}
