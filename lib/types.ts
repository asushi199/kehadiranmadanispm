import type { Kategori } from "./kategori";

export type RekodKehadiran = {
  id: string;
  nama: string;
  kategori: Kategori;
  created_at: string;
};

export type Statistik = {
  jumlah: number;
  kategori: Record<Kategori, number>;
};
