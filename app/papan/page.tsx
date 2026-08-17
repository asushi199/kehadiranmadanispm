import type { Metadata } from "next";
import { LatarKarnival } from "@/components/LatarKarnival";
import { PapanTV } from "@/components/PapanTV";
import { PapanTindakan } from "@/components/PapanTindakan";

export const metadata: Metadata = {
  title: "Papan Kehadiran SPM | Karnival Pendidikan Madani",
};

const DAFTAR_RASMI = "https://kehadiranmadanispm.vercel.app/";

function daftarUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_DAFTAR_URL?.trim();
  if (!fromEnv) return DAFTAR_RASMI;
  return fromEnv.endsWith("/") ? fromEnv : `${fromEnv}/`;
}

export default function PapanPage() {
  return (
    <LatarKarnival className="papan-page">
      <PapanTV daftarUrl={daftarUrl()} />
      <PapanTindakan />
    </LatarKarnival>
  );
}
