import type { Metadata } from "next";
import { headers } from "next/headers";
import { LatarKarnival } from "@/components/LatarKarnival";
import { PapanTV } from "@/components/PapanTV";
import { PapanTindakan } from "@/components/PapanTindakan";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Papan Kehadiran SPM | Karnival Pendidikan Madani",
};

async function daftarUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}/`;
}

export default async function PapanPage() {
  const url = await daftarUrl();

  return (
    <LatarKarnival className="papan-page">
      <PapanTV daftarUrl={url} />
      <PapanTindakan />
    </LatarKarnival>
  );
}
