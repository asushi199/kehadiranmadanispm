import type { Metadata } from "next";
import { AdminPanel } from "@/components/AdminPanel";
import { LatarKarnival } from "@/components/LatarKarnival";
import { TajukKarnival } from "@/components/TajukKarnival";

export const metadata: Metadata = {
  title: "Rekod staf SPM",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <LatarKarnival className="daftar">
      <div className="daftar-isi daftar-isi-lebar">
        <TajukKarnival padat />
        <AdminPanel />
      </div>
    </LatarKarnival>
  );
}
